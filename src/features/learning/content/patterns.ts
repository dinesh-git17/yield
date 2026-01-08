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
 * Extended to support min-window-substring (STORY-105).
 */
export type PatternSlug = "longest-substring" | "min-window";

/**
 * Maps URL slugs to internal problem types.
 */
export const PATTERN_SLUG_MAP: Record<PatternSlug, PatternProblemType> = {
  "longest-substring": "longest-substring-norepeat",
  "min-window": "min-window-substring",
};

/**
 * Reverse mapping: internal problem types to URL slugs.
 */
export const PATTERN_TYPE_TO_SLUG: Record<PatternProblemType, PatternSlug> = {
  "longest-substring-norepeat": "longest-substring",
  "min-window-substring": "min-window",
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

  "min-window": {
    title: "Minimum Window Substring",
    tagline: "The Bouncer With a Checklist",
    difficulty: "Hard",
    pattern: "Sliding Window + Frequency Map",

    history: `This problem is infamous for a reason.

It looks like a normal substring question until you realize you are not just avoiding duplicates anymore. Now you are matching **requirements**.

Minimum Window Substring is a classic interview filter because it tests whether you truly understand Sliding Window invariants, when a window is **valid** vs **optimal**, how to track constraints without re-scanning, and how to shrink aggressively without breaking correctness.

If Longest Substring is about freedom, this one is about discipline.`,

    problemDefinition: `Given two strings $s$ (the source) and $t$ (the target), find the **smallest substring** of $s$ that contains **all characters** of $t$, including duplicates.

If no such substring exists, return an empty string.

A substring must be contiguous.`,

    coreIdea: `We want the **smallest valid window**, not just any valid window.

A window is considered **valid** when it contains every character in $t$, and each character appears **at least as many times** as required.

The moment the window becomes valid, we try to shrink it from the left. We keep shrinking until it breaks. The smallest valid version is a candidate answer.

This is why the algorithm feels harder than it looks.`,

    windowRule: `At all times, the window $[left, right]$ must track **whether it satisfies all required character counts**.

This is the invariant.

Everything in the algorithm exists to answer one question efficiently:

**"Is my current window valid?"**`,

    mechanics: `We scan the string using two pointers: $right$ expands the window, and $left$ shrinks the window once it becomes valid.

We use a frequency map for characters in $t$ and a running count of how many required characters are satisfied.

The key idea is that we do **not** re-check the entire window. We update validity incrementally as characters enter and leave.

**The Algorithm Step-by-Step:**

1. Build a frequency map of characters needed from $t$
2. Initialize $left = 0$, $right = 0$, $formed = 0$ (how many requirements are satisfied)
3. Expand $right$ to include characters
4. When all requirements are satisfied, shrink $left$ as much as possible and update the best (minimum) window
5. Continue until $right$ reaches the end

Every character enters and leaves the window at most once.`,

    whyMaxMatters: `Unlike longest-substring problems, a character leaving the window might invalidate it. Not all characters are equally important, and some characters are required multiple times.

Shrinking too aggressively breaks correctness. Shrinking too cautiously misses optimal answers.

This problem forces you to think in **counts**, not presence.`,

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
        spaceComplexity: "O(alphabet)",
        isOptimal: true,
      },
    ],

    timeComplexity: {
      complexity: "O(n)",
      explanation: "Both pointers move forward only. No nested scans. No resets.",
    },
    spaceComplexity: {
      complexity: "O(alphabet)",
      explanation: "We store frequency counts for required characters only.",
    },

    useCases: [
      "**Search engines** — Finding shortest snippets containing all query terms",
      "**Text editors** — Find-and-replace with minimum context",
      "**Data pipelines** — Minimum window containing required events",
      "**Genome analysis** — Finding shortest sequences with required nucleotides",
      "**Gateway problem** — Teaches patterns used in Permutation in String, Minimum Size Subarray Sum, and Subarrays with At Most K Distinct Characters",
    ],

    keyInsights: [
      "This problem is not about substrings. It is about tracking requirements, knowing exactly *when* a window becomes valid, and knowing exactly *how far* you can shrink it.",
      "Once that clicks, the solution becomes systematic.",
      "The $have$ counter avoids rechecking the entire frequency map each step.",
      "Think of this as a bouncer with a clipboard: every required character is on the checklist, some guests need to appear multiple times, and the smallest moment when everyone was present is the answer.",
    ],

    pitfalls: [
      "Treating this like a 'unique characters' problem",
      "Forgetting that duplicates in $t$ matter",
      "Re-checking the entire window repeatedly",
      "Shrinking the window before it is valid",
      "Returning the first valid window instead of the smallest",
    ],

    interviewQA: [
      {
        question: "How does this differ from Longest Substring Without Repeating Characters?",
        answer:
          "Longest Substring maintains validity by shrinking on violations. Min Window expands to achieve validity, then shrinks to optimize.",
      },
      {
        question: "Why use two counters (have/required)?",
        answer:
          "To avoid iterating the entire frequency map on every step. We only check when a character reaches its required count.",
      },
      {
        question: "What changes if the alphabet is fixed (ASCII)?",
        answer: "Space becomes O(1). Time stays O(n).",
      },
      {
        question: 'How would you modify this for "Permutation in String"?',
        answer:
          "Keep the window size fixed to len(t) and check if have equals required at each step.",
      },
    ],

    whenToUse:
      "Use Minimum Window Sliding Window when you need the **smallest contiguous range**, the constraint involves **counts or frequencies**, validity can be tracked incrementally, and you want linear time.",

    whenNotToUse:
      "Avoid when the constraint is non-monotonic or you need to consider skipping elements arbitrarily.",

    relatedAlgorithms: [
      {
        algorithm: "longest-substring-norepeat",
        mode: "patterns",
        relationship: "both use Sliding Window but with different objectives (min vs max)",
      },
      {
        algorithm: "trapping-rain-water",
        mode: "interview",
        relationship: "uses Two Pointers, a cousin of Sliding Window",
      },
    ],

    demos: [
      {
        label: "Classic",
        description: 'Find minimum window in "ADOBECODEBANC" containing "ABC"',
        input: "ADOBECODEBANC",
      },
      {
        label: "Overlap",
        description: "Target has overlapping requirements",
        input: "AAABBB",
      },
      {
        label: "No Match",
        description: "Target cannot be found",
        input: "ABC",
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
