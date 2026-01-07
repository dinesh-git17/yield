/**
 * Interview problem types supported by Yield.
 * Start with "trapping-rain-water" and expand as needed.
 */
export type InterviewProblemType = "trapping-rain-water";

/**
 * Represents a single step in an interview problem algorithm execution.
 * Used by generator functions to yield operations for visualization.
 *
 * Step types for Trapping Rain Water (Two Pointers):
 * - init: Initialize pointers and max trackers
 * - compare: Compare heights at left and right pointers
 * - move-left: Move left pointer inward
 * - move-right: Move right pointer inward
 * - update-max-left: Update the maximum height seen from the left
 * - update-max-right: Update the maximum height seen from the right
 * - fill-water: Calculate and fill water at current position
 * - complete: Algorithm has finished
 */
export type InterviewStep =
  | {
      type: "init";
      /** Initial left pointer index */
      left: number;
      /** Initial right pointer index */
      right: number;
      /** Initial max left height */
      maxLeft: number;
      /** Initial max right height */
      maxRight: number;
    }
  | {
      type: "compare";
      /** Index being compared (left or right) */
      left: number;
      right: number;
      /** Which side has smaller max (determines which pointer moves) */
      smallerSide: "left" | "right";
    }
  | {
      type: "move-left";
      /** Previous left pointer index */
      from: number;
      /** New left pointer index */
      to: number;
    }
  | {
      type: "move-right";
      /** Previous right pointer index */
      from: number;
      /** New right pointer index */
      to: number;
    }
  | {
      type: "update-max-left";
      /** Index where new max was found */
      index: number;
      /** Previous max value */
      previousMax: number;
      /** New max value */
      newMax: number;
    }
  | {
      type: "update-max-right";
      /** Index where new max was found */
      index: number;
      /** Previous max value */
      previousMax: number;
      /** New max value */
      newMax: number;
    }
  | {
      type: "fill-water";
      /** Index where water is being trapped */
      index: number;
      /** Amount of water trapped at this index */
      waterAmount: number;
      /** Running total of water trapped */
      totalWater: number;
      /** Which side this fill occurred on */
      side: "left" | "right";
    }
  | {
      type: "complete";
      /** Final total water trapped */
      totalWater: number;
    };

/**
 * State tracked during Trapping Rain Water visualization.
 */
export interface RainWaterState {
  /** The terrain heights array */
  heights: number[];
  /** Water level at each index (computed incrementally) */
  waterLevels: number[];
  /** Current left pointer position */
  left: number;
  /** Current right pointer position */
  right: number;
  /** Maximum height seen from the left so far */
  maxLeft: number;
  /** Maximum height seen from the right so far */
  maxRight: number;
  /** Running total of trapped water */
  totalWater: number;
}

/**
 * Creates an initial rain water state from a heights array.
 */
export function createInitialRainWaterState(heights: number[]): RainWaterState {
  return {
    heights: [...heights],
    waterLevels: new Array(heights.length).fill(0) as number[],
    left: 0,
    right: heights.length - 1,
    maxLeft: 0,
    maxRight: 0,
    totalWater: 0,
  };
}

/**
 * Context passed to interview problem generators.
 */
export interface InterviewContext {
  /** The input array for the problem */
  heights: number[];
}

/**
 * Signature for interview problem generator functions.
 */
export type InterviewGenerator = (
  context: InterviewContext
) => Generator<InterviewStep, void, unknown>;
