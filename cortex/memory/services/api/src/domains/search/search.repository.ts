import { EntityModel } from '../../models/entity.model.js';
import type { MemoryEntity, SearchResultDTO } from '@tupynambalucas-cortex-memory/core';

export class SearchRepository {
  async insertEntity(entity: MemoryEntity): Promise<MemoryEntity> {
    const doc = await EntityModel.create(entity);
    return {
      id: doc._id.toString(),
      name: doc.name,
      type: doc.type,
      content: doc.content,
      embedding: doc.embedding,
      metadata: doc.metadata,
    };
  }

  async vectorSearch(
    queryVector: number[],
    type?: string,
    workspace?: string,
    limit = 10,
  ): Promise<SearchResultDTO[]> {
    const matchFilter: Record<string, unknown> = {};
    if (type) matchFilter.type = type;
    if (workspace) matchFilter['metadata.workspace'] = workspace;

    const docs = await EntityModel.find(matchFilter).limit(limit).exec();

    // Compute cosine similarity fallback if native MongoDB Vector Search index is not yet built
    return docs
      .map((doc) => {
        const score = this.cosineSimilarity(queryVector, doc.embedding);
        return {
          entity: {
            id: doc._id.toString(),
            name: doc.name,
            type: doc.type,
            content: doc.content,
            embedding: doc.embedding,
            metadata: doc.metadata,
          },
          score,
        };
      })
      .sort((a, b) => b.score - a.score);
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (!a.length || !b.length || a.length !== b.length) return 0;
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < a.length; i++) {
      const valA = a[i] ?? 0;
      const valB = b[i] ?? 0;
      dotProduct += valA * valB;
      normA += valA * valA;
      normB += valB * valB;
    }
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
}
