"use client";

import { useEffect, useRef } from "react";

import { ANALYTICS_EVENTS, analytics } from "@/lib/analytics";
import type { VisualizerMode, YieldStore } from "@/lib/store";
import { useYieldStore } from "@/lib/store";

// =============================================================================
// Types
// =============================================================================

/** Tracked state subset for comparison */
interface TrackedState {
  mode: VisualizerMode;
  sortingAlgorithm: string;
  pathfindingAlgorithm: string;
  pathfindingHeuristic: string;
  treeAlgorithm: string;
  treeDataStructure: string;
  graphAlgorithm: string;
  playbackSpeed: number;
  arraySize: number;
  gridRows: number;
  gridCols: number;
}

// =============================================================================
// Store Selector
// =============================================================================

/** Select only the state needed for analytics tracking */
function selectTrackedState(state: YieldStore): TrackedState {
  return {
    mode: state.mode,
    sortingAlgorithm: state.sortingAlgorithm,
    pathfindingAlgorithm: state.pathfindingAlgorithm,
    pathfindingHeuristic: state.pathfindingHeuristic,
    treeAlgorithm: state.treeAlgorithm,
    treeDataStructure: state.treeDataStructure,
    graphAlgorithm: state.graphAlgorithm,
    playbackSpeed: state.playbackSpeed,
    arraySize: state.arraySize,
    gridRows: state.gridConfig.rows,
    gridCols: state.gridConfig.cols,
  };
}

// =============================================================================
// Component
// =============================================================================

/**
 * Analytics Subscriber
 *
 * Subscribes to Zustand store changes and fires analytics events.
 * Uses useEffect to set up subscription outside of React render cycles.
 *
 * Events tracked:
 * - Mode changes (sorting → pathfinding, etc.)
 * - Algorithm selection changes
 * - Playback speed changes
 * - Array size changes
 * - Heuristic changes (pathfinding)
 * - Data structure changes (tree)
 */
export function AnalyticsSubscriber() {
  const prevStateRef = useRef<TrackedState | null>(null);

  useEffect(() => {
    // Get initial state
    prevStateRef.current = selectTrackedState(useYieldStore.getState());

    // Subscribe to store changes
    const unsubscribe = useYieldStore.subscribe((state) => {
      const currentState = selectTrackedState(state);
      const prevState = prevStateRef.current;

      if (!prevState) {
        prevStateRef.current = currentState;
        return;
      }

      // Track mode changes
      if (currentState.mode !== prevState.mode) {
        analytics.trackEvent({
          name: ANALYTICS_EVENTS.MODE_CHANGED,
          payload: {
            mode: currentState.mode,
            previous_mode: prevState.mode,
          },
        });
      }

      // Track algorithm selection changes (based on current mode)
      if (
        currentState.mode === "sorting" &&
        currentState.sortingAlgorithm !== prevState.sortingAlgorithm
      ) {
        analytics.trackEvent({
          name: ANALYTICS_EVENTS.ALGORITHM_SELECTED,
          payload: {
            algorithm_name: currentState.sortingAlgorithm,
            mode: "sorting",
            previous_algorithm: prevState.sortingAlgorithm,
          },
        });
      }

      if (
        currentState.mode === "pathfinding" &&
        currentState.pathfindingAlgorithm !== prevState.pathfindingAlgorithm
      ) {
        analytics.trackEvent({
          name: ANALYTICS_EVENTS.ALGORITHM_SELECTED,
          payload: {
            algorithm_name: currentState.pathfindingAlgorithm,
            mode: "pathfinding",
            previous_algorithm: prevState.pathfindingAlgorithm,
          },
        });
      }

      if (currentState.mode === "tree" && currentState.treeAlgorithm !== prevState.treeAlgorithm) {
        analytics.trackEvent({
          name: ANALYTICS_EVENTS.ALGORITHM_SELECTED,
          payload: {
            algorithm_name: currentState.treeAlgorithm,
            mode: "tree",
            previous_algorithm: prevState.treeAlgorithm,
          },
        });
      }

      if (
        currentState.mode === "graph" &&
        currentState.graphAlgorithm !== prevState.graphAlgorithm
      ) {
        analytics.trackEvent({
          name: ANALYTICS_EVENTS.ALGORITHM_SELECTED,
          payload: {
            algorithm_name: currentState.graphAlgorithm,
            mode: "graph",
            previous_algorithm: prevState.graphAlgorithm,
          },
        });
      }

      // Track playback speed changes
      if (currentState.playbackSpeed !== prevState.playbackSpeed) {
        analytics.trackEvent({
          name: ANALYTICS_EVENTS.SPEED_CHANGE,
          payload: {
            speed: currentState.playbackSpeed,
            mode: currentState.mode,
          },
        });
      }

      // Track array size changes (sorting mode)
      if (currentState.arraySize !== prevState.arraySize) {
        analytics.trackEvent({
          name: ANALYTICS_EVENTS.ARRAY_SIZE_CHANGE,
          payload: {
            size: currentState.arraySize,
            previous_size: prevState.arraySize,
          },
        });
      }

      // Track heuristic changes (pathfinding)
      if (currentState.pathfindingHeuristic !== prevState.pathfindingHeuristic) {
        analytics.trackEvent({
          name: ANALYTICS_EVENTS.HEURISTIC_CHANGE,
          payload: {
            heuristic: currentState.pathfindingHeuristic,
          },
        });
      }

      // Track data structure changes (tree)
      if (currentState.treeDataStructure !== prevState.treeDataStructure) {
        analytics.trackEvent({
          name: ANALYTICS_EVENTS.DATA_STRUCTURE_CHANGE,
          payload: {
            data_structure: currentState.treeDataStructure,
            previous: prevState.treeDataStructure,
          },
        });
      }

      // Update previous state
      prevStateRef.current = currentState;
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // This component renders nothing - it only subscribes to store changes
  return null;
}
