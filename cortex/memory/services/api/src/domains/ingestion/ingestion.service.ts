import * as fs from 'fs';
import * as path from 'path';
import crypto from 'crypto';
import { EntityModel } from '../../models/entity.model.js';
import { RelationModel } from '../../models/relation.model.js';

export class IngestionService {
  private docsDir: string;

  constructor() {
    this.docsDir = this.resolveDocsDir();
  }

  private resolveDocsDir(): string {
    if (process.env.DOCS_DIR && fs.existsSync(process.env.DOCS_DIR)) {
      return process.env.DOCS_DIR;
    }

    const candidates = [
      path.resolve(process.cwd(), 'docs'),
      path.resolve(process.cwd(), '../docs'),
      path.resolve(process.cwd(), '../../docs'),
      path.resolve(process.cwd(), '../../../docs'),
      path.resolve(process.cwd(), '../../../../docs'),
      path.resolve(process.cwd(), '../../../../../docs'),
    ];

    for (const cand of candidates) {
      if (fs.existsSync(cand)) {
        return cand;
      }
    }

    return process.env.DOCS_DIR ?? path.resolve(process.cwd(), 'docs');
  }

  async resetDatabase(): Promise<void> {
    await EntityModel.deleteMany({});
    await RelationModel.deleteMany({});
  }

  async syncDocs(): Promise<{
    processedFiles: number;
    chunksCreated: number;
    edgesCreated: number;
  }> {
    let processedFiles = 0;
    let chunksCreated = 0;
    let edgesCreated = 0;

    if (!fs.existsSync(this.docsDir)) {
      console.warn(`Docs directory not found at ${this.docsDir}`);
      return { processedFiles, chunksCreated, edgesCreated };
    }

    // Perform fresh graph initialization
    await this.resetDatabase();

    const knownWorkspaces = [
      'cortex',
      'docs',
      'hub',
      'platform',
      'renderer',
      'shared',
      'studio',
      'tools',
      'handbook',
    ];
    const workspaceNodeMap = new Map<string, string>();
    const docFileNodeMap = new Map<string, string>();

    // 1. Create Workspace Root Nodes
    for (const ws of knownWorkspaces) {
      const wsNode = await EntityModel.create({
        name: `workspace:${ws}`,
        type: 'workspace',
        content: `Workspace bounded context: ${ws}`,
        embedding: this.generateEmbedding(ws),
        metadata: {
          workspace: ws,
          updatedAt: new Date().toISOString(),
        },
      });
      workspaceNodeMap.set(ws, wsNode._id.toString());
    }

    const files = this.findMdxFiles(this.docsDir);

    // 2. Process File Nodes & Chunks
    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf-8');
        const hash = crypto.createHash('sha256').update(content).digest('hex');
        const relPath = path.relative(this.docsDir, file).replace(/\\/g, '/');

        // Determine workspace
        let wsName = 'docs';
        if (relPath.startsWith('handbook/')) {
          wsName = 'handbook';
        } else if (relPath.startsWith('workspaces/')) {
          const parts = relPath.split('/');
          if (parts[1] && knownWorkspaces.includes(parts[1])) {
            wsName = parts[1];
          }
        }

        const wsId = workspaceNodeMap.get(wsName) ?? workspaceNodeMap.get('docs')!;

        // Create Doc File Node
        const docFileNode = await EntityModel.create({
          name: relPath,
          type: 'doc_file',
          content: content.slice(0, 500),
          embedding: this.generateEmbedding(relPath),
          metadata: {
            filePath: relPath,
            workspace: wsName,
            contentHash: hash,
            updatedAt: new Date().toISOString(),
          },
        });

        const docFileId = docFileNode._id.toString();
        docFileNodeMap.set(relPath, docFileId);

        // Edge: Doc File -> Workspace (BELONGS_TO)
        await RelationModel.create({
          fromId: docFileId,
          toId: wsId,
          relationType: 'BELONGS_TO',
          weight: 1.0,
        });
        edgesCreated++;

        // Process Chunks
        const chunks = this.chunkMarkdown(content);
        processedFiles++;

        for (const [idx, chunk] of chunks.entries()) {
          const embedding = this.generateEmbedding(chunk.text);
          const chunkNode = await EntityModel.create({
            name: `${path.basename(file)}#${chunk.heading || idx + 1}`,
            type: 'doc_chunk',
            content: chunk.text,
            embedding,
            metadata: {
              filePath: relPath,
              workspace: wsName,
              section: chunk.heading,
              contentHash: hash,
              updatedAt: new Date().toISOString(),
            },
          });

          const chunkId = chunkNode._id.toString();
          chunksCreated++;

          // Edge: Chunk -> Doc File (BELONGS_TO)
          await RelationModel.create({
            fromId: chunkId,
            toId: docFileId,
            relationType: 'BELONGS_TO',
            weight: 1.0,
          });
          edgesCreated++;
        }
      } catch (err) {
        console.error(`Failed to ingest file ${file}:`, err);
      }
    }

    // 3. Cross-Link File & Workspace References (REFERENCES & DEPENDS_ON Edges)
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf-8');
      const relPath = path.relative(this.docsDir, file).replace(/\\/g, '/');
      const docFileId = docFileNodeMap.get(relPath);

      if (!docFileId) continue;

      // Extract markdown links & workspace cross references
      for (const targetWs of knownWorkspaces) {
        if (content.toLowerCase().includes(targetWs) && workspaceNodeMap.has(targetWs)) {
          const targetWsId = workspaceNodeMap.get(targetWs)!;

          // Check if link already exists
          const existing = await RelationModel.findOne({
            fromId: docFileId,
            toId: targetWsId,
            relationType: 'REFERENCES',
          });

          if (!existing) {
            await RelationModel.create({
              fromId: docFileId,
              toId: targetWsId,
              relationType: 'REFERENCES',
              weight: 0.8,
            });
            edgesCreated++;
          }
        }
      }
    }

    return { processedFiles, chunksCreated, edgesCreated };
  }

  private findMdxFiles(dir: string): string[] {
    let results: string[] = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        results = results.concat(this.findMdxFiles(fullPath));
      } else if (entry.isFile() && (entry.name.endsWith('.mdx') || entry.name.endsWith('.md'))) {
        results.push(fullPath);
      }
    }

    return results;
  }

  private chunkMarkdown(text: string): Array<{ heading: string; text: string }> {
    const lines = text.split('\n');
    const chunks: Array<{ heading: string; text: string }> = [];
    let currentHeading = 'Overview';
    let currentLines: string[] = [];

    for (const line of lines) {
      if (line.startsWith('#')) {
        if (currentLines.length > 0) {
          chunks.push({ heading: currentHeading, text: currentLines.join('\n').trim() });
          currentLines = [];
        }
        currentHeading = line.replace(/^#+\s*/, '').trim();
      } else {
        currentLines.push(line);
      }
    }

    if (currentLines.length > 0) {
      chunks.push({ heading: currentHeading, text: currentLines.join('\n').trim() });
    }

    return chunks.filter((c) => c.text.length > 0);
  }

  private generateEmbedding(text: string): number[] {
    const dim = 128;
    const vector = new Array<number>(dim).fill(0);
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      const idx = (charCode + i) % dim;
      vector[idx] = ((vector[idx] ?? 0) + charCode / 255) / 2;
    }
    return vector;
  }
}
