import Fastify from 'fastify';
import cors from '@fastify/cors';
import mongodbPlugin from './plugins/mongodb.plugin.js';
import { searchController } from './domains/search/search.controller.js';
import { chatController } from './domains/chat/chat.controller.js';
import { graphController } from './domains/graph/graph.controller.js';
import { ingestionController } from './domains/ingestion/ingestion.controller.js';

const fastify = Fastify({
  logger: true,
});

async function main() {
  await fastify.register(cors, {
    origin: '*',
  });

  await fastify.register(mongodbPlugin);

  // Register domain controllers
  await fastify.register(searchController, { prefix: '/api/memory' });
  await fastify.register(chatController, { prefix: '/api/memory' });
  await fastify.register(graphController, { prefix: '/api/memory' });
  await fastify.register(ingestionController, { prefix: '/api/memory' });

  // Healthcheck endpoint
  fastify.get('/healthz', async () => {
    return Promise.resolve({ status: 'ok', timestamp: new Date().toISOString() });
  });

  const port = Number(process.env.PORT ?? 3006);
  const host = process.env.HOST ?? '0.0.0.0';

  try {
    await fastify.listen({ port, host });
    fastify.log.info(`Memory API Service running at http://${host}:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

void main();
