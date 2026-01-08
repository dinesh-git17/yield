"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  getDynamicPatternInsight,
  getPatternStepInsight,
  getPatternStepLabel,
} from "@/features/algorithms/patterns/config";
import { minWindowSubstring } from "@/features/algorithms/patterns/minWindow";
import { slidingWindow } from "@/features/algorithms/patterns/slidingWindow";
import type {
  OptimizationObjective,
  PatternProblemType,
  PatternStep,
  WindowStatus,
} from "@/features/algorithms/patterns/types";

/**
 * Visual states for a character box during sliding window execution.
 * - idle: Not in current window
 * - in-window: Part of the current valid window
 * - entering: Just added to window (right pointer)
 * - leaving: About to be removed from window (left pointer)
 * - duplicate: The character that caused a duplicate/constraint violation
 * - best: Part of the best substring found
 * - constraint-satisfied: Character that satisfied a constraint (for min-window)
 */
export type CharacterBoxState =
  | "idle"
  | "in-window"
  | "entering"
  | "leaving"
  | "duplicate"
  | "best"
  | "constraint-satisfied";

export type PatternPlaybackStatus = "idle" | "playing" | "paused" | "complete";

export interface CharacterBoxData {
  id: string;
  index: number;
  char: string;
  state: CharacterBoxState;
  isInWindow: boolean;
}

export interface PatternControllerState {
  /** Character boxes for visualization */
  characters: CharacterBoxData[];
  /** Playback status */
  status: PatternPlaybackStatus;
  /** Current step index */
  currentStepIndex: number;
  /** Current step type */
  currentStepType: PatternStep["type"] | null;
  /** Current step data */
  currentStep: PatternStep | null;
  /** Window boundaries */
  window: { start: number; end: number };
  /** Character frequency map */
  frequencyMap: Record<string, number>;
  /** Target frequency map for constraint-based problems (e.g., min-window-substring) */
  targetFrequencyMap: Record<string, number>;
  /** Window validity status */
  windowStatus: WindowStatus;
  /** Optimization objective for the current problem */
  objective: OptimizationObjective;
  /**
   * Current best length found.
   * For max objectives: the maximum window size found.
   * For min objectives: the minimum valid window size found.
   */
  globalBest: number;
  /**
   * @deprecated Use globalBest instead. Kept for backward compatibility.
   */
  globalMax: number;
  /** Best substring found */
  bestSubstring: string;
  /** Current window substring */
  currentSubstring: string;
  /** Playback speed in ms */
  speed: number;
  /** Human-readable insight for current step (static) */
  insight: string;
  /** Dynamic context-aware insight with specific values */
  dynamicInsight: string;
  /** Human-readable label for current step */
  stepLabel: string;
  /** The duplicate character (if any) */
  duplicateChar: string | null;
}

export interface PatternControllerActions {
  play: () => void;
  pause: () => void;
  nextStep: () => void;
  reset: () => void;
  resetWithInput: (input: string, target?: string) => void;
  setSpeed: (speed: number) => void;
}

export type UsePatternControllerReturn = PatternControllerState & PatternControllerActions;

const DEFAULT_SPEED = 500; // Slower for educational purposes

function createCharactersFromInput(input: string): CharacterBoxData[] {
  return input.split("").map((char, index) => ({
    id: `char-${index}`,
    index,
    char,
    state: "idle" as const,
    isInWindow: false,
  }));
}

/**
 * Returns the appropriate generator for a pattern problem.
 */
function getGeneratorForProblem(
  problem: PatternProblemType,
  input: string,
  target?: string
): Generator<PatternStep, void, unknown> {
  switch (problem) {
    case "longest-substring-norepeat":
      return slidingWindow({ input });
    case "min-window-substring":
      // Only include target if defined to satisfy exactOptionalPropertyTypes
      return minWindowSubstring(target ? { input, target } : { input });
    default:
      return slidingWindow({ input });
  }
}

/**
 * Returns the optimization objective for a pattern problem.
 */
function getObjectiveForProblem(problem: PatternProblemType): OptimizationObjective {
  switch (problem) {
    case "min-window-substring":
      return "min";
    default:
      return "max";
  }
}

export function usePatternController(
  initialInput: string,
  problem: PatternProblemType = "longest-substring-norepeat",
  target?: string
): UsePatternControllerReturn {
  // Derive objective from problem type
  const objective = getObjectiveForProblem(problem);

  const [characters, setCharacters] = useState<CharacterBoxData[]>(() =>
    createCharactersFromInput(initialInput)
  );
  const [status, setStatus] = useState<PatternPlaybackStatus>("idle");
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentStepType, setCurrentStepType] = useState<PatternStep["type"] | null>(null);
  const [currentStep, setCurrentStep] = useState<PatternStep | null>(null);
  const [speed, setSpeed] = useState(DEFAULT_SPEED);
  const [window, setWindow] = useState({ start: 0, end: -1 });
  const [frequencyMap, setFrequencyMap] = useState<Record<string, number>>({});
  const [targetFrequencyMap, setTargetFrequencyMap] = useState<Record<string, number>>({});
  const [windowStatus, setWindowStatus] = useState<WindowStatus>(
    objective === "max" ? "valid" : "invalid"
  );
  // For min objectives, start with Infinity; for max, start with 0
  const [globalBest, setGlobalBest] = useState(objective === "max" ? 0 : Number.POSITIVE_INFINITY);
  const [bestSubstring, setBestSubstring] = useState("");
  const [insight, setInsight] = useState("");
  const [dynamicInsight, setDynamicInsight] = useState("");
  const [stepLabel, setStepLabel] = useState("");
  const [duplicateChar, setDuplicateChar] = useState<string | null>(null);

  const inputRef = useRef(initialInput);
  const targetRef = useRef(target);
  const iteratorRef = useRef<Generator<PatternStep, void, unknown> | null>(null);

  // Lazy initialization for fresh page loads - called by play/nextStep when iterator is null.
  // Subsequent changes (preset switches, input changes) are handled by resetWithInput.
  // Note: We intentionally do NOT have an effect that auto-runs this on dependency changes,
  // as that causes a race condition where it overwrites resetWithInput's correct values
  // with stale initialInput (which is only set once during hydration in PatternContext).
  const initializeIterator = useCallback(() => {
    inputRef.current = initialInput;
    targetRef.current = target;
    iteratorRef.current = getGeneratorForProblem(problem, initialInput, target);
  }, [initialInput, problem, target]);

  // Compute current substring based on window
  const currentSubstring =
    window.end >= window.start ? inputRef.current.slice(window.start, window.end + 1) : "";

  /**
   * Updates character box states based on current window and step.
   * Supports both deprecated (found-duplicate, update-max) and new generic step types.
   */
  const updateCharacterStates = useCallback(
    (
      windowStart: number,
      windowEnd: number,
      stepType: PatternStep["type"] | null,
      step: PatternStep | null,
      bestStart: number,
      bestEnd: number
    ) => {
      setCharacters((prev) =>
        prev.map((char) => {
          const isInWindow = char.index >= windowStart && char.index <= windowEnd;

          // Determine state based on current step and position
          let state: CharacterBoxState = "idle";

          if (stepType === "complete") {
            // Show best substring on completion
            if (char.index >= bestStart && char.index < bestStart + bestEnd) {
              state = "best";
            }
          } else if (
            stepType === "expand" &&
            step?.type === "expand" &&
            char.index === step.right
          ) {
            // Character just entered window
            if (step.causesDuplicate) {
              state = "duplicate";
            } else if (step.satisfiesConstraint) {
              state = "constraint-satisfied";
            } else {
              state = "entering";
            }
          } else if (
            stepType === "validity-check" &&
            step?.type === "validity-check" &&
            char.char === step.char
          ) {
            // Generic validity check - handle both valid and invalid states
            if (!step.isValid && step.reason === "duplicate") {
              state = isInWindow ? "duplicate" : "idle";
            } else if (step.isValid && step.reason === "constraint-satisfied") {
              state = isInWindow ? "constraint-satisfied" : "idle";
            } else {
              state = isInWindow ? "in-window" : "idle";
            }
          } else if (
            stepType === "found-duplicate" &&
            step?.type === "found-duplicate" &&
            char.char === step.char
          ) {
            // @deprecated - kept for backward compatibility
            // Highlight all instances of the duplicate character
            state = isInWindow ? "duplicate" : "idle";
          } else if (
            stepType === "shrink" &&
            step?.type === "shrink" &&
            char.index === step.left - 1
          ) {
            // Character just left window
            state = "leaving";
          } else if (isInWindow) {
            state = "in-window";
          }

          return {
            ...char,
            state,
            isInWindow,
          };
        })
      );
    },
    []
  );

  const processNextStep = useCallback((): boolean => {
    const iterator = iteratorRef.current;
    if (!iterator) return false;

    const result = iterator.next();

    if (result.done) {
      setStatus("complete");
      setInsight(getPatternStepInsight("complete"));
      // Generate problem-aware completion message
      const completeInsight =
        objective === "min"
          ? bestSubstring
            ? `Algorithm complete! The minimum window containing all target characters is "${bestSubstring}" with length ${bestSubstring.length}. Total time: O(n) — each character was visited at most twice.`
            : `Algorithm complete! No valid window found containing all target characters. Total time: O(n).`
          : `Algorithm complete! The longest substring without repeating characters is "${bestSubstring}" with length ${bestSubstring.length}. Total time: O(n) — each character was visited at most twice.`;
      setDynamicInsight(completeInsight);
      setStepLabel(getPatternStepLabel("complete"));
      // Mark best substring characters
      const input = inputRef.current;
      const bestStart = input.indexOf(bestSubstring);
      updateCharacterStates(-1, -1, "complete", null, bestStart, bestSubstring.length);
      return false;
    }

    const step = result.value;
    setCurrentStepIndex((prev) => prev + 1);
    setCurrentStepType(step.type);
    setCurrentStep(step);
    setInsight(getPatternStepInsight(step.type));
    setDynamicInsight(getDynamicPatternInsight(step));
    setStepLabel(getPatternStepLabel(step.type));

    let newWindowStart = window.start;
    let newWindowEnd = window.end;
    let newBestStart = 0;
    let newBestLength = globalBest;

    switch (step.type) {
      case "init":
        newWindowStart = step.left;
        newWindowEnd = step.right;
        setWindow({ start: step.left, end: step.right });
        setFrequencyMap(step.frequencyMap);
        // Set target frequency map if present (for min-window problems)
        if (step.targetFrequencyMap) {
          setTargetFrequencyMap(step.targetFrequencyMap);
        }
        // Initial window status depends on objective
        setWindowStatus(objective === "max" ? "valid" : "invalid");
        setDuplicateChar(null);
        break;

      case "expand":
        newWindowEnd = step.right;
        setWindow((prev) => ({ ...prev, end: step.right }));
        setFrequencyMap(step.frequencyMap);
        if (step.causesDuplicate) {
          setWindowStatus("invalid");
          setDuplicateChar(step.char);
        } else if (step.satisfiesConstraint) {
          setWindowStatus("valid");
          setDuplicateChar(null);
        } else if (objective === "max") {
          // For max objective, no duplicate means valid
          setWindowStatus("valid");
          setDuplicateChar(null);
        }
        // For min objective, keep current status until validity-check
        break;

      case "validity-check":
        // Generic validity check - handles both duplicate and constraint satisfaction
        if (step.isValid) {
          setWindowStatus("valid");
          setDuplicateChar(null);
        } else {
          setWindowStatus("invalid");
          if (step.reason === "duplicate") {
            setDuplicateChar(step.char);
          }
        }
        break;

      case "found-duplicate":
        // @deprecated - kept for backward compatibility
        setWindowStatus("invalid");
        setDuplicateChar(step.char);
        break;

      case "shrink":
        newWindowStart = step.left;
        setWindow((prev) => ({ ...prev, start: step.left }));
        setFrequencyMap(step.frequencyMap);
        if (step.windowValid) {
          setWindowStatus("valid");
          setDuplicateChar(null);
        } else {
          setWindowStatus("invalid");
        }
        break;

      case "update-best":
        // Generic update-best - works for both min and max objectives
        setGlobalBest(step.bestLength);
        setBestSubstring(step.substring);
        newBestStart = step.windowStart;
        newBestLength = step.bestLength;
        break;

      case "update-max":
        // @deprecated - kept for backward compatibility
        setGlobalBest(step.maxLength);
        setBestSubstring(step.substring);
        newBestStart = step.windowStart;
        newBestLength = step.maxLength;
        break;

      case "complete": {
        const finalLength = step.bestLength ?? step.maxLength ?? 0;
        setGlobalBest(finalLength);
        setBestSubstring(step.bestSubstring);
        newBestStart = inputRef.current.indexOf(step.bestSubstring);
        newBestLength = finalLength;
        break;
      }
    }

    // Update character visual states
    updateCharacterStates(
      step.type === "shrink" ? step.left : newWindowStart,
      step.type === "expand" ? step.right : newWindowEnd,
      step.type,
      step,
      newBestStart,
      newBestLength
    );

    return true;
  }, [window.start, window.end, globalBest, bestSubstring, objective, updateCharacterStates]);

  // Playback loop
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
    setWindow({ start: 0, end: -1 });
    setFrequencyMap({});
    setTargetFrequencyMap({});
    setWindowStatus(objective === "max" ? "valid" : "invalid");
    setGlobalBest(objective === "max" ? 0 : Number.POSITIVE_INFINITY);
    setBestSubstring("");
    setInsight("");
    setDynamicInsight("");
    setStepLabel("");
    setDuplicateChar(null);
    setCharacters(createCharactersFromInput(initialInput));
    initializeIterator();
  }, [initialInput, objective, initializeIterator]);

  const resetWithInput = useCallback(
    (newInput: string, newTarget?: string) => {
      setStatus("idle");
      setCurrentStepIndex(0);
      setCurrentStepType(null);
      setCurrentStep(null);
      setWindow({ start: 0, end: -1 });
      setFrequencyMap({});
      setTargetFrequencyMap({});
      setWindowStatus(objective === "max" ? "valid" : "invalid");
      setGlobalBest(objective === "max" ? 0 : Number.POSITIVE_INFINITY);
      setBestSubstring("");
      setInsight("");
      setDynamicInsight("");
      setStepLabel("");
      setDuplicateChar(null);
      inputRef.current = newInput;
      targetRef.current = newTarget ?? target;
      setCharacters(createCharactersFromInput(newInput));
      iteratorRef.current = getGeneratorForProblem(problem, newInput, newTarget ?? target);
    },
    [problem, objective, target]
  );

  const updateSpeed = useCallback((newSpeed: number) => {
    setSpeed(newSpeed);
  }, []);

  // For backward compatibility, also expose globalMax as an alias for globalBest
  const globalMax = globalBest === Number.POSITIVE_INFINITY ? 0 : globalBest;

  return {
    characters,
    status,
    currentStepIndex,
    currentStepType,
    currentStep,
    window,
    frequencyMap,
    targetFrequencyMap,
    windowStatus,
    objective,
    globalBest,
    globalMax, // @deprecated - use globalBest instead
    bestSubstring,
    currentSubstring,
    speed,
    insight,
    dynamicInsight,
    stepLabel,
    duplicateChar,
    play,
    pause,
    nextStep,
    reset,
    resetWithInput,
    setSpeed: updateSpeed,
  };
}
