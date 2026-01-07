import { describe, expect, it } from "vitest";
import { computeTrappedWater, trappingRainWater } from "./trappingRainWater";
import type { InterviewStep } from "./types";

/**
 * Helper function to collect all steps from the generator.
 */
function collectSteps(heights: number[]): InterviewStep[] {
  return [...trappingRainWater({ heights })];
}

/**
 * Helper function to get the final total from the generator.
 */
function getTotalFromGenerator(heights: number[]): number {
  const steps = collectSteps(heights);
  const completeStep = steps.find((s) => s.type === "complete");
  if (completeStep?.type === "complete") {
    return completeStep.totalWater;
  }
  return 0;
}

describe("trappingRainWater", () => {
  describe("basic functionality", () => {
    it("correctly calculates water for the classic example [0,1,0,2,1,0,1,3,2,1,2,1]", () => {
      const heights = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1];
      const total = computeTrappedWater(heights);
      expect(total).toBe(6);
    });

    it("generator yields matching total as direct computation", () => {
      const heights = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1];
      const generatorTotal = getTotalFromGenerator(heights);
      const directTotal = computeTrappedWater(heights);
      expect(generatorTotal).toBe(directTotal);
      expect(generatorTotal).toBe(6);
    });

    it("handles a simple valley [3, 0, 3]", () => {
      const heights = [3, 0, 3];
      expect(computeTrappedWater(heights)).toBe(3);
      expect(getTotalFromGenerator(heights)).toBe(3);
    });

    it("handles symmetric valley [5, 2, 1, 2, 1, 2, 5]", () => {
      // Water: idx1=3, idx2=4, idx3=3, idx4=4, idx5=3 = 17
      const heights = [5, 2, 1, 2, 1, 2, 5];
      expect(computeTrappedWater(heights)).toBe(17);
    });

    it("handles stairs going up [1, 2, 3, 4, 5]", () => {
      // No water can be trapped on ascending stairs
      const heights = [1, 2, 3, 4, 5];
      expect(computeTrappedWater(heights)).toBe(0);
    });

    it("handles stairs going down [5, 4, 3, 2, 1]", () => {
      // No water can be trapped on descending stairs
      const heights = [5, 4, 3, 2, 1];
      expect(computeTrappedWater(heights)).toBe(0);
    });

    it("handles mountain shape [1, 2, 3, 2, 1]", () => {
      // No water can be trapped on a mountain
      const heights = [1, 2, 3, 2, 1];
      expect(computeTrappedWater(heights)).toBe(0);
    });

    it("handles flat terrain [3, 3, 3, 3]", () => {
      const heights = [3, 3, 3, 3];
      expect(computeTrappedWater(heights)).toBe(0);
    });

    it("handles deep pool [5, 0, 0, 0, 5]", () => {
      const heights = [5, 0, 0, 0, 5];
      expect(computeTrappedWater(heights)).toBe(15);
    });
  });

  describe("edge cases", () => {
    it("handles empty array", () => {
      const heights: number[] = [];
      expect(computeTrappedWater(heights)).toBe(0);
      const steps = collectSteps(heights);
      expect(steps).toHaveLength(1);
      expect(steps[0]).toEqual({ type: "complete", totalWater: 0 });
    });

    it("handles single element", () => {
      const heights = [5];
      expect(computeTrappedWater(heights)).toBe(0);
      const steps = collectSteps(heights);
      expect(steps).toHaveLength(1);
      expect(steps[0]).toEqual({ type: "complete", totalWater: 0 });
    });

    it("handles two elements", () => {
      const heights = [5, 3];
      expect(computeTrappedWater(heights)).toBe(0);
      const steps = collectSteps(heights);
      expect(steps).toHaveLength(1);
      expect(steps[0]).toEqual({ type: "complete", totalWater: 0 });
    });

    it("handles all zeros", () => {
      const heights = [0, 0, 0, 0, 0];
      expect(computeTrappedWater(heights)).toBe(0);
    });

    it("handles single bar in the middle", () => {
      const heights = [0, 0, 5, 0, 0];
      expect(computeTrappedWater(heights)).toBe(0);
    });
  });

  describe("step types", () => {
    it("yields init step first for valid input", () => {
      const heights = [3, 0, 3];
      const steps = collectSteps(heights);
      expect(steps[0]?.type).toBe("init");
    });

    it("yields complete step last", () => {
      const heights = [3, 0, 3];
      const steps = collectSteps(heights);
      const lastStep = steps[steps.length - 1];
      expect(lastStep?.type).toBe("complete");
    });

    it("yields compare steps to explain algorithm decisions", () => {
      const heights = [3, 0, 2];
      const steps = collectSteps(heights);
      const compareSteps = steps.filter((s) => s.type === "compare");
      expect(compareSteps.length).toBeGreaterThan(0);
    });

    it("yields fill-water steps with correct amounts", () => {
      const heights = [3, 0, 3];
      const steps = collectSteps(heights);
      const fillSteps = steps.filter((s) => s.type === "fill-water");
      expect(fillSteps.length).toBe(1);
      if (fillSteps[0]?.type === "fill-water") {
        expect(fillSteps[0].waterAmount).toBe(3);
        expect(fillSteps[0].index).toBe(1);
      }
    });

    it("yields move-left and move-right steps", () => {
      const heights = [2, 0, 0, 2];
      const steps = collectSteps(heights);
      const moveLeftSteps = steps.filter((s) => s.type === "move-left");
      const moveRightSteps = steps.filter((s) => s.type === "move-right");
      expect(moveLeftSteps.length + moveRightSteps.length).toBeGreaterThan(0);
    });

    it("yields update-max steps when new maximums are found", () => {
      const heights = [1, 3, 2, 4, 3, 5];
      const steps = collectSteps(heights);
      const updateMaxSteps = steps.filter(
        (s) => s.type === "update-max-left" || s.type === "update-max-right"
      );
      expect(updateMaxSteps.length).toBeGreaterThan(0);
    });
  });

  describe("algorithm correctness", () => {
    it("total water equals sum of individual fill-water amounts", () => {
      const heights = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1];
      const steps = collectSteps(heights);
      const fillSteps = steps.filter((s) => s.type === "fill-water");
      const summedWater = fillSteps.reduce((sum, step) => {
        if (step.type === "fill-water") {
          return sum + step.waterAmount;
        }
        return sum;
      }, 0);

      const completeStep = steps.find((s) => s.type === "complete");
      if (completeStep?.type === "complete") {
        expect(summedWater).toBe(completeStep.totalWater);
      }
    });

    it("running total in fill-water steps is monotonically increasing", () => {
      const heights = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1];
      const steps = collectSteps(heights);
      const fillSteps = steps.filter((s) => s.type === "fill-water");

      let lastTotal = 0;
      for (const step of fillSteps) {
        if (step.type === "fill-water") {
          expect(step.totalWater).toBeGreaterThanOrEqual(lastTotal);
          lastTotal = step.totalWater;
        }
      }
    });

    it("pointers never cross (left <= right throughout)", () => {
      const heights = [4, 2, 0, 3, 2, 5];
      const steps = collectSteps(heights);

      let left = 0;
      let right = heights.length - 1;

      for (const step of steps) {
        if (step.type === "move-left") {
          left = step.to;
        } else if (step.type === "move-right") {
          right = step.to;
        }
        expect(left).toBeLessThanOrEqual(right);
      }
    });
  });

  describe("LeetCode test cases", () => {
    it("LeetCode example 1: [0,1,0,2,1,0,1,3,2,1,2,1]", () => {
      const heights = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1];
      expect(computeTrappedWater(heights)).toBe(6);
    });

    it("LeetCode example 2: [4,2,0,3,2,5]", () => {
      const heights = [4, 2, 0, 3, 2, 5];
      expect(computeTrappedWater(heights)).toBe(9);
    });
  });
});
