"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import type { PlaybackSpeedMultiplier } from "@/lib/store";
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
  | "current";

/**
 * Visual state for a graph edge during algorithm execution.
 */
export type GraphEdgeState = "idle" | "considering" | "in-mst" | "rejected" | "highlighted";

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
  currentStepIndex: number;
  selectedNodeId: string | null;
}

/**
 * Controller actions for graph manipulation and algorithm execution.
 */
export interface GraphControllerActions {
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
function useGraphController(): UseGraphControllerReturn {
  const [status, setStatus] = useState<GraphPlaybackStatus>("idle");
  const [nodeStates, setNodeStates] = useState<Map<string, GraphNodeState>>(new Map());
  const [edgeStates, setEdgeStates] = useState<Map<string, GraphEdgeState>>(new Map());
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const iteratorRef = useRef<Generator<unknown, void, unknown> | null>(null);

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
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setNodeStates(new Map());
    setEdgeStates(new Map());
    setCurrentStepIndex(0);
    setSelectedNodeId(null);
    iteratorRef.current = null;
  }, []);

  const play = useCallback(() => {
    if (status === "complete" || status === "idle") return;
    if (status === "paused") {
      setStatus("playing");
    }
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
    // Process next step (to be implemented with algorithms)
    setCurrentStepIndex((prev) => prev + 1);
  }, [status]);

  return {
    status,
    nodeStates,
    edgeStates,
    currentStepIndex,
    selectedNodeId,
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

  // Calculate interval from speed multiplier
  const intervalMs = useMemo(() => speedMultiplierToInterval(playbackSpeed), [playbackSpeed]);

  // Use the graph controller
  const controller = useGraphController();

  // Interaction mode state (kept in context for cross-component access)
  const [interactionMode, setInteractionMode] = useState<GraphInteractionMode>({ type: "idle" });

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
