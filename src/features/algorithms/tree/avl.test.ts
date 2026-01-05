import { describe, expect, it } from "vitest";
import type { TreeNode, TreeState } from "@/lib/store";
import { avlDelete, avlInsert, avlSearch } from "./avl";
import type { TreeContext, TreeStep } from "./types";

/**
 * Creates an empty tree state.
 */
function emptyTree(): TreeState {
  return { rootId: null, nodes: {} };
}

/**
 * Helper to build a tree from an array of values (BST insert order).
 */
function buildTree(values: number[]): TreeState {
  const nodes: Record<string, TreeNode> = {};
  let rootId: string | null = null;
  let nodeCounter = 0;

  for (const value of values) {
    const newId = `test-node-${++nodeCounter}`;
    const newNode: TreeNode = {
      id: newId,
      value,
      leftId: null,
      rightId: null,
      parentId: null,
      height: 1,
    };

    if (rootId === null) {
      rootId = newId;
      nodes[newId] = newNode;
      continue;
    }

    // BST insert
    let currentId: string | null = rootId;
    while (currentId !== null) {
      const current: TreeNode | undefined = nodes[currentId];
      if (!current) break;

      if (value < current.value) {
        if (current.leftId === null) {
          newNode.parentId = currentId;
          nodes[newId] = newNode;
          nodes[currentId] = { ...current, leftId: newId };
          break;
        }
        currentId = current.leftId;
      } else {
        if (current.rightId === null) {
          newNode.parentId = currentId;
          nodes[newId] = newNode;
          nodes[currentId] = { ...current, rightId: newId };
          break;
        }
        currentId = current.rightId;
      }
    }

    // Update heights
    updateHeights(nodes, rootId);
  }

  return { rootId, nodes };
}

/**
 * Updates heights for all nodes in the tree.
 */
function updateHeights(nodes: Record<string, TreeNode>, nodeId: string | null): number {
  if (nodeId === null) return 0;
  const node = nodes[nodeId];
  if (!node) return 0;

  const leftHeight = updateHeights(nodes, node.leftId);
  const rightHeight = updateHeights(nodes, node.rightId);
  const height = Math.max(leftHeight, rightHeight) + 1;

  nodes[nodeId] = { ...node, height };
  return height;
}

/**
 * Collects all steps from a generator.
 */
function collectSteps(gen: Generator<TreeStep, void, unknown>): TreeStep[] {
  const steps: TreeStep[] = [];
  let result = gen.next();
  while (!result.done) {
    steps.push(result.value);
    result = gen.next();
  }
  return steps;
}

/**
 * Checks if a step of a certain type exists.
 */
function hasStepType(steps: TreeStep[], type: TreeStep["type"]): boolean {
  return steps.some((step) => step.type === type);
}

/**
 * Gets all steps of a certain type.
 */
function getStepsByType<T extends TreeStep["type"]>(
  steps: TreeStep[],
  type: T
): Extract<TreeStep, { type: T }>[] {
  return steps.filter((step) => step.type === type) as Extract<TreeStep, { type: T }>[];
}

describe("AVL Insert Generator", () => {
  describe("basic insertions", () => {
    it("yields insert step for empty tree", () => {
      const context: TreeContext = { treeState: emptyTree() };
      const steps = collectSteps(avlInsert(context, 50));

      expect(steps).toHaveLength(1);
      expect(steps[0]).toMatchObject({
        type: "insert",
        value: 50,
        position: "root",
      });
    });

    it("yields compare steps when traversing to insertion point", () => {
      const treeState = buildTree([50]);
      const context: TreeContext = { treeState };
      const steps = collectSteps(avlInsert(context, 25));

      expect(hasStepType(steps, "compare")).toBe(true);
      expect(hasStepType(steps, "insert")).toBe(true);
    });

    it("yields found step for duplicate values", () => {
      const treeState = buildTree([50, 25, 75]);
      const context: TreeContext = { treeState };
      const steps = collectSteps(avlInsert(context, 50));

      expect(hasStepType(steps, "found")).toBe(true);
      expect(hasStepType(steps, "insert")).toBe(false);
    });

    it("yields update-height steps after insertion", () => {
      const treeState = buildTree([50, 25]);
      const context: TreeContext = { treeState };
      const steps = collectSteps(avlInsert(context, 10));

      expect(hasStepType(steps, "update-height")).toBe(true);
    });
  });

  describe("LL rotation (right rotation)", () => {
    it("detects imbalance and yields rotation for LL case", () => {
      // Tree: 30 -> 20 -> 10 (left-left imbalance)
      const treeState = buildTree([30, 20]);
      const context: TreeContext = { treeState };
      const steps = collectSteps(avlInsert(context, 10));

      expect(hasStepType(steps, "unbalanced")).toBe(true);
      expect(hasStepType(steps, "rotate")).toBe(true);

      const rotateSteps = getStepsByType(steps, "rotate");
      expect(rotateSteps[0]?.rotationType).toBe("LL");
    });
  });

  describe("RR rotation (left rotation)", () => {
    it("detects imbalance and yields rotation for RR case", () => {
      // Tree: 10 -> 20 -> 30 (right-right imbalance)
      const treeState = buildTree([10, 20]);
      const context: TreeContext = { treeState };
      const steps = collectSteps(avlInsert(context, 30));

      expect(hasStepType(steps, "unbalanced")).toBe(true);
      expect(hasStepType(steps, "rotate")).toBe(true);

      const rotateSteps = getStepsByType(steps, "rotate");
      expect(rotateSteps[0]?.rotationType).toBe("RR");
    });
  });

  describe("LR rotation (left-right double rotation)", () => {
    it("detects imbalance and yields rotation for LR case", () => {
      // Tree: 30 -> 10 -> 20 (left-right imbalance)
      const treeState = buildTree([30, 10]);
      const context: TreeContext = { treeState };
      const steps = collectSteps(avlInsert(context, 20));

      expect(hasStepType(steps, "unbalanced")).toBe(true);
      expect(hasStepType(steps, "rotate")).toBe(true);

      const rotateSteps = getStepsByType(steps, "rotate");
      expect(rotateSteps[0]?.rotationType).toBe("LR");
    });
  });

  describe("RL rotation (right-left double rotation)", () => {
    it("detects imbalance and yields rotation for RL case", () => {
      // Tree: 10 -> 30 -> 20 (right-left imbalance)
      const treeState = buildTree([10, 30]);
      const context: TreeContext = { treeState };
      const steps = collectSteps(avlInsert(context, 20));

      expect(hasStepType(steps, "unbalanced")).toBe(true);
      expect(hasStepType(steps, "rotate")).toBe(true);

      const rotateSteps = getStepsByType(steps, "rotate");
      expect(rotateSteps[0]?.rotationType).toBe("RL");
    });
  });

  describe("balanced tree insertions", () => {
    it("does not yield unbalanced or rotate for already balanced insertions", () => {
      // Building a balanced tree: 50, 25, 75
      const treeState = buildTree([50, 25]);
      const context: TreeContext = { treeState };
      const steps = collectSteps(avlInsert(context, 75));

      expect(hasStepType(steps, "unbalanced")).toBe(false);
      expect(hasStepType(steps, "rotate")).toBe(false);
    });
  });
});

describe("AVL Search Generator", () => {
  it("yields not-found for empty tree", () => {
    const context: TreeContext = { treeState: emptyTree() };
    const steps = collectSteps(avlSearch(context, 50));

    expect(steps).toHaveLength(1);
    expect(steps[0]).toMatchObject({
      type: "not-found",
      value: 50,
    });
  });

  it("finds value at root", () => {
    const treeState = buildTree([50]);
    const context: TreeContext = { treeState };
    const steps = collectSteps(avlSearch(context, 50));

    expect(hasStepType(steps, "compare")).toBe(true);
    expect(hasStepType(steps, "found")).toBe(true);
  });

  it("finds value in left subtree", () => {
    const treeState = buildTree([50, 25, 75]);
    const context: TreeContext = { treeState };
    const steps = collectSteps(avlSearch(context, 25));

    const compareSteps = getStepsByType(steps, "compare");
    expect(compareSteps.some((s) => s.result === "left")).toBe(true);
    expect(hasStepType(steps, "found")).toBe(true);
  });

  it("finds value in right subtree", () => {
    const treeState = buildTree([50, 25, 75]);
    const context: TreeContext = { treeState };
    const steps = collectSteps(avlSearch(context, 75));

    const compareSteps = getStepsByType(steps, "compare");
    expect(compareSteps.some((s) => s.result === "right")).toBe(true);
    expect(hasStepType(steps, "found")).toBe(true);
  });

  it("yields not-found for non-existent value", () => {
    const treeState = buildTree([50, 25, 75]);
    const context: TreeContext = { treeState };
    const steps = collectSteps(avlSearch(context, 100));

    expect(hasStepType(steps, "not-found")).toBe(true);
    expect(hasStepType(steps, "found")).toBe(false);
  });
});

describe("AVL Delete Generator", () => {
  it("yields not-found for empty tree", () => {
    const context: TreeContext = { treeState: emptyTree() };
    const steps = collectSteps(avlDelete(context, 50));

    expect(steps).toHaveLength(1);
    expect(steps[0]).toMatchObject({
      type: "not-found",
      value: 50,
    });
  });

  it("yields not-found for non-existent value", () => {
    const treeState = buildTree([50, 25, 75]);
    const context: TreeContext = { treeState };
    const steps = collectSteps(avlDelete(context, 100));

    expect(hasStepType(steps, "not-found")).toBe(true);
  });

  describe("leaf node deletion", () => {
    it("yields delete step with leaf strategy", () => {
      const treeState = buildTree([50, 25, 75]);
      const context: TreeContext = { treeState };
      const steps = collectSteps(avlDelete(context, 25));

      const deleteSteps = getStepsByType(steps, "delete");
      expect(deleteSteps).toHaveLength(1);
      expect(deleteSteps[0]?.strategy).toBe("leaf");
    });
  });

  describe("one-child deletion", () => {
    it("yields delete step with one-child strategy", () => {
      const treeState = buildTree([50, 25, 75, 60]);
      const context: TreeContext = { treeState };
      const steps = collectSteps(avlDelete(context, 75));

      const deleteSteps = getStepsByType(steps, "delete");
      expect(deleteSteps).toHaveLength(1);
      expect(deleteSteps[0]?.strategy).toBe("one-child");
    });
  });

  describe("two-children deletion", () => {
    it("yields visit step for successor and delete with two-children strategy", () => {
      const treeState = buildTree([50, 25, 75, 60, 90]);
      const context: TreeContext = { treeState };
      const steps = collectSteps(avlDelete(context, 75));

      expect(hasStepType(steps, "visit")).toBe(true);
      const deleteSteps = getStepsByType(steps, "delete");
      expect(deleteSteps[0]?.strategy).toBe("two-children");
    });
  });

  describe("rebalancing after delete", () => {
    it("may yield multiple rotation steps for complex deletions", () => {
      // Build a tree that will become unbalanced after deletion
      // This is a simplified test - complex deletion scenarios would need more setup
      const treeState = buildTree([50, 25, 75, 10, 30, 60, 90, 5]);
      const context: TreeContext = { treeState };
      const steps = collectSteps(avlDelete(context, 90));

      // After deleting 90, tree might need rebalancing
      expect(hasStepType(steps, "update-height")).toBe(true);
    });
  });
});

describe("AVL rotation visualization", () => {
  it("rotation step includes pivot and new root IDs", () => {
    const treeState = buildTree([30, 20]);
    const context: TreeContext = { treeState };
    const steps = collectSteps(avlInsert(context, 10));

    const rotateSteps = getStepsByType(steps, "rotate");
    expect(rotateSteps).toHaveLength(1);

    const rotateStep = rotateSteps[0];
    expect(rotateStep?.pivotId).toBeDefined();
    expect(rotateStep?.newRootId).toBeDefined();
    expect(rotateStep?.pivotId).not.toBe(rotateStep?.newRootId);
  });

  it("unbalanced step includes balance factor", () => {
    const treeState = buildTree([30, 20]);
    const context: TreeContext = { treeState };
    const steps = collectSteps(avlInsert(context, 10));

    const unbalancedSteps = getStepsByType(steps, "unbalanced");
    expect(unbalancedSteps).toHaveLength(1);
    expect(Math.abs(unbalancedSteps[0]?.balanceFactor ?? 0)).toBeGreaterThan(1);
  });
});
