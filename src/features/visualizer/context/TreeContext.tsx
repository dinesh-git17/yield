"use client";

import { createContext, useContext, useMemo } from "react";
import { type UseTreeControllerReturn, useTreeController } from "@/features/algorithms/hooks";
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
  const playbackSpeed = useYieldStore((state) => state.playbackSpeed);

  // Calculate interval from speed multiplier
  const intervalMs = useMemo(() => speedMultiplierToInterval(playbackSpeed), [playbackSpeed]);

  // Use the tree controller
  const controller = useTreeController(treeState, intervalMs);

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
