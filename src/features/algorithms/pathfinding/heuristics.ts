import type { GridCoord, HeuristicType } from "@/lib/store";

/**
 * Heuristic function signature.
 * Takes two coordinates and returns an estimated distance.
 */
export type HeuristicFunction = (a: GridCoord, b: GridCoord) => number;

/**
 * Manhattan distance heuristic.
 * Sum of absolute differences in x and y coordinates.
 *
 * Best for: 4-way grid movement (up, down, left, right).
 * Visual pattern: Diamond-shaped expansion from the goal.
 *
 * Formula: |x1 - x2| + |y1 - y2|
 */
export function manhattan(a: GridCoord, b: GridCoord): number {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

/**
 * Euclidean distance heuristic.
 * Straight-line distance "as the crow flies".
 *
 * Best for: Any-angle movement or continuous spaces.
 * Visual pattern: Circular expansion from the goal.
 *
 * Formula: sqrt((x1 - x2)² + (y1 - y2)²)
 */
export function euclidean(a: GridCoord, b: GridCoord): number {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Chebyshev distance heuristic (Chessboard distance).
 * Maximum of absolute differences in x and y coordinates.
 *
 * Best for: 8-way grid movement (including diagonals, "King's moves").
 * Visual pattern: Square-shaped expansion from the goal.
 *
 * Formula: max(|x1 - x2|, |y1 - y2|)
 */
export function chebyshev(a: GridCoord, b: GridCoord): number {
  return Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]));
}

/**
 * Get the heuristic function for a given type.
 */
export function getHeuristic(type: HeuristicType): HeuristicFunction {
  switch (type) {
    case "euclidean":
      return euclidean;
    case "chebyshev":
      return chebyshev;
    default:
      return manhattan;
  }
}

/**
 * Metadata for each heuristic type.
 */
export interface HeuristicMetadata {
  label: string;
  shortLabel: string;
  description: string;
  formula: string;
  bestFor: string;
  visualPattern: string;
}

/**
 * Heuristic metadata registry.
 */
export const HEURISTIC_METADATA: Record<HeuristicType, HeuristicMetadata> = {
  manhattan: {
    label: "Manhattan",
    shortLabel: "Man",
    description: "Sum of horizontal and vertical distances",
    formula: "|Δx| + |Δy|",
    bestFor: "4-way grids",
    visualPattern: "Diamond",
  },
  euclidean: {
    label: "Euclidean",
    shortLabel: "Euc",
    description: "Straight-line distance (as the crow flies)",
    formula: "√(Δx² + Δy²)",
    bestFor: "Any-angle movement",
    visualPattern: "Circle",
  },
  chebyshev: {
    label: "Chebyshev",
    shortLabel: "Cheb",
    description: "Maximum of horizontal and vertical distances",
    formula: "max(|Δx|, |Δy|)",
    bestFor: "8-way grids (King's moves)",
    visualPattern: "Square",
  },
};
