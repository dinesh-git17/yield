import type { PatternContext, PatternStep } from "./types";

/**
 * Direct computation of the longest substring without repeating characters.
 * Used for testing to verify the generator produces correct results.
 *
 * @param input - The input string
 * @returns The length of the longest substring without repeating characters
 */
export function computeLongestSubstring(input: string): number {
  const n = input.length;
  if (n === 0) return 0;

  let left = 0;
  let maxLength = 0;
  const frequencyMap: Record<string, number> = {};

  for (let right = 0; right < n; right++) {
    const char = input[right];
    if (char === undefined) continue;

    frequencyMap[char] = (frequencyMap[char] ?? 0) + 1;

    while ((frequencyMap[char] ?? 0) > 1 && left < right) {
      const leftChar = input[left];
      if (leftChar !== undefined) {
        frequencyMap[leftChar] = (frequencyMap[leftChar] ?? 1) - 1;
        if (frequencyMap[leftChar] === 0) {
          delete frequencyMap[leftChar];
        }
      }
      left++;
    }

    maxLength = Math.max(maxLength, right - left + 1);
  }

  return maxLength;
}

/**
 * Sliding Window Generator for "Longest Substring Without Repeating Characters"
 *
 * Problem: Given a string s, find the length of the longest substring without
 * repeating characters.
 *
 * Algorithm:
 * 1. Use two pointers (left, right) to define a window
 * 2. Expand right pointer to grow the window
 * 3. When a duplicate is found, shrink from left until valid
 * 4. Track the maximum window size seen
 *
 * Time Complexity: O(n) - Each character is visited at most twice
 * Space Complexity: O(min(m, n)) - m is charset size, n is string length
 *
 * The key insight: The window only moves forward, ensuring linear time.
 * We never backtrack or reset the right pointer.
 */
export function* slidingWindow(context: PatternContext): Generator<PatternStep, void, unknown> {
  const { input } = context;
  const chars = input.split("");
  const n = chars.length;

  // Handle edge cases
  if (n === 0) {
    yield {
      type: "complete",
      bestLength: 0,
      bestSubstring: "",
      maxLength: 0, // @deprecated - kept for backward compatibility
    };
    return;
  }

  // Initialize window state
  let left = 0;
  let maxLength = 0;
  let maxStart = 0;
  const frequencyMap: Record<string, number> = {};

  // Yield initial state
  yield {
    type: "init",
    left: 0,
    right: -1,
    frequencyMap: { ...frequencyMap },
  };

  // Expand right pointer through the string
  for (let right = 0; right < n; right++) {
    const char = chars[right];
    if (char === undefined) continue;

    // Add character to frequency map
    frequencyMap[char] = (frequencyMap[char] ?? 0) + 1;

    // Check if this expansion caused a duplicate
    const isDuplicate = (frequencyMap[char] ?? 0) > 1;

    // Yield expand step
    yield {
      type: "expand",
      right,
      char,
      frequencyMap: { ...frequencyMap },
      causesDuplicate: isDuplicate,
    };

    // If duplicate found, signal the invalid state using generic validity-check
    if (isDuplicate) {
      yield {
        type: "validity-check",
        isValid: false,
        char,
        index: right,
        reason: "duplicate",
        frequency: frequencyMap[char] ?? 2,
      };

      // Shrink window from left until valid (no duplicates)
      while ((frequencyMap[char] ?? 0) > 1 && left < right) {
        const leftChar = chars[left];
        if (leftChar === undefined) {
          left++;
          continue;
        }

        // Remove left character from frequency map
        frequencyMap[leftChar] = (frequencyMap[leftChar] ?? 1) - 1;
        if (frequencyMap[leftChar] === 0) {
          delete frequencyMap[leftChar];
        }

        left++;

        // Check if window is now valid
        const windowValid = (frequencyMap[char] ?? 0) <= 1;

        yield {
          type: "shrink",
          left,
          char: leftChar,
          frequencyMap: { ...frequencyMap },
          windowValid,
        };
      }
    }

    // Calculate current window length
    const currentLength = right - left + 1;

    // Update maximum if current window is larger using generic update-best
    if (currentLength > maxLength) {
      maxLength = currentLength;
      maxStart = left;

      yield {
        type: "update-best",
        bestLength: maxLength,
        windowStart: left,
        windowEnd: right,
        substring: chars.slice(left, right + 1).join(""),
      };
    }
  }

  // Algorithm complete
  yield {
    type: "complete",
    bestLength: maxLength,
    bestSubstring: chars.slice(maxStart, maxStart + maxLength).join(""),
    maxLength, // @deprecated - kept for backward compatibility
  };
}
