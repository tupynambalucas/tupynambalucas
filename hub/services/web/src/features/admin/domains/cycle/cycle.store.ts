import { create } from 'zustand';
import { adminCycleApi } from './cycle.api';
import { useCycleStore as usePublicCycleStore } from '@/domains/cycle';
import { useProductStore } from '@/domains/product';
import { getErrorMessage } from '@/utils/errorHelper';
import { type IProduct, type CycleResponse, CycleResponseSchema } from '@tupynambalucas-hub/core';

export interface CycleFormData {
  products: IProduct[];
  description: string;
  openingDate: Date | null;
  closingDate: Date | null;
}

interface HistoryResponse {
  data: CycleResponse[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}

interface AdminCycleState {
  isSubmitting: boolean;
  error: string | null;
  success: boolean;
  historyCycles: CycleResponse[];
  historyPagination: HistoryResponse['pagination'] | null;
  isLoadingHistory: boolean;
  selectedCycle: CycleResponse | null;
  isLoadingDetails: boolean;
  fetchHistory: (filters?: { page?: number; startDate?: Date; endDate?: Date }) => Promise<void>;
  fetchCycleDetails: (id: string) => Promise<void>;
  createCycle: (data: CycleFormData) => Promise<boolean>;
  updateActiveCycleProducts: (products: IProduct[]) => Promise<boolean>;
  resetStatus: () => void;
  clearSelectedCycle: () => void;
  activeCycleViewMode: 'dashboard' | 'products';
  setActiveCycleViewMode: (mode: 'dashboard' | 'products') => void;
}

export const useAdminCycleStore = create<AdminCycleState>((set) => ({
  isSubmitting: false,
  error: null,
  success: false,
  historyCycles: [],
  historyPagination: null,
  isLoadingHistory: false,
  selectedCycle: null,
  isLoadingDetails: false,
  activeCycleViewMode: 'dashboard',

  setActiveCycleViewMode: (mode) => set({ activeCycleViewMode: mode }),

  fetchHistory: async (filters) => {
    set({ isLoadingHistory: true, error: null });
    try {
      const params = {
        page: filters?.page,
        startDate: filters?.startDate?.toISOString(),
        endDate: filters?.endDate?.toISOString(),
      };
      const data = await adminCycleApi.getHistory(params);
      set({
        historyCycles: data.data,
        historyPagination: data.pagination,
        isLoadingHistory: false,
      });
    } catch (err) {
      set({ isLoadingHistory: false, error: getErrorMessage(err) });
    }
  },

  fetchCycleDetails: async (id) => {
    set({ isLoadingDetails: true, error: null });
    try {
      const data = await adminCycleApi.getById(id);
      set({ selectedCycle: data, isLoadingDetails: false });
    } catch (err) {
      set({ isLoadingDetails: false, error: getErrorMessage(err) });
    }
  },

  createCycle: async (data) => {
    set({ isSubmitting: true, error: null, success: false });
    try {
      if (data.openingDate === null || data.closingDate === null) {
        throw new Error('Datas inválidas');
      }

      const payload = {
        description: data.description,
        openingDate: data.openingDate.toISOString(),
        closingDate: data.closingDate.toISOString(),
        products: data.products,
      };

      await adminCycleApi.create(payload);
      set({ isSubmitting: false, success: true });
      void usePublicCycleStore.getState().actions.fetchActiveCycle();
      return true;
    } catch (err: unknown) {
      set({ isSubmitting: false, error: getErrorMessage(err) });
      return false;
    }
  },

  updateActiveCycleProducts: async (updatedProducts) => {
    const currentPublicCycle = usePublicCycleStore.getState().activeCycle;
    if (currentPublicCycle?._id === undefined || currentPublicCycle._id === '') return false;

    set({ isSubmitting: true, error: null });
    try {
      const updatedCycle = await adminCycleApi.updateProducts(
        currentPublicCycle._id,
        updatedProducts,
      );
      CycleResponseSchema.parse(updatedCycle);
      console.info('Updated Cycle:', updatedCycle);
      set({ isSubmitting: false, success: true });
      void usePublicCycleStore.getState().actions.fetchActiveCycle({ silent: true });
      void useProductStore.getState().actions.fetchProducts();
      return true;
    } catch (err: unknown) {
      set({ isSubmitting: false, error: getErrorMessage(err) });
      return false;
    }
  },

  resetStatus: () => set({ error: null, success: false }),
  clearSelectedCycle: () => set({ selectedCycle: null }),
}));
