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
// ─────────────────────────────────────────────────────────────────────────────
// Minimum Window Substring - Sliding Window (Optimal)
// Placeholder implementations - will be completed in STORY-105
// ─────────────────────────────────────────────────────────────────────────────

const MIN_WINDOW_PYTHON = `def min_window(s: str, t: str) -> str:
    """Find minimum window substring containing all characters of t."""
    from collections import Counter

    need = Counter(t)
    window: dict[str, int] = {}
    have, required = 0, len(need)
    result, result_len = [-1, -1], float('inf')
    left = 0

    for right, char in enumerate(s):
        window[char] = window.get(char, 0) + 1

        if char in need and window[char] == need[char]:
            have += 1

        while have == required:
            if (right - left + 1) < result_len:
                result = [left, right]
                result_len = right - left + 1

            window[s[left]] -= 1
            if s[left] in need and window[s[left]] < need[s[left]]:
                have -= 1
            left += 1

    return "" if result_len == float('inf') else s[result[0]:result[1]+1]`;

const MIN_WINDOW_CPP = `std::string minWindow(std::string s, std::string t) {
    std::unordered_map<char, int> need, window;
    for (char c : t) need[c]++;

    int have = 0, required = need.size();
    int left = 0, minLen = INT_MAX, minStart = 0;

    for (int right = 0; right < s.size(); right++) {
        char c = s[right];
        window[c]++;

        if (need.count(c) && window[c] == need[c]) have++;

        while (have == required) {
            if (right - left + 1 < minLen) {
                minLen = right - left + 1;
                minStart = left;
            }
            char lc = s[left];
            window[lc]--;
            if (need.count(lc) && window[lc] < need[lc]) have--;
            left++;
        }
    }
    return minLen == INT_MAX ? "" : s.substr(minStart, minLen);
}`;

const MIN_WINDOW_JAVA = `public String minWindow(String s, String t) {
    Map<Character, Integer> need = new HashMap<>();
    Map<Character, Integer> window = new HashMap<>();
    for (char c : t.toCharArray()) need.merge(c, 1, Integer::sum);

    int have = 0, required = need.size();
    int left = 0, minLen = Integer.MAX_VALUE, minStart = 0;

    for (int right = 0; right < s.length(); right++) {
        char c = s.charAt(right);
        window.merge(c, 1, Integer::sum);

        if (need.containsKey(c) && window.get(c).equals(need.get(c))) have++;

        while (have == required) {
            if (right - left + 1 < minLen) {
                minLen = right - left + 1;
                minStart = left;
            }
            char lc = s.charAt(left);
            window.merge(lc, -1, Integer::sum);
            if (need.containsKey(lc) && window.get(lc) < need.get(lc)) have--;
            left++;
        }
    }
    return minLen == Integer.MAX_VALUE ? "" : s.substring(minStart, minStart + minLen);
}`;

const MIN_WINDOW_JS = `function minWindow(s: string, t: string): string {
  const need: Record<string, number> = {};
  for (const c of t) need[c] = (need[c] ?? 0) + 1;

  let have = 0, required = Object.keys(need).length;
  const window: Record<string, number> = {};
  let left = 0, minLen = Infinity, minStart = 0;

  for (let right = 0; right < s.length; right++) {
    const c = s[right];
    window[c] = (window[c] ?? 0) + 1;
    if (need[c] && window[c] === need[c]) have++;

    while (have === required) {
      if (right - left + 1 < minLen) {
        minLen = right - left + 1;
        minStart = left;
      }
      const lc = s[left];
      window[lc]--;
      if (need[lc] && window[lc] < need[lc]) have--;
      left++;
    }
  }
  return minLen === Infinity ? "" : s.slice(minStart, minStart + minLen);
}`;

const MIN_WINDOW_GO = `func minWindow(s string, t string) string {
    need := make(map[byte]int)
    for i := 0; i < len(t); i++ {
        need[t[i]]++
    }

    window := make(map[byte]int)
    have, required := 0, len(need)
    left, minLen, minStart := 0, len(s)+1, 0

    for right := 0; right < len(s); right++ {
        c := s[right]
        window[c]++
        if need[c] > 0 && window[c] == need[c] {
            have++
        }

        for have == required {
            if right-left+1 < minLen {
                minLen = right - left + 1
                minStart = left
            }
            lc := s[left]
            window[lc]--
            if need[lc] > 0 && window[lc] < need[lc] {
                have--
            }
            left++
        }
    }
    if minLen > len(s) {
        return ""
    }
    return s[minStart : minStart+minLen]
}`;

const MIN_WINDOW_RUST = `pub fn min_window(s: String, t: String) -> String {
    use std::collections::HashMap;

    let s: Vec<char> = s.chars().collect();
    let mut need: HashMap<char, i32> = HashMap::new();
    for c in t.chars() {
        *need.entry(c).or_insert(0) += 1;
    }

    let mut window: HashMap<char, i32> = HashMap::new();
    let (mut have, required) = (0, need.len());
    let (mut left, mut min_len, mut min_start) = (0, usize::MAX, 0);

    for right in 0..s.len() {
        let c = s[right];
        *window.entry(c).or_insert(0) += 1;
        if need.get(&c) == window.get(&c) {
            have += 1;
        }

        while have == required {
            if right - left + 1 < min_len {
                min_len = right - left + 1;
                min_start = left;
            }
            let lc = s[left];
            *window.get_mut(&lc).unwrap() -= 1;
            if need.contains_key(&lc) && window[&lc] < need[&lc] {
                have -= 1;
            }
            left += 1;
        }
    }
    if min_len == usize::MAX { String::new() }
    else { s[min_start..min_start+min_len].iter().collect() }
}`;

// Implementation Registry
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Registry of all pattern problem implementations by language.
 * Extended to support min-window-substring (STORY-105).
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
  "min-window-substring": {
    python: MIN_WINDOW_PYTHON,
    cpp: MIN_WINDOW_CPP,
    java: MIN_WINDOW_JAVA,
    javascript: MIN_WINDOW_JS,
    go: MIN_WINDOW_GO,
    rust: MIN_WINDOW_RUST,
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
