import { create } from "zustand";
import { persist } from "zustand/middleware";

interface OnboardingState {
  isActive: boolean;
  currentStepIndex: number;
  hasSeenTour: boolean;
  startTour: () => void;
  endTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  setStep: (index: number) => void;
  resetHistory: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      isActive: false,
      currentStepIndex: 0,
      hasSeenTour: false,

      startTour: () => {
        const { hasSeenTour, isActive } = get();
        // Only start if not already seen AND not already active
        // Prevents resetting step index if called multiple times
        if (!hasSeenTour && !isActive) {
          set({ isActive: true, currentStepIndex: 0 });
        }
      },

      endTour: () => {
        set({ isActive: false, hasSeenTour: true });
      },

      nextStep: () => {
        set((state) => ({ currentStepIndex: state.currentStepIndex + 1 }));
      },

      prevStep: () => {
        set((state) => ({
          currentStepIndex: Math.max(0, state.currentStepIndex - 1),
        }));
      },

      setStep: (index) => set({ currentStepIndex: index }),

      resetHistory: () => set({ hasSeenTour: false }),
    }),
    {
      name: "yield-onboarding-storage",
      partialize: (state) => ({ hasSeenTour: state.hasSeenTour }),
    }
  )
);
