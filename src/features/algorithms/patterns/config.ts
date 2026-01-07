import type { PatternProblemType, PatternStep } from "./types";

/**
 * Step type labels for display in the UI.
 */
export const PATTERN_STEP_LABELS: Record<PatternStep["type"], string> = {
  init: "Initializing window",
  expand: "Expanding window",
  "found-duplicate": "Duplicate found",
  shrink: "Shrinking window",
  "update-max": "New maximum found",
  complete: "Algorithm complete",
};

/**
 * Pattern insights that explain the algorithm's decisions.
 * These are shown to help users understand the "why" behind each step.
 */
export const PATTERN_INSIGHTS: Record<PatternStep["type"], string> = {
  init: "We start with an empty window and a frequency map to track character counts.",
  expand: "Expanding the window by moving the right pointer to include the next character.",
  "found-duplicate":
    "A duplicate character was detected! The window is now invalid and must shrink.",
  shrink: "Shrinking from the left to remove characters until the duplicate is eliminated.",
  "update-max": "This window is the longest valid substring seen so far!",
  complete: "The right pointer has reached the end. The maximum was found in linear time!",
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
 */
export const PATTERN_METADATA: Record<PatternProblemType, PatternProblemMetadata> = {
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
      "found-duplicate": 10,
      shrink: 11,
      "update-max": 16,
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
