import { Redis } from 'ioredis';

const getRedisConfig = () => ({
  host: process.env.REDIS_HOST ?? 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
  maxRetriesPerRequest: null,
});

export const connection = new Redis(getRedisConfig());
