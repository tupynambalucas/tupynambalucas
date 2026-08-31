import type { FastifyRequest, FastifyReply } from 'fastify';
import type { ChatService } from './chat.service.js';

export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  public storeMessage = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const body = req.body as {
      conversationId?: string;
      sessionId?: string;
      agentId?: string;
      role?: 'user' | 'assistant' | 'system';
      content?: string;
    };

    const conversationId = body.conversationId ?? body.sessionId;
    const agentId = body.agentId ?? 'cortex-agent';
    const role = body.role;
    const content = body.content;

    if (conversationId == null || role == null || content == null) {
      void reply
        .status(400)
        .send({ error: 'Missing required fields: conversationId (or sessionId), role, content' });
      return;
    }

    const session = await this.chatService.storeMessage({
      conversationId,
      agentId,
      role,
      content,
    });
    void reply.status(201).send(session);
  };

  public fetchSession = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const { conversationId } = req.params as { conversationId: string };
    const session = await this.chatService.fetchSession(conversationId);
    if (!session) {
      void reply.status(404).send({ error: 'Session not found' });
      return;
    }
    void reply.send(session);
  };
}
