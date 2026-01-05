import type { TreeNode, TreeState } from "@/lib/store";
import type { TreeContext, TreeStep } from "./types";

/**
 * BST Insert operation implemented as a generator.
 * Yields step-by-step operations for visualization.
 *
 * Note: This generator only yields visualization steps.
 * The actual tree mutation should happen in the store after the generator completes.
 *
 * @param context - The current tree context
 * @param value - The value to insert
 * @yields TreeStep - Compare and insert operations
 */
export function* bstInsert(
  context: TreeContext,
  value: number
): Generator<TreeStep, void, unknown> {
  const { treeState } = context;

  // Empty tree - insert as root
  if (treeState.rootId === null) {
    yield {
      type: "insert",
      nodeId: "pending", // Will be assigned by store
      value,
      parentId: null,
      position: "root",
    };
    return;
  }

  // Traverse to find insertion point
  let currentId: string | null = treeState.rootId;
  let parentId: string | null = null;
  let position: "left" | "right" = "left";

  while (currentId !== null) {
    const current: TreeNode | undefined = treeState.nodes[currentId];
    if (!current) break;

    // Yield compare step
    if (value < current.value) {
      yield {
        type: "compare",
        nodeId: currentId,
        targetValue: value,
        result: "left",
      };
      parentId = currentId;
      position = "left";
      currentId = current.leftId;
    } else if (value > current.value) {
      yield {
        type: "compare",
        nodeId: currentId,
        targetValue: value,
        result: "right",
      };
      parentId = currentId;
      position = "right";
      currentId = current.rightId;
    } else {
      // Duplicate value - yield compare with equal result and stop
      yield {
        type: "compare",
        nodeId: currentId,
        targetValue: value,
        result: "equal",
      };
      yield {
        type: "found",
        nodeId: currentId,
      };
      return;
    }
  }

  // Found insertion point
  yield {
    type: "insert",
    nodeId: "pending",
    value,
    parentId,
    position,
  };
}

/**
 * BST Search operation implemented as a generator.
 * Yields step-by-step operations for visualization.
 *
 * @param context - The current tree context
 * @param value - The value to search for
 * @yields TreeStep - Compare, found, or not-found operations
 */
export function* bstSearch(
  context: TreeContext,
  value: number
): Generator<TreeStep, void, unknown> {
  const { treeState } = context;

  // Empty tree
  if (treeState.rootId === null) {
    yield {
      type: "not-found",
      value,
    };
    return;
  }

  // Traverse to find value
  let currentId: string | null = treeState.rootId;

  while (currentId !== null) {
    const current: TreeNode | undefined = treeState.nodes[currentId];
    if (!current) break;

    if (value < current.value) {
      yield {
        type: "compare",
        nodeId: currentId,
        targetValue: value,
        result: "left",
      };
      currentId = current.leftId;
    } else if (value > current.value) {
      yield {
        type: "compare",
        nodeId: currentId,
        targetValue: value,
        result: "right",
      };
      currentId = current.rightId;
    } else {
      // Found!
      yield {
        type: "compare",
        nodeId: currentId,
        targetValue: value,
        result: "equal",
      };
      yield {
        type: "found",
        nodeId: currentId,
      };
      return;
    }
  }

  // Not found
  yield {
    type: "not-found",
    value,
  };
}

/**
 * BST Delete operation implemented as a generator.
 * Yields step-by-step operations for visualization.
 *
 * Note: This generator only yields visualization steps.
 * The actual tree mutation should happen in the store after the generator completes.
 *
 * @param context - The current tree context
 * @param value - The value to delete
 * @yields TreeStep - Compare, delete, and related operations
 */
export function* bstDelete(
  context: TreeContext,
  value: number
): Generator<TreeStep, void, unknown> {
  const { treeState } = context;

  // Empty tree
  if (treeState.rootId === null) {
    yield {
      type: "not-found",
      value,
    };
    return;
  }

  // Traverse to find the node to delete
  let currentId: string | null = treeState.rootId;

  while (currentId !== null) {
    const current: TreeNode | undefined = treeState.nodes[currentId];
    if (!current) break;

    if (value < current.value) {
      yield {
        type: "compare",
        nodeId: currentId,
        targetValue: value,
        result: "left",
      };
      currentId = current.leftId;
    } else if (value > current.value) {
      yield {
        type: "compare",
        nodeId: currentId,
        targetValue: value,
        result: "right",
      };
      currentId = current.rightId;
    } else {
      // Found the node to delete
      yield {
        type: "compare",
        nodeId: currentId,
        targetValue: value,
        result: "equal",
      };

      // Determine deletion strategy
      const hasLeft = current.leftId !== null;
      const hasRight = current.rightId !== null;

      if (!hasLeft && !hasRight) {
        // Case 1: Leaf node
        yield {
          type: "delete",
          nodeId: currentId,
          strategy: "leaf",
        };
      } else if (!hasLeft || !hasRight) {
        // Case 2: One child
        yield {
          type: "delete",
          nodeId: currentId,
          strategy: "one-child",
        };
      } else {
        // Case 3: Two children - find in-order successor
        // current.rightId is guaranteed non-null since we're in the two-children branch
        const successorId = findInOrderSuccessor(treeState, current.rightId as string);

        if (successorId) {
          // Visit the successor to highlight it
          yield {
            type: "visit",
            nodeId: successorId,
          };

          yield {
            type: "delete",
            nodeId: currentId,
            strategy: "two-children",
            successorId,
          };
        }
      }
      return;
    }
  }

  // Not found
  yield {
    type: "not-found",
    value,
  };
}

/**
 * Find the in-order successor (leftmost node in right subtree).
 */
function findInOrderSuccessor(treeState: TreeState, startId: string): string | null {
  let currentId: string | null = startId;
  let successorId: string | null = null;

  while (currentId !== null) {
    const current: TreeNode | undefined = treeState.nodes[currentId];
    if (!current) break;

    successorId = currentId;
    currentId = current.leftId;
  }

  return successorId;
}

/**
 * In-Order Traversal (Left → Root → Right).
 * Yields nodes in sorted order for BST.
 *
 * @param context - The current tree context
 * @yields TreeStep - Visit and traverse-output operations
 */
export function* inOrderTraversal(context: TreeContext): Generator<TreeStep, void, unknown> {
  const { treeState } = context;

  if (treeState.rootId === null) return;

  let order = 0;

  function* traverse(nodeId: string): Generator<TreeStep, void, unknown> {
    const node = treeState.nodes[nodeId];
    if (!node) return;

    // Visit left subtree
    if (node.leftId) {
      yield* traverse(node.leftId);
    }

    // Visit current node
    yield { type: "visit", nodeId };
    yield {
      type: "traverse-output",
      nodeId,
      value: node.value,
      order: order++,
    };

    // Visit right subtree
    if (node.rightId) {
      yield* traverse(node.rightId);
    }
  }

  yield* traverse(treeState.rootId);
}

/**
 * Pre-Order Traversal (Root → Left → Right).
 * Useful for copying tree structure.
 *
 * @param context - The current tree context
 * @yields TreeStep - Visit and traverse-output operations
 */
export function* preOrderTraversal(context: TreeContext): Generator<TreeStep, void, unknown> {
  const { treeState } = context;

  if (treeState.rootId === null) return;

  let order = 0;

  function* traverse(nodeId: string): Generator<TreeStep, void, unknown> {
    const node = treeState.nodes[nodeId];
    if (!node) return;

    // Visit current node first
    yield { type: "visit", nodeId };
    yield {
      type: "traverse-output",
      nodeId,
      value: node.value,
      order: order++,
    };

    // Then left subtree
    if (node.leftId) {
      yield* traverse(node.leftId);
    }

    // Then right subtree
    if (node.rightId) {
      yield* traverse(node.rightId);
    }
  }

  yield* traverse(treeState.rootId);
}

/**
 * Post-Order Traversal (Left → Right → Root).
 * Useful for deleting tree structure.
 *
 * @param context - The current tree context
 * @yields TreeStep - Visit and traverse-output operations
 */
export function* postOrderTraversal(context: TreeContext): Generator<TreeStep, void, unknown> {
  const { treeState } = context;

  if (treeState.rootId === null) return;

  let order = 0;

  function* traverse(nodeId: string): Generator<TreeStep, void, unknown> {
    const node = treeState.nodes[nodeId];
    if (!node) return;

    // Visit left subtree first
    if (node.leftId) {
      yield* traverse(node.leftId);
    }

    // Then right subtree
    if (node.rightId) {
      yield* traverse(node.rightId);
    }

    // Visit current node last
    yield { type: "visit", nodeId };
    yield {
      type: "traverse-output",
      nodeId,
      value: node.value,
      order: order++,
    };
  }

  yield* traverse(treeState.rootId);
}

/**
 * Level-Order Traversal (BFS).
 * Visits nodes level by level from top to bottom.
 *
 * @param context - The current tree context
 * @yields TreeStep - Visit and traverse-output operations
 */
export function* levelOrderTraversal(context: TreeContext): Generator<TreeStep, void, unknown> {
  const { treeState } = context;

  if (treeState.rootId === null) return;

  const queue: string[] = [treeState.rootId];
  let order = 0;

  while (queue.length > 0) {
    const nodeId = queue.shift();
    if (!nodeId) continue;

    const node = treeState.nodes[nodeId];
    if (!node) continue;

    yield { type: "visit", nodeId };
    yield {
      type: "traverse-output",
      nodeId,
      value: node.value,
      order: order++,
    };

    // Add children to queue (left first, then right)
    if (node.leftId) {
      queue.push(node.leftId);
    }
    if (node.rightId) {
      queue.push(node.rightId);
    }
  }
}

/**
 * Invert Tree operation implemented as a generator.
 * Recursively swaps left and right children of every node.
 * Uses post-order traversal: children are swapped before moving up.
 *
 * This is the famous "invert a binary tree" interview problem.
 *
 * @param context - The current tree context
 * @yields TreeStep - Visit and invert-swap operations
 */
export function* invertTree(context: TreeContext): Generator<TreeStep, void, unknown> {
  const { treeState } = context;

  if (treeState.rootId === null) return;

  /**
   * Recursive post-order inversion.
   * Visit children first, then swap them.
   */
  function* invert(nodeId: string): Generator<TreeStep, void, unknown> {
    const node = treeState.nodes[nodeId];
    if (!node) return;

    // Visit node first to show we're examining it
    yield { type: "visit", nodeId };

    // Recursively invert left subtree
    if (node.leftId) {
      yield* invert(node.leftId);
    }

    // Recursively invert right subtree
    if (node.rightId) {
      yield* invert(node.rightId);
    }

    // Swap left and right children (yield the swap operation)
    yield {
      type: "invert-swap",
      nodeId,
      leftChildId: node.leftId,
      rightChildId: node.rightId,
    };
  }

  yield* invert(treeState.rootId);
}
