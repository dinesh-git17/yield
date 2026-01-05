import type { TreeNode } from "@/lib/store";
import type { TreeContext, TreeStep } from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// Splay Tree Generator Functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Splay Trees are self-adjusting binary search trees.
 * After every access (search, insert, delete), the accessed node is "splayed"
 * to the root through a series of rotations. This provides amortized O(log n)
 * performance and moves frequently accessed nodes closer to the root (cache-like).
 *
 * The splay operation uses three rotation patterns:
 * - Zig: Single rotation when parent is root
 * - Zig-Zig: Double same-direction rotation (both left or both right)
 * - Zig-Zag: Double opposite-direction rotation (left-right or right-left)
 */

// ─────────────────────────────────────────────────────────────────────────────
// Splay Rotation Helper Functions (for simulation during visualization)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Performs a right rotation in the simulated tree state.
 */
function rotateRight(
  nodes: Record<string, TreeNode>,
  yId: string,
  rootId: string | null
): { nodes: Record<string, TreeNode>; newRootId: string | null } {
  const y = nodes[yId];
  if (!y || !y.leftId) return { nodes, newRootId: rootId };

  const xId = y.leftId;
  const x = nodes[xId];
  if (!x) return { nodes, newRootId: rootId };

  const bId = x.rightId;
  const updatedNodes = { ...nodes };

  updatedNodes[xId] = { ...x, rightId: yId, parentId: y.parentId };
  updatedNodes[yId] = { ...y, leftId: bId, parentId: xId };

  if (bId) {
    const b = updatedNodes[bId];
    if (b) updatedNodes[bId] = { ...b, parentId: yId };
  }

  if (y.parentId) {
    const parent = updatedNodes[y.parentId];
    if (parent) {
      if (parent.leftId === yId) {
        updatedNodes[y.parentId] = { ...parent, leftId: xId };
      } else {
        updatedNodes[y.parentId] = { ...parent, rightId: xId };
      }
    }
  }

  return { nodes: updatedNodes, newRootId: rootId === yId ? xId : rootId };
}

/**
 * Performs a left rotation in the simulated tree state.
 */
function rotateLeft(
  nodes: Record<string, TreeNode>,
  xId: string,
  rootId: string | null
): { nodes: Record<string, TreeNode>; newRootId: string | null } {
  const x = nodes[xId];
  if (!x || !x.rightId) return { nodes, newRootId: rootId };

  const yId = x.rightId;
  const y = nodes[yId];
  if (!y) return { nodes, newRootId: rootId };

  const bId = y.leftId;
  const updatedNodes = { ...nodes };

  updatedNodes[yId] = { ...y, leftId: xId, parentId: x.parentId };
  updatedNodes[xId] = { ...x, rightId: bId, parentId: yId };

  if (bId) {
    const b = updatedNodes[bId];
    if (b) updatedNodes[bId] = { ...b, parentId: xId };
  }

  if (x.parentId) {
    const parent = updatedNodes[x.parentId];
    if (parent) {
      if (parent.leftId === xId) {
        updatedNodes[x.parentId] = { ...parent, leftId: yId };
      } else {
        updatedNodes[x.parentId] = { ...parent, rightId: yId };
      }
    }
  }

  return { nodes: updatedNodes, newRootId: rootId === xId ? yId : rootId };
}

/**
 * Generator that yields splay steps while moving a node to root.
 * This is the core splay operation that produces visualization steps.
 */
function* splayWithSteps(
  nodes: Record<string, TreeNode>,
  nodeId: string,
  rootId: string | null
): Generator<TreeStep, { nodes: Record<string, TreeNode>; newRootId: string | null }, unknown> {
  let currentNodes = { ...nodes };
  let currentRootId = rootId;

  // Mark the start of the splay operation
  yield { type: "splay-start", nodeId };

  // Keep splaying until node is root
  while (currentNodes[nodeId]?.parentId !== null) {
    const current = currentNodes[nodeId];
    if (!current || !current.parentId) break;

    const parent = currentNodes[current.parentId];
    if (!parent) break;

    const grandparentId = parent.parentId;

    if (grandparentId === null) {
      // Zig case: parent is root, single rotation
      if (parent.leftId === nodeId) {
        yield {
          type: "zig",
          nodeId,
          parentId: current.parentId,
          direction: "right",
        };
        const result = rotateRight(currentNodes, current.parentId, currentRootId);
        currentNodes = result.nodes;
        currentRootId = result.newRootId;
      } else {
        yield {
          type: "zig",
          nodeId,
          parentId: current.parentId,
          direction: "left",
        };
        const result = rotateLeft(currentNodes, current.parentId, currentRootId);
        currentNodes = result.nodes;
        currentRootId = result.newRootId;
      }
    } else {
      const grandparent = currentNodes[grandparentId];
      if (!grandparent) break;

      const parentIsLeftChild = grandparent.leftId === current.parentId;
      const nodeIsLeftChild = parent.leftId === nodeId;

      if (parentIsLeftChild && nodeIsLeftChild) {
        // Zig-Zig (Left-Left)
        yield {
          type: "zig-zig",
          nodeId,
          parentId: current.parentId,
          grandparentId,
          direction: "right",
        };
        // Rotate grandparent right, then parent right
        const result1 = rotateRight(currentNodes, grandparentId, currentRootId);
        currentNodes = result1.nodes;
        currentRootId = result1.newRootId;
        const result2 = rotateRight(currentNodes, current.parentId, currentRootId);
        currentNodes = result2.nodes;
        currentRootId = result2.newRootId;
      } else if (!parentIsLeftChild && !nodeIsLeftChild) {
        // Zig-Zig (Right-Right)
        yield {
          type: "zig-zig",
          nodeId,
          parentId: current.parentId,
          grandparentId,
          direction: "left",
        };
        // Rotate grandparent left, then parent left
        const result1 = rotateLeft(currentNodes, grandparentId, currentRootId);
        currentNodes = result1.nodes;
        currentRootId = result1.newRootId;
        const result2 = rotateLeft(currentNodes, current.parentId, currentRootId);
        currentNodes = result2.nodes;
        currentRootId = result2.newRootId;
      } else if (parentIsLeftChild && !nodeIsLeftChild) {
        // Zig-Zag (Left-Right)
        yield {
          type: "zig-zag",
          nodeId,
          parentId: current.parentId,
          grandparentId,
          directions: ["left", "right"],
        };
        // Rotate parent left, then grandparent right
        const result1 = rotateLeft(currentNodes, current.parentId, currentRootId);
        currentNodes = result1.nodes;
        currentRootId = result1.newRootId;
        const result2 = rotateRight(currentNodes, grandparentId, currentRootId);
        currentNodes = result2.nodes;
        currentRootId = result2.newRootId;
      } else {
        // Zig-Zag (Right-Left)
        yield {
          type: "zig-zag",
          nodeId,
          parentId: current.parentId,
          grandparentId,
          directions: ["right", "left"],
        };
        // Rotate parent right, then grandparent left
        const result1 = rotateRight(currentNodes, current.parentId, currentRootId);
        currentNodes = result1.nodes;
        currentRootId = result1.newRootId;
        const result2 = rotateLeft(currentNodes, grandparentId, currentRootId);
        currentNodes = result2.nodes;
        currentRootId = result2.newRootId;
      }
    }
  }

  return { nodes: currentNodes, newRootId: currentRootId };
}

// ─────────────────────────────────────────────────────────────────────────────
// Splay Insert Generator
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Splay Insert operation.
 *
 * Algorithm:
 * 1. Standard BST insert to find insertion point
 * 2. Insert the new node
 * 3. Splay the new node to the root
 *
 * @param context - The current tree context
 * @param value - The value to insert
 */
export function* splayInsert(
  context: TreeContext,
  value: number
): Generator<TreeStep, void, unknown> {
  const { treeState } = context;

  // Empty tree - insert as root (no splay needed)
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
  const nodes = { ...treeState.nodes };
  const rootId: string | null = treeState.rootId;

  // Standard BST insert traversal
  let currentId: string | null = treeState.rootId;
  let parentId: string | null = null;
  let position: "left" | "right" = "left";

  while (currentId !== null) {
    const current: TreeNode | undefined = nodes[currentId];
    if (!current) break;

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
      // Duplicate - splay existing node to root
      yield {
        type: "compare",
        nodeId: currentId,
        targetValue: value,
        result: "equal",
      };
      yield { type: "found", nodeId: currentId };

      // Splay the found node to root
      yield* splayWithSteps(nodes, currentId, rootId);
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

  // Simulate insertion
  const newNode: TreeNode = {
    id: newNodeId,
    value,
    leftId: null,
    rightId: null,
    parentId,
  };
  nodes[newNodeId] = newNode;

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

  // Splay the newly inserted node to root
  yield* splayWithSteps(nodes, newNodeId, rootId);
}

// ─────────────────────────────────────────────────────────────────────────────
// Splay Search Generator
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Splay Search operation.
 *
 * Algorithm:
 * 1. Standard BST search
 * 2. If found, splay the found node to root
 * 3. If not found, splay the last accessed node to root
 *
 * @param context - The current tree context
 * @param value - The value to search for
 */
export function* splaySearch(
  context: TreeContext,
  value: number
): Generator<TreeStep, void, unknown> {
  const { treeState } = context;

  if (treeState.rootId === null) {
    yield { type: "not-found", value };
    return;
  }

  const nodes = { ...treeState.nodes };
  const rootId = treeState.rootId;

  let currentId: string | null = rootId;
  let lastAccessedId: string = rootId;

  while (currentId !== null) {
    const current: TreeNode | undefined = nodes[currentId];
    if (!current) break;

    lastAccessedId = currentId;

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

      // Splay the found node to root
      yield* splayWithSteps(nodes, currentId, rootId);
      return;
    }
  }

  yield { type: "not-found", value };

  // Splay the last accessed node to root (standard splay tree behavior)
  yield* splayWithSteps(nodes, lastAccessedId, rootId);
}

// ─────────────────────────────────────────────────────────────────────────────
// Splay Delete Generator
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Splay Delete operation.
 *
 * Algorithm:
 * 1. Search for the node (splaying it to root)
 * 2. If not found, we're done (last accessed already splayed)
 * 3. If found (now at root), delete root:
 *    a. If no left subtree, right subtree becomes new tree
 *    b. If no right subtree, left subtree becomes new tree
 *    c. Otherwise, splay max in left subtree to left root, attach right subtree
 *
 * @param context - The current tree context
 * @param value - The value to delete
 */
export function* splayDelete(
  context: TreeContext,
  value: number
): Generator<TreeStep, void, unknown> {
  const { treeState } = context;

  if (treeState.rootId === null) {
    yield { type: "not-found", value };
    return;
  }

  let nodes = { ...treeState.nodes };
  let rootId: string | null = treeState.rootId;

  // First, search for the node (this will splay it to root if found)
  let currentId: string | null = rootId;
  let lastAccessedId: string = rootId;
  let foundId: string | null = null;

  while (currentId !== null) {
    const current: TreeNode | undefined = nodes[currentId];
    if (!current) break;

    lastAccessedId = currentId;

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
      foundId = currentId;
      break;
    }
  }

  if (foundId === null) {
    yield { type: "not-found", value };
    // Splay last accessed node to root
    yield* splayWithSteps(nodes, lastAccessedId, rootId);
    return;
  }

  // Splay the found node to root
  const splayResult = yield* splayWithSteps(nodes, foundId, rootId);
  nodes = splayResult.nodes;
  rootId = splayResult.newRootId;

  // Now foundId is at root, delete it
  const root = nodes[foundId];
  if (!root) return;

  // Yield delete step
  const hasLeft = root.leftId !== null;
  const hasRight = root.rightId !== null;

  if (!hasLeft && !hasRight) {
    yield { type: "delete", nodeId: foundId, strategy: "leaf" };
  } else if (!hasLeft || !hasRight) {
    yield { type: "delete", nodeId: foundId, strategy: "one-child" };
  } else {
    yield { type: "delete", nodeId: foundId, strategy: "two-children" };
  }

  // The actual deletion logic is handled by the store
  // The visualization has shown the splay and delete steps
}
