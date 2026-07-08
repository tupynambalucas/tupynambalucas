import { create } from 'zustand';
import { productApi } from './product.api';
import { getErrorMessage } from '@/utils/errorHelper';
import { useCycleStore } from '@/domains/cycle';
import type { IProduct, ProductResponse } from '@tupynambalucas-hub/core';

interface ProductState {
  products: ProductResponse[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  actions: {
    fetchProducts: (filters?: {
      search?: string;
      category?: string;
      type?: string;
      availableOnly?: boolean;
    }) => Promise<void>;
    updateProduct: (id: string, data: Partial<IProduct>) => Promise<boolean>;
  };
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  isLoading: false,
  isSubmitting: false,
  error: null,
  actions: {
    fetchProducts: async (filters) => {
      set({ isLoading: true, error: null });
      try {
        const data = await productApi.list(filters);
        set({ products: data, isLoading: false });
      } catch (err: unknown) {
        const message = getErrorMessage(err);
        set({ products: [], error: message, isLoading: false });
      }
    },

    updateProduct: async (id, data) => {
      set({ isSubmitting: true, error: null });
      try {
        await productApi.update(id, data);

        // Atualizar lista local
        set((state) => ({
          products: state.products.map((p) => (p._id === id ? { ...p, ...data } : p)),
          isSubmitting: false,
        }));

        // Sincronizar com o ciclo ativo se necessário
        void useCycleStore.getState().actions.fetchActiveCycle({ silent: true });

        return true;
      } catch (err: unknown) {
        const message = getErrorMessage(err);
        set({ error: message, isSubmitting: false });
        return false;
      }
    },
  },
}));
