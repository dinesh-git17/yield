import type { MazeAlgorithmType } from "./types";

/**
 * Metadata for each maze generation algorithm.
 */
export interface MazeAlgorithmMetadata {
  /** Display name for the algorithm */
  label: string;
  /** Short description of how the algorithm works */
  description: string;
}

/**
 * Maze algorithm metadata registry.
 */
export const MAZE_ALGO_METADATA: Record<MazeAlgorithmType, MazeAlgorithmMetadata> = {
  random: {
    label: "Random Noise",
    description: "Scattered rubble with 30% wall density",
  },
  recursiveDivision: {
    label: "Recursive Division",
    description: "Structured chambers with single gaps",
  },
  backtracker: {
    label: "Backtracker",
    description: "Perfect maze with winding corridors",
  },
};

/**
 * Ordered list of maze algorithms for UI display.
 */
export const MAZE_ALGORITHM_ORDER: MazeAlgorithmType[] = [
  "random",
  "recursiveDivision",
  "backtracker",
];

/**
 * Get metadata for a specific maze algorithm.
 */
export function getMazeAlgorithmMetadata(algorithm: MazeAlgorithmType): MazeAlgorithmMetadata {
  return MAZE_ALGO_METADATA[algorithm];
}
