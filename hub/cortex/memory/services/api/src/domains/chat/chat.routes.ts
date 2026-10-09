import type { FastifyInstance, FastifyPluginAsync } from 'fastify';

const chatRoutes: FastifyPluginAsync = (server: FastifyInstance): Promise<void> => {
  const controller = server.chatController;

  server.post('/chat', controller.storeMessage);
  server.get('/chat/:conversationId', controller.fetchSession);

  return Promise.resolve();
};

export default chatRoutes;
