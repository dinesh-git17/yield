"use client";

import { createContext, useContext, useEffect, useMemo } from "react";
import {
  type PathfindingStepType,
  type UsePathfindingControllerReturn,
  usePathfindingController,
} from "@/features/algorithms/hooks";
import type { PathfindingContext as PathfindingContextType } from "@/features/algorithms/pathfinding";
import type { PlaybackSpeedMultiplier } from "@/lib/store";
import { useYieldStore } from "@/lib/store";

/**
 * Converts playback speed multiplier to interval in milliseconds.
 * Higher multiplier = faster playback = shorter interval.
 * Base interval is 100ms at 1x speed (faster than sorting due to more steps).
 */
const BASE_INTERVAL_MS = 100;
function speedMultiplierToInterval(multiplier: PlaybackSpeedMultiplier): number {
  return Math.round(BASE_INTERVAL_MS / multiplier);
}

export interface PathfindingContextValue extends UsePathfindingControllerReturn {
  isReady: boolean;
}

const PathfindingProviderContext = createContext<PathfindingContextValue | null>(null);

export interface PathfindingProviderProps {
  children: React.ReactNode;
}

export function PathfindingProvider({ children }: PathfindingProviderProps) {
  const pathfindingAlgorithm = useYieldStore((state) => state.pathfindingAlgorithm);
  const gridConfig = useYieldStore((state) => state.gridConfig);
  const nodeState = useYieldStore((state) => state.nodeState);
  const playbackSpeed = useYieldStore((state) => state.playbackSpeed);

  // Build pathfinding context from store state
  const context: PathfindingContextType = useMemo(
    () => ({
      rows: gridConfig.rows,
      cols: gridConfig.cols,
      start: nodeState.start,
      end: nodeState.end,
      walls: nodeState.walls,
    }),
    [gridConfig, nodeState]
  );

  // Use the pathfinding controller
  const controller = usePathfindingController(context, pathfindingAlgorithm);

  // Sync store's playback speed to controller
  useEffect(() => {
    const intervalMs = speedMultiplierToInterval(playbackSpeed);
    controller.setSpeed(intervalMs);
  }, [playbackSpeed, controller.setSpeed]);

  const value: PathfindingContextValue = useMemo(
    () => ({
      ...controller,
      isReady: true,
    }),
    [controller]
  );

  return (
    <PathfindingProviderContext.Provider value={value}>
      {children}
    </PathfindingProviderContext.Provider>
  );
}

export function usePathfinding(): PathfindingContextValue {
  const context = useContext(PathfindingProviderContext);
  if (!context) {
    throw new Error("usePathfinding must be used within a PathfindingProvider");
  }
  return context;
}

export type { PathfindingStepType };
