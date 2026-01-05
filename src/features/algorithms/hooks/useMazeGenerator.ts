"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  backtracker,
  type MazeAlgorithmType,
  type MazeContext,
  type MazeStep,
  randomNoise,
  recursiveDivision,
  toKey,
} from "@/features/algorithms/maze";
import { useYieldStore } from "@/lib/store";

/**
 * Returns the appropriate maze generator for the given type.
 */
function getMazeGenerator(
  algorithm: MazeAlgorithmType,
  context: MazeContext
): Generator<MazeStep, void, unknown> {
  switch (algorithm) {
    case "random":
      return randomNoise(context);
    case "recursiveDivision":
      return recursiveDivision(context);
    case "backtracker":
      return backtracker(context);
    default:
      return randomNoise(context);
  }
}

/**
 * Speed in milliseconds per wall placement.
 * Fast enough to see the animation but not too slow.
 */
const GENERATION_SPEED_MS = 5;

export interface UseMazeGeneratorReturn {
  /** Start generating a maze with the specified algorithm */
  generate: (algorithm: MazeAlgorithmType) => void;
  /** Stop the current generation */
  stop: () => void;
}

/**
 * Hook for running maze generation algorithms with animated wall placement.
 *
 * Manages the `isGeneratingMaze` store state and updates walls incrementally
 * as the generator yields steps.
 */
export function useMazeGenerator(): UseMazeGeneratorReturn {
  const gridConfig = useYieldStore((state) => state.gridConfig);
  // Select start/end individually to avoid re-renders when walls change
  const start = useYieldStore((state) => state.nodeState.start);
  const end = useYieldStore((state) => state.nodeState.end);
  const setWalls = useYieldStore((state) => state.setWalls);
  const clearWalls = useYieldStore((state) => state.clearWalls);
  const setIsGeneratingMaze = useYieldStore((state) => state.setIsGeneratingMaze);

  const iteratorRef = useRef<Generator<MazeStep, void, unknown> | null>(null);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const wallsRef = useRef<Set<string>>(new Set());

  /**
   * Clean up the interval timer.
   */
  const cleanup = useCallback(() => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
  }, []);

  /**
   * Stop the current generation.
   */
  const stop = useCallback(() => {
    cleanup();
    iteratorRef.current = null;
    setIsGeneratingMaze(false);
  }, [cleanup, setIsGeneratingMaze]);

  /**
   * Fill the entire grid with walls (for backtracker algorithm).
   */
  const fillAllWalls = useCallback(() => {
    const walls = new Set<string>();
    const startKey = toKey(start);
    const endKey = toKey(end);

    for (let r = 0; r < gridConfig.rows; r++) {
      for (let c = 0; c < gridConfig.cols; c++) {
        const key = toKey([r, c]);
        // Don't fill start and end positions
        if (key !== startKey && key !== endKey) {
          walls.add(key);
        }
      }
    }

    wallsRef.current = walls;
    setWalls(new Set(walls));
  }, [gridConfig, start, end, setWalls]);

  /**
   * Start generating a maze with the specified algorithm.
   */
  const generate = useCallback(
    (algorithm: MazeAlgorithmType) => {
      // Stop any existing generation
      stop();

      // For backtracker, fill the entire grid with walls first
      // Other algorithms start with an empty grid
      if (algorithm === "backtracker") {
        fillAllWalls();
      } else {
        clearWalls();
        wallsRef.current = new Set();
      }

      // Create context
      const context: MazeContext = {
        rows: gridConfig.rows,
        cols: gridConfig.cols,
        start,
        end,
      };

      // Initialize generator
      iteratorRef.current = getMazeGenerator(algorithm, context);
      setIsGeneratingMaze(true);

      // Run the generator with animation
      intervalIdRef.current = setInterval(() => {
        const iterator = iteratorRef.current;
        if (!iterator) {
          stop();
          return;
        }

        const result = iterator.next();

        if (result.done) {
          stop();
          return;
        }

        const step = result.value;

        switch (step.type) {
          case "wall": {
            const key = toKey(step.coord);
            wallsRef.current.add(key);
            setWalls(new Set(wallsRef.current));
            break;
          }
          case "empty": {
            const key = toKey(step.coord);
            wallsRef.current.delete(key);
            setWalls(new Set(wallsRef.current));
            break;
          }
          case "complete":
            stop();
            break;
        }
      }, GENERATION_SPEED_MS);
    },
    [gridConfig, start, end, clearWalls, fillAllWalls, setWalls, setIsGeneratingMaze, stop]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return { generate, stop };
}
