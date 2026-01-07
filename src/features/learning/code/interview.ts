import type { InterviewProblemType } from "@/lib/store";
import type { Language } from "./sorting";

// ─────────────────────────────────────────────────────────────────────────────
// Trapping Rain Water - Two Pointers (Optimal)
// ─────────────────────────────────────────────────────────────────────────────

const TRAPPING_RAIN_WATER_PYTHON = `def trap(height: list[int]) -> int:
    """Calculate trapped rainwater using two pointers."""
    if not height:
        return 0

    left, right = 0, len(height) - 1
    max_left, max_right = 0, 0
    total_water = 0

    while left < right:
        # Process the side with smaller boundary
        if max_left <= max_right:
            left += 1
            h = height[left]

            if h > max_left:
                # New max found - no water here
                max_left = h
            else:
                # Water trapped = max_left - current height
                total_water += max_left - h
        else:
            right -= 1
            h = height[right]

            if h > max_right:
                # New max found - no water here
                max_right = h
            else:
                # Water trapped = max_right - current height
                total_water += max_right - h

    return total_water`;

const TRAPPING_RAIN_WATER_CPP = `int trap(std::vector<int>& height) {
    if (height.empty()) return 0;

    int left = 0, right = height.size() - 1;
    int maxLeft = 0, maxRight = 0;
    int totalWater = 0;

    while (left < right) {
        // Process the side with smaller boundary
        if (maxLeft <= maxRight) {
            left++;
            int h = height[left];

            if (h > maxLeft) {
                // New max found - no water here
                maxLeft = h;
            } else {
                // Water trapped = maxLeft - current height
                totalWater += maxLeft - h;
            }
        } else {
            right--;
            int h = height[right];

            if (h > maxRight) {
                // New max found - no water here
                maxRight = h;
            } else {
                // Water trapped = maxRight - current height
                totalWater += maxRight - h;
            }
        }
    }

    return totalWater;
}`;

const TRAPPING_RAIN_WATER_JAVA = `public int trap(int[] height) {
    if (height == null || height.length == 0) return 0;

    int left = 0, right = height.length - 1;
    int maxLeft = 0, maxRight = 0;
    int totalWater = 0;

    while (left < right) {
        // Process the side with smaller boundary
        if (maxLeft <= maxRight) {
            left++;
            int h = height[left];

            if (h > maxLeft) {
                // New max found - no water here
                maxLeft = h;
            } else {
                // Water trapped = maxLeft - current height
                totalWater += maxLeft - h;
            }
        } else {
            right--;
            int h = height[right];

            if (h > maxRight) {
                // New max found - no water here
                maxRight = h;
            } else {
                // Water trapped = maxRight - current height
                totalWater += maxRight - h;
            }
        }
    }

    return totalWater;
}`;

const TRAPPING_RAIN_WATER_JS = `function trap(height) {
  if (!height || height.length === 0) return 0;

  let left = 0, right = height.length - 1;
  let maxLeft = 0, maxRight = 0;
  let totalWater = 0;

  while (left < right) {
    // Process the side with smaller boundary
    if (maxLeft <= maxRight) {
      left++;
      const h = height[left];

      if (h > maxLeft) {
        // New max found - no water here
        maxLeft = h;
      } else {
        // Water trapped = maxLeft - current height
        totalWater += maxLeft - h;
      }
    } else {
      right--;
      const h = height[right];

      if (h > maxRight) {
        // New max found - no water here
        maxRight = h;
      } else {
        // Water trapped = maxRight - current height
        totalWater += maxRight - h;
      }
    }
  }

  return totalWater;
}`;

const TRAPPING_RAIN_WATER_GO = `func trap(height []int) int {
    if len(height) == 0 {
        return 0
    }

    left, right := 0, len(height)-1
    maxLeft, maxRight := 0, 0
    totalWater := 0

    for left < right {
        // Process the side with smaller boundary
        if maxLeft <= maxRight {
            left++
            h := height[left]

            if h > maxLeft {
                // New max found - no water here
                maxLeft = h
            } else {
                // Water trapped = maxLeft - current height
                totalWater += maxLeft - h
            }
        } else {
            right--
            h := height[right]

            if h > maxRight {
                // New max found - no water here
                maxRight = h
            } else {
                // Water trapped = maxRight - current height
                totalWater += maxRight - h
            }
        }
    }

    return totalWater
}`;

const TRAPPING_RAIN_WATER_RUST = `fn trap(height: Vec<i32>) -> i32 {
    if height.is_empty() {
        return 0;
    }

    let (mut left, mut right) = (0usize, height.len() - 1);
    let (mut max_left, mut max_right) = (0i32, 0i32);
    let mut total_water = 0i32;

    while left < right {
        // Process the side with smaller boundary
        if max_left <= max_right {
            left += 1;
            let h = height[left];

            if h > max_left {
                // New max found - no water here
                max_left = h;
            } else {
                // Water trapped = max_left - current height
                total_water += max_left - h;
            }
        } else {
            right -= 1;
            let h = height[right];

            if h > max_right {
                // New max found - no water here
                max_right = h;
            } else {
                // Water trapped = max_right - current height
                total_water += max_right - h;
            }
        }
    }

    total_water
}`;

// ─────────────────────────────────────────────────────────────────────────────
// Implementation Registry
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Registry of all interview problem implementations by language.
 */
const INTERVIEW_IMPLEMENTATIONS: Record<InterviewProblemType, Record<Language, string>> = {
  "trapping-rain-water": {
    python: TRAPPING_RAIN_WATER_PYTHON,
    cpp: TRAPPING_RAIN_WATER_CPP,
    java: TRAPPING_RAIN_WATER_JAVA,
    javascript: TRAPPING_RAIN_WATER_JS,
    go: TRAPPING_RAIN_WATER_GO,
    rust: TRAPPING_RAIN_WATER_RUST,
  },
};

/**
 * Get implementation code for a specific problem and language.
 */
export function getInterviewImplementation(
  problem: InterviewProblemType,
  language: Language
): string {
  return INTERVIEW_IMPLEMENTATIONS[problem][language];
}

/**
 * Get all implementations for a specific problem.
 */
export function getAllInterviewImplementations(
  problem: InterviewProblemType
): Record<Language, string> {
  return INTERVIEW_IMPLEMENTATIONS[problem];
}
