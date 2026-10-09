import type { GraphRepository } from './graph.repository.js';
import type { GraphDataDTO } from '@monorepo/cortex-memory-core';

export class GraphService {
  constructor(private readonly repository: GraphRepository) {}

  async fetchGraphData(entityId?: string, maxDepth?: number): Promise<GraphDataDTO> {
    return this.repository.getGraphData(entityId, maxDepth);
  }
}
