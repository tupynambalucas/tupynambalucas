import fp from 'fastify-plugin';
import csrf from '@fastify/csrf-protection';
import rateLimit from '@fastify/rate-limit';
import type { FastifyInstance, FastifyPluginAsync } from 'fastify';

const securityPlugin: FastifyPluginAsync = async function (server: FastifyInstance) {
  await server.register(csrf, {
    cookieOpts: {
      signed: true,
      httpOnly: true,
      path: '/api',
      secure: server.config.NODE_ENV === 'production',
      sameSite: 'strict',
    },
  });

  await server.register(rateLimit, {
    global: false, // Apply specifically to auth routes
    max: 100,
    timeWindow: '1 minute',
  });

  server.get('/api/csrf-token', async (_req, reply) => {
    const token = reply.generateCsrf();
    return { token };
  });
};

export default fp(securityPlugin);
