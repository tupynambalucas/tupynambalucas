import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

const utilsPlugin: FastifyPluginAsync = (server) => {
  server.decorate(
    'convertTimeToSeconds',
    (type: 'minutes' | 'hours' | 'days', time: number): Promise<number | undefined> => {
      switch (type) {
        case 'minutes':
          return Promise.resolve(time * 60);
        case 'hours':
          return Promise.resolve(time * 3600);
        case 'days':
          return Promise.resolve(time * 24 * 60 * 60);
        default:
          return Promise.resolve(undefined);
      }
    },
  );
  return Promise.resolve();
};

export default fp(utilsPlugin);
