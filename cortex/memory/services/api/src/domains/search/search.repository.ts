import { EntityModel } from '../../models/entity.model.js';
import type { MemoryEntity, SearchResultDTO } from '@monorepo/cortex-memory-core';

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

  async hybridSearch(
    textQuery: string,
    queryVector: number[],
    type?: string,
    workspace?: string,
    limit = 10,
    filter?: Record<string, unknown>,
  ): Promise<SearchResultDTO[]> {
    const matchFilter: Record<string, unknown> = {};
    if (type) matchFilter.type = type;
    if (workspace) matchFilter['metadata.workspace'] = workspace;

    // Dynamic Meta-Filtering
    if (filter) {
      for (const [k, v] of Object.entries(filter)) {
        matchFilter[`metadata.${k}`] = v;
      }
    }

    // 1. Vector Search (Cosine Similarity on all matching documents)
    const docs = await EntityModel.find(matchFilter).exec();

    const vectorRanked = docs
      .map((doc) => ({ doc, score: this.cosineSimilarity(queryVector, doc.embedding) }))
      .sort((a, b) => b.score - a.score);

    // 2. Text Search (Keyword exact match) if text index exists
    let textRanked: Array<{
      doc: MemoryEntity & { _id: { toString(): string }; get: (key: string) => unknown };
      score: number;
    }> = [];
    try {
      const textDocs = await EntityModel.find(
        { ...matchFilter, $text: { $search: textQuery } },
        { score: { $meta: 'textScore' } },
      )
        .sort({ score: { $meta: 'textScore' } })
        .limit(limit)
        .exec();

      textRanked = textDocs.map((doc) => ({
        doc: doc,
        score: (doc.get('score') as number | undefined) ?? 1,
      }));
    } catch {
      // Ignore text search if index is not built yet
      console.warn('Text search failed or index missing, skipping text RRF fusion');
    }

    // 3. Reciprocal Rank Fusion (RRF)
    const rrfConstant = 60;
    const rrfScores = new Map<
      string,
      { doc: MemoryEntity & { _id: { toString(): string } }; rrf: number }
    >();

    vectorRanked.forEach(({ doc }, idx) => {
      const id = doc._id.toString();
      const rank = idx + 1;
      rrfScores.set(id, {
        doc: doc,
        rrf: 1 / (rrfConstant + rank),
      });
    });

    textRanked.forEach(({ doc }, idx) => {
      const id = doc._id.toString();
      const rank = idx + 1;
      const existing = rrfScores.get(id);
      if (existing) {
        existing.rrf += 1 / (rrfConstant + rank);
      } else {
        rrfScores.set(id, { doc, rrf: 1 / (rrfConstant + rank) });
      }
    });

    const finalRanked = Array.from(rrfScores.values())
      .sort((a, b) => b.rrf - a.rrf)
      .slice(0, limit);

    return finalRanked.map(({ doc, rrf }) => ({
      entity: {
        id: doc._id.toString(),
        name: doc.name,
        type: doc.type,
        content: doc.content,
        embedding: doc.embedding,
        metadata: doc.metadata,
      },
      score: rrf,
    }));
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
