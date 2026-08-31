import axios from 'axios';
import type { GraphDataDTO, SearchResultDTO } from '@tupynambalucas-cortex/memory-core';

const envApiUrl = import.meta.env.VITE_API_URL as string | undefined;
const API_BASE = envApiUrl && envApiUrl.trim().length > 0 ? envApiUrl.trim() : '/api/memory';

export interface ChatMessage {
  id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}

export interface ChatSessionResponse {
  conversationId: string;
  agentId: string;
  messages: ChatMessage[];
  updatedAt: string;
}

export const memoryApi = {
  async getGraphData(): Promise<GraphDataDTO> {
    const res = await axios.get<GraphDataDTO>(`${API_BASE}/graph`);
    return res.data;
  },

  async searchVector(query: string, limit = 10): Promise<SearchResultDTO[]> {
    const res = await axios.post<{ results: SearchResultDTO[] }>(`${API_BASE}/search`, {
      query,
      limit,
    });
    return res.data.results;
  },

  async syncDocs(): Promise<{ processedFiles: number; chunksCreated: number }> {
    const res = await axios.post<{ processedFiles: number; chunksCreated: number }>(
      `${API_BASE}/ingest/docs`,
    );
    return res.data;
  },

  async sendChatMessage(
    conversationId: string,
    agentId: string,
    role: 'user' | 'assistant' | 'system',
    content: string,
  ): Promise<ChatSessionResponse> {
    const res = await axios.post<ChatSessionResponse>(`${API_BASE}/chat`, {
      conversationId,
      agentId,
      role,
      content,
    });
    return res.data;
  },

  async getChatSession(conversationId: string): Promise<ChatSessionResponse> {
    const res = await axios.get<ChatSessionResponse>(`${API_BASE}/chat/${conversationId}`);
    return res.data;
  },

  async getHealthz(): Promise<{ status: string; timestamp: string }> {
    const res = await axios.get<{ status: string; timestamp: string }>('/healthz');
    return res.data;
  },
};
