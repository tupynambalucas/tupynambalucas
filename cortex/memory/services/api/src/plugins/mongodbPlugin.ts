import fp from 'fastify-plugin';
import mongoose from 'mongoose';
import type { FastifyInstance } from 'fastify';

const mongodbPlugin = async (fastify: FastifyInstance): Promise<void> => {
  const mongoUri = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/cortex_memory';

  try {
    await mongoose.connect(mongoUri);
    fastify.log.info(`Connected to MongoDB memory database at ${mongoUri}`);

    fastify.addHook('onClose', async () => {
      await mongoose.disconnect();
      fastify.log.info('Disconnected from MongoDB memory database');
    });
  } catch (err) {
    fastify.log.error(err, 'Failed to connect to MongoDB memory database');
    process.exit(1);
  }
};

export default fp(mongodbPlugin);
