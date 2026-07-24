import * as fs from 'fs';
import * as path from 'path';
import crypto from 'crypto';
import { EntityModel } from '../../models/entity.model.js';

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

  async syncDocs(): Promise<{ processedFiles: number; chunksCreated: number }> {
    let processedFiles = 0;
    let chunksCreated = 0;

    if (!fs.existsSync(this.docsDir)) {
      console.warn(`Docs directory not found at ${this.docsDir}`);
      return { processedFiles, chunksCreated };
    }

    const files = this.findMdxFiles(this.docsDir);

    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf-8');
        const hash = crypto.createHash('sha256').update(content).digest('hex');
        const relPath = path.relative(this.docsDir, file).replace(/\\/g, '/');

        // Check if file already exists with same hash
        const existing = await EntityModel.findOne({
          'metadata.filePath': relPath,
          'metadata.contentHash': hash,
        });

        if (existing) continue;

        // Delete previous chunks of this file
        await EntityModel.deleteMany({ 'metadata.filePath': relPath });

        // Split into chunks by section headers
        const chunks = this.chunkMarkdown(content);
        processedFiles++;

        for (const [idx, chunk] of chunks.entries()) {
          const embedding = this.generateEmbedding(chunk.text);
          await EntityModel.create({
            name: `${path.basename(file)}#${chunk.heading || idx + 1}`,
            type: 'doc_chunk',
            content: chunk.text,
            embedding,
            metadata: {
              filePath: relPath,
              workspace: 'docs',
              section: chunk.heading,
              contentHash: hash,
              updatedAt: new Date().toISOString(),
            },
          });
          chunksCreated++;
        }
      } catch (err) {
        console.error(`Failed to ingest file ${file}:`, err);
      }
    }

    return { processedFiles, chunksCreated };
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
