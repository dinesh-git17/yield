"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getStepInsight } from "@/features/algorithms/interview/config";
import { trappingRainWater } from "@/features/algorithms/interview/trappingRainWater";
import type { InterviewStep } from "@/features/algorithms/interview/types";
import type { InterviewProblemType } from "@/lib/store";

/**
 * Visual states for a rain water bar during algorithm execution.
 * - idle: Default state, not currently being operated on
 * - left-pointer: Current left pointer position
 * - right-pointer: Current right pointer position
 * - left-max: The index that holds the max-left value
 * - right-max: The index that holds the max-right value
 * - filling: Currently having water filled
 * - complete: Algorithm has finished
 */
export type RainWaterBarState =
  | "idle"
  | "left-pointer"
  | "right-pointer"
  | "left-max"
  | "right-max"
  | "filling"
  | "complete";

export type InterviewPlaybackStatus = "idle" | "playing" | "paused" | "complete";

export interface RainWaterBarData {
  id: string;
  index: number;
  height: number;
  waterLevel: number;
  state: RainWaterBarState;
}

export interface InterviewControllerState {
  bars: RainWaterBarData[];
  status: InterviewPlaybackStatus;
  currentStepIndex: number;
  currentStepType: InterviewStep["type"] | null;
  currentStep: InterviewStep | null;
  totalWater: number;
  maxLeft: number;
  maxRight: number;
  leftPointer: number;
  rightPointer: number;
  speed: number;
  /** Dynamic insight text based on current step */
  insight: string;
}

export interface InterviewControllerActions {
  play: () => void;
  pause: () => void;
  nextStep: () => void;
  reset: () => void;
  resetWithHeights: (heights: number[]) => void;
  setSpeed: (speed: number) => void;
}

export type UseInterviewControllerReturn = InterviewControllerState & InterviewControllerActions;

const DEFAULT_SPEED = 400; // Slower for educational purposes

function createBarsFromHeights(heights: number[]): RainWaterBarData[] {
  return heights.map((height, index) => ({
    id: `bar-${index}`,
    index,
    height,
    waterLevel: 0,
    state: "idle" as const,
  }));
}

/**
 * Returns the appropriate generator for an interview problem.
 */
function getGeneratorForProblem(
  problem: InterviewProblemType,
  heights: number[]
): Generator<InterviewStep, void, unknown> {
  switch (problem) {
    case "trapping-rain-water":
      return trappingRainWater({ heights });
    default:
      return trappingRainWater({ heights });
  }
}

export function useInterviewController(
  initialHeights: number[],
  problem: InterviewProblemType = "trapping-rain-water"
): UseInterviewControllerReturn {
  const [bars, setBars] = useState<RainWaterBarData[]>(() => createBarsFromHeights(initialHeights));
  const [status, setStatus] = useState<InterviewPlaybackStatus>("idle");
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentStepType, setCurrentStepType] = useState<InterviewStep["type"] | null>(null);
  const [currentStep, setCurrentStep] = useState<InterviewStep | null>(null);
  const [speed, setSpeed] = useState(DEFAULT_SPEED);
  const [totalWater, setTotalWater] = useState(0);
  const [maxLeft, setMaxLeft] = useState(0);
  const [maxRight, setMaxRight] = useState(0);
  const [leftPointer, setLeftPointer] = useState(-1);
  const [rightPointer, setRightPointer] = useState(-1);
  const [insight, setInsight] = useState("");

  const heightsRef = useRef<number[]>([...initialHeights]);
  const waterLevelsRef = useRef<number[]>(new Array(initialHeights.length).fill(0) as number[]);
  const iteratorRef = useRef<Generator<InterviewStep, void, unknown> | null>(null);
  const totalStepsRef = useRef(0);

  const initializeIterator = useCallback(() => {
    heightsRef.current = [...initialHeights];
    waterLevelsRef.current = new Array(initialHeights.length).fill(0) as number[];
    iteratorRef.current = getGeneratorForProblem(problem, heightsRef.current);
  }, [initialHeights, problem]);

  useEffect(() => {
    initializeIterator();
  }, [initializeIterator]);

  /**
   * Computes which bar index holds the current max-left value.
   * This is the leftmost bar with the current maxLeft height.
   */
  const findMaxLeftIndex = useCallback((currentMaxLeft: number, currentLeft: number): number => {
    for (let i = 0; i <= currentLeft; i++) {
      const height = heightsRef.current[i];
      if (height !== undefined && height >= currentMaxLeft) {
        return i;
      }
    }
    return 0;
  }, []);

  /**
   * Computes which bar index holds the current max-right value.
   * This is the rightmost bar with the current maxRight height.
   */
  const findMaxRightIndex = useCallback((currentMaxRight: number, currentRight: number): number => {
    const len = heightsRef.current.length;
    for (let i = len - 1; i >= currentRight; i--) {
      const height = heightsRef.current[i];
      if (height !== undefined && height >= currentMaxRight) {
        return i;
      }
    }
    return len - 1;
  }, []);

  const applyStep = useCallback(
    (
      step: InterviewStep,
      currentLeft: number,
      currentRight: number,
      currentMaxLeft: number,
      currentMaxRight: number
    ) => {
      setBars((prevBars) => {
        const maxLeftIdx = findMaxLeftIndex(currentMaxLeft, currentLeft);
        const maxRightIdx = findMaxRightIndex(currentMaxRight, currentRight);

        return prevBars.map((bar) => {
          // Handle fill-water step - update waterLevel
          if (step.type === "fill-water" && bar.index === step.index) {
            return {
              ...bar,
              waterLevel: waterLevelsRef.current[bar.index] ?? 0,
              state: "filling" as const,
            };
          }

          // Mark pointers and max positions
          if (bar.index === currentLeft) {
            return { ...bar, state: "left-pointer" as const };
          }
          if (bar.index === currentRight) {
            return { ...bar, state: "right-pointer" as const };
          }
          if (bar.index === maxLeftIdx && maxLeftIdx !== currentLeft) {
            return { ...bar, state: "left-max" as const };
          }
          if (bar.index === maxRightIdx && maxRightIdx !== currentRight) {
            return { ...bar, state: "right-max" as const };
          }

          // Keep water levels but reset state to idle
          return {
            ...bar,
            waterLevel: waterLevelsRef.current[bar.index] ?? 0,
            state: "idle" as const,
          };
        });
      });
    },
    [findMaxLeftIndex, findMaxRightIndex]
  );

  const processNextStep = useCallback((): boolean => {
    const iterator = iteratorRef.current;
    if (!iterator) return false;

    const result = iterator.next();

    if (result.done) {
      setStatus("complete");
      setInsight(getStepInsight("complete"));
      // Mark all bars as complete
      setBars((prevBars) =>
        prevBars.map((bar) => ({
          ...bar,
          state: "complete" as const,
        }))
      );
      return false;
    }

    const step = result.value;
    setCurrentStepIndex((prev) => prev + 1);
    setCurrentStepType(step.type);
    setCurrentStep(step);
    setInsight(getStepInsight(step.type));
    totalStepsRef.current += 1;

    // Track state variables
    let newLeft = leftPointer;
    let newRight = rightPointer;
    let newMaxLeft = maxLeft;
    let newMaxRight = maxRight;

    switch (step.type) {
      case "init":
        newLeft = step.left;
        newRight = step.right;
        newMaxLeft = step.maxLeft;
        newMaxRight = step.maxRight;
        setLeftPointer(newLeft);
        setRightPointer(newRight);
        setMaxLeft(newMaxLeft);
        setMaxRight(newMaxRight);
        break;

      case "move-left":
        newLeft = step.to;
        setLeftPointer(newLeft);
        break;

      case "move-right":
        newRight = step.to;
        setRightPointer(newRight);
        break;

      case "update-max-left":
        newMaxLeft = step.newMax;
        setMaxLeft(newMaxLeft);
        break;

      case "update-max-right":
        newMaxRight = step.newMax;
        setMaxRight(newMaxRight);
        break;

      case "fill-water":
        // Update water levels ref
        waterLevelsRef.current[step.index] = step.waterAmount;
        setTotalWater(step.totalWater);
        break;

      case "complete":
        setTotalWater(step.totalWater);
        break;
    }

    // Apply visual state
    applyStep(
      step,
      step.type === "move-left" ? step.to : newLeft,
      step.type === "move-right" ? step.to : newRight,
      newMaxLeft,
      newMaxRight
    );

    return true;
  }, [leftPointer, rightPointer, maxLeft, maxRight, applyStep]);

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
    setCurrentStep(null);
    setTotalWater(0);
    setMaxLeft(0);
    setMaxRight(0);
    setLeftPointer(-1);
    setRightPointer(-1);
    setInsight("");
    totalStepsRef.current = 0;
    waterLevelsRef.current = new Array(initialHeights.length).fill(0) as number[];
    setBars(createBarsFromHeights(initialHeights));
    initializeIterator();
  }, [initialHeights, initializeIterator]);

  const resetWithHeights = useCallback(
    (newHeights: number[]) => {
      setStatus("idle");
      setCurrentStepIndex(0);
      setCurrentStepType(null);
      setCurrentStep(null);
      setTotalWater(0);
      setMaxLeft(0);
      setMaxRight(0);
      setLeftPointer(-1);
      setRightPointer(-1);
      setInsight("");
      totalStepsRef.current = 0;
      heightsRef.current = [...newHeights];
      waterLevelsRef.current = new Array(newHeights.length).fill(0) as number[];
      setBars(createBarsFromHeights(newHeights));
      iteratorRef.current = getGeneratorForProblem(problem, newHeights);
    },
    [problem]
  );

  const updateSpeed = useCallback((newSpeed: number) => {
    setSpeed(newSpeed);
  }, []);

  return {
    bars,
    status,
    currentStepIndex,
    currentStepType,
    currentStep,
    totalWater,
    maxLeft,
    maxRight,
    leftPointer,
    rightPointer,
    speed,
    insight,
    play,
    pause,
    nextStep,
    reset,
    resetWithHeights,
    setSpeed: updateSpeed,
  };
}
