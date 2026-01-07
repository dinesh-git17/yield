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
// Largest Rectangle in Histogram - Monotonic Stack (Optimal)
// ─────────────────────────────────────────────────────────────────────────────

const LARGEST_RECTANGLE_PYTHON = `def largestRectangleArea(heights: list[int]) -> int:
    """Find largest rectangle area using monotonic stack."""
    stack: list[int] = []
    max_area = 0

    for i in range(len(heights) + 1):
        # Use 0 as sentinel for final cleanup
        h = heights[i] if i < len(heights) else 0

        while stack and h < heights[stack[-1]]:
            # Pop and calculate area
            height = heights[stack.pop()]
            width = i if not stack else i - stack[-1] - 1
            area = height * width
            max_area = max(max_area, area)

        stack.append(i)

    return max_area`;

const LARGEST_RECTANGLE_CPP = `int largestRectangleArea(std::vector<int>& heights) {
    std::stack<int> stack;
    int maxArea = 0;

    for (int i = 0; i <= heights.size(); i++) {
        // Use 0 as sentinel for final cleanup
        int h = (i == heights.size()) ? 0 : heights[i];

        while (!stack.empty() && h < heights[stack.top()]) {
            // Pop and calculate area
            int height = heights[stack.top()];
            stack.pop();
            int width = stack.empty() ? i : i - stack.top() - 1;
            int area = height * width;
            maxArea = std::max(maxArea, area);
        }

        stack.push(i);
    }

    return maxArea;
}`;

const LARGEST_RECTANGLE_JAVA = `public int largestRectangleArea(int[] heights) {
    Deque<Integer> stack = new ArrayDeque<>();
    int maxArea = 0;

    for (int i = 0; i <= heights.length; i++) {
        // Use 0 as sentinel for final cleanup
        int h = (i == heights.length) ? 0 : heights[i];

        while (!stack.isEmpty() && h < heights[stack.peek()]) {
            // Pop and calculate area
            int height = heights[stack.pop()];
            int width = stack.isEmpty() ? i : i - stack.peek() - 1;
            int area = height * width;
            maxArea = Math.max(maxArea, area);
        }

        stack.push(i);
    }

    return maxArea;
}`;

const LARGEST_RECTANGLE_JS = `function largestRectangleArea(heights) {
  const stack = [];
  let maxArea = 0;

  for (let i = 0; i <= heights.length; i++) {
    // Use 0 as sentinel for final cleanup
    const h = i === heights.length ? 0 : heights[i];

    while (stack.length > 0 && h < heights[stack[stack.length - 1]]) {
      // Pop and calculate area
      const height = heights[stack.pop()];
      const width = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;
      const area = height * width;
      maxArea = Math.max(maxArea, area);
    }

    stack.push(i);
  }

  return maxArea;
}`;

const LARGEST_RECTANGLE_GO = `func largestRectangleArea(heights []int) int {
    stack := []int{}
    maxArea := 0

    for i := 0; i <= len(heights); i++ {
        // Use 0 as sentinel for final cleanup
        h := 0
        if i < len(heights) {
            h = heights[i]
        }

        for len(stack) > 0 && h < heights[stack[len(stack)-1]] {
            // Pop and calculate area
            height := heights[stack[len(stack)-1]]
            stack = stack[:len(stack)-1]

            width := i
            if len(stack) > 0 {
                width = i - stack[len(stack)-1] - 1
            }

            area := height * width
            if area > maxArea {
                maxArea = area
            }
        }

        stack = append(stack, i)
    }

    return maxArea
}`;

const LARGEST_RECTANGLE_RUST = `fn largest_rectangle_area(heights: Vec<i32>) -> i32 {
    let mut stack: Vec<usize> = Vec::new();
    let mut max_area = 0i32;

    for i in 0..=heights.len() {
        // Use 0 as sentinel for final cleanup
        let h = if i == heights.len() { 0 } else { heights[i] };

        while !stack.is_empty() && h < heights[*stack.last().unwrap()] {
            // Pop and calculate area
            let height = heights[stack.pop().unwrap()];
            let width = if stack.is_empty() {
                i as i32
            } else {
                (i - stack.last().unwrap() - 1) as i32
            };
            let area = height * width;
            max_area = max_area.max(area);
        }

        stack.push(i);
    }

    max_area
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
  "largest-rectangle-histogram": {
    python: LARGEST_RECTANGLE_PYTHON,
    cpp: LARGEST_RECTANGLE_CPP,
    java: LARGEST_RECTANGLE_JAVA,
    javascript: LARGEST_RECTANGLE_JS,
    go: LARGEST_RECTANGLE_GO,
    rust: LARGEST_RECTANGLE_RUST,
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
