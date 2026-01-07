import type { PatternProblemType } from "@/lib/store";
import type { Language } from "./sorting";

// ─────────────────────────────────────────────────────────────────────────────
// Longest Substring Without Repeating Characters - Sliding Window (Optimal)
// ─────────────────────────────────────────────────────────────────────────────

const LONGEST_SUBSTRING_PYTHON = `def length_of_longest_substring(s: str) -> int:
    """Find length of longest substring without repeating characters."""
    seen: dict[str, int] = {}
    left = 0
    max_length = 0

    for right, char in enumerate(s):
        # If char was seen inside current window, shrink window
        if char in seen and seen[char] >= left:
            left = seen[char] + 1

        # Update last seen position
        seen[char] = right

        # Update max length
        max_length = max(max_length, right - left + 1)

    return max_length`;

const LONGEST_SUBSTRING_CPP = `int lengthOfLongestSubstring(std::string s) {
    std::unordered_map<char, int> seen;
    int left = 0;
    int maxLength = 0;

    for (int right = 0; right < s.size(); right++) {
        char c = s[right];

        // If char was seen inside current window, shrink window
        if (seen.count(c) && seen[c] >= left) {
            left = seen[c] + 1;
        }

        // Update last seen position
        seen[c] = right;

        // Update max length
        maxLength = std::max(maxLength, right - left + 1);
    }

    return maxLength;
}`;

const LONGEST_SUBSTRING_JAVA = `public int lengthOfLongestSubstring(String s) {
    Map<Character, Integer> seen = new HashMap<>();
    int left = 0;
    int maxLength = 0;

    for (int right = 0; right < s.length(); right++) {
        char c = s.charAt(right);

        // If char was seen inside current window, shrink window
        if (seen.containsKey(c) && seen.get(c) >= left) {
            left = seen.get(c) + 1;
        }

        // Update last seen position
        seen.put(c, right);

        // Update max length
        maxLength = Math.max(maxLength, right - left + 1);
    }

    return maxLength;
}`;

const LONGEST_SUBSTRING_JS = `function lengthOfLongestSubstring(s) {
  const seen = new Map();
  let left = 0;
  let maxLength = 0;

  for (let right = 0; right < s.length; right++) {
    const char = s[right];

    // If char was seen inside current window, shrink window
    if (seen.has(char) && seen.get(char) >= left) {
      left = seen.get(char) + 1;
    }

    // Update last seen position
    seen.set(char, right);

    // Update max length
    maxLength = Math.max(maxLength, right - left + 1);
  }

  return maxLength;
}`;

const LONGEST_SUBSTRING_GO = `func lengthOfLongestSubstring(s string) int {
    seen := make(map[byte]int)
    left := 0
    maxLength := 0

    for right := 0; right < len(s); right++ {
        c := s[right]

        // If char was seen inside current window, shrink window
        if idx, ok := seen[c]; ok && idx >= left {
            left = idx + 1
        }

        // Update last seen position
        seen[c] = right

        // Update max length
        if right-left+1 > maxLength {
            maxLength = right - left + 1
        }
    }

    return maxLength
}`;

const LONGEST_SUBSTRING_RUST = `fn length_of_longest_substring(s: String) -> i32 {
    use std::collections::HashMap;

    let mut seen: HashMap<char, usize> = HashMap::new();
    let mut left = 0usize;
    let mut max_length = 0i32;

    for (right, c) in s.chars().enumerate() {
        // If char was seen inside current window, shrink window
        if let Some(&idx) = seen.get(&c) {
            if idx >= left {
                left = idx + 1;
            }
        }

        // Update last seen position
        seen.insert(c, right);

        // Update max length
        let window_size = (right - left + 1) as i32;
        if window_size > max_length {
            max_length = window_size;
        }
    }

    max_length
}`;

// ─────────────────────────────────────────────────────────────────────────────
// Implementation Registry
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Registry of all pattern problem implementations by language.
 */
const PATTERN_IMPLEMENTATIONS: Record<PatternProblemType, Record<Language, string>> = {
  "longest-substring-norepeat": {
    python: LONGEST_SUBSTRING_PYTHON,
    cpp: LONGEST_SUBSTRING_CPP,
    java: LONGEST_SUBSTRING_JAVA,
    javascript: LONGEST_SUBSTRING_JS,
    go: LONGEST_SUBSTRING_GO,
    rust: LONGEST_SUBSTRING_RUST,
  },
};

/**
 * Get implementation code for a specific pattern problem and language.
 */
export function getPatternImplementation(problem: PatternProblemType, language: Language): string {
  return PATTERN_IMPLEMENTATIONS[problem][language];
}

/**
 * Get all implementations for a specific pattern problem.
 */
export function getAllPatternImplementations(
  problem: PatternProblemType
): Record<Language, string> {
  return PATTERN_IMPLEMENTATIONS[problem];
}
