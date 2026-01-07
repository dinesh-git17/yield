import { describe, expect, it } from "vitest";
import { computeLargestRectangle, largestRectangleHistogram } from "./largestRectangleHistogram";
import type { InterviewStep } from "./types";

/**
 * Helper function to collect all steps from the generator.
 */
function collectSteps(heights: number[]): InterviewStep[] {
  return [...largestRectangleHistogram({ heights })];
}

/**
 * Helper function to get the final max area from the generator.
 */
function getMaxAreaFromGenerator(heights: number[]): number {
  const steps = collectSteps(heights);
  const updateMaxSteps = steps.filter((s) => s.type === "update-max-area");
  if (updateMaxSteps.length === 0) {
    return 0;
  }
  const lastUpdateStep = updateMaxSteps[updateMaxSteps.length - 1];
  if (lastUpdateStep?.type === "update-max-area") {
    return lastUpdateStep.newMax;
  }
  return 0;
}

describe("largestRectangleHistogram", () => {
  describe("basic functionality", () => {
    it("correctly calculates area for the classic example [2,1,5,6,2,3]", () => {
      const heights = [2, 1, 5, 6, 2, 3];
      const area = computeLargestRectangle(heights);
      expect(area).toBe(10);
    });

    it("generator yields matching area as direct computation", () => {
      const heights = [2, 1, 5, 6, 2, 3];
      const generatorArea = getMaxAreaFromGenerator(heights);
      const directArea = computeLargestRectangle(heights);
      expect(generatorArea).toBe(directArea);
      expect(generatorArea).toBe(10);
    });

    it("handles uniform heights [2, 2, 2, 2]", () => {
      const heights = [2, 2, 2, 2];
      expect(computeLargestRectangle(heights)).toBe(8);
      expect(getMaxAreaFromGenerator(heights)).toBe(8);
    });

    it("handles strictly ascending [1, 2, 3, 4, 5]", () => {
      // Max rectangle: height 3 * width 3 = 9 (bars at indices 2,3,4 with height 3)
      // Actually: height 1 * width 5 = 5, or height 2 * 4 = 8, or height 3 * 3 = 9, etc.
      const heights = [1, 2, 3, 4, 5];
      expect(computeLargestRectangle(heights)).toBe(9);
    });

    it("handles strictly descending [5, 4, 3, 2, 1]", () => {
      // Max: height 3 * width 3 = 9 (bars at indices 0,1,2 with height 3)
      const heights = [5, 4, 3, 2, 1];
      expect(computeLargestRectangle(heights)).toBe(9);
    });

    it("handles pyramid shape [1, 2, 3, 2, 1]", () => {
      // Max: height 2 * width 3 = 6 (bars at indices 1,2,3)
      const heights = [1, 2, 3, 2, 1];
      expect(computeLargestRectangle(heights)).toBe(6);
    });

    it("handles valley shape [3, 1, 3]", () => {
      // Max: height 3 * width 1 = 3, or height 1 * width 3 = 3
      const heights = [3, 1, 3];
      expect(computeLargestRectangle(heights)).toBe(3);
    });

    it("handles deep pool [5, 1, 1, 1, 5]", () => {
      // Max: height 5 * width 1 = 5, or height 1 * width 5 = 5
      const heights = [5, 1, 1, 1, 5];
      expect(computeLargestRectangle(heights)).toBe(5);
    });

    it("handles single tall bar surrounded by short [1, 5, 1]", () => {
      const heights = [1, 5, 1];
      expect(computeLargestRectangle(heights)).toBe(5);
    });
  });

  describe("edge cases", () => {
    it("handles empty array", () => {
      const heights: number[] = [];
      expect(computeLargestRectangle(heights)).toBe(0);
      const steps = collectSteps(heights);
      // Should yield a single update-max-area with 0
      expect(steps).toHaveLength(1);
      expect(steps[0]?.type).toBe("update-max-area");
      if (steps[0]?.type === "update-max-area") {
        expect(steps[0].newMax).toBe(0);
      }
    });

    it("handles single element", () => {
      const heights = [5];
      expect(computeLargestRectangle(heights)).toBe(5);
      expect(getMaxAreaFromGenerator(heights)).toBe(5);
    });

    it("handles two elements", () => {
      const heights = [5, 3];
      // Max: height 5 * 1 = 5, or height 3 * 2 = 6
      expect(computeLargestRectangle(heights)).toBe(6);
    });

    it("handles all zeros", () => {
      const heights = [0, 0, 0, 0, 0];
      expect(computeLargestRectangle(heights)).toBe(0);
    });

    it("handles single bar in the middle [0, 5, 0]", () => {
      const heights = [0, 5, 0];
      expect(computeLargestRectangle(heights)).toBe(5);
    });

    it("handles all same heights [4, 4, 4]", () => {
      const heights = [4, 4, 4];
      expect(computeLargestRectangle(heights)).toBe(12);
    });
  });

  describe("step types", () => {
    it("yields stack-push steps when bars are added", () => {
      const heights = [2, 1, 5, 6, 2, 3];
      const steps = collectSteps(heights);
      const pushSteps = steps.filter((s) => s.type === "stack-push");
      // Each bar should be pushed once
      expect(pushSteps).toHaveLength(6);
    });

    it("yields stack-pop steps when bars are removed", () => {
      const heights = [2, 1, 5, 6, 2, 3];
      const steps = collectSteps(heights);
      const popSteps = steps.filter((s) => s.type === "stack-pop");
      expect(popSteps.length).toBeGreaterThan(0);
    });

    it("yields calculate-area steps after each pop", () => {
      const heights = [2, 1, 5, 6, 2, 3];
      const steps = collectSteps(heights);
      const popSteps = steps.filter((s) => s.type === "stack-pop");
      const calcSteps = steps.filter((s) => s.type === "calculate-area");
      // Each pop should be followed by a calculate-area
      expect(calcSteps.length).toBe(popSteps.length);
    });

    it("yields update-max-area when a larger rectangle is found", () => {
      const heights = [2, 1, 5, 6, 2, 3];
      const steps = collectSteps(heights);
      const updateSteps = steps.filter((s) => s.type === "update-max-area");
      expect(updateSteps.length).toBeGreaterThan(0);
    });

    it("push step includes correct stack state", () => {
      const heights = [1, 2, 3];
      const steps = collectSteps(heights);
      const pushSteps = steps.filter((s) => s.type === "stack-push");

      // First push: stack should be [0]
      if (pushSteps[0]?.type === "stack-push") {
        expect(pushSteps[0].index).toBe(0);
        expect(pushSteps[0].stack).toEqual([0]);
      }

      // Second push: stack should be [0, 1]
      if (pushSteps[1]?.type === "stack-push") {
        expect(pushSteps[1].index).toBe(1);
        expect(pushSteps[1].stack).toEqual([0, 1]);
      }

      // Third push: stack should be [0, 1, 2]
      if (pushSteps[2]?.type === "stack-push") {
        expect(pushSteps[2].index).toBe(2);
        expect(pushSteps[2].stack).toEqual([0, 1, 2]);
      }
    });

    it("pop step includes current index that triggered pop", () => {
      const heights = [3, 1];
      const steps = collectSteps(heights);
      const popSteps = steps.filter((s) => s.type === "stack-pop");

      // Height 3 gets popped when we see height 1 at index 1
      if (popSteps[0]?.type === "stack-pop") {
        expect(popSteps[0].poppedIndex).toBe(0);
        expect(popSteps[0].poppedHeight).toBe(3);
        expect(popSteps[0].currentIndex).toBe(1);
      }
    });
  });

  describe("algorithm correctness", () => {
    it("stack maintains monotonic increasing property (by height)", () => {
      const heights = [2, 1, 5, 6, 2, 3];
      const steps = collectSteps(heights);

      // Track stack state after each push and verify monotonicity
      for (const step of steps) {
        if (step.type === "stack-push") {
          const stackHeights = step.stack.map((idx) => heights[idx] as number);
          for (let i = 1; i < stackHeights.length; i++) {
            expect(stackHeights[i]).toBeGreaterThanOrEqual(stackHeights[i - 1] as number);
          }
        }
      }
    });

    it("each bar is pushed exactly once", () => {
      const heights = [2, 1, 5, 6, 2, 3];
      const steps = collectSteps(heights);
      const pushSteps = steps.filter((s) => s.type === "stack-push");
      const pushedIndices = pushSteps.map((s) => (s.type === "stack-push" ? s.index : -1));

      // Should push each index 0 through n-1 exactly once
      expect(pushedIndices.sort((a, b) => a - b)).toEqual([0, 1, 2, 3, 4, 5]);
    });

    it("each bar is popped at most once", () => {
      const heights = [2, 1, 5, 6, 2, 3];
      const steps = collectSteps(heights);
      const popSteps = steps.filter((s) => s.type === "stack-pop");
      const poppedIndices = popSteps.map((s) => (s.type === "stack-pop" ? s.poppedIndex : -1));

      // No duplicates in popped indices
      const uniquePopped = new Set(poppedIndices);
      expect(uniquePopped.size).toBe(poppedIndices.length);
    });

    it("max area updates are monotonically increasing", () => {
      const heights = [2, 1, 5, 6, 2, 3];
      const steps = collectSteps(heights);
      const updateSteps = steps.filter((s) => s.type === "update-max-area");

      let lastMax = 0;
      for (const step of updateSteps) {
        if (step.type === "update-max-area") {
          expect(step.newMax).toBeGreaterThan(lastMax);
          expect(step.previousMax).toBe(lastMax);
          lastMax = step.newMax;
        }
      }
    });

    it("width calculation is correct (rightBound - leftBound - 1)", () => {
      const heights = [2, 1, 5, 6, 2, 3];
      const steps = collectSteps(heights);
      const calcSteps = steps.filter((s) => s.type === "calculate-area");

      for (const step of calcSteps) {
        if (step.type === "calculate-area") {
          expect(step.width).toBe(step.rightBound - step.leftBound - 1);
          expect(step.area).toBe(step.height * step.width);
        }
      }
    });
  });

  describe("LeetCode test cases", () => {
    it("LeetCode example 1: [2,1,5,6,2,3] -> 10", () => {
      const heights = [2, 1, 5, 6, 2, 3];
      expect(computeLargestRectangle(heights)).toBe(10);
    });

    it("LeetCode example 2: [2,4] -> 4", () => {
      const heights = [2, 4];
      expect(computeLargestRectangle(heights)).toBe(4);
    });

    it("additional test: [6,2,5,4,5,1,6] -> 12", () => {
      // Max: height 4 spanning indices 2-4 (width 3) = 12
      const heights = [6, 2, 5, 4, 5, 1, 6];
      expect(computeLargestRectangle(heights)).toBe(12);
    });

    it("additional test: [1,1,1,1,1,1,1,1] -> 8", () => {
      const heights = [1, 1, 1, 1, 1, 1, 1, 1];
      expect(computeLargestRectangle(heights)).toBe(8);
    });

    it("additional test: [4,2,0,3,2,5] -> 6", () => {
      const heights = [4, 2, 0, 3, 2, 5];
      expect(computeLargestRectangle(heights)).toBe(6);
    });
  });

  describe("rectangle bounds in update-max-area", () => {
    it("rectangle bounds are inclusive-exclusive [left, right)", () => {
      const heights = [2, 1, 5, 6, 2, 3];
      const steps = collectSteps(heights);
      const updateSteps = steps.filter((s) => s.type === "update-max-area");

      for (const step of updateSteps) {
        if (step.type === "update-max-area") {
          const { left, right, height } = step.rectangle;
          // Width should be right - left
          const width = right - left;
          expect(width * height).toBe(step.newMax);
        }
      }
    });

    it("final max rectangle matches the computed max area", () => {
      const heights = [2, 1, 5, 6, 2, 3];
      const steps = collectSteps(heights);
      const updateSteps = steps.filter((s) => s.type === "update-max-area");

      const lastUpdate = updateSteps[updateSteps.length - 1];
      if (lastUpdate?.type === "update-max-area") {
        expect(lastUpdate.newMax).toBe(computeLargestRectangle(heights));
      }
    });
  });
});
