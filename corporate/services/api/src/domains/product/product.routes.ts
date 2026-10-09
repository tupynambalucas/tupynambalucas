import type { FastifyPluginAsync } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { listProductsSchema, updateProductSchema } from './product.schema.js';

const productRoutes: FastifyPluginAsync = (server) => {
  const app = server.withTypeProvider<ZodTypeProvider>();
  const controller = server.productController;

  app.get(
    '/admin/products',
    {
      schema: listProductsSchema,
      preHandler: [server.authenticate, server.verifyAdmin],
    },
    controller.listHandler,
  );

  app.put(
    '/admin/products/:id',
    {
      schema: updateProductSchema,
      preHandler: [server.authenticate, server.verifyAdmin],
    },
    controller.updateHandler,
  );

  return Promise.resolve();
};

export default productRoutes;
