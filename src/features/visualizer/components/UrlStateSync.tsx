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
 * Parses a comma-separated array string into a number array.
 * Returns null if parsing fails or input is invalid.
 * Format: "5,4,3,2,1" -> [5, 4, 3, 2, 1]
 */
function parseArrayParam(arrayParam: string | null): number[] | null {
  if (!arrayParam) return null;

  const parts = arrayParam.split(",").map((s) => s.trim());
  const numbers: number[] = [];

  for (const part of parts) {
    const num = Number(part);
    // Validate: must be a finite number
    if (!Number.isFinite(num)) {
      return null;
    }
    numbers.push(num);
  }

  // Must have at least 2 elements to be a valid sorting input
  if (numbers.length < 2) {
    return null;
  }

  return numbers;
}

/**
 * Syncs URL search params to the Zustand store on mount.
 * Enables deep linking: /?mode=sorting&algorithm=quick&array=5,4,3,2,1
 */
export function UrlStateSync() {
  const searchParams = useSearchParams();
  const setMode = useYieldStore((state) => state.setMode);
  const setSortingAlgorithm = useYieldStore((state) => state.setSortingAlgorithm);
  const setInitialArray = useYieldStore((state) => state.setInitialArray);

  useEffect(() => {
    const mode = searchParams.get("mode");
    const algorithm = searchParams.get("algorithm");
    const arrayParam = searchParams.get("array");

    // Hydrate mode if valid
    if (mode && isValidMode(mode)) {
      setMode(mode);
    }

    // Hydrate sorting algorithm if valid and mode is sorting
    if (algorithm && isValidSortingAlgorithm(algorithm)) {
      setSortingAlgorithm(algorithm);
    }

    // Hydrate initial array for "Try It" demos
    const parsedArray = parseArrayParam(arrayParam);
    if (parsedArray) {
      setInitialArray(parsedArray);
    }
  }, [searchParams, setMode, setSortingAlgorithm, setInitialArray]);

  // This component renders nothing - it's purely for side effects
  return null;
}
