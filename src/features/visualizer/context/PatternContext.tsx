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
import { type UsePatternControllerReturn, usePatternController } from "@/features/algorithms/hooks";
import { DEFAULT_SLIDING_WINDOW_INPUT } from "@/features/algorithms/patterns/config";
import type { PatternStep } from "@/features/algorithms/patterns/types";
import { useYieldStore } from "@/lib/store";

/**
 * Converts playback speed multiplier to interval in milliseconds.
 * Higher multiplier = faster playback = shorter interval.
 * Base interval is 500ms at 1x speed (slower for educational purposes).
 */
const BASE_INTERVAL_MS = 500;
function speedMultiplierToInterval(multiplier: number): number {
  return Math.round(BASE_INTERVAL_MS / multiplier);
}

export interface PatternContextValue extends UsePatternControllerReturn {
  isReady: boolean;
}

const PatternContext = createContext<PatternContextValue | null>(null);

export interface PatternProviderProps {
  children: React.ReactNode;
}

export function PatternProvider({ children }: PatternProviderProps) {
  const patternInput = useYieldStore((state) => state.patternInput);
  const [initialInput, setInitialInput] = useState<string | null>(null);
  const initializedRef = useRef(false);

  // Initialize on client to avoid hydration mismatch
  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      // Use store input if available, otherwise use default
      if (patternInput.length > 0) {
        setInitialInput(patternInput);
      } else {
        setInitialInput(DEFAULT_SLIDING_WINDOW_INPUT);
      }
    }
  }, [patternInput]);

  if (initialInput === null) {
    return <PatternProviderLoading>{children}</PatternProviderLoading>;
  }

  return <PatternProviderReady initialInput={initialInput}>{children}</PatternProviderReady>;
}

function PatternProviderLoading({ children }: { children: React.ReactNode }) {
  const placeholderValue: PatternContextValue = useMemo(
    () => ({
      characters: [],
      status: "idle" as const,
      currentStepIndex: 0,
      currentStepType: null,
      currentStep: null,
      window: { start: 0, end: -1 },
      frequencyMap: {},
      windowStatus: "valid" as const,
      globalMax: 0,
      bestSubstring: "",
      currentSubstring: "",
      speed: 500,
      insight: "",
      dynamicInsight: "",
      stepLabel: "",
      duplicateChar: null,
      isReady: false,
      play: () => {},
      pause: () => {},
      nextStep: () => {},
      reset: () => {},
      resetWithInput: () => {},
      setSpeed: () => {},
    }),
    []
  );

  return <PatternContext.Provider value={placeholderValue}>{children}</PatternContext.Provider>;
}

function PatternProviderReady({
  children,
  initialInput,
}: {
  children: React.ReactNode;
  initialInput: string;
}) {
  const patternProblem = useYieldStore((state) => state.patternProblem);
  const playbackSpeed = useYieldStore((state) => state.playbackSpeed);
  const setPatternInput = useYieldStore((state) => state.setPatternInput);
  const updatePatternState = useYieldStore((state) => state.updatePatternState);

  const controller = usePatternController(initialInput, patternProblem);
  const prevProblemRef = useRef(patternProblem);

  // Sync controller state to store for persistence
  useEffect(() => {
    updatePatternState({
      window: controller.window,
      frequencyMap: controller.frequencyMap,
      globalMax: controller.globalMax,
      bestSubstring: controller.bestSubstring,
      status: controller.windowStatus,
    });
  }, [
    controller.window,
    controller.frequencyMap,
    controller.globalMax,
    controller.bestSubstring,
    controller.windowStatus,
    updatePatternState,
  ]);

  // Handle problem type change - reset with current input
  useEffect(() => {
    if (prevProblemRef.current !== patternProblem) {
      controller.reset();
      prevProblemRef.current = patternProblem;
    }
  }, [patternProblem, controller.reset]);

  // Sync store's playback speed to controller
  useEffect(() => {
    const intervalMs = speedMultiplierToInterval(playbackSpeed);
    controller.setSpeed(intervalMs);
  }, [playbackSpeed, controller.setSpeed]);

  // Enhanced reset that also updates store
  const resetWithFreshInput = useCallback(
    (newInput: string) => {
      setPatternInput(newInput);
      controller.resetWithInput(newInput);
    },
    [setPatternInput, controller.resetWithInput]
  );

  const value: PatternContextValue = useMemo(
    () => ({
      ...controller,
      resetWithInput: resetWithFreshInput,
      isReady: true,
    }),
    [controller, resetWithFreshInput]
  );

  return <PatternContext.Provider value={value}>{children}</PatternContext.Provider>;
}

export function usePattern(): PatternContextValue {
  const context = useContext(PatternContext);
  if (!context) {
    throw new Error("usePattern must be used within a PatternProvider");
  }
  return context;
}

export type PatternStepType = PatternStep["type"] | null;
