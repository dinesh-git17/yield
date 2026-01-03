"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { bubbleSort, type SortStep } from "@/features/algorithms/sorting";
import type { BarState } from "@/features/visualizer/components/SortingBar";

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

export function useSortingController(initialValues: number[]): UseSortingControllerReturn {
  const [bars, setBars] = useState<BarData[]>(() => createBarsFromValues(initialValues));
  const [status, setStatus] = useState<PlaybackStatus>("idle");
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentStepType, setCurrentStepType] = useState<StepType>(null);
  const [speed, setSpeed] = useState(DEFAULT_SPEED);
  const [sortedIndices, setSortedIndices] = useState<Set<number>>(new Set());

  const arrayRef = useRef<number[]>([...initialValues]);
  const iteratorRef = useRef<Generator<SortStep, void, unknown> | null>(null);
  const totalStepsRef = useRef(0);

  const initializeIterator = useCallback(() => {
    arrayRef.current = [...initialValues];
    iteratorRef.current = bubbleSort(arrayRef.current);
    setSortedIndices(new Set());
  }, [initialValues]);

  useEffect(() => {
    initializeIterator();
  }, [initializeIterator]);

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
      setBars((prevBars) => prevBars.map((bar) => ({ ...bar, state: "sorted" as const })));
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
  }, [applyStep, sortedIndices]);

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
    setStatus("idle");
    setCurrentStepIndex(0);
    setCurrentStepType(null);
    totalStepsRef.current = 0;
    setSortedIndices(new Set());
    setBars(createBarsFromValues(initialValues));
    initializeIterator();
  }, [initialValues, initializeIterator]);

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
    setSpeed: updateSpeed,
  };
}
