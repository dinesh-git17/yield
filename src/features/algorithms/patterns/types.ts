/**
 * Pattern problem types supported by Yield.
 * Expanded to support multiple sliding window problems with different objectives.
 */
export type PatternProblemType = "longest-substring-norepeat" | "min-window-substring";

/**
 * Window validity status for sliding window patterns.
 * - valid: Current window satisfies all constraints
 * - invalid: Window violates a constraint (duplicate, missing chars, etc.)
 */
export type WindowStatus = "valid" | "invalid";

/**
 * Optimization objective for sliding window problems.
 * - max: Maximize window size (e.g., longest substring)
 * - min: Minimize window size (e.g., minimum window substring)
 */
export type OptimizationObjective = "min" | "max";

/**
 * Reason for a validity state change.
 * - duplicate: A duplicate character was detected (window invalid)
 * - missing-chars: Required characters are missing from window (window invalid)
 * - constraint-satisfied: All constraints are now satisfied (window valid)
 */
export type ValidityReason = "duplicate" | "missing-chars" | "constraint-satisfied";

/**
 * Represents a single step in a pattern problem algorithm execution.
 * Used by generator functions to yield operations for visualization.
 *
 * Core step types (shared across all sliding window problems):
 * - init: Initialize window pointers and data structures
 * - expand: Expand window by moving right pointer
 * - shrink: Shrink window by moving left pointer
 * - complete: Algorithm has finished
 *
 * Generic constraint/optimization steps:
 * - validity-check: Generic constraint validation (replaces found-duplicate)
 * - update-best: Generic best tracking (replaces update-max)
 *
 * @deprecated found-duplicate - Use validity-check with reason="duplicate" instead
 * @deprecated update-max - Use update-best with objective="max" instead
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
      /** Target frequency map for problems requiring a target (e.g., min-window) */
      targetFrequencyMap?: Record<string, number>;
    }
  | {
      type: "expand";
      /** New right pointer position */
      right: number;
      /** Character being added to window */
      char: string;
      /** Updated frequency map after adding char */
      frequencyMap: Record<string, number>;
      /** Whether this expansion caused a duplicate (for longest-substring) */
      causesDuplicate?: boolean;
      /** Whether this expansion satisfied the constraint (for min-window) */
      satisfiesConstraint?: boolean;
    }
  | {
      /**
       * Generic validity check step.
       * Used to signal when window validity state changes.
       */
      type: "validity-check";
      /** Whether the window is now valid */
      isValid: boolean;
      /** The character that triggered the check */
      char: string;
      /** Index where the check occurred */
      index: number;
      /** Reason for the validity state */
      reason: ValidityReason;
      /** Character frequency (for duplicate-related checks) */
      frequency?: number;
      /** Number of satisfied character requirements (for target-based checks) */
      satisfiedCount?: number;
      /** Total required characters (for target-based checks) */
      requiredCount?: number;
    }
  | {
      /**
       * @deprecated Use validity-check with reason="duplicate" instead.
       * Kept for backward compatibility with existing Longest Substring implementation.
       */
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
      /**
       * Generic best result update step.
       * Used for both min and max optimization objectives.
       */
      type: "update-best";
      /** New best length found */
      bestLength: number;
      /** Start index of the best window */
      windowStart: number;
      /** End index of the best window */
      windowEnd: number;
      /** The substring that achieved the best result */
      substring: string;
    }
  | {
      /**
       * @deprecated Use update-best instead.
       * Kept for backward compatibility with existing Longest Substring implementation.
       */
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
      /** Final best length (use this instead of maxLength for generic access) */
      bestLength: number;
      /** Final best substring */
      bestSubstring: string;
      /**
       * @deprecated Use bestLength instead.
       * Kept for backward compatibility.
       */
      maxLength?: number;
    };

/**
 * State tracked during Sliding Window visualization.
 * Extended to support both max and min optimization objectives.
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
  /**
   * The running best length found so far.
   * For max objectives: starts at 0, increases when larger window found.
   * For min objectives: starts at Infinity, decreases when smaller valid window found.
   */
  globalBest: number;
  /**
   * @deprecated Use globalBest instead.
   * Kept for backward compatibility with Longest Substring.
   */
  globalMax?: number;
  /** The best substring found (for display) */
  bestSubstring: string;
  /** Current window validity status */
  status: WindowStatus;
  /** Target frequency map for constraint-based problems (e.g., min-window-substring) */
  targetFrequencyMap?: Record<string, number> | undefined;
  /** Optimization objective for the current problem */
  objective?: OptimizationObjective;
}

/**
 * Options for creating initial sliding window state.
 */
export interface CreateSlidingWindowStateOptions {
  /** Target string for constraint-based problems */
  target?: string;
  /** Optimization objective (defaults to "max") */
  objective?: OptimizationObjective;
}

/**
 * Creates an initial sliding window state from an input string.
 * Supports both max (longest substring) and min (minimum window) objectives.
 */
export function createInitialSlidingWindowState(
  input: string,
  options: CreateSlidingWindowStateOptions = {}
): SlidingWindowState {
  const { target, objective = "max" } = options;

  // Build base state
  const baseState: SlidingWindowState = {
    data: input.split(""),
    window: {
      start: 0,
      end: -1, // Will be set to 0 on first expand
    },
    frequencyMap: {},
    globalBest: objective === "max" ? 0 : Number.POSITIVE_INFINITY,
    globalMax: 0, // Kept for backward compatibility
    bestSubstring: "",
    status: objective === "max" ? "valid" : "invalid", // Min starts invalid (missing chars)
    objective,
  };

  // Add target frequency map only if target is provided
  if (target) {
    baseState.targetFrequencyMap = target.split("").reduce(
      (acc, char) => {
        acc[char] = (acc[char] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
  }

  return baseState;
}

/**
 * Context passed to pattern problem generators.
 * Extended to support target-based constraints (e.g., min-window-substring).
 */
export interface PatternContext {
  /** The input string for the problem */
  input: string;
  /** Optional target string for problems like min-window-substring */
  target?: string;
  /** Pre-computed target frequency map (optional, will be computed from target if not provided) */
  targetFrequency?: Record<string, number>;
}

/**
 * Signature for pattern problem generator functions.
 */
export type PatternGenerator = (context: PatternContext) => Generator<PatternStep, void, unknown>;
