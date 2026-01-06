"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
  const storeInitialArray = useYieldStore((state) => state.initialArray);
  const [initialValues, setInitialValues] = useState<number[] | null>(null);
  const initialArraySizeRef = useRef(arraySize);
  // Track the storeInitialArray we've already consumed to avoid re-applying
  const consumedInitialArrayRef = useRef<number[] | null>(null);

  // Generate initial values only on client to avoid hydration mismatch
  // We need to handle the race condition where UrlStateSync (nested in Suspense)
  // sets storeInitialArray AFTER this component has already generated random values.
  useEffect(() => {
    // Case 1: First mount - generate initial values
    if (initialValues === null) {
      if (storeInitialArray && storeInitialArray.length > 0) {
        // URL array was already available (rare, but possible)
        setInitialValues(storeInitialArray);
        consumedInitialArrayRef.current = storeInitialArray;
      } else {
        // Generate random shuffled values
        setInitialValues(generateShuffledValues(initialArraySizeRef.current));
      }
      return;
    }

    // Case 2: storeInitialArray arrived late (UrlStateSync ran after our first effect)
    // Only apply if it's a new array we haven't consumed yet
    if (
      storeInitialArray &&
      storeInitialArray.length > 0 &&
      storeInitialArray !== consumedInitialArrayRef.current
    ) {
      setInitialValues(storeInitialArray);
      consumedInitialArrayRef.current = storeInitialArray;
    }
  }, [initialValues, storeInitialArray]);

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
  const sortingAlgorithm = useYieldStore((state) => state.sortingAlgorithm);
  const playbackSpeed = useYieldStore((state) => state.playbackSpeed);
  const clearInitialArray = useYieldStore((state) => state.clearInitialArray);
  const controller = useSortingController(initialValues, sortingAlgorithm);
  const prevArraySizeRef = useRef(arraySize);
  const prevAlgorithmRef = useRef(sortingAlgorithm);
  const prevInitialValuesRef = useRef(initialValues);

  // Handle late-arriving URL initial array (from UrlStateSync race condition)
  // When initialValues prop changes, reset the controller with the new values
  useEffect(() => {
    if (prevInitialValuesRef.current !== initialValues) {
      controller.resetWithValues(initialValues);
      prevInitialValuesRef.current = initialValues;
    }
  }, [initialValues, controller.resetWithValues]);

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
    if (prevAlgorithmRef.current !== sortingAlgorithm) {
      const newValues = generateShuffledValues(arraySize);
      controller.resetWithValues(newValues);
      prevAlgorithmRef.current = sortingAlgorithm;
    }
  }, [sortingAlgorithm, arraySize, controller.resetWithValues]);

  // Sync store's playback speed to controller
  useEffect(() => {
    const intervalMs = speedMultiplierToInterval(playbackSpeed);
    controller.setSpeed(intervalMs);
  }, [playbackSpeed, controller.setSpeed]);

  // Enhanced reset that clears the initial array and generates fresh random values
  const resetWithFreshValues = useCallback(() => {
    clearInitialArray();
    const newValues = generateShuffledValues(arraySize);
    controller.resetWithValues(newValues);
  }, [clearInitialArray, arraySize, controller.resetWithValues]);

  const value: SortingContextValue = useMemo(
    () => ({
      ...controller,
      reset: resetWithFreshValues,
      isReady: true,
    }),
    [controller, resetWithFreshValues]
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
