import { describe, expect, it } from "vitest";
import type { TreeState } from "@/lib/store";
import {
  bstDelete,
  bstInsert,
  bstSearch,
  inOrderTraversal,
  levelOrderTraversal,
  postOrderTraversal,
  preOrderTraversal,
} from "./bst";
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
 * Creates a simple tree:
 *       50
 *      /  \
 *    25    75
 */
function simpleTree(): TreeState {
  return {
    rootId: "node-1",
    nodes: {
      "node-1": { id: "node-1", value: 50, leftId: "node-2", rightId: "node-3", parentId: null },
      "node-2": { id: "node-2", value: 25, leftId: null, rightId: null, parentId: "node-1" },
      "node-3": { id: "node-3", value: 75, leftId: null, rightId: null, parentId: "node-1" },
    },
  };
}

/**
 * Creates a more complex tree:
 *         50
 *        /  \
 *      25    75
 *     /  \   /  \
 *   10   30 60   90
 */
function complexTree(): TreeState {
  return {
    rootId: "node-1",
    nodes: {
      "node-1": { id: "node-1", value: 50, leftId: "node-2", rightId: "node-3", parentId: null },
      "node-2": {
        id: "node-2",
        value: 25,
        leftId: "node-4",
        rightId: "node-5",
        parentId: "node-1",
      },
      "node-3": {
        id: "node-3",
        value: 75,
        leftId: "node-6",
        rightId: "node-7",
        parentId: "node-1",
      },
      "node-4": { id: "node-4", value: 10, leftId: null, rightId: null, parentId: "node-2" },
      "node-5": { id: "node-5", value: 30, leftId: null, rightId: null, parentId: "node-2" },
      "node-6": { id: "node-6", value: 60, leftId: null, rightId: null, parentId: "node-3" },
      "node-7": { id: "node-7", value: 90, leftId: null, rightId: null, parentId: "node-3" },
    },
  };
}

describe("bstInsert", () => {
  it("yields insert step for empty tree", () => {
    const context: TreeContext = { treeState: emptyTree() };
    const steps = collectSteps(bstInsert(context, 50));

    expect(steps).toHaveLength(1);
    expect(steps[0]).toEqual({
      type: "insert",
      nodeId: "pending",
      value: 50,
      parentId: null,
      position: "root",
    });
  });

  it("yields compare then insert for left child", () => {
    const context: TreeContext = { treeState: simpleTree() };
    const steps = collectSteps(bstInsert(context, 10));

    expect(steps).toHaveLength(3);
    expect(steps[0]).toMatchObject({ type: "compare", nodeId: "node-1", result: "left" });
    expect(steps[1]).toMatchObject({ type: "compare", nodeId: "node-2", result: "left" });
    expect(steps[2]).toMatchObject({ type: "insert", value: 10, position: "left" });
  });

  it("yields compare then insert for right child", () => {
    const context: TreeContext = { treeState: simpleTree() };
    const steps = collectSteps(bstInsert(context, 100));

    expect(steps).toHaveLength(3);
    expect(steps[0]).toMatchObject({ type: "compare", nodeId: "node-1", result: "right" });
    expect(steps[1]).toMatchObject({ type: "compare", nodeId: "node-3", result: "right" });
    expect(steps[2]).toMatchObject({ type: "insert", value: 100, position: "right" });
  });

  it("yields found for duplicate value", () => {
    const context: TreeContext = { treeState: simpleTree() };
    const steps = collectSteps(bstInsert(context, 50));

    expect(steps).toHaveLength(2);
    expect(steps[0]).toMatchObject({ type: "compare", nodeId: "node-1", result: "equal" });
    expect(steps[1]).toMatchObject({ type: "found", nodeId: "node-1" });
  });
});

describe("bstSearch", () => {
  it("yields not-found for empty tree", () => {
    const context: TreeContext = { treeState: emptyTree() };
    const steps = collectSteps(bstSearch(context, 50));

    expect(steps).toHaveLength(1);
    expect(steps[0]).toEqual({ type: "not-found", value: 50 });
  });

  it("yields found for root value", () => {
    const context: TreeContext = { treeState: simpleTree() };
    const steps = collectSteps(bstSearch(context, 50));

    expect(steps).toHaveLength(2);
    expect(steps[0]).toMatchObject({ type: "compare", nodeId: "node-1", result: "equal" });
    expect(steps[1]).toMatchObject({ type: "found", nodeId: "node-1" });
  });

  it("yields compare steps then found for left child", () => {
    const context: TreeContext = { treeState: simpleTree() };
    const steps = collectSteps(bstSearch(context, 25));

    expect(steps).toHaveLength(3);
    expect(steps[0]).toMatchObject({ type: "compare", nodeId: "node-1", result: "left" });
    expect(steps[1]).toMatchObject({ type: "compare", nodeId: "node-2", result: "equal" });
    expect(steps[2]).toMatchObject({ type: "found", nodeId: "node-2" });
  });

  it("yields compare steps then found for right child", () => {
    const context: TreeContext = { treeState: simpleTree() };
    const steps = collectSteps(bstSearch(context, 75));

    expect(steps).toHaveLength(3);
    expect(steps[0]).toMatchObject({ type: "compare", nodeId: "node-1", result: "right" });
    expect(steps[1]).toMatchObject({ type: "compare", nodeId: "node-3", result: "equal" });
    expect(steps[2]).toMatchObject({ type: "found", nodeId: "node-3" });
  });

  it("yields not-found after traversing to null", () => {
    const context: TreeContext = { treeState: simpleTree() };
    const steps = collectSteps(bstSearch(context, 100));

    expect(steps).toHaveLength(3);
    expect(steps[0]).toMatchObject({ type: "compare", nodeId: "node-1", result: "right" });
    expect(steps[1]).toMatchObject({ type: "compare", nodeId: "node-3", result: "right" });
    expect(steps[2]).toEqual({ type: "not-found", value: 100 });
  });

  it("finds deeply nested value", () => {
    const context: TreeContext = { treeState: complexTree() };
    const steps = collectSteps(bstSearch(context, 10));

    expect(steps).toHaveLength(4);
    expect(steps[0]).toMatchObject({ type: "compare", nodeId: "node-1", result: "left" });
    expect(steps[1]).toMatchObject({ type: "compare", nodeId: "node-2", result: "left" });
    expect(steps[2]).toMatchObject({ type: "compare", nodeId: "node-4", result: "equal" });
    expect(steps[3]).toMatchObject({ type: "found", nodeId: "node-4" });
  });
});

describe("bstDelete", () => {
  it("yields not-found for empty tree", () => {
    const context: TreeContext = { treeState: emptyTree() };
    const steps = collectSteps(bstDelete(context, 50));

    expect(steps).toHaveLength(1);
    expect(steps[0]).toEqual({ type: "not-found", value: 50 });
  });

  it("yields delete with leaf strategy for leaf node", () => {
    const context: TreeContext = { treeState: simpleTree() };
    const steps = collectSteps(bstDelete(context, 25));

    const deleteStep = steps.find((s) => s.type === "delete");
    expect(deleteStep).toMatchObject({
      type: "delete",
      nodeId: "node-2",
      strategy: "leaf",
    });
  });

  it("yields delete with one-child strategy", () => {
    // Create a tree where 25 has only a left child
    const treeState: TreeState = {
      rootId: "node-1",
      nodes: {
        "node-1": { id: "node-1", value: 50, leftId: "node-2", rightId: null, parentId: null },
        "node-2": { id: "node-2", value: 25, leftId: "node-3", rightId: null, parentId: "node-1" },
        "node-3": { id: "node-3", value: 10, leftId: null, rightId: null, parentId: "node-2" },
      },
    };
    const context: TreeContext = { treeState };
    const steps = collectSteps(bstDelete(context, 25));

    const deleteStep = steps.find((s) => s.type === "delete");
    expect(deleteStep).toMatchObject({
      type: "delete",
      nodeId: "node-2",
      strategy: "one-child",
    });
  });

  it("yields delete with two-children strategy and successor", () => {
    const context: TreeContext = { treeState: complexTree() };
    const steps = collectSteps(bstDelete(context, 50));

    const visitStep = steps.find((s) => s.type === "visit");
    const deleteStep = steps.find((s) => s.type === "delete");

    // Should visit the successor (60, the leftmost in right subtree)
    expect(visitStep).toMatchObject({ type: "visit", nodeId: "node-6" });
    expect(deleteStep).toMatchObject({
      type: "delete",
      nodeId: "node-1",
      strategy: "two-children",
      successorId: "node-6",
    });
  });

  it("yields not-found for non-existent value", () => {
    const context: TreeContext = { treeState: simpleTree() };
    const steps = collectSteps(bstDelete(context, 100));

    expect(steps[steps.length - 1]).toEqual({ type: "not-found", value: 100 });
  });
});

describe("inOrderTraversal", () => {
  it("yields nothing for empty tree", () => {
    const context: TreeContext = { treeState: emptyTree() };
    const steps = collectSteps(inOrderTraversal(context));
    expect(steps).toHaveLength(0);
  });

  it("yields nodes in sorted order (Left → Root → Right)", () => {
    const context: TreeContext = { treeState: complexTree() };
    const steps = collectSteps(inOrderTraversal(context));

    const outputSteps = steps.filter((s) => s.type === "traverse-output");
    const values = outputSteps.map((s) => (s.type === "traverse-output" ? s.value : 0));

    // In-order should yield sorted values
    expect(values).toEqual([10, 25, 30, 50, 60, 75, 90]);
  });

  it("yields visit before traverse-output for each node", () => {
    const context: TreeContext = { treeState: simpleTree() };
    const steps = collectSteps(inOrderTraversal(context));

    // Each node should have a visit followed by traverse-output
    expect(steps).toHaveLength(6); // 3 nodes × 2 steps each
    expect(steps[0]).toMatchObject({ type: "visit", nodeId: "node-2" });
    expect(steps[1]).toMatchObject({ type: "traverse-output", nodeId: "node-2" });
  });
});

describe("preOrderTraversal", () => {
  it("yields nodes in Root → Left → Right order", () => {
    const context: TreeContext = { treeState: complexTree() };
    const steps = collectSteps(preOrderTraversal(context));

    const outputSteps = steps.filter((s) => s.type === "traverse-output");
    const values = outputSteps.map((s) => (s.type === "traverse-output" ? s.value : 0));

    // Pre-order: Root, Left subtree, Right subtree
    expect(values).toEqual([50, 25, 10, 30, 75, 60, 90]);
  });
});

describe("postOrderTraversal", () => {
  it("yields nodes in Left → Right → Root order", () => {
    const context: TreeContext = { treeState: complexTree() };
    const steps = collectSteps(postOrderTraversal(context));

    const outputSteps = steps.filter((s) => s.type === "traverse-output");
    const values = outputSteps.map((s) => (s.type === "traverse-output" ? s.value : 0));

    // Post-order: Left subtree, Right subtree, Root
    expect(values).toEqual([10, 30, 25, 60, 90, 75, 50]);
  });
});

describe("levelOrderTraversal", () => {
  it("yields nothing for empty tree", () => {
    const context: TreeContext = { treeState: emptyTree() };
    const steps = collectSteps(levelOrderTraversal(context));
    expect(steps).toHaveLength(0);
  });

  it("yields nodes level by level (BFS)", () => {
    const context: TreeContext = { treeState: complexTree() };
    const steps = collectSteps(levelOrderTraversal(context));

    const outputSteps = steps.filter((s) => s.type === "traverse-output");
    const values = outputSteps.map((s) => (s.type === "traverse-output" ? s.value : 0));

    // Level-order: Level 0, Level 1, Level 2
    expect(values).toEqual([50, 25, 75, 10, 30, 60, 90]);
  });

  it("assigns correct order indices", () => {
    const context: TreeContext = { treeState: simpleTree() };
    const steps = collectSteps(levelOrderTraversal(context));

    const outputSteps = steps.filter((s) => s.type === "traverse-output");
    const orders = outputSteps.map((s) => (s.type === "traverse-output" ? s.order : -1));

    expect(orders).toEqual([0, 1, 2]);
  });
});
