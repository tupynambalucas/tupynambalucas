import fp from 'fastify-plugin';
import type { FastifyPluginAsync, FastifyInstance, FastifyError } from 'fastify';
import { ZodError } from 'zod';
import * as Sentry from '@sentry/node';
import { AppError } from '../utils/AppError.js';

const errorHandlerPlugin: FastifyPluginAsync = (server: FastifyInstance) => {
  server.setErrorHandler((error, request, reply) => {
    if (process.env.NODE_ENV !== 'production') {
      request.log.error(error);
    }

    if (error instanceof ZodError) {
      return reply.status(400).send({
        statusCode: 400,
        code: 'VALIDATION_ERROR',
        issues: error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        statusCode: error.statusCode,
        code: error.code,
      });
    }

    const fastifyError = error as Partial<FastifyError>;
    const statusCode = fastifyError.statusCode ?? 500;
    if (statusCode === 401) {
      return reply.status(401).send({
        statusCode: 401,
        code: 'NOT_AUTHENTICATED',
      });
    }

    if (statusCode < 500) {
      return reply.status(statusCode).send({
        statusCode,
        code: fastifyError.code ?? 'UNKNOWN_CLIENT_ERROR',
      });
    }

    if (process.env.NODE_ENV === 'production') {
      Sentry.captureException(error);
    }

    return reply.status(500).send({
      statusCode: 500,
      code: 'INTERNAL_SERVER_ERROR',
      message: process.env.NODE_ENV !== 'production' ? fastifyError.message : undefined,
    });
  });

  return Promise.resolve();
};

export default fp(errorHandlerPlugin);
