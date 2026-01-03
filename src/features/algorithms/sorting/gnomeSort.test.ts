import { describe, expect, it } from "vitest";
import { gnomeSort } from "./gnomeSort";
import type { SortStep } from "./types";

describe("gnomeSort", () => {
  it("yields the correct sequence of steps for [3, 1, 2]", () => {
    const arr = [3, 1, 2];
    const generator = gnomeSort(arr);
    const steps: SortStep[] = [...generator];

    // For [3, 1, 2]:
    // i=0: move forward -> i=1
    // i=1: compare(0,1), 1 < 3, swap -> [1, 3, 2], i=0
    // i=0: move forward -> i=1
    // i=1: compare(0,1), 3 >= 1, move forward -> i=2
    // i=2: compare(1,2), 2 < 3, swap -> [1, 2, 3], i=1
    // i=1: compare(0,1), 2 >= 1, move forward -> i=2
    // i=2: compare(1,2), 3 >= 2, move forward -> i=3
    // i=3: exit loop, mark all sorted
    expect(steps).toEqual([
      { type: "compare", indices: [0, 1] },
      { type: "swap", indices: [0, 1], newValues: [1, 3] },
      { type: "compare", indices: [0, 1] },
      { type: "compare", indices: [1, 2] },
      { type: "swap", indices: [1, 2], newValues: [2, 3] },
      { type: "compare", indices: [0, 1] },
      { type: "compare", indices: [1, 2] },
      { type: "sorted", index: 0 },
      { type: "sorted", index: 1 },
      { type: "sorted", index: 2 },
    ]);

    expect(arr).toEqual([1, 2, 3]);
  });

  it("handles an empty array", () => {
    const arr: number[] = [];
    const steps = [...gnomeSort(arr)];

    expect(steps).toEqual([]);
    expect(arr).toEqual([]);
  });

  it("handles a single-element array", () => {
    const arr = [42];
    const steps = [...gnomeSort(arr)];

    expect(steps).toEqual([{ type: "sorted", index: 0 }]);
    expect(arr).toEqual([42]);
  });

  it("handles an already sorted array", () => {
    const arr = [1, 2, 3];
    const steps = [...gnomeSort(arr)];

    // No swaps should occur for sorted array
    const swapSteps = steps.filter((s) => s.type === "swap");
    expect(swapSteps).toHaveLength(0);

    expect(arr).toEqual([1, 2, 3]);
  });

  it("handles a reverse-sorted array", () => {
    const arr = [5, 4, 3, 2, 1];
    const steps = [...gnomeSort(arr)];

    expect(arr).toEqual([1, 2, 3, 4, 5]);

    const sortedSteps = steps.filter((s) => s.type === "sorted");
    expect(sortedSteps).toHaveLength(5);
  });

  it("handles an array with duplicate values", () => {
    const arr = [2, 1, 2, 1];
    const generator = gnomeSort(arr);
    const steps = [...generator];

    expect(arr).toEqual([1, 1, 2, 2]);

    const sortedSteps = steps.filter((s) => s.type === "sorted");
    expect(sortedSteps).toHaveLength(4);
  });

  it("creates the characteristic zipper pattern", () => {
    const arr = [3, 2, 1];
    const steps = [...gnomeSort(arr)];

    // Count forward and backward movements through swaps
    const swapSteps = steps.filter((s) => s.type === "swap");
    // For [3,2,1]: expect multiple swaps as it zips back and forth
    expect(swapSteps.length).toBeGreaterThan(0);
    expect(arr).toEqual([1, 2, 3]);
  });
});
