import fp from 'fastify-plugin';
import fastifyEnv from '@fastify/env';
import type { FastifyInstance } from 'fastify';

const schema = {
  type: 'object',
  required: ['MONGODB_URI'],
  properties: {
    PORT: { type: 'number', default: 3006 },
    HOST: { type: 'string', default: '0.0.0.0' },
    NODE_ENV: { type: 'string', default: 'development' },
    MONGODB_URI: { type: 'string' },
  },
};

const envConfig = async (server: FastifyInstance): Promise<void> => {
  await server.register(fastifyEnv, {
    confKey: 'config',
    schema,
    dotenv: false,
  });
};

export default fp(envConfig);
