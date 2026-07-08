import fp from 'fastify-plugin';
import fastifyEnv from '@fastify/env';
import type { FastifyInstance } from 'fastify';

const schema = {
  type: 'object',
  required: [
    'SERVER_PORT',
    'SERVER_HOST',
    'MONGO_URI',
    'REDIS_HOST',
    'REDIS_PORT',
    'JWT_SECRET',
    'SESSION_SECRET',
    'ADMIN_USER_SEED',
    'ADMIN_EMAIL_SEED',
    'ADMIN_PASS_SEED',
    'USER_SESSION_KEY',
    'NODE_ENV',
    'TURNSTILE_SECRET_KEY',
  ],
  properties: {
    SERVER_PORT: { type: 'number' },
    SERVER_HOST: { type: 'string' },
    NODE_ENV: { type: 'string' },
    MONGO_URI: { type: 'string' },

    REDIS_HOST: { type: 'string' },
    REDIS_PORT: { type: 'number', default: 6379 },

    ADMIN_USER_SEED: { type: 'string' },
    ADMIN_EMAIL_SEED: { type: 'string' },
    ADMIN_PASS_SEED: { type: 'string' },

    JWT_SECRET: { type: 'string' },
    SESSION_SECRET: { type: 'string' },
    USER_SESSION_KEY: { type: 'string' },
    SENTRY_DSN: { type: 'string' },
    TURNSTILE_SECRET_KEY: { type: 'string' },
  },
};

const envConfig = async (server: FastifyInstance) => {
  await server.register(fastifyEnv, {
    confKey: 'config',
    schema: schema,
    dotenv: false,
  });
};

export default fp(envConfig);
