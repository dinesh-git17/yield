import { describe, expect, it } from "vitest";
import { insertionSort } from "./insertionSort";
import type { SortStep } from "./types";

describe("insertionSort", () => {
  it("yields the correct sequence of steps for [3, 1, 2]", () => {
    const arr = [3, 1, 2];
    const generator = insertionSort(arr);
    const steps: SortStep[] = [...generator];

    // For [3, 1, 2]:
    // - Index 0: already sorted
    // - Index 1 (1): compare with 3, shift 3 right, insert 1 at 0 -> [1, 3, 2]
    // - Index 2 (2): compare with 3, shift 3 right, compare with 1, stop, insert 2 at 1 -> [1, 2, 3]
    expect(steps).toEqual([
      { type: "sorted", index: 0 },
      { type: "scanning", index: 1 },
      { type: "compare", indices: [0, 1] },
      { type: "overwrite", index: 1, value: 3 },
      { type: "overwrite", index: 0, value: 1 },
      { type: "sorted", index: 1 },
      { type: "scanning", index: 2 },
      { type: "compare", indices: [1, 2] },
      { type: "overwrite", index: 2, value: 3 },
      { type: "compare", indices: [0, 1] },
      { type: "overwrite", index: 1, value: 2 },
      { type: "sorted", index: 2 },
    ]);

    expect(arr).toEqual([1, 2, 3]);
  });

  it("handles an empty array", () => {
    const arr: number[] = [];
    const steps = [...insertionSort(arr)];

    expect(steps).toEqual([]);
    expect(arr).toEqual([]);
  });

  it("handles a single-element array", () => {
    const arr = [42];
    const steps = [...insertionSort(arr)];

    expect(steps).toEqual([{ type: "sorted", index: 0 }]);
    expect(arr).toEqual([42]);
  });

  it("handles an already sorted array", () => {
    const arr = [1, 2, 3];
    const steps = [...insertionSort(arr)];

    // In an already sorted array, each element is compared and stays in place
    // Overwrites still happen (placing element back) but no shifting occurs
    expect(steps.filter((s) => s.type === "compare")).toHaveLength(2);
    expect(arr).toEqual([1, 2, 3]);
  });

  it("handles a reverse-sorted array", () => {
    const arr = [5, 4, 3, 2, 1];
    const steps = [...insertionSort(arr)];

    expect(arr).toEqual([1, 2, 3, 4, 5]);

    const sortedSteps = steps.filter((s) => s.type === "sorted");
    expect(sortedSteps).toHaveLength(5);
  });

  it("handles an array with duplicate values", () => {
    const arr = [2, 1, 2, 1];
    const generator = insertionSort(arr);
    const steps = [...generator];

    expect(arr).toEqual([1, 1, 2, 2]);

    const sortedSteps = steps.filter((s) => s.type === "sorted");
    expect(sortedSteps).toHaveLength(4);
  });

  it("correctly shifts multiple elements", () => {
    const arr = [4, 3, 2, 1];
    const steps = [...insertionSort(arr)];

    expect(arr).toEqual([1, 2, 3, 4]);

    // Check that scanning happens for each element being inserted
    const scanningSteps = steps.filter((s) => s.type === "scanning");
    expect(scanningSteps).toHaveLength(3);
  });
});
