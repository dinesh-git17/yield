"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  type StepType,
  type UseSortingControllerReturn,
  useSortingController,
} from "@/features/algorithms/hooks";

const BAR_COUNT = 50;
const MIN_HEIGHT = 5;
const MAX_HEIGHT = 100;

function generateOrderedValues(count: number): number[] {
  const values: number[] = [];
  const step = (MAX_HEIGHT - MIN_HEIGHT) / (count - 1);
  for (let i = 0; i < count; i++) {
    values.push(Math.round(MIN_HEIGHT + step * i));
  }
  return values;
}

function shuffleArray(arr: number[]): number[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = result[i];
    const jVal = result[j];
    if (temp !== undefined && jVal !== undefined) {
      result[i] = jVal;
      result[j] = temp;
    }
  }
  return result;
}

export interface SortingContextValue extends UseSortingControllerReturn {
  isReady: boolean;
}

const SortingContext = createContext<SortingContextValue | null>(null);

export interface SortingProviderProps {
  children: React.ReactNode;
}

export function SortingProvider({ children }: SortingProviderProps) {
  const [initialValues, setInitialValues] = useState<number[]>([]);

  useEffect(() => {
    const ordered = generateOrderedValues(BAR_COUNT);
    const shuffled = shuffleArray(ordered);
    setInitialValues(shuffled);
  }, []);

  if (initialValues.length === 0) {
    return <SortingProviderLoading>{children}</SortingProviderLoading>;
  }

  return <SortingProviderReady initialValues={initialValues}>{children}</SortingProviderReady>;
}

function SortingProviderLoading({ children }: { children: React.ReactNode }) {
  const placeholderValue: SortingContextValue = useMemo(
    () => ({
      bars: [],
      status: "idle",
      currentStepIndex: 0,
      currentStepType: null,
      totalSteps: 0,
      speed: 100,
      isReady: false,
      play: () => {},
      pause: () => {},
      nextStep: () => {},
      reset: () => {},
      setSpeed: () => {},
    }),
    []
  );

  return <SortingContext.Provider value={placeholderValue}>{children}</SortingContext.Provider>;
}

function SortingProviderReady({
  children,
  initialValues,
}: {
  children: React.ReactNode;
  initialValues: number[];
}) {
  const controller = useSortingController(initialValues);

  const value: SortingContextValue = useMemo(
    () => ({
      ...controller,
      isReady: true,
    }),
    [controller]
  );

  return <SortingContext.Provider value={value}>{children}</SortingContext.Provider>;
}

export function useSorting(): SortingContextValue {
  const context = useContext(SortingContext);
  if (!context) {
    throw new Error("useSorting must be used within a SortingProvider");
  }
  return context;
}

export type { StepType };
