import type { SearchRepository } from './search.repository.js';
import type { SearchQueryDTO, SearchResultDTO, MemoryEntity } from '@monorepo/cortex-memory-core';

export class SearchService {
  constructor(private readonly repository: SearchRepository) {}

  async storeEntity(entity: MemoryEntity): Promise<MemoryEntity> {
    return this.repository.insertEntity(entity);
  }

  async search(dto: SearchQueryDTO): Promise<SearchResultDTO[]> {
    const queryVector = this.generateEmbedding(dto.query);
    return this.repository.hybridSearch(
      dto.query,
      queryVector,
      dto.type,
      dto.workspace,
      dto.limit,
      dto.filter,
    );
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
