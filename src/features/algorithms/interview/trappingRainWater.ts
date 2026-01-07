import type { InterviewContext, InterviewStep } from "./types";

/**
 * Trapping Rain Water algorithm using the Two Pointers technique.
 *
 * Given an array representing elevation heights, calculates how much
 * rainwater can be trapped between the bars after raining.
 *
 * Time Complexity: O(n) - single pass through the array
 * Space Complexity: O(1) - only using pointers and max trackers
 *
 * The key insight is that water trapped at any position depends on the
 * minimum of the maximum heights on its left and right sides, minus
 * the height at that position.
 *
 * @param context - The interview context containing the heights array
 * @yields InterviewStep - Granular steps for visualization
 */
export function* trappingRainWater(
  context: InterviewContext
): Generator<InterviewStep, void, unknown> {
  const { heights } = context;
  const n = heights.length;

  // Edge case: need at least 3 bars to trap water
  if (n < 3) {
    yield { type: "complete", totalWater: 0 };
    return;
  }

  // Initialize two pointers at the extremes
  let left = 0;
  let right = n - 1;

  // Track maximum heights seen from each side
  // These are guaranteed to exist since n >= 3
  let maxLeft = heights[left] as number;
  let maxRight = heights[right] as number;

  let totalWater = 0;

  // Yield initial state
  yield {
    type: "init",
    left,
    right,
    maxLeft,
    maxRight,
  };

  // Process until pointers meet
  while (left < right) {
    // Determine which side to process based on smaller max
    const smallerSide = maxLeft <= maxRight ? "left" : "right";

    yield {
      type: "compare",
      left,
      right,
      smallerSide,
    };

    if (maxLeft <= maxRight) {
      // Process left side - water level is bounded by maxLeft
      const prevLeft = left;
      left++;

      yield {
        type: "move-left",
        from: prevLeft,
        to: left,
      };

      // heights[left] is guaranteed valid since left < right and right < n
      const currentHeight = heights[left] as number;

      if (currentHeight > maxLeft) {
        // Found a new max on the left - no water trapped here
        const previousMax = maxLeft;
        maxLeft = currentHeight;

        yield {
          type: "update-max-left",
          index: left,
          previousMax,
          newMax: maxLeft,
        };
      } else {
        // Water can be trapped at this position
        const waterAmount = maxLeft - currentHeight;
        if (waterAmount > 0) {
          totalWater += waterAmount;

          yield {
            type: "fill-water",
            index: left,
            waterAmount,
            totalWater,
            side: "left",
          };
        }
      }
    } else {
      // Process right side - water level is bounded by maxRight
      const prevRight = right;
      right--;

      yield {
        type: "move-right",
        from: prevRight,
        to: right,
      };

      // heights[right] is guaranteed valid since left < right and left >= 0
      const currentHeight = heights[right] as number;

      if (currentHeight > maxRight) {
        // Found a new max on the right - no water trapped here
        const previousMax = maxRight;
        maxRight = currentHeight;

        yield {
          type: "update-max-right",
          index: right,
          previousMax,
          newMax: maxRight,
        };
      } else {
        // Water can be trapped at this position
        const waterAmount = maxRight - currentHeight;
        if (waterAmount > 0) {
          totalWater += waterAmount;

          yield {
            type: "fill-water",
            index: right,
            waterAmount,
            totalWater,
            side: "right",
          };
        }
      }
    }
  }

  // Algorithm complete
  yield { type: "complete", totalWater };
}

/**
 * Computes the total trapped water without yielding steps.
 * Useful for verification and testing.
 *
 * @param heights - The elevation heights array
 * @returns The total amount of water that can be trapped
 */
export function computeTrappedWater(heights: number[]): number {
  const n = heights.length;

  if (n < 3) {
    return 0;
  }

  let left = 0;
  let right = n - 1;
  let maxLeft = heights[left] as number;
  let maxRight = heights[right] as number;
  let totalWater = 0;

  while (left < right) {
    if (maxLeft <= maxRight) {
      left++;
      const currentHeight = heights[left] as number;
      if (currentHeight > maxLeft) {
        maxLeft = currentHeight;
      } else {
        totalWater += maxLeft - currentHeight;
      }
    } else {
      right--;
      const currentHeight = heights[right] as number;
      if (currentHeight > maxRight) {
        maxRight = currentHeight;
      } else {
        totalWater += maxRight - currentHeight;
      }
    }
  }

  return totalWater;
}
