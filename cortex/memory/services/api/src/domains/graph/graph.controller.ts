import type { FastifyRequest, FastifyReply } from 'fastify';
import type { GraphService } from './graph.service.js';

export class GraphController {
  constructor(private readonly graphService: GraphService) {}

  public fetchGraphData = async (_req: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const graphData = await this.graphService.fetchGraphData();
    void reply.send(graphData);
  };
}
