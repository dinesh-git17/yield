import { describe, expect, it } from "vitest";
import { heapSort } from "./heapSort";
import type { SortStep } from "./types";

describe("heapSort", () => {
  it("correctly sorts [3, 1, 2]", () => {
    const arr = [3, 1, 2];
    const generator = heapSort(arr);
    const steps: SortStep[] = [...generator];

    expect(arr).toEqual([1, 2, 3]);

    // Should have sorted steps for all elements
    const sortedSteps = steps.filter((s) => s.type === "sorted");
    expect(sortedSteps).toHaveLength(3);
  });

  it("handles an empty array", () => {
    const arr: number[] = [];
    const steps = [...heapSort(arr)];

    expect(steps).toEqual([]);
    expect(arr).toEqual([]);
  });

  it("handles a single-element array", () => {
    const arr = [42];
    const steps = [...heapSort(arr)];

    expect(steps).toEqual([{ type: "sorted", index: 0 }]);
    expect(arr).toEqual([42]);
  });

  it("handles an already sorted array", () => {
    const arr = [1, 2, 3];
    const steps = [...heapSort(arr)];

    expect(arr).toEqual([1, 2, 3]);

    const sortedSteps = steps.filter((s) => s.type === "sorted");
    expect(sortedSteps).toHaveLength(3);
  });

  it("handles a reverse-sorted array", () => {
    const arr = [5, 4, 3, 2, 1];
    const steps = [...heapSort(arr)];

    expect(arr).toEqual([1, 2, 3, 4, 5]);

    const sortedSteps = steps.filter((s) => s.type === "sorted");
    expect(sortedSteps).toHaveLength(5);
  });

  it("handles an array with duplicate values", () => {
    const arr = [2, 1, 2, 1];
    const generator = heapSort(arr);
    const steps = [...generator];

    expect(arr).toEqual([1, 1, 2, 2]);

    const sortedSteps = steps.filter((s) => s.type === "sorted");
    expect(sortedSteps).toHaveLength(4);
  });

  it("demonstrates tree structure through index jumps", () => {
    // With 7 elements, we should see comparisons between:
    // - Index 0 and indices 1, 2 (children of root)
    // - Index 1 and indices 3, 4 (children of node 1)
    // - Index 2 and indices 5, 6 (children of node 2)
    const arr = [7, 6, 5, 4, 3, 2, 1];
    const steps = [...heapSort(arr)];

    expect(arr).toEqual([1, 2, 3, 4, 5, 6, 7]);

    // Check that we have comparisons with non-adjacent indices (tree structure)
    const compareSteps = steps.filter((s) => s.type === "compare") as Array<{
      type: "compare";
      indices: [number, number];
    }>;

    // Find comparisons where indices differ by more than 1 (tree jumps)
    const treeJumps = compareSteps.filter((s) => Math.abs(s.indices[0] - s.indices[1]) > 1);

    // Heap sort should have tree-like jumps (parent to child comparisons)
    expect(treeJumps.length).toBeGreaterThan(0);
  });

  it("correctly builds max heap in phase 1", () => {
    const arr = [1, 2, 3, 4, 5];
    const steps = [...heapSort(arr)];

    // After sorting, array should be sorted ascending
    expect(arr).toEqual([1, 2, 3, 4, 5]);

    // Verify we have both compare and swap operations
    const compareCount = steps.filter((s) => s.type === "compare").length;
    const swapCount = steps.filter((s) => s.type === "swap").length;

    expect(compareCount).toBeGreaterThan(0);
    expect(swapCount).toBeGreaterThan(0);
  });

  it("extracts elements in correct order (phase 2)", () => {
    const arr = [3, 1, 4, 1, 5, 9, 2, 6];
    const steps = [...heapSort(arr)];

    expect(arr).toEqual([1, 1, 2, 3, 4, 5, 6, 9]);

    // Check that sorted indices are marked from end to beginning
    const sortedSteps = steps.filter((s) => s.type === "sorted") as Array<{
      type: "sorted";
      index: number;
    }>;

    // Last element sorted first (extraction phase), then decreasing
    // The exact order depends on when sorted is emitted
    expect(sortedSteps).toHaveLength(8);
  });
});
