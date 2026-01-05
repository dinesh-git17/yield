import type { TreeState } from "@/lib/store";
import type { TreeContext, TreeStep } from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// Heap Helper Functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Gets all nodes in level-order (BFS order), which represents array indices.
 * For a complete binary tree (heap), this gives the logical array positions.
 */
export function getNodesInLevelOrder(treeState: TreeState): string[] {
  if (treeState.rootId === null) return [];

  const result: string[] = [];
  const queue: string[] = [treeState.rootId];

  while (queue.length > 0) {
    const nodeId = queue.shift();
    if (!nodeId) continue;

    const node = treeState.nodes[nodeId];
    if (!node) continue;

    result.push(nodeId);

    // Add children in order (left first, then right)
    if (node.leftId) queue.push(node.leftId);
    if (node.rightId) queue.push(node.rightId);
  }

  return result;
}

/**
 * Gets the parent node ID given a child's index in level-order.
 * Parent index = floor((childIndex - 1) / 2)
 */
export function getParentByIndex(
  nodesInOrder: string[],
  childIndex: number
): { parentId: string; isLeftChild: boolean } | null {
  if (childIndex <= 0) return null;

  const parentIndex = Math.floor((childIndex - 1) / 2);
  const parentId = nodesInOrder[parentIndex];

  if (!parentId) return null;

  // Left child is at 2*i + 1, right is at 2*i + 2
  const isLeftChild = childIndex === 2 * parentIndex + 1;

  return { parentId, isLeftChild };
}

/**
 * Finds the insertion point for a new node in a complete binary tree.
 * Returns the parent node ID and whether to insert as left or right child.
 */
export function findHeapInsertionPoint(
  treeState: TreeState
): { parentId: string; position: "left" | "right" } | null {
  if (treeState.rootId === null) return null;

  // BFS to find first node missing a child (left-to-right, level by level)
  const queue: string[] = [treeState.rootId];

  while (queue.length > 0) {
    const nodeId = queue.shift();
    if (!nodeId) continue;

    const node = treeState.nodes[nodeId];
    if (!node) continue;

    // Found a node missing left child
    if (node.leftId === null) {
      return { parentId: nodeId, position: "left" };
    }

    // Found a node missing right child
    if (node.rightId === null) {
      return { parentId: nodeId, position: "right" };
    }

    // Both children exist, add them to queue
    queue.push(node.leftId);
    queue.push(node.rightId);
  }

  return null;
}

/**
 * Gets the last node in level-order (the rightmost node on the deepest level).
 */
export function getLastNode(treeState: TreeState): string | null {
  const nodesInOrder = getNodesInLevelOrder(treeState);
  return nodesInOrder.length > 0 ? (nodesInOrder[nodesInOrder.length - 1] ?? null) : null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Max Heap Insert Generator
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Max Heap Insert operation implemented as a generator.
 *
 * Algorithm:
 * 1. Insert at the next available position (complete tree property)
 * 2. Bubble up: compare with parent, swap if child > parent
 * 3. Repeat until heap property is restored
 *
 * Visual: An "elevator" effect rising through the tree
 *
 * @param context - The current tree context
 * @param value - The value to insert
 * @yields TreeStep - Insert, bubble-up, and swap operations
 */
export function* heapInsert(
  context: TreeContext,
  value: number
): Generator<TreeStep, void, unknown> {
  const { treeState } = context;

  // Empty tree - insert as root
  if (treeState.rootId === null) {
    yield {
      type: "insert",
      nodeId: "pending",
      value,
      parentId: null,
      position: "root",
    };
    return;
  }

  // Find insertion point (first available slot in level-order)
  const insertionPoint = findHeapInsertionPoint(treeState);
  if (!insertionPoint) {
    // Tree is full at current level, this shouldn't happen with proper limits
    return;
  }

  // Yield insert step
  yield {
    type: "insert",
    nodeId: "pending",
    value,
    parentId: insertionPoint.parentId,
    position: insertionPoint.position,
  };

  // Simulate bubble-up visualization
  // We need to trace the path from insertion point up to root
  // Since the actual node hasn't been created yet, we simulate with parent chain

  // Get nodes in level-order to track indices
  const nodesInOrder = getNodesInLevelOrder(treeState);
  const newNodeIndex = nodesInOrder.length; // New node will be at this index

  // Bubble up: compare with ancestors
  let currentIndex = newNodeIndex;
  const currentValue = value;

  while (currentIndex > 0) {
    const parentInfo = getParentByIndex(nodesInOrder, currentIndex);
    if (!parentInfo) break;

    const parentNode = treeState.nodes[parentInfo.parentId];
    if (!parentNode) break;

    // Yield bubble-up step (comparing with parent)
    const willSwap = currentValue > parentNode.value;
    yield {
      type: "bubble-up",
      nodeId: nodesInOrder[currentIndex] ?? "pending",
      parentId: parentInfo.parentId,
      willSwap,
    };

    if (willSwap) {
      // Yield swap step
      yield {
        type: "swap",
        nodeId1: nodesInOrder[currentIndex] ?? "pending",
        nodeId2: parentInfo.parentId,
      };

      // Move up to parent's position (value has bubbled up)
      const parentIndex = Math.floor((currentIndex - 1) / 2);
      currentIndex = parentIndex;
      // Value stays the same, we're now at parent's position
    } else {
      // Heap property satisfied, stop bubbling
      break;
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Max Heap Extract-Max Generator
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Max Heap Extract-Max (Delete) operation implemented as a generator.
 *
 * Algorithm:
 * 1. Save the root value (max)
 * 2. Move the last node's value to root
 * 3. Remove the last node
 * 4. Sink down: compare parent with children, swap with larger child if needed
 * 5. Repeat until heap property is restored
 *
 * @param context - The current tree context
 * @yields TreeStep - Extract-max, swap, and sink-down operations
 */
export function* heapExtractMax(context: TreeContext): Generator<TreeStep, void, unknown> {
  const { treeState } = context;

  // Empty tree - nothing to extract
  if (treeState.rootId === null) {
    yield {
      type: "not-found",
      value: -1, // No value to find
    };
    return;
  }

  const rootNode = treeState.nodes[treeState.rootId];
  if (!rootNode) return;

  // Yield extract-max step (highlighting root being removed)
  yield {
    type: "extract-max",
    nodeId: treeState.rootId,
    value: rootNode.value,
  };

  // Get nodes in level-order
  const nodesInOrder = getNodesInLevelOrder(treeState);

  // Only one node - just remove root
  if (nodesInOrder.length === 1) {
    yield {
      type: "delete",
      nodeId: treeState.rootId,
      strategy: "leaf",
    };
    return;
  }

  // Get the last node
  const lastNodeId = nodesInOrder[nodesInOrder.length - 1];
  if (!lastNodeId) return;

  const lastNode = treeState.nodes[lastNodeId];
  if (!lastNode) return;

  // Swap root with last node's value (visually)
  yield {
    type: "swap",
    nodeId1: treeState.rootId,
    nodeId2: lastNodeId,
  };

  // Delete the last node (now contains old root value)
  yield {
    type: "delete",
    nodeId: lastNodeId,
    strategy: "leaf",
  };

  // Sink down: the value that was moved to root needs to find its place
  // We simulate sink-down from root position
  const sinkValue = lastNode.value;
  let currentId: string | null = treeState.rootId;

  while (currentId !== null) {
    const current: (typeof treeState.nodes)[string] | undefined = treeState.nodes[currentId];
    if (!current) break;

    const leftId: string | null = current.leftId;
    const rightId: string | null = current.rightId;

    // No children - heap property satisfied
    if (leftId === null && rightId === null) {
      break;
    }

    // Get child values
    const leftNode = leftId ? treeState.nodes[leftId] : null;
    const rightNode = rightId ? treeState.nodes[rightId] : null;

    const leftValue = leftNode?.value ?? Number.NEGATIVE_INFINITY;
    const rightValue = rightNode?.value ?? Number.NEGATIVE_INFINITY;

    // Find larger child
    let largerChildId: string | null = null;
    let largerChildValue: number = Number.NEGATIVE_INFINITY;

    if (leftValue >= rightValue && leftId) {
      largerChildId = leftId;
      largerChildValue = leftValue;
    } else if (rightId) {
      largerChildId = rightId;
      largerChildValue = rightValue;
    }

    if (largerChildId === null) {
      break; // No valid child
    }

    // Collect child IDs for visualization
    const childIds: string[] = [];
    if (leftId) childIds.push(leftId);
    if (rightId) childIds.push(rightId);

    // Check if swap is needed
    const willSwap = sinkValue < largerChildValue;

    yield {
      type: "sink-down",
      nodeId: currentId,
      childIds,
      largerChildId,
      willSwap,
    };

    if (willSwap && largerChildId) {
      yield {
        type: "swap",
        nodeId1: currentId,
        nodeId2: largerChildId,
      };

      // Move to the child position
      currentId = largerChildId;
    } else {
      // Heap property satisfied
      break;
    }
  }
}
