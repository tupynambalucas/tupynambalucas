import type { FastifyRequest, FastifyReply } from 'fastify';
import type { ChatService } from './chat.service.js';

export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  public storeMessage = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
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
      void reply.status(400).send({ error: 'Missing required fields' });
      return;
    }

    const session = await this.chatService.storeMessage({
      conversationId: body.conversationId,
      agentId: body.agentId,
      role: body.role,
      content: body.content,
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
