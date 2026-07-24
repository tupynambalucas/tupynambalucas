import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { ChatService } from './chat.service.js';
import { ChatRepository } from './chat.repository.js';

export function chatController(fastify: FastifyInstance): Promise<void> {
  const repository = new ChatRepository();
  const service = new ChatService(repository);

  fastify.post('/chat', async (req: FastifyRequest, reply: FastifyReply) => {
    const body = req.body as {
      conversationId?: string;
      agentId?: string;
      role?: 'user' | 'assistant' | 'system';
      content?: string;
    };

    if (
      body.conversationId == null ||
      body.agentId == null ||
      body.role == null ||
      body.content == null
    ) {
      return reply.status(400).send({ error: 'Missing required fields' });
    }

    const session = await service.storeMessage({
      conversationId: body.conversationId,
      agentId: body.agentId,
      role: body.role,
      content: body.content,
    });
    return reply.status(201).send(session);
  });

  fastify.get('/chat/:conversationId', async (req: FastifyRequest, reply: FastifyReply) => {
    const { conversationId } = req.params as { conversationId: string };
    const session = await service.fetchSession(conversationId);
    if (!session) {
      return reply.status(404).send({ error: 'Session not found' });
    }
    return reply.send(session);
  });

  return Promise.resolve();
}
