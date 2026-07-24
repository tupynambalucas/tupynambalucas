import type { ChatRepository } from './chat.repository.js';
import type { ChatHistorySession, StoreChatMessageDTO } from '@tupynambalucas-cortex-memory/core';

export class ChatService {
  constructor(private readonly repository: ChatRepository) {}

  async storeMessage(dto: StoreChatMessageDTO): Promise<ChatHistorySession> {
    return this.repository.addMessage(dto);
  }

  async fetchSession(conversationId: string): Promise<ChatHistorySession | null> {
    return this.repository.getSession(conversationId);
  }
}
