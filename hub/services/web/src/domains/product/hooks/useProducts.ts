import { useProductStore } from '../product.store';

// Atomic Selectors
export const useProducts = () => useProductStore((state) => state.products);
export const useProductLoading = () => useProductStore((state) => state.isLoading);
export const useProductSubmitting = () => useProductStore((state) => state.isSubmitting);
export const useProductError = () => useProductStore((state) => state.error);
export const useProductActions = () => useProductStore((state) => state.actions);
