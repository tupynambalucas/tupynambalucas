import type { FastifyRequest, FastifyReply } from 'fastify';
import type { IngestionService } from './ingestion.service.js';

export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  public syncDocs = async (_req: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const result = await this.ingestionService.syncDocs();
    void reply.send({
      message: 'Docs ingestion synchronization complete',
      ...result,
    });
  };
}
