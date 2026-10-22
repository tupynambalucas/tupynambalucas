import type { FastifyInstance, FastifyPluginAsync } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { registerSchema, loginSchema } from './auth.schema.js';

const authRoutes: FastifyPluginAsync = (server: FastifyInstance): Promise<void> => {
  const app = server.withTypeProvider<ZodTypeProvider>();
  const controller = server.authController;

  app.post(
    '/register',
    {
      schema: registerSchema,
      config: {
        rateLimit: {
          max: 5,
          timeWindow: '1 minute',
        },
      },
    },
    controller.registerHandler,
  );

  app.post(
    '/login',
    {
      schema: loginSchema,
      config: {
        rateLimit: {
          max: 5,
          timeWindow: '1 minute',
        },
      },
    },
    controller.loginHandler,
  );
  app.post('/logout', controller.logoutHandler);

  app.get('/verify', { preHandler: [server.authenticate] }, controller.verifyHandler);

  return Promise.resolve();
};

export default authRoutes;
