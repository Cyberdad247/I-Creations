import { create } from 'zustand';

type OnboardingState = {
  currentStep: number;
  completed: boolean;
  steps: {
    target: string;
    content: string;
    placement: 'top' | 'bottom' | 'left' | 'right';
  }[];
  startOnboarding: (steps: OnboardingState['steps']) => void;
  completeStep: () => void;
  reset: () => void;
};

export const useOnboarding = create<OnboardingState>((set) => ({
  currentStep: 0,
  completed: false,
  steps: [],
  startOnboarding: (steps) => set({ steps, currentStep: 0, completed: false }),
  completeStep: () =>
    set((state) => {
      const nextStep = state.currentStep + 1;
      return {
        currentStep: nextStep,
        completed: nextStep >= state.steps.length,
      };
    }),
  reset: () => set({ currentStep: 0, completed: false, steps: [] }),
}));
