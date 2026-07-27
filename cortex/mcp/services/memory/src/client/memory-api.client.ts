import { config } from '../config.js';

export class MemoryApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = config.MEMORY_API_URL;
  }

  async searchKnowledge(query: string, limit = 5, minScore = 0.7) {
    const res = await fetch(`${this.baseUrl}/api/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, limit, minScore }),
    });

    if (!res.ok) {
      throw new Error(`Memory API search failed with status ${res.status}`);
    }

    return res.json();
  }

  async storeEpisodic(sessionId: string, role: 'user' | 'assistant' | 'system', content: string) {
    const res = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, role, content }),
    });

    if (!res.ok) {
      throw new Error(`Memory API chat store failed with status ${res.status}`);
    }

    return res.json();
  }

  async queryGraph(entityId: string, maxDepth = 2) {
    const res = await fetch(
      `${this.baseUrl}/api/graph?entityId=${encodeURIComponent(entityId)}&maxDepth=${maxDepth}`,
    );

    if (!res.ok) {
      throw new Error(`Memory API graph query failed with status ${res.status}`);
    }

    return res.json();
  }

  async ingestDocument(title: string, content: string, source?: string) {
    const res = await fetch(`${this.baseUrl}/api/ingest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, source }),
    });

    if (!res.ok) {
      throw new Error(`Memory API ingest failed with status ${res.status}`);
    }

    return res.json();
  }
}

export const memoryApiClient = new MemoryApiClient();
