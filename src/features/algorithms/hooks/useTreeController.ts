"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { AVLRotationType } from "@/features/algorithms/tree";
import {
  avlDelete,
  avlInsert,
  avlSearch,
  bstDelete,
  bstInsert,
  bstSearch,
  floydHeapify,
  heapExtractMax,
  heapInsert,
  heapSearch,
  inOrderTraversal,
  invertTree,
  levelOrderTraversal,
  postOrderTraversal,
  preOrderTraversal,
  splayDelete,
  splayInsert,
  splaySearch,
  type TreeContext,
  type TreeStep,
} from "@/features/algorithms/tree";
import {
  type TreeAlgorithmType,
  type TreeDataStructureType,
  type TreeState,
  useYieldStore,
} from "@/lib/store";

/**
 * Visual state for a tree node during algorithm execution.
 */
export type TreeNodeState =
  | "idle"
  | "comparing"
  | "visiting"
  | "found"
  | "not-found"
  | "inserting"
  | "deleting"
  | "traversed"
  // Heap-specific states
  | "bubbling-up"
  | "sinking-down"
  | "swapping"
  | "extracting"
  | "heapifying"
  // AVL-specific states
  | "unbalanced"
  | "rotating-pivot"
  | "rotating-new-root"
  | "updating-height"
  // Invert-specific states
  | "inverting"
  // Splay-specific states
  | "splaying"
  | "splay-target"
  | "splay-parent"
  | "splay-grandparent";

/**
 * Rotation information for AVL tree operations.
 * Used to display rotation type and involved nodes during visualization.
 */
export interface RotationInfo {
  /** Type of rotation being performed (LL, RR, LR, RL) */
  rotationType: AVLRotationType;
  /** ID of the pivot node (the one moving down) */
  pivotId: string;
  /** ID of the new root of this subtree (the one moving up) */
  newRootId: string;
}

/**
 * Playback status for the tree controller.
 */
export type TreePlaybackStatus = "idle" | "playing" | "paused" | "complete";

/**
 * Represents the visualization state of a single node.
 */
export interface NodeVisualization {
  nodeId: string;
  state: TreeNodeState;
}

/**
 * Output from a traversal operation.
 */
export interface TraversalOutput {
  nodeId: string;
  value: number;
  order: number;
}

export interface TreeControllerState {
  status: TreePlaybackStatus;
  nodeStates: Map<string, TreeNodeState>;
  traversalOutput: TraversalOutput[];
  currentStepIndex: number;
  currentStepType: TreeStep["type"] | null;
  lastResult: "found" | "not-found" | "inserted" | "deleted" | null;
  /** Current rotation info when an AVL rotation is being visualized */
  currentRotation: RotationInfo | null;
}

export interface TreeControllerActions {
  /** Start or resume playback */
  play: () => void;
  /** Pause playback */
  pause: () => void;
  /** Execute a single step */
  step: () => void;
  /** Reset to initial state */
  reset: () => void;
  /** Execute an operation (insert/search/delete) with a value, auto-plays */
  executeOperation: (algorithm: TreeAlgorithmType, value?: number) => void;
  /** Prepare an operation without auto-playing (user must click Play) */
  prepareOperation: (algorithm: TreeAlgorithmType, value?: number) => void;
}

export type UseTreeControllerReturn = TreeControllerState & TreeControllerActions;

const DEFAULT_SPEED = 300;

/**
 * Options for the tree controller hook.
 */
export interface UseTreeControllerOptions {
  /** Callback fired when an invert-swap step is processed */
  onInvertSwap?: (nodeId: string) => void;
  /** Callback fired when a splay operation completes (after all zig/zig-zig/zig-zag steps) */
  onSplay?: (nodeId: string) => void;
  /** Callback fired when a swap occurs during heapify (to update store values) */
  onHeapifySwap?: (parentId: string, childId: string) => void;
}

/**
 * Returns the appropriate generator for a tree algorithm.
 * Routes to different implementations based on data structure type.
 */
function getTreeGenerator(
  algorithm: TreeAlgorithmType,
  context: TreeContext,
  dataStructure: TreeDataStructureType,
  value?: number
): Generator<TreeStep, void, unknown> | null {
  // Max Heap uses different generators for insert/delete/search
  if (dataStructure === "max-heap") {
    switch (algorithm) {
      case "insert":
        if (value === undefined) return null;
        return heapInsert(context, value);
      case "search":
        // Heap search is linear BFS with pruning
        if (value === undefined) return null;
        return heapSearch(context, value);
      case "delete":
        // Heap delete is actually extract-max (no value needed)
        return heapExtractMax(context);
      case "heapify":
        // Floyd's O(n) heap construction
        return floydHeapify(context);
      // Traversals work on any binary tree structure
      case "inorder":
        return inOrderTraversal(context);
      case "preorder":
        return preOrderTraversal(context);
      case "postorder":
        return postOrderTraversal(context);
      case "bfs":
        return levelOrderTraversal(context);
      case "invert":
        return invertTree(context);
      default:
        return null;
    }
  }

  // AVL uses AVL-specific generators with rotation visualization
  if (dataStructure === "avl") {
    switch (algorithm) {
      case "insert":
        if (value === undefined) return null;
        return avlInsert(context, value);
      case "search":
        if (value === undefined) return null;
        return avlSearch(context, value);
      case "delete":
        if (value === undefined) return null;
        return avlDelete(context, value);
      // Traversals work on any binary tree structure
      case "inorder":
        return inOrderTraversal(context);
      case "preorder":
        return preOrderTraversal(context);
      case "postorder":
        return postOrderTraversal(context);
      case "bfs":
        return levelOrderTraversal(context);
      case "invert":
        return invertTree(context);
      default:
        return null;
    }
  }

  // Splay uses splay-specific generators with rotation visualization
  if (dataStructure === "splay") {
    switch (algorithm) {
      case "insert":
        if (value === undefined) return null;
        return splayInsert(context, value);
      case "search":
        if (value === undefined) return null;
        return splaySearch(context, value);
      case "delete":
        if (value === undefined) return null;
        return splayDelete(context, value);
      // Traversals work on any binary tree structure
      case "inorder":
        return inOrderTraversal(context);
      case "preorder":
        return preOrderTraversal(context);
      case "postorder":
        return postOrderTraversal(context);
      case "bfs":
        return levelOrderTraversal(context);
      case "invert":
        return invertTree(context);
      default:
        return null;
    }
  }

  // BST uses standard BST generators
  switch (algorithm) {
    case "insert":
      if (value === undefined) return null;
      return bstInsert(context, value);
    case "search":
      if (value === undefined) return null;
      return bstSearch(context, value);
    case "delete":
      if (value === undefined) return null;
      return bstDelete(context, value);
    case "inorder":
      return inOrderTraversal(context);
    case "preorder":
      return preOrderTraversal(context);
    case "postorder":
      return postOrderTraversal(context);
    case "bfs":
      return levelOrderTraversal(context);
    case "invert":
      return invertTree(context);
    default:
      return null;
  }
}

/**
 * Hook for controlling tree algorithm execution and visualization.
 *
 * @param treeState - The current tree state from the store
 * @param dataStructure - The tree data structure type (bst, avl, max-heap)
 * @param speed - Playback speed in milliseconds per step
 * @param options - Optional callbacks for step events
 */
export function useTreeController(
  treeState: TreeState,
  dataStructure: TreeDataStructureType = "bst",
  speed: number = DEFAULT_SPEED,
  options: UseTreeControllerOptions = {}
): UseTreeControllerReturn {
  const { onInvertSwap, onSplay, onHeapifySwap } = options;
  // Track if we're in heapify mode to route swap callbacks correctly
  const isHeapifyingRef = useRef(false);
  const [status, setStatus] = useState<TreePlaybackStatus>("idle");
  const [nodeStates, setNodeStates] = useState<Map<string, TreeNodeState>>(new Map());
  const [traversalOutput, setTraversalOutput] = useState<TraversalOutput[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentStepType, setCurrentStepType] = useState<TreeStep["type"] | null>(null);
  const [lastResult, setLastResult] = useState<TreeControllerState["lastResult"]>(null);
  const [currentRotation, setCurrentRotation] = useState<RotationInfo | null>(null);

  const iteratorRef = useRef<Generator<TreeStep, void, unknown> | null>(null);
  const treeStateSnapshotRef = useRef<TreeState>(treeState);

  /**
   * Applies a step to update node visual states.
   */
  const applyStep = useCallback(
    (step: TreeStep) => {
      setCurrentStepType(step.type);

      switch (step.type) {
        case "compare":
          setNodeStates((prev) => {
            const next = new Map(prev);
            // Clear previous comparing states
            for (const [id, state] of next) {
              if (state === "comparing") {
                next.set(id, "idle");
              }
            }
            next.set(step.nodeId, "comparing");
            return next;
          });
          break;

        case "visit":
          setNodeStates((prev) => {
            const next = new Map(prev);
            // Clear previous comparing states, keep traversed
            for (const [id, state] of next) {
              if (state === "comparing" || state === "visiting") {
                next.set(id, "idle");
              }
            }
            next.set(step.nodeId, "visiting");
            return next;
          });
          break;

        case "traverse-output":
          setNodeStates((prev) => {
            const next = new Map(prev);
            next.set(step.nodeId, "traversed");
            return next;
          });
          setTraversalOutput((prev) => [
            ...prev,
            { nodeId: step.nodeId, value: step.value, order: step.order },
          ]);
          break;

        case "insert":
          setNodeStates((prev) => {
            const next = new Map(prev);
            // Clear comparing states
            for (const [id, state] of next) {
              if (state === "comparing") {
                next.set(id, "idle");
              }
            }
            // The node will be inserted by the store, we mark pending
            return next;
          });
          setLastResult("inserted");
          break;

        case "found":
          setNodeStates((prev) => {
            const next = new Map(prev);
            // Clear comparing states
            for (const [id, state] of next) {
              if (state === "comparing") {
                next.set(id, "idle");
              }
            }
            next.set(step.nodeId, "found");
            return next;
          });
          setLastResult("found");
          break;

        case "not-found":
          setNodeStates((prev) => {
            const next = new Map(prev);
            // Clear comparing states
            for (const [id, state] of next) {
              if (state === "comparing") {
                next.set(id, "idle");
              }
            }
            return next;
          });
          setLastResult("not-found");
          break;

        case "delete":
          setNodeStates((prev) => {
            const next = new Map(prev);
            // Clear comparing states
            for (const [id, state] of next) {
              if (state === "comparing" || state === "visiting") {
                next.set(id, "idle");
              }
            }
            next.set(step.nodeId, "deleting");
            return next;
          });
          setLastResult("deleted");
          break;

        // ───────────────────────────────────────────────────────────────────────
        // Heap-specific steps
        // ───────────────────────────────────────────────────────────────────────
        case "bubble-up":
          setNodeStates((prev) => {
            const next = new Map(prev);
            // Clear previous bubble/sink states
            for (const [id, state] of next) {
              if (state === "bubbling-up" || state === "swapping") {
                next.set(id, "idle");
              }
            }
            // Highlight the node bubbling up and its parent
            next.set(step.nodeId, "bubbling-up");
            next.set(step.parentId, "comparing");
            return next;
          });
          break;

        case "sink-down":
          setNodeStates((prev) => {
            const next = new Map(prev);
            // Clear previous states
            for (const [id, state] of next) {
              if (state === "sinking-down" || state === "swapping" || state === "comparing") {
                next.set(id, "idle");
              }
            }
            // Highlight the node sinking down
            next.set(step.nodeId, "sinking-down");
            // Highlight children being compared
            for (const childId of step.childIds) {
              next.set(childId, "comparing");
            }
            // Highlight the larger child if it will be swapped with
            if (step.largerChildId && step.willSwap) {
              next.set(step.largerChildId, "swapping");
            }
            return next;
          });
          break;

        case "swap":
          setNodeStates((prev) => {
            const next = new Map(prev);
            // Clear previous states
            for (const [id, state] of next) {
              if (
                state === "bubbling-up" ||
                state === "sinking-down" ||
                state === "comparing" ||
                state === "heapifying"
              ) {
                next.set(id, "idle");
              }
            }
            // Highlight both nodes being swapped
            next.set(step.nodeId1, "swapping");
            next.set(step.nodeId2, "swapping");
            return next;
          });
          // If we're in heapify mode, call the swap callback to update store
          if (isHeapifyingRef.current) {
            onHeapifySwap?.(step.nodeId1, step.nodeId2);
          }
          break;

        case "heapify-node":
          // Mark the start of heapify mode
          isHeapifyingRef.current = true;
          setNodeStates((prev) => {
            const next = new Map(prev);
            // Clear previous heapify states
            for (const [id, state] of next) {
              if (state === "heapifying" || state === "swapping") {
                next.set(id, "idle");
              }
            }
            // Highlight the node being heapified
            next.set(step.nodeId, "heapifying");
            return next;
          });
          break;

        case "extract-max":
          setNodeStates((prev) => {
            const next = new Map(prev);
            // Mark the root as being extracted
            next.set(step.nodeId, "extracting");
            return next;
          });
          setLastResult("deleted"); // Extract-max is a form of deletion
          break;

        // ───────────────────────────────────────────────────────────────────────
        // AVL-specific steps
        // ───────────────────────────────────────────────────────────────────────
        case "unbalanced":
          setNodeStates((prev) => {
            const next = new Map(prev);
            // Clear previous states except traversed
            for (const [id, state] of next) {
              if (state !== "traversed") {
                next.set(id, "idle");
              }
            }
            // Mark the unbalanced node
            next.set(step.nodeId, "unbalanced");
            return next;
          });
          break;

        case "rotate":
          setNodeStates((prev) => {
            const next = new Map(prev);
            // Clear unbalanced state, keep traversed
            for (const [id, state] of next) {
              if (state === "unbalanced" || state === "updating-height") {
                next.set(id, "idle");
              }
            }
            // Highlight pivot (moving down) and new root (moving up)
            next.set(step.pivotId, "rotating-pivot");
            next.set(step.newRootId, "rotating-new-root");
            return next;
          });
          // Store rotation info for display
          setCurrentRotation({
            rotationType: step.rotationType,
            pivotId: step.pivotId,
            newRootId: step.newRootId,
          });
          break;

        case "update-height":
          setNodeStates((prev) => {
            const next = new Map(prev);
            // Clear rotation states
            for (const [id, state] of next) {
              if (state === "rotating-pivot" || state === "rotating-new-root") {
                next.set(id, "idle");
              }
            }
            // Mark the node being updated
            next.set(step.nodeId, "updating-height");
            return next;
          });
          break;

        // ───────────────────────────────────────────────────────────────────────
        // Invert operation
        // ───────────────────────────────────────────────────────────────────────
        case "invert-swap":
          setNodeStates((prev) => {
            const next = new Map(prev);
            // Clear previous visiting states
            for (const [id, state] of next) {
              if (state === "visiting" || state === "inverting") {
                next.set(id, "idle");
              }
            }
            // Mark the node as inverting
            next.set(step.nodeId, "inverting");
            return next;
          });
          // Call the callback to actually swap children in the store
          onInvertSwap?.(step.nodeId);
          break;

        // ───────────────────────────────────────────────────────────────────────
        // Splay operations
        // ───────────────────────────────────────────────────────────────────────
        case "splay-start":
          setNodeStates((prev) => {
            const next = new Map(prev);
            // Clear previous states except found/traversed
            for (const [id, state] of next) {
              if (state !== "found" && state !== "traversed") {
                next.set(id, "idle");
              }
            }
            // Mark the node being splayed
            next.set(step.nodeId, "splay-target");
            return next;
          });
          break;

        case "zig":
          setNodeStates((prev) => {
            const next = new Map(prev);
            // Clear previous splay states
            for (const [id, state] of next) {
              if (
                state === "splaying" ||
                state === "splay-target" ||
                state === "splay-parent" ||
                state === "splay-grandparent"
              ) {
                next.set(id, "idle");
              }
            }
            // Highlight the node and its parent
            next.set(step.nodeId, "splay-target");
            next.set(step.parentId, "splay-parent");
            return next;
          });
          // Call splay callback to update store
          onSplay?.(step.nodeId);
          break;

        case "zig-zig":
          setNodeStates((prev) => {
            const next = new Map(prev);
            // Clear previous splay states
            for (const [id, state] of next) {
              if (
                state === "splaying" ||
                state === "splay-target" ||
                state === "splay-parent" ||
                state === "splay-grandparent"
              ) {
                next.set(id, "idle");
              }
            }
            // Highlight node, parent, and grandparent
            next.set(step.nodeId, "splay-target");
            next.set(step.parentId, "splay-parent");
            next.set(step.grandparentId, "splay-grandparent");
            return next;
          });
          // Call splay callback to update store
          onSplay?.(step.nodeId);
          break;

        case "zig-zag":
          setNodeStates((prev) => {
            const next = new Map(prev);
            // Clear previous splay states
            for (const [id, state] of next) {
              if (
                state === "splaying" ||
                state === "splay-target" ||
                state === "splay-parent" ||
                state === "splay-grandparent"
              ) {
                next.set(id, "idle");
              }
            }
            // Highlight node, parent, and grandparent
            next.set(step.nodeId, "splay-target");
            next.set(step.parentId, "splay-parent");
            next.set(step.grandparentId, "splay-grandparent");
            return next;
          });
          // Call splay callback to update store
          onSplay?.(step.nodeId);
          break;
      }
    },
    [onInvertSwap, onSplay, onHeapifySwap]
  );

  /**
   * Processes the next step from the iterator.
   */
  const processNextStep = useCallback((): boolean => {
    const iterator = iteratorRef.current;
    if (!iterator) return false;

    const result = iterator.next();

    if (result.done) {
      setStatus("complete");
      return false;
    }

    const step = result.value;
    setCurrentStepIndex((prev) => prev + 1);
    applyStep(step);

    return true;
  }, [applyStep]);

  /**
   * Playback interval effect.
   */
  useEffect(() => {
    if (status !== "playing") return;

    const intervalId = setInterval(() => {
      const hasMore = processNextStep();
      if (!hasMore) {
        clearInterval(intervalId);
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [status, speed, processNextStep]);

  /**
   * Resets all state to initial values.
   */
  const reset = useCallback(() => {
    setStatus("idle");
    setNodeStates(new Map());
    setTraversalOutput([]);
    setCurrentStepIndex(0);
    setCurrentStepType(null);
    setLastResult(null);
    setCurrentRotation(null);
    iteratorRef.current = null;
    isHeapifyingRef.current = false;
  }, []);

  /**
   * Internal helper to set up an operation.
   */
  const setupOperation = useCallback(
    (algorithm: TreeAlgorithmType, value?: number): boolean => {
      // Reset state before starting new operation
      reset();

      // Get fresh tree state directly from store to avoid stale closure issues
      // This is critical for heapify which runs after fillRandomHeap updates the store
      const freshTreeState = useYieldStore.getState().treeState;
      treeStateSnapshotRef.current = freshTreeState;
      const context: TreeContext = { treeState: freshTreeState };

      // Get the generator for the algorithm (data-structure-aware)
      const generator = getTreeGenerator(algorithm, context, dataStructure, value);
      if (!generator) return false;

      iteratorRef.current = generator;
      return true;
    },
    [dataStructure, reset]
  );

  /**
   * Executes an operation with the given algorithm and optional value.
   * Auto-plays immediately after setup.
   */
  const executeOperation = useCallback(
    (algorithm: TreeAlgorithmType, value?: number) => {
      if (setupOperation(algorithm, value)) {
        setStatus("playing");
      }
    },
    [setupOperation]
  );

  /**
   * Prepares an operation without auto-playing.
   * The user must click Play to start the visualization.
   */
  const prepareOperation = useCallback(
    (algorithm: TreeAlgorithmType, value?: number) => {
      if (setupOperation(algorithm, value)) {
        setStatus("paused");
      }
    },
    [setupOperation]
  );

  /**
   * Starts or resumes playback.
   */
  const play = useCallback(() => {
    if (status === "complete" || status === "idle") return;
    if (status === "paused") {
      setStatus("playing");
    }
  }, [status]);

  /**
   * Pauses playback.
   */
  const pause = useCallback(() => {
    if (status === "playing") {
      setStatus("paused");
    }
  }, [status]);

  /**
   * Executes a single step.
   */
  const step = useCallback(() => {
    if (status === "complete") return;
    if (status === "playing") {
      setStatus("paused");
    }
    processNextStep();
  }, [status, processNextStep]);

  return {
    status,
    nodeStates,
    traversalOutput,
    currentStepIndex,
    currentStepType,
    lastResult,
    currentRotation,
    play,
    pause,
    step,
    reset,
    executeOperation,
    prepareOperation,
  };
}
