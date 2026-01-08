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
  /** The target string for min-window problems (empty for longest-substring) */
  target: string;
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
      targetFrequencyMap: {},
      windowStatus: "valid" as const,
      objective: "max" as const,
      globalBest: 0,
      globalMax: 0, // @deprecated
      bestSubstring: "",
      currentSubstring: "",
      speed: 500,
      insight: "",
      dynamicInsight: "",
      stepLabel: "",
      duplicateChar: null,
      isReady: false,
      target: "",
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
  const patternTarget = useYieldStore((state) => state.patternTarget);
  const patternInput = useYieldStore((state) => state.patternInput);
  const playbackSpeed = useYieldStore((state) => state.playbackSpeed);
  const setPatternInput = useYieldStore((state) => state.setPatternInput);
  const setPatternTarget = useYieldStore((state) => state.setPatternTarget);
  const updatePatternState = useYieldStore((state) => state.updatePatternState);

  const controller = usePatternController(initialInput, patternProblem, patternTarget);
  const prevProblemRef = useRef(patternProblem);
  const prevTargetRef = useRef(patternTarget);

  // Sync controller state to store for persistence
  useEffect(() => {
    updatePatternState({
      window: controller.window,
      frequencyMap: controller.frequencyMap,
      targetFrequencyMap: controller.targetFrequencyMap,
      globalBest: controller.globalBest,
      globalMax: controller.globalMax, // @deprecated - kept for backward compatibility
      bestSubstring: controller.bestSubstring,
      status: controller.windowStatus,
      objective: controller.objective,
    });
  }, [
    controller.window,
    controller.frequencyMap,
    controller.targetFrequencyMap,
    controller.globalBest,
    controller.globalMax,
    controller.bestSubstring,
    controller.windowStatus,
    controller.objective,
    updatePatternState,
  ]);

  // Handle problem type change - reset with CURRENT input from store (not stale initialInput)
  useEffect(() => {
    if (prevProblemRef.current !== patternProblem) {
      // Use resetWithInput with current store values to avoid stale initialInput
      const currentInput = patternInput || initialInput;
      controller.resetWithInput(currentInput, patternTarget);
      prevProblemRef.current = patternProblem;
    }
  }, [patternProblem, patternInput, patternTarget, initialInput, controller.resetWithInput]);

  // Handle target change from external sources (e.g., URL sync)
  // Skip if we're handling it atomically via resetWithFreshInput
  useEffect(() => {
    if (prevTargetRef.current !== patternTarget) {
      // Use resetWithInput with current store values
      const currentInput = patternInput || initialInput;
      controller.resetWithInput(currentInput, patternTarget);
      prevTargetRef.current = patternTarget;
    }
  }, [patternTarget, patternInput, initialInput, controller.resetWithInput]);

  // Sync store's playback speed to controller
  useEffect(() => {
    const intervalMs = speedMultiplierToInterval(playbackSpeed);
    controller.setSpeed(intervalMs);
  }, [playbackSpeed, controller.setSpeed]);

  // Enhanced reset that also updates store - supports optional target for atomic updates
  const resetWithFreshInput = useCallback(
    (newInput: string, newTarget?: string) => {
      // Update refs immediately to prevent effect from re-running with old values
      if (newTarget !== undefined) {
        prevTargetRef.current = newTarget;
        setPatternTarget(newTarget);
      }
      setPatternInput(newInput);
      // Call controller with the new values directly
      controller.resetWithInput(newInput, newTarget ?? patternTarget);
    },
    [setPatternInput, setPatternTarget, controller.resetWithInput, patternTarget]
  );

  const value: PatternContextValue = useMemo(
    () => ({
      ...controller,
      resetWithInput: resetWithFreshInput,
      isReady: true,
      target: patternTarget,
    }),
    [controller, resetWithFreshInput, patternTarget]
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
