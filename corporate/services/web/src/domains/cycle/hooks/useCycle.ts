import { useCycleStore } from '../cycle.store';

// Atomic Selectors
export const useActiveCycle = () => useCycleStore((state) => state.activeCycle);
export const useCycleLoading = () => useCycleStore((state) => state.isLoading);
export const useCycleError = () => useCycleStore((state) => state.error);
export const useCycleActions = () => useCycleStore((state) => state.actions);
