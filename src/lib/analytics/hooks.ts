"use client";

/**
 * Analytics Hooks
 *
 * Convenience hooks for tracking specific events from React components.
 * These are used by controller hooks and UI components.
 */

import { useCallback, useRef } from "react";

import type { VisualizerMode } from "@/lib/store";

import { analytics } from "./service";
import { ANALYTICS_EVENTS } from "./types";

// =============================================================================
// Simulation Tracking Hook
// =============================================================================

interface SimulationTrackingOptions {
  mode: VisualizerMode;
  algorithmName: string;
  arraySize?: number;
  gridSize?: { rows: number; cols: number };
  treeNodeCount?: number;
  graphNodeCount?: number;
}

/**
 * Hook for tracking simulation start/complete events.
 * Returns stable callbacks that can be called from controller hooks.
 */
export function useSimulationTracking(options: SimulationTrackingOptions) {
  const startTimeRef = useRef<number | null>(null);
  const stepCountRef = useRef<number>(0);

  const trackStart = useCallback(() => {
    startTimeRef.current = Date.now();
    stepCountRef.current = 0;

    analytics.trackEvent({
      name: ANALYTICS_EVENTS.SIMULATION_START,
      payload: {
        algorithm_name: options.algorithmName,
        mode: options.mode,
        array_size: options.arraySize,
        grid_size: options.gridSize,
        tree_node_count: options.treeNodeCount,
        graph_node_count: options.graphNodeCount,
      },
    });
  }, [
    options.algorithmName,
    options.mode,
    options.arraySize,
    options.gridSize,
    options.treeNodeCount,
    options.graphNodeCount,
  ]);

  const trackStep = useCallback(() => {
    stepCountRef.current += 1;
  }, []);

  const trackComplete = useCallback(() => {
    const startTime = startTimeRef.current;
    if (startTime === null) return;

    const durationMs = Date.now() - startTime;

    analytics.trackEvent({
      name: ANALYTICS_EVENTS.SIMULATION_COMPLETE,
      payload: {
        algorithm_name: options.algorithmName,
        mode: options.mode,
        duration_ms: durationMs,
        step_count: stepCountRef.current,
        array_size: options.arraySize,
        grid_size: options.gridSize,
      },
    });

    startTimeRef.current = null;
    stepCountRef.current = 0;
  }, [options.algorithmName, options.mode, options.arraySize, options.gridSize]);

  const trackReset = useCallback(() => {
    startTimeRef.current = null;
    stepCountRef.current = 0;

    analytics.trackEvent({
      name: ANALYTICS_EVENTS.SIMULATION_RESET,
      payload: {
        mode: options.mode,
      },
    });
  }, [options.mode]);

  return {
    trackStart,
    trackStep,
    trackComplete,
    trackReset,
  };
}

// =============================================================================
// UI Interaction Tracking
// =============================================================================

/**
 * Track code panel open/close events.
 */
export function trackCodePanel(
  action: "open" | "close",
  algorithmName: string,
  mode: VisualizerMode
) {
  analytics.trackEvent({
    name: ANALYTICS_EVENTS.CODE_PANEL,
    payload: {
      action,
      algorithm_name: algorithmName,
      mode,
    },
  });
}

/**
 * Track complexity modal open/close events.
 */
export function trackComplexityModal(
  action: "open" | "close",
  algorithmName: string,
  mode: VisualizerMode
) {
  analytics.trackEvent({
    name: ANALYTICS_EVENTS.COMPLEXITY_MODAL,
    payload: {
      action,
      algorithm_name: algorithmName,
      mode,
    },
  });
}

/**
 * Track grid interactions (pathfinding mode).
 */
export function trackGridInteraction(
  interactionType: "wall_toggle" | "start_move" | "end_move" | "clear",
  gridSize: { rows: number; cols: number }
) {
  analytics.trackEvent({
    name: ANALYTICS_EVENTS.GRID_INTERACTION,
    payload: {
      interaction_type: interactionType,
      grid_size: gridSize,
    },
  });
}

/**
 * Track maze generation events.
 */
export function trackMazeGenerated(algorithm: string, gridSize: { rows: number; cols: number }) {
  analytics.trackEvent({
    name: ANALYTICS_EVENTS.MAZE_GENERATED,
    payload: {
      algorithm,
      grid_size: gridSize,
    },
  });
}

/**
 * Track tree operations.
 */
export function trackTreeOperation(
  operation: "insert" | "search" | "delete" | "traversal",
  dataStructure: "bst" | "avl" | "max-heap",
  options?: {
    traversalType?: "inorder" | "preorder" | "postorder" | "levelorder";
    value?: number;
    found?: boolean;
  }
) {
  analytics.trackEvent({
    name: ANALYTICS_EVENTS.TREE_OPERATION,
    payload: {
      operation,
      data_structure: dataStructure,
      traversal_type: options?.traversalType,
      value: options?.value,
      found: options?.found,
    },
  });
}

/**
 * Track graph operations.
 */
export function trackGraphOperation(algorithm: string, nodeCount: number, edgeCount: number) {
  analytics.trackEvent({
    name: ANALYTICS_EVENTS.GRAPH_OPERATION,
    payload: {
      algorithm,
      node_count: nodeCount,
      edge_count: edgeCount,
    },
  });
}
