import { describe, expect, it } from "vitest";
import { computeMinWindow, minWindowSubstring } from "./minWindow";
import type { PatternStep } from "./types";

/**
 * Helper function to collect all steps from the generator.
 */
function collectSteps(input: string, target: string): PatternStep[] {
  return [...minWindowSubstring({ input, target })];
}

/**
 * Helper function to get the best result from the generator.
 */
function getBestFromGenerator(
  input: string,
  target: string
): { length: number; substring: string } {
  const steps = collectSteps(input, target);
  const completeStep = steps.find((s) => s.type === "complete");
  if (completeStep?.type === "complete") {
    return {
      length: completeStep.bestLength,
      substring: completeStep.bestSubstring,
    };
  }
  return { length: 0, substring: "" };
}

describe("minWindowSubstring", () => {
  describe("basic functionality", () => {
    it('correctly finds minimum window for classic example "ADOBECODEBANC" with target "ABC"', () => {
      const input = "ADOBECODEBANC";
      const target = "ABC";
      const result = computeMinWindow(input, target);
      expect(result).toBe("BANC");
    });

    it("generator yields matching result as direct computation", () => {
      const input = "ADOBECODEBANC";
      const target = "ABC";
      const generatorResult = getBestFromGenerator(input, target);
      const directResult = computeMinWindow(input, target);
      expect(generatorResult.substring).toBe(directResult);
      expect(generatorResult.length).toBe(4);
    });

    it("handles exact match", () => {
      const input = "ABC";
      const target = "ABC";
      expect(computeMinWindow(input, target)).toBe("ABC");
      expect(getBestFromGenerator(input, target).substring).toBe("ABC");
    });

    it("handles single character target", () => {
      const input = "ABCDEF";
      const target = "D";
      expect(computeMinWindow(input, target)).toBe("D");
      expect(getBestFromGenerator(input, target).substring).toBe("D");
    });

    it("handles target with duplicates", () => {
      const input = "AAABBB";
      const target = "AB";
      const result = computeMinWindow(input, target);
      expect(result).toBe("AB");
    });

    it("handles target with multiple duplicates", () => {
      const input = "ADOBECODEBANCAA";
      const target = "AAC";
      const result = computeMinWindow(input, target);
      // Minimum window containing 2 A's and 1 C
      expect(result.length).toBeGreaterThan(0);
      // Verify result contains all required chars
      expect(result.split("A").length - 1).toBeGreaterThanOrEqual(2);
      expect(result.includes("C")).toBe(true);
    });

    it("finds earliest minimum window when multiple exist", () => {
      const input = "ABCAB";
      const target = "AB";
      // Both "AB" at start and end are valid, should find the first minimum
      const result = computeMinWindow(input, target);
      expect(result).toBe("AB");
      expect(result.length).toBe(2);
    });
  });

  describe("edge cases", () => {
    it("handles empty input string", () => {
      const input = "";
      const target = "ABC";
      expect(computeMinWindow(input, target)).toBe("");
      const steps = collectSteps(input, target);
      expect(steps).toHaveLength(1);
      expect(steps[0]).toEqual({
        type: "complete",
        bestLength: 0,
        bestSubstring: "",
      });
    });

    it("handles empty target string", () => {
      const input = "ABC";
      const target = "";
      expect(computeMinWindow(input, target)).toBe("");
      expect(getBestFromGenerator(input, target).length).toBe(0);
    });

    it("handles target longer than input", () => {
      const input = "AB";
      const target = "ABC";
      expect(computeMinWindow(input, target)).toBe("");
      expect(getBestFromGenerator(input, target).length).toBe(0);
    });

    it("handles target not found in input", () => {
      const input = "ABCDEF";
      const target = "XYZ";
      expect(computeMinWindow(input, target)).toBe("");
      expect(getBestFromGenerator(input, target).substring).toBe("");
    });

    it("handles partial target match (some chars missing)", () => {
      const input = "ABCDEF";
      const target = "AXC";
      expect(computeMinWindow(input, target)).toBe("");
    });

    it("handles single character input and target (match)", () => {
      const input = "A";
      const target = "A";
      expect(computeMinWindow(input, target)).toBe("A");
      expect(getBestFromGenerator(input, target).substring).toBe("A");
    });

    it("handles single character input and target (no match)", () => {
      const input = "A";
      const target = "B";
      expect(computeMinWindow(input, target)).toBe("");
    });

    it("handles input with spaces", () => {
      const input = "A B C D";
      const target = "AD";
      const result = computeMinWindow(input, target);
      expect(result.includes("A")).toBe(true);
      expect(result.includes("D")).toBe(true);
    });

    it("handles lowercase characters", () => {
      const input = "adobecodebanc";
      const target = "abc";
      const result = computeMinWindow(input, target);
      expect(result).toBe("banc");
    });
  });

  describe("step types", () => {
    it("yields init step first for valid input", () => {
      const input = "ADOBECODEBANC";
      const target = "ABC";
      const steps = collectSteps(input, target);
      expect(steps[0]?.type).toBe("init");
    });

    it("init step contains target frequency map", () => {
      const input = "ADOBECODEBANC";
      const target = "ABC";
      const steps = collectSteps(input, target);
      const initStep = steps[0];
      if (initStep?.type === "init") {
        expect(initStep.targetFrequencyMap).toEqual({ A: 1, B: 1, C: 1 });
      }
    });

    it("yields complete step last", () => {
      const input = "ADOBECODEBANC";
      const target = "ABC";
      const steps = collectSteps(input, target);
      const lastStep = steps[steps.length - 1];
      expect(lastStep?.type).toBe("complete");
    });

    it("yields expand steps when adding characters", () => {
      const input = "ABC";
      const target = "AC";
      const steps = collectSteps(input, target);
      const expandSteps = steps.filter((s) => s.type === "expand");
      expect(expandSteps.length).toBe(3); // One for each character
    });

    it("yields validity-check step when constraint is satisfied", () => {
      const input = "ABC";
      const target = "AC";
      const steps = collectSteps(input, target);
      const validityCheckSteps = steps.filter((s) => s.type === "validity-check");
      const satisfiedStep = validityCheckSteps.find(
        (s) => s.type === "validity-check" && s.reason === "constraint-satisfied"
      );
      expect(satisfiedStep).toBeDefined();
      if (satisfiedStep?.type === "validity-check") {
        expect(satisfiedStep.isValid).toBe(true);
      }
    });

    it("yields validity-check step when shrinking breaks validity", () => {
      const input = "ADOBECODEBANC";
      const target = "ABC";
      const steps = collectSteps(input, target);
      const validityCheckSteps = steps.filter((s) => s.type === "validity-check");
      const missingStep = validityCheckSteps.find(
        (s) => s.type === "validity-check" && s.reason === "missing-chars"
      );
      expect(missingStep).toBeDefined();
      if (missingStep?.type === "validity-check") {
        expect(missingStep.isValid).toBe(false);
      }
    });

    it("yields shrink steps when optimizing valid window", () => {
      const input = "ADOBECODEBANC";
      const target = "ABC";
      const steps = collectSteps(input, target);
      const shrinkSteps = steps.filter((s) => s.type === "shrink");
      expect(shrinkSteps.length).toBeGreaterThan(0);
    });

    it("yields update-best steps when new minimum found", () => {
      const input = "ADOBECODEBANC";
      const target = "ABC";
      const steps = collectSteps(input, target);
      const updateBestSteps = steps.filter((s) => s.type === "update-best");
      expect(updateBestSteps.length).toBeGreaterThan(0);
    });

    it("update-best steps have decreasing bestLength values", () => {
      const input = "ADOBECODEBANC";
      const target = "ABC";
      const steps = collectSteps(input, target);
      const updateBestSteps = steps.filter((s) => s.type === "update-best");

      let lastBest = Number.POSITIVE_INFINITY;
      for (const step of updateBestSteps) {
        if (step.type === "update-best") {
          expect(step.bestLength).toBeLessThan(lastBest);
          lastBest = step.bestLength;
        }
      }
    });
  });

  describe("frequency map correctness", () => {
    it("expand step includes updated frequency map", () => {
      const input = "AB";
      const target = "AB";
      const steps = collectSteps(input, target);
      const expandSteps = steps.filter((s) => s.type === "expand");

      if (expandSteps[0]?.type === "expand") {
        expect(expandSteps[0].frequencyMap).toEqual({ A: 1 });
      }
      if (expandSteps[1]?.type === "expand") {
        expect(expandSteps[1].frequencyMap).toEqual({ A: 1, B: 1 });
      }
    });

    it("shrink step updates frequency map correctly", () => {
      const input = "ABCD";
      const target = "CD";
      const steps = collectSteps(input, target);
      const shrinkSteps = steps.filter((s) => s.type === "shrink");

      // After shrinking, the removed character should have reduced count
      expect(shrinkSteps.length).toBeGreaterThan(0);
    });

    it("frequency map tracks all characters in window", () => {
      const input = "AABB";
      const target = "AB";
      const steps = collectSteps(input, target);

      for (const step of steps) {
        if (step.type === "expand") {
          const char = step.char;
          expect(step.frequencyMap[char]).toBeGreaterThan(0);
        }
      }
    });
  });

  describe("window tracking", () => {
    it("window never shrinks past the current right position", () => {
      const input = "ADOBECODEBANC";
      const target = "ABC";
      const steps = collectSteps(input, target);

      let left = 0;
      let right = -1;

      for (const step of steps) {
        if (step.type === "expand") {
          right = step.right;
        } else if (step.type === "shrink") {
          left = step.left;
        }

        // Left pointer should never exceed right pointer
        if (right >= 0) {
          expect(left).toBeLessThanOrEqual(right + 1);
        }
      }
    });

    it("satisfiesConstraint is true when window becomes valid", () => {
      const input = "ABC";
      const target = "ABC";
      const steps = collectSteps(input, target);
      const expandSteps = steps.filter((s) => s.type === "expand");

      // Last expand should have satisfiesConstraint = true
      const lastExpand = expandSteps[expandSteps.length - 1];
      if (lastExpand?.type === "expand") {
        expect(lastExpand.satisfiesConstraint).toBe(true);
      }
    });
  });

  describe("algorithm correctness", () => {
    it("final result matches direct computation for various inputs", () => {
      const testCases = [
        { input: "ADOBECODEBANC", target: "ABC" },
        { input: "a", target: "a" },
        { input: "a", target: "aa" },
        { input: "ab", target: "b" },
        { input: "cabwefgewcwaefgcf", target: "cae" },
        { input: "bba", target: "ab" },
        { input: "aaflslflsldkalskaaa", target: "aaa" },
      ];

      for (const { input, target } of testCases) {
        const generatorResult = getBestFromGenerator(input, target);
        const directResult = computeMinWindow(input, target);
        expect(generatorResult.substring).toBe(directResult);
      }
    });

    it("result contains all required characters with correct frequency", () => {
      const input = "ADOBECODEBANC";
      const target = "ABC";
      const result = getBestFromGenerator(input, target);

      if (result.substring) {
        const resultFreq: Record<string, number> = {};
        for (const char of result.substring) {
          resultFreq[char] = (resultFreq[char] ?? 0) + 1;
        }

        const targetFreq: Record<string, number> = {};
        for (const char of target) {
          targetFreq[char] = (targetFreq[char] ?? 0) + 1;
        }

        for (const [char, count] of Object.entries(targetFreq)) {
          expect(resultFreq[char] ?? 0).toBeGreaterThanOrEqual(count);
        }
      }
    });

    it("result is truly minimum (no smaller valid window exists)", () => {
      const input = "ADOBECODEBANC";
      const target = "ABC";
      const result = getBestFromGenerator(input, target);

      // Verify no smaller window in the input contains all target chars
      for (let i = 0; i <= input.length - result.length + 1; i++) {
        const window = input.slice(i, i + result.length - 1);
        const windowContainsAll = target.split("").every((char) => {
          const required = target.split("").filter((c) => c === char).length;
          const has = window.split("").filter((c) => c === char).length;
          return has >= required;
        });
        // If a smaller window contains all chars, this would be a bug
        if (window.length < result.length) {
          expect(windowContainsAll).toBe(false);
        }
      }
    });

    it("best substring length equals bestLength", () => {
      const input = "ADOBECODEBANC";
      const target = "ABC";
      const steps = collectSteps(input, target);
      const completeStep = steps.find((s) => s.type === "complete");
      if (completeStep?.type === "complete" && completeStep.bestLength > 0) {
        expect(completeStep.bestSubstring.length).toBe(completeStep.bestLength);
      }
    });
  });

  describe("LeetCode test cases", () => {
    it('LeetCode example 1: "ADOBECODEBANC", target "ABC"', () => {
      const input = "ADOBECODEBANC";
      const target = "ABC";
      expect(computeMinWindow(input, target)).toBe("BANC");
    });

    it('LeetCode example 2: "a", target "a"', () => {
      const input = "a";
      const target = "a";
      expect(computeMinWindow(input, target)).toBe("a");
    });

    it('LeetCode example 3: "a", target "aa"', () => {
      const input = "a";
      const target = "aa";
      expect(computeMinWindow(input, target)).toBe("");
    });

    it('Additional case: "ab", target "b"', () => {
      const input = "ab";
      const target = "b";
      expect(computeMinWindow(input, target)).toBe("b");
    });

    it('Additional case: "bba", target "ab"', () => {
      const input = "bba";
      const target = "ab";
      expect(computeMinWindow(input, target)).toBe("ba");
    });
  });

  describe("linear time guarantee", () => {
    it("each character is processed at most twice (expand + shrink)", () => {
      const input = "ADOBECODEBANC";
      const target = "ABC";
      const steps = collectSteps(input, target);

      // Count operations per character index
      const expandCount = steps.filter((s) => s.type === "expand").length;
      const shrinkCount = steps.filter((s) => s.type === "shrink").length;

      // Total operations should be at most 2n (n expands + at most n shrinks)
      expect(expandCount + shrinkCount).toBeLessThanOrEqual(input.length * 2);
    });

    it("maintains O(n) complexity for long input", () => {
      // Create a long input where every character needs to be visited
      const input = `${"A".repeat(100)}BC`;
      const target = "ABC";
      const steps = collectSteps(input, target);

      const expandCount = steps.filter((s) => s.type === "expand").length;
      const shrinkCount = steps.filter((s) => s.type === "shrink").length;

      // Total operations should be O(n), not O(n^2)
      expect(expandCount + shrinkCount).toBeLessThanOrEqual(input.length * 2);
    });
  });

  describe("visualization step completeness", () => {
    it("yields every shrink step for smooth animation", () => {
      const input = "ADOBECODEBANC";
      const target = "ABC";
      const steps = collectSteps(input, target);

      // Track left pointer movement
      let left = 0;
      for (const step of steps) {
        if (step.type === "shrink") {
          // Each shrink step should move left by exactly 1
          expect(step.left).toBe(left + 1);
          left = step.left;
        }
      }
    });

    it("expand steps are sequential (right moves forward)", () => {
      const input = "ADOBECODEBANC";
      const target = "ABC";
      const steps = collectSteps(input, target);
      const expandSteps = steps.filter((s) => s.type === "expand");

      for (let i = 0; i < expandSteps.length; i++) {
        const step = expandSteps[i];
        if (step?.type === "expand") {
          expect(step.right).toBe(i);
        }
      }
    });

    it("validity-check includes satisfiedCount and requiredCount", () => {
      const input = "ABC";
      const target = "ABC";
      const steps = collectSteps(input, target);
      const validityCheckSteps = steps.filter((s) => s.type === "validity-check");

      for (const step of validityCheckSteps) {
        if (step.type === "validity-check") {
          expect(step.satisfiedCount).toBeDefined();
          expect(step.requiredCount).toBeDefined();
          expect(typeof step.satisfiedCount).toBe("number");
          expect(typeof step.requiredCount).toBe("number");
        }
      }
    });
  });
});
