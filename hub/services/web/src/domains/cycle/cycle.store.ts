import { create } from 'zustand';
import { cycleApi } from './cycle.api';
import { getErrorMessage } from '@/utils/errorHelper';
import { CycleResponseSchema, type CycleResponse } from '@tupynambalucas-hub/core';

interface PublicCycleState {
  activeCycle: CycleResponse | null;
  isLoading: boolean;
  error: string | null;
  actions: {
    fetchActiveCycle: (options?: { silent?: boolean }) => Promise<void>;
  };
}

export const useCycleStore = create<PublicCycleState>((set) => ({
  activeCycle: null,
  isLoading: false,
  error: null,

  actions: {
    fetchActiveCycle: async (options) => {
      const isSilent = options?.silent === true;
      if (isSilent === false) {
        set({ isLoading: true, error: null });
      }

      try {
        const data = await cycleApi.getActive();
        const validated = data ? CycleResponseSchema.parse(data) : null;
        set({ activeCycle: validated });
      } catch (err: unknown) {
        set({ activeCycle: null, error: getErrorMessage(err) });
      } finally {
        if (isSilent === false) {
          set({ isLoading: false });
        }
      }
    },
  },
}));
