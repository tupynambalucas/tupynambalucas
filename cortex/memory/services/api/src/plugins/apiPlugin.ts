import type { FastifyInstance, FastifyPluginAsync } from 'fastify';
import chatRoutes from '../domains/chat/chat.routes.js';
import graphRoutes from '../domains/graph/graph.routes.js';
import ingestionRoutes from '../domains/ingestion/ingestion.routes.js';
import searchRoutes from '../domains/search/search.routes.js';

const apiPlugin: FastifyPluginAsync = async function (server: FastifyInstance): Promise<void> {
  await server.register(chatRoutes);
  await server.register(graphRoutes);
  await server.register(ingestionRoutes);
  await server.register(searchRoutes);
};

export default apiPlugin;
