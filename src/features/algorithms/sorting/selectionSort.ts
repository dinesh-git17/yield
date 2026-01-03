import type { SortStep } from "./types";

/**
 * Selection Sort algorithm implemented as a generator.
 * Finds the minimum element and places it at the beginning.
 * Yields step-by-step operations for visualization.
 *
 * @param arr - The array to sort (will be mutated)
 * @yields SortStep - Compare, scanning, swap, or sorted operations
 */
export function* selectionSort(arr: number[]): Generator<SortStep, void, unknown> {
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    // Mark current minimum
    yield { type: "scanning", index: minIdx };

    for (let j = i + 1; j < n; j++) {
      // Compare current element with current minimum
      yield { type: "compare", indices: [minIdx, j] };

      // Loop bounds guarantee j is a valid index
      const currentMin = arr[minIdx] as number;
      const current = arr[j] as number;

      if (current < currentMin) {
        minIdx = j;
        // Mark new minimum found
        yield { type: "scanning", index: minIdx };
      }
    }

    // Swap if minimum is not already in place
    if (minIdx !== i) {
      // Loop bounds guarantee i and minIdx are valid indices
      const temp = arr[i] as number;
      const minVal = arr[minIdx] as number;

      arr[i] = minVal;
      arr[minIdx] = temp;

      yield {
        type: "swap",
        indices: [i, minIdx],
        newValues: [arr[i] as number, arr[minIdx] as number],
      };
    }

    // Mark position as sorted
    yield { type: "sorted", index: i };
  }

  // Last element is automatically sorted
  if (n > 0) {
    yield { type: "sorted", index: n - 1 };
  }
}
