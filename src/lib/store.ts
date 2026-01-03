import { create } from "zustand";

// ─────────────────────────────────────────────────────────────────────────────
// Mode & Algorithm Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The two visualization domains supported by Yield.
 */
export type VisualizerMode = "sorting" | "pathfinding";

/**
 * Supported sorting algorithms.
 */
export type SortingAlgorithmType =
  | "bubble"
  | "selection"
  | "insertion"
  | "gnome"
  | "quick"
  | "merge"
  | "heap";

/**
 * Supported pathfinding algorithms.
 */
export type PathfindingAlgorithmType =
  | "bfs"
  | "dfs"
  | "dijkstra"
  | "astar"
  | "greedy"
  | "random"
  | "flood"
  | "bidirectional";

/**
 * Heuristic functions for informed search algorithms (A*, Greedy).
 */
export type HeuristicType = "manhattan" | "euclidean" | "chebyshev";

/**
 * Algorithms that use heuristics.
 */
export const HEURISTIC_ALGORITHMS: PathfindingAlgorithmType[] = [
  "astar",
  "greedy",
  "bidirectional",
];

/**
 * Playback speed multipliers.
 * Maps to actual interval timing in the controller.
 */
export type PlaybackSpeedMultiplier = 0.5 | 1 | 2 | 4;

// ─────────────────────────────────────────────────────────────────────────────
// Configuration Constants
// ─────────────────────────────────────────────────────────────────────────────

export const SORTING_CONFIG = {
  ARRAY_SIZE_MIN: 5,
  ARRAY_SIZE_MAX: 50,
  ARRAY_SIZE_DEFAULT: 20,
  ALGORITHM_DEFAULT: "bubble" as SortingAlgorithmType,
} as const;

export const PATHFINDING_CONFIG = {
  GRID_ROWS_MIN: 5,
  GRID_ROWS_MAX: 30,
  GRID_COLS_MIN: 5,
  GRID_COLS_MAX: 50,
  GRID_ROWS_DEFAULT: 15,
  GRID_COLS_DEFAULT: 30,
  ALGORITHM_DEFAULT: "bfs" as PathfindingAlgorithmType,
} as const;

export const SPEED_CONFIG = {
  DEFAULT: 1 as PlaybackSpeedMultiplier,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Pathfinding State Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Grid coordinate as [row, col] tuple.
 */
export type GridCoord = [number, number];

/**
 * Converts a grid coordinate to a string key for Set operations.
 */
export function coordToKey(coord: GridCoord): string {
  return `${coord[0]}-${coord[1]}`;
}

/**
 * Parses a coordinate key back to a GridCoord tuple.
 */
export function keyToCoord(key: string): GridCoord {
  const parts = key.split("-").map(Number);
  // Keys are always in "row-col" format from coordToKey
  return [parts[0] ?? 0, parts[1] ?? 0];
}

/**
 * State for pathfinding node positions and walls.
 */
export interface PathfindingNodeState {
  start: GridCoord;
  end: GridCoord;
  walls: Set<string>;
}

/**
 * Grid dimensions configuration.
 */
export interface GridConfig {
  rows: number;
  cols: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Store Interface
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Central configuration store for the Yield visualizer.
 * Manages mode switching, algorithm selection, and visualization parameters.
 * State for each mode is preserved when switching between modes.
 */
export interface YieldStore {
  // Global state
  mode: VisualizerMode;
  playbackSpeed: PlaybackSpeedMultiplier;

  // Sorting state (preserved when switching modes)
  sortingAlgorithm: SortingAlgorithmType;
  arraySize: number;

  // Pathfinding state (preserved when switching modes)
  pathfindingAlgorithm: PathfindingAlgorithmType;
  pathfindingHeuristic: HeuristicType;
  gridConfig: GridConfig;
  nodeState: PathfindingNodeState;

  // Global actions
  setMode: (mode: VisualizerMode) => void;
  setPlaybackSpeed: (speed: PlaybackSpeedMultiplier) => void;

  // Sorting actions
  setSortingAlgorithm: (algo: SortingAlgorithmType) => void;
  setArraySize: (size: number) => void;

  // Pathfinding actions
  setPathfindingAlgorithm: (algo: PathfindingAlgorithmType) => void;
  setPathfindingHeuristic: (heuristic: HeuristicType) => void;
  setGridConfig: (config: Partial<GridConfig>) => void;
  setStartNode: (coord: GridCoord) => void;
  setEndNode: (coord: GridCoord) => void;
  toggleWall: (coord: GridCoord) => void;
  setWalls: (walls: Set<string>) => void;
  clearWalls: () => void;
  resetNodeState: () => void;
}

/**
 * Creates default node state based on grid dimensions.
 */
function createDefaultNodeState(gridConfig: GridConfig): PathfindingNodeState {
  return {
    start: [Math.floor(gridConfig.rows / 2), Math.floor(gridConfig.cols / 4)],
    end: [Math.floor(gridConfig.rows / 2), Math.floor((gridConfig.cols * 3) / 4)],
    walls: new Set<string>(),
  };
}

const defaultGridConfig: GridConfig = {
  rows: PATHFINDING_CONFIG.GRID_ROWS_DEFAULT,
  cols: PATHFINDING_CONFIG.GRID_COLS_DEFAULT,
};

export const useYieldStore = create<YieldStore>((set) => ({
  // Global initial state
  mode: "sorting",
  playbackSpeed: SPEED_CONFIG.DEFAULT,

  // Sorting initial state
  sortingAlgorithm: SORTING_CONFIG.ALGORITHM_DEFAULT,
  arraySize: SORTING_CONFIG.ARRAY_SIZE_DEFAULT,

  // Pathfinding initial state
  pathfindingAlgorithm: PATHFINDING_CONFIG.ALGORITHM_DEFAULT,
  pathfindingHeuristic: "manhattan" as HeuristicType,
  gridConfig: defaultGridConfig,
  nodeState: createDefaultNodeState(defaultGridConfig),

  // Global actions
  setMode: (mode) => set({ mode }),

  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),

  // Sorting actions
  setSortingAlgorithm: (algo) => set({ sortingAlgorithm: algo }),

  setArraySize: (size) =>
    set({
      arraySize: Math.max(
        SORTING_CONFIG.ARRAY_SIZE_MIN,
        Math.min(SORTING_CONFIG.ARRAY_SIZE_MAX, size)
      ),
    }),

  // Pathfinding actions
  setPathfindingAlgorithm: (algo) => set({ pathfindingAlgorithm: algo }),

  setPathfindingHeuristic: (heuristic) => set({ pathfindingHeuristic: heuristic }),

  setGridConfig: (config) =>
    set((state) => {
      const newConfig = {
        rows: Math.max(
          PATHFINDING_CONFIG.GRID_ROWS_MIN,
          Math.min(PATHFINDING_CONFIG.GRID_ROWS_MAX, config.rows ?? state.gridConfig.rows)
        ),
        cols: Math.max(
          PATHFINDING_CONFIG.GRID_COLS_MIN,
          Math.min(PATHFINDING_CONFIG.GRID_COLS_MAX, config.cols ?? state.gridConfig.cols)
        ),
      };
      return {
        gridConfig: newConfig,
        nodeState: createDefaultNodeState(newConfig),
      };
    }),

  setStartNode: (coord) =>
    set((state) => ({
      nodeState: { ...state.nodeState, start: coord },
    })),

  setEndNode: (coord) =>
    set((state) => ({
      nodeState: { ...state.nodeState, end: coord },
    })),

  toggleWall: (coord) =>
    set((state) => {
      const key = coordToKey(coord);
      const newWalls = new Set(state.nodeState.walls);
      if (newWalls.has(key)) {
        newWalls.delete(key);
      } else {
        newWalls.add(key);
      }
      return { nodeState: { ...state.nodeState, walls: newWalls } };
    }),

  setWalls: (walls) =>
    set((state) => ({
      nodeState: { ...state.nodeState, walls },
    })),

  clearWalls: () =>
    set((state) => ({
      nodeState: { ...state.nodeState, walls: new Set<string>() },
    })),

  resetNodeState: () =>
    set((state) => ({
      nodeState: createDefaultNodeState(state.gridConfig),
    })),
}));

// ─────────────────────────────────────────────────────────────────────────────
// Legacy Exports (for backward compatibility during migration)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @deprecated Use SortingAlgorithmType instead
 */
export type AlgorithmType = SortingAlgorithmType;

/**
 * @deprecated Use SORTING_CONFIG instead
 */
export const CONFIG = {
  ARRAY_SIZE_MIN: SORTING_CONFIG.ARRAY_SIZE_MIN,
  ARRAY_SIZE_MAX: SORTING_CONFIG.ARRAY_SIZE_MAX,
  ARRAY_SIZE_DEFAULT: SORTING_CONFIG.ARRAY_SIZE_DEFAULT,
  SPEED_DEFAULT: SPEED_CONFIG.DEFAULT,
  ALGORITHM_DEFAULT: SORTING_CONFIG.ALGORITHM_DEFAULT,
} as const;
