import { describe, expect, it } from "vitest";
import { bubbleSort } from "./bubbleSort";
import type { SortStep } from "./types";

describe("bubbleSort", () => {
  it("yields the correct sequence of steps for [3, 1, 2]", () => {
    const arr = [3, 1, 2];
    const generator = bubbleSort(arr);
    const steps: SortStep[] = [...generator];

    expect(steps).toEqual([
      { type: "compare", indices: [0, 1] },
      { type: "swap", indices: [0, 1], newValues: [1, 3] },
      { type: "compare", indices: [1, 2] },
      { type: "swap", indices: [1, 2], newValues: [2, 3] },
      { type: "sorted", index: 2 },
      { type: "compare", indices: [0, 1] },
      { type: "sorted", index: 1 },
      { type: "sorted", index: 0 },
    ]);

    expect(arr).toEqual([1, 2, 3]);
  });

  it("handles an empty array", () => {
    const arr: number[] = [];
    const steps = [...bubbleSort(arr)];

    expect(steps).toEqual([]);
    expect(arr).toEqual([]);
  });

  it("handles a single-element array", () => {
    const arr = [42];
    const steps = [...bubbleSort(arr)];

    expect(steps).toEqual([{ type: "sorted", index: 0 }]);
    expect(arr).toEqual([42]);
  });

  it("handles an already sorted array", () => {
    const arr = [1, 2, 3];
    const steps = [...bubbleSort(arr)];

    const swapSteps = steps.filter((s) => s.type === "swap");
    expect(swapSteps).toHaveLength(0);

    expect(arr).toEqual([1, 2, 3]);
  });

  it("handles a reverse-sorted array", () => {
    const arr = [5, 4, 3, 2, 1];
    const steps = [...bubbleSort(arr)];

    expect(arr).toEqual([1, 2, 3, 4, 5]);

    const sortedSteps = steps.filter((s) => s.type === "sorted");
    expect(sortedSteps).toHaveLength(5);
  });

  it("handles an array with duplicate values", () => {
    const arr = [2, 1, 2, 1];
    const generator = bubbleSort(arr);
    const steps = [...generator];

    expect(arr).toEqual([1, 1, 2, 2]);

    const sortedSteps = steps.filter((s) => s.type === "sorted");
    expect(sortedSteps).toHaveLength(4);
  });
});
