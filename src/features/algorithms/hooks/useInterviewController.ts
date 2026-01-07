"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getStepInsight } from "@/features/algorithms/interview/config";
import { largestRectangleHistogram } from "@/features/algorithms/interview/largestRectangleHistogram";
import { trappingRainWater } from "@/features/algorithms/interview/trappingRainWater";
import type { InterviewStep } from "@/features/algorithms/interview/types";
import type { InterviewProblemType } from "@/lib/store";

/**
 * Visual states for a bar during algorithm execution.
 *
 * Shared states:
 * - idle: Default state, not currently being operated on
 * - complete: Algorithm has finished
 *
 * Rain Water (Two Pointers) states:
 * - left-pointer: Current left pointer position
 * - right-pointer: Current right pointer position
 * - left-max: The index that holds the max-left value
 * - right-max: The index that holds the max-right value
 * - filling: Currently having water filled
 *
 * Largest Rectangle (Monotonic Stack) states:
 * - in-stack: Bar is currently on the monotonic stack
 * - current: Current iterator position
 * - popped: Bar that was just popped from the stack
 * - calculating-area: Bars within the rectangle being calculated
 * - max-rectangle: Bars within the current maximum rectangle
 */
export type InterviewBarState =
  | "idle"
  | "complete"
  // Rain Water states
  | "left-pointer"
  | "right-pointer"
  | "left-max"
  | "right-max"
  | "filling"
  // Histogram states
  | "in-stack"
  | "current"
  | "popped"
  | "calculating-area"
  | "max-rectangle";

/**
 * @deprecated Use InterviewBarState instead. Kept for backwards compatibility.
 */
export type RainWaterBarState = InterviewBarState;

export type InterviewPlaybackStatus = "idle" | "playing" | "paused" | "complete";

export interface InterviewBarData {
  id: string;
  index: number;
  height: number;
  waterLevel: number;
  state: InterviewBarState;
}

/**
 * @deprecated Use InterviewBarData instead. Kept for backwards compatibility.
 */
export type RainWaterBarData = InterviewBarData;

/**
 * Details of a rectangle for visualization (used in Largest Rectangle problem).
 */
export interface RectangleHighlight {
  /** Left boundary index (inclusive) */
  left: number;
  /** Right boundary index (exclusive) */
  right: number;
  /** Height of the rectangle */
  height: number;
}

export interface InterviewControllerState {
  bars: InterviewBarData[];
  status: InterviewPlaybackStatus;
  currentStepIndex: number;
  currentStepType: InterviewStep["type"] | null;
  currentStep: InterviewStep | null;
  speed: number;
  /** Dynamic insight text based on current step */
  insight: string;

  // Rain Water (Two Pointers) specific state
  totalWater: number;
  maxLeft: number;
  maxRight: number;
  leftPointer: number;
  rightPointer: number;

  // Largest Rectangle (Monotonic Stack) specific state
  /** Current monotonic stack (array of bar indices) */
  stack: number[];
  /** Current iterator position */
  histogramIndex: number;
  /** Maximum area found so far */
  maxArea: number;
  /** Rectangle currently being calculated (for temporary highlight) */
  calculatingRectangle: RectangleHighlight | null;
  /** Rectangle with maximum area (for persistent highlight) */
  maxRectangle: RectangleHighlight | null;
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

function createBarsFromHeights(heights: number[]): InterviewBarData[] {
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
    case "largest-rectangle-histogram":
      return largestRectangleHistogram({ heights });
    default:
      return trappingRainWater({ heights });
  }
}

export function useInterviewController(
  initialHeights: number[],
  problem: InterviewProblemType = "trapping-rain-water"
): UseInterviewControllerReturn {
  const [bars, setBars] = useState<InterviewBarData[]>(() => createBarsFromHeights(initialHeights));
  const [status, setStatus] = useState<InterviewPlaybackStatus>("idle");
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentStepType, setCurrentStepType] = useState<InterviewStep["type"] | null>(null);
  const [currentStep, setCurrentStep] = useState<InterviewStep | null>(null);
  const [speed, setSpeed] = useState(DEFAULT_SPEED);
  const [insight, setInsight] = useState("");

  // Rain Water (Two Pointers) state
  const [totalWater, setTotalWater] = useState(0);
  const [maxLeft, setMaxLeft] = useState(0);
  const [maxRight, setMaxRight] = useState(0);
  const [leftPointer, setLeftPointer] = useState(-1);
  const [rightPointer, setRightPointer] = useState(-1);

  // Largest Rectangle (Monotonic Stack) state
  const [stack, setStack] = useState<number[]>([]);
  const [histogramIndex, setHistogramIndex] = useState(-1);
  const [maxArea, setMaxArea] = useState(0);
  const [calculatingRectangle, setCalculatingRectangle] = useState<RectangleHighlight | null>(null);
  const [maxRectangle, setMaxRectangle] = useState<RectangleHighlight | null>(null);

  const heightsRef = useRef<number[]>([...initialHeights]);
  const waterLevelsRef = useRef<number[]>(new Array(initialHeights.length).fill(0) as number[]);
  const stackRef = useRef<number[]>([]);
  const iteratorRef = useRef<Generator<InterviewStep, void, unknown> | null>(null);
  const totalStepsRef = useRef(0);

  const initializeIterator = useCallback(() => {
    heightsRef.current = [...initialHeights];
    waterLevelsRef.current = new Array(initialHeights.length).fill(0) as number[];
    stackRef.current = [];
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

  /**
   * Applies Rain Water step visualization to bars.
   */
  const applyRainWaterStep = useCallback(
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

  /**
   * Applies Largest Rectangle step visualization to bars.
   * Highlights bars based on their role in the monotonic stack algorithm.
   */
  const applyHistogramStep = useCallback(
    (
      step: InterviewStep,
      currentStack: number[],
      currentIdx: number,
      currentCalcRect: RectangleHighlight | null,
      currentMaxRect: RectangleHighlight | null
    ) => {
      setBars((prevBars) => {
        return prevBars.map((bar) => {
          // During calculate-area step, highlight bars in the rectangle being calculated
          if (step.type === "calculate-area" && currentCalcRect) {
            if (bar.index >= currentCalcRect.left && bar.index < currentCalcRect.right) {
              return { ...bar, state: "calculating-area" as const };
            }
          }

          // Highlight the popped bar
          if (step.type === "stack-pop" && bar.index === step.poppedIndex) {
            return { ...bar, state: "popped" as const };
          }

          // Highlight the current iterator position
          if (bar.index === currentIdx && currentIdx < prevBars.length) {
            return { ...bar, state: "current" as const };
          }

          // Mark bars currently in the stack
          if (currentStack.includes(bar.index)) {
            return { ...bar, state: "in-stack" as const };
          }

          // For update-max-area step, highlight the max rectangle
          if (step.type === "update-max-area" && currentMaxRect) {
            if (bar.index >= currentMaxRect.left && bar.index < currentMaxRect.right) {
              return { ...bar, state: "max-rectangle" as const };
            }
          }

          // Default: idle state
          return { ...bar, state: "idle" as const };
        });
      });
    },
    []
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

    // Determine which problem type based on step type
    const isHistogramStep =
      step.type === "stack-push" ||
      step.type === "stack-pop" ||
      step.type === "calculate-area" ||
      step.type === "update-max-area";

    if (isHistogramStep) {
      // Process Largest Rectangle (Monotonic Stack) steps
      let newStack = [...stackRef.current];
      let newHistogramIdx = histogramIndex;
      let newCalcRect: RectangleHighlight | null = calculatingRectangle;
      let newMaxRect: RectangleHighlight | null = maxRectangle;
      let newMaxAreaValue = maxArea;

      switch (step.type) {
        case "stack-push":
          // Update stack with the new state from the generator
          newStack = [...step.stack];
          stackRef.current = newStack;
          setStack(newStack);
          // Update histogram index to the pushed index
          newHistogramIdx = step.index;
          setHistogramIndex(newHistogramIdx);
          // Clear any calculation rectangle
          newCalcRect = null;
          setCalculatingRectangle(null);
          break;

        case "stack-pop":
          // Update stack with the state after pop
          newStack = [...step.stack];
          stackRef.current = newStack;
          setStack(newStack);
          // Track the current index that triggered the pop
          newHistogramIdx = step.currentIndex;
          setHistogramIndex(newHistogramIdx);
          break;

        case "calculate-area":
          // Set the rectangle being calculated for visualization
          newCalcRect = {
            left: step.leftBound + 1, // leftBound is exclusive, so +1 for inclusive
            right: step.rightBound,
            height: step.height,
          };
          setCalculatingRectangle(newCalcRect);
          break;

        case "update-max-area":
          // Update max area and set the new max rectangle
          newMaxAreaValue = step.newMax;
          setMaxArea(newMaxAreaValue);
          newMaxRect = {
            left: step.rectangle.left,
            right: step.rectangle.right,
            height: step.rectangle.height,
          };
          setMaxRectangle(newMaxRect);
          // Clear the calculation rectangle since we've now committed it as max
          newCalcRect = null;
          setCalculatingRectangle(null);
          break;
      }

      // Apply histogram visualization
      applyHistogramStep(step, newStack, newHistogramIdx, newCalcRect, newMaxRect);
    } else {
      // Process Rain Water (Two Pointers) steps
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

      // Apply rain water visualization
      applyRainWaterStep(
        step,
        step.type === "move-left" ? step.to : newLeft,
        step.type === "move-right" ? step.to : newRight,
        newMaxLeft,
        newMaxRight
      );
    }

    return true;
  }, [
    leftPointer,
    rightPointer,
    maxLeft,
    maxRight,
    histogramIndex,
    maxArea,
    calculatingRectangle,
    maxRectangle,
    applyRainWaterStep,
    applyHistogramStep,
  ]);

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
    setInsight("");

    // Reset Rain Water state
    setTotalWater(0);
    setMaxLeft(0);
    setMaxRight(0);
    setLeftPointer(-1);
    setRightPointer(-1);

    // Reset Histogram state
    setStack([]);
    setHistogramIndex(-1);
    setMaxArea(0);
    setCalculatingRectangle(null);
    setMaxRectangle(null);

    // Reset refs
    totalStepsRef.current = 0;
    waterLevelsRef.current = new Array(initialHeights.length).fill(0) as number[];
    stackRef.current = [];

    setBars(createBarsFromHeights(initialHeights));
    initializeIterator();
  }, [initialHeights, initializeIterator]);

  const resetWithHeights = useCallback(
    (newHeights: number[]) => {
      setStatus("idle");
      setCurrentStepIndex(0);
      setCurrentStepType(null);
      setCurrentStep(null);
      setInsight("");

      // Reset Rain Water state
      setTotalWater(0);
      setMaxLeft(0);
      setMaxRight(0);
      setLeftPointer(-1);
      setRightPointer(-1);

      // Reset Histogram state
      setStack([]);
      setHistogramIndex(-1);
      setMaxArea(0);
      setCalculatingRectangle(null);
      setMaxRectangle(null);

      // Reset refs
      totalStepsRef.current = 0;
      heightsRef.current = [...newHeights];
      waterLevelsRef.current = new Array(newHeights.length).fill(0) as number[];
      stackRef.current = [];

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
    speed,
    insight,

    // Rain Water state
    totalWater,
    maxLeft,
    maxRight,
    leftPointer,
    rightPointer,

    // Histogram state
    stack,
    histogramIndex,
    maxArea,
    calculatingRectangle,
    maxRectangle,

    // Actions
    play,
    pause,
    nextStep,
    reset,
    resetWithHeights,
    setSpeed: updateSpeed,
  };
}
