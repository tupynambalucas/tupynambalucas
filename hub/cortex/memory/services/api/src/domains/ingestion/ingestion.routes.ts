import type { FastifyInstance, FastifyPluginAsync } from 'fastify';

const ingestionRoutes: FastifyPluginAsync = (server: FastifyInstance): Promise<void> => {
  const controller = server.ingestionController;

  server.post('/ingest/docs', controller.syncDocs);

  return Promise.resolve();
};

export default ingestionRoutes;
