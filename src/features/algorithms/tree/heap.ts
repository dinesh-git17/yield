import type { TreeNode, TreeState } from "@/lib/store";
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
// Max Heap Search Generator (Linear BFS Search)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Max Heap Search operation implemented as a generator.
 *
 * Unlike BST, heaps don't have ordering between siblings, so we must
 * perform a linear search using BFS (level-order traversal).
 *
 * Optimization: We can skip subtrees where the current node's value
 * is less than the target (in a max-heap, children are always smaller).
 *
 * @param context - The current tree context
 * @param value - The value to search for
 * @yields TreeStep - Visit and found/not-found operations
 */
export function* heapSearch(
  context: TreeContext,
  value: number
): Generator<TreeStep, void, unknown> {
  const { treeState } = context;

  if (treeState.rootId === null) {
    yield { type: "not-found", value };
    return;
  }

  // BFS traversal with pruning
  const queue: string[] = [treeState.rootId];

  while (queue.length > 0) {
    const nodeId = queue.shift();
    if (!nodeId) continue;

    const node = treeState.nodes[nodeId];
    if (!node) continue;

    // Visit (compare) this node
    yield { type: "visit", nodeId };

    // Check if found
    if (node.value === value) {
      yield { type: "found", nodeId };
      return;
    }

    // Pruning: in a max-heap, if current node < target, skip children
    // (children will be even smaller)
    if (node.value < value) {
      continue;
    }

    // Add children to queue
    if (node.leftId) queue.push(node.leftId);
    if (node.rightId) queue.push(node.rightId);
  }

  // Value not found
  yield { type: "not-found", value };
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

// ─────────────────────────────────────────────────────────────────────────────
// Floyd's Heapify Generator (Build Heap in O(n))
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Helper: Performs a single sift-down operation on a node.
 * Used internally by floydHeapify to restore heap property at a single node.
 *
 * @param nodes - The current nodes map (mutable reference for value tracking)
 * @param nodeId - ID of the node to sift down
 * @param nodesInOrder - Level-order node IDs for child lookup
 * @param nodeIndex - Index of the node in level-order
 * @yields TreeStep - sink-down and swap operations
 */
function* siftDown(
  nodes: Record<string, TreeNode>,
  nodeId: string,
  nodesInOrder: string[],
  nodeIndex: number
): Generator<TreeStep, Record<string, TreeNode>, unknown> {
  let currentId: string | null = nodeId;
  let currentIndex = nodeIndex;
  let currentNodes = { ...nodes };

  while (currentId !== null) {
    const current = currentNodes[currentId];
    if (!current) break;

    // Calculate child indices in level-order
    const leftChildIndex = 2 * currentIndex + 1;
    const rightChildIndex = 2 * currentIndex + 2;

    const leftId = leftChildIndex < nodesInOrder.length ? nodesInOrder[leftChildIndex] : null;
    const rightId = rightChildIndex < nodesInOrder.length ? nodesInOrder[rightChildIndex] : null;

    // No children - done
    if (leftId === null && rightId === null) {
      break;
    }

    const leftNode = leftId ? currentNodes[leftId] : null;
    const rightNode = rightId ? currentNodes[rightId] : null;

    const leftValue = leftNode?.value ?? Number.NEGATIVE_INFINITY;
    const rightValue = rightNode?.value ?? Number.NEGATIVE_INFINITY;

    // Find larger child
    let largerChildId: string | null = null;
    let largerChildValue: number = Number.NEGATIVE_INFINITY;
    let largerChildIndex = -1;

    if (leftValue >= rightValue && leftId) {
      largerChildId = leftId;
      largerChildValue = leftValue;
      largerChildIndex = leftChildIndex;
    } else if (rightId) {
      largerChildId = rightId;
      largerChildValue = rightValue;
      largerChildIndex = rightChildIndex;
    }

    if (!largerChildId) break;

    // Collect child IDs for visualization
    const childIds: string[] = [];
    if (leftId) childIds.push(leftId);
    if (rightId) childIds.push(rightId);

    // Check if swap is needed
    const willSwap = current.value < largerChildValue;

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

      // Swap values in our local copy
      const largerChild = currentNodes[largerChildId];
      if (largerChild) {
        currentNodes = {
          ...currentNodes,
          [currentId]: { ...current, value: largerChildValue },
          [largerChildId]: { ...largerChild, value: current.value },
        };
      }

      // Move to the child position
      currentId = largerChildId;
      currentIndex = largerChildIndex;
    } else {
      // Heap property satisfied
      break;
    }
  }

  return currentNodes;
}

/**
 * Floyd's Heap Construction algorithm implemented as a generator.
 *
 * Builds a valid max-heap from an arbitrary binary tree in O(n) time.
 * Works by starting at the last non-leaf node and sifting down each
 * node in reverse level-order up to the root.
 *
 * The key insight: leaf nodes are already valid heaps (trivially),
 * so we only need to fix internal nodes. By processing bottom-up,
 * each sift-down operation maintains the heap property of its subtree.
 *
 * Visual: Watch the "heap property" spread like an infection from
 * the bottom leaves up to the root.
 *
 * @param context - The current tree context
 * @yields TreeStep - heapify-node, sink-down, and swap operations
 */
export function* floydHeapify(context: TreeContext): Generator<TreeStep, void, unknown> {
  const { treeState } = context;

  if (treeState.rootId === null) {
    return;
  }

  // Get nodes in level-order (array representation of complete binary tree)
  const nodesInOrder = getNodesInLevelOrder(treeState);
  const n = nodesInOrder.length;

  if (n <= 1) {
    // Single node or empty - already a valid heap
    return;
  }

  // Calculate the last non-leaf index
  // In a complete binary tree represented as array:
  // - Leaf nodes are at indices floor(n/2) to n-1
  // - Non-leaf nodes are at indices 0 to floor(n/2) - 1
  const lastNonLeafIndex = Math.floor(n / 2) - 1;
  const totalNonLeaf = lastNonLeafIndex + 1;

  // Start with a copy of the nodes for value tracking during swaps
  let currentNodes = { ...treeState.nodes };

  // Process each non-leaf node from bottom to top (reverse level-order)
  for (let i = lastNonLeafIndex; i >= 0; i--) {
    const nodeId = nodesInOrder[i];
    if (!nodeId) continue;

    // Yield heapify-node step to show which node is being processed
    yield {
      type: "heapify-node",
      nodeId,
      index: lastNonLeafIndex - i, // Progress counter (0, 1, 2, ...)
      totalNonLeaf,
    };

    // Perform sift-down on this node
    const siftDownGen = siftDown(currentNodes, nodeId, nodesInOrder, i);
    let siftResult = siftDownGen.next();

    while (!siftResult.done) {
      yield siftResult.value;
      siftResult = siftDownGen.next();
    }

    // Update our nodes copy with the result of sift-down
    currentNodes = siftResult.value;
  }
}
