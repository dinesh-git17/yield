"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { bubbleSort, type SortStep, selectionSort } from "@/features/algorithms/sorting";
import type { BarState } from "@/features/visualizer/components/SortingBar";
import type { AlgorithmType } from "@/lib/store";

/**
 * Returns the appropriate sorting algorithm generator for the given type.
 */
function getAlgorithmGenerator(
  algorithm: AlgorithmType,
  arr: number[]
): Generator<SortStep, void, unknown> {
  switch (algorithm) {
    case "selection":
      return selectionSort(arr);
    default:
      // Quick sort not yet implemented, falls back to bubble
      return bubbleSort(arr);
  }
}

export type PlaybackStatus = "idle" | "playing" | "paused" | "complete";

export interface BarData {
  id: string;
  value: number;
  state: BarState;
}

export type StepType = SortStep["type"] | null;

export interface SortingControllerState {
  bars: BarData[];
  status: PlaybackStatus;
  currentStepIndex: number;
  currentStepType: StepType;
  totalSteps: number;
  speed: number;
}

export interface SortingControllerActions {
  play: () => void;
  pause: () => void;
  nextStep: () => void;
  reset: () => void;
  resetWithValues: (newValues: number[]) => void;
  setSpeed: (speed: number) => void;
}

export type UseSortingControllerReturn = SortingControllerState & SortingControllerActions;

const DEFAULT_SPEED = 100;

function createBarsFromValues(values: number[]): BarData[] {
  return values.map((value, index) => ({
    id: `bar-${index}`,
    value,
    state: "idle" as const,
  }));
}

export function useSortingController(
  initialValues: number[],
  algorithm: AlgorithmType = "bubble"
): UseSortingControllerReturn {
  const [bars, setBars] = useState<BarData[]>(() => createBarsFromValues(initialValues));
  const [status, setStatus] = useState<PlaybackStatus>("idle");
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentStepType, setCurrentStepType] = useState<StepType>(null);
  const [speed, setSpeed] = useState(DEFAULT_SPEED);
  const [sortedIndices, setSortedIndices] = useState<Set<number>>(new Set());

  const arrayRef = useRef<number[]>([...initialValues]);
  const iteratorRef = useRef<Generator<SortStep, void, unknown> | null>(null);
  const totalStepsRef = useRef(0);
  const completionTimeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const clearCompletionTimeouts = useCallback(() => {
    for (const timeout of completionTimeoutsRef.current) {
      clearTimeout(timeout);
    }
    completionTimeoutsRef.current = [];
  }, []);

  const initializeIterator = useCallback(() => {
    arrayRef.current = [...initialValues];
    iteratorRef.current = getAlgorithmGenerator(algorithm, arrayRef.current);
    setSortedIndices(new Set());
  }, [initialValues, algorithm]);

  useEffect(() => {
    initializeIterator();
  }, [initializeIterator]);

  // Cleanup completion timeouts on unmount
  useEffect(() => {
    return () => {
      clearCompletionTimeouts();
    };
  }, [clearCompletionTimeouts]);

  const COMPLETION_WAVE_DELAY_MS = 50;

  const runCompletionSequence = useCallback(
    (barCount: number) => {
      clearCompletionTimeouts();

      for (let i = 0; i < barCount; i++) {
        const timeout = setTimeout(() => {
          setBars((prevBars) =>
            prevBars.map((bar, index) => (index === i ? { ...bar, state: "sorted" as const } : bar))
          );
        }, i * COMPLETION_WAVE_DELAY_MS);
        completionTimeoutsRef.current.push(timeout);
      }
    },
    [clearCompletionTimeouts]
  );

  const applyStep = useCallback((step: SortStep, newSortedIndices: Set<number>) => {
    setBars((prevBars) => {
      return prevBars.map((bar, index) => {
        if (step.type === "compare") {
          const [i, j] = step.indices;
          if (index === i || index === j) {
            return { ...bar, state: "comparing" as const };
          }
        }

        if (step.type === "swap") {
          const [i, j] = step.indices;
          const [newValI, newValJ] = step.newValues;
          if (index === i) {
            return { ...bar, value: newValI, state: "swapping" as const };
          }
          if (index === j) {
            return { ...bar, value: newValJ, state: "swapping" as const };
          }
        }

        if (step.type === "scanning") {
          if (index === step.index) {
            return { ...bar, state: "scanning" as const };
          }
        }

        if (step.type === "sorted") {
          if (index === step.index) {
            return { ...bar, state: "sorted" as const };
          }
        }

        if (newSortedIndices.has(index)) {
          return { ...bar, state: "sorted" as const };
        }

        return { ...bar, state: "idle" as const };
      });
    });
  }, []);

  const processNextStep = useCallback((): boolean => {
    const iterator = iteratorRef.current;
    if (!iterator) return false;

    const result = iterator.next();

    if (result.done) {
      setStatus("complete");
      // Reset all bars to idle before the wave
      setBars((prevBars) => prevBars.map((bar) => ({ ...bar, state: "idle" as const })));
      // Trigger the dopamine wave effect
      runCompletionSequence(arrayRef.current.length);
      return false;
    }

    const step = result.value;
    setCurrentStepIndex((prev) => prev + 1);
    setCurrentStepType(step.type);
    totalStepsRef.current += 1;

    if (step.type === "sorted") {
      setSortedIndices((prev) => {
        const next = new Set(prev);
        next.add(step.index);
        applyStep(step, next);
        return next;
      });
    } else {
      applyStep(step, sortedIndices);
    }

    return true;
  }, [applyStep, sortedIndices, runCompletionSequence]);

  useEffect(() => {
    if (status !== "playing") return;

    const intervalId = setInterval(() => {
      const hasMore = processNextStep();
      if (!hasMore) {
        clearInterval(intervalId);
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [status, speed, processNextStep]);

  const play = useCallback(() => {
    if (status === "complete") return;
    if (status === "idle" && !iteratorRef.current) {
      initializeIterator();
    }
    setStatus("playing");
  }, [status, initializeIterator]);

  const pause = useCallback(() => {
    if (status === "playing") {
      setStatus("paused");
    }
  }, [status]);

  const nextStep = useCallback(() => {
    if (status === "complete") return;
    if (status === "idle" && !iteratorRef.current) {
      initializeIterator();
    }
    if (status === "playing") {
      setStatus("paused");
    }
    processNextStep();
  }, [status, initializeIterator, processNextStep]);

  const reset = useCallback(() => {
    clearCompletionTimeouts();
    setStatus("idle");
    setCurrentStepIndex(0);
    setCurrentStepType(null);
    totalStepsRef.current = 0;
    setSortedIndices(new Set());
    setBars(createBarsFromValues(initialValues));
    initializeIterator();
  }, [initialValues, initializeIterator, clearCompletionTimeouts]);

  const resetWithValues = useCallback(
    (newValues: number[]) => {
      clearCompletionTimeouts();
      setStatus("idle");
      setCurrentStepIndex(0);
      setCurrentStepType(null);
      totalStepsRef.current = 0;
      setSortedIndices(new Set());
      setBars(createBarsFromValues(newValues));
      arrayRef.current = [...newValues];
      iteratorRef.current = getAlgorithmGenerator(algorithm, arrayRef.current);
    },
    [algorithm, clearCompletionTimeouts]
  );

  const updateSpeed = useCallback((newSpeed: number) => {
    setSpeed(newSpeed);
  }, []);

  return {
    bars,
    status,
    currentStepIndex,
    currentStepType,
    totalSteps: totalStepsRef.current,
    speed,
    play,
    pause,
    nextStep,
    reset,
    resetWithValues,
    setSpeed: updateSpeed,
  };
}
