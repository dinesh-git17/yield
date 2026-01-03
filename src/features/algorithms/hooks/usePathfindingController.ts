"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  aStar,
  bfs,
  bidirectionalAStar,
  dfs,
  dijkstra,
  floodFill,
  getHeuristic,
  greedyBestFirst,
  type HeuristicFunction,
  type PathfindingContext,
  type PathfindingStep,
  randomWalk,
  toKey,
} from "@/features/algorithms/pathfinding";
import type { NodeState } from "@/features/visualizer/components/pathfinding/GridNode";
import type { HeuristicType, PathfindingAlgorithmType } from "@/lib/store";

/**
 * Returns the appropriate pathfinding algorithm generator for the given type.
 */
function getAlgorithmGenerator(
  algorithm: PathfindingAlgorithmType,
  context: PathfindingContext,
  heuristic: HeuristicFunction
): Generator<PathfindingStep, void, unknown> {
  switch (algorithm) {
    case "dfs":
      return dfs(context);
    case "dijkstra":
      return dijkstra(context);
    case "astar":
      return aStar(context, heuristic);
    case "greedy":
      return greedyBestFirst(context, heuristic);
    case "bidirectional":
      return bidirectionalAStar(context, heuristic);
    case "random":
      return randomWalk(context);
    case "flood":
      return floodFill(context);
    default:
      return bfs(context);
  }
}

export type PlaybackStatus = "idle" | "playing" | "paused" | "complete";

export type PathfindingStepType = PathfindingStep["type"] | null;

/**
 * Visualization state for a single grid node.
 * Includes state and optional distance for heat map.
 */
export interface NodeVisualization {
  state: NodeState;
  distance?: number;
}

/**
 * State returned by the pathfinding controller.
 */
export interface PathfindingControllerState {
  /** Map of node keys to their visualization states */
  nodeStates: Map<string, NodeVisualization>;
  /** Maximum distance seen (for normalizing heat map) */
  maxDistance: number;
  /** Current playback status */
  status: PlaybackStatus;
  /** Current step index */
  currentStepIndex: number;
  /** Type of the current step */
  currentStepType: PathfindingStepType;
  /** Whether a path was found */
  pathFound: boolean | null;
  /** Speed in milliseconds per step */
  speed: number;
}

/**
 * Actions exposed by the pathfinding controller.
 */
export interface PathfindingControllerActions {
  play: () => void;
  pause: () => void;
  nextStep: () => void;
  reset: () => void;
  setSpeed: (speed: number) => void;
}

export type UsePathfindingControllerReturn = PathfindingControllerState &
  PathfindingControllerActions;

const DEFAULT_SPEED = 50;
const PATH_ANIMATION_DELAY_MS = 30;

export function usePathfindingController(
  context: PathfindingContext,
  algorithm: PathfindingAlgorithmType = "bfs",
  heuristicType: HeuristicType = "manhattan"
): UsePathfindingControllerReturn {
  const [nodeStates, setNodeStates] = useState<Map<string, NodeVisualization>>(new Map());
  const [maxDistance, setMaxDistance] = useState(0);
  const [status, setStatus] = useState<PlaybackStatus>("idle");
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentStepType, setCurrentStepType] = useState<PathfindingStepType>(null);
  const [pathFound, setPathFound] = useState<boolean | null>(null);
  const [speed, setSpeed] = useState(DEFAULT_SPEED);

  const iteratorRef = useRef<Generator<PathfindingStep, void, unknown> | null>(null);
  const pathTimeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const currentNodeRef = useRef<string | null>(null);
  const maxDistanceRef = useRef(0);

  const clearPathTimeouts = useCallback(() => {
    for (const timeout of pathTimeoutsRef.current) {
      clearTimeout(timeout);
    }
    pathTimeoutsRef.current = [];
  }, []);

  const heuristic = getHeuristic(heuristicType);

  const initializeIterator = useCallback(() => {
    iteratorRef.current = getAlgorithmGenerator(algorithm, context, heuristic);
    currentNodeRef.current = null;
    maxDistanceRef.current = 0;
    setMaxDistance(0);
    setPathFound(null);
  }, [context, algorithm, heuristic]);

  // Re-initialize when context or algorithm changes
  // initializeIterator depends on context and algorithm, so changes propagate through it
  useEffect(() => {
    setStatus("idle");
    setCurrentStepIndex(0);
    setCurrentStepType(null);
    setNodeStates(new Map());
    setMaxDistance(0);
    setPathFound(null);
    clearPathTimeouts();
    initializeIterator();
  }, [initializeIterator, clearPathTimeouts]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearPathTimeouts();
    };
  }, [clearPathTimeouts]);

  /**
   * Apply a pathfinding step to the visualization state.
   */
  const applyStep = useCallback((step: PathfindingStep) => {
    setNodeStates((prevStates) => {
      const newStates = new Map(prevStates);

      // Clear previous "current" node
      if (currentNodeRef.current) {
        const prevNode = newStates.get(currentNodeRef.current);
        if (prevNode && prevNode.state === "current") {
          newStates.set(currentNodeRef.current, {
            ...prevNode,
            state: "visited",
          });
        }
      }

      switch (step.type) {
        case "current": {
          const key = toKey(step.coord);
          const existingNode = newStates.get(key);
          // Don't override path nodes
          if (existingNode?.state !== "path") {
            newStates.set(key, {
              state: "current",
              distance: step.distance,
            });
            currentNodeRef.current = key;

            // Track max distance for heat map normalization
            if (step.distance > maxDistanceRef.current) {
              maxDistanceRef.current = step.distance;
              setMaxDistance(step.distance);
            }
          }
          break;
        }

        case "visit": {
          const key = toKey(step.coord);
          const existingNode = newStates.get(key);
          // Don't override path nodes
          if (existingNode?.state !== "path") {
            newStates.set(key, {
              state: "visited",
              distance: step.distance,
            });
          }
          break;
        }

        case "path": {
          const key = toKey(step.coord);
          newStates.set(key, { state: "path" });
          break;
        }

        case "no-path":
          // No state change, just signal
          break;
      }

      return newStates;
    });
  }, []);

  /**
   * Animate the path reveal with a wave effect.
   */
  const animatePath = useCallback(
    (pathSteps: PathfindingStep[]) => {
      clearPathTimeouts();

      pathSteps.forEach((step, index) => {
        const timeout = setTimeout(() => {
          applyStep(step);
        }, index * PATH_ANIMATION_DELAY_MS);
        pathTimeoutsRef.current.push(timeout);
      });
    },
    [clearPathTimeouts, applyStep]
  );

  /**
   * Process the next step from the iterator.
   * Returns true if there are more steps, false if done.
   */
  const processNextStep = useCallback((): boolean => {
    const iterator = iteratorRef.current;
    if (!iterator) return false;

    const result = iterator.next();

    if (result.done) {
      setStatus("complete");
      currentNodeRef.current = null;
      return false;
    }

    const step = result.value;
    setCurrentStepIndex((prev) => prev + 1);
    setCurrentStepType(step.type);

    // Handle path steps specially - collect them all and animate
    if (step.type === "path") {
      // Collect all remaining path steps
      const pathSteps: PathfindingStep[] = [step];
      let nextResult = iterator.next();

      while (!nextResult.done && nextResult.value.type === "path") {
        pathSteps.push(nextResult.value);
        nextResult = iterator.next();
      }

      // Animate the path reveal
      setPathFound(true);
      animatePath(pathSteps);
      setStatus("complete");
      return false;
    }

    // Handle no-path
    if (step.type === "no-path") {
      setPathFound(false);
      setStatus("complete");
      return false;
    }

    // Regular step
    applyStep(step);
    return true;
  }, [applyStep, animatePath]);

  // Playback interval
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

  const play = useCallback(() => {
    if (status === "complete") return;
    if (status === "idle" && !iteratorRef.current) {
      initializeIterator();
    }
    setStatus("playing");
  }, [status, initializeIterator]);

  const pause = useCallback(() => {
    if (status === "playing") {
      setStatus("paused");
    }
  }, [status]);

  const nextStep = useCallback(() => {
    if (status === "complete") return;
    if (status === "idle" && !iteratorRef.current) {
      initializeIterator();
    }
    if (status === "playing") {
      setStatus("paused");
    }
    processNextStep();
  }, [status, initializeIterator, processNextStep]);

  const reset = useCallback(() => {
    clearPathTimeouts();
    setStatus("idle");
    setCurrentStepIndex(0);
    setCurrentStepType(null);
    setNodeStates(new Map());
    setMaxDistance(0);
    setPathFound(null);
    maxDistanceRef.current = 0;
    currentNodeRef.current = null;
    initializeIterator();
  }, [initializeIterator, clearPathTimeouts]);

  const updateSpeed = useCallback((newSpeed: number) => {
    setSpeed(newSpeed);
  }, []);

  return {
    nodeStates,
    maxDistance,
    status,
    currentStepIndex,
    currentStepType,
    pathFound,
    speed,
    play,
    pause,
    nextStep,
    reset,
    setSpeed: updateSpeed,
  };
}
