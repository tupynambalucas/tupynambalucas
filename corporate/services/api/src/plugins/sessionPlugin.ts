import type { FastifyPluginAsync, FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import fastifySession from '@fastify/session';
import fastifyJwt from '@fastify/jwt';
import bcrypt from 'bcrypt';
import type { UserPayload } from '../types/fastify.js';

const SessionPlugin: FastifyPluginAsync = async (server: FastifyInstance) => {
  server.decorate('genHash', async (password: string) => {
    try {
      return await bcrypt.hash(password, 10);
    } catch (error) {
      server.log.error(error);
      throw error;
    }
  });

  server.decorate('compareHash', async (password: string, hashedPass: string) => {
    try {
      return await bcrypt.compare(password, hashedPass);
    } catch (error) {
      server.log.error(error);
      return false;
    }
  });

  await server.register(fastifySession, {
    cookieName: server.config.USER_SESSION_KEY,
    secret: server.config.SESSION_SECRET,
    cookie: {
      secure: server.config.NODE_ENV === 'production',
      httpOnly: true,
      path: '/api',
      maxAge: 86400000,
    },
    saveUninitialized: false,
  });

  await server.register(fastifyJwt, {
    secret: server.config.JWT_SECRET.trim(), // Mitigate GHSA-mvf2-f6gm-w987: Always trim secrets
    verify: {
      algorithms: ['HS256'], // Mitigate GHSA-mvf2-f6gm-w987: Force symmetric HS256 to prevent confusion with public keys
    },
    sign: {
      algorithm: 'HS256',
    },
  });

  server.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const token = request.session.token;

      if (!token) {
        return reply.status(401).send({ message: 'Não autenticado' });
      }

      const decoded = server.jwt.verify<UserPayload>(token, {
        algorithms: ['HS256'], // Redundant but safer: ensure HS256 is enforced
      });
      request.user = decoded;
    } catch {
      return reply.status(401).send({ message: 'Sessão inválida ou expirada' });
    }
  });

  server.decorate('verifyAdmin', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      if (request.user.role !== 'admin') {
        return reply.status(403).send({ message: 'Acesso negado' });
      }
    } catch {
      return reply.status(401).send({ message: 'Erro de verificação' });
    }
  });
};

export default fp(SessionPlugin);
