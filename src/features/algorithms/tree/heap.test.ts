import { describe, expect, it } from "vitest";
import type { TreeState } from "@/lib/store";
import {
  findHeapInsertionPoint,
  getLastNode,
  getNodesInLevelOrder,
  heapExtractMax,
  heapInsert,
} from "./heap";
import type { TreeContext, TreeStep } from "./types";

/**
 * Helper to collect all steps from a generator.
 */
function collectSteps(gen: Generator<TreeStep, void, unknown>): TreeStep[] {
  const steps: TreeStep[] = [];
  for (const step of gen) {
    steps.push(step);
  }
  return steps;
}

/**
 * Creates an empty tree state.
 */
function emptyTree(): TreeState {
  return { rootId: null, nodes: {} };
}

/**
 * Creates a simple max heap:
 *       90
 *      /  \
 *    50    75
 *
 * Valid max heap: parent >= children at each node
 */
function simpleMaxHeap(): TreeState {
  return {
    rootId: "node-1",
    nodes: {
      "node-1": { id: "node-1", value: 90, leftId: "node-2", rightId: "node-3", parentId: null },
      "node-2": { id: "node-2", value: 50, leftId: null, rightId: null, parentId: "node-1" },
      "node-3": { id: "node-3", value: 75, leftId: null, rightId: null, parentId: "node-1" },
    },
  };
}

/**
 * Creates a complete max heap:
 *           90
 *         /    \
 *       75      60
 *      /  \    /  \
 *    50   25  30   10
 *
 * Complete binary tree with max heap property
 */
function completeMaxHeap(): TreeState {
  return {
    rootId: "node-1",
    nodes: {
      "node-1": { id: "node-1", value: 90, leftId: "node-2", rightId: "node-3", parentId: null },
      "node-2": {
        id: "node-2",
        value: 75,
        leftId: "node-4",
        rightId: "node-5",
        parentId: "node-1",
      },
      "node-3": {
        id: "node-3",
        value: 60,
        leftId: "node-6",
        rightId: "node-7",
        parentId: "node-1",
      },
      "node-4": { id: "node-4", value: 50, leftId: null, rightId: null, parentId: "node-2" },
      "node-5": { id: "node-5", value: 25, leftId: null, rightId: null, parentId: "node-2" },
      "node-6": { id: "node-6", value: 30, leftId: null, rightId: null, parentId: "node-3" },
      "node-7": { id: "node-7", value: 10, leftId: null, rightId: null, parentId: "node-3" },
    },
  };
}

/**
 * Creates a max heap with space for one more node (incomplete last level):
 *       90
 *      /  \
 *    75    60
 *   /
 *  50
 */
function incompleteMaxHeap(): TreeState {
  return {
    rootId: "node-1",
    nodes: {
      "node-1": { id: "node-1", value: 90, leftId: "node-2", rightId: "node-3", parentId: null },
      "node-2": { id: "node-2", value: 75, leftId: "node-4", rightId: null, parentId: "node-1" },
      "node-3": { id: "node-3", value: 60, leftId: null, rightId: null, parentId: "node-1" },
      "node-4": { id: "node-4", value: 50, leftId: null, rightId: null, parentId: "node-2" },
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper Function Tests
// ─────────────────────────────────────────────────────────────────────────────

describe("getNodesInLevelOrder", () => {
  it("returns empty array for empty tree", () => {
    const nodes = getNodesInLevelOrder(emptyTree());
    expect(nodes).toEqual([]);
  });

  it("returns nodes in level order", () => {
    const nodes = getNodesInLevelOrder(simpleMaxHeap());
    expect(nodes).toEqual(["node-1", "node-2", "node-3"]);
  });

  it("returns complete tree in correct order", () => {
    const nodes = getNodesInLevelOrder(completeMaxHeap());
    expect(nodes).toEqual(["node-1", "node-2", "node-3", "node-4", "node-5", "node-6", "node-7"]);
  });
});

describe("getLastNode", () => {
  it("returns null for empty tree", () => {
    const lastNode = getLastNode(emptyTree());
    expect(lastNode).toBeNull();
  });

  it("returns last node in level order", () => {
    expect(getLastNode(simpleMaxHeap())).toBe("node-3");
    expect(getLastNode(completeMaxHeap())).toBe("node-7");
    expect(getLastNode(incompleteMaxHeap())).toBe("node-4");
  });
});

describe("findHeapInsertionPoint", () => {
  it("returns null for empty tree", () => {
    const point = findHeapInsertionPoint(emptyTree());
    expect(point).toBeNull();
  });

  it("finds first missing left child", () => {
    const tree: TreeState = {
      rootId: "node-1",
      nodes: {
        "node-1": { id: "node-1", value: 90, leftId: null, rightId: null, parentId: null },
      },
    };
    const point = findHeapInsertionPoint(tree);
    expect(point).toEqual({ parentId: "node-1", position: "left" });
  });

  it("finds first missing right child", () => {
    const tree: TreeState = {
      rootId: "node-1",
      nodes: {
        "node-1": { id: "node-1", value: 90, leftId: "node-2", rightId: null, parentId: null },
        "node-2": { id: "node-2", value: 50, leftId: null, rightId: null, parentId: "node-1" },
      },
    };
    const point = findHeapInsertionPoint(tree);
    expect(point).toEqual({ parentId: "node-1", position: "right" });
  });

  it("finds correct insertion point in incomplete heap", () => {
    const point = findHeapInsertionPoint(incompleteMaxHeap());
    // node-2 has left child but no right child
    expect(point).toEqual({ parentId: "node-2", position: "right" });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// heapInsert Tests
// ─────────────────────────────────────────────────────────────────────────────

describe("heapInsert", () => {
  it("yields insert step for empty tree", () => {
    const context: TreeContext = { treeState: emptyTree() };
    const steps = collectSteps(heapInsert(context, 50));

    expect(steps).toHaveLength(1);
    expect(steps[0]).toEqual({
      type: "insert",
      nodeId: "pending",
      value: 50,
      parentId: null,
      position: "root",
    });
  });

  it("yields insert step at correct position", () => {
    const context: TreeContext = { treeState: simpleMaxHeap() };
    const steps = collectSteps(heapInsert(context, 40));

    // First step should be insert
    const insertStep = steps.find((s) => s.type === "insert");
    expect(insertStep).toMatchObject({
      type: "insert",
      value: 40,
      parentId: "node-2", // Insert under first node missing a child
      position: "left",
    });
  });

  it("yields bubble-up and swap steps when new value is larger than parent", () => {
    const context: TreeContext = { treeState: simpleMaxHeap() };
    // Insert value larger than some ancestors
    const steps = collectSteps(heapInsert(context, 100));

    // Should have insert, then bubble-up, then swap steps
    const insertStep = steps.find((s) => s.type === "insert");
    const bubbleUpSteps = steps.filter((s) => s.type === "bubble-up");
    const swapSteps = steps.filter((s) => s.type === "swap");

    expect(insertStep).toBeDefined();
    expect(bubbleUpSteps.length).toBeGreaterThan(0);
    expect(swapSteps.length).toBeGreaterThan(0);
  });

  it("does not swap when new value is smaller than all ancestors", () => {
    const context: TreeContext = { treeState: completeMaxHeap() };
    // Insert a small value that won't need to bubble up
    const steps = collectSteps(heapInsert(context, 5));

    // Should have insert and bubble-up (with willSwap: false)
    const swapSteps = steps.filter((s) => s.type === "swap");
    expect(swapSteps).toHaveLength(0);
  });

  it("yields correct steps for value that bubbles to root", () => {
    const context: TreeContext = { treeState: simpleMaxHeap() };
    // Insert value larger than root (90)
    const steps = collectSteps(heapInsert(context, 100));

    // Should bubble all the way to root
    const bubbleUpSteps = steps.filter((s) => s.type === "bubble-up");

    // At least one bubble-up step should show willSwap: true
    const willSwapSteps = bubbleUpSteps.filter((s) => s.type === "bubble-up" && s.willSwap);
    expect(willSwapSteps.length).toBeGreaterThan(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// heapExtractMax Tests
// ─────────────────────────────────────────────────────────────────────────────

describe("heapExtractMax", () => {
  it("yields not-found for empty tree", () => {
    const context: TreeContext = { treeState: emptyTree() };
    const steps = collectSteps(heapExtractMax(context));

    expect(steps).toHaveLength(1);
    expect(steps[0]).toMatchObject({ type: "not-found" });
  });

  it("yields extract-max step with correct value", () => {
    const context: TreeContext = { treeState: simpleMaxHeap() };
    const steps = collectSteps(heapExtractMax(context));

    const extractStep = steps.find((s) => s.type === "extract-max");
    expect(extractStep).toMatchObject({
      type: "extract-max",
      nodeId: "node-1",
      value: 90, // Root should have max value
    });
  });

  it("yields delete step for single node tree", () => {
    const tree: TreeState = {
      rootId: "node-1",
      nodes: {
        "node-1": { id: "node-1", value: 50, leftId: null, rightId: null, parentId: null },
      },
    };
    const context: TreeContext = { treeState: tree };
    const steps = collectSteps(heapExtractMax(context));

    expect(steps).toHaveLength(2);
    expect(steps[0]).toMatchObject({ type: "extract-max", value: 50 });
    expect(steps[1]).toMatchObject({ type: "delete", strategy: "leaf" });
  });

  it("yields swap step moving last node to root", () => {
    const context: TreeContext = { treeState: simpleMaxHeap() };
    const steps = collectSteps(heapExtractMax(context));

    // After extract-max, should swap root with last node
    const swapSteps = steps.filter((s) => s.type === "swap");
    expect(swapSteps.length).toBeGreaterThan(0);

    // First swap should involve root and last node
    const firstSwap = swapSteps[0];
    if (firstSwap && firstSwap.type === "swap") {
      expect(firstSwap.nodeId1).toBe("node-1"); // root
      expect(firstSwap.nodeId2).toBe("node-3"); // last node
    }
  });

  it("yields delete step for last node", () => {
    const context: TreeContext = { treeState: simpleMaxHeap() };
    const steps = collectSteps(heapExtractMax(context));

    const deleteStep = steps.find((s) => s.type === "delete");
    expect(deleteStep).toMatchObject({
      type: "delete",
      nodeId: "node-3", // last node
      strategy: "leaf",
    });
  });

  it("yields sink-down steps when root value needs to sink", () => {
    const context: TreeContext = { treeState: completeMaxHeap() };
    const steps = collectSteps(heapExtractMax(context));

    // After replacing root with last node (value 10), it should sink down
    const sinkDownSteps = steps.filter((s) => s.type === "sink-down");
    expect(sinkDownSteps.length).toBeGreaterThan(0);
  });

  it("sink-down shows correct child comparison", () => {
    const context: TreeContext = { treeState: completeMaxHeap() };
    const steps = collectSteps(heapExtractMax(context));

    const sinkDownSteps = steps.filter((s) => s.type === "sink-down");

    // First sink-down should be at root, comparing with both children
    const firstSink = sinkDownSteps[0];
    if (firstSink && firstSink.type === "sink-down") {
      expect(firstSink.nodeId).toBe("node-1");
      expect(firstSink.childIds).toContain("node-2");
      expect(firstSink.childIds).toContain("node-3");
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Heap Property Tests
// ─────────────────────────────────────────────────────────────────────────────

describe("Heap Property Verification", () => {
  it("heapInsert maintains complete tree property", () => {
    // Start with incomplete heap and insert a value
    const context: TreeContext = { treeState: incompleteMaxHeap() };
    const steps = collectSteps(heapInsert(context, 40));

    // Insert should be at the next available position (node-2's right child)
    const insertStep = steps.find((s) => s.type === "insert");
    expect(insertStep).toMatchObject({
      parentId: "node-2",
      position: "right",
    });
  });

  it("heapExtractMax removes from complete tree correctly", () => {
    const context: TreeContext = { treeState: completeMaxHeap() };
    const steps = collectSteps(heapExtractMax(context));

    // Should extract root (90) and delete last node (node-7)
    const extractStep = steps.find((s) => s.type === "extract-max");
    const deleteStep = steps.find((s) => s.type === "delete");

    expect(extractStep).toMatchObject({ value: 90 });
    expect(deleteStep).toMatchObject({ nodeId: "node-7" });
  });
});
