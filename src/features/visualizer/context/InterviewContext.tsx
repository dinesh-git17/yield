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
  type UseInterviewControllerReturn,
  useInterviewController,
} from "@/features/algorithms/hooks";
import {
  DEFAULT_RAIN_WATER_HEIGHTS,
  generateRandomHeights,
  INTERVIEW_CONFIG,
} from "@/features/algorithms/interview/config";
import type { InterviewStep } from "@/features/algorithms/interview/types";
import { useYieldStore } from "@/lib/store";

/**
 * Converts playback speed multiplier to interval in milliseconds.
 * Higher multiplier = faster playback = shorter interval.
 * Base interval is 400ms at 1x speed (slower than sorting for educational purposes).
 */
const BASE_INTERVAL_MS = 400;
function speedMultiplierToInterval(multiplier: number): number {
  return Math.round(BASE_INTERVAL_MS / multiplier);
}

export interface InterviewContextValue extends UseInterviewControllerReturn {
  isReady: boolean;
}

const InterviewContext = createContext<InterviewContextValue | null>(null);

export interface InterviewProviderProps {
  children: React.ReactNode;
}

export function InterviewProvider({ children }: InterviewProviderProps) {
  const interviewState = useYieldStore((state) => state.interviewState);
  const [initialHeights, setInitialHeights] = useState<number[] | null>(null);
  const initializedRef = useRef(false);

  // Generate initial heights on client to avoid hydration mismatch
  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      // Use store heights if available, otherwise use default
      if (interviewState.heights.length > 0) {
        setInitialHeights(interviewState.heights);
      } else {
        setInitialHeights(DEFAULT_RAIN_WATER_HEIGHTS);
      }
    }
  }, [interviewState.heights]);

  if (initialHeights === null) {
    return <InterviewProviderLoading>{children}</InterviewProviderLoading>;
  }

  return (
    <InterviewProviderReady initialHeights={initialHeights}>{children}</InterviewProviderReady>
  );
}

function InterviewProviderLoading({ children }: { children: React.ReactNode }) {
  const placeholderValue: InterviewContextValue = useMemo(
    () => ({
      bars: [],
      status: "idle" as const,
      currentStepIndex: 0,
      currentStepType: null,
      currentStep: null,
      speed: 400,
      insight: "",

      // Rain Water state
      totalWater: 0,
      maxLeft: 0,
      maxRight: 0,
      leftPointer: -1,
      rightPointer: -1,

      // Histogram state
      stack: [],
      histogramIndex: -1,
      maxArea: 0,
      calculatingRectangle: null,
      maxRectangle: null,

      isReady: false,
      play: () => {},
      pause: () => {},
      nextStep: () => {},
      reset: () => {},
      resetWithHeights: () => {},
      setSpeed: () => {},
    }),
    []
  );

  return <InterviewContext.Provider value={placeholderValue}>{children}</InterviewContext.Provider>;
}

function InterviewProviderReady({
  children,
  initialHeights,
}: {
  children: React.ReactNode;
  initialHeights: number[];
}) {
  const interviewProblem = useYieldStore((state) => state.interviewProblem);
  const playbackSpeed = useYieldStore((state) => state.playbackSpeed);
  const setInterviewHeights = useYieldStore((state) => state.setInterviewHeights);
  const updateInterviewState = useYieldStore((state) => state.updateInterviewState);

  const controller = useInterviewController(initialHeights, interviewProblem);
  const prevProblemRef = useRef(interviewProblem);

  // Sync controller state to store for persistence
  useEffect(() => {
    updateInterviewState({
      left: controller.leftPointer,
      right: controller.rightPointer,
      maxLeft: controller.maxLeft,
      maxRight: controller.maxRight,
      totalWater: controller.totalWater,
      waterLevels: controller.bars.map((bar) => bar.waterLevel),
    });
  }, [
    controller.leftPointer,
    controller.rightPointer,
    controller.maxLeft,
    controller.maxRight,
    controller.totalWater,
    controller.bars,
    updateInterviewState,
  ]);

  // Handle problem type change - reset with new random heights
  useEffect(() => {
    if (prevProblemRef.current !== interviewProblem) {
      const newHeights = generateRandomHeights(INTERVIEW_CONFIG.DEFAULT_BARS);
      setInterviewHeights(newHeights);
      controller.resetWithHeights(newHeights);
      prevProblemRef.current = interviewProblem;
    }
  }, [interviewProblem, controller.resetWithHeights, setInterviewHeights]);

  // Sync store's playback speed to controller
  useEffect(() => {
    const intervalMs = speedMultiplierToInterval(playbackSpeed);
    controller.setSpeed(intervalMs);
  }, [playbackSpeed, controller.setSpeed]);

  // Enhanced reset that generates fresh random heights
  const resetWithFreshHeights = useCallback(() => {
    const newHeights = generateRandomHeights(INTERVIEW_CONFIG.DEFAULT_BARS);
    setInterviewHeights(newHeights);
    controller.resetWithHeights(newHeights);
  }, [setInterviewHeights, controller.resetWithHeights]);

  const value: InterviewContextValue = useMemo(
    () => ({
      ...controller,
      reset: resetWithFreshHeights,
      isReady: true,
    }),
    [controller, resetWithFreshHeights]
  );

  return <InterviewContext.Provider value={value}>{children}</InterviewContext.Provider>;
}

export function useInterview(): InterviewContextValue {
  const context = useContext(InterviewContext);
  if (!context) {
    throw new Error("useInterview must be used within an InterviewProvider");
  }
  return context;
}

export type InterviewStepType = InterviewStep["type"] | null;
