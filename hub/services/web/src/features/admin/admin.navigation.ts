import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AdminViewType = 'users' | 'cycles' | 'reports' | 'configurations' | 'products';

interface AdminNavigationState {
  currentView: AdminViewType;
  setView: (view: AdminViewType) => void;
}

export const useAdminNavigation = create<AdminNavigationState>()(
  persist(
    (set) => ({
      currentView: 'cycles',
      setView: (view) => set({ currentView: view }),
    }),
    {
      name: 'admin-navigation-storage',
    },
  ),
);
