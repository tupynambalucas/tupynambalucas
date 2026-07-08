import { api } from '@/lib/axios';
import type { ICycle } from '@tupynambalucas-hub/core';

export const cycleApi = {
  getActive: async () => {
    const response = await api.get<ICycle | null>('/cycles/active');
    return response.status === 204 ? null : response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<ICycle>(`/cycles/${id}`);
    return response.data;
  },
};
