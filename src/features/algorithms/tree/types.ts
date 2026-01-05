import type { TreeState } from "@/lib/store";

/**
 * Represents a single step in a BST algorithm execution.
 * Used by generator functions to yield operations for visualization.
 */
export type TreeStep =
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
