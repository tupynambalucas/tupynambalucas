import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { SearchService } from './search.service.js';
import { SearchRepository } from './search.repository.js';
import { SearchQueryDTOSchema, MemoryEntitySchema } from '@tupynambalucas-cortex-memory/core';

export function searchController(fastify: FastifyInstance): Promise<void> {
  const repository = new SearchRepository();
  const service = new SearchService(repository);

  fastify.post('/search', async (req: FastifyRequest, reply: FastifyReply) => {
    const parseResult = SearchQueryDTOSchema.safeParse(req.body);
    if (!parseResult.success) {
      return reply.status(400).send({ error: parseResult.error.format() });
    }

    const results = await service.search(parseResult.data);
    return reply.send({ results });
  });

  fastify.post('/entities', async (req: FastifyRequest, reply: FastifyReply) => {
    const parseResult = MemoryEntitySchema.safeParse(req.body);
    if (!parseResult.success) {
      return reply.status(400).send({ error: parseResult.error.format() });
    }

    const created = await service.storeEntity(parseResult.data);
    return reply.status(201).send(created);
  });

  return Promise.resolve();
}
