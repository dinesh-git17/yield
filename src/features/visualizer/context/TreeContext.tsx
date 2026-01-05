"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import {
  type UseTreeControllerOptions,
  type UseTreeControllerReturn,
  useTreeController,
} from "@/features/algorithms/hooks";
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

export interface TreeContextValue extends UseTreeControllerReturn {
  isReady: boolean;
}

const TreeProviderContext = createContext<TreeContextValue | null>(null);

export interface TreeProviderProps {
  children: React.ReactNode;
}

export function TreeProvider({ children }: TreeProviderProps) {
  const treeState = useYieldStore((state) => state.treeState);
  const treeDataStructure = useYieldStore((state) => state.treeDataStructure);
  const playbackSpeed = useYieldStore((state) => state.playbackSpeed);
  const swapNodeChildren = useYieldStore((state) => state.swapNodeChildren);

  // Calculate interval from speed multiplier
  const intervalMs = useMemo(() => speedMultiplierToInterval(playbackSpeed), [playbackSpeed]);

  // Callback for invert operation - swaps children in the store
  const handleInvertSwap = useCallback(
    (nodeId: string) => {
      swapNodeChildren(nodeId);
    },
    [swapNodeChildren]
  );

  // Controller options with callbacks
  const options: UseTreeControllerOptions = useMemo(
    () => ({
      onInvertSwap: handleInvertSwap,
    }),
    [handleInvertSwap]
  );

  // Use the tree controller (data-structure-aware)
  const controller = useTreeController(treeState, treeDataStructure, intervalMs, options);

  const value: TreeContextValue = useMemo(
    () => ({
      ...controller,
      isReady: true,
    }),
    [controller]
  );

  return <TreeProviderContext.Provider value={value}>{children}</TreeProviderContext.Provider>;
}

export function useTree(): TreeContextValue {
  const context = useContext(TreeProviderContext);
  if (!context) {
    throw new Error("useTree must be used within a TreeProvider");
  }
  return context;
}
