"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  type StepType,
  type UseSortingControllerReturn,
  useSortingController,
} from "@/features/algorithms/hooks";
import { useYieldStore } from "@/lib/store";

const MIN_HEIGHT = 5;
const MAX_HEIGHT = 100;

/**
 * Converts playback speed multiplier to interval in milliseconds.
 * Higher multiplier = faster playback = shorter interval.
 * Base interval is 200ms at 1x speed.
 */
const BASE_INTERVAL_MS = 200;
function speedMultiplierToInterval(multiplier: number): number {
  return Math.round(BASE_INTERVAL_MS / multiplier);
}

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

function generateShuffledValues(count: number): number[] {
  const ordered = generateOrderedValues(count);
  return shuffleArray(ordered);
}

export interface SortingContextValue extends UseSortingControllerReturn {
  isReady: boolean;
}

const SortingContext = createContext<SortingContextValue | null>(null);

export interface SortingProviderProps {
  children: React.ReactNode;
}

export function SortingProvider({ children }: SortingProviderProps) {
  const arraySize = useYieldStore((state) => state.arraySize);
  const [initialValues, setInitialValues] = useState<number[] | null>(null);
  const initialArraySizeRef = useRef(arraySize);

  // Generate initial values only on client to avoid hydration mismatch
  useEffect(() => {
    if (initialValues === null) {
      setInitialValues(generateShuffledValues(initialArraySizeRef.current));
    }
  }, [initialValues]);

  if (initialValues === null) {
    return <SortingProviderLoading>{children}</SortingProviderLoading>;
  }

  return <SortingProviderReady initialValues={initialValues}>{children}</SortingProviderReady>;
}

function SortingProviderLoading({ children }: { children: React.ReactNode }) {
  const placeholderValue: SortingContextValue = useMemo(
    () => ({
      bars: [],
      status: "idle" as const,
      currentStepIndex: 0,
      currentStepType: null,
      totalSteps: 0,
      speed: 100,
      isReady: false,
      play: () => {},
      pause: () => {},
      nextStep: () => {},
      reset: () => {},
      resetWithValues: () => {},
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
  const arraySize = useYieldStore((state) => state.arraySize);
  const algorithm = useYieldStore((state) => state.algorithm);
  const playbackSpeed = useYieldStore((state) => state.playbackSpeed);
  const controller = useSortingController(initialValues, algorithm);
  const prevArraySizeRef = useRef(arraySize);
  const prevAlgorithmRef = useRef(algorithm);

  // Handle array size changes smoothly without remounting
  useEffect(() => {
    if (prevArraySizeRef.current !== arraySize) {
      const newValues = generateShuffledValues(arraySize);
      controller.resetWithValues(newValues);
      prevArraySizeRef.current = arraySize;
    }
  }, [arraySize, controller.resetWithValues]);

  // Handle algorithm changes - reset with new shuffled array
  useEffect(() => {
    if (prevAlgorithmRef.current !== algorithm) {
      const newValues = generateShuffledValues(arraySize);
      controller.resetWithValues(newValues);
      prevAlgorithmRef.current = algorithm;
    }
  }, [algorithm, arraySize, controller.resetWithValues]);

  // Sync store's playback speed to controller
  useEffect(() => {
    const intervalMs = speedMultiplierToInterval(playbackSpeed);
    controller.setSpeed(intervalMs);
  }, [playbackSpeed, controller.setSpeed]);

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
