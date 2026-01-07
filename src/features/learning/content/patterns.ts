import type { PatternProblemType } from "@/lib/store";
import type { RelatedAlgorithm } from "./sorting";

/**
 * Demo configuration for "Try It Yourself" section in pattern problems.
 */
export interface PatternDemo {
  /** Short label for the demo */
  label: string;
  /** Description of what this demo shows */
  description: string;
  /** Input string for the demo */
  input: string;
}

/**
 * Approach method for pattern problems.
 * Describes different algorithmic approaches to solve the problem.
 */
export interface PatternApproach {
  /** Name of the approach */
  name: string;
  /** Brief description of how it works */
  description: string;
  /** Time complexity */
  timeComplexity: string;
  /** Space complexity */
  spaceComplexity: string;
  /** Whether this is the recommended/optimal approach */
  isOptimal?: boolean;
}

/**
 * Interview Q&A for the problem.
 */
export interface PatternQA {
  /** The question asked in interviews */
  question: string;
  /** The crisp answer */
  answer: string;
}

/**
 * Educational article content for pattern problems.
 * Designed for interview preparation with multiple approach explanations.
 */
export interface PatternArticle {
  /** Display name of the problem */
  title: string;
  /** A catchy one-liner describing the essence */
  tagline: string;
  /** Historical background and why this problem matters */
  history: string;
  /** Clear problem definition */
  problemDefinition: string;
  /** Core idea/formula that solves the problem */
  coreIdea: string;
  /** The rule/invariant of the window */
  windowRule: string;
  /** Step-by-step explanation of the optimal approach */
  mechanics: string;
  /** Why the max() matters explanation */
  whyMaxMatters: string;
  /** Different approaches to solve the problem */
  approaches: PatternApproach[];
  /** Time complexity with explanation */
  timeComplexity: {
    complexity: string;
    explanation: string;
  };
  /** Space complexity */
  spaceComplexity: {
    complexity: string;
    explanation: string;
  };
  /** The technique/pattern used */
  pattern: string;
  /** Difficulty level */
  difficulty: "Easy" | "Medium" | "Hard";
  /** Real-world applications and use cases */
  useCases: string[];
  /** Key insights and takeaways */
  keyInsights: string[];
  /** Common interview pitfalls to avoid */
  pitfalls: string[];
  /** Interview Q&A pairs */
  interviewQA: PatternQA[];
  /** When to use this approach */
  whenToUse: string;
  /** When NOT to use this approach */
  whenNotToUse: string;
  /** Related pattern problems for cross-linking */
  relatedAlgorithms: RelatedAlgorithm[];
  /** Pre-configured demos for visualization */
  demos: PatternDemo[];
}

/**
 * Pattern problem slugs for URL mapping.
 * Maps from URL-friendly slug to internal PatternProblemType.
 */
export type PatternSlug = "longest-substring";

/**
 * Maps URL slugs to internal problem types.
 */
export const PATTERN_SLUG_MAP: Record<PatternSlug, PatternProblemType> = {
  "longest-substring": "longest-substring-norepeat",
};

/**
 * Reverse mapping: internal problem types to URL slugs.
 */
export const PATTERN_TYPE_TO_SLUG: Record<PatternProblemType, PatternSlug> = {
  "longest-substring-norepeat": "longest-substring",
};

/**
 * Complete content registry for all pattern problems.
 */
export const PATTERN_ARTICLES: Record<PatternSlug, PatternArticle> = {
  "longest-substring": {
    title: "Longest Substring Without Repeating Characters",
    tagline: "The Club Bouncer",
    difficulty: "Medium",
    pattern: "Sliding Window + Hash Map",

    history: `This problem is a staple because it looks deceptively simple until you try to do it efficiently.

At first glance, it feels like a brute-force substring problem. But interviews use it to test whether you can:

- Maintain constraints dynamically
- Avoid unnecessary recomputation
- Recognize the **Sliding Window** pattern
- Reason about invariants instead of nested loops

It is also one of the cleanest demonstrations of how **state + window movement** can reduce an O(n²) problem to O(n).`,

    problemDefinition: `Given a string $s$, find the length of the **longest substring** without repeating characters.

A substring must be **contiguous**.`,

    coreIdea: `We want the **largest window** where all characters are unique.

Instead of restarting every time we hit a duplicate, we:
- Track where each character was last seen
- Move the left boundary **only when necessary**
- Never move the window backward`,

    windowRule: `At all times, the window $[left, right]$ must satisfy:

**All characters inside the window are unique**

This rule is the invariant.
Every operation exists to restore this rule when it is violated.`,

    mechanics: `We scan the string once using two pointers.

- $right$ expands the window
- $left$ shrinks the window only when duplicates appear
- A hash map stores the **most recent index** of each character

When a duplicate is found:
- We jump $left$ to **one position after** the last occurrence
- We **never move left backward**

**The Algorithm Step-by-Step:**

1. Initialize:
   - $left = 0$
   - $seen = \\{\\}$
   - $maxLength = 0$

2. Expand the window by moving $right$

3. If $s[right]$ was seen **inside the current window**:
   - Move $left$ to $max(left, seen[s[right]] + 1)$

4. Update $seen[s[right]] = right$

5. Update the answer:
   - $maxLength = max(maxLength, right - left + 1)$

6. Repeat until the string ends`,

    whyMaxMatters: `This line is the heart of the solution:

$left = max(left, seen[char] + 1)$

Without $max$, you risk moving $left$ **backward**, which breaks the window invariant.

This ensures:
- The window only moves forward
- Time complexity stays linear
- No character is processed more than twice`,

    approaches: [
      {
        name: "Brute Force",
        description: "Check every possible substring and test for duplicates.",
        timeComplexity: "O(n²)",
        spaceComplexity: "O(1)",
      },
      {
        name: "Sliding Window",
        description: "Track uniqueness dynamically while expanding and shrinking the window.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(min(n, alphabet))",
        isOptimal: true,
      },
    ],

    timeComplexity: {
      complexity: "O(n)",
      explanation:
        "Each character is visited at most once by right and once by left. No nested loops. No backtracking.",
    },
    spaceComplexity: {
      complexity: "O(min(n, alphabet))",
      explanation: "At most, we store one entry per unique character.",
    },

    useCases: [
      "**Autocomplete systems** — Avoid repeated characters when building suggestions",
      "**Streaming analytics** — Track unique sessions or events in rolling windows",
      "**Input validation** — Enforcing uniqueness constraints efficiently",
      "**Log processing** — Detecting longest unique event streaks",
      "**Gateway problem** — Teaches patterns used in Minimum Window Substring, At Most K Distinct Characters, and Longest Repeating Character Replacement",
    ],

    keyInsights: [
      "This problem is not about strings. It is about maintaining a **valid window** and updating boundaries **only when constraints break**.",
      "Once you master this, most sliding window problems feel familiar.",
      "The $max()$ function prevents left from moving backward — this is the critical detail many miss.",
      "Think of the window as a **club with a strict bouncer**: every character must be unique, and if someone re-enters, everyone before them is kicked out.",
      "The formula $right - left + 1$ gives window size at any moment.",
    ],

    pitfalls: [
      "Moving left backward",
      "Resetting the window entirely on duplicates",
      "Using nested loops unnecessarily",
      "Forgetting that substrings must be contiguous",
      "Confusing subsequences with substrings",
    ],

    interviewQA: [
      {
        question: "Why is Sliding Window the right pattern here?",
        answer:
          "Because the constraint (unique characters) behaves monotonically as the window expands.",
      },
      {
        question: "Why not remove characters one by one?",
        answer: "Jumping left directly avoids redundant work and keeps the solution O(n).",
      },
      {
        question: "What changes if the alphabet is fixed (ASCII)?",
        answer: "Space becomes O(1). Time stays O(n).",
      },
      {
        question: 'How would you modify this for "at most K distinct characters"?',
        answer:
          "Replace last-seen indices with frequency counts and track the number of distinct keys.",
      },
    ],

    whenToUse:
      "Use Sliding Window when you need the best contiguous range, the constraint can be checked incrementally, and you want linear time.",

    whenNotToUse:
      "Avoid it when the constraint is non-monotonic or you need to consider skipping elements arbitrarily.",

    relatedAlgorithms: [
      {
        algorithm: "trapping-rain-water",
        mode: "interview",
        relationship: "uses Two Pointers, a cousin of Sliding Window",
      },
      {
        algorithm: "bfs",
        mode: "pathfinding",
        relationship: "both use frontier-based exploration",
      },
    ],

    demos: [
      {
        label: "Classic",
        description: 'The standard LeetCode example with max substring "abc"',
        input: "abcabcbb",
      },
      {
        label: "All Same",
        description: "All identical characters — max is 1",
        input: "bbbbb",
      },
      {
        label: "All Unique",
        description: "Entire string is the answer",
        input: "abcdefgh",
      },
      {
        label: "Mixed",
        description: 'Multiple valid windows — "wke" or "kew"',
        input: "pwwkew",
      },
    ],
  },
};

/**
 * Get article content for a specific pattern problem.
 */
export function getPatternArticle(slug: PatternSlug): PatternArticle {
  return PATTERN_ARTICLES[slug];
}

/**
 * Check if a slug is a valid pattern problem.
 */
export function isValidPatternSlug(slug: string): slug is PatternSlug {
  return slug in PATTERN_ARTICLES;
}
