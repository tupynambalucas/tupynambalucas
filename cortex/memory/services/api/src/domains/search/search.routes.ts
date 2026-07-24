import type { FastifyInstance, FastifyPluginAsync } from 'fastify';

const searchRoutes: FastifyPluginAsync = (server: FastifyInstance): Promise<void> => {
  const controller = server.searchController;

  server.post('/search', controller.search);
  server.post('/entities', controller.storeEntity);

  return Promise.resolve();
};

export default searchRoutes;
