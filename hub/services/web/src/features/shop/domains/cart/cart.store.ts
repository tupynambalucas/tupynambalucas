import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { IProduct } from '@tupynambalucas-hub/core';

export interface CartItem extends IProduct {
  amount: number; // For 'unidade', it's the count. For 'kg', it's grams.
}

interface CartState {
  items: CartItem[];
  actions: {
    updateAmount: (product: IProduct, amount: number) => void;
    removeItem: (productId: string) => void;
    clearCart: () => void;
  };
}

/**
 * Pure Domain Logic - Calculate price for a single item
 */
export const calculateItemPrice = (item: CartItem): number => {
  const price = Number(item.measure.value);
  if (item.measure.type === 'kg') {
    return price * (item.amount / 1000);
  }
  return price * item.amount;
};

/**
 * Selector - Calculate total price of all items in cart
 */
export const selectCartTotal = (state: CartState): number => {
  return state.items.reduce((acc, item) => acc + calculateItemPrice(item), 0);
};

/**
 * Selector - Calculate total item count (units + 1 per weight-based item)
 */
export const selectCartCount = (state: CartState): number => {
  return state.items.reduce((acc, item) => {
    if (item.measure.type === 'unidade') return acc + item.amount;
    return acc + 1;
  }, 0);
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      actions: {
        updateAmount: (product, amount) =>
          set((state) => {
            let newItems;
            const numericAmount = Math.max(0, amount);

            if (numericAmount === 0) {
              newItems = state.items.filter((item) => item._id !== product._id);
            } else {
              const existingItem = state.items.find((item) => item._id === product._id);
              if (existingItem !== undefined) {
                newItems = state.items.map((item) =>
                  item._id === product._id ? { ...item, amount: numericAmount } : item,
                );
              } else {
                newItems = [...state.items, { ...product, amount: numericAmount }];
              }
            }

            return { items: newItems };
          }),
        removeItem: (productId) =>
          set((state) => ({
            items: state.items.filter((item) => item._id !== productId),
          })),
        clearCart: () => set({ items: [] }),
      },
    }),
    {
      name: 'tupynambalucas-cart-storage',
      // We only persist items, not actions
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

/**
 * Convenience hooks for senior-level atomic consumption
 */
export const useCartItems = () => useCartStore((state) => state.items);
export const useCartActions = () => useCartStore((state) => state.actions);
export const useCartTotal = () => useCartStore(selectCartTotal);
export const useCartCount = () => useCartStore(selectCartCount);
