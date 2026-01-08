import type { PatternProblemType, PatternStep } from "./types";

/**
 * Step type labels for display in the UI.
 * Includes both deprecated types (found-duplicate, update-max) and new generic types.
 */
export const PATTERN_STEP_LABELS: Record<PatternStep["type"], string> = {
  init: "Initializing window",
  expand: "Expanding window",
  "validity-check": "Checking validity",
  "found-duplicate": "Duplicate found", // @deprecated
  shrink: "Shrinking window",
  "update-best": "New best found",
  "update-max": "New maximum found", // @deprecated
  complete: "Algorithm complete",
};

/**
 * Pattern insights that explain the algorithm's decisions.
 * These are shown to help users understand the "why" behind each step.
 * Includes both deprecated types and new generic types.
 */
export const PATTERN_INSIGHTS: Record<PatternStep["type"], string> = {
  init: "We start with an empty window and a frequency map to track character counts.",
  expand: "Expanding the window by moving the right pointer to include the next character.",
  "validity-check": "Checking if the current window satisfies all constraints.",
  "found-duplicate":
    "A duplicate character was detected! The window is now invalid and must shrink.", // @deprecated
  shrink: "Shrinking from the left to remove characters until constraints are satisfied.",
  "update-best": "This window is the best valid result seen so far!",
  "update-max": "This window is the longest valid substring seen so far!", // @deprecated
  complete: "The right pointer has reached the end. The result was found in linear time!",
};

/**
 * Metadata for each pattern problem including code display and complexity.
 */
export interface PatternProblemMetadata {
  /** Display name for the problem */
  label: string;
  /** LeetCode/difficulty rating */
  difficulty: "Easy" | "Medium" | "Hard";
  /** Time complexity notation */
  complexity: string;
  /** Space complexity notation */
  spaceComplexity: string;
  /** Brief description of the problem */
  description: string;
  /** The technique/pattern used */
  pattern: string;
  /** Source code lines for display */
  code: string[];
  /** Maps step types to their corresponding line indices (0-based) */
  lineMapping: Partial<Record<PatternStep["type"], number>>;
}

/**
 * Metadata registry for pattern problems.
 * Extended to support min-window-substring (STORY-105 will complete implementation).
 */
export const PATTERN_METADATA: Record<PatternProblemType, PatternProblemMetadata> = {
  // Placeholder for min-window-substring - will be completed in STORY-105
  "min-window-substring": {
    label: "Minimum Window Substring",
    difficulty: "Hard",
    complexity: "O(n)",
    spaceComplexity: "O(m)",
    description:
      "Given strings s and t, find the minimum window in s that contains all characters of t.",
    pattern: "Sliding Window",
    code: [
      "function minWindow(s: string, t: string): string {",
      "  const need: Record<string, number> = {};",
      "  for (const c of t) need[c] = (need[c] ?? 0) + 1;",
      "",
      "  let have = 0, required = Object.keys(need).length;",
      "  const window: Record<string, number> = {};",
      "  let left = 0, minLen = Infinity, minStart = 0;",
      "",
      "  for (let right = 0; right < s.length; right++) {",
      "    const c = s[right];",
      "    window[c] = (window[c] ?? 0) + 1;",
      "    if (need[c] && window[c] === need[c]) have++;",
      "",
      "    while (have === required) {",
      "      if (right - left + 1 < minLen) {",
      "        minLen = right - left + 1;",
      "        minStart = left;",
      "      }",
      "      const lc = s[left];",
      "      window[lc]--;",
      "      if (need[lc] && window[lc] < need[lc]) have--;",
      "      left++;",
      "    }",
      "  }",
      "  return minLen === Infinity ? '' : s.slice(minStart, minStart + minLen);",
      "}",
    ],
    lineMapping: {
      init: 1,
      expand: 9,
      "validity-check": 13,
      "found-duplicate": 13, // Not used for this algorithm
      shrink: 19,
      "update-best": 15,
      "update-max": 15, // Not used for this algorithm
      complete: 25,
    },
  },
  "longest-substring-norepeat": {
    label: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    complexity: "O(n)",
    spaceComplexity: "O(min(m, n))",
    description:
      "Given a string s, find the length of the longest substring without repeating characters.",
    pattern: "Sliding Window",
    code: [
      "function lengthOfLongestSubstring(s: string): number {",
      "  const freq: Record<string, number> = {};",
      "  let left = 0;",
      "  let maxLength = 0;",
      "",
      "  for (let right = 0; right < s.length; right++) {",
      "    const char = s[right];",
      "    freq[char] = (freq[char] ?? 0) + 1;",
      "",
      "    // Duplicate found - shrink window",
      "    while (freq[char] > 1) {",
      "      freq[s[left]]--;",
      "      left++;",
      "    }",
      "",
      "    // Update maximum length",
      "    maxLength = Math.max(maxLength, right - left + 1);",
      "  }",
      "",
      "  return maxLength;",
      "}",
    ],
    lineMapping: {
      init: 1,
      expand: 7,
      "validity-check": 10, // Generic validity check maps to same line as found-duplicate
      "found-duplicate": 10, // @deprecated
      shrink: 11,
      "update-best": 16, // Generic update-best maps to same line as update-max
      "update-max": 16, // @deprecated
      complete: 19,
    },
  },
};

/**
 * Get metadata for a specific pattern problem.
 */
export function getPatternProblemMetadata(problem: PatternProblemType): PatternProblemMetadata {
  return PATTERN_METADATA[problem];
}

/**
 * Get the insight text for a specific step type.
 */
export function getPatternStepInsight(stepType: PatternStep["type"]): string {
  return PATTERN_INSIGHTS[stepType];
}

/**
 * Get the label text for a specific step type.
 */
export function getPatternStepLabel(stepType: PatternStep["type"]): string {
  return PATTERN_STEP_LABELS[stepType];
}

/**
 * Default input string for the Sliding Window demo.
 * "abcabcbb" is the classic LeetCode example with max substring "abc" (length 3).
 */
export const DEFAULT_SLIDING_WINDOW_INPUT = "abcabcbb";

/**
 * Preset input strings for variety.
 */
export const SLIDING_WINDOW_PRESETS: Record<string, string> = {
  classic: "abcabcbb", // max = 3 ("abc")
  allSame: "bbbbb", // max = 1 ("b")
  allUnique: "abcdefgh", // max = 8 (entire string)
  twoChars: "pwwkew", // max = 3 ("wke" or "kew")
  longer: "dvdf", // max = 3 ("vdf")
  empty: "", // max = 0
  single: "a", // max = 1
};

/**
 * Configuration constants for Patterns Mode.
 */
export const PATTERNS_CONFIG = {
  /** Minimum input length */
  MIN_LENGTH: 0,
  /** Maximum input length */
  MAX_LENGTH: 50,
  /** Default input length */
  DEFAULT_LENGTH: 8,
  /** Default problem when entering patterns mode */
  DEFAULT_PROBLEM: "longest-substring-norepeat" as PatternProblemType,
} as const;

/**
 * Generates dynamic insight messages based on the current step and its data.
 * These provide context-aware explanations that include specific values.
 * Supports both deprecated and new generic step types.
 */
export function getDynamicPatternInsight(step: PatternStep | null): string {
  if (!step) return "";

  switch (step.type) {
    case "init": {
      const targetInfo = step.targetFrequencyMap
        ? ` We need to find all characters: ${Object.keys(step.targetFrequencyMap).join(", ")}.`
        : "";
      return `Starting with an empty window. The left and right pointers both begin at position 0.${targetInfo}`;
    }

    case "expand":
      if (step.causesDuplicate) {
        return `Adding '${step.char}' to window — but this creates a duplicate! Window is now invalid.`;
      }
      if (step.satisfiesConstraint) {
        return `Adding '${step.char}' to window — all required characters are now present! Window is valid.`;
      }
      return `Expanding window to include '${step.char}'. The window remains valid with all unique characters.`;

    case "validity-check":
      if (step.isValid) {
        if (step.reason === "constraint-satisfied") {
          const countInfo =
            step.satisfiedCount !== undefined && step.requiredCount !== undefined
              ? ` (${step.satisfiedCount}/${step.requiredCount} requirements met)`
              : "";
          return `Window is now valid! All required characters are present${countInfo}.`;
        }
        return `Window is now valid after removing '${step.char}'.`;
      }
      // Invalid
      if (step.reason === "duplicate") {
        return `Duplicate '${step.char}' detected (count: ${step.frequency ?? 2})! Window is now invalid and must shrink.`;
      }
      if (step.reason === "missing-chars") {
        const countInfo =
          step.satisfiedCount !== undefined && step.requiredCount !== undefined
            ? ` (${step.satisfiedCount}/${step.requiredCount} requirements met)`
            : "";
        return `Window is missing required characters${countInfo}. Continue expanding to find them.`;
      }
      return `Window validity changed for '${step.char}'.`;

    case "found-duplicate":
      // @deprecated - kept for backward compatibility
      return `Duplicate '${step.char}' detected (count: ${step.frequency})! We must shrink the window from the left until the duplicate is removed.`;

    case "shrink": {
      const statusText = step.windowValid
        ? "Window is now valid again."
        : "Still invalid — continuing to shrink.";
      return `Removing '${step.char}' from window by moving left pointer. ${statusText}`;
    }

    case "update-best":
      return `New best found! Window "${step.substring}" has length ${step.bestLength}, beating the previous best.`;

    case "update-max":
      // @deprecated - kept for backward compatibility
      return `New best found! Window "${step.substring}" has length ${step.maxLength}, beating the previous maximum.`;

    case "complete": {
      const lengthValue = step.bestLength ?? step.maxLength ?? 0;
      return `Algorithm complete! The best result is "${step.bestSubstring}" with length ${lengthValue}. Total time: O(n) — each character was visited at most twice.`;
    }

    default:
      return "";
  }
}
