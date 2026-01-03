import type { SortStep } from "./types";

/**
 * Quick Sort algorithm implemented as a recursive generator.
 * Uses Lomuto partition scheme with last element as pivot.
 * Yields step-by-step operations for visualization including
 * partition ranges to enable "frozen" state for out-of-scope elements.
 *
 * @param arr - The array to sort (will be mutated)
 * @param lo - Lower bound of current partition (inclusive)
 * @param hi - Upper bound of current partition (inclusive)
 * @yields SortStep - Partition, pivot, compare, swap, or sorted operations
 */
export function* quickSort(
  arr: number[],
  lo = 0,
  hi = arr.length - 1
): Generator<SortStep, void, unknown> {
  // Base case: single element or empty range is already sorted
  if (lo >= hi) {
    // Mark single remaining element as sorted
    if (lo === hi && lo >= 0 && lo < arr.length) {
      yield { type: "sorted", index: lo };
    }
    return;
  }

  // Signal the active partition range for UI to freeze elements outside
  yield { type: "partition", range: [lo, hi] };

  // Partition using Lomuto scheme
  const pivotIndex: number = yield* partition(arr, lo, hi);

  // Recursively sort left partition (elements less than pivot)
  yield* quickSort(arr, lo, pivotIndex - 1);

  // Recursively sort right partition (elements greater than pivot)
  yield* quickSort(arr, pivotIndex + 1, hi);
}

/**
 * Lomuto partition scheme.
 * Selects the last element as pivot and partitions the array
 * such that elements <= pivot are on the left, elements > pivot on the right.
 *
 * @param arr - The array to partition
 * @param lo - Lower bound (inclusive)
 * @param hi - Upper bound (inclusive), pivot is arr[hi]
 * @returns The final index of the pivot after partitioning
 */
function* partition(arr: number[], lo: number, hi: number): Generator<SortStep, number, unknown> {
  // Highlight the pivot element (last element in range)
  yield { type: "pivot", index: hi };

  // Pivot value - bounds guaranteed by caller
  const pivotValue = arr[hi] as number;

  // i tracks the boundary of elements <= pivot
  // Initially set before the range
  let i = lo - 1;

  // Scan through elements, comparing each with pivot
  for (let j = lo; j < hi; j++) {
    // Compare current element with pivot
    yield { type: "compare", indices: [j, hi] };

    // Bounds guaranteed by loop condition
    const current = arr[j] as number;

    if (current <= pivotValue) {
      // Move boundary and swap current element to left partition
      i++;

      if (i !== j) {
        // Bounds guaranteed: i <= j < hi, all within [lo, hi]
        const temp = arr[i] as number;
        arr[i] = current;
        arr[j] = temp;

        yield {
          type: "swap",
          indices: [i, j],
          newValues: [arr[i] as number, arr[j] as number],
        };
      }
    }
  }

  // Place pivot in its final sorted position
  const pivotFinalIndex = i + 1;

  if (pivotFinalIndex !== hi) {
    // Bounds guaranteed: pivotFinalIndex <= hi, both within original range
    const temp = arr[pivotFinalIndex] as number;
    arr[pivotFinalIndex] = pivotValue;
    arr[hi] = temp;

    yield {
      type: "swap",
      indices: [pivotFinalIndex, hi],
      newValues: [arr[pivotFinalIndex] as number, arr[hi] as number],
    };
  }

  // Mark pivot as sorted (it's now in its final position)
  yield { type: "sorted", index: pivotFinalIndex };

  return pivotFinalIndex;
}
