import type { PatternContext, PatternStep } from "./types";

/**
 * Direct computation of the minimum window substring.
 * Used for testing to verify the generator produces correct results.
 *
 * @param input - The input string to search in
 * @param target - The target string containing required characters
 * @returns The minimum window substring, or empty string if not found
 */
export function computeMinWindow(input: string, target: string): string {
  if (input.length === 0 || target.length === 0 || target.length > input.length) {
    return "";
  }

  // Build target frequency map
  const targetFreq: Record<string, number> = {};
  for (const char of target) {
    targetFreq[char] = (targetFreq[char] ?? 0) + 1;
  }

  const required = Object.keys(targetFreq).length;
  let formed = 0;
  let left = 0;
  let minLength = Number.POSITIVE_INFINITY;
  let minStart = 0;
  const windowFreq: Record<string, number> = {};

  for (let right = 0; right < input.length; right++) {
    const char = input[right];
    if (char === undefined) continue;

    // Add character to window
    windowFreq[char] = (windowFreq[char] ?? 0) + 1;

    // Check if this character's requirement is now satisfied
    if (targetFreq[char] !== undefined && windowFreq[char] === targetFreq[char]) {
      formed++;
    }

    // Try to shrink window while it remains valid
    while (formed === required && left <= right) {
      const windowLength = right - left + 1;

      if (windowLength < minLength) {
        minLength = windowLength;
        minStart = left;
      }

      const leftChar = input[left];
      if (leftChar !== undefined) {
        windowFreq[leftChar] = (windowFreq[leftChar] ?? 1) - 1;

        // Check if removing this character breaks the requirement
        if (
          targetFreq[leftChar] !== undefined &&
          (windowFreq[leftChar] ?? 0) < targetFreq[leftChar]
        ) {
          formed--;
        }
      }

      left++;
    }
  }

  if (minLength === Number.POSITIVE_INFINITY) {
    return "";
  }

  return input.slice(minStart, minStart + minLength);
}

/**
 * Minimum Window Substring Generator
 *
 * Problem: Given two strings s and t, return the minimum window substring of s
 * such that every character in t (including duplicates) is included in the window.
 * If there is no such substring, return the empty string "".
 *
 * Algorithm:
 * 1. Build a frequency map of the target string
 * 2. Use two pointers (left, right) to define a window
 * 3. Expand right pointer to grow the window until all target chars are included
 * 4. When valid, shrink from left to minimize the window
 * 5. Track the minimum valid window found
 *
 * Time Complexity: O(n) - Each character is visited at most twice
 * Space Complexity: O(m) - m is the size of the target charset
 *
 * Key insight: Unlike "longest substring", this problem:
 * - Expands to find validity (not shrinks to fix invalidity)
 * - Shrinks to optimize (minimize) after becoming valid
 * - Tracks a "required count" to efficiently check validity
 */
export function* minWindowSubstring(
  context: PatternContext
): Generator<PatternStep, void, unknown> {
  const { input, target } = context;
  const chars = input.split("");
  const n = chars.length;

  // Handle edge cases
  if (n === 0 || !target || target.length === 0 || target.length > n) {
    yield {
      type: "complete",
      bestLength: 0,
      bestSubstring: "",
    };
    return;
  }

  // Build target frequency map
  const targetFreq: Record<string, number> =
    context.targetFrequency ??
    target.split("").reduce(
      (acc, char) => {
        acc[char] = (acc[char] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

  // Number of unique characters required with correct frequency
  const required = Object.keys(targetFreq).length;
  // Number of unique characters in window with correct frequency
  let formed = 0;

  // Window state
  let left = 0;
  let minLength = Number.POSITIVE_INFINITY;
  let minStart = 0;
  const windowFreq: Record<string, number> = {};

  // Yield initial state with target frequency map
  yield {
    type: "init",
    left: 0,
    right: -1,
    frequencyMap: { ...windowFreq },
    targetFrequencyMap: { ...targetFreq },
  };

  // Expand right pointer through the string
  for (let right = 0; right < n; right++) {
    const char = chars[right];
    if (char === undefined) continue;

    // Add character to window frequency map
    windowFreq[char] = (windowFreq[char] ?? 0) + 1;

    // Check if this character's requirement is now satisfied
    const justSatisfied = targetFreq[char] !== undefined && windowFreq[char] === targetFreq[char];
    if (justSatisfied) {
      formed++;
    }

    // Determine if window now satisfies all constraints
    const windowValid = formed === required;

    // Yield expand step
    yield {
      type: "expand",
      right,
      char,
      frequencyMap: { ...windowFreq },
      satisfiesConstraint: windowValid,
    };

    // If constraint just became satisfied, yield a validity-check step
    if (justSatisfied && windowValid) {
      yield {
        type: "validity-check",
        isValid: true,
        char,
        index: right,
        reason: "constraint-satisfied",
        satisfiedCount: formed,
        requiredCount: required,
      };
    }

    // While window is valid, try to shrink to find minimum
    while (formed === required && left <= right) {
      const windowLength = right - left + 1;

      // Check if this is a new minimum
      if (windowLength < minLength) {
        minLength = windowLength;
        minStart = left;

        yield {
          type: "update-best",
          bestLength: minLength,
          windowStart: left,
          windowEnd: right,
          substring: chars.slice(left, right + 1).join(""),
        };
      }

      // Shrink from left
      const leftChar = chars[left];
      if (leftChar === undefined) {
        left++;
        continue;
      }

      // Remove character from window frequency map
      windowFreq[leftChar] = (windowFreq[leftChar] ?? 1) - 1;

      // Check if removing this character breaks the requirement
      const breaksSatisfaction =
        targetFreq[leftChar] !== undefined && (windowFreq[leftChar] ?? 0) < targetFreq[leftChar];

      if (breaksSatisfaction) {
        formed--;
      }

      left++;

      // Window is still valid after shrinking
      const stillValid = formed === required;

      yield {
        type: "shrink",
        left,
        char: leftChar,
        frequencyMap: { ...windowFreq },
        windowValid: stillValid,
      };

      // If shrinking broke validity, yield a validity-check step
      if (breaksSatisfaction) {
        yield {
          type: "validity-check",
          isValid: false,
          char: leftChar,
          index: left - 1,
          reason: "missing-chars",
          satisfiedCount: formed,
          requiredCount: required,
        };
      }
    }
  }

  // Algorithm complete
  const foundSolution = minLength !== Number.POSITIVE_INFINITY;

  yield {
    type: "complete",
    bestLength: foundSolution ? minLength : 0,
    bestSubstring: foundSolution ? chars.slice(minStart, minStart + minLength).join("") : "",
  };
}
