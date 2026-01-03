import type { SortStep } from "./types";

/**
 * Insertion Sort algorithm implemented as a generator.
 * Works like sorting playing cards - takes each element and inserts it
 * into its correct position in the sorted portion.
 * Yields step-by-step operations for visualization.
 *
 * @param arr - The array to sort (will be mutated)
 * @yields SortStep - Scanning, compare, overwrite, or sorted operations
 */
export function* insertionSort(arr: number[]): Generator<SortStep, void, unknown> {
  const n = arr.length;

  if (n <= 1) {
    if (n === 1) {
      yield { type: "sorted", index: 0 };
    }
    return;
  }

  // First element is trivially sorted
  yield { type: "sorted", index: 0 };

  for (let i = 1; i < n; i++) {
    // Loop bounds guarantee i is a valid index
    const current = arr[i] as number;
    let j = i - 1;

    // Mark current element being picked up (the "key")
    yield { type: "scanning", index: i };

    // Scan backwards to find insertion point
    while (j >= 0) {
      // Loop bounds guarantee j is a valid index
      const compared = arr[j] as number;

      // Compare with element at j (before any shift at this position)
      yield { type: "compare", indices: [j, j + 1] };

      if (compared > current) {
        // Shift element to the right (overwrite j+1 with arr[j])
        arr[j + 1] = compared;
        yield { type: "overwrite", index: j + 1, value: compared };
        j--;
      } else {
        // Found insertion point
        break;
      }
    }

    // Insert current into the hole
    arr[j + 1] = current;
    yield { type: "overwrite", index: j + 1, value: current };

    // Mark element as sorted
    yield { type: "sorted", index: i };
  }
}
