import { create } from "zustand";

// ─────────────────────────────────────────────────────────────────────────────
// Mode & Algorithm Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The three visualization domains supported by Yield.
 */
export type VisualizerMode = "sorting" | "pathfinding" | "tree";

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
 * Supported tree operations and traversals.
 */
export type TreeAlgorithmType =
  | "insert"
  | "search"
  | "delete"
  | "inorder"
  | "preorder"
  | "postorder"
  | "bfs";

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

export const TREE_CONFIG = {
  /** Maximum number of nodes allowed in the tree */
  MAX_NODES: 31,
  /** Algorithm shown by default when entering tree mode */
  ALGORITHM_DEFAULT: "insert" as TreeAlgorithmType,
  /** Value range for random tree generation */
  VALUE_MIN: 1,
  VALUE_MAX: 99,
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
// Tree State Types (Flat/Normalized Pattern)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A single node in the binary search tree.
 * Uses ID references instead of nested objects to enable efficient updates.
 */
export interface TreeNode {
  /** Unique identifier for this node */
  id: string;
  /** The numeric value stored in this node */
  value: number;
  /** ID of the left child, or null if no left child */
  leftId: string | null;
  /** ID of the right child, or null if no right child */
  rightId: string | null;
  /** ID of the parent node, or null if this is the root */
  parentId: string | null;
}

/**
 * Normalized tree state using a flat lookup structure.
 * This pattern avoids deep object nesting and enables O(1) node lookups.
 */
export interface TreeState {
  /** ID of the root node, or null if tree is empty */
  rootId: string | null;
  /** Map of node IDs to their data */
  nodes: Record<string, TreeNode>;
}

/**
 * Creates an empty tree state.
 */
export function createEmptyTreeState(): TreeState {
  return {
    rootId: null,
    nodes: {},
  };
}

/**
 * Generates a unique node ID.
 */
let nodeIdCounter = 0;
export function generateNodeId(): string {
  nodeIdCounter += 1;
  return `node-${nodeIdCounter}`;
}

/**
 * Resets the node ID counter (useful for testing).
 */
export function resetNodeIdCounter(): void {
  nodeIdCounter = 0;
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
  /** Whether a maze generation algorithm is currently running */
  isGeneratingMaze: boolean;

  // Tree state (preserved when switching modes)
  treeAlgorithm: TreeAlgorithmType;
  treeState: TreeState;

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
  setIsGeneratingMaze: (isGenerating: boolean) => void;

  // Tree actions
  setTreeAlgorithm: (algo: TreeAlgorithmType) => void;
  /**
   * Inserts a value into the BST, maintaining BST property.
   * Returns the ID of the newly inserted node, or null if value already exists.
   */
  insertNode: (value: number) => string | null;
  /**
   * Deletes a value from the BST.
   * Returns true if the node was found and deleted, false otherwise.
   */
  deleteNode: (value: number) => boolean;
  /** Resets the tree to empty state */
  resetTree: () => void;
  /** Sets the entire tree state (useful for loading presets) */
  setTreeState: (state: TreeState) => void;
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
  isGeneratingMaze: false,

  // Tree initial state
  treeAlgorithm: TREE_CONFIG.ALGORITHM_DEFAULT,
  treeState: createEmptyTreeState(),

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

  setIsGeneratingMaze: (isGenerating) => set({ isGeneratingMaze: isGenerating }),

  // Tree actions
  setTreeAlgorithm: (algo) => set({ treeAlgorithm: algo }),

  insertNode: (value) => {
    let insertedId: string | null = null;

    set((state) => {
      const { treeState } = state;
      const nodeCount = Object.keys(treeState.nodes).length;

      // Enforce max node limit
      if (nodeCount >= TREE_CONFIG.MAX_NODES) {
        return state;
      }

      // Empty tree - insert as root
      if (treeState.rootId === null) {
        const newId = generateNodeId();
        insertedId = newId;
        const newNode: TreeNode = {
          id: newId,
          value,
          leftId: null,
          rightId: null,
          parentId: null,
        };
        return {
          treeState: {
            rootId: newId,
            nodes: { [newId]: newNode },
          },
        };
      }

      // Find insertion point using BST property
      let currentId: string | null = treeState.rootId;
      while (currentId !== null) {
        const current: TreeNode | undefined = treeState.nodes[currentId];
        if (!current) break;

        if (value === current.value) {
          // Duplicate value - no insertion
          return state;
        }

        if (value < current.value) {
          if (current.leftId === null) {
            // Insert as left child
            const newId = generateNodeId();
            insertedId = newId;
            const newNode: TreeNode = {
              id: newId,
              value,
              leftId: null,
              rightId: null,
              parentId: currentId,
            };
            return {
              treeState: {
                ...treeState,
                nodes: {
                  ...treeState.nodes,
                  [currentId]: { ...current, leftId: newId },
                  [newId]: newNode,
                },
              },
            };
          }
          currentId = current.leftId;
        } else {
          if (current.rightId === null) {
            // Insert as right child
            const newId = generateNodeId();
            insertedId = newId;
            const newNode: TreeNode = {
              id: newId,
              value,
              leftId: null,
              rightId: null,
              parentId: currentId,
            };
            return {
              treeState: {
                ...treeState,
                nodes: {
                  ...treeState.nodes,
                  [currentId]: { ...current, rightId: newId },
                  [newId]: newNode,
                },
              },
            };
          }
          currentId = current.rightId;
        }
      }

      return state;
    });

    return insertedId;
  },

  deleteNode: (value) => {
    let deleted = false;

    set((state) => {
      const { treeState } = state;

      // Empty tree
      if (treeState.rootId === null) {
        return state;
      }

      // Find the node to delete
      let targetId: string | null = treeState.rootId;
      while (targetId !== null) {
        const target: TreeNode | undefined = treeState.nodes[targetId];
        if (!target) break;

        if (value === target.value) {
          // Found the node to delete
          deleted = true;
          const newNodes = { ...treeState.nodes };
          let newRootId = treeState.rootId;

          // Case 1: Leaf node (no children)
          if (target.leftId === null && target.rightId === null) {
            if (target.parentId === null) {
              // Deleting root leaf
              return { treeState: createEmptyTreeState() };
            }
            // Update parent to remove reference
            const parent = newNodes[target.parentId];
            if (parent) {
              if (parent.leftId === targetId) {
                newNodes[target.parentId] = { ...parent, leftId: null };
              } else {
                newNodes[target.parentId] = { ...parent, rightId: null };
              }
            }
            delete newNodes[targetId];
          }
          // Case 2: One child
          else if (target.leftId === null || target.rightId === null) {
            // Exactly one of leftId or rightId is non-null since Case 1 (both null) was already handled
            const childId = (target.leftId ?? target.rightId) as string; // Safe: XOR condition guarantees non-null
            const child = newNodes[childId];

            if (target.parentId === null) {
              // Deleting root with one child
              newRootId = childId;
              if (child) {
                newNodes[childId] = { ...child, parentId: null };
              }
            } else {
              // Link child to grandparent
              const parent = newNodes[target.parentId];
              if (parent && child) {
                if (parent.leftId === targetId) {
                  newNodes[target.parentId] = { ...parent, leftId: childId };
                } else {
                  newNodes[target.parentId] = { ...parent, rightId: childId };
                }
                newNodes[childId] = { ...child, parentId: target.parentId };
              }
            }
            delete newNodes[targetId];
          }
          // Case 3: Two children - replace with in-order successor
          else {
            // Find in-order successor (leftmost in right subtree)
            let successorId: string = target.rightId;
            let successor: TreeNode | undefined = newNodes[successorId];
            while (successor && successor.leftId !== null) {
              successorId = successor.leftId;
              successor = newNodes[successorId];
            }

            if (successor) {
              // Copy successor value to target node
              newNodes[targetId] = { ...target, value: successor.value };

              // Remove successor (has at most one right child)
              const successorParentId = successor.parentId;
              const successorParent = successorParentId ? newNodes[successorParentId] : null;

              if (successorParent) {
                if (successorParent.leftId === successorId) {
                  newNodes[successorParentId as string] = {
                    ...successorParent,
                    leftId: successor.rightId,
                  };
                } else {
                  newNodes[successorParentId as string] = {
                    ...successorParent,
                    rightId: successor.rightId,
                  };
                }
              }

              // Update successor's child parent pointer if exists
              if (successor.rightId) {
                const successorChild = newNodes[successor.rightId];
                if (successorChild) {
                  newNodes[successor.rightId] = {
                    ...successorChild,
                    parentId: successorParentId,
                  };
                }
              }

              delete newNodes[successorId];
            }
          }

          return {
            treeState: {
              rootId: newRootId,
              nodes: newNodes,
            },
          };
        }

        // Continue searching
        if (value < target.value) {
          targetId = target.leftId;
        } else {
          targetId = target.rightId;
        }
      }

      return state;
    });

    return deleted;
  },

  resetTree: () =>
    set({
      treeState: createEmptyTreeState(),
    }),

  setTreeState: (newTreeState) => set({ treeState: newTreeState }),
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
