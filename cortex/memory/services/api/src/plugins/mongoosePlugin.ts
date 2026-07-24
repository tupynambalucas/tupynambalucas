import fp from 'fastify-plugin';
import type { FastifyPluginAsync, FastifyInstance } from 'fastify';
import mongoose from 'mongoose';
import { ChatHistoryModel } from '../models/chat-history.model.js';
import { EntityModel } from '../models/entity.model.js';
import { RelationModel } from '../models/relation.model.js';

/**
 * Resolves the canonical connection URI, enforcing the `cortex_memory` database name.
 */
function resolveMongoUri(rawUri: string): string {
  const TARGET_DB = 'cortex_memory';

  try {
    const url = new URL(rawUri);
    url.pathname = `/${TARGET_DB}`;
    return url.toString();
  } catch {
    return rawUri;
  }
}

const mongoosePlugin: FastifyPluginAsync = async (server: FastifyInstance) => {
  try {
    const mongoUri = resolveMongoUri(server.config.MONGODB_URI);

    server.log.info(`🔌 [MongoosePlugin] Connecting to database "cortex_memory"...`);

    const connection = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    server.log.info('✅ [MongoosePlugin] Mongoose connected successfully.');

    server.decorate('mongoose', connection);

    const models = {
      ChatHistory: ChatHistoryModel,
      Entity: EntityModel,
      Relation: RelationModel,
    };

    server.decorate('models', models);
    server.log.info('📚 [MongoosePlugin] Mongoose models decorated.');

    server.addHook('onClose', async (instance) => {
      await instance.mongoose.connection.close();
      instance.log.info('[MongoosePlugin] Mongoose connection closed.');
    });
  } catch (err) {
    server.log.error(err, '❌ [MongoosePlugin] Failed to connect to MongoDB');
    process.exit(1);
  }
};

export default fp(mongoosePlugin, { name: 'mongoose-plugin' });
