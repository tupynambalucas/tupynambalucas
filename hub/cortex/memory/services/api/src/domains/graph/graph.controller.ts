import type { FastifyRequest, FastifyReply } from 'fastify';
import type { GraphService } from './graph.service.js';

export class GraphController {
  constructor(private readonly graphService: GraphService) {}

  public fetchGraphData = async (
    req: FastifyRequest<{ Querystring: { entityId?: string; maxDepth?: string } }>,
    reply: FastifyReply,
  ): Promise<void> => {
    const { entityId, maxDepth } = req.query;
    const depth = maxDepth ? parseInt(maxDepth, 10) : 2;
    const graphData = await this.graphService.fetchGraphData(entityId, depth);
    void reply.send(graphData);
  };
}
