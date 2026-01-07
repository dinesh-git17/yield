"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getPatternStepInsight, getPatternStepLabel } from "@/features/algorithms/patterns/config";
import { slidingWindow } from "@/features/algorithms/patterns/slidingWindow";
import type {
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
 * - duplicate: The character that caused a duplicate
 * - best: Part of the best substring found
 */
export type CharacterBoxState =
  | "idle"
  | "in-window"
  | "entering"
  | "leaving"
  | "duplicate"
  | "best";

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
  /** Window validity status */
  windowStatus: WindowStatus;
  /** Current maximum length found */
  globalMax: number;
  /** Best substring found */
  bestSubstring: string;
  /** Current window substring */
  currentSubstring: string;
  /** Playback speed in ms */
  speed: number;
  /** Human-readable insight for current step */
  insight: string;
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
  resetWithInput: (input: string) => void;
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
  input: string
): Generator<PatternStep, void, unknown> {
  switch (problem) {
    case "longest-substring-norepeat":
      return slidingWindow({ input });
    default:
      return slidingWindow({ input });
  }
}

export function usePatternController(
  initialInput: string,
  problem: PatternProblemType = "longest-substring-norepeat"
): UsePatternControllerReturn {
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
  const [windowStatus, setWindowStatus] = useState<WindowStatus>("valid");
  const [globalMax, setGlobalMax] = useState(0);
  const [bestSubstring, setBestSubstring] = useState("");
  const [insight, setInsight] = useState("");
  const [stepLabel, setStepLabel] = useState("");
  const [duplicateChar, setDuplicateChar] = useState<string | null>(null);

  const inputRef = useRef(initialInput);
  const iteratorRef = useRef<Generator<PatternStep, void, unknown> | null>(null);

  const initializeIterator = useCallback(() => {
    inputRef.current = initialInput;
    iteratorRef.current = getGeneratorForProblem(problem, initialInput);
  }, [initialInput, problem]);

  useEffect(() => {
    initializeIterator();
  }, [initializeIterator]);

  // Compute current substring based on window
  const currentSubstring =
    window.end >= window.start ? inputRef.current.slice(window.start, window.end + 1) : "";

  /**
   * Updates character box states based on current window and step.
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
            state = step.causesDuplicate ? "duplicate" : "entering";
          } else if (
            stepType === "found-duplicate" &&
            step?.type === "found-duplicate" &&
            char.char === step.char
          ) {
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
    setStepLabel(getPatternStepLabel(step.type));

    let newWindowStart = window.start;
    let newWindowEnd = window.end;
    let newBestStart = 0;
    let newBestLength = globalMax;

    switch (step.type) {
      case "init":
        newWindowStart = step.left;
        newWindowEnd = step.right;
        setWindow({ start: step.left, end: step.right });
        setFrequencyMap(step.frequencyMap);
        setWindowStatus("valid");
        setDuplicateChar(null);
        break;

      case "expand":
        newWindowEnd = step.right;
        setWindow((prev) => ({ ...prev, end: step.right }));
        setFrequencyMap(step.frequencyMap);
        if (step.causesDuplicate) {
          setWindowStatus("invalid");
          setDuplicateChar(step.char);
        } else {
          setWindowStatus("valid");
          setDuplicateChar(null);
        }
        break;

      case "found-duplicate":
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
        }
        break;

      case "update-max":
        setGlobalMax(step.maxLength);
        setBestSubstring(step.substring);
        newBestStart = step.windowStart;
        newBestLength = step.maxLength;
        break;

      case "complete":
        setGlobalMax(step.maxLength);
        setBestSubstring(step.bestSubstring);
        newBestStart = inputRef.current.indexOf(step.bestSubstring);
        newBestLength = step.maxLength;
        break;
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
  }, [window.start, window.end, globalMax, bestSubstring, updateCharacterStates]);

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
    setWindowStatus("valid");
    setGlobalMax(0);
    setBestSubstring("");
    setInsight("");
    setStepLabel("");
    setDuplicateChar(null);
    setCharacters(createCharactersFromInput(initialInput));
    initializeIterator();
  }, [initialInput, initializeIterator]);

  const resetWithInput = useCallback(
    (newInput: string) => {
      setStatus("idle");
      setCurrentStepIndex(0);
      setCurrentStepType(null);
      setCurrentStep(null);
      setWindow({ start: 0, end: -1 });
      setFrequencyMap({});
      setWindowStatus("valid");
      setGlobalMax(0);
      setBestSubstring("");
      setInsight("");
      setStepLabel("");
      setDuplicateChar(null);
      inputRef.current = newInput;
      setCharacters(createCharactersFromInput(newInput));
      iteratorRef.current = getGeneratorForProblem(problem, newInput);
    },
    [problem]
  );

  const updateSpeed = useCallback((newSpeed: number) => {
    setSpeed(newSpeed);
  }, []);

  return {
    characters,
    status,
    currentStepIndex,
    currentStepType,
    currentStep,
    window,
    frequencyMap,
    windowStatus,
    globalMax,
    bestSubstring,
    currentSubstring,
    speed,
    insight,
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
