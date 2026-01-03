import type { SortStep } from "./types";

/**
 * Bubble Sort algorithm implemented as a generator.
 * Yields step-by-step operations for visualization.
 *
 * @param arr - The array to sort (will be mutated)
 * @yields SortStep - Compare, swap, or sorted operations
 */
export function* bubbleSort(arr: number[]): Generator<SortStep, void, unknown> {
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      yield { type: "compare", indices: [j, j + 1] };

      // Loop bounds guarantee j and j+1 are valid indices
      const current = arr[j] as number;
      const next = arr[j + 1] as number;

      if (current > next) {
        arr[j] = next;
        arr[j + 1] = current;

        yield {
          type: "swap",
          indices: [j, j + 1],
          // Values are guaranteed defined after swap
          newValues: [arr[j] as number, arr[j + 1] as number],
        };
      }
    }

    yield { type: "sorted", index: n - 1 - i };
  }

  if (n > 0) {
    yield { type: "sorted", index: 0 };
  }
}
