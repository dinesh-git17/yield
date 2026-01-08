import { describe, expect, it } from "vitest";
import { computeLongestSubstring, slidingWindow } from "./slidingWindow";
import type { PatternStep } from "./types";

/**
 * Helper function to collect all steps from the generator.
 */
function collectSteps(input: string): PatternStep[] {
  return [...slidingWindow({ input })];
}

/**
 * Helper function to get the final max length from the generator.
 * Uses bestLength (new generic field) with maxLength fallback for compatibility.
 */
function getMaxFromGenerator(input: string): number {
  const steps = collectSteps(input);
  const completeStep = steps.find((s) => s.type === "complete");
  if (completeStep?.type === "complete") {
    return completeStep.bestLength ?? completeStep.maxLength ?? 0;
  }
  return 0;
}

/**
 * Helper function to get the best substring from the generator.
 */
function getBestSubstringFromGenerator(input: string): string {
  const steps = collectSteps(input);
  const completeStep = steps.find((s) => s.type === "complete");
  if (completeStep?.type === "complete") {
    return completeStep.bestSubstring;
  }
  return "";
}

describe("slidingWindow", () => {
  describe("basic functionality", () => {
    it('correctly calculates length for classic example "abcabcbb"', () => {
      const input = "abcabcbb";
      const length = computeLongestSubstring(input);
      expect(length).toBe(3); // "abc"
    });

    it("generator yields matching length as direct computation", () => {
      const input = "abcabcbb";
      const generatorLength = getMaxFromGenerator(input);
      const directLength = computeLongestSubstring(input);
      expect(generatorLength).toBe(directLength);
      expect(generatorLength).toBe(3);
    });

    it('handles all same characters "bbbbb"', () => {
      const input = "bbbbb";
      expect(computeLongestSubstring(input)).toBe(1);
      expect(getMaxFromGenerator(input)).toBe(1);
    });

    it('handles "pwwkew" (max is "wke" or "kew")', () => {
      const input = "pwwkew";
      expect(computeLongestSubstring(input)).toBe(3);
      expect(getMaxFromGenerator(input)).toBe(3);
    });

    it('handles all unique characters "abcdefgh"', () => {
      const input = "abcdefgh";
      expect(computeLongestSubstring(input)).toBe(8);
      expect(getMaxFromGenerator(input)).toBe(8);
    });

    it('handles "dvdf" (max is "vdf")', () => {
      const input = "dvdf";
      expect(computeLongestSubstring(input)).toBe(3);
    });

    it('handles alternating pattern "ababab"', () => {
      const input = "ababab";
      expect(computeLongestSubstring(input)).toBe(2); // "ab"
    });

    it('handles repeating pairs "aabb"', () => {
      const input = "aabb";
      expect(computeLongestSubstring(input)).toBe(2); // "ab"
    });
  });

  describe("edge cases", () => {
    it("handles empty string", () => {
      const input = "";
      expect(computeLongestSubstring(input)).toBe(0);
      const steps = collectSteps(input);
      expect(steps).toHaveLength(1);
      expect(steps[0]).toEqual({
        type: "complete",
        bestLength: 0,
        bestSubstring: "",
        maxLength: 0, // @deprecated - kept for backward compatibility
      });
    });

    it("handles single character", () => {
      const input = "a";
      expect(computeLongestSubstring(input)).toBe(1);
      expect(getMaxFromGenerator(input)).toBe(1);
      expect(getBestSubstringFromGenerator(input)).toBe("a");
    });

    it("handles two unique characters", () => {
      const input = "ab";
      expect(computeLongestSubstring(input)).toBe(2);
      expect(getMaxFromGenerator(input)).toBe(2);
    });

    it("handles two same characters", () => {
      const input = "aa";
      expect(computeLongestSubstring(input)).toBe(1);
      expect(getMaxFromGenerator(input)).toBe(1);
    });

    it("handles spaces in string", () => {
      const input = "a b c";
      expect(computeLongestSubstring(input)).toBe(3); // "a b" or "b c"
    });

    it("handles special characters", () => {
      const input = "a!@#$%";
      expect(computeLongestSubstring(input)).toBe(6);
    });
  });

  describe("step types", () => {
    it("yields init step first for valid input", () => {
      const input = "abc";
      const steps = collectSteps(input);
      expect(steps[0]?.type).toBe("init");
    });

    it("yields complete step last", () => {
      const input = "abc";
      const steps = collectSteps(input);
      const lastStep = steps[steps.length - 1];
      expect(lastStep?.type).toBe("complete");
    });

    it("yields expand steps when adding characters", () => {
      const input = "abc";
      const steps = collectSteps(input);
      const expandSteps = steps.filter((s) => s.type === "expand");
      expect(expandSteps.length).toBe(3); // One for each character
    });

    it("yields validity-check step when duplicate detected", () => {
      const input = "abca";
      const steps = collectSteps(input);
      const validityCheckSteps = steps.filter((s) => s.type === "validity-check");
      expect(validityCheckSteps.length).toBe(1);
      if (validityCheckSteps[0]?.type === "validity-check") {
        expect(validityCheckSteps[0].char).toBe("a");
        expect(validityCheckSteps[0].isValid).toBe(false);
        expect(validityCheckSteps[0].reason).toBe("duplicate");
      }
    });

    it("yields shrink steps after finding duplicate", () => {
      const input = "abca";
      const steps = collectSteps(input);
      const shrinkSteps = steps.filter((s) => s.type === "shrink");
      expect(shrinkSteps.length).toBeGreaterThan(0);
    });

    it("yields update-best steps when new maximum found", () => {
      const input = "abc";
      const steps = collectSteps(input);
      const updateBestSteps = steps.filter((s) => s.type === "update-best");
      expect(updateBestSteps.length).toBeGreaterThan(0);
    });

    it("update-best steps have increasing bestLength values", () => {
      const input = "abcdef";
      const steps = collectSteps(input);
      const updateBestSteps = steps.filter((s) => s.type === "update-best");

      let lastBest = 0;
      for (const step of updateBestSteps) {
        if (step.type === "update-best") {
          expect(step.bestLength).toBeGreaterThan(lastBest);
          lastBest = step.bestLength;
        }
      }
    });
  });

  describe("frequency map correctness", () => {
    it("expand step includes updated frequency map", () => {
      const input = "ab";
      const steps = collectSteps(input);
      const expandSteps = steps.filter((s) => s.type === "expand");

      if (expandSteps[0]?.type === "expand") {
        expect(expandSteps[0].frequencyMap).toEqual({ a: 1 });
      }
      if (expandSteps[1]?.type === "expand") {
        expect(expandSteps[1].frequencyMap).toEqual({ a: 1, b: 1 });
      }
    });

    it("shrink step removes character from frequency map", () => {
      const input = "abba";
      const steps = collectSteps(input);
      const shrinkSteps = steps.filter((s) => s.type === "shrink");

      // After shrinking, the removed character should have reduced count
      expect(shrinkSteps.length).toBeGreaterThan(0);
    });

    it("frequency count never exceeds 1 in valid window", () => {
      const input = "abcabcbb";
      const steps = collectSteps(input);

      for (const step of steps) {
        if (step.type === "expand" && !step.causesDuplicate) {
          // Valid expansion - all frequencies should be 1
          const freqs = Object.values(step.frequencyMap);
          for (const freq of freqs) {
            expect(freq).toBeLessThanOrEqual(1);
          }
        }
      }
    });
  });

  describe("window tracking", () => {
    it("window never shrinks past the current right position", () => {
      const input = "abcabcbb";
      const steps = collectSteps(input);

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

    it("causesDuplicate is true only when frequency > 1", () => {
      const input = "abca";
      const steps = collectSteps(input);
      const expandSteps = steps.filter((s) => s.type === "expand");

      for (const step of expandSteps) {
        if (step.type === "expand") {
          const charFreq = step.frequencyMap[step.char] ?? 0;
          expect(step.causesDuplicate).toBe(charFreq > 1);
        }
      }
    });
  });

  describe("algorithm correctness", () => {
    it("final maxLength matches direct computation for various inputs", () => {
      const testCases = [
        "abcabcbb",
        "bbbbb",
        "pwwkew",
        "",
        "a",
        "aab",
        "dvdf",
        "anviaj",
        "abcdefghijklmnopqrstuvwxyz",
      ];

      for (const input of testCases) {
        expect(getMaxFromGenerator(input)).toBe(computeLongestSubstring(input));
      }
    });

    it("best substring has no duplicate characters", () => {
      const input = "abcabcbb";
      const bestSubstring = getBestSubstringFromGenerator(input);
      const charSet = new Set(bestSubstring.split(""));
      expect(charSet.size).toBe(bestSubstring.length);
    });

    it("best substring length equals bestLength", () => {
      const input = "pwwkew";
      const steps = collectSteps(input);
      const completeStep = steps.find((s) => s.type === "complete");
      if (completeStep?.type === "complete") {
        const length = completeStep.bestLength ?? completeStep.maxLength ?? 0;
        expect(completeStep.bestSubstring.length).toBe(length);
      }
    });
  });

  describe("LeetCode test cases", () => {
    it('LeetCode example 1: "abcabcbb"', () => {
      const input = "abcabcbb";
      expect(computeLongestSubstring(input)).toBe(3);
    });

    it('LeetCode example 2: "bbbbb"', () => {
      const input = "bbbbb";
      expect(computeLongestSubstring(input)).toBe(1);
    });

    it('LeetCode example 3: "pwwkew"', () => {
      const input = "pwwkew";
      expect(computeLongestSubstring(input)).toBe(3);
    });

    it('Additional case: "aab"', () => {
      const input = "aab";
      expect(computeLongestSubstring(input)).toBe(2);
    });

    it('Additional case: "tmmzuxt"', () => {
      const input = "tmmzuxt";
      expect(computeLongestSubstring(input)).toBe(5); // "mzuxt"
    });
  });

  describe("linear time guarantee", () => {
    it("each character is processed at most twice (expand + shrink)", () => {
      const input = "abcabcbb";
      const steps = collectSteps(input);

      // Count operations per character index
      const expandCount = steps.filter((s) => s.type === "expand").length;
      const shrinkCount = steps.filter((s) => s.type === "shrink").length;

      // Total operations should be at most 2n (n expands + at most n shrinks)
      expect(expandCount + shrinkCount).toBeLessThanOrEqual(input.length * 2);
    });
  });
});
