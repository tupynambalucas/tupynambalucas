import Fastify from 'fastify';
import type { FastifyInstance } from 'fastify';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = process.env.NODE_ENV !== 'production';

const targets = [];

if (isDev) {
  targets.push({
    target: '@fastify/one-line-logger',
    options: {
      customColors: {
        info: 'blue',
        warn: 'yellow',
        error: 'red',
        debug: 'green',
      },
      colorize: true,
    },
  });

  targets.push({
    target: 'pino-roll',
    options: {
      file: path.join(__dirname, '../../logs/app.log'),
      frequency: 'daily',
      mkdir: true,
    },
  });
}

const loggerConfig = isDev
  ? {
      level: 'info',
      transport: {
        targets: targets,
      },
    }
  : {
      level: 'info',
      formatters: {
        level: (label: string) => {
          return { level: label };
        },
      },
    };

const server: FastifyInstance = Fastify({
  logger: loggerConfig,
});

export default server;
