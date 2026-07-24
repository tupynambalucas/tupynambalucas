import { create } from 'zustand';
import type { GraphDataDTO, SearchResultDTO, GraphNode } from '@tupynambalucas-cortex-memory/core';
import { memoryApi, type ChatMessage } from './memory.api';

interface MemoryState {
  graphData: GraphDataDTO | null;
  searchResults: SearchResultDTO[];
  selectedNode: GraphNode | null;
  chatMessages: ChatMessage[];
  conversationId: string;
  activeTab: 'graph' | 'vector' | 'chat';
  isLoadingGraph: boolean;
  isSearching: boolean;
  isSyncingDocs: boolean;
  isSendingChat: boolean;
  apiHealthy: boolean | null;
  syncStatus: string | null;

  setActiveTab: (tab: 'graph' | 'vector' | 'chat') => void;
  setSelectedNode: (node: GraphNode | null) => void;
  fetchGraph: () => Promise<void>;
  searchVector: (query: string) => Promise<void>;
  triggerDocsSync: () => Promise<void>;
  sendChatMessage: (content: string) => Promise<void>;
  checkHealth: () => Promise<void>;
}

export const useMemoryStore = create<MemoryState>((set, get) => ({
  graphData: null,
  searchResults: [],
  selectedNode: null,
  chatMessages: [
    {
      role: 'assistant',
      content:
        'Welcome to Cortex Episodic Memory Assistant! Ask me any question about docs/ or project architecture.',
      timestamp: new Date().toISOString(),
    },
  ],
  conversationId: 'demo-session-1',
  activeTab: 'graph',
  isLoadingGraph: false,
  isSearching: false,
  isSyncingDocs: false,
  isSendingChat: false,
  apiHealthy: null,
  syncStatus: null,

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedNode: (node) => set({ selectedNode: node }),

  checkHealth: async () => {
    try {
      await memoryApi.getHealthz();
      set({ apiHealthy: true });
    } catch {
      set({ apiHealthy: false });
    }
  },

  fetchGraph: async () => {
    set({ isLoadingGraph: true });
    try {
      const data = await memoryApi.getGraphData();
      set({ graphData: data, isLoadingGraph: false, apiHealthy: true });
    } catch (err) {
      console.error('Failed to fetch graph:', err);
      set({ isLoadingGraph: false, apiHealthy: false });
    }
  },

  searchVector: async (query: string) => {
    if (!query.trim()) return;
    set({ isSearching: true });
    try {
      const results = await memoryApi.searchVector(query);
      set({ searchResults: results, isSearching: false, apiHealthy: true });
    } catch (err) {
      console.error('Failed to search vector:', err);
      set({ isSearching: false, apiHealthy: false });
    }
  },

  triggerDocsSync: async () => {
    set({ isSyncingDocs: true, syncStatus: 'Syncing docs...' });
    try {
      const res = await memoryApi.syncDocs();
      set({
        isSyncingDocs: false,
        syncStatus: `Processed ${res.processedFiles} files, ${res.chunksCreated} chunks created`,
        apiHealthy: true,
      });
      // Refresh graph after sync
      await get().fetchGraph();
    } catch (err) {
      console.error('Failed to sync docs:', err);
      set({ isSyncingDocs: false, syncStatus: 'Sync failed', apiHealthy: false });
    }
  },

  sendChatMessage: async (content: string) => {
    if (!content.trim()) return;

    const userMsg: ChatMessage = {
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    set((state) => ({
      chatMessages: [...state.chatMessages, userMsg],
      isSendingChat: true,
    }));

    try {
      const { conversationId } = get();
      await memoryApi.sendChatMessage(conversationId, 'developer-ui', 'user', content);

      // Perform RAG vector search to get contextual response snippet
      const ragResults = await memoryApi.searchVector(content, 3);
      let responseText = 'Memory message recorded into MongoDB episodic chat collection.';

      if (ragResults.length > 0) {
        responseText = `Ingested Context Match (${(ragResults[0].score * 100).toFixed(1)}% match):\n${ragResults[0].entity.content.slice(0, 300)}...`;
      }

      await memoryApi.sendChatMessage(conversationId, 'cortex-agent', 'assistant', responseText);

      const assistantMsg: ChatMessage = {
        role: 'assistant',
        content: responseText,
        timestamp: new Date().toISOString(),
      };

      set((state) => ({
        chatMessages: [...state.chatMessages, assistantMsg],
        isSendingChat: false,
        apiHealthy: true,
      }));
    } catch (err) {
      console.error('Failed to send chat message:', err);
      set({ isSendingChat: false, apiHealthy: false });
    }
  },
}));
