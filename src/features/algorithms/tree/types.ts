import type { TreeState } from "@/lib/store";

/**
 * AVL rotation types.
 * - LL: Left-Left case (single right rotation)
 * - RR: Right-Right case (single left rotation)
 * - LR: Left-Right case (left rotation then right rotation)
 * - RL: Right-Left case (right rotation then left rotation)
 */
export type AVLRotationType = "LL" | "RR" | "LR" | "RL";

/**
 * Represents a single step in a tree algorithm execution.
 * Used by generator functions to yield operations for visualization.
 * Supports BST, AVL, and Heap data structures.
 */
export type TreeStep =
  // ─────────────────────────────────────────────────────────────────────────────
  // Common Operations (BST, AVL, Heap)
  // ─────────────────────────────────────────────────────────────────────────────
  | {
      /** Comparing current node's value with target */
      type: "compare";
      /** ID of the node being compared */
      nodeId: string;
      /** The value being compared against */
      targetValue: number;
      /** Result of comparison: go left, go right, or equal */
      result: "left" | "right" | "equal";
    }
  | {
      /** Visiting a node during traversal */
      type: "visit";
      /** ID of the visited node */
      nodeId: string;
    }
  | {
      /** Successfully inserted a new node */
      type: "insert";
      /** ID of the newly inserted node */
      nodeId: string;
      /** The inserted value */
      value: number;
      /** ID of the parent node (null if root) */
      parentId: string | null;
      /** Whether inserted as left or right child */
      position: "left" | "right" | "root";
    }
  | {
      /** Successfully found a value */
      type: "found";
      /** ID of the node containing the value */
      nodeId: string;
    }
  | {
      /** Value not found in tree */
      type: "not-found";
      /** The value that was searched for */
      value: number;
    }
  | {
      /** Node is being deleted */
      type: "delete";
      /** ID of the node being deleted */
      nodeId: string;
      /** The deletion strategy used */
      strategy: "leaf" | "one-child" | "two-children";
      /** For two-children case: the successor node ID */
      successorId?: string;
    }
  | {
      /** Highlighting a node during traversal output */
      type: "traverse-output";
      /** ID of the node being output */
      nodeId: string;
      /** The value being output */
      value: number;
      /** Position in traversal sequence (0-indexed) */
      order: number;
    }
  // ─────────────────────────────────────────────────────────────────────────────
  // AVL-Specific Operations
  // ─────────────────────────────────────────────────────────────────────────────
  | {
      /** Node is unbalanced and needs rotation (balance factor > 1 or < -1) */
      type: "unbalanced";
      /** ID of the unbalanced node */
      nodeId: string;
      /** Balance factor: height(left) - height(right) */
      balanceFactor: number;
    }
  | {
      /** Performing a rotation to restore balance */
      type: "rotate";
      /** Type of rotation being performed */
      rotationType: AVLRotationType;
      /** ID of the pivot node (the one moving down) */
      pivotId: string;
      /** ID of the new root of this subtree (the one moving up) */
      newRootId: string;
    }
  | {
      /** Updating height of a node after insertion/rotation */
      type: "update-height";
      /** ID of the node being updated */
      nodeId: string;
      /** The new height value */
      newHeight: number;
    }
  // ─────────────────────────────────────────────────────────────────────────────
  // Heap-Specific Operations
  // ─────────────────────────────────────────────────────────────────────────────
  | {
      /** Bubble up: comparing with parent during heap insert */
      type: "bubble-up";
      /** ID of the node bubbling up */
      nodeId: string;
      /** ID of the parent node being compared with */
      parentId: string;
      /** Whether a swap will occur */
      willSwap: boolean;
    }
  | {
      /** Sink down: comparing with children during extract-max */
      type: "sink-down";
      /** ID of the node sinking down */
      nodeId: string;
      /** IDs of child nodes being compared */
      childIds: string[];
      /** ID of the larger child (if any) */
      largerChildId: string | null;
      /** Whether a swap will occur */
      willSwap: boolean;
    }
  | {
      /** Swapping two nodes in the heap */
      type: "swap";
      /** ID of the first node */
      nodeId1: string;
      /** ID of the second node */
      nodeId2: string;
    }
  | {
      /** Extracting the maximum value (root) from heap */
      type: "extract-max";
      /** ID of the node being extracted */
      nodeId: string;
      /** The maximum value being extracted */
      value: number;
    };

/**
 * Context passed to tree algorithms.
 * Contains the current tree state for read-only operations.
 */
export interface TreeContext {
  /** The current tree state (read-only snapshot) */
  treeState: TreeState;
}

/**
 * Signature for tree operation generator functions.
 */
export type TreeOperationGenerator = (
  context: TreeContext,
  value: number
) => Generator<TreeStep, void, unknown>;

/**
 * Signature for tree traversal generator functions.
 */
export type TreeTraversalGenerator = (context: TreeContext) => Generator<TreeStep, void, unknown>;
