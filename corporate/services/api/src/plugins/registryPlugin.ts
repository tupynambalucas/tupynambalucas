import cors from '@fastify/cors';
import fp from 'fastify-plugin';
import type { FastifyInstance, FastifyPluginAsync, FastifyPluginCallback } from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import fastifyCookie from '@fastify/cookie';
import fastifyMetricsPlugin from 'fastify-metrics';

import envConfig from '../config/envConfig.js';
import utils from '../config/utilsConfig.js';
import secureSession from './sessionPlugin.js';
import MongoosePlugin from './mongoosePlugin.js';
import SecurityPlugin from './securityPlugin.js';
import ApiPlugin from './apiPlugin.js';
import sentryPlugin from './sentryPlugin.js';
import errorHandlerPlugin from './errorHandlerPlugin.js';
import queuePlugin from './queuePlugin.js';
import SeedPlugin from './seedPlugin.js';

import { AuthRepository } from '../domains/auth/auth.repository.js';
import { AuthService } from '../domains/auth/auth.service.js';
import { AuthController } from '../domains/auth/auth.controller.js';

import { ProductRepository } from '../domains/product/product.repository.js';
import { ProductService } from '../domains/product/product.service.js';
import { ProductController } from '../domains/product/product.controller.js';

import { CycleRepository } from '../domains/cycle/cycle.repository.js';
import { CycleService } from '../domains/cycle/cycle.service.js';
import { CycleController } from '../domains/cycle/cycle.controller.js';

const serverAutoRegistry: FastifyPluginAsync = async function (server: FastifyInstance) {
  server.setValidatorCompiler(validatorCompiler);
  server.setSerializerCompiler(serializerCompiler);

  await server.register(utils);
  await server.register(envConfig);
  await server.register(sentryPlugin);

  const metricsPlugin = fastifyMetricsPlugin as unknown as FastifyPluginCallback<{
    endpoint: string;
  }>;
  await server.register(metricsPlugin, {
    endpoint: '/metrics',
  });

  await server.register(errorHandlerPlugin);

  await server.register(fastifyCookie, {
    secret: server.config.SESSION_SECRET,
  });

  await server.register(MongoosePlugin);
  await server.register(SeedPlugin);
  await server.register(secureSession);
  await server.register(SecurityPlugin);

  const { User, Product, Cycle } = server.models;

  const authRepo = new AuthRepository(User);
  const authService = new AuthService(authRepo, server);
  const authController = new AuthController(authService);

  const productRepo = new ProductRepository(Product);
  const productService = new ProductService(productRepo);
  const productController = new ProductController(productService);

  const cycleRepo = new CycleRepository(Cycle);
  const cycleService = new CycleService(cycleRepo, productService, server.mongoose);
  const cycleController = new CycleController(cycleService);

  server.decorate('authController', authController);
  server.decorate('productController', productController);
  server.decorate('cycleController', cycleController);

  server.get('/health', async () => {
    return { status: 'ok' };
  });

  await server.register(ApiPlugin, { prefix: '/api' });
  await server.register(queuePlugin, { cycleService });

  const allowedOrigins = ['http://localhost:5173', 'http://localhost:80'];

  await server.register(cors, {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'CSRF-Token'],
    exposedHeaders: ['CSRF-Token'],
  });
};

export default fp(serverAutoRegistry);
