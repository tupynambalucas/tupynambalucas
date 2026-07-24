import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { IngestionService } from './ingestion.service.js';

export function ingestionController(fastify: FastifyInstance): Promise<void> {
  const service = new IngestionService();

  fastify.post('/ingest/docs', async (_req: FastifyRequest, reply: FastifyReply) => {
    const result = await service.syncDocs();
    return reply.send({
      message: 'Docs ingestion synchronization complete',
      ...result,
    });
  });

  return Promise.resolve();
}
