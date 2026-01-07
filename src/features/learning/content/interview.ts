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

  "largest-rectangle-histogram": {
    title: "Largest Rectangle in Histogram",
    tagline: "The Skyline Maximizer",
    difficulty: "Hard",
    pattern: "Monotonic Stack",

    history: `This problem is a rite of passage for anyone learning algorithm patterns. Interviewers love it because it quietly tests a lot of things at once:

- Can you see past the obvious O(n²) brute force?
- Do you recognize when a stack is the right tool for the job?
- Can you survive off-by-one errors without panicking?

Picture each bar as a building in a skyline. Your goal is to place the biggest possible rectangular billboard across those buildings. Every bar can be the height of a rectangle, but the real question is how wide it can stretch before something shorter ruins the party.`,

    problemDefinition: `You are given an array of non-negative integers. Each value represents the height of a histogram bar. Every bar has a width of exactly 1.

Your task is simple to state and painful to brute force:

**Return the area of the largest rectangle that can be formed.**`,

    coreIdea: `For every bar with height $h$, imagine it being the shortest bar in a rectangle.

Now ask two questions:
- How far can it extend to the left?
- How far can it extend to the right?

Once you know that span, the area becomes straightforward.

For a bar at index $i$ with height $h$:

$$area[i] = h \\times (rightBound[i] - leftBound[i] - 1)$$

Where:
- $leftBound[i]$ is the index of the first shorter bar to the left, or $-1$ if none exists
- $rightBound[i]$ is the index of the first shorter bar to the right, or $n$ if none exists

The challenge is computing these bounds efficiently without scanning left and right for every bar.`,

    mechanics: `The monotonic stack keeps bar indices in increasing height order. Think of it as a memory structure that remembers where each bar started being valid. Whenever we encounter a bar that is shorter than the stack top, we have found a right boundary. That means it is time to calculate areas.

**The Algorithm Step-by-Step:**

1. Initialize an empty stack.
2. Iterate through all bars.
3. Add one extra virtual bar of height 0 at the end to force cleanup.
4. For each bar:
   - While the current bar is shorter than the bar at the top of the stack:
     - Pop the stack.
     - Compute the rectangle area using the popped bar as height.
     - Update the maximum area.
   - Push the current index onto the stack.
5. Return the maximum area found.

The virtual zero-height bar is the unsung hero here. It ensures no bar is left behind unprocessed.

**Why the Stack Must Be Monotonic:**

The stack always keeps indices of bars in increasing height order because:
- Taller bars can extend through shorter ones.
- Shorter bars immediately block all taller bars behind them.
- This ordering lets us compute left and right boundaries the moment a bar is popped.

Each bar is pushed once and popped once. No repeats. No chaos.`,

    approaches: [
      {
        name: "Brute Force",
        description: "Expand left and right for every bar. Easy to write, painful to optimize.",
        timeComplexity: "O(n²)",
        spaceComplexity: "O(1)",
      },
      {
        name: "Divide and Conquer",
        description:
          "Recursively split by the smallest bar. Elegant but slower and harder to implement.",
        timeComplexity: "O(n log n)",
        spaceComplexity: "O(log n)",
      },
      {
        name: "Monotonic Stack",
        description: "One pass, clean boundaries, interview approved.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)",
        isOptimal: true,
      },
    ],

    whyItWorks: `When a bar is popped from the stack:

- The current index is its right boundary.
- The new stack top is its left boundary.
- The maximum rectangle for that bar can be computed immediately.

No guessing. No revisiting.`,

    timeComplexity: {
      complexity: "O(n)",
      explanation: "Every bar enters and leaves the stack exactly one time.",
    },
    spaceComplexity: {
      complexity: "O(n)",
      explanation: "In the worst case, all bars are increasing and sit in the stack together.",
    },

    useCases: [
      "Skyline and geometry problems",
      "Maximum rectangle in binary matrices",
      "Memory allocation analysis",
      "Image region detection",
      "Stock performance windows",
    ],

    keyInsights: [
      "Every bar can define a rectangle.",
      "The first shorter bar on each side limits how far it can stretch.",
      "Monotonic stacks are perfect for next smaller or next greater element problems.",
      "The sentinel bar simplifies edge cases and saves you from cleanup logic.",
      "If you understand this problem, a whole family of stack problems suddenly becomes much easier.",
    ],

    pitfalls: [
      "Forgetting the sentinel bar at the end.",
      "Off-by-one errors in width calculation.",
      "Storing heights instead of indices.",
      "Not handling the empty stack case.",
      "Adding a cleanup loop instead of using a sentinel.",
    ],

    interviewQA: [
      {
        question: "Why use a stack instead of two arrays for left/right bounds?",
        answer:
          "The stack computes both bounds on-the-fly in one pass. When we pop, we know both bounds immediately: left is the new stack top, right is the current index.",
      },
      {
        question: "What does 'monotonic' mean in this context?",
        answer:
          "The stack maintains elements in strictly increasing height order. Whenever a smaller element arrives, we pop until the invariant is restored.",
      },
      {
        question: "Why add a zero-height bar at the end?",
        answer:
          "It acts as a sentinel that's shorter than everything, forcing all remaining stack elements to be popped and processed. Without it, you'd need a separate cleanup loop.",
      },
      {
        question: "How does this relate to Trapping Rain Water?",
        answer:
          "Both can use monotonic stacks! In Trapping Rain Water, the stack finds valleys to fill. Here, it finds how far each bar extends. Same tool, different application.",
      },
      {
        question: "Can this be solved with Two Pointers?",
        answer:
          "Not directly. Two Pointers works for Trapping Rain Water because we only need running max boundaries. Here, we need to know exact left/right bounds for each bar—stack is the right tool.",
      },
    ],

    whenToUse:
      "Use a monotonic stack when you need to find spans, ranges, or boundaries. It shines when each element depends on its nearest smaller or greater neighbor. You want linear time with predictable behavior.",

    whenNotToUse:
      "If two pointers or simple iteration solves the problem cleanly, do not force a stack. Stacks are powerful, but unnecessary stacks are how bugs are born.",

    relatedAlgorithms: [
      {
        algorithm: "trapping-rain-water",
        mode: "interview",
        relationship: "uses monotonic stack for valley detection",
      },
      {
        algorithm: "quick-sort",
        mode: "sorting",
        relationship: "divide and conquer alternative approach",
      },
      {
        algorithm: "merge-sort",
        mode: "sorting",
        relationship: "divide and conquer complexity analysis",
      },
    ],

    demos: [
      {
        label: "Classic",
        description: "The LeetCode example with a clear maximum rectangle",
        heights: [2, 1, 5, 6, 2, 3],
      },
      {
        label: "Ascending",
        description: "Strictly increasing heights - stack fills before cleanup",
        heights: [1, 2, 3, 4, 5, 6],
      },
      {
        label: "Descending",
        description: "Strictly decreasing heights - pops happen every step",
        heights: [6, 5, 4, 3, 2, 1],
      },
      {
        label: "Pyramid",
        description: "Mountain shape testing both expansion and contraction",
        heights: [1, 3, 5, 7, 5, 3, 1],
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
