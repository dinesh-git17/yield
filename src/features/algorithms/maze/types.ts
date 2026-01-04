import type { GridCoord } from "@/lib/store";

/**
 * Represents a single step in a maze generation algorithm.
 * Used by generator functions to yield wall placements for visualization.
 */
export type MazeStep =
  | {
      type: "wall";
      coord: GridCoord;
    }
  | {
      type: "empty";
      coord: GridCoord;
    }
  | {
      type: "complete";
    };

/**
 * Context passed to maze generation algorithms.
 */
export interface MazeContext {
  /** Grid dimensions */
  rows: number;
  cols: number;
  /** Start position (must remain empty) */
  start: GridCoord;
  /** End position (must remain empty) */
  end: GridCoord;
}

/**
 * Signature for maze generation generator functions.
 */
export type MazeGenerator = (context: MazeContext) => Generator<MazeStep, void, unknown>;

/**
 * Supported maze generation algorithms.
 */
export type MazeAlgorithmType = "random" | "recursiveDivision" | "backtracker";

/**
 * Convert coord to string key for Set/Map operations.
 */
export function toKey(coord: GridCoord): string {
  return `${coord[0]}-${coord[1]}`;
}
