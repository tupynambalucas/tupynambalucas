import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { GraphService } from './graph.service.js';
import { GraphRepository } from './graph.repository.js';

export function graphController(fastify: FastifyInstance): Promise<void> {
  const repository = new GraphRepository();
  const service = new GraphService(repository);

  fastify.get('/graph', async (_req: FastifyRequest, reply: FastifyReply) => {
    const graphData = await service.fetchGraphData();
    return reply.send(graphData);
  });

  return Promise.resolve();
}
