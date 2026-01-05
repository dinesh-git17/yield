"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  bstDelete,
  bstInsert,
  bstSearch,
  inOrderTraversal,
  levelOrderTraversal,
  postOrderTraversal,
  preOrderTraversal,
  type TreeContext,
  type TreeStep,
} from "@/features/algorithms/tree";
import type { TreeAlgorithmType, TreeState } from "@/lib/store";

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
  | "traversed";

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
  /** Execute an operation (insert/search/delete) with a value */
  executeOperation: (algorithm: TreeAlgorithmType, value?: number) => void;
}

export type UseTreeControllerReturn = TreeControllerState & TreeControllerActions;

const DEFAULT_SPEED = 300;

/**
 * Returns the appropriate generator for a tree algorithm.
 */
function getTreeGenerator(
  algorithm: TreeAlgorithmType,
  context: TreeContext,
  value?: number
): Generator<TreeStep, void, unknown> | null {
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
    default:
      return null;
  }
}

/**
 * Hook for controlling tree algorithm execution and visualization.
 *
 * @param treeState - The current tree state from the store
 * @param speed - Playback speed in milliseconds per step
 */
export function useTreeController(
  treeState: TreeState,
  speed: number = DEFAULT_SPEED
): UseTreeControllerReturn {
  const [status, setStatus] = useState<TreePlaybackStatus>("idle");
  const [nodeStates, setNodeStates] = useState<Map<string, TreeNodeState>>(new Map());
  const [traversalOutput, setTraversalOutput] = useState<TraversalOutput[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentStepType, setCurrentStepType] = useState<TreeStep["type"] | null>(null);
  const [lastResult, setLastResult] = useState<TreeControllerState["lastResult"]>(null);

  const iteratorRef = useRef<Generator<TreeStep, void, unknown> | null>(null);
  const treeStateSnapshotRef = useRef<TreeState>(treeState);

  /**
   * Applies a step to update node visual states.
   */
  const applyStep = useCallback((step: TreeStep) => {
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
    }
  }, []);

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
    iteratorRef.current = null;
  }, []);

  /**
   * Executes an operation with the given algorithm and optional value.
   */
  const executeOperation = useCallback(
    (algorithm: TreeAlgorithmType, value?: number) => {
      // Reset state before starting new operation
      reset();

      // Take a snapshot of the current tree state
      treeStateSnapshotRef.current = treeState;
      const context: TreeContext = { treeState: treeStateSnapshotRef.current };

      // Get the generator for the algorithm
      const generator = getTreeGenerator(algorithm, context, value);
      if (!generator) return;

      iteratorRef.current = generator;
      setStatus("playing");
    },
    [treeState, reset]
  );

  /**
   * Starts or resumes playback.
   */
  const play = useCallback(() => {
    if (status === "complete") return;
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
    play,
    pause,
    step,
    reset,
    executeOperation,
  };
}
