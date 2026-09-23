import type { Model, Mongoose } from 'mongoose';
import type { ChatController } from '../domains/chat/chat.controller.js';
import type { GraphController } from '../domains/graph/graph.controller.js';
import type { IngestionController } from '../domains/ingestion/ingestion.controller.js';
import type { SearchController } from '../domains/search/search.controller.js';
import type { IngestionService } from '../domains/ingestion/ingestion.service.js';
import type { ChatHistoryDocument } from '../models/chat-history.model.js';
import type { EntityDocument } from '../models/entity.model.js';
import type { RelationDocument } from '../models/relation.model.js';

export interface EnvConfig {
  PORT: number;
  HOST: string;
  NODE_ENV: string;
  MONGODB_URI: string;
}

declare module 'fastify' {
  interface FastifyInstance {
    config: EnvConfig;
    mongoose: Mongoose;
    models: {
      ChatHistory: Model<ChatHistoryDocument>;
      Entity: Model<EntityDocument>;
      Relation: Model<RelationDocument>;
    };
    chatController: ChatController;
    graphController: GraphController;
    ingestionController: IngestionController;
    searchController: SearchController;
    ingestionService: IngestionService;
  }
}
