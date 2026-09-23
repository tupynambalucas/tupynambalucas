import type { FastifyInstance, FastifyPluginAsync } from 'fastify';

const graphRoutes: FastifyPluginAsync = (server: FastifyInstance): Promise<void> => {
  const controller = server.graphController;

  server.get('/graph', controller.fetchGraphData);

  return Promise.resolve();
};

export default graphRoutes;
