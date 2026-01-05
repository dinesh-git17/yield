import type { SortingAlgorithmType } from "@/lib/store";

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
}

/**
 * Complete content registry for all sorting algorithms.
 */
export const SORTING_ARTICLES: Record<SortingAlgorithmType, SortingArticle> = {
  bubble: {
    title: "Bubble Sort",
    tagline: "The Floating Giant",
    history: `Bubble Sort is one of the oldest and most intuitive sorting algorithms, with roots tracing back to the 1950s. The name comes from the way larger elements "bubble up" to their correct positions, similar to air bubbles rising in water. While its origins are somewhat unclear, it gained widespread recognition through early computer science education and Donald Knuth's seminal work "The Art of Computer Programming" (1968), where he famously noted that "the bubble sort seems to have nothing to recommend it, except a catchy name."

Despite its inefficiency, Bubble Sort remains a cornerstone of computer science education because it perfectly illustrates the concept of comparison-based sorting and algorithm analysis. It demonstrates why we need more sophisticated approaches for real-world applications.`,

    mechanics: `Bubble Sort works by repeatedly stepping through the list, comparing adjacent pairs of elements and swapping them if they're in the wrong order. This process continues until no swaps are needed, indicating the list is sorted.

**The Algorithm Step-by-Step:**

1. **Start at the beginning** of the array
2. **Compare adjacent elements** at positions i and i+1
3. **Swap if needed** — if arr[i] > arr[i+1], exchange them
4. **Move forward** to the next pair
5. **Repeat the pass** — after each complete pass, the largest unsorted element "bubbles" to its final position
6. **Continue** until a complete pass requires no swaps

**The "Bubbling" Effect:**
After the first pass, the largest element is guaranteed to be in its final position (at the end). After the second pass, the two largest elements are in place. This means each subsequent pass needs to examine fewer elements, creating an optimization opportunity.

**Optimization — Early Exit:**
If a complete pass occurs with no swaps, the array is already sorted. This optimization allows Bubble Sort to achieve O(n) time complexity for already-sorted arrays.`,

    bestCase: {
      complexity: "O(n)",
      explanation:
        "When the array is already sorted, only one pass is needed to confirm no swaps are required. This requires n-1 comparisons and 0 swaps.",
    },
    worstCase: {
      complexity: "O(n²)",
      explanation:
        "When the array is reverse-sorted, every element needs to bubble through the entire array. This requires (n-1) + (n-2) + ... + 1 = n(n-1)/2 comparisons and swaps.",
    },
    averageCase: {
      complexity: "O(n²)",
      explanation:
        "On random data, roughly half of all possible swaps occur, but the quadratic number of comparisons remains.",
    },
    spaceComplexity: {
      complexity: "O(1)",
      explanation:
        "Bubble Sort is an in-place algorithm, requiring only a constant amount of extra memory for the swap variable.",
    },

    useCases: [
      "Educational purposes — teaching sorting fundamentals",
      "Detecting nearly-sorted data with minimal passes",
      "Small datasets (n < 50) where simplicity trumps efficiency",
      "Situations requiring a stable sort with minimal code",
      "Graphics applications needing to sort by single layer differences",
    ],

    keyInsights: [
      "Stable sort — equal elements maintain their relative order",
      "Adaptive — can detect sorted arrays in O(n) time",
      "In-place — requires no additional memory allocation",
      "Easy to implement — often written correctly on first attempt",
      "Quadratic time makes it impractical for large datasets",
    ],

    whenToUse:
      "Use Bubble Sort when you need a simple, stable sorting algorithm for very small datasets or when teaching sorting concepts. Its O(n) best-case makes it surprisingly effective for nearly-sorted data when combined with the early-exit optimization.",

    whenNotToUse:
      "Avoid Bubble Sort for datasets larger than ~50 elements or when performance matters. Even among O(n²) algorithms, Insertion Sort typically outperforms it due to fewer swaps.",
  },

  selection: {
    title: "Selection Sort",
    tagline: "The Minimalist's Choice",
    history: `Selection Sort emerged in the early days of computing when memory was scarce and expensive. Its straightforward approach of finding the minimum element and placing it at the front made it intuitive for early programmers working with punch cards and limited resources.

The algorithm gained formal recognition through its analysis in various computer science texts during the 1960s. Unlike Bubble Sort, Selection Sort's appeal lies in its predictable behavior — it always performs the same number of comparisons regardless of the input order, making it easier to analyze and understand.

Its key innovation was minimizing the number of swaps: at most n-1 swaps are ever needed, regardless of the initial array state. This made it valuable in scenarios where write operations were expensive, such as with flash memory or EEPROM.`,

    mechanics: `Selection Sort divides the array into two parts: a sorted portion (initially empty) and an unsorted portion. It repeatedly selects the smallest element from the unsorted portion and adds it to the end of the sorted portion.

**The Algorithm Step-by-Step:**

1. **Set the boundary** — the sorted portion starts empty, unsorted portion is the whole array
2. **Find the minimum** — scan through the unsorted portion to find the smallest element
3. **Swap to position** — exchange the minimum element with the first unsorted element
4. **Advance the boundary** — the sorted portion grows by one element
5. **Repeat** until the unsorted portion is empty

**Key Characteristics:**
- The number of comparisons is always the same: n(n-1)/2
- Maximum n-1 swaps regardless of input order
- Each element is moved at most once to its final position

**Visual Intuition:**
Imagine laying out playing cards face up on a table. To sort them, you repeatedly scan for the lowest card and place it at the start of a new row. This is exactly what Selection Sort does.`,

    bestCase: {
      complexity: "O(n²)",
      explanation:
        "Even when sorted, Selection Sort must scan through the unsorted portion to verify each minimum. No optimizations exist for sorted arrays.",
    },
    worstCase: {
      complexity: "O(n²)",
      explanation:
        "Same as best case — Selection Sort always performs the same number of comparisons: n(n-1)/2.",
    },
    averageCase: {
      complexity: "O(n²)",
      explanation:
        "The algorithm's performance is completely data-independent, always performing exactly n(n-1)/2 comparisons.",
    },
    spaceComplexity: {
      complexity: "O(1)",
      explanation:
        "Selection Sort is in-place, requiring only a constant amount of extra space for the minimum index and swap variable.",
    },

    useCases: [
      "Systems where write operations are expensive (flash memory, EEPROM)",
      "Small datasets where simplicity is valued",
      "Situations requiring a predictable number of operations",
      "Educational contexts demonstrating algorithm design",
      "Embedded systems with limited memory",
    ],

    keyInsights: [
      "NOT stable — equal elements may change relative order",
      "Minimal swaps — at most n-1 swaps total",
      "Data-independent — always O(n²) regardless of input order",
      "In-place algorithm — O(1) extra space",
      "Simple to implement and verify correctness",
    ],

    whenToUse:
      "Use Selection Sort when write operations are expensive (flash memory), when you need predictable performance, or when working with very small datasets. Its minimal swap count makes it efficient for memory-constrained environments.",

    whenNotToUse:
      "Avoid Selection Sort when stability matters (equal elements must maintain order), when dealing with large datasets, or when the data might already be partially sorted (no adaptive optimization exists).",
  },

  insertion: {
    title: "Insertion Sort",
    tagline: "The Card Player's Algorithm",
    history: `Insertion Sort mimics the natural way humans sort playing cards in their hands — picking up cards one at a time and inserting each into its correct position among the previously sorted cards.

This intuitive approach has made Insertion Sort a favorite in computer science education since the field's inception. It was one of the first sorting algorithms to be analyzed mathematically, with its average-case analysis appearing in early algorithm textbooks.

In practice, Insertion Sort has found lasting relevance as the algorithm of choice for small subarrays in hybrid sorting algorithms. Tim Peters chose it as the base case for Timsort (2002), and it's used similarly in many Quicksort and Mergesort implementations when partition sizes become small (typically n ≤ 10-20).`,

    mechanics: `Insertion Sort builds the final sorted array one element at a time, by inserting each new element into its correct position within the already-sorted portion.

**The Algorithm Step-by-Step:**

1. **Start with the second element** — the first element is trivially sorted
2. **Store the current element** — save it as the "key" to insert
3. **Shift larger elements** — move elements greater than the key one position right
4. **Insert the key** — place it in the gap created by shifting
5. **Advance** to the next unsorted element
6. **Repeat** until all elements are processed

**The Shifting Mechanism:**
Unlike Selection Sort which swaps, Insertion Sort shifts elements. When inserting a key:
- Compare key with elements to its left
- Shift elements rightward until finding key's correct position
- Write key once into its final position

**Adaptive Nature:**
For nearly-sorted data, elements rarely need to shift far. This gives Insertion Sort its powerful O(n) best-case — if data is sorted, each element only requires one comparison and no shifts.`,

    bestCase: {
      complexity: "O(n)",
      explanation:
        "When the array is already sorted, each element only needs one comparison to confirm it's in position. No shifting occurs.",
    },
    worstCase: {
      complexity: "O(n²)",
      explanation:
        "When the array is reverse-sorted, each element must shift through all previously sorted elements, resulting in 1 + 2 + ... + (n-1) = n(n-1)/2 operations.",
    },
    averageCase: {
      complexity: "O(n²)",
      explanation:
        "On random data, each element shifts through roughly half of the sorted portion on average, still resulting in quadratic time.",
    },
    spaceComplexity: {
      complexity: "O(1)",
      explanation:
        "Insertion Sort is in-place, requiring only constant extra space for the key variable.",
    },

    useCases: [
      "Small datasets (n ≤ 20) — outperforms O(n log n) algorithms due to low overhead",
      "Nearly-sorted data — approaches linear time",
      "Online algorithms — can sort as data arrives",
      "Hybrid sorting — base case for Quicksort/Mergesort on small partitions",
      "Real-time systems requiring stable, predictable performance",
    ],

    keyInsights: [
      "Stable sort — equal elements maintain relative order",
      "Adaptive — O(n) for nearly-sorted data",
      "Online — can sort data as it arrives (streaming)",
      "Low overhead — efficient for small arrays despite O(n²)",
      "Building block — used within Timsort and introsort",
    ],

    whenToUse:
      "Use Insertion Sort for small datasets (n ≤ 20), nearly-sorted data, or when you need an online algorithm that can process elements as they arrive. It's also ideal as the base case in divide-and-conquer sorts.",

    whenNotToUse:
      "Avoid Insertion Sort for large, randomly-ordered datasets where its O(n²) time becomes prohibitive. Switch to O(n log n) algorithms for n > 20-50 elements.",
  },

  gnome: {
    title: "Gnome Sort",
    tagline: "The Garden Gnome's Method",
    history: `Gnome Sort was introduced by Hamid Sarbazi-Azad in 2000 as "Stupid Sort" before being renamed by Dick Grune. The algorithm is named after the way a garden gnome might sort a line of flower pots — moving forward when pots are in order, but stepping back to fix any disorder found.

This algorithm is notable for being one of the simplest sorting algorithms to describe and implement. It uses only a single loop with no nested loops, making its logic remarkably straightforward despite its O(n²) complexity.

The algorithm has pedagogical value in demonstrating that simple-looking code can hide quadratic behavior. It also serves as an interesting case study in algorithm design, showing how local comparisons and movement can achieve global sorting.`,

    mechanics: `Gnome Sort uses a single index that moves through the array like a gnome walking along a row of flower pots. The gnome checks adjacent elements and either moves forward (if they're in order) or swaps and moves backward (if they're out of order).

**The Algorithm Step-by-Step:**

1. **Start at position 0** — the gnome begins at the front
2. **If at position 0** — move forward (no element to compare with)
3. **Compare with previous** — check if current and previous are in order
4. **If in order** — move forward to the next position
5. **If out of order** — swap the elements and move backward
6. **Repeat** until reaching the end of the array

**The "Gnome" Metaphor:**
Imagine a gnome walking along flower pots. When finding two pots out of order:
- Swap them
- Step back to check if the swap caused a new problem
- Keep stepping back and swapping until everything behind is sorted
- Resume walking forward

**Connection to Insertion Sort:**
Gnome Sort is essentially Insertion Sort without the inner loop. Where Insertion Sort uses a nested loop to find the insertion point, Gnome Sort achieves the same effect by walking backward one step at a time.`,

    bestCase: {
      complexity: "O(n)",
      explanation:
        "When the array is already sorted, the gnome walks straight through, making n-1 comparisons with no swaps or backward movement.",
    },
    worstCase: {
      complexity: "O(n²)",
      explanation:
        "When the array is reverse-sorted, each new element requires walking all the way back to the front, resulting in 1 + 2 + ... + (n-1) comparisons and swaps.",
    },
    averageCase: {
      complexity: "O(n²)",
      explanation:
        "On random data, elements typically need to walk back through half of the sorted portion, still resulting in quadratic time.",
    },
    spaceComplexity: {
      complexity: "O(1)",
      explanation:
        "Gnome Sort is in-place, requiring only a single index variable and temporary swap space.",
    },

    useCases: [
      "Educational purposes — demonstrating hidden quadratic complexity",
      "Code golf — extremely short implementation",
      "Embedded systems with severe code size constraints",
      "Understanding the relationship between simple code and efficiency",
      "Novelty or interview discussions about unusual algorithms",
    ],

    keyInsights: [
      "Stable sort — equal elements maintain relative order",
      "Single-loop structure — no nested loops despite O(n²)",
      "Equivalent to Insertion Sort — same swaps, different structure",
      "Adaptive — O(n) for sorted arrays",
      "More data movement than Insertion Sort due to swap-based approach",
    ],

    whenToUse:
      "Use Gnome Sort primarily for educational purposes or when you need the simplest possible sorting code. Its single-loop structure makes it easy to understand and verify.",

    whenNotToUse:
      "Avoid Gnome Sort in production code — Insertion Sort provides the same functionality with better performance due to fewer swaps. Gnome Sort is purely of academic interest.",
  },

  quick: {
    title: "Quick Sort",
    tagline: "The Divide and Conquer Champion",
    history: `Quick Sort was developed by Tony Hoare in 1959 while he was a visiting student at Moscow State University. Working on a machine translation project, Hoare needed to sort words and developed the algorithm that would become one of the most influential in computing history.

The algorithm was published in 1961 and quickly gained recognition for its practical efficiency. Despite its O(n²) worst case, Quick Sort's average O(n log n) performance and excellent cache locality made it the sorting algorithm of choice in many standard libraries for decades.

Quick Sort's influence extends beyond sorting — the partitioning strategy it introduced has been adapted for problems like the Quickselect algorithm for finding the k-th smallest element in linear average time. Hoare received the Turing Award in 1980, with Quick Sort cited as one of his major contributions.`,

    mechanics: `Quick Sort uses a divide-and-conquer strategy: it selects a "pivot" element and partitions the array so that all smaller elements come before the pivot and all larger elements come after. This process is applied recursively to the sub-arrays.

**The Algorithm Step-by-Step:**

1. **Choose a pivot** — select an element (last element, random, or median-of-three)
2. **Partition the array** — rearrange elements around the pivot
   - Elements less than pivot → left side
   - Elements greater than pivot → right side
   - Pivot ends up in its final sorted position
3. **Recurse on sub-arrays** — apply Quick Sort to left and right partitions
4. **Base case** — arrays of size 0 or 1 are already sorted

**Partitioning Schemes:**
- **Lomuto partition** (simpler): Uses the last element as pivot, maintains a boundary index
- **Hoare partition** (original): Uses two pointers from both ends, fewer swaps on average

**Pivot Selection Matters:**
The choice of pivot dramatically affects performance:
- **Last element**: Simple but vulnerable to sorted input
- **Random**: Avoids worst case with high probability
- **Median-of-three**: Takes median of first, middle, last — good practical choice`,

    bestCase: {
      complexity: "O(n log n)",
      explanation:
        "When the pivot consistently divides the array into equal halves, we get log n levels of recursion with O(n) work at each level.",
    },
    worstCase: {
      complexity: "O(n²)",
      explanation:
        "When the pivot is always the smallest or largest element (e.g., sorted array with last-element pivot), partitions become maximally unbalanced: n + (n-1) + ... + 1 = O(n²).",
    },
    averageCase: {
      complexity: "O(n log n)",
      explanation:
        "With random input or randomized pivot selection, the expected partition quality leads to O(n log n) average performance.",
    },
    spaceComplexity: {
      complexity: "O(log n)",
      explanation:
        "Quick Sort uses O(log n) stack space for recursion in the average case. Worst case can be O(n) with poor pivots, but tail-call optimization can guarantee O(log n).",
    },

    useCases: [
      "General-purpose sorting — the default in many C/C++ standard libraries",
      "Cache-sensitive applications — excellent locality of reference",
      "Virtual memory systems — minimal page faults",
      "Parallel sorting — partitions can be sorted independently",
      "When average-case performance matters more than worst-case",
    ],

    keyInsights: [
      "NOT stable — equal elements may change relative order",
      "In-place — O(log n) space for recursion stack",
      "Cache-friendly — excellent locality compared to Merge Sort",
      "Pivot selection is critical — bad pivots cause O(n²)",
      "Foundation for Introsort — Quick Sort + Heap Sort fallback",
    ],

    whenToUse:
      "Use Quick Sort when you need fast average-case performance with good cache behavior. It's excellent for primitive types and when stability isn't required. Consider randomized pivot selection for protection against adversarial input.",

    whenNotToUse:
      "Avoid Quick Sort when stability is required, when worst-case O(n²) is unacceptable, or when the data might be adversarially constructed. Use Merge Sort or Heap Sort for guaranteed O(n log n) performance.",
  },

  merge: {
    title: "Merge Sort",
    tagline: "The Stable Divider",
    history: `Merge Sort was invented by John von Neumann in 1945, making it one of the oldest sophisticated sorting algorithms. Von Neumann developed it while working on the EDVAC computer, one of the earliest stored-program computers.

The algorithm represents a landmark in algorithm design — it was one of the first to apply the divide-and-conquer paradigm systematically. Its guaranteed O(n log n) worst-case complexity and stability made it the algorithm of choice when these properties are essential.

Merge Sort's influence persists today: it forms the backbone of Timsort (Python, Java 7+), is used for sorting linked lists (where its O(n) space disadvantage disappears), and serves as a model for teaching divide-and-conquer strategies. Its merge procedure is also adapted for the external sorting of data too large to fit in memory.`,

    mechanics: `Merge Sort divides the array in half, recursively sorts each half, then merges the sorted halves together. The key insight is that merging two sorted arrays is efficient — it takes O(n) time.

**The Algorithm Step-by-Step:**

1. **Divide** — split the array into two halves
2. **Conquer** — recursively sort each half
3. **Combine** — merge the two sorted halves into one sorted array

**The Merge Procedure:**
Given two sorted arrays:
1. Compare the first elements of each array
2. Take the smaller one and add it to the result
3. Move forward in the array from which you took
4. Repeat until both arrays are exhausted

**Why It Works:**
- At each level, we do O(n) work (merging)
- We have log n levels (halving creates a balanced tree)
- Total: O(n log n) regardless of input order

**Stability:**
When merging, if elements are equal, we take from the left array first. This preserves the original relative order of equal elements.`,

    bestCase: {
      complexity: "O(n log n)",
      explanation:
        "Even for sorted arrays, Merge Sort must split and merge at each level. The number of comparisons may be reduced, but the structure remains O(n log n).",
    },
    worstCase: {
      complexity: "O(n log n)",
      explanation:
        "Merge Sort always divides evenly and merges in O(n) time, guaranteeing O(n log n) performance regardless of input order.",
    },
    averageCase: {
      complexity: "O(n log n)",
      explanation:
        "The algorithm's performance is completely data-independent — it always performs the same structure of operations.",
    },
    spaceComplexity: {
      complexity: "O(n)",
      explanation:
        "Standard Merge Sort requires O(n) auxiliary space for the merge procedure. In-place variants exist but are complex and often slower.",
    },

    useCases: [
      "When stable sort is required — equal elements keep their order",
      "Sorting linked lists — O(1) extra space with pointer manipulation",
      "External sorting — merging sorted chunks from disk",
      "Parallel sorting — independent subproblems enable parallelism",
      "When worst-case O(n log n) is required (security-critical code)",
    ],

    keyInsights: [
      "Stable sort — equal elements maintain relative order",
      "Guaranteed O(n log n) — no bad inputs exist",
      "O(n) extra space — the trade-off for stability",
      "Parallelizable — subproblems are independent",
      "Foundation of Timsort — optimized for real-world data",
    ],

    whenToUse:
      "Use Merge Sort when you need guaranteed O(n log n) performance, stability is required, or when sorting linked lists. It's also excellent for external sorting and parallel implementations.",

    whenNotToUse:
      "Avoid Merge Sort when memory is constrained (its O(n) space can be prohibitive), when in-place sorting is required, or when cache performance is critical (Quick Sort often wins due to better locality).",
  },

  heap: {
    title: "Heap Sort",
    tagline: "The Priority Queue in Disguise",
    history: `Heap Sort was invented by J.W.J. Williams in 1964, the same year he introduced the binary heap data structure. Robert Floyd later refined the algorithm with an improved heap construction method that builds the heap in O(n) time rather than O(n log n).

The algorithm cleverly repurposes a priority queue for sorting. Williams recognized that a max-heap naturally provides access to the largest element, and by repeatedly extracting the maximum and rebuilding the heap, a sorted sequence emerges.

Heap Sort holds a special place in algorithm design as the first O(n log n) comparison sort with O(1) auxiliary space. While Quick Sort is often faster in practice, Heap Sort's guaranteed worst-case performance and minimal space requirements make it valuable for memory-constrained and real-time systems.`,

    mechanics: `Heap Sort uses a max-heap — a complete binary tree where each parent is larger than its children. The algorithm builds a heap from the array, then repeatedly extracts the maximum element.

**Understanding the Heap:**
A binary heap is stored in an array where:
- Parent of index i is at (i-1)/2
- Left child is at 2i+1, right child is at 2i+2
- Max-heap property: parent ≥ children

**The Algorithm Step-by-Step:**

1. **Build the max-heap** — transform the array into a valid max-heap
   - Start from the last non-leaf node (index n/2 - 1)
   - Heapify each node from bottom to top

2. **Extract maximum repeatedly**
   - Swap root (maximum) with the last element
   - Reduce heap size by 1 (last element is now sorted)
   - Heapify the root to restore heap property
   - Repeat until heap size is 1

**The Heapify Procedure:**
Given a node that might violate the heap property:
1. Compare with both children
2. If larger than both, done
3. Otherwise, swap with the larger child
4. Recursively heapify the affected subtree`,

    bestCase: {
      complexity: "O(n log n)",
      explanation:
        "Even for sorted arrays, Heap Sort must build the heap and perform n extractions, each requiring log n heapify operations.",
    },
    worstCase: {
      complexity: "O(n log n)",
      explanation:
        "Heap Sort always performs O(n log n) operations regardless of input order — it has no pathological cases like Quick Sort.",
    },
    averageCase: {
      complexity: "O(n log n)",
      explanation:
        "The algorithm's performance is data-independent, consistently performing O(n log n) comparisons and swaps.",
    },
    spaceComplexity: {
      complexity: "O(1)",
      explanation:
        "Heap Sort is truly in-place — it rearranges elements within the original array using only constant extra space for the heapify recursion (which can be made iterative).",
    },

    useCases: [
      "Memory-constrained systems — only O(1) extra space",
      "Real-time systems — guaranteed O(n log n) worst case",
      "Introsort fallback — when Quick Sort degrades",
      "Priority queue operations — building on heap infrastructure",
      "When cache behavior is less critical than space",
    ],

    keyInsights: [
      "NOT stable — equal elements may change relative order",
      "In-place — O(1) auxiliary space",
      "Guaranteed O(n log n) — no bad inputs",
      "Poor cache locality — jumps around the array",
      "Used in Introsort — provides worst-case guarantee",
    ],

    whenToUse:
      "Use Heap Sort when you need guaranteed O(n log n) performance with minimal memory overhead. It's the algorithm of choice when both worst-case time and space constraints are critical.",

    whenNotToUse:
      "Avoid Heap Sort when cache performance matters (its access pattern is less cache-friendly than Quick Sort), when stability is required, or when you can tolerate O(n) extra space (Merge Sort may be faster).",
  },
};

/**
 * Get article content for a specific sorting algorithm.
 */
export function getSortingArticle(algorithm: SortingAlgorithmType): SortingArticle {
  return SORTING_ARTICLES[algorithm];
}
