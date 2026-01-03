import type { SortStep } from "./types";

/**
 * Gnome Sort algorithm implemented as a generator.
 * Also known as "Stupid Sort" - works like a gnome sorting garden pots.
 * Moves forward when elements are in order, swaps and moves backward when not.
 * Creates a distinctive "zipper" visual pattern.
 *
 * @param arr - The array to sort (will be mutated)
 * @yields SortStep - Compare, swap, or sorted operations
 */
export function* gnomeSort(arr: number[]): Generator<SortStep, void, unknown> {
  const n = arr.length;

  if (n <= 1) {
    if (n === 1) {
      yield { type: "sorted", index: 0 };
    }
    return;
  }

  let i = 0;

  while (i < n) {
    if (i === 0) {
      // At the start, just move forward
      i++;
    } else {
      // Loop bounds guarantee i and i-1 are valid indices
      const current = arr[i] as number;
      const previous = arr[i - 1] as number;

      // Compare current with previous
      yield { type: "compare", indices: [i - 1, i] };

      if (current >= previous) {
        // In order - move forward
        i++;
      } else {
        // Out of order - swap and move backward
        arr[i] = previous;
        arr[i - 1] = current;

        yield {
          type: "swap",
          indices: [i - 1, i],
          newValues: [current, previous],
        };

        i--;
      }
    }
  }

  // Mark all elements as sorted
  for (let j = 0; j < n; j++) {
    yield { type: "sorted", index: j };
  }
}
