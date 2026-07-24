import { create } from 'zustand';
import type { GraphDataDTO, SearchResultDTO } from '@tupynambalucas-cortex-memory/core';
import { memoryApi } from './memory.api';

interface MemoryState {
  graphData: GraphDataDTO | null;
  searchResults: SearchResultDTO[];
  isLoadingGraph: boolean;
  isSearching: boolean;
  isSyncingDocs: boolean;
  syncStatus: string | null;

  fetchGraph: () => Promise<void>;
  searchVector: (query: string) => Promise<void>;
  triggerDocsSync: () => Promise<void>;
}

export const useMemoryStore = create<MemoryState>((set) => ({
  graphData: null,
  searchResults: [],
  isLoadingGraph: false,
  isSearching: false,
  isSyncingDocs: false,
  syncStatus: null,

  fetchGraph: async () => {
    set({ isLoadingGraph: true });
    try {
      const data = await memoryApi.getGraphData();
      set({ graphData: data, isLoadingGraph: false });
    } catch (err) {
      console.error('Failed to fetch graph:', err);
      set({ isLoadingGraph: false });
    }
  },

  searchVector: async (query: string) => {
    if (!query.trim()) return;
    set({ isSearching: true });
    try {
      const results = await memoryApi.searchVector(query);
      set({ searchResults: results, isSearching: false });
    } catch (err) {
      console.error('Failed to search vector:', err);
      set({ isSearching: false });
    }
  },

  triggerDocsSync: async () => {
    set({ isSyncingDocs: true, syncStatus: 'Syncing docs...' });
    try {
      const res = await memoryApi.syncDocs();
      set({
        isSyncingDocs: false,
        syncStatus: `Processed ${res.processedFiles} files, ${res.chunksCreated} chunks created`,
      });
    } catch (err) {
      console.error('Failed to sync docs:', err);
      set({ isSyncingDocs: false, syncStatus: 'Sync failed' });
    }
  },
}));
