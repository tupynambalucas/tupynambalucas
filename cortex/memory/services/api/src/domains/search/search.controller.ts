import type { FastifyRequest, FastifyReply } from 'fastify';
import type { SearchService } from './search.service.js';
import { SearchQueryDTOSchema, MemoryEntitySchema } from '@tupynambalucas-cortex-memory/core';

export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  public search = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const parseResult = SearchQueryDTOSchema.safeParse(req.body);
    if (!parseResult.success) {
      void reply.status(400).send({ error: parseResult.error.format() });
      return;
    }

    const results = await this.searchService.search(parseResult.data);
    void reply.send({ results });
  };

  public storeEntity = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const parseResult = MemoryEntitySchema.safeParse(req.body);
    if (!parseResult.success) {
      void reply.status(400).send({ error: parseResult.error.format() });
      return;
    }

    const created = await this.searchService.storeEntity(parseResult.data);
    void reply.status(201).send(created);
  };
}
