import type { GridCoord } from "@/lib/store";

/**
 * Represents a single step in a pathfinding algorithm execution.
 * Used by generator functions to yield operations for visualization.
 */
export type PathfindingStep =
  | {
      type: "visit";
      coord: GridCoord;
      /** Distance from start node (for heat map visualization) */
      distance: number;
    }
  | {
      type: "current";
      coord: GridCoord;
      /** Distance from start node */
      distance: number;
    }
  | {
      type: "path";
      coord: GridCoord;
    }
  | {
      type: "no-path";
    };

/**
 * Grid context passed to pathfinding algorithms.
 */
export interface PathfindingContext {
  /** Grid dimensions */
  rows: number;
  cols: number;
  /** Start position */
  start: GridCoord;
  /** End position */
  end: GridCoord;
  /** Set of wall coordinates as "row-col" strings */
  walls: Set<string>;
}

/**
 * Signature for pathfinding generator functions.
 */
export type PathfindingGenerator = (
  context: PathfindingContext
) => Generator<PathfindingStep, void, unknown>;

/**
 * Cardinal directions for grid traversal.
 * Order: Up, Right, Down, Left (clockwise from top)
 */
export const DIRECTIONS: readonly GridCoord[] = [
  [-1, 0], // Up
  [0, 1], // Right
  [1, 0], // Down
  [0, -1], // Left
] as const;

/**
 * Check if a coordinate is within grid bounds.
 */
export function isInBounds(coord: GridCoord, rows: number, cols: number): boolean {
  const [r, c] = coord;
  return r >= 0 && r < rows && c >= 0 && c < cols;
}

/**
 * Check if two coordinates are equal.
 */
export function coordsEqual(a: GridCoord, b: GridCoord): boolean {
  return a[0] === b[0] && a[1] === b[1];
}

/**
 * Convert coord to string key for Set/Map operations.
 */
export function toKey(coord: GridCoord): string {
  return `${coord[0]}-${coord[1]}`;
}

/**
 * Convert string key back to coord.
 */
export function fromKey(key: string): GridCoord {
  const parts = key.split("-").map(Number);
  return [parts[0] ?? 0, parts[1] ?? 0];
}

/**
 * Get valid neighbors for a coordinate.
 */
export function getNeighbors(coord: GridCoord, context: PathfindingContext): GridCoord[] {
  const [r, c] = coord;
  const neighbors: GridCoord[] = [];

  for (const [dr, dc] of DIRECTIONS) {
    const newCoord: GridCoord = [r + dr, c + dc];
    const key = toKey(newCoord);

    if (isInBounds(newCoord, context.rows, context.cols) && !context.walls.has(key)) {
      neighbors.push(newCoord);
    }
  }

  return neighbors;
}
