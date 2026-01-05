import { describe, expect, it } from "vitest";
import type { TreeState } from "@/lib/store";
import { splayDelete, splayInsert, splaySearch } from "./splay";
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
 * Creates a tree with a left chain (for testing zig-zig right):
 *       50
 *      /
 *    30
 *   /
 * 10
 */
function leftChainTree(): TreeState {
  return {
    rootId: "node-1",
    nodes: {
      "node-1": { id: "node-1", value: 50, leftId: "node-2", rightId: null, parentId: null },
      "node-2": { id: "node-2", value: 30, leftId: "node-3", rightId: null, parentId: "node-1" },
      "node-3": { id: "node-3", value: 10, leftId: null, rightId: null, parentId: "node-2" },
    },
  };
}

/**
 * Creates a tree with a right chain (for testing zig-zig left):
 * 10
 *   \
 *    30
 *      \
 *       50
 */
function rightChainTree(): TreeState {
  return {
    rootId: "node-1",
    nodes: {
      "node-1": { id: "node-1", value: 10, leftId: null, rightId: "node-2", parentId: null },
      "node-2": { id: "node-2", value: 30, leftId: null, rightId: "node-3", parentId: "node-1" },
      "node-3": { id: "node-3", value: 50, leftId: null, rightId: null, parentId: "node-2" },
    },
  };
}

/**
 * Creates a tree for zig-zag left-right:
 *   50
 *  /
 * 20
 *   \
 *    30
 */
function zigZagLeftRightTree(): TreeState {
  return {
    rootId: "node-1",
    nodes: {
      "node-1": { id: "node-1", value: 50, leftId: "node-2", rightId: null, parentId: null },
      "node-2": { id: "node-2", value: 20, leftId: null, rightId: "node-3", parentId: "node-1" },
      "node-3": { id: "node-3", value: 30, leftId: null, rightId: null, parentId: "node-2" },
    },
  };
}

/**
 * Creates a tree for zig-zag right-left:
 * 20
 *   \
 *    50
 *   /
 * 30
 */
function zigZagRightLeftTree(): TreeState {
  return {
    rootId: "node-1",
    nodes: {
      "node-1": { id: "node-1", value: 20, leftId: null, rightId: "node-2", parentId: null },
      "node-2": { id: "node-2", value: 50, leftId: "node-3", rightId: null, parentId: "node-1" },
      "node-3": { id: "node-3", value: 30, leftId: null, rightId: null, parentId: "node-2" },
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// splayInsert Tests
// ─────────────────────────────────────────────────────────────────────────────

describe("splayInsert", () => {
  it("yields insert step for empty tree (no splay needed)", () => {
    const context: TreeContext = { treeState: emptyTree() };
    const steps = collectSteps(splayInsert(context, 50));

    expect(steps).toHaveLength(1);
    expect(steps[0]).toMatchObject({
      type: "insert",
      value: 50,
      parentId: null,
      position: "root",
    });
  });

  it("yields compare, insert, and splay for left child insertion", () => {
    const tree: TreeState = {
      rootId: "node-1",
      nodes: {
        "node-1": { id: "node-1", value: 50, leftId: null, rightId: null, parentId: null },
      },
    };
    const context: TreeContext = { treeState: tree };
    const steps = collectSteps(splayInsert(context, 25));

    // Should have: compare, insert, splay-start, zig
    expect(steps.some((s) => s.type === "compare")).toBe(true);
    expect(steps.some((s) => s.type === "insert")).toBe(true);
    expect(steps.some((s) => s.type === "splay-start")).toBe(true);
    expect(steps.some((s) => s.type === "zig")).toBe(true);
  });

  it("yields compare, insert, and splay for right child insertion", () => {
    const tree: TreeState = {
      rootId: "node-1",
      nodes: {
        "node-1": { id: "node-1", value: 50, leftId: null, rightId: null, parentId: null },
      },
    };
    const context: TreeContext = { treeState: tree };
    const steps = collectSteps(splayInsert(context, 75));

    expect(steps.some((s) => s.type === "compare")).toBe(true);
    expect(steps.some((s) => s.type === "insert")).toBe(true);
    expect(steps.some((s) => s.type === "splay-start")).toBe(true);
    expect(steps.some((s) => s.type === "zig")).toBe(true);
  });

  it("splays existing node when inserting duplicate", () => {
    const context: TreeContext = { treeState: simpleTree() };
    const steps = collectSteps(splayInsert(context, 25));

    // Should find the existing node and splay it
    expect(steps.some((s) => s.type === "compare")).toBe(true);
    expect(steps.some((s) => s.type === "found")).toBe(true);
    expect(steps.some((s) => s.type === "splay-start")).toBe(true);
    expect(steps.some((s) => s.type === "zig")).toBe(true);
  });

  it("performs zig-zig for left-left insertion", () => {
    const context: TreeContext = { treeState: simpleTree() };
    const steps = collectSteps(splayInsert(context, 10));

    // Insert as left-left grandchild should trigger zig-zig
    expect(steps.some((s) => s.type === "insert")).toBe(true);
    expect(steps.some((s) => s.type === "zig-zig")).toBe(true);
  });

  it("performs zig-zag for left-right insertion", () => {
    const context: TreeContext = { treeState: simpleTree() };
    const steps = collectSteps(splayInsert(context, 30));

    // Insert as left-right grandchild should trigger zig-zag
    expect(steps.some((s) => s.type === "insert")).toBe(true);
    expect(steps.some((s) => s.type === "zig-zag")).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// splaySearch Tests
// ─────────────────────────────────────────────────────────────────────────────

describe("splaySearch", () => {
  it("yields not-found for empty tree", () => {
    const context: TreeContext = { treeState: emptyTree() };
    const steps = collectSteps(splaySearch(context, 50));

    expect(steps).toHaveLength(1);
    expect(steps[0]).toEqual({ type: "not-found", value: 50 });
  });

  it("finds and splays root node (no rotation needed)", () => {
    const context: TreeContext = { treeState: simpleTree() };
    const steps = collectSteps(splaySearch(context, 50));

    // Root found - compare (equal), found, but no splay needed since already at root
    const foundStep = steps.find((s) => s.type === "found");
    expect(foundStep).toBeDefined();
    // No rotation steps since node is already root
    expect(
      steps.filter((s) => s.type === "zig" || s.type === "zig-zig" || s.type === "zig-zag")
    ).toHaveLength(0);
  });

  it("finds and splays left child with zig rotation", () => {
    const context: TreeContext = { treeState: simpleTree() };
    const steps = collectSteps(splaySearch(context, 25));

    expect(steps.some((s) => s.type === "found")).toBe(true);
    expect(steps.some((s) => s.type === "splay-start")).toBe(true);
    expect(steps.some((s) => s.type === "zig")).toBe(true);
  });

  it("finds and splays right child with zig rotation", () => {
    const context: TreeContext = { treeState: simpleTree() };
    const steps = collectSteps(splaySearch(context, 75));

    expect(steps.some((s) => s.type === "found")).toBe(true);
    expect(steps.some((s) => s.type === "splay-start")).toBe(true);
    expect(steps.some((s) => s.type === "zig")).toBe(true);
  });

  it("performs zig-zig for left chain search", () => {
    const context: TreeContext = { treeState: leftChainTree() };
    const steps = collectSteps(splaySearch(context, 10));

    expect(steps.some((s) => s.type === "found")).toBe(true);
    expect(steps.some((s) => s.type === "zig-zig")).toBe(true);

    // Check zig-zig direction is right
    const zigZigStep = steps.find((s) => s.type === "zig-zig");
    if (zigZigStep && zigZigStep.type === "zig-zig") {
      expect(zigZigStep.direction).toBe("right");
    }
  });

  it("performs zig-zig for right chain search", () => {
    const context: TreeContext = { treeState: rightChainTree() };
    const steps = collectSteps(splaySearch(context, 50));

    expect(steps.some((s) => s.type === "found")).toBe(true);
    expect(steps.some((s) => s.type === "zig-zig")).toBe(true);

    // Check zig-zig direction is left
    const zigZigStep = steps.find((s) => s.type === "zig-zig");
    if (zigZigStep && zigZigStep.type === "zig-zig") {
      expect(zigZigStep.direction).toBe("left");
    }
  });

  it("performs zig-zag for left-right configuration", () => {
    const context: TreeContext = { treeState: zigZagLeftRightTree() };
    const steps = collectSteps(splaySearch(context, 30));

    expect(steps.some((s) => s.type === "found")).toBe(true);
    expect(steps.some((s) => s.type === "zig-zag")).toBe(true);

    // Check zig-zag directions
    const zigZagStep = steps.find((s) => s.type === "zig-zag");
    if (zigZagStep && zigZagStep.type === "zig-zag") {
      expect(zigZagStep.directions).toEqual(["left", "right"]);
    }
  });

  it("performs zig-zag for right-left configuration", () => {
    const context: TreeContext = { treeState: zigZagRightLeftTree() };
    const steps = collectSteps(splaySearch(context, 30));

    expect(steps.some((s) => s.type === "found")).toBe(true);
    expect(steps.some((s) => s.type === "zig-zag")).toBe(true);

    // Check zig-zag directions
    const zigZagStep = steps.find((s) => s.type === "zig-zag");
    if (zigZagStep && zigZagStep.type === "zig-zag") {
      expect(zigZagStep.directions).toEqual(["right", "left"]);
    }
  });

  it("splays last accessed node when not found", () => {
    const context: TreeContext = { treeState: simpleTree() };
    const steps = collectSteps(splaySearch(context, 100));

    expect(steps.some((s) => s.type === "not-found")).toBe(true);
    // Should splay the last accessed node (75)
    expect(steps.some((s) => s.type === "splay-start")).toBe(true);
    expect(steps.some((s) => s.type === "zig")).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// splayDelete Tests
// ─────────────────────────────────────────────────────────────────────────────

describe("splayDelete", () => {
  it("yields not-found for empty tree", () => {
    const context: TreeContext = { treeState: emptyTree() };
    const steps = collectSteps(splayDelete(context, 50));

    expect(steps).toHaveLength(1);
    expect(steps[0]).toEqual({ type: "not-found", value: 50 });
  });

  it("finds, splays, and yields delete step for root deletion", () => {
    const context: TreeContext = { treeState: simpleTree() };
    const steps = collectSteps(splayDelete(context, 50));

    // Root found - no splay needed, just delete
    expect(steps.some((s) => s.type === "delete")).toBe(true);
    const deleteStep = steps.find((s) => s.type === "delete");
    if (deleteStep && deleteStep.type === "delete") {
      expect(deleteStep.strategy).toBe("two-children");
    }
  });

  it("finds, splays, and yields delete step for leaf deletion", () => {
    const context: TreeContext = { treeState: simpleTree() };
    const steps = collectSteps(splayDelete(context, 25));

    // First splay 25 to root, then delete
    expect(steps.some((s) => s.type === "splay-start")).toBe(true);
    expect(steps.some((s) => s.type === "zig")).toBe(true);
    expect(steps.some((s) => s.type === "delete")).toBe(true);
  });

  it("yields not-found and splays last accessed when target not in tree", () => {
    const context: TreeContext = { treeState: simpleTree() };
    const steps = collectSteps(splayDelete(context, 100));

    expect(steps.some((s) => s.type === "not-found")).toBe(true);
    // Should splay the last accessed node
    expect(steps.some((s) => s.type === "splay-start")).toBe(true);
  });

  it("handles one-child deletion", () => {
    const tree: TreeState = {
      rootId: "node-1",
      nodes: {
        "node-1": { id: "node-1", value: 50, leftId: "node-2", rightId: null, parentId: null },
        "node-2": { id: "node-2", value: 25, leftId: null, rightId: null, parentId: "node-1" },
      },
    };
    const context: TreeContext = { treeState: tree };
    const steps = collectSteps(splayDelete(context, 50));

    expect(steps.some((s) => s.type === "delete")).toBe(true);
    const deleteStep = steps.find((s) => s.type === "delete");
    if (deleteStep && deleteStep.type === "delete") {
      expect(deleteStep.strategy).toBe("one-child");
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Splay Operation Step Type Tests
// ─────────────────────────────────────────────────────────────────────────────

describe("splay step types", () => {
  it("zig step has correct structure", () => {
    const context: TreeContext = { treeState: simpleTree() };
    const steps = collectSteps(splaySearch(context, 25));

    const zigStep = steps.find((s) => s.type === "zig");
    expect(zigStep).toBeDefined();
    if (zigStep && zigStep.type === "zig") {
      expect(zigStep.nodeId).toBe("node-2");
      expect(zigStep.parentId).toBe("node-1");
      expect(zigStep.direction).toBe("right");
    }
  });

  it("zig-zig step has correct structure", () => {
    const context: TreeContext = { treeState: leftChainTree() };
    const steps = collectSteps(splaySearch(context, 10));

    const zigZigStep = steps.find((s) => s.type === "zig-zig");
    expect(zigZigStep).toBeDefined();
    if (zigZigStep && zigZigStep.type === "zig-zig") {
      expect(zigZigStep.nodeId).toBe("node-3");
      expect(zigZigStep.parentId).toBe("node-2");
      expect(zigZigStep.grandparentId).toBe("node-1");
      expect(zigZigStep.direction).toBe("right");
    }
  });

  it("zig-zag step has correct structure", () => {
    const context: TreeContext = { treeState: zigZagLeftRightTree() };
    const steps = collectSteps(splaySearch(context, 30));

    const zigZagStep = steps.find((s) => s.type === "zig-zag");
    expect(zigZagStep).toBeDefined();
    if (zigZagStep && zigZagStep.type === "zig-zag") {
      expect(zigZagStep.nodeId).toBe("node-3");
      expect(zigZagStep.parentId).toBe("node-2");
      expect(zigZagStep.grandparentId).toBe("node-1");
      expect(zigZagStep.directions).toEqual(["left", "right"]);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Splay Tree Properties Tests
// ─────────────────────────────────────────────────────────────────────────────

describe("splay tree properties", () => {
  it("splay-start is always followed by rotation steps when not at root", () => {
    const context: TreeContext = { treeState: simpleTree() };
    const steps = collectSteps(splaySearch(context, 25));

    const splayStartIndex = steps.findIndex((s) => s.type === "splay-start");
    expect(splayStartIndex).toBeGreaterThanOrEqual(0);

    // There should be at least one rotation after splay-start
    const rotationAfterStart = steps
      .slice(splayStartIndex + 1)
      .some((s) => s.type === "zig" || s.type === "zig-zig" || s.type === "zig-zag");
    expect(rotationAfterStart).toBe(true);
  });

  it("compare steps precede splay-start in search operations", () => {
    const context: TreeContext = { treeState: simpleTree() };
    const steps = collectSteps(splaySearch(context, 25));

    const splayStartIndex = steps.findIndex((s) => s.type === "splay-start");
    const compareSteps = steps.slice(0, splayStartIndex).filter((s) => s.type === "compare");

    expect(compareSteps.length).toBeGreaterThan(0);
  });

  it("multiple rotations possible for deep nodes", () => {
    // Create a deeper tree
    const deepTree: TreeState = {
      rootId: "node-1",
      nodes: {
        "node-1": { id: "node-1", value: 50, leftId: "node-2", rightId: null, parentId: null },
        "node-2": { id: "node-2", value: 30, leftId: "node-3", rightId: null, parentId: "node-1" },
        "node-3": { id: "node-3", value: 20, leftId: "node-4", rightId: null, parentId: "node-2" },
        "node-4": { id: "node-4", value: 10, leftId: null, rightId: null, parentId: "node-3" },
      },
    };
    const context: TreeContext = { treeState: deepTree };
    const steps = collectSteps(splaySearch(context, 10));

    // Should have multiple rotation steps to bring node-4 to root
    const rotations = steps.filter(
      (s) => s.type === "zig" || s.type === "zig-zig" || s.type === "zig-zag"
    );
    expect(rotations.length).toBeGreaterThanOrEqual(2);
  });
});
