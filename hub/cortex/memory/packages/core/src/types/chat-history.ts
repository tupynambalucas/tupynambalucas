export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface ChatHistorySession {
  id?: string;
  conversationId: string;
  agentId: string;
  messages: ChatMessage[];
  updatedAt: string;
}

export interface StoreChatMessageDTO {
  conversationId: string;
  agentId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
}
