import { api } from '@/lib/axios';
import type { IProduct, ProductResponse } from '@tupynambalucas-hub/core';

export const productApi = {
  list: async (filters?: {
    search?: string;
    category?: string;
    type?: string;
    availableOnly?: boolean;
  }) => {
    const { data } = await api.get<ProductResponse[]>('/admin/products', { params: filters });
    return data;
  },

  update: async (id: string, product: Partial<IProduct>) => {
    const { data } = await api.put<ProductResponse>(`/admin/products/${id}`, product);
    return data;
  },
};
