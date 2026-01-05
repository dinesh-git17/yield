"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { type SortingAlgorithmType, useYieldStore, type VisualizerMode } from "@/lib/store";

const VALID_MODES: VisualizerMode[] = ["sorting", "pathfinding", "tree", "graph"];
const VALID_SORTING_ALGORITHMS: SortingAlgorithmType[] = [
  "bubble",
  "selection",
  "insertion",
  "gnome",
  "quick",
  "merge",
  "heap",
];

function isValidMode(mode: string): mode is VisualizerMode {
  return VALID_MODES.includes(mode as VisualizerMode);
}

function isValidSortingAlgorithm(algorithm: string): algorithm is SortingAlgorithmType {
  return VALID_SORTING_ALGORITHMS.includes(algorithm as SortingAlgorithmType);
}

/**
 * Syncs URL search params to the Zustand store on mount.
 * Enables deep linking: /?mode=sorting&algorithm=quick
 */
export function UrlStateSync() {
  const searchParams = useSearchParams();
  const setMode = useYieldStore((state) => state.setMode);
  const setSortingAlgorithm = useYieldStore((state) => state.setSortingAlgorithm);

  useEffect(() => {
    const mode = searchParams.get("mode");
    const algorithm = searchParams.get("algorithm");

    // Hydrate mode if valid
    if (mode && isValidMode(mode)) {
      setMode(mode);
    }

    // Hydrate sorting algorithm if valid and mode is sorting
    if (algorithm && isValidSortingAlgorithm(algorithm)) {
      setSortingAlgorithm(algorithm);
    }
  }, [searchParams, setMode, setSortingAlgorithm]);

  // This component renders nothing - it's purely for side effects
  return null;
}
