import type { SortStep } from "./types";

/**
 * Sift down (heapify) operation for maintaining max-heap property.
 * Compares a node with its children and swaps with the largest.
 * The index jumps (e.g., 0 → 1, 0 → 2) visualize the tree structure.
 *
 * @param arr - The array representing the heap
 * @param n - The size of the heap (may be less than arr.length during extraction)
 * @param i - The index to sift down from
 * @yields SortStep - Compare and swap operations showing tree traversal
 */
function* heapify(arr: number[], n: number, i: number): Generator<SortStep, void, unknown> {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  // Compare with left child
  if (left < n) {
    yield { type: "compare", indices: [largest, left] };

    // Array bounds verified by left < n check
    if ((arr[left] as number) > (arr[largest] as number)) {
      largest = left;
    }
  }

  // Compare with right child
  if (right < n) {
    yield { type: "compare", indices: [largest, right] };

    // Array bounds verified by right < n check
    if ((arr[right] as number) > (arr[largest] as number)) {
      largest = right;
    }
  }

  // If largest is not the root, swap and continue heapifying
  if (largest !== i) {
    // Indices verified by the comparison logic above
    const temp = arr[i] as number;
    const largestVal = arr[largest] as number;

    arr[i] = largestVal;
    arr[largest] = temp;

    yield {
      type: "swap",
      indices: [i, largest],
      newValues: [largestVal, temp],
    };

    // Recursively heapify the affected subtree
    yield* heapify(arr, n, largest);
  }
}

/**
 * Heap Sort algorithm implemented as a generator.
 * Treats the array as a binary tree where parent(i) = floor((i-1)/2).
 * Phase 1: Build max heap from bottom up.
 * Phase 2: Extract max elements one by one.
 *
 * The comparison jumps across the array visualize the hidden tree structure.
 *
 * @param arr - The array to sort (will be mutated)
 * @yields SortStep - Compare, swap, or sorted operations
 */
export function* heapSort(arr: number[]): Generator<SortStep, void, unknown> {
  const n = arr.length;

  if (n <= 1) {
    if (n === 1) {
      yield { type: "sorted", index: 0 };
    }
    return;
  }

  // Phase 1: Build max heap
  // Start from last non-leaf node and heapify each node up to root
  // Last non-leaf node is at index floor(n/2) - 1
  const startIdx = Math.floor(n / 2) - 1;

  for (let i = startIdx; i >= 0; i--) {
    yield* heapify(arr, n, i);
  }

  // Phase 2: Extract elements from heap one by one
  for (let i = n - 1; i > 0; i--) {
    // Swap root (max element) with end of heap
    // Array bounds: i > 0 guarantees valid indices
    const root = arr[0] as number;
    const end = arr[i] as number;

    arr[0] = end;
    arr[i] = root;

    yield {
      type: "swap",
      indices: [0, i],
      newValues: [end, root],
    };

    // Mark the extracted element as sorted
    yield { type: "sorted", index: i };

    // Heapify the reduced heap
    yield* heapify(arr, i, 0);
  }

  // First element is now sorted (it's the minimum)
  yield { type: "sorted", index: 0 };
}
