import type { InterviewContext, InterviewStep } from "./types";

/**
 * Largest Rectangle in Histogram algorithm using the Monotonic Stack technique.
 *
 * Given an array of bar heights representing a histogram, finds the area of
 * the largest rectangle that can be formed within the histogram.
 *
 * Time Complexity: O(n) - each bar is pushed and popped at most once
 * Space Complexity: O(n) - stack can hold up to n elements
 *
 * The key insight is that for each bar, we need to find how far left and right
 * we can extend a rectangle of that bar's height. A monotonic increasing stack
 * efficiently tracks potential left boundaries.
 *
 * @param context - The interview context containing the heights array
 * @yields InterviewStep - Granular steps for visualization
 */
export function* largestRectangleHistogram(
  context: InterviewContext
): Generator<InterviewStep, void, unknown> {
  const { heights } = context;
  const n = heights.length;

  // Edge case: no bars means no area
  if (n === 0) {
    yield {
      type: "update-max-area",
      previousMax: 0,
      newMax: 0,
      rectangle: { left: 0, right: 0, height: 0 },
    };
    return;
  }

  // Monotonic stack stores indices of bars in increasing height order
  const stack: number[] = [];
  let maxArea = 0;
  let maxRectangle: { left: number; right: number; height: number } = {
    left: 0,
    right: 0,
    height: 0,
  };

  // Process all bars plus a sentinel (height 0) at the end to flush the stack
  for (let i = 0; i <= n; i++) {
    // Sentinel has height 0 to ensure all remaining bars get processed
    const currentHeight = i < n ? (heights[i] as number) : 0;

    // Pop bars from stack while current height is less than stack top
    // This means the bar at stack top can no longer extend right
    while (stack.length > 0) {
      const topIndex = stack[stack.length - 1] as number;
      const topHeight = heights[topIndex] as number;

      if (currentHeight >= topHeight) {
        break;
      }

      // Pop the bar - it cannot extend further right
      stack.pop();

      yield {
        type: "stack-pop",
        poppedIndex: topIndex,
        poppedHeight: topHeight,
        currentIndex: i,
        stack: [...stack],
      };

      // Calculate the rectangle area with popped bar's height
      // Left boundary: index after stack top (or -1 if stack empty)
      // Right boundary: current index (exclusive)
      const leftBound = stack.length > 0 ? (stack[stack.length - 1] as number) : -1;
      const rightBound = i;
      const width = rightBound - leftBound - 1;
      const area = topHeight * width;

      yield {
        type: "calculate-area",
        poppedIndex: topIndex,
        height: topHeight,
        leftBound,
        rightBound,
        width,
        area,
      };

      // Update max area if this rectangle is larger
      if (area > maxArea) {
        const previousMax = maxArea;
        maxArea = area;
        maxRectangle = {
          left: leftBound + 1,
          right: rightBound,
          height: topHeight,
        };

        yield {
          type: "update-max-area",
          previousMax,
          newMax: maxArea,
          rectangle: { ...maxRectangle },
        };
      }
    }

    // Push current bar onto stack (skip sentinel)
    if (i < n) {
      stack.push(i);

      yield {
        type: "stack-push",
        index: i,
        height: currentHeight,
        stack: [...stack],
      };
    }
  }
}

/**
 * Computes the largest rectangle area without yielding steps.
 * Useful for verification and testing.
 *
 * @param heights - The histogram bar heights array
 * @returns The maximum rectangle area
 */
export function computeLargestRectangle(heights: number[]): number {
  const n = heights.length;

  if (n === 0) {
    return 0;
  }

  const stack: number[] = [];
  let maxArea = 0;

  for (let i = 0; i <= n; i++) {
    const currentHeight = i < n ? (heights[i] as number) : 0;

    while (stack.length > 0) {
      const topIndex = stack[stack.length - 1] as number;
      const topHeight = heights[topIndex] as number;

      if (currentHeight >= topHeight) {
        break;
      }

      stack.pop();

      const leftBound = stack.length > 0 ? (stack[stack.length - 1] as number) : -1;
      const width = i - leftBound - 1;
      const area = topHeight * width;

      if (area > maxArea) {
        maxArea = area;
      }
    }

    if (i < n) {
      stack.push(i);
    }
  }

  return maxArea;
}
