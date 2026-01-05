import type { TreeNode } from "@/lib/store";
import type { AVLRotationType, TreeContext, TreeStep } from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// AVL Tree Helper Functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Gets the height of a node. Returns 0 for null nodes.
 * Height is stored on the node during AVL operations.
 */
function getHeight(nodes: Record<string, TreeNode>, nodeId: string | null): number {
  if (nodeId === null) return 0;
  const node = nodes[nodeId];
  return node?.height ?? 1;
}

/**
 * Calculates the balance factor of a node.
 * Balance factor = height(left subtree) - height(right subtree)
 * A balanced AVL tree has balance factor in [-1, 0, 1]
 */
function getBalanceFactor(nodes: Record<string, TreeNode>, nodeId: string): number {
  const node = nodes[nodeId];
  if (!node) return 0;
  return getHeight(nodes, node.leftId) - getHeight(nodes, node.rightId);
}

/**
 * Updates the height of a node based on its children.
 */
function updateHeight(nodes: Record<string, TreeNode>, nodeId: string): number {
  const node = nodes[nodeId];
  if (!node) return 0;
  const newHeight = Math.max(getHeight(nodes, node.leftId), getHeight(nodes, node.rightId)) + 1;
  return newHeight;
}

/**
 * Determines the rotation type needed based on balance factor and child balance.
 * Returns the rotation type and the IDs of the pivot (moving down) and new root (moving up).
 */
function determineRotationType(
  nodes: Record<string, TreeNode>,
  nodeId: string,
  balanceFactor: number
): { rotationType: AVLRotationType; pivotId: string; newRootId: string } | null {
  const node = nodes[nodeId];
  if (!node) return null;

  if (balanceFactor > 1) {
    // Left-heavy: either LL or LR case
    const leftChild = node.leftId ? nodes[node.leftId] : null;
    if (!leftChild || !node.leftId) return null;

    const leftBalanceFactor = getBalanceFactor(nodes, node.leftId);

    if (leftBalanceFactor >= 0) {
      // LL case: Left child is left-heavy or balanced
      // Single right rotation - left child becomes new root
      return {
        rotationType: "LL",
        pivotId: nodeId,
        newRootId: node.leftId,
      };
    }
    // LR case: Left child is right-heavy
    // Double rotation - left rotation on left child, then right rotation on node
    const newRootId = leftChild.rightId;
    if (!newRootId) return null;
    return {
      rotationType: "LR",
      pivotId: nodeId,
      newRootId,
    };
  }

  if (balanceFactor < -1) {
    // Right-heavy: either RR or RL case
    const rightChild = node.rightId ? nodes[node.rightId] : null;
    if (!rightChild || !node.rightId) return null;

    const rightBalanceFactor = getBalanceFactor(nodes, node.rightId);

    if (rightBalanceFactor <= 0) {
      // RR case: Right child is right-heavy or balanced
      // Single left rotation - right child becomes new root
      return {
        rotationType: "RR",
        pivotId: nodeId,
        newRootId: node.rightId,
      };
    }
    // RL case: Right child is left-heavy
    // Double rotation - right rotation on right child, then left rotation on node
    const newRootId = rightChild.leftId;
    if (!newRootId) return null;
    return {
      rotationType: "RL",
      pivotId: nodeId,
      newRootId,
    };
  }

  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// AVL Rotation Implementations
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Performs a right rotation (for LL case).
 *
 *        z                y
 *       / \              / \
 *      y   T4    →      x   z
 *     / \              /   / \
 *    x   T3           T1  T3  T4
 *   / \
 *  T1  T2
 *
 * @returns Updated nodes map with the rotation applied
 */
function rotateRight(
  nodes: Record<string, TreeNode>,
  zId: string
): { nodes: Record<string, TreeNode>; newRootId: string } {
  const z = nodes[zId];
  if (!z || !z.leftId) return { nodes, newRootId: zId };

  const yId = z.leftId;
  const y = nodes[yId];
  if (!y) return { nodes, newRootId: zId };

  const t3Id = y.rightId;

  // Create updated nodes
  const updatedNodes = { ...nodes };

  // y becomes the new root of this subtree
  updatedNodes[yId] = {
    ...y,
    rightId: zId,
    parentId: z.parentId,
  };

  // z becomes right child of y
  updatedNodes[zId] = {
    ...z,
    leftId: t3Id,
    parentId: yId,
  };

  // T3's parent changes to z (if T3 exists)
  if (t3Id) {
    const t3 = updatedNodes[t3Id];
    if (t3) {
      updatedNodes[t3Id] = { ...t3, parentId: zId };
    }
  }

  // Update parent's child reference (if parent exists)
  if (z.parentId) {
    const parent = updatedNodes[z.parentId];
    if (parent) {
      if (parent.leftId === zId) {
        updatedNodes[z.parentId] = { ...parent, leftId: yId };
      } else {
        updatedNodes[z.parentId] = { ...parent, rightId: yId };
      }
    }
  }

  // Update heights (bottom-up)
  updatedNodes[zId] = {
    ...updatedNodes[zId],
    height: updateHeight(updatedNodes, zId),
  } as TreeNode;
  updatedNodes[yId] = {
    ...updatedNodes[yId],
    height: updateHeight(updatedNodes, yId),
  } as TreeNode;

  return { nodes: updatedNodes, newRootId: yId };
}

/**
 * Performs a left rotation (for RR case).
 *
 *      z                  y
 *     / \                / \
 *    T1  y      →       z   x
 *       / \            / \   \
 *      T2  x          T1  T2  T3
 *           \
 *           T3
 *
 * @returns Updated nodes map with the rotation applied
 */
function rotateLeft(
  nodes: Record<string, TreeNode>,
  zId: string
): { nodes: Record<string, TreeNode>; newRootId: string } {
  const z = nodes[zId];
  if (!z || !z.rightId) return { nodes, newRootId: zId };

  const yId = z.rightId;
  const y = nodes[yId];
  if (!y) return { nodes, newRootId: zId };

  const t2Id = y.leftId;

  // Create updated nodes
  const updatedNodes = { ...nodes };

  // y becomes the new root of this subtree
  updatedNodes[yId] = {
    ...y,
    leftId: zId,
    parentId: z.parentId,
  };

  // z becomes left child of y
  updatedNodes[zId] = {
    ...z,
    rightId: t2Id,
    parentId: yId,
  };

  // T2's parent changes to z (if T2 exists)
  if (t2Id) {
    const t2 = updatedNodes[t2Id];
    if (t2) {
      updatedNodes[t2Id] = { ...t2, parentId: zId };
    }
  }

  // Update parent's child reference (if parent exists)
  if (z.parentId) {
    const parent = updatedNodes[z.parentId];
    if (parent) {
      if (parent.leftId === zId) {
        updatedNodes[z.parentId] = { ...parent, leftId: yId };
      } else {
        updatedNodes[z.parentId] = { ...parent, rightId: yId };
      }
    }
  }

  // Update heights (bottom-up)
  updatedNodes[zId] = {
    ...updatedNodes[zId],
    height: updateHeight(updatedNodes, zId),
  } as TreeNode;
  updatedNodes[yId] = {
    ...updatedNodes[yId],
    height: updateHeight(updatedNodes, yId),
  } as TreeNode;

  return { nodes: updatedNodes, newRootId: yId };
}

// ─────────────────────────────────────────────────────────────────────────────
// AVL Insert Generator
// ─────────────────────────────────────────────────────────────────────────────

/**
 * AVL Insert operation implemented as a generator.
 *
 * Algorithm:
 * 1. Standard BST insert, tracking the path from root to insertion point
 * 2. Unwind the path, checking balance at each node
 * 3. If unbalanced (|balance factor| > 1), perform appropriate rotation
 * 4. Continue up to update heights
 *
 * Visual: Shows the descent path, insertion, balance checking, and rotation
 *
 * @param context - The current tree context
 * @param value - The value to insert
 * @yields TreeStep - Compare, insert, unbalanced, rotate, and update-height operations
 */
export function* avlInsert(
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

  // Create a mutable copy for simulation
  let nodes = { ...treeState.nodes };

  // Track the path from root to insertion point for unwinding
  const path: string[] = [];

  // Traverse to find insertion point (standard BST insert)
  let currentId: string | null = treeState.rootId;
  let parentId: string | null = null;
  let position: "left" | "right" = "left";

  while (currentId !== null) {
    const current: TreeNode | undefined = nodes[currentId];
    if (!current) break;

    path.push(currentId);

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
      // Duplicate value - show found and exit
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

  // Yield insert step
  const newNodeId = `pending-${value}`;
  yield {
    type: "insert",
    nodeId: newNodeId,
    value,
    parentId,
    position,
  };

  // Simulate the insertion in our copy
  const newNode: TreeNode = {
    id: newNodeId,
    value,
    leftId: null,
    rightId: null,
    parentId,
    height: 1,
  };
  nodes[newNodeId] = newNode;

  // Update parent's child pointer
  if (parentId) {
    const parent = nodes[parentId];
    if (parent) {
      if (position === "left") {
        nodes[parentId] = { ...parent, leftId: newNodeId };
      } else {
        nodes[parentId] = { ...parent, rightId: newNodeId };
      }
    }
  }

  // Unwind the path, checking and fixing balance
  // Process from insertion point up to root
  for (let i = path.length - 1; i >= 0; i--) {
    const nodeId = path[i];
    if (!nodeId) continue;

    // Update height first
    const newHeight = updateHeight(nodes, nodeId);
    const node = nodes[nodeId];
    if (node) {
      nodes[nodeId] = { ...node, height: newHeight };

      yield {
        type: "update-height",
        nodeId,
        newHeight,
      };
    }

    // Check balance factor
    const balanceFactor = getBalanceFactor(nodes, nodeId);

    // If unbalanced, show it and perform rotation
    if (Math.abs(balanceFactor) > 1) {
      yield {
        type: "unbalanced",
        nodeId,
        balanceFactor,
      };

      // Determine and perform rotation
      const rotationInfo = determineRotationType(nodes, nodeId, balanceFactor);

      if (rotationInfo) {
        yield {
          type: "rotate",
          rotationType: rotationInfo.rotationType,
          pivotId: rotationInfo.pivotId,
          newRootId: rotationInfo.newRootId,
        };

        // Apply the rotation(s) to our simulation
        if (rotationInfo.rotationType === "LL") {
          // Single right rotation
          const result = rotateRight(nodes, nodeId);
          nodes = result.nodes;
        } else if (rotationInfo.rotationType === "RR") {
          // Single left rotation
          const result = rotateLeft(nodes, nodeId);
          nodes = result.nodes;
        } else if (rotationInfo.rotationType === "LR") {
          // Left-Right case: first rotate left on left child, then rotate right on node
          const node = nodes[nodeId];
          if (node?.leftId) {
            const result1 = rotateLeft(nodes, node.leftId);
            nodes = result1.nodes;
            const result2 = rotateRight(nodes, nodeId);
            nodes = result2.nodes;
          }
        } else if (rotationInfo.rotationType === "RL") {
          // Right-Left case: first rotate right on right child, then rotate left on node
          const node = nodes[nodeId];
          if (node?.rightId) {
            const result1 = rotateRight(nodes, node.rightId);
            nodes = result1.nodes;
            const result2 = rotateLeft(nodes, nodeId);
            nodes = result2.nodes;
          }
        }

        // After rotation, the tree is balanced at this level
        // We could continue up, but typically in AVL insert, one rotation fixes the tree
        break;
      }
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// AVL Search Generator (Same as BST)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * AVL Search operation - identical to BST search.
 * AVL is a BST with height balancing, so search works the same way.
 *
 * @param context - The current tree context
 * @param value - The value to search for
 * @yields TreeStep - Compare, found, or not-found operations
 */
export function* avlSearch(
  context: TreeContext,
  value: number
): Generator<TreeStep, void, unknown> {
  const { treeState } = context;

  if (treeState.rootId === null) {
    yield { type: "not-found", value };
    return;
  }

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
      yield {
        type: "compare",
        nodeId: currentId,
        targetValue: value,
        result: "equal",
      };
      yield { type: "found", nodeId: currentId };
      return;
    }
  }

  yield { type: "not-found", value };
}

// ─────────────────────────────────────────────────────────────────────────────
// AVL Delete Generator
// ─────────────────────────────────────────────────────────────────────────────

/**
 * AVL Delete operation implemented as a generator.
 *
 * Algorithm:
 * 1. Standard BST delete to find and remove the node
 * 2. Track the path from root to the deleted node
 * 3. Unwind the path, checking balance at each node
 * 4. Unlike insert, delete may require multiple rotations up the tree
 *
 * @param context - The current tree context
 * @param value - The value to delete
 * @yields TreeStep - Compare, delete, unbalanced, rotate, and update-height operations
 */
export function* avlDelete(
  context: TreeContext,
  value: number
): Generator<TreeStep, void, unknown> {
  const { treeState } = context;

  if (treeState.rootId === null) {
    yield { type: "not-found", value };
    return;
  }

  // Create a mutable copy for simulation
  let nodes = { ...treeState.nodes };
  let rootId: string | null = treeState.rootId;

  // Track path for unwinding
  const path: string[] = [];

  // Find the node to delete
  let currentId: string | null = rootId;
  let targetId: string | null = null;

  while (currentId !== null) {
    const current: TreeNode | undefined = nodes[currentId];
    if (!current) break;

    path.push(currentId);

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
      yield {
        type: "compare",
        nodeId: currentId,
        targetValue: value,
        result: "equal",
      };
      targetId = currentId;
      break;
    }
  }

  if (!targetId) {
    yield { type: "not-found", value };
    return;
  }

  const target: TreeNode | undefined = nodes[targetId];
  if (!target) return;

  // Determine deletion strategy
  const hasLeft = target.leftId !== null;
  const hasRight = target.rightId !== null;

  if (!hasLeft && !hasRight) {
    // Case 1: Leaf node
    yield {
      type: "delete",
      nodeId: targetId,
      strategy: "leaf",
    };

    // Update parent
    if (target.parentId) {
      const parent = nodes[target.parentId];
      if (parent) {
        if (parent.leftId === targetId) {
          nodes[target.parentId] = { ...parent, leftId: null };
        } else {
          nodes[target.parentId] = { ...parent, rightId: null };
        }
      }
    } else {
      // Deleting root leaf
      rootId = null;
    }
    delete nodes[targetId];
  } else if (!hasLeft || !hasRight) {
    // Case 2: One child
    yield {
      type: "delete",
      nodeId: targetId,
      strategy: "one-child",
    };

    // Safe: XOR condition guarantees non-null
    const childId = (target.leftId ?? target.rightId) as string;
    const child = nodes[childId];

    if (target.parentId) {
      const parent = nodes[target.parentId];
      if (parent && child) {
        if (parent.leftId === targetId) {
          nodes[target.parentId] = { ...parent, leftId: childId };
        } else {
          nodes[target.parentId] = { ...parent, rightId: childId };
        }
        nodes[childId] = { ...child, parentId: target.parentId };
      }
    } else {
      // Deleting root with one child
      rootId = childId;
      if (child) {
        nodes[childId] = { ...child, parentId: null };
      }
    }
    delete nodes[targetId];
  } else {
    // Case 3: Two children - find in-order successor
    // target.rightId is guaranteed non-null since we're in the two-children branch
    let successorId: string = target.rightId as string;
    let successor: TreeNode | undefined = nodes[successorId];

    // Add path to successor
    const successorPath: string[] = [];

    while (successor?.leftId) {
      successorPath.push(successorId);
      successorId = successor.leftId;
      successor = nodes[successorId];
    }

    if (successor) {
      yield { type: "visit", nodeId: successorId };

      yield {
        type: "delete",
        nodeId: targetId,
        strategy: "two-children",
        successorId,
      };

      // Replace target's value with successor's value
      nodes[targetId] = { ...target, value: successor.value };

      // Remove successor (has at most one right child)
      const successorParentId = successor.parentId;
      if (successorParentId) {
        const successorParent = nodes[successorParentId];
        if (successorParent) {
          if (successorParent.leftId === successorId) {
            nodes[successorParentId] = { ...successorParent, leftId: successor.rightId };
          } else {
            nodes[successorParentId] = { ...successorParent, rightId: successor.rightId };
          }
        }
      }

      if (successor.rightId) {
        const successorChild = nodes[successor.rightId];
        if (successorChild) {
          nodes[successor.rightId] = { ...successorChild, parentId: successorParentId };
        }
      }

      delete nodes[successorId];

      // Add successor path to main path for rebalancing
      path.push(...successorPath);
    }
  }

  // Unwind path and rebalance (delete may need multiple rotations)
  for (let i = path.length - 1; i >= 0; i--) {
    const nodeId = path[i];
    if (!nodeId || !nodes[nodeId]) continue;

    // Update height
    const newHeight = updateHeight(nodes, nodeId);
    const node = nodes[nodeId];
    if (node) {
      nodes[nodeId] = { ...node, height: newHeight };

      yield {
        type: "update-height",
        nodeId,
        newHeight,
      };
    }

    // Check balance
    const balanceFactor = getBalanceFactor(nodes, nodeId);

    if (Math.abs(balanceFactor) > 1) {
      yield {
        type: "unbalanced",
        nodeId,
        balanceFactor,
      };

      const rotationInfo = determineRotationType(nodes, nodeId, balanceFactor);

      if (rotationInfo) {
        yield {
          type: "rotate",
          rotationType: rotationInfo.rotationType,
          pivotId: rotationInfo.pivotId,
          newRootId: rotationInfo.newRootId,
        };

        // Apply rotation(s)
        if (rotationInfo.rotationType === "LL") {
          const result = rotateRight(nodes, nodeId);
          nodes = result.nodes;
          // Update root if needed
          if (nodeId === rootId) {
            rootId = result.newRootId;
          }
        } else if (rotationInfo.rotationType === "RR") {
          const result = rotateLeft(nodes, nodeId);
          nodes = result.nodes;
          if (nodeId === rootId) {
            rootId = result.newRootId;
          }
        } else if (rotationInfo.rotationType === "LR") {
          const node = nodes[nodeId];
          if (node?.leftId) {
            const result1 = rotateLeft(nodes, node.leftId);
            nodes = result1.nodes;
            const result2 = rotateRight(nodes, nodeId);
            nodes = result2.nodes;
            if (nodeId === rootId) {
              rootId = result2.newRootId;
            }
          }
        } else if (rotationInfo.rotationType === "RL") {
          const node = nodes[nodeId];
          if (node?.rightId) {
            const result1 = rotateRight(nodes, node.rightId);
            nodes = result1.nodes;
            const result2 = rotateLeft(nodes, nodeId);
            nodes = result2.nodes;
            if (nodeId === rootId) {
              rootId = result2.newRootId;
            }
          }
        }

        // Unlike insert, delete may need to continue checking up the tree
        // (don't break here)
      }
    }
  }
}
