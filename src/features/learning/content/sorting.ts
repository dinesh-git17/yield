import type { SortingAlgorithmType, VisualizerMode } from "@/lib/store";

/**
 * Represents a cross-reference to a related algorithm.
 * Used for the "Related Algorithms" section on Learn pages.
 */
export interface RelatedAlgorithm {
  /** Algorithm identifier (matches the slug in the URL) */
  algorithm: string;
  /** Visualization mode for cross-domain links (e.g., sorting → tree) */
  mode?: VisualizerMode;
  /** Human-readable relationship description (e.g., "stable alternative") */
  relationship: string;
}

/**
 * Educational article content for sorting algorithms.
 * This registry contains all the textbook-style content for the Learn pages.
 */
export interface SortingArticle {
  /** Display name of the algorithm */
  title: string;
  /** A catchy one-liner describing the essence */
  tagline: string;
  /** Historical background and origin story */
  history: string;
  /** Step-by-step explanation of how the algorithm works */
  mechanics: string;
  /** Best case time complexity with explanation */
  bestCase: {
    complexity: string;
    explanation: string;
  };
  /** Worst case time complexity with explanation */
  worstCase: {
    complexity: string;
    explanation: string;
  };
  /** Average case time complexity */
  averageCase: {
    complexity: string;
    explanation: string;
  };
  /** Space complexity */
  spaceComplexity: {
    complexity: string;
    explanation: string;
  };
  /** Real-world applications and use cases */
  useCases: string[];
  /** Key insights and takeaways */
  keyInsights: string[];
  /** When to use this algorithm */
  whenToUse: string;
  /** When NOT to use this algorithm */
  whenNotToUse: string;
  /** Related algorithms for cross-linking */
  relatedAlgorithms: RelatedAlgorithm[];
}

/**
 * Complete content registry for all sorting algorithms.
 */
export const SORTING_ARTICLES: Record<SortingAlgorithmType, SortingArticle> = {
  bubble: {
    title: "Bubble Sort",
    tagline: "The Participation Trophy",
    history: `Bubble Sort is likely the first algorithm every developer learns, and the first one they are told to stop using. Its origins are in the 1950s, named for the way large elements "bubble" to the top of the list like carbonation in a soda. Donald Knuth famously remarked that "the bubble sort seems to have nothing to recommend it, except a catchy name."

Despite the criticism, it remains the standard "Hello World" of algorithm classes because its logic maps 1:1 with how a human might inefficiently sort a deck of cards if they were tired.`,

    mechanics: `The algorithm works by frantically comparing neighbors. It steps through the list, looks at two adjacent items, and swaps them if they are in the wrong order. It repeats this until the list is clean.

**The Algorithm Step-by-Step:**

1. **Scan**: Start at index 0.
2. **Compare**: Look at item $i$ and item $i+1$.
3. **Swap**: If the one on the left is bigger, swap them.
4. **Repeat**: Do this for every pair in the list.
5. **Loop**: Go back to the start and do it all again until you finish a pass without making a single swap.

**The "Bubbling" Effect:**
After the first pass, the largest number is guaranteed to be at the very end. After the second pass, the second largest is locked in. The sorted portion grows from right to left.



**Optimization (The Early Exit):**
The only redeeming quality of Bubble Sort is that if you pass through the list and swap nothing, you know you're done. This makes it surprisingly fast for lists that are *almost* sorted.`,

    bestCase: {
      complexity: "O(n)",
      explanation:
        "If the array is already sorted, it does one 'sanity check' pass, realizes no swaps are needed, and quits early.",
    },
    worstCase: {
      complexity: "O(n²)",
      explanation:
        "If the array is reverse sorted, it has to move every single element across the entire array, one step at a time.",
    },
    averageCase: {
      complexity: "O(n²)",
      explanation:
        "On random data, it's slow. Very slow. It performs a quadratic number of comparisons and swaps.",
    },
    spaceComplexity: {
      complexity: "O(1)",
      explanation:
        "It sorts in-place. We only need a tiny bit of memory to store the temporary variable for swapping.",
    },

    useCases: [
      "Computer Science 101 classes",
      "Testing if a list is already sorted (sanity checks)",
      "Tiny datasets (less than 50 items)",
      "Computer Graphics (where swapping neighbors looks cool)",
    ],

    keyInsights: [
      "It is stable (doesn't reorder equal items).",
      "It is adaptive (fast if data is nearly sorted).",
      "It is easy to implement (hard to introduce bugs).",
      "It is theoretically arguably the worst general-purpose sort.",
    ],

    whenToUse:
      "Use it when you are teaching someone to code, or if you need to quickly check if a list is already sorted. It's also fine for lists so small that the CPU doesn't care.",

    whenNotToUse:
      "Any time performance matters. Even among the slow $O(n^2)$ algorithms, Insertion Sort is almost always better.",

    relatedAlgorithms: [
      {
        algorithm: "insertion",
        relationship: "faster adaptive alternative",
      },
      {
        algorithm: "selection",
        relationship: "similar simplicity, fewer swaps",
      },
      {
        algorithm: "gnome",
        relationship: "same swap pattern, no nested loops",
      },
    ],
  },

  selection: {
    title: "Selection Sort",
    tagline: "The Perfectionist",
    history: `Selection Sort comes from an era where writing to memory was expensive. Imagine carving stone tablets rather than writing to RAM.

It takes a "measure twice, cut once" approach. Instead of swapping constantly like Bubble Sort, Selection Sort scans the entire remaining list to find the absolute smallest item, and only then does it make a move. It is the most predictable of all sorting algorithms.`,

    mechanics: `Selection Sort divides the world into two parts: the sorted kingdom (left) and the unsorted wildlands (right). It repeatedly conquers the wildlands one element at a time.

**The Algorithm Step-by-Step:**

1. **Search**: Look through the entire unsorted portion of the list.
2. **Identify**: Find the index of the absolute minimum value.
3. **Swap**: Exchange that minimum value with the first element of the unsorted portion.
4. **Advance**: Move the boundary of the sorted kingdom one step to the right.
5. **Repeat**: Until the wildlands are empty.

**Visual Intuition:**
Imagine organizing a hand of cards. You look at all the cards, find the Ace, and put it at the front. Then you look at the remaining cards, find the 2, and put it next. That is Selection Sort.`,

    bestCase: {
      complexity: "O(n²)",
      explanation:
        "It has zero chill. Even if the list is already sorted, it will still scan every element to make sure.",
    },
    worstCase: {
      complexity: "O(n²)",
      explanation: "The number of comparisons is always the same: $(n^2 - n) / 2$.",
    },
    averageCase: {
      complexity: "O(n²)",
      explanation: "It doesn't care about the data order. It does the same work every time.",
    },
    spaceComplexity: {
      complexity: "O(1)",
      explanation: "It's an in-place sort. Low memory footprint.",
    },

    useCases: [
      "Systems where writing to memory is costly (Flash memory / EEPROM)",
      "Simple embedded systems",
      "Situations where you need consistent execution time (no spikes)",
      "Small lists where code size matters more than speed",
    ],

    keyInsights: [
      "It minimizes swaps (maximum $n$ swaps).",
      "It is usually NOT stable (might reorder equal items).",
      "It is completely non-adaptive (doesn't care if list is sorted).",
      "It is robust but slow.",
    ],

    whenToUse:
      "Use it when write operations are expensive (like on cheap flash storage) or when you need the sorting time to be perfectly predictable regardless of the input.",

    whenNotToUse: "If you need speed. If you need stability. If the list might already be sorted.",

    relatedAlgorithms: [
      {
        algorithm: "bubble",
        relationship: "similar simplicity, more swaps",
      },
      {
        algorithm: "heap",
        relationship: "uses selection concept at scale",
      },
      {
        algorithm: "insertion",
        relationship: "adaptive alternative",
      },
    ],
  },

  insertion: {
    title: "Insertion Sort",
    tagline: "The Human Approach",
    history: `This is the algorithm most humans run naturally. If you pick up a messy stack of papers and try to organize them by date, you are likely running Insertion Sort.

Because it mimics natural behavior, it is surprisingly efficient on data that is "natural"—meaning data that is already partially sorted. It serves as the backbone for complex modern algorithms like Timsort (used in V8 and Python).`,

    mechanics: `Insertion Sort builds the final sorted array one item at a time. It takes the next element and "inserts" it into the correct spot among the items you've already processed.

**The Algorithm Step-by-Step:**

1. **Pick**: Take the first element from the unsorted section. Call it the "Key".
2. **Compare**: Look at the elements in the sorted section (to the left).
3. **Shift**: If a sorted element is larger than your Key, slide it one space to the right.
4. **Drop**: Once you find a value smaller than your Key (or hit the start), drop the Key into the gap.
5. **Repeat**.

**The Shifting Mechanism:**
Unlike Selection Sort which swaps, Insertion Sort *slides*. This is better for the CPU cache and requires fewer actual write operations when the data is nearly sorted.`,

    bestCase: {
      complexity: "O(n)",
      explanation:
        "The Superstar Scenario. If the list is sorted, it just looks at each item, nods, and moves on. No shifting required.",
    },
    worstCase: {
      complexity: "O(n²)",
      explanation:
        "If the list is backwards, every new item has to slide all the way to the front.",
    },
    averageCase: {
      complexity: "O(n²)",
      explanation:
        "On random data, it's quadratic. But for small $n$ (under 20), it's often faster than Quick Sort due to lower overhead.",
    },
    spaceComplexity: {
      complexity: "O(1)",
      explanation: "In-place. Very memory friendly.",
    },

    useCases: [
      "Small arrays (n < 50)",
      "Data that is being received in real-time (Online sorting)",
      "Finishing touches on 'almost sorted' data",
      "The base case for recursive sorts (Merge Sort / Quick Sort)",
    ],

    keyInsights: [
      "It is stable.",
      "It is extremely fast for small or nearly-sorted datasets.",
      "It is the standard fallback for high-performance recursive sorts.",
      "It handles live data streams well.",
    ],

    whenToUse:
      "Use it if the array is small (under 50 items) or if you know the data is already mostly sorted. This is often the default 'base case' optimization for advanced developers.",

    whenNotToUse: "Don't use it on large, random datasets. It will choke.",

    relatedAlgorithms: [
      {
        algorithm: "quick",
        relationship: "uses Insertion Sort as base case",
      },
      {
        algorithm: "gnome",
        relationship: "equivalent swap pattern",
      },
      {
        algorithm: "merge",
        relationship: "stable at scale",
      },
    ],
  },

  gnome: {
    title: "Gnome Sort",
    tagline: "The Indecisive Gardener",
    history: `Originally called "Stupid Sort" (no, really) by Hamid Sarbazi-Azad in 2000, it was rebranded as Gnome Sort by Dick Grune. The metaphor is a garden gnome sorting flower pots. He looks at two pots. If they are out of order, he swaps them and steps back. If they are fine, he steps forward.

It is essentially Insertion Sort implemented by someone who hates nested loops.`,

    mechanics: `Gnome Sort uses a single index variable. It's a state machine with just two rules: move forward if things look good, move backward if you made a swap.

**The Algorithm Step-by-Step:**

1. **Start**: At index 0.
2. **Check**: Compare current pot with previous pot.
3. **Good?**: If they are in order (or we are at start), step forward.
4. **Bad?**: If they are out of order, swap them and step backward.
5. **Repeat**: Until you reach the end.

**Connection to Insertion Sort:**
It produces the exact same sequence of swaps as Insertion Sort, but instead of an inner loop, it physically moves the "cursor" back and forth.`,

    bestCase: {
      complexity: "O(n)",
      explanation: "If sorted, the gnome just walks from start to finish without stopping.",
    },
    worstCase: {
      complexity: "O(n²)",
      explanation: "The gnome spends most of his life walking backwards. It's painfully slow.",
    },
    averageCase: {
      complexity: "O(n²)",
      explanation:
        "Same as Insertion Sort, but usually slightly slower due to the overhead of variable updates.",
    },
    spaceComplexity: {
      complexity: "O(1)",
      explanation: "In-place. Only needs one index tracker.",
    },

    useCases: [
      "Code Golf (sorting in as few lines as possible)",
      "Teaching algorithm concepts",
      "Situations where code complexity is the enemy, not time",
      "Sorting arrays on very primitive hardware",
    ],

    keyInsights: [
      "It has no nested loops (a rarity for $O(n^2)$ sorts).",
      "It is stable.",
      "It is conceptually simple but practically inefficient.",
      "It's mostly a novelty.",
    ],

    whenToUse:
      "When you need to write a sort function in 5 lines of code and you don't care how fast it runs. Or when you want to confuse an interviewer.",

    whenNotToUse: "In production. Just use Insertion Sort.",

    relatedAlgorithms: [
      {
        algorithm: "insertion",
        relationship: "functionally equivalent, more common",
      },
      {
        algorithm: "bubble",
        relationship: "also adaptive, uses swaps",
      },
    ],
  },

  quick: {
    title: "Quick Sort",
    tagline: "The Standard Library Darling",
    history: `Tony Hoare invented Quick Sort in 1959. He was a visiting student in Moscow trying to translate Russian to English, and he needed a faster way to sort words.

It is the rockstar of sorting. It's the default \`.sort()\` implementation in many languages (or a variant of it). It introduced the "Divide and Conquer" strategy to the mainstream.`,

    mechanics: `Quick Sort relies on a "Pivot." It picks one element and organizes the rest of the array around it: everything smaller goes to the left, everything larger goes to the right.



**The Algorithm Step-by-Step:**

1. **Pick Pivot**: Select an element (middle, last, or random).
2. **Partition**: Reorder the array so the Pivot is in its final home. All smaller items are to its left; all larger items are to its right.
3. **Recursion**: Apply the same logic to the sub-list on the left and the sub-list on the right.
4. **Base Case**: If a list has 0 or 1 items, it is sorted.

**The Pivot Problem:**
If you pick a bad pivot (like always picking the first item on a sorted list), Quick Sort breaks down. Modern implementations use "Median of Three" (checking start, middle, and end) to avoid this.`,

    bestCase: {
      complexity: "O(n log n)",
      explanation:
        "If the pivot cuts the list roughly in half every time, the recursion tree is perfectly balanced.",
    },
    worstCase: {
      complexity: "O(n²)",
      explanation:
        "If the pivot is always the smallest or largest item, you essentially create a very expensive Bubble Sort.",
    },
    averageCase: {
      complexity: "O(n log n)",
      explanation:
        "On random data, it is blazing fast. It often outperforms Merge Sort because it works in-place and plays nice with CPU caches.",
    },
    spaceComplexity: {
      complexity: "O(log n)",
      explanation: "It consumes stack space for the recursion. It's not strictly O(1) space.",
    },

    useCases: [
      "General purpose sorting",
      "Large datasets",
      "Systems with good cache memory",
      "When average speed is more important than worst-case safety",
    ],

    keyInsights: [
      "It is NOT stable (equal items might cross).",
      "It is the king of cache locality.",
      "It is sensitive to input order (solved by randomizing pivots).",
      "It sorts in-place (mostly).",
    ],

    whenToUse:
      "Use Quick Sort for general primitive arrays (integers, floats) where stability doesn't matter and you want raw speed.",

    whenNotToUse:
      "If you need a Stable sort, or if you are worried about malicious input data designed to trigger the worst-case scenario (DoS attacks).",

    relatedAlgorithms: [
      {
        algorithm: "merge",
        relationship: "stable divide-and-conquer sibling",
      },
      {
        algorithm: "insertion",
        relationship: "base case optimization",
      },
      {
        algorithm: "heap",
        relationship: "in-place O(n log n) alternative",
      },
    ],
  },

  merge: {
    title: "Merge Sort",
    tagline: "The Reliable Bureaucrat",
    history: `Invented by the legendary John von Neumann in 1945. It was one of the first algorithms designed for the EDVAC, one of the earliest computers.

Merge Sort is the "slow and steady" alternative to Quick Sort. It doesn't rely on luck or pivots. It guarantees performance with a mathematical ruthlessness. It is the engine behind Python's sort and Java's object sort.`,

    mechanics: `Merge Sort is the ultimate "Divide and Conquer" algorithm. It splits the list in half until it has lists of size 1, then merges them back together in sorted order.



**The Algorithm Step-by-Step:**

1. **Divide**: Cut the array in half.
2. **Recurse**: Do it again until you have arrays with 1 element.
3. **Conquer (Merge)**: Take two sorted sub-arrays and zipper them together into one larger sorted array.
4. **Repeat**: Until the whole array is reconstructed.

**Why It Works:**
Merging two sorted lists is easy ($O(n)$). You just look at the head of both lists and pick the smaller one.`,

    bestCase: {
      complexity: "O(n log n)",
      explanation: "It splits and merges regardless of the data. It does the full work every time.",
    },
    worstCase: {
      complexity: "O(n log n)",
      explanation: "This is its superpower. It never degrades to quadratic time. It is consistent.",
    },
    averageCase: {
      complexity: "O(n log n)",
      explanation: "Predictable, stable, and reliable.",
    },
    spaceComplexity: {
      complexity: "O(n)",
      explanation:
        "The trade-off. It needs a temporary array to hold the merged items. It burns memory to buy stability and consistency.",
    },

    useCases: [
      "Sorting Linked Lists (works well with non-contiguous memory)",
      "External Sorting (sorting massive files that don't fit in RAM)",
      "When Stability is critical",
      "Parallel processing (sub-arrays can be sorted on different cores)",
    ],

    keyInsights: [
      "It is stable.",
      "It guarantees $O(n log n)$.",
      "It uses extra memory (not in-place).",
      "It is easy to parallelize.",
    ],

    whenToUse:
      "Use Merge Sort when you need Stability, when you are sorting Linked Lists, or when you cannot afford a worst-case scenario.",

    whenNotToUse:
      "If you are tight on RAM. The $O(n)$ auxiliary space can be a dealbreaker on embedded devices.",

    relatedAlgorithms: [
      {
        algorithm: "quick",
        relationship: "faster on average, unstable",
      },
      {
        algorithm: "heap",
        relationship: "in-place O(n log n) alternative",
      },
      {
        algorithm: "insertion",
        relationship: "stable at small scale",
      },
    ],
  },

  heap: {
    title: "Heap Sort",
    tagline: "The Space Saver",
    history: `Introduced by J.W.J. Williams in 1964. It was a breakthrough because it offered the speed of Merge Sort ($O(n log n)$) without the memory penalty.

It repurposes the "Heap" data structure—usually used for Priority Queues—to sort a list. It feels like a magic trick: you throw data into a pile, and when you pull it out, it's sorted.`,

    mechanics: `Heap Sort turns the array into a Binary Heap (a specific type of tree) where the parent is always larger than the children.



**The Algorithm Step-by-Step:**

1. **Heapify**: Rearrange the array so it satisfies the Max-Heap property. The largest item is now at index 0.
2. **Swap**: Move the item at index 0 to the end of the array (it's now sorted).
3. **Shrink**: Pretend the array is one slot shorter.
4. **Repair**: The new item at index 0 is probably wrong. "Sift" it down until the Heap property is fixed.
5. **Repeat**: Until the heap is empty.`,

    bestCase: {
      complexity: "O(n log n)",
      explanation: "Even on a good day, it has to build the heap and dismantle it.",
    },
    worstCase: {
      complexity: "O(n log n)",
      explanation: "Like Merge Sort, it is consistent. No nasty surprises.",
    },
    averageCase: {
      complexity: "O(n log n)",
      explanation:
        "It is generally slower than Quick Sort due to 'cache thrashing' (jumping around memory indices), but it has better worst-case guarantees.",
    },
    spaceComplexity: {
      complexity: "O(1)",
      explanation: "The killer feature. It sorts in-place. No extra arrays needed.",
    },

    useCases: [
      "Embedded systems with limited memory",
      "Real-time systems where worst-case latency matters",
      "Security-critical systems (to prevent timing attacks)",
      "Introsort (used as the fallback when Quick Sort goes deep)",
    ],

    keyInsights: [
      "It is NOT stable.",
      "It sorts in-place.",
      "It has poor cache locality (jumps around the array).",
      "It is excellent for 'Top K' elements problems.",
    ],

    whenToUse:
      "Use Heap Sort when you need $O(n log n)$ performance but cannot spare the memory for Merge Sort. It's the 'safe' choice for restricted environments.",

    whenNotToUse:
      "If you want raw speed (Quick Sort is faster) or stability (Merge Sort is stable).",

    relatedAlgorithms: [
      {
        algorithm: "max-heap",
        mode: "tree",
        relationship: "underlying data structure",
      },
      {
        algorithm: "merge",
        relationship: "guaranteed O(n log n), uses memory",
      },
      {
        algorithm: "selection",
        relationship: "conceptual ancestor",
      },
    ],
  },
};

/**
 * Get article content for a specific sorting algorithm.
 */
export function getSortingArticle(algorithm: SortingAlgorithmType): SortingArticle {
  return SORTING_ARTICLES[algorithm];
}
