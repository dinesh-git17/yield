/**
 * Pattern problem types supported by Yield.
 * Start with "longest-substring-norepeat" (Sliding Window) and expand as needed.
 */
export type PatternProblemType = "longest-substring-norepeat";

/**
 * Window validity status for sliding window patterns.
 * - valid: Current window satisfies the constraint (no duplicates)
 * - invalid: Window contains a duplicate and needs to shrink
 */
export type WindowStatus = "valid" | "invalid";

/**
 * Represents a single step in a pattern problem algorithm execution.
 * Used by generator functions to yield operations for visualization.
 *
 * Step types for Sliding Window (Longest Substring Without Repeating Characters):
 * - init: Initialize window pointers and data structures
 * - expand: Expand window by moving right pointer
 * - found-duplicate: A duplicate character was detected (window invalid)
 * - shrink: Shrink window by moving left pointer to restore validity
 * - update-max: Found a new maximum window size
 * - complete: Algorithm has finished
 */
export type PatternStep =
  | {
      type: "init";
      /** Initial left pointer index */
      left: number;
      /** Initial right pointer index */
      right: number;
      /** Initial frequency map (empty) */
      frequencyMap: Record<string, number>;
    }
  | {
      type: "expand";
      /** New right pointer position */
      right: number;
      /** Character being added to window */
      char: string;
      /** Updated frequency map after adding char */
      frequencyMap: Record<string, number>;
      /** Whether this expansion caused a duplicate */
      causesDuplicate: boolean;
    }
  | {
      type: "found-duplicate";
      /** The duplicate character */
      char: string;
      /** Index where the duplicate was found (right pointer) */
      index: number;
      /** Current frequency of the duplicate char */
      frequency: number;
    }
  | {
      type: "shrink";
      /** New left pointer position */
      left: number;
      /** Character being removed from window */
      char: string;
      /** Updated frequency map after removing char */
      frequencyMap: Record<string, number>;
      /** Whether the window is now valid after this shrink */
      windowValid: boolean;
    }
  | {
      type: "update-max";
      /** New maximum length found */
      maxLength: number;
      /** Start index of the maximum window */
      windowStart: number;
      /** End index of the maximum window */
      windowEnd: number;
      /** The substring that achieved the maximum */
      substring: string;
    }
  | {
      type: "complete";
      /** Final maximum length */
      maxLength: number;
      /** Final best substring */
      bestSubstring: string;
    };

/**
 * State tracked during Sliding Window visualization.
 */
export interface SlidingWindowState {
  /** The input string as an array of characters */
  data: string[];
  /** Current window boundaries */
  window: {
    /** Left pointer (inclusive) */
    start: number;
    /** Right pointer (inclusive) */
    end: number;
  };
  /** Character frequency count within the current window */
  frequencyMap: Record<string, number>;
  /** The running maximum length found so far */
  globalMax: number;
  /** The best substring found (for display) */
  bestSubstring: string;
  /** Current window validity status */
  status: WindowStatus;
}

/**
 * Creates an initial sliding window state from an input string.
 */
export function createInitialSlidingWindowState(input: string): SlidingWindowState {
  return {
    data: input.split(""),
    window: {
      start: 0,
      end: -1, // Will be set to 0 on first expand
    },
    frequencyMap: {},
    globalMax: 0,
    bestSubstring: "",
    status: "valid",
  };
}

/**
 * Context passed to pattern problem generators.
 */
export interface PatternContext {
  /** The input string for the problem */
  input: string;
}

/**
 * Signature for pattern problem generator functions.
 */
export type PatternGenerator = (context: PatternContext) => Generator<PatternStep, void, unknown>;
