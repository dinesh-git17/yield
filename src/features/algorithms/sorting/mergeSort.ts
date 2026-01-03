import type { SortStep } from "./types";

/**
 * Merge Sort algorithm implemented as a recursive generator.
 * Divides array into halves, sorts each, then merges them.
 * Yields step-by-step operations for visualization.
 *
 * @param arr - The array to sort (will be mutated)
 * @param lo - Lower bound of current range (inclusive)
 * @param hi - Upper bound of current range (inclusive)
 * @yields SortStep - Partition, compare, overwrite, or sorted operations
 */
export function* mergeSort(
  arr: number[],
  lo = 0,
  hi = arr.length - 1
): Generator<SortStep, void, unknown> {
  // Base case: single element or empty range is trivially sorted
  if (lo >= hi) {
    return;
  }

  // Calculate midpoint
  const mid = Math.floor((lo + hi) / 2);

  // Recursively sort left half
  yield* mergeSort(arr, lo, mid);

  // Recursively sort right half
  yield* mergeSort(arr, mid + 1, hi);

  // Merge the sorted halves
  yield* merge(arr, lo, mid, hi);
}

/**
 * Merges two sorted subarrays [lo..mid] and [mid+1..hi].
 * Uses auxiliary array for merging, then writes back with overwrite yields.
 *
 * @param arr - The array containing both subarrays
 * @param lo - Start of left subarray
 * @param mid - End of left subarray (mid+1 is start of right)
 * @param hi - End of right subarray
 */
function* merge(
  arr: number[],
  lo: number,
  mid: number,
  hi: number
): Generator<SortStep, void, unknown> {
  // Signal the active merge range for UI visualization
  yield { type: "partition", range: [lo, hi] };

  // Create auxiliary array for merged result
  const merged: number[] = [];

  // Pointers for left and right subarrays
  let i = lo;
  let j = mid + 1;

  // Merge while both subarrays have elements
  while (i <= mid && j <= hi) {
    // Compare elements from each half
    yield { type: "compare", indices: [i, j] };

    // Bounds guaranteed by loop conditions
    const leftVal = arr[i] as number;
    const rightVal = arr[j] as number;

    if (leftVal <= rightVal) {
      merged.push(leftVal);
      i++;
    } else {
      merged.push(rightVal);
      j++;
    }
  }

  // Copy remaining elements from left subarray
  while (i <= mid) {
    // Bounds guaranteed by loop condition
    merged.push(arr[i] as number);
    i++;
  }

  // Copy remaining elements from right subarray
  while (j <= hi) {
    // Bounds guaranteed by loop condition
    merged.push(arr[j] as number);
    j++;
  }

  // Write merged result back to original array with visualization
  for (let k = 0; k < merged.length; k++) {
    const targetIndex = lo + k;
    // Merged array is built from valid indices
    const value = merged[k] as number;

    arr[targetIndex] = value;

    yield { type: "overwrite", index: targetIndex, value };
  }

  // Mark the merged range as sorted (only at the top-level merge)
  if (lo === 0 && hi === arr.length - 1) {
    for (let k = lo; k <= hi; k++) {
      yield { type: "sorted", index: k };
    }
  }
}
