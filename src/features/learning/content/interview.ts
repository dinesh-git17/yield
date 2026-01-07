import type { InterviewProblemType } from "@/lib/store";
import type { RelatedAlgorithm } from "./sorting";

/**
 * Demo configuration for "Try It Yourself" section in interview problems.
 */
export interface InterviewDemo {
  /** Short label for the demo */
  label: string;
  /** Description of what this demo shows */
  description: string;
  /** Heights array for the demo */
  heights: number[];
}

/**
 * Approach method for interview problems.
 * Describes different algorithmic approaches to solve the problem.
 */
export interface ApproachMethod {
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
export interface InterviewQA {
  /** The question asked in interviews */
  question: string;
  /** The crisp answer */
  answer: string;
}

/**
 * Educational article content for interview problems.
 * Designed for interview preparation with multiple approach explanations.
 */
export interface InterviewArticle {
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
  /** Step-by-step explanation of the optimal approach */
  mechanics: string;
  /** Different approaches to solve the problem */
  approaches: ApproachMethod[];
  /** Why the optimal approach works (the key invariant) */
  whyItWorks: string;
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
  interviewQA: InterviewQA[];
  /** When to use this approach */
  whenToUse: string;
  /** When NOT to use this approach */
  whenNotToUse: string;
  /** Related algorithms for cross-linking */
  relatedAlgorithms: RelatedAlgorithm[];
  /** Pre-configured demos for visualization */
  demos: InterviewDemo[];
}

/**
 * Complete content registry for all interview problems.
 */
export const INTERVIEW_ARTICLES: Record<InterviewProblemType, InterviewArticle> = {
  "trapping-rain-water": {
    title: "Trapping Rain Water",
    tagline: "The Rooftop Plumber",
    difficulty: "Hard",
    pattern: "Two Pointers",

    history: `This problem is a classic because it looks like "just add some water" until you realize you're really solving **local minima with global boundaries**. It shows up in interviews because it tests whether you can:

- reason about constraints
- avoid overcounting
- choose the right strategy (not brute-force panic)

Think of the bars as buildings. After it rains, water collects in the dips... but only if there are **taller buildings on both sides**. It's a beautiful problem that bridges visual intuition with algorithmic elegance.`,

    problemDefinition: `You're given an array of non-negative integers where each value represents a bar height. Each bar has width 1.

Return how much rainwater can be trapped after raining.

**Rule of the universe:**
Water at position $i$ depends on the **tallest wall on the left** and the **tallest wall on the right**.`,

    coreIdea: `At any index $i$:

$$water[i] = max(0, min(maxLeft[i], maxRight[i]) - height[i])$$

That's it. Everything else is just *how efficiently you compute it*.`,

    mechanics: `The Two Pointers approach is the optimal solution. It uses the key insight that water level at any position is bounded by the **shorter** of the two maximum boundaries.

**The Algorithm Step-by-Step:**

1. **Initialize**: Two pointers at the extremes ($l = 0$, $r = n-1$) and track $maxLeft$ and $maxRight$.
2. **Compare**: Check which side has the smaller maximum.
3. **Process Smaller Side**: If $height[l] \\leq height[r]$, process the left side:
   - Move $l$ inward
   - If current height > $maxLeft$, update $maxLeft$ (no water here)
   - Otherwise, add $maxLeft - height[l]$ to total water
4. **Mirror for Right**: Same logic, mirrored for the right pointer.
5. **Repeat**: Continue until pointers meet.

**The Shrinking Window:**
We shrink from both ends. At each step, we resolve the side with the smaller boundary because that's the side we can fully compute—the other side is guaranteed to have a wall at least as tall.`,

    approaches: [
      {
        name: "Brute Force",
        description:
          "For each index, scan left for max and scan right for max, then compute water at that position.",
        timeComplexity: "O(n²)",
        spaceComplexity: "O(1)",
      },
      {
        name: "Prefix/Suffix Arrays (DP)",
        description:
          "Precompute maxLeft[i] and maxRight[i] arrays, then compute water in one pass.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)",
      },
      {
        name: "Two Pointers",
        description:
          "Use two pointers shrinking inward, tracking running max on each side. Process the side with smaller max.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)",
        isOptimal: true,
      },
      {
        name: "Monotonic Stack",
        description:
          "Use a decreasing stack of indices. When finding a taller bar, compute trapped water in the valley formed.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)",
      },
    ],

    whyItWorks: `Here's the invariant that makes Two Pointers valid:

- Water level is capped by the **shorter side boundary**.
- When $height[l] \\leq height[r]$, you *already know* the right side has at least a boundary as tall as $height[l]$ (because $height[r]$ is taller or equal *right now*).
- So the trapped water at $l$ depends only on $maxLeft$.

**Meaning:**
- If $height[l] < maxLeft$, you can add $maxLeft - height[l]$.
- Otherwise update $maxLeft$.

Same logic mirrored on the right. This prevents overthinking, avoids backtracking, and guarantees linear time.`,

    timeComplexity: {
      complexity: "O(n)",
      explanation:
        "Single pass through the array with two pointers moving inward. Each element is visited exactly once.",
    },
    spaceComplexity: {
      complexity: "O(1)",
      explanation:
        "Only four variables needed: two pointers and two running maximums. No auxiliary data structures.",
    },

    useCases: [
      "Elevation and flood modeling (simplified 1D version)",
      "Histogram-based signal smoothing",
      "Memory allocation and capacity planning intuition (peaks define constraints, valleys are unused capacity)",
      "Gateway to 2D/3D geometry problems",
      "Water distribution system analysis",
    ],

    keyInsights: [
      "The trapped water at each index depends on **global boundaries**, not local neighbors.",
      "Two Pointers works because you resolve the **currently shorter side**.",
      "The problem is really: how much empty space exists under a 'ceiling' formed by boundary maxima.",
      "Stack solution teaches you how to compute 'valleys' once a right boundary appears.",
      "The formula $min(maxLeft, maxRight) - height$ captures the physics of water settling.",
    ],

    pitfalls: [
      "Forgetting $max(0, ...)$ and subtracting into negative water.",
      "Thinking the water depends on 'nearest taller wall' instead of 'tallest wall'.",
      "Off-by-one mistakes in the stack width calculation.",
      "Trying to simulate actual water filling (way too slow and messy).",
      "Processing the wrong pointer (must process the side with smaller max).",
    ],

    interviewQA: [
      {
        question: "Why does min(maxLeft, maxRight) determine the water level?",
        answer:
          "Because water spills over the shorter boundary first. The taller boundary doesn't matter until the shorter one increases.",
      },
      {
        question: "Why can Two Pointers decide a side greedily?",
        answer:
          "Because the shorter side is the limiting factor. When left height is smaller, the right side already guarantees a boundary tall enough to resolve left safely.",
      },
      {
        question: "Which solution should you present first in an interview?",
        answer:
          "Start with brute force to show understanding, then immediately upgrade to prefix/suffix, then deliver Two Pointers as the optimal.",
      },
      {
        question: "When would you choose the stack solution?",
        answer:
          "When you want to reuse the monotonic stack pattern for similar problems (largest rectangle, daily temps, next greater element).",
      },
      {
        question: "What's the difference between this and Container With Most Water?",
        answer:
          "Container With Most Water finds the max area between two lines. Trapping Rain Water sums all water trapped across the entire elevation map. Similar two-pointer approach, different computation.",
      },
    ],

    whenToUse:
      "Use the Two Pointers approach when you need maximum efficiency and memory matters. It's the cleanest interview answer and demonstrates strong algorithmic intuition. The prefix/suffix approach is fine for clarity when explaining to beginners.",

    whenNotToUse:
      "Don't overcomplicate it when the array is tiny and prefix/suffix is fine. Also don't confuse this with the 2D Trapping Rain Water problem—that one requires BFS/priority queue and is a different beast entirely.",

    relatedAlgorithms: [
      {
        algorithm: "dijkstra",
        mode: "pathfinding",
        relationship: "similar boundary computation pattern",
      },
      {
        algorithm: "bfs",
        mode: "pathfinding",
        relationship: "2D water trapping uses BFS",
      },
      {
        algorithm: "max-heap",
        mode: "tree",
        relationship: "stack solution uses similar data structure thinking",
      },
    ],

    demos: [
      {
        label: "Classic",
        description: "The standard example with multiple valleys and varying depths",
        heights: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
      },
      {
        label: "Deep Valley",
        description: "A single deep valley between two tall walls",
        heights: [3, 0, 0, 2, 0, 4],
      },
      {
        label: "Stairs Up-Down",
        description: "Ascending then descending pattern",
        heights: [4, 2, 0, 3, 2, 5],
      },
      {
        label: "Pool",
        description: "Symmetric pool with equal boundaries",
        heights: [5, 2, 1, 2, 1, 2, 5],
      },
    ],
  },
};

/**
 * Get article content for a specific interview problem.
 */
export function getInterviewArticle(problem: InterviewProblemType): InterviewArticle {
  return INTERVIEW_ARTICLES[problem];
}
