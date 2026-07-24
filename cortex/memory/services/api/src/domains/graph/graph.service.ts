import type { GraphRepository } from './graph.repository.js';
import type { GraphDataDTO } from '@tupynambalucas-cortex-memory/core';

export class GraphService {
  constructor(private readonly repository: GraphRepository) {}

  async fetchGraphData(): Promise<GraphDataDTO> {
    return this.repository.getGraphData();
  }
}
