import type { FastifyInstance, FastifyPluginAsync } from 'fastify';

const apiPlugin: FastifyPluginAsync = async function (server: FastifyInstance): Promise<void> {
  // Routes with /memory prefix (e.g., /api/memory/chat)
  server.post('/memory/chat', server.chatController.storeMessage);
  server.get('/memory/chat/:conversationId', server.chatController.fetchSession);
  server.get('/memory/graph', server.graphController.fetchGraphData);
  server.post('/memory/ingest/docs', server.ingestionController.syncDocs);
  server.post('/memory/search', server.searchController.search);
  server.post('/memory/entities', server.searchController.storeEntity);

  // Routes with direct root prefix (e.g., /api/chat) for full backwards compatibility
  server.post('/chat', server.chatController.storeMessage);
  server.get('/chat/:conversationId', server.chatController.fetchSession);
  server.get('/graph', server.graphController.fetchGraphData);
  server.post('/ingest/docs', server.ingestionController.syncDocs);
  server.post('/search', server.searchController.search);
  server.post('/entities', server.searchController.storeEntity);
};

export default apiPlugin;
