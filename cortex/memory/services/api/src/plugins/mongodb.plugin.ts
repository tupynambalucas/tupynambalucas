import fp from 'fastify-plugin';
import mongoose from 'mongoose';

export default fp(async (fastify) => {
  const mongoUri = process.env.MONGODB_URI ?? 'mongodb://mongodb-db:27017/cortex_memory';

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
});
