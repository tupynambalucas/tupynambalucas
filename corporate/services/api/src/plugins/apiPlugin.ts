import type { FastifyPluginAsync, FastifyInstance } from 'fastify';
import authRoutes from '../domains/auth/auth.routes.js';
import cycleRoutes from '../domains/cycle/cycle.routes.js';
import productRoutes from '../domains/product/product.routes.js';

const apiPlugin: FastifyPluginAsync = async function (server: FastifyInstance) {
  await server.register(authRoutes, { prefix: 'auth' });
  await server.register(cycleRoutes);
  await server.register(productRoutes); // Nova rota registrada
};

export default apiPlugin;
