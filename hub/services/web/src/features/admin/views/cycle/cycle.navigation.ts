import { create } from 'zustand';

export type CreateStep = 'input-list' | 'validate-list' | 'config-cycle';

interface CyclesNavigationState {
  currentStep: CreateStep;
  setStep: (step: CreateStep) => void;
  resetNavigation: () => void;
}

export const useCyclesNavigation = create<CyclesNavigationState>((set) => ({
  currentStep: 'input-list',
  setStep: (step) => set({ currentStep: step }),
  resetNavigation: () => set({ currentStep: 'input-list' }),
}));
