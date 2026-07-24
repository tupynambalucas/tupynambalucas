import { ChatHistoryModel } from '../../models/chat-history.model.js';
import type { ChatHistorySession, StoreChatMessageDTO } from '@tupynambalucas-cortex-memory/core';

export class ChatRepository {
  async addMessage(dto: StoreChatMessageDTO): Promise<ChatHistorySession> {
    const timestamp = new Date().toISOString();
    const session = await ChatHistoryModel.findOneAndUpdate(
      { conversationId: dto.conversationId },
      {
        $setOnInsert: { agentId: dto.agentId },
        $push: { messages: { role: dto.role, content: dto.content, timestamp } },
        $set: { updatedAt: timestamp },
      },
      { upsert: true, new: true },
    );

    return {
      id: session._id.toString(),
      conversationId: session.conversationId,
      agentId: session.agentId,
      messages: session.messages.map((m) => ({
        role: m.role,
        content: m.content,
        timestamp: m.timestamp,
      })),
      updatedAt: session.updatedAt,
    };
  }

  async getSession(conversationId: string): Promise<ChatHistorySession | null> {
    const session = await ChatHistoryModel.findOne({ conversationId });
    if (!session) return null;

    return {
      id: session._id.toString(),
      conversationId: session.conversationId,
      agentId: session.agentId,
      messages: session.messages.map((m) => ({
        role: m.role,
        content: m.content,
        timestamp: m.timestamp,
      })),
      updatedAt: session.updatedAt,
    };
  }
}
