import axios from 'axios';
import type { GraphDataDTO, SearchResultDTO } from '@tupynambalucas-cortex-memory/core';

const API_BASE =
  (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3006/api/memory';

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
};
