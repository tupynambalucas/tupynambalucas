import type { ChatController } from '../domains/chat/chat.controller.js';
import type { GraphController } from '../domains/graph/graph.controller.js';
import type { IngestionController } from '../domains/ingestion/ingestion.controller.js';
import type { SearchController } from '../domains/search/search.controller.js';
import type { IngestionService } from '../domains/ingestion/ingestion.service.js';

declare module 'fastify' {
  interface FastifyInstance {
    chatController: ChatController;
    graphController: GraphController;
    ingestionController: IngestionController;
    searchController: SearchController;
    ingestionService: IngestionService;
  }
}
