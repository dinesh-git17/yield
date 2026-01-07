import type { InterviewProblemType, InterviewStep } from "./types";

/**
 * Step type labels for display in the UI.
 */
export const INTERVIEW_STEP_LABELS: Record<InterviewStep["type"], string> = {
  // Trapping Rain Water steps
  init: "Initializing pointers",
  compare: "Comparing max heights",
  "move-left": "Moving left pointer",
  "move-right": "Moving right pointer",
  "update-max-left": "Updating left maximum",
  "update-max-right": "Updating right maximum",
  "fill-water": "Trapping water",
  complete: "Algorithm complete",
  // Largest Rectangle in Histogram steps
  "stack-push": "Pushing to stack",
  "stack-pop": "Popping from stack",
  "calculate-area": "Calculating area",
  "update-max-area": "New maximum area",
};

/**
 * Interview insights that explain the algorithm's decisions.
 * These are shown to help users understand the "why" behind each step.
 */
export const INTERVIEW_INSIGHTS: Record<InterviewStep["type"], string> = {
  // Trapping Rain Water insights
  init: "We start with two pointers at the extremes and track the maximum height seen from each side.",
  compare:
    "We process the side with the smaller maximum because water level there is bounded by that smaller max.",
  "move-left": "Moving the left pointer inward to check for water or a new maximum.",
  "move-right": "Moving the right pointer inward to check for water or a new maximum.",
  "update-max-left":
    "Found a taller bar on the left. No water can be trapped here—it would flow off the sides.",
  "update-max-right":
    "Found a taller bar on the right. No water can be trapped here—it would flow off the sides.",
  "fill-water":
    "This bar is shorter than the max on its bounded side, so water fills up to that max level.",
  complete: "Both pointers have met. All trapped water has been calculated!",
  // Largest Rectangle in Histogram insights
  "stack-push":
    "This bar is taller than the stack top, so we push it. It might be the left boundary of a future rectangle.",
  "stack-pop":
    "Current bar is shorter than stack top. The popped bar can no longer extend right, so we calculate its rectangle.",
  "calculate-area":
    "Rectangle width spans from the new stack top (left bound) to current position (right bound).",
  "update-max-area":
    "This rectangle is larger than any we've seen. It becomes our new candidate answer.",
};

/**
 * Metadata for each interview problem including code display and complexity.
 */
export interface InterviewProblemMetadata {
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
  lineMapping: Partial<Record<InterviewStep["type"], number>>;
}

/**
 * Metadata registry for interview problems.
 */
export const INTERVIEW_METADATA: Record<InterviewProblemType, InterviewProblemMetadata> = {
  "trapping-rain-water": {
    label: "Trapping Rain Water",
    difficulty: "Hard",
    complexity: "O(n)",
    spaceComplexity: "O(1)",
    description:
      "Given n bars representing elevation heights, compute how much water can be trapped after raining.",
    pattern: "Two Pointers",
    code: [
      "function trap(height: number[]): number {",
      "  let left = 0, right = height.length - 1;",
      "  let maxLeft = 0, maxRight = 0;",
      "  let totalWater = 0;",
      "",
      "  while (left < right) {",
      "    // Compare which side has smaller max",
      "    if (maxLeft <= maxRight) {",
      "      // Process left side",
      "      left++;",
      "      const h = height[left];",
      "",
      "      if (h > maxLeft) {",
      "        // New max found - no water here",
      "        maxLeft = h;",
      "      } else {",
      "        // Water trapped = maxLeft - current height",
      "        totalWater += maxLeft - h;",
      "      }",
      "    } else {",
      "      // Process right side",
      "      right--;",
      "      const h = height[right];",
      "",
      "      if (h > maxRight) {",
      "        // New max found - no water here",
      "        maxRight = h;",
      "      } else {",
      "        // Water trapped = maxRight - current height",
      "        totalWater += maxRight - h;",
      "      }",
      "    }",
      "  }",
      "",
      "  return totalWater;",
      "}",
    ],
    lineMapping: {
      init: 1,
      compare: 7,
      "move-left": 9,
      "move-right": 21,
      "update-max-left": 14,
      "update-max-right": 26,
      "fill-water": 17,
      complete: 34,
    },
  },
  "largest-rectangle-histogram": {
    label: "Largest Rectangle in Histogram",
    difficulty: "Hard",
    complexity: "O(n)",
    spaceComplexity: "O(n)",
    description:
      "Given an array of bar heights, find the area of the largest rectangle that can be formed in the histogram.",
    pattern: "Monotonic Stack",
    code: [
      "function largestRectangleArea(heights: number[]): number {",
      "  const stack: number[] = [];",
      "  let maxArea = 0;",
      "",
      "  for (let i = 0; i <= heights.length; i++) {",
      "    // Use 0 as sentinel for final cleanup",
      "    const h = i === heights.length ? 0 : heights[i];",
      "",
      "    while (stack.length > 0 && h < heights[stack[stack.length - 1]]) {",
      "      // Pop and calculate area",
      "      const height = heights[stack.pop()!];",
      "      const width = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;",
      "      const area = height * width;",
      "",
      "      if (area > maxArea) {",
      "        maxArea = area;",
      "      }",
      "    }",
      "",
      "    stack.push(i);",
      "  }",
      "",
      "  return maxArea;",
      "}",
    ],
    lineMapping: {
      "stack-push": 19,
      "stack-pop": 10,
      "calculate-area": 12,
      "update-max-area": 15,
      complete: 22,
    },
  },
};

/**
 * Get metadata for a specific interview problem.
 */
export function getInterviewProblemMetadata(
  problem: InterviewProblemType
): InterviewProblemMetadata {
  return INTERVIEW_METADATA[problem];
}

/**
 * Get the insight text for a specific step type.
 */
export function getStepInsight(stepType: InterviewStep["type"]): string {
  return INTERVIEW_INSIGHTS[stepType];
}

/**
 * Default terrain heights for the Trapping Rain Water demo.
 * This creates an interesting visualization with various water pooling.
 */
export const DEFAULT_RAIN_WATER_HEIGHTS = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1];

/**
 * Preset terrain configurations for variety.
 */
export const RAIN_WATER_PRESETS: Record<string, number[]> = {
  classic: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
  valley: [3, 0, 0, 2, 0, 4],
  stairs: [4, 2, 0, 3, 2, 5],
  mountain: [1, 2, 3, 4, 3, 2, 1],
  pool: [5, 2, 1, 2, 1, 2, 5],
  random: [], // Will be generated dynamically
};

/**
 * Configuration constants for Interview Mode.
 */
export const INTERVIEW_CONFIG = {
  /** Minimum number of bars in the terrain */
  MIN_BARS: 3,
  /** Maximum number of bars in the terrain */
  MAX_BARS: 20,
  /** Default number of bars */
  DEFAULT_BARS: 12,
  /** Maximum height of a bar */
  MAX_HEIGHT: 8,
  /** Default problem when entering interview mode */
  DEFAULT_PROBLEM: "trapping-rain-water" as InterviewProblemType,
} as const;

/**
 * Generates a random heights array for the rain water problem.
 */
export function generateRandomHeights(count: number): number[] {
  const clampedCount = Math.max(
    INTERVIEW_CONFIG.MIN_BARS,
    Math.min(INTERVIEW_CONFIG.MAX_BARS, count)
  );

  const heights: number[] = [];
  for (let i = 0; i < clampedCount; i++) {
    // Generate heights between 0 and MAX_HEIGHT
    heights.push(Math.floor(Math.random() * (INTERVIEW_CONFIG.MAX_HEIGHT + 1)));
  }

  return heights;
}
