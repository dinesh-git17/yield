import type { TreeAlgorithmType, TreeDataStructureType } from "@/lib/store";
import type { TreeStep } from "./types";

/**
 * Step type labels for display in the UI.
 */
export const TREE_STEP_LABELS: Record<TreeStep["type"], string> = {
  // Common operations
  compare: "Comparing values",
  visit: "Visiting node",
  insert: "Inserting node",
  found: "Found node",
  "not-found": "Not found",
  delete: "Deleting node",
  "traverse-output": "Output node",
  // AVL operations
  unbalanced: "Unbalanced node",
  rotate: "Rotating tree",
  "update-height": "Updating height",
  // Heap operations
  "bubble-up": "Bubbling up",
  "sink-down": "Sinking down",
  swap: "Swapping nodes",
  "extract-max": "Extracting max",
};

/**
 * Metadata for each tree algorithm.
 */
export interface TreeAlgorithmMetadata {
  /** Display name for the algorithm */
  label: string;
  /** Short label for compact display */
  shortLabel: string;
  /** Time complexity notation */
  complexity: string;
  /** Space complexity notation */
  spaceComplexity: string;
  /** Brief description of how the algorithm works */
  description: string;
  /** Whether this is a traversal algorithm */
  isTraversal: boolean;
  /** Visual pattern description */
  visualPattern: string;
  /** Source code lines for display */
  code: string[];
  /** Maps step types to their corresponding line indices (0-based) */
  lineMapping: Partial<Record<TreeStep["type"], number>>;
}

/**
 * Tree algorithm metadata registry.
 */
export const TREE_ALGO_METADATA: Record<TreeAlgorithmType, TreeAlgorithmMetadata> = {
  insert: {
    label: "BST Insert",
    shortLabel: "Insert",
    complexity: "O(log n)",
    spaceComplexity: "O(1)",
    description:
      "Traverses the tree comparing values, moving left for smaller and right for larger values until finding an empty spot for the new node.",
    isTraversal: false,
    visualPattern: "Path descent",
    code: [
      "function* bstInsert(tree, value) {",
      "  if (tree.root === null) {",
      "    // Insert as root",
      "    yield { type: 'insert', value, position: 'root' };",
      "    return;",
      "  }",
      "",
      "  let current = tree.root;",
      "",
      "  while (current !== null) {",
      "    if (value < current.value) {",
      "      // Compare: go left",
      "      yield { type: 'compare', nodeId: current.id, result: 'left' };",
      "",
      "      if (current.left === null) {",
      "        yield { type: 'insert', value, position: 'left' };",
      "        return;",
      "      }",
      "      current = current.left;",
      "    } else if (value > current.value) {",
      "      // Compare: go right",
      "      yield { type: 'compare', nodeId: current.id, result: 'right' };",
      "",
      "      if (current.right === null) {",
      "        yield { type: 'insert', value, position: 'right' };",
      "        return;",
      "      }",
      "      current = current.right;",
      "    } else {",
      "      // Duplicate found",
      "      yield { type: 'found', nodeId: current.id };",
      "      return;",
      "    }",
      "  }",
      "}",
    ],
    lineMapping: {
      compare: 12,
      insert: 15,
      found: 30,
    },
  },

  search: {
    label: "BST Search",
    shortLabel: "Search",
    complexity: "O(log n)",
    spaceComplexity: "O(1)",
    description:
      "Traverses the tree comparing the target value, following left or right branches until the value is found or a null node is reached.",
    isTraversal: false,
    visualPattern: "Binary descent",
    code: [
      "function* bstSearch(tree, value) {",
      "  if (tree.root === null) {",
      "    yield { type: 'not-found', value };",
      "    return;",
      "  }",
      "",
      "  let current = tree.root;",
      "",
      "  while (current !== null) {",
      "    if (value < current.value) {",
      "      // Compare: go left",
      "      yield { type: 'compare', nodeId: current.id, result: 'left' };",
      "      current = current.left;",
      "    } else if (value > current.value) {",
      "      // Compare: go right",
      "      yield { type: 'compare', nodeId: current.id, result: 'right' };",
      "      current = current.right;",
      "    } else {",
      "      // Found!",
      "      yield { type: 'compare', nodeId: current.id, result: 'equal' };",
      "      yield { type: 'found', nodeId: current.id };",
      "      return;",
      "    }",
      "  }",
      "",
      "  yield { type: 'not-found', value };",
      "}",
    ],
    lineMapping: {
      compare: 11,
      found: 20,
      "not-found": 26,
    },
  },

  delete: {
    label: "BST Delete",
    shortLabel: "Delete",
    complexity: "O(log n)",
    spaceComplexity: "O(1)",
    description:
      "Finds the node to delete, then handles three cases: leaf node (remove), one child (bypass), or two children (replace with in-order successor).",
    isTraversal: false,
    visualPattern: "Find and restructure",
    code: [
      "function* bstDelete(tree, value) {",
      "  // Find node to delete",
      "  let current = tree.root;",
      "",
      "  while (current !== null) {",
      "    if (value === current.value) {",
      "      // Found node to delete",
      "      yield { type: 'compare', result: 'equal' };",
      "",
      "      if (!current.left && !current.right) {",
      "        // Case 1: Leaf node",
      "        yield { type: 'delete', strategy: 'leaf' };",
      "      } else if (!current.left || !current.right) {",
      "        // Case 2: One child",
      "        yield { type: 'delete', strategy: 'one-child' };",
      "      } else {",
      "        // Case 3: Two children",
      "        const successor = findMin(current.right);",
      "        yield { type: 'visit', nodeId: successor.id };",
      "        yield { type: 'delete', strategy: 'two-children' };",
      "      }",
      "      return;",
      "    }",
      "",
      "    yield { type: 'compare', result: value < current.value ? 'left' : 'right' };",
      "    current = value < current.value ? current.left : current.right;",
      "  }",
      "",
      "  yield { type: 'not-found', value };",
      "}",
    ],
    lineMapping: {
      compare: 7,
      visit: 18,
      delete: 11,
      "not-found": 28,
    },
  },

  inorder: {
    label: "In-Order Traversal",
    shortLabel: "In-Order",
    complexity: "O(n)",
    spaceComplexity: "O(h)",
    description:
      "Visits nodes in Left → Root → Right order. For a BST, this yields values in sorted ascending order. Uses recursion depth proportional to tree height.",
    isTraversal: true,
    visualPattern: "Left-Root-Right",
    code: [
      "function* inOrderTraversal(node) {",
      "  if (node === null) return;",
      "",
      "  // 1. Visit left subtree",
      "  yield* inOrderTraversal(node.left);",
      "",
      "  // 2. Visit current node",
      "  yield { type: 'visit', nodeId: node.id };",
      "  yield { type: 'traverse-output', value: node.value };",
      "",
      "  // 3. Visit right subtree",
      "  yield* inOrderTraversal(node.right);",
      "}",
      "",
      "// Result: Sorted order for BST",
      "// Example: [10, 25, 30, 50, 60, 75, 90]",
    ],
    lineMapping: {
      visit: 7,
      "traverse-output": 8,
    },
  },

  preorder: {
    label: "Pre-Order Traversal",
    shortLabel: "Pre-Order",
    complexity: "O(n)",
    spaceComplexity: "O(h)",
    description:
      "Visits nodes in Root → Left → Right order. Useful for copying tree structure or prefix notation. Processes parent before children.",
    isTraversal: true,
    visualPattern: "Root-Left-Right",
    code: [
      "function* preOrderTraversal(node) {",
      "  if (node === null) return;",
      "",
      "  // 1. Visit current node first",
      "  yield { type: 'visit', nodeId: node.id };",
      "  yield { type: 'traverse-output', value: node.value };",
      "",
      "  // 2. Then left subtree",
      "  yield* preOrderTraversal(node.left);",
      "",
      "  // 3. Then right subtree",
      "  yield* preOrderTraversal(node.right);",
      "}",
      "",
      "// Result: Root first, then descendants",
      "// Example: [50, 25, 10, 30, 75, 60, 90]",
    ],
    lineMapping: {
      visit: 4,
      "traverse-output": 5,
    },
  },

  postorder: {
    label: "Post-Order Traversal",
    shortLabel: "Post-Order",
    complexity: "O(n)",
    spaceComplexity: "O(h)",
    description:
      "Visits nodes in Left → Right → Root order. Useful for deleting tree structure or postfix notation. Processes children before parent.",
    isTraversal: true,
    visualPattern: "Left-Right-Root",
    code: [
      "function* postOrderTraversal(node) {",
      "  if (node === null) return;",
      "",
      "  // 1. Visit left subtree first",
      "  yield* postOrderTraversal(node.left);",
      "",
      "  // 2. Then right subtree",
      "  yield* postOrderTraversal(node.right);",
      "",
      "  // 3. Visit current node last",
      "  yield { type: 'visit', nodeId: node.id };",
      "  yield { type: 'traverse-output', value: node.value };",
      "}",
      "",
      "// Result: Leaves first, root last",
      "// Example: [10, 30, 25, 60, 90, 75, 50]",
    ],
    lineMapping: {
      visit: 10,
      "traverse-output": 11,
    },
  },

  bfs: {
    label: "Level-Order (BFS)",
    shortLabel: "Level-Order",
    complexity: "O(n)",
    spaceComplexity: "O(n)",
    description:
      "Visits nodes level by level using a queue. Breadth-first approach that processes all nodes at depth d before depth d+1.",
    isTraversal: true,
    visualPattern: "Top-to-bottom layers",
    code: [
      "function* levelOrderTraversal(root) {",
      "  if (root === null) return;",
      "",
      "  const queue = [root];",
      "",
      "  while (queue.length > 0) {",
      "    // Dequeue front node",
      "    const node = queue.shift();",
      "",
      "    // Visit current node",
      "    yield { type: 'visit', nodeId: node.id };",
      "    yield { type: 'traverse-output', value: node.value };",
      "",
      "    // Enqueue children (left first, then right)",
      "    if (node.left) queue.push(node.left);",
      "    if (node.right) queue.push(node.right);",
      "  }",
      "}",
      "",
      "// Result: Level by level from root",
      "// Example: [50, 25, 75, 10, 30, 60, 90]",
    ],
    lineMapping: {
      visit: 10,
      "traverse-output": 11,
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// AVL Tree Algorithm Metadata
// ─────────────────────────────────────────────────────────────────────────────

/**
 * AVL-specific algorithm metadata.
 * Used when treeDataStructure is "avl".
 */
export const AVL_ALGO_METADATA: Partial<Record<TreeAlgorithmType, TreeAlgorithmMetadata>> = {
  insert: {
    label: "AVL Insert",
    shortLabel: "Insert",
    complexity: "O(log n)",
    spaceComplexity: "O(1)",
    description:
      "Inserts like BST, then unwinds the path checking balance factors. If imbalanced (|bf| > 1), performs rotation to restore balance.",
    isTraversal: false,
    visualPattern: "Insert → Check → Rotate",
    code: [
      "function* avlInsert(tree, value) {",
      "  // 1. Standard BST insert",
      "  let path = [];",
      "  let current = tree.root;",
      "",
      "  while (current !== null) {",
      "    path.push(current);",
      "    if (value < current.value) {",
      "      yield { type: 'compare', result: 'left' };",
      "      current = current.left;",
      "    } else {",
      "      yield { type: 'compare', result: 'right' };",
      "      current = current.right;",
      "    }",
      "  }",
      "",
      "  yield { type: 'insert', value };",
      "",
      "  // 2. Unwind path, check balance",
      "  while (path.length > 0) {",
      "    const node = path.pop();",
      "    updateHeight(node);",
      "    yield { type: 'update-height', nodeId: node.id };",
      "",
      "    const bf = balanceFactor(node);",
      "    if (Math.abs(bf) > 1) {",
      "      yield { type: 'unbalanced', nodeId: node.id, bf };",
      "",
      "      // 3. Determine rotation type",
      "      if (bf > 1 && balanceFactor(node.left) >= 0) {",
      "        yield { type: 'rotate', rotationType: 'LL' };",
      "        rotateRight(node);",
      "      } else if (bf < -1 && balanceFactor(node.right) <= 0) {",
      "        yield { type: 'rotate', rotationType: 'RR' };",
      "        rotateLeft(node);",
      "      } else if (bf > 1 && balanceFactor(node.left) < 0) {",
      "        yield { type: 'rotate', rotationType: 'LR' };",
      "        rotateLeft(node.left);",
      "        rotateRight(node);",
      "      } else {",
      "        yield { type: 'rotate', rotationType: 'RL' };",
      "        rotateRight(node.right);",
      "        rotateLeft(node);",
      "      }",
      "      break; // Insert needs at most one rotation",
      "    }",
      "  }",
      "}",
    ],
    lineMapping: {
      compare: 8,
      insert: 16,
      "update-height": 21,
      unbalanced: 25,
      rotate: 29,
    },
  },

  search: {
    label: "AVL Search",
    shortLabel: "Search",
    complexity: "O(log n)",
    spaceComplexity: "O(1)",
    description:
      "Identical to BST search. AVL's balance guarantee ensures O(log n) worst case, unlike BST which can degrade to O(n).",
    isTraversal: false,
    visualPattern: "Binary descent",
    code: [
      "function* avlSearch(tree, value) {",
      "  // Same as BST search",
      "  // AVL guarantees O(log n) due to balance property",
      "  let current = tree.root;",
      "",
      "  while (current !== null) {",
      "    if (value < current.value) {",
      "      yield { type: 'compare', result: 'left' };",
      "      current = current.left;",
      "    } else if (value > current.value) {",
      "      yield { type: 'compare', result: 'right' };",
      "      current = current.right;",
      "    } else {",
      "      yield { type: 'found', nodeId: current.id };",
      "      return;",
      "    }",
      "  }",
      "",
      "  yield { type: 'not-found', value };",
      "}",
    ],
    lineMapping: {
      compare: 7,
      found: 13,
      "not-found": 18,
    },
  },

  delete: {
    label: "AVL Delete",
    shortLabel: "Delete",
    complexity: "O(log n)",
    spaceComplexity: "O(1)",
    description:
      "Deletes like BST, then unwinds checking balance. Unlike insert, delete may require multiple rotations up the tree.",
    isTraversal: false,
    visualPattern: "Delete → Check → Rotate (multiple)",
    code: [
      "function* avlDelete(tree, value) {",
      "  // 1. Standard BST delete (find node, handle 3 cases)",
      "  let path = findAndDelete(tree, value);",
      "",
      "  // 2. Unwind path, check balance at each node",
      "  // Unlike insert, delete may need multiple rotations",
      "  while (path.length > 0) {",
      "    const node = path.pop();",
      "    updateHeight(node);",
      "    yield { type: 'update-height', nodeId: node.id };",
      "",
      "    const bf = balanceFactor(node);",
      "    if (Math.abs(bf) > 1) {",
      "      yield { type: 'unbalanced', nodeId: node.id, bf };",
      "",
      "      // Determine and apply rotation",
      "      const rotationType = determineRotation(node, bf);",
      "      yield { type: 'rotate', rotationType };",
      "      applyRotation(node, rotationType);",
      "      // Continue checking up the tree (no break!)",
      "    }",
      "  }",
      "}",
    ],
    lineMapping: {
      compare: 2,
      "update-height": 9,
      unbalanced: 13,
      rotate: 17,
      delete: 2,
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Max Heap Algorithm Metadata
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Heap-specific algorithm metadata.
 * Used when treeDataStructure is "max-heap".
 */
export const HEAP_ALGO_METADATA: Partial<Record<TreeAlgorithmType, TreeAlgorithmMetadata>> = {
  insert: {
    label: "Heap Insert",
    shortLabel: "Insert",
    complexity: "O(log n)",
    spaceComplexity: "O(1)",
    description:
      "Inserts at the next available position to maintain complete tree property, then bubbles up comparing with parent until heap property (parent ≥ children) is restored.",
    isTraversal: false,
    visualPattern: "Elevator rise",
    code: [
      "function* heapInsert(heap, value) {",
      "  // 1. Insert at next available position",
      "  const index = heap.size;",
      "  heap.nodes[index] = value;",
      "  yield { type: 'insert', value, position: index };",
      "",
      "  // 2. Bubble up until heap property restored",
      "  let current = index;",
      "  while (current > 0) {",
      "    const parent = Math.floor((current - 1) / 2);",
      "",
      "    if (heap.nodes[current] <= heap.nodes[parent]) {",
      "      // Heap property satisfied",
      "      break;",
      "    }",
      "",
      "    // Child > Parent: swap and continue up",
      "    yield { type: 'bubble-up', nodeId: current, parentId: parent };",
      "    yield { type: 'swap', nodeId1: current, nodeId2: parent };",
      "    swap(heap.nodes, current, parent);",
      "    current = parent;",
      "  }",
      "}",
    ],
    lineMapping: {
      insert: 4,
      "bubble-up": 17,
      swap: 18,
    },
  },

  delete: {
    label: "Extract Max",
    shortLabel: "Extract",
    complexity: "O(log n)",
    spaceComplexity: "O(1)",
    description:
      "Removes and returns the maximum element (root). Replaces root with last element, then sinks down comparing with children until heap property is restored.",
    isTraversal: false,
    visualPattern: "Elevator descent",
    code: [
      "function* heapExtractMax(heap) {",
      "  if (heap.size === 0) return null;",
      "",
      "  // 1. Save max value (root)",
      "  const max = heap.nodes[0];",
      "  yield { type: 'extract-max', nodeId: 0, value: max };",
      "",
      "  // 2. Move last element to root",
      "  const last = heap.nodes[heap.size - 1];",
      "  heap.nodes[0] = last;",
      "  yield { type: 'swap', nodeId1: 0, nodeId2: heap.size - 1 };",
      "  heap.size--;",
      "",
      "  // 3. Sink down until heap property restored",
      "  let current = 0;",
      "  while (true) {",
      "    const left = 2 * current + 1;",
      "    const right = 2 * current + 2;",
      "    let largest = current;",
      "",
      "    // Find largest among parent and children",
      "    if (left < heap.size && heap.nodes[left] > heap.nodes[largest]) {",
      "      largest = left;",
      "    }",
      "    if (right < heap.size && heap.nodes[right] > heap.nodes[largest]) {",
      "      largest = right;",
      "    }",
      "",
      "    if (largest === current) break; // Heap property satisfied",
      "",
      "    yield { type: 'sink-down', nodeId: current, largerChildId: largest };",
      "    yield { type: 'swap', nodeId1: current, nodeId2: largest };",
      "    swap(heap.nodes, current, largest);",
      "    current = largest;",
      "  }",
      "",
      "  return max;",
      "}",
    ],
    lineMapping: {
      "extract-max": 5,
      swap: 10,
      "sink-down": 30,
      delete: 11,
    },
  },

  bfs: {
    label: "Level-Order (BFS)",
    shortLabel: "Level-Order",
    complexity: "O(n)",
    spaceComplexity: "O(n)",
    description:
      "Visits nodes level by level using a queue. For a heap, this traverses nodes in their array order (index 0, 1, 2, ...).",
    isTraversal: true,
    visualPattern: "Top-to-bottom layers",
    code: [
      "function* levelOrderTraversal(root) {",
      "  if (root === null) return;",
      "",
      "  const queue = [root];",
      "",
      "  while (queue.length > 0) {",
      "    // Dequeue front node",
      "    const node = queue.shift();",
      "",
      "    // Visit current node",
      "    yield { type: 'visit', nodeId: node.id };",
      "    yield { type: 'traverse-output', value: node.value };",
      "",
      "    // Enqueue children (left first, then right)",
      "    if (node.left) queue.push(node.left);",
      "    if (node.right) queue.push(node.right);",
      "  }",
      "}",
      "",
      "// For Max Heap: values decrease by level",
      "// Example: [90, 75, 60, 50, 25, 30, 10]",
    ],
    lineMapping: {
      visit: 10,
      "traverse-output": 11,
    },
  },
};

/**
 * Get metadata for a specific tree algorithm.
 * Returns data-structure-specific metadata when available.
 *
 * @param algorithm - The algorithm type
 * @param dataStructure - The tree data structure (bst, avl, max-heap)
 */
export function getTreeAlgorithmMetadata(
  algorithm: TreeAlgorithmType,
  dataStructure: TreeDataStructureType = "bst"
): TreeAlgorithmMetadata {
  // Use heap-specific metadata for max-heap
  if (dataStructure === "max-heap") {
    const heapMetadata = HEAP_ALGO_METADATA[algorithm];
    if (heapMetadata) return heapMetadata;
  }

  // Use AVL-specific metadata for avl
  if (dataStructure === "avl") {
    const avlMetadata = AVL_ALGO_METADATA[algorithm];
    if (avlMetadata) return avlMetadata;
  }

  // Fall back to BST metadata
  return TREE_ALGO_METADATA[algorithm] ?? TREE_ALGO_METADATA.insert;
}
