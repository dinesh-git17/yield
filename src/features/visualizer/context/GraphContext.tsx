"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { GraphStep, UnionFindSetId } from "@/features/algorithms/graph";
import { kahn, kruskal, prim } from "@/features/algorithms/graph";
import type { GraphAlgorithmType, GraphState, PlaybackSpeedMultiplier } from "@/lib/store";
import { useYieldStore } from "@/lib/store";

/**
 * Converts playback speed multiplier to interval in milliseconds.
 * Higher multiplier = faster playback = shorter interval.
 * Base interval is 200ms at 1x speed.
 */
const BASE_INTERVAL_MS = 200;
function speedMultiplierToInterval(multiplier: PlaybackSpeedMultiplier): number {
  return Math.round(BASE_INTERVAL_MS / multiplier);
}

/**
 * Visual state for a graph node during algorithm execution.
 */
export type GraphNodeState =
  | "idle"
  | "selected"
  | "visiting"
  | "visited"
  | "in-mst"
  | "processing"
  | "source"
  | "current"
  // Topological sort states
  | "queued" // In the queue waiting to be processed
  | "in-order"; // Added to topological order (processed/complete)

/**
 * Visual state for a graph edge during algorithm execution.
 */
export type GraphEdgeState =
  | "idle"
  | "considering"
  | "in-mst"
  | "rejected"
  | "highlighted"
  // Topological sort states
  | "processed"; // Edge has been "removed" (neighbor's indegree decremented)

/**
 * Interaction mode for the graph canvas.
 */
export type GraphInteractionMode =
  | { type: "idle" }
  | { type: "dragging-node"; nodeId: string; offsetX: number; offsetY: number }
  | { type: "drawing-edge"; sourceId: string; mouseX: number; mouseY: number }
  | { type: "selecting" };

/**
 * Playback status for the graph controller.
 */
export type GraphPlaybackStatus = "idle" | "playing" | "paused" | "complete";

/**
 * Controller state for graph visualization.
 */
export interface GraphControllerState {
  status: GraphPlaybackStatus;
  nodeStates: Map<string, GraphNodeState>;
  edgeStates: Map<string, GraphEdgeState>;
  /** Set IDs for each node (used in Kruskal's algorithm for Union-Find visualization) */
  nodeSetIds: Map<string, UnionFindSetId>;
  currentStepIndex: number;
  selectedNodeId: string | null;
  /** Total weight of the MST (set on completion) */
  mstTotalWeight: number | null;
  /** Number of edges in the MST (set on completion) */
  mstEdgeCount: number | null;
  /** Whether the graph was found to be disconnected */
  isDisconnected: boolean;
  // Topological sort state
  /** Indegree counts for each node (used in Kahn's algorithm) */
  nodeIndegrees: Map<string, number>;
  /** The topological order result (set on completion) */
  topologicalOrder: string[] | null;
  /** Whether a cycle was detected (graph is not a DAG) */
  hasCycle: boolean;
}

/**
 * Controller actions for graph manipulation and algorithm execution.
 */
export interface GraphControllerActions {
  /** Initialize and run an algorithm on the graph */
  runAlgorithm: (
    algorithm: GraphAlgorithmType,
    graphState: GraphState,
    startNodeId?: string
  ) => void;
  /** Start or resume algorithm playback */
  play: () => void;
  /** Pause algorithm playback */
  pause: () => void;
  /** Execute a single step */
  step: () => void;
  /** Reset visualization state */
  reset: () => void;
  /** Select a node (for algorithm start point, deletion, etc.) */
  selectNode: (nodeId: string | null) => void;
  /** Set the visual state of a node */
  setNodeState: (nodeId: string, state: GraphNodeState) => void;
  /** Set the visual state of an edge */
  setEdgeState: (edgeId: string, state: GraphEdgeState) => void;
  /** Clear all visual states */
  clearVisualStates: () => void;
}

export type UseGraphControllerReturn = GraphControllerState & GraphControllerActions;

export interface GraphContextValue extends UseGraphControllerReturn {
  isReady: boolean;
  intervalMs: number;
  interactionMode: GraphInteractionMode;
  setInteractionMode: (mode: GraphInteractionMode) => void;
}

const GraphProviderContext = createContext<GraphContextValue | null>(null);

export interface GraphProviderProps {
  children: React.ReactNode;
}

/**
 * Hook for managing graph visualization state and algorithm execution.
 */
function useGraphController(intervalMs: number): UseGraphControllerReturn {
  const [status, setStatus] = useState<GraphPlaybackStatus>("idle");
  const [nodeStates, setNodeStates] = useState<Map<string, GraphNodeState>>(new Map());
  const [edgeStates, setEdgeStates] = useState<Map<string, GraphEdgeState>>(new Map());
  const [nodeSetIds, setNodeSetIds] = useState<Map<string, UnionFindSetId>>(new Map());
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [mstTotalWeight, setMstTotalWeight] = useState<number | null>(null);
  const [mstEdgeCount, setMstEdgeCount] = useState<number | null>(null);
  const [isDisconnected, setIsDisconnected] = useState(false);
  // Topological sort state
  const [nodeIndegrees, setNodeIndegrees] = useState<Map<string, number>>(new Map());
  const [topologicalOrder, setTopologicalOrder] = useState<string[] | null>(null);
  const [hasCycle, setHasCycle] = useState(false);

  const iteratorRef = useRef<Generator<GraphStep, void, unknown> | null>(null);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const statusRef = useRef<GraphPlaybackStatus>("idle");

  // Keep statusRef in sync with status
  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  // Apply a single algorithm step to update visual states
  const applyStep = useCallback((step: GraphStep) => {
    switch (step.type) {
      case "start":
        setNodeStates((prev) => {
          const next = new Map(prev);
          next.set(step.nodeId, "source");
          return next;
        });
        break;

      case "visit-node":
        setNodeStates((prev) => {
          const next = new Map(prev);
          next.set(step.nodeId, "visited");
          return next;
        });
        break;

      case "consider-edge":
        setEdgeStates((prev) => {
          const next = new Map(prev);
          next.set(step.edgeId, "considering");
          return next;
        });
        break;

      case "add-to-mst":
        setEdgeStates((prev) => {
          const next = new Map(prev);
          next.set(step.edgeId, "in-mst");
          return next;
        });
        if (step.nodeId) {
          setNodeStates((prev) => {
            const next = new Map(prev);
            next.set(step.nodeId as string, "in-mst");
            return next;
          });
        }
        break;

      case "reject-edge":
        setEdgeStates((prev) => {
          const next = new Map(prev);
          next.set(step.edgeId, "rejected");
          return next;
        });
        break;

      case "extract-min":
        setNodeStates((prev) => {
          const next = new Map(prev);
          next.set(step.nodeId, "current");
          return next;
        });
        break;

      case "update-priority":
        setNodeStates((prev) => {
          const next = new Map(prev);
          // Only update if not already in a more important state
          if (!next.has(step.nodeId) || next.get(step.nodeId) === "idle") {
            next.set(step.nodeId, "processing");
          }
          return next;
        });
        break;

      case "init-sets":
        setNodeSetIds(new Map(step.nodeSets));
        break;

      case "find-set":
        // Just visual feedback - node is being queried
        setNodeStates((prev) => {
          const next = new Map(prev);
          const currentState = next.get(step.nodeId);
          // Flash to processing if idle
          if (!currentState || currentState === "idle") {
            next.set(step.nodeId, "processing");
          }
          return next;
        });
        break;

      case "union-sets":
        // Update set IDs for all affected nodes
        setNodeSetIds((prev) => {
          const next = new Map(prev);
          for (const nodeId of step.affectedNodes) {
            next.set(nodeId, step.toSetId);
          }
          return next;
        });
        break;

      case "complete":
        setMstTotalWeight(step.totalWeight);
        setMstEdgeCount(step.edgeCount);
        break;

      case "disconnected":
        setIsDisconnected(true);
        break;

      // Topological sort steps
      case "init-indegrees":
        setNodeIndegrees(new Map(step.indegrees));
        break;

      case "enqueue-zero":
        setNodeStates((prev) => {
          const next = new Map(prev);
          next.set(step.nodeId, "queued");
          return next;
        });
        break;

      case "dequeue":
        setNodeStates((prev) => {
          const next = new Map(prev);
          next.set(step.nodeId, "current");
          return next;
        });
        break;

      case "process-outgoing-edge":
        setEdgeStates((prev) => {
          const next = new Map(prev);
          next.set(step.edgeId, "considering");
          return next;
        });
        break;

      case "decrement-indegree":
        setNodeIndegrees((prev) => {
          const next = new Map(prev);
          next.set(step.nodeId, step.newIndegree);
          return next;
        });
        // Flash the node to show indegree change
        setNodeStates((prev) => {
          const next = new Map(prev);
          const currentState = next.get(step.nodeId);
          if (!currentState || currentState === "idle") {
            next.set(step.nodeId, "processing");
          }
          return next;
        });
        // Mark all edges in "considering" state as processed after decrement
        setEdgeStates((prev) => {
          const next = new Map(prev);
          for (const [edgeId, state] of prev) {
            if (state === "considering") {
              next.set(edgeId, "processed");
            }
          }
          return next;
        });
        break;

      case "add-to-order":
        setNodeStates((prev) => {
          const next = new Map(prev);
          next.set(step.nodeId, "in-order");
          return next;
        });
        // Mark all outgoing edges from this node as processed
        // This is handled by looking at the edge states after the algorithm runs
        break;

      case "cycle-detected":
        setHasCycle(true);
        break;

      case "topo-complete":
        setTopologicalOrder(step.order);
        break;
    }
  }, []);

  // Execute a single step and check for completion
  const executeStep = useCallback(() => {
    if (!iteratorRef.current) return false;

    const result = iteratorRef.current.next();
    if (result.done) {
      setStatus("complete");
      return false;
    }

    applyStep(result.value);
    setCurrentStepIndex((prev) => prev + 1);
    return true;
  }, [applyStep]);

  // Initialize and run an algorithm
  const runAlgorithm = useCallback(
    (algorithm: GraphAlgorithmType, graphState: GraphState, startNodeId?: string) => {
      // Clear previous state
      setNodeStates(new Map());
      setEdgeStates(new Map());
      setNodeSetIds(new Map());
      setCurrentStepIndex(0);
      setMstTotalWeight(null);
      setMstEdgeCount(null);
      setIsDisconnected(false);
      // Clear topological sort state
      setNodeIndegrees(new Map());
      setTopologicalOrder(null);
      setHasCycle(false);

      // Create the appropriate generator
      const context = { graphState, startNodeId };
      switch (algorithm) {
        case "prim":
          iteratorRef.current = prim(context);
          break;
        case "kruskal":
          iteratorRef.current = kruskal(context);
          break;
        case "kahn":
          iteratorRef.current = kahn(context);
          break;
      }

      // Start in playing state
      setStatus("playing");
    },
    []
  );

  const selectNode = useCallback((nodeId: string | null) => {
    setSelectedNodeId(nodeId);
    // Update visual state for selection
    setNodeStates((prev) => {
      const next = new Map(prev);
      // Clear previous selections
      for (const [id, state] of next) {
        if (state === "selected") {
          next.set(id, "idle");
        }
      }
      // Set new selection
      if (nodeId) {
        next.set(nodeId, "selected");
      }
      return next;
    });
  }, []);

  const setNodeState = useCallback((nodeId: string, state: GraphNodeState) => {
    setNodeStates((prev) => {
      const next = new Map(prev);
      next.set(nodeId, state);
      return next;
    });
  }, []);

  const setEdgeState = useCallback((edgeId: string, state: GraphEdgeState) => {
    setEdgeStates((prev) => {
      const next = new Map(prev);
      next.set(edgeId, state);
      return next;
    });
  }, []);

  const clearVisualStates = useCallback(() => {
    setNodeStates(new Map());
    setEdgeStates(new Map());
    setNodeSetIds(new Map());
  }, []);

  const reset = useCallback(() => {
    // Clear interval if running
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
    setStatus("idle");
    setNodeStates(new Map());
    setEdgeStates(new Map());
    setNodeSetIds(new Map());
    setCurrentStepIndex(0);
    setSelectedNodeId(null);
    setMstTotalWeight(null);
    setMstEdgeCount(null);
    setIsDisconnected(false);
    // Clear topological sort state
    setNodeIndegrees(new Map());
    setTopologicalOrder(null);
    setHasCycle(false);
    iteratorRef.current = null;
  }, []);

  const play = useCallback(() => {
    if (status === "complete") return;
    if (status === "idle" && !iteratorRef.current) return;
    setStatus("playing");
  }, [status]);

  const pause = useCallback(() => {
    if (status === "playing") {
      setStatus("paused");
    }
  }, [status]);

  const step = useCallback(() => {
    if (status === "complete") return;
    if (status === "playing") {
      setStatus("paused");
    }
    executeStep();
  }, [status, executeStep]);

  // Auto-play effect: run steps at interval when playing
  useEffect(() => {
    if (status !== "playing") {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
      return;
    }

    intervalIdRef.current = setInterval(() => {
      // Check status via ref to avoid stale closure
      if (statusRef.current !== "playing") {
        if (intervalIdRef.current) {
          clearInterval(intervalIdRef.current);
          intervalIdRef.current = null;
        }
        return;
      }

      const hasMore = executeStep();
      if (!hasMore && intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    }, intervalMs);

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    };
  }, [status, intervalMs, executeStep]);

  return {
    status,
    nodeStates,
    edgeStates,
    nodeSetIds,
    currentStepIndex,
    selectedNodeId,
    mstTotalWeight,
    mstEdgeCount,
    isDisconnected,
    // Topological sort state
    nodeIndegrees,
    topologicalOrder,
    hasCycle,
    runAlgorithm,
    play,
    pause,
    step,
    reset,
    selectNode,
    setNodeState,
    setEdgeState,
    clearVisualStates,
  };
}

export function GraphProvider({ children }: GraphProviderProps) {
  const playbackSpeed = useYieldStore((state) => state.playbackSpeed);
  const graphAlgorithm = useYieldStore((state) => state.graphAlgorithm);

  // Calculate interval from speed multiplier
  const intervalMs = useMemo(() => speedMultiplierToInterval(playbackSpeed), [playbackSpeed]);

  // Use the graph controller
  const controller = useGraphController(intervalMs);

  // Interaction mode state (kept in context for cross-component access)
  const [interactionMode, setInteractionMode] = useState<GraphInteractionMode>({ type: "idle" });

  // Track previous algorithm to detect changes
  const prevAlgorithmRef = useRef(graphAlgorithm);
  useEffect(() => {
    if (prevAlgorithmRef.current !== graphAlgorithm) {
      prevAlgorithmRef.current = graphAlgorithm;
      controller.reset();
    }
  }, [graphAlgorithm, controller]);

  const value: GraphContextValue = useMemo(
    () => ({
      ...controller,
      isReady: true,
      intervalMs,
      interactionMode,
      setInteractionMode,
    }),
    [controller, intervalMs, interactionMode]
  );

  return <GraphProviderContext.Provider value={value}>{children}</GraphProviderContext.Provider>;
}

export function useGraph(): GraphContextValue {
  const context = useContext(GraphProviderContext);
  if (!context) {
    throw new Error("useGraph must be used within a GraphProvider");
  }
  return context;
}
