import cors from '@fastify/cors';
import fp from 'fastify-plugin';
import type { FastifyInstance, FastifyPluginAsync } from 'fastify';

import envConfig from '../config/envConfig.js';
import mongoosePlugin from './mongoosePlugin.js';
import apiPlugin from './apiPlugin.js';

import { ChatRepository } from '../domains/chat/chat.repository.js';
import { ChatService } from '../domains/chat/chat.service.js';
import { ChatController } from '../domains/chat/chat.controller.js';

import { GraphRepository } from '../domains/graph/graph.repository.js';
import { GraphService } from '../domains/graph/graph.service.js';
import { GraphController } from '../domains/graph/graph.controller.js';

import { IngestionService } from '../domains/ingestion/ingestion.service.js';
import { IngestionController } from '../domains/ingestion/ingestion.controller.js';

import { SearchRepository } from '../domains/search/search.repository.js';
import { SearchService } from '../domains/search/search.service.js';
import { SearchController } from '../domains/search/search.controller.js';

const registryPlugin: FastifyPluginAsync = async function (server: FastifyInstance): Promise<void> {
  await server.register(envConfig);

  await server.register(cors, {
    origin: '*',
  });

  await server.register(mongoosePlugin);

  // Instantiate repositories
  const chatRepository = new ChatRepository();
  const graphRepository = new GraphRepository();
  const searchRepository = new SearchRepository();

  // Instantiate services
  const chatService = new ChatService(chatRepository);
  const graphService = new GraphService(graphRepository);
  const ingestionService = new IngestionService();
  const searchService = new SearchService(searchRepository);

  // Instantiate controllers
  const chatController = new ChatController(chatService);
  const graphController = new GraphController(graphService);
  const ingestionController = new IngestionController(ingestionService);
  const searchController = new SearchController(searchService);

  // Decorate fastify instance
  server.decorate('chatController', chatController);
  server.decorate('graphController', graphController);
  server.decorate('ingestionController', ingestionController);
  server.decorate('searchController', searchController);
  server.decorate('ingestionService', ingestionService);

  // Healthcheck endpoint
  server.get('/healthz', () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  // Register API routes plugin under prefix /api/memory
  await server.register(apiPlugin, { prefix: '/api/memory' });
};

export default fp(registryPlugin);
