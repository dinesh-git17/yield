import { create } from "zustand";
import {
  DEFAULT_RAIN_WATER_HEIGHTS,
  INTERVIEW_CONFIG,
  type InterviewProblemType,
} from "@/features/algorithms/interview";
import {
  DEFAULT_SLIDING_WINDOW_INPUT,
  PATTERNS_CONFIG,
  type PatternProblemType,
} from "@/features/algorithms/patterns";

// ─────────────────────────────────────────────────────────────────────────────
// Mode & Algorithm Types
// ─────────────────────────────────────────────────────────────────────────────

// Re-export InterviewProblemType for convenience
export type { InterviewProblemType } from "@/features/algorithms/interview";

// Re-export PatternProblemType for convenience
export type { PatternProblemType } from "@/features/algorithms/patterns";

/**
 * The six visualization domains supported by Yield.
 */
export type VisualizerMode =
  | "sorting"
  | "pathfinding"
  | "tree"
  | "graph"
  | "interview"
  | "patterns";

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
 * Tree data structure variants.
 * - bst: Binary Search Tree (unbalanced)
 * - avl: AVL Tree (self-balancing, height difference ≤ 1)
 * - max-heap: Max Binary Heap (parent ≥ children, complete tree)
 * - splay: Splay Tree (self-adjusting, recently accessed nodes move to root)
 */
export type TreeDataStructureType = "bst" | "avl" | "max-heap" | "splay";

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
  | "bfs"
  | "invert"
  | "heapify";

/**
 * Supported graph algorithms.
 * - prim: Prim's algorithm for Minimum Spanning Tree
 * - kruskal: Kruskal's algorithm for Minimum Spanning Tree
 * - kahn: Kahn's algorithm for Topological Sort (DAG only)
 */
export type GraphAlgorithmType = "prim" | "kruskal" | "kahn";

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
  /** Data structure shown by default when entering tree mode */
  DATA_STRUCTURE_DEFAULT: "bst" as TreeDataStructureType,
  /** Algorithm shown by default when entering tree mode */
  ALGORITHM_DEFAULT: "insert" as TreeAlgorithmType,
  /** Value range for random tree generation */
  VALUE_MIN: 1,
  VALUE_MAX: 99,
} as const;

/**
 * Operations available for each tree data structure.
 * Heaps support all operations (search is linear BFS, traversals work on any tree).
 * Splay trees splay the accessed node to root after every search operation.
 * Heapify is only available for max-heap (Floyd's O(n) heap construction).
 */
export const TREE_OPERATIONS: Record<TreeDataStructureType, TreeAlgorithmType[]> = {
  bst: ["insert", "search", "delete", "inorder", "preorder", "postorder", "bfs", "invert"],
  avl: ["insert", "search", "delete", "inorder", "preorder", "postorder", "bfs", "invert"],
  "max-heap": [
    "insert",
    "search",
    "delete",
    "heapify",
    "inorder",
    "preorder",
    "postorder",
    "bfs",
    "invert",
  ],
  splay: ["insert", "search", "delete", "inorder", "preorder", "postorder", "bfs", "invert"],
};

export const GRAPH_CONFIG = {
  /** Maximum number of nodes allowed in the graph */
  MAX_NODES: 50,
  /** Maximum number of edges allowed in the graph */
  MAX_EDGES: 100,
  /** Default algorithm when entering graph mode */
  ALGORITHM_DEFAULT: "prim" as GraphAlgorithmType,
  /** Default edge weight for new edges */
  DEFAULT_WEIGHT: 1,
  /** Node label alphabet for auto-generation */
  NODE_LABELS: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
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
 * A single node in the tree.
 * Uses ID references instead of nested objects to enable efficient updates.
 * Supports BST, AVL, and Heap data structures.
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
  /**
   * Height of the node for AVL trees.
   * Calculated as max(height(left), height(right)) + 1.
   * Leaf nodes have height 1, null children have height 0.
   */
  height?: number;
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
// Graph State Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A node in the graph with position coordinates.
 * Positions use normalized coordinates (0-100) for responsive scaling.
 */
export interface GraphNode {
  /** Unique identifier for this node */
  id: string;
  /** X position as percentage (0-100) */
  x: number;
  /** Y position as percentage (0-100) */
  y: number;
  /** Display label for the node */
  label: string;
}

/**
 * An edge connecting two nodes in the graph.
 */
export interface GraphEdge {
  /** Unique identifier for this edge */
  id: string;
  /** ID of the source node */
  sourceId: string;
  /** ID of the target node */
  targetId: string;
  /** Edge weight (for weighted graph algorithms like MST) */
  weight: number;
}

/**
 * Complete graph state using adjacency list representation.
 * Edges are stored as a flat list for efficient iteration.
 * Use getAdjacencyList() selector to derive adjacency structure.
 */
export interface GraphState {
  /** Map of node IDs to their data */
  nodes: Record<string, GraphNode>;
  /** Map of edge IDs to their data */
  edges: Record<string, GraphEdge>;
  /** Whether edges are directed (affects algorithm behavior) */
  isDirected: boolean;
}

/**
 * Creates an empty graph state.
 */
export function createEmptyGraphState(): GraphState {
  return {
    nodes: {},
    edges: {},
    isDirected: false,
  };
}

/**
 * Generates a unique graph node ID.
 */
let graphNodeIdCounter = 0;
export function generateGraphNodeId(): string {
  graphNodeIdCounter += 1;
  return `gnode-${graphNodeIdCounter}`;
}

/**
 * Generates a unique graph edge ID.
 */
let graphEdgeIdCounter = 0;
export function generateGraphEdgeId(): string {
  graphEdgeIdCounter += 1;
  return `gedge-${graphEdgeIdCounter}`;
}

/**
 * Resets the graph ID counters (useful for testing).
 */
export function resetGraphIdCounters(): void {
  graphNodeIdCounter = 0;
  graphEdgeIdCounter = 0;
}

/**
 * Derives an adjacency list from the graph state.
 * For undirected graphs, each edge appears in both directions.
 * @returns Map of node ID to list of { neighborId, edgeId, weight }
 */
export function getAdjacencyList(
  graphState: GraphState
): Map<string, Array<{ neighborId: string; edgeId: string; weight: number }>> {
  const adjacencyList = new Map<
    string,
    Array<{ neighborId: string; edgeId: string; weight: number }>
  >();

  // Initialize empty lists for all nodes
  for (const nodeId of Object.keys(graphState.nodes)) {
    adjacencyList.set(nodeId, []);
  }

  // Add edges
  for (const edge of Object.values(graphState.edges)) {
    const sourceList = adjacencyList.get(edge.sourceId);
    if (sourceList) {
      sourceList.push({
        neighborId: edge.targetId,
        edgeId: edge.id,
        weight: edge.weight,
      });
    }

    // For undirected graphs, add reverse edge
    if (!graphState.isDirected) {
      const targetList = adjacencyList.get(edge.targetId);
      if (targetList) {
        targetList.push({
          neighborId: edge.sourceId,
          edgeId: edge.id,
          weight: edge.weight,
        });
      }
    }
  }

  return adjacencyList;
}

// ─────────────────────────────────────────────────────────────────────────────
// Interview State Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * State for interview problem visualization.
 * Tracks terrain, water levels, and pointer positions.
 */
export interface InterviewState {
  /** The terrain heights array */
  heights: number[];
  /** Water level at each index (computed during visualization) */
  waterLevels: number[];
  /** Current left pointer position (-1 if not active) */
  left: number;
  /** Current right pointer position (-1 if not active) */
  right: number;
  /** Maximum height seen from the left so far */
  maxLeft: number;
  /** Maximum height seen from the right so far */
  maxRight: number;
  /** Running total of trapped water */
  totalWater: number;
}

/**
 * Creates a default interview state with given heights.
 */
export function createDefaultInterviewState(heights: number[]): InterviewState {
  return {
    heights: [...heights],
    waterLevels: new Array(heights.length).fill(0) as number[],
    left: -1,
    right: -1,
    maxLeft: 0,
    maxRight: 0,
    totalWater: 0,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Patterns State Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Window validity status for sliding window patterns.
 */
export type WindowStatus = "valid" | "invalid";

/**
 * State for pattern problem visualization.
 * Tracks window boundaries, frequency map, and maximum values.
 */
export interface PatternState {
  /** The input string as an array of characters */
  data: string[];
  /** Current window boundaries */
  window: {
    /** Left pointer (inclusive) */
    start: number;
    /** Right pointer (inclusive) */
    end: number;
  };
  /** Character frequency count within the current window */
  frequencyMap: Record<string, number>;
  /** The running maximum length found so far */
  globalMax: number;
  /** The best substring found (for display) */
  bestSubstring: string;
  /** Current window validity status */
  status: WindowStatus;
}

/**
 * Creates a default pattern state with given input.
 */
export function createDefaultPatternState(input: string): PatternState {
  return {
    data: input.split(""),
    window: {
      start: 0,
      end: -1,
    },
    frequencyMap: {},
    globalMax: 0,
    bestSubstring: "",
    status: "valid",
  };
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
  /** Initial array from URL state for "Try It" demos. When set, visualizer uses this instead of random. */
  initialArray: number[] | null;

  // Pathfinding state (preserved when switching modes)
  pathfindingAlgorithm: PathfindingAlgorithmType;
  pathfindingHeuristic: HeuristicType;
  gridConfig: GridConfig;
  nodeState: PathfindingNodeState;
  /** Whether a maze generation algorithm is currently running */
  isGeneratingMaze: boolean;

  // Tree state (preserved when switching modes)
  treeDataStructure: TreeDataStructureType;
  treeAlgorithm: TreeAlgorithmType;
  treeState: TreeState;

  // Graph state (preserved when switching modes)
  graphAlgorithm: GraphAlgorithmType;
  graphState: GraphState;

  // Interview state (preserved when switching modes)
  interviewProblem: InterviewProblemType;
  interviewState: InterviewState;

  // Patterns state (preserved when switching modes)
  patternProblem: PatternProblemType;
  patternState: PatternState;
  /** The raw input string for patterns (used to regenerate state) */
  patternInput: string;

  // Global actions
  setMode: (mode: VisualizerMode) => void;
  setPlaybackSpeed: (speed: PlaybackSpeedMultiplier) => void;

  // Sorting actions
  setSortingAlgorithm: (algo: SortingAlgorithmType) => void;
  setArraySize: (size: number) => void;
  /** Sets the initial array for demos. Clears on algorithm/size change. */
  setInitialArray: (array: number[] | null) => void;
  /** Clears the initial array, returning to random generation. */
  clearInitialArray: () => void;

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
  setTreeDataStructure: (structure: TreeDataStructureType) => void;
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
  /** Swaps the left and right children of a node (used for tree inversion) */
  swapNodeChildren: (nodeId: string) => void;
  /**
   * Splays a node to the root using Zig, Zig-Zig, or Zig-Zag rotations.
   * Used by Splay Trees to move recently accessed nodes to the root.
   */
  splayNode: (nodeId: string) => void;
  /**
   * Fills the tree with random values in a complete binary tree structure.
   * Used before heapify to create an unordered tree that can be converted to a heap.
   * @param count - Number of nodes to create (1-31)
   */
  fillRandomHeap: (count: number) => void;
  /**
   * Performs a single swap of values between parent and child during heapify.
   * Used by the heapify visualization to update the actual tree state.
   */
  heapifySwap: (parentId: string, childId: string) => void;

  // Graph actions
  setGraphAlgorithm: (algo: GraphAlgorithmType) => void;
  /**
   * Adds a node to the graph at the specified position.
   * Auto-generates a label based on the number of existing nodes.
   * Returns the ID of the newly created node, or null if max nodes reached.
   */
  addGraphNode: (x: number, y: number, label?: string) => string | null;
  /**
   * Adds an edge between two nodes.
   * Returns the ID of the newly created edge, or null if invalid or max edges reached.
   */
  addGraphEdge: (sourceId: string, targetId: string, weight?: number) => string | null;
  /**
   * Updates the position of a graph node (for drag interactions).
   */
  updateGraphNodePosition: (nodeId: string, x: number, y: number) => void;
  /**
   * Updates the weight of an edge.
   */
  updateGraphEdgeWeight: (edgeId: string, weight: number) => void;
  /**
   * Removes a node and all its connected edges from the graph.
   * Returns true if the node was found and deleted.
   */
  removeGraphNode: (nodeId: string) => boolean;
  /**
   * Removes an edge from the graph.
   * Returns true if the edge was found and deleted.
   */
  removeGraphEdge: (edgeId: string) => boolean;
  /**
   * Toggles whether the graph is directed.
   */
  setGraphDirected: (isDirected: boolean) => void;
  /**
   * Clears the entire graph (all nodes and edges).
   */
  clearGraph: () => void;
  /**
   * Sets the entire graph state (useful for loading presets).
   */
  setGraphState: (state: GraphState) => void;

  // Interview actions
  /**
   * Sets the current interview problem.
   */
  setInterviewProblem: (problem: InterviewProblemType) => void;
  /**
   * Sets the terrain heights for the current problem.
   */
  setInterviewHeights: (heights: number[]) => void;
  /**
   * Updates the interview state (called by the controller during visualization).
   */
  updateInterviewState: (state: Partial<InterviewState>) => void;
  /**
   * Resets the interview state to initial values based on current heights.
   */
  resetInterviewState: () => void;

  // Patterns actions
  /**
   * Sets the current pattern problem.
   */
  setPatternProblem: (problem: PatternProblemType) => void;
  /**
   * Sets the input string for the pattern problem.
   */
  setPatternInput: (input: string) => void;
  /**
   * Updates the pattern state (called by the controller during visualization).
   */
  updatePatternState: (state: Partial<PatternState>) => void;
  /**
   * Resets the pattern state to initial values based on current input.
   */
  resetPatternState: () => void;
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

// ─────────────────────────────────────────────────────────────────────────────
// AVL Tree Helper Functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Gets the height of a node. Returns 0 for null nodes.
 */
function getAVLHeight(nodes: Record<string, TreeNode>, nodeId: string | null): number {
  if (nodeId === null) return 0;
  const node = nodes[nodeId];
  return node?.height ?? 1;
}

/**
 * Calculates the balance factor of a node.
 * Balance factor = height(left subtree) - height(right subtree)
 */
function getAVLBalanceFactor(nodes: Record<string, TreeNode>, nodeId: string): number {
  const node = nodes[nodeId];
  if (!node) return 0;
  return getAVLHeight(nodes, node.leftId) - getAVLHeight(nodes, node.rightId);
}

/**
 * Updates the height of a node based on its children.
 */
function updateAVLHeight(nodes: Record<string, TreeNode>, nodeId: string): number {
  const node = nodes[nodeId];
  if (!node) return 0;
  return Math.max(getAVLHeight(nodes, node.leftId), getAVLHeight(nodes, node.rightId)) + 1;
}

/**
 * Performs a right rotation (for LL case).
 *
 *        z                y
 *       / \              / \
 *      y   T4    →      x   z
 *     / \              /   / \
 *    x   T3           T1  T3  T4
 */
function avlRotateRight(
  nodes: Record<string, TreeNode>,
  zId: string,
  rootId: string | null
): { nodes: Record<string, TreeNode>; newRootId: string | null; subtreeRootId: string } {
  const z = nodes[zId];
  if (!z || !z.leftId) return { nodes, newRootId: rootId, subtreeRootId: zId };

  const yId = z.leftId;
  const y = nodes[yId];
  if (!y) return { nodes, newRootId: rootId, subtreeRootId: zId };

  const t3Id = y.rightId;
  const updatedNodes = { ...nodes };

  // y becomes the new root of this subtree
  updatedNodes[yId] = {
    ...y,
    rightId: zId,
    parentId: z.parentId,
  };

  // z becomes right child of y
  updatedNodes[zId] = {
    ...z,
    leftId: t3Id,
    parentId: yId,
  };

  // T3's parent changes to z (if T3 exists)
  if (t3Id) {
    const t3 = updatedNodes[t3Id];
    if (t3) {
      updatedNodes[t3Id] = { ...t3, parentId: zId };
    }
  }

  // Update parent's child reference (if parent exists)
  if (z.parentId) {
    const parent = updatedNodes[z.parentId];
    if (parent) {
      if (parent.leftId === zId) {
        updatedNodes[z.parentId] = { ...parent, leftId: yId };
      } else {
        updatedNodes[z.parentId] = { ...parent, rightId: yId };
      }
    }
  }

  // Update heights (bottom-up)
  const zHeight = updateAVLHeight(updatedNodes, zId);
  updatedNodes[zId] = { ...updatedNodes[zId], height: zHeight } as TreeNode;

  const yHeight = updateAVLHeight(updatedNodes, yId);
  updatedNodes[yId] = { ...updatedNodes[yId], height: yHeight } as TreeNode;

  // Update root if z was the root
  const newRootId = rootId === zId ? yId : rootId;

  return { nodes: updatedNodes, newRootId, subtreeRootId: yId };
}

/**
 * Performs a left rotation (for RR case).
 *
 *      z                  y
 *     / \                / \
 *    T1  y      →       z   x
 *       / \            / \   \
 *      T2  x          T1  T2  T3
 */
function avlRotateLeft(
  nodes: Record<string, TreeNode>,
  zId: string,
  rootId: string | null
): { nodes: Record<string, TreeNode>; newRootId: string | null; subtreeRootId: string } {
  const z = nodes[zId];
  if (!z || !z.rightId) return { nodes, newRootId: rootId, subtreeRootId: zId };

  const yId = z.rightId;
  const y = nodes[yId];
  if (!y) return { nodes, newRootId: rootId, subtreeRootId: zId };

  const t2Id = y.leftId;
  const updatedNodes = { ...nodes };

  // y becomes the new root of this subtree
  updatedNodes[yId] = {
    ...y,
    leftId: zId,
    parentId: z.parentId,
  };

  // z becomes left child of y
  updatedNodes[zId] = {
    ...z,
    rightId: t2Id,
    parentId: yId,
  };

  // T2's parent changes to z (if T2 exists)
  if (t2Id) {
    const t2 = updatedNodes[t2Id];
    if (t2) {
      updatedNodes[t2Id] = { ...t2, parentId: zId };
    }
  }

  // Update parent's child reference (if parent exists)
  if (z.parentId) {
    const parent = updatedNodes[z.parentId];
    if (parent) {
      if (parent.leftId === zId) {
        updatedNodes[z.parentId] = { ...parent, leftId: yId };
      } else {
        updatedNodes[z.parentId] = { ...parent, rightId: yId };
      }
    }
  }

  // Update heights (bottom-up)
  const zHeight = updateAVLHeight(updatedNodes, zId);
  updatedNodes[zId] = { ...updatedNodes[zId], height: zHeight } as TreeNode;

  const yHeight = updateAVLHeight(updatedNodes, yId);
  updatedNodes[yId] = { ...updatedNodes[yId], height: yHeight } as TreeNode;

  // Update root if z was the root
  const newRootId = rootId === zId ? yId : rootId;

  return { nodes: updatedNodes, newRootId, subtreeRootId: yId };
}

/**
 * Inserts a value into an AVL tree and rebalances.
 */
function insertAVLNode(
  treeState: TreeState,
  value: number,
  onInsert: (id: string) => void
): { treeState: TreeState } {
  let nodes = { ...treeState.nodes };
  let rootId = treeState.rootId;

  // Track the path for rebalancing
  const path: string[] = [];

  // Find insertion point (standard BST insert)
  let currentId: string | null = rootId;
  let parentId: string | null = null;
  let position: "left" | "right" = "left";

  while (currentId !== null) {
    const current = nodes[currentId];
    if (!current) break;

    path.push(currentId);

    if (value === current.value) {
      // Duplicate - no insertion
      return { treeState };
    }

    if (value < current.value) {
      parentId = currentId;
      position = "left";
      currentId = current.leftId;
    } else {
      parentId = currentId;
      position = "right";
      currentId = current.rightId;
    }
  }

  // Create and insert new node
  const newId = generateNodeId();
  onInsert(newId);

  const newNode: TreeNode = {
    id: newId,
    value,
    leftId: null,
    rightId: null,
    parentId,
    height: 1,
  };
  nodes[newId] = newNode;

  // Update parent's child pointer
  if (parentId) {
    const parent = nodes[parentId];
    if (parent) {
      if (position === "left") {
        nodes[parentId] = { ...parent, leftId: newId };
      } else {
        nodes[parentId] = { ...parent, rightId: newId };
      }
    }
  }

  // Rebalance: unwind path and fix balance
  for (let i = path.length - 1; i >= 0; i--) {
    const nodeId = path[i];
    if (!nodeId) continue;

    // Update height
    const newHeight = updateAVLHeight(nodes, nodeId);
    const node = nodes[nodeId];
    if (node) {
      nodes[nodeId] = { ...node, height: newHeight };
    }

    // Check balance factor
    const bf = getAVLBalanceFactor(nodes, nodeId);

    if (bf > 1) {
      // Left-heavy
      const leftBf = nodes[nodeId]?.leftId
        ? getAVLBalanceFactor(nodes, nodes[nodeId].leftId as string)
        : 0;

      if (leftBf >= 0) {
        // LL case: single right rotation
        const result = avlRotateRight(nodes, nodeId, rootId);
        nodes = result.nodes;
        rootId = result.newRootId;
      } else {
        // LR case: left rotation on left child, then right rotation
        const leftId = nodes[nodeId]?.leftId;
        if (leftId) {
          const result1 = avlRotateLeft(nodes, leftId, rootId);
          nodes = result1.nodes;
          rootId = result1.newRootId;

          const result2 = avlRotateRight(nodes, nodeId, rootId);
          nodes = result2.nodes;
          rootId = result2.newRootId;
        }
      }
      break; // Insert needs at most one rotation set
    } else if (bf < -1) {
      // Right-heavy
      const rightBf = nodes[nodeId]?.rightId
        ? getAVLBalanceFactor(nodes, nodes[nodeId].rightId as string)
        : 0;

      if (rightBf <= 0) {
        // RR case: single left rotation
        const result = avlRotateLeft(nodes, nodeId, rootId);
        nodes = result.nodes;
        rootId = result.newRootId;
      } else {
        // RL case: right rotation on right child, then left rotation
        const rightId = nodes[nodeId]?.rightId;
        if (rightId) {
          const result1 = avlRotateRight(nodes, rightId, rootId);
          nodes = result1.nodes;
          rootId = result1.newRootId;

          const result2 = avlRotateLeft(nodes, nodeId, rootId);
          nodes = result2.nodes;
          rootId = result2.newRootId;
        }
      }
      break; // Insert needs at most one rotation set
    }
  }

  return {
    treeState: {
      rootId,
      nodes,
    },
  };
}

/**
 * Deletes a value from an AVL tree and rebalances.
 */
function deleteAVLNode(
  treeState: TreeState,
  value: number
): { treeState: TreeState; deleted: boolean } {
  if (treeState.rootId === null) {
    return { treeState, deleted: false };
  }

  let nodes = { ...treeState.nodes };
  let rootId: string | null = treeState.rootId;

  // Track path for rebalancing
  const path: string[] = [];

  // Find the node to delete
  let targetId: string | null = rootId;
  while (targetId !== null) {
    const targetNode: TreeNode | undefined = nodes[targetId];
    if (!targetNode) break;

    if (value === targetNode.value) {
      break;
    }

    path.push(targetId);
    if (value < targetNode.value) {
      targetId = targetNode.leftId;
    } else {
      targetId = targetNode.rightId;
    }
  }

  if (!targetId || !nodes[targetId]) {
    return { treeState, deleted: false };
  }

  const target = nodes[targetId];
  if (!target) return { treeState, deleted: false };

  // Standard BST delete
  const hasLeft = target.leftId !== null;
  const hasRight = target.rightId !== null;

  if (!hasLeft && !hasRight) {
    // Case 1: Leaf node
    if (target.parentId) {
      const parent = nodes[target.parentId];
      if (parent) {
        if (parent.leftId === targetId) {
          nodes[target.parentId] = { ...parent, leftId: null };
        } else {
          nodes[target.parentId] = { ...parent, rightId: null };
        }
      }
    } else {
      rootId = null;
    }
    delete nodes[targetId];
  } else if (!hasLeft || !hasRight) {
    // Case 2: One child
    const childId = (target.leftId ?? target.rightId) as string;
    const child = nodes[childId];

    if (target.parentId) {
      const parent = nodes[target.parentId];
      if (parent && child) {
        if (parent.leftId === targetId) {
          nodes[target.parentId] = { ...parent, leftId: childId };
        } else {
          nodes[target.parentId] = { ...parent, rightId: childId };
        }
        nodes[childId] = { ...child, parentId: target.parentId };
      }
    } else {
      rootId = childId;
      if (child) {
        nodes[childId] = { ...child, parentId: null };
      }
    }
    delete nodes[targetId];
  } else {
    // Case 3: Two children - find in-order successor
    // target.rightId is guaranteed non-null since we're in the two-children branch
    let successorId: string = target.rightId as string;
    let successor: TreeNode | undefined = nodes[successorId];

    const successorPath: string[] = [];
    while (successor?.leftId) {
      successorPath.push(successorId);
      successorId = successor.leftId;
      successor = nodes[successorId];
    }

    if (successor) {
      // Replace target's value with successor's value
      nodes[targetId] = { ...target, value: successor.value };

      // Remove successor
      const successorParentId = successor.parentId;
      if (successorParentId) {
        const successorParent = nodes[successorParentId];
        if (successorParent) {
          if (successorParent.leftId === successorId) {
            nodes[successorParentId] = { ...successorParent, leftId: successor.rightId };
          } else {
            nodes[successorParentId] = { ...successorParent, rightId: successor.rightId };
          }
        }
      }

      if (successor.rightId) {
        const successorChild = nodes[successor.rightId];
        if (successorChild) {
          nodes[successor.rightId] = { ...successorChild, parentId: successorParentId };
        }
      }

      delete nodes[successorId];

      // Add successor path to main path for rebalancing
      path.push(...successorPath);
    }
  }

  // Rebalance: unwind path and fix balance (may need multiple rotations)
  for (let i = path.length - 1; i >= 0; i--) {
    const nodeId = path[i];
    if (!nodeId || !nodes[nodeId]) continue;

    // Update height
    const newHeight = updateAVLHeight(nodes, nodeId);
    const node = nodes[nodeId];
    if (node) {
      nodes[nodeId] = { ...node, height: newHeight };
    }

    // Check balance factor
    const bf = getAVLBalanceFactor(nodes, nodeId);

    if (bf > 1) {
      const leftBf = nodes[nodeId]?.leftId
        ? getAVLBalanceFactor(nodes, nodes[nodeId].leftId as string)
        : 0;

      if (leftBf >= 0) {
        const result = avlRotateRight(nodes, nodeId, rootId);
        nodes = result.nodes;
        rootId = result.newRootId;
      } else {
        const leftId = nodes[nodeId]?.leftId;
        if (leftId) {
          const result1 = avlRotateLeft(nodes, leftId, rootId);
          nodes = result1.nodes;
          rootId = result1.newRootId;

          const result2 = avlRotateRight(nodes, nodeId, rootId);
          nodes = result2.nodes;
          rootId = result2.newRootId;
        }
      }
      // Don't break - delete may need multiple rotations
    } else if (bf < -1) {
      const rightBf = nodes[nodeId]?.rightId
        ? getAVLBalanceFactor(nodes, nodes[nodeId].rightId as string)
        : 0;

      if (rightBf <= 0) {
        const result = avlRotateLeft(nodes, nodeId, rootId);
        nodes = result.nodes;
        rootId = result.newRootId;
      } else {
        const rightId = nodes[nodeId]?.rightId;
        if (rightId) {
          const result1 = avlRotateRight(nodes, rightId, rootId);
          nodes = result1.nodes;
          rootId = result1.newRootId;

          const result2 = avlRotateLeft(nodes, nodeId, rootId);
          nodes = result2.nodes;
          rootId = result2.newRootId;
        }
      }
      // Don't break - delete may need multiple rotations
    }
  }

  return {
    treeState: {
      rootId,
      nodes,
    },
    deleted: true,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Heap Helper Functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Gets all nodes in level-order (BFS order) for heap operations.
 */
function getNodesInLevelOrder(treeState: TreeState): string[] {
  if (treeState.rootId === null) return [];

  const result: string[] = [];
  const queue: string[] = [treeState.rootId];

  while (queue.length > 0) {
    const nodeId = queue.shift();
    if (!nodeId) continue;

    const node = treeState.nodes[nodeId];
    if (!node) continue;

    result.push(nodeId);

    if (node.leftId) queue.push(node.leftId);
    if (node.rightId) queue.push(node.rightId);
  }

  return result;
}

/**
 * Finds the insertion point for a new node in a complete binary tree (heap).
 */
function findHeapInsertionPoint(
  treeState: TreeState
): { parentId: string; position: "left" | "right" } | null {
  if (treeState.rootId === null) return null;

  const queue: string[] = [treeState.rootId];

  while (queue.length > 0) {
    const nodeId = queue.shift();
    if (!nodeId) continue;

    const node = treeState.nodes[nodeId];
    if (!node) continue;

    if (node.leftId === null) {
      return { parentId: nodeId, position: "left" };
    }

    if (node.rightId === null) {
      return { parentId: nodeId, position: "right" };
    }

    queue.push(node.leftId);
    queue.push(node.rightId);
  }

  return null;
}

/**
 * Inserts a value into a Max Heap and maintains heap property.
 * 1. Insert at next available position (complete tree property)
 * 2. Bubble up to restore heap property
 */
function insertHeapNode(
  treeState: TreeState,
  value: number,
  onInsert: (id: string) => void
): { treeState: TreeState } {
  const insertionPoint = findHeapInsertionPoint(treeState);
  if (!insertionPoint) {
    // This shouldn't happen if we enforce max node limit
    return { treeState };
  }

  const newId = generateNodeId();
  onInsert(newId);

  const newNode: TreeNode = {
    id: newId,
    value,
    leftId: null,
    rightId: null,
    parentId: insertionPoint.parentId,
  };

  // Create new nodes map with the inserted node
  let nodes = {
    ...treeState.nodes,
    [newId]: newNode,
  };

  // Update parent to point to new node
  const parent = nodes[insertionPoint.parentId];
  if (parent) {
    if (insertionPoint.position === "left") {
      nodes[insertionPoint.parentId] = { ...parent, leftId: newId };
    } else {
      nodes[insertionPoint.parentId] = { ...parent, rightId: newId };
    }
  }

  // Bubble up to restore heap property
  let currentId = newId;
  const currentValue = value;

  while (true) {
    const current = nodes[currentId];
    if (!current || !current.parentId) break;

    const parentNode = nodes[current.parentId];
    if (!parentNode) break;

    // Max heap: if current > parent, swap values
    if (currentValue > parentNode.value) {
      // Swap values (not structure)
      const currentNode = nodes[currentId];
      if (currentNode) {
        nodes = {
          ...nodes,
          [currentId]: { ...currentNode, value: parentNode.value },
          [current.parentId]: { ...parentNode, value: currentValue },
        };
      }
      // Continue bubbling up with the same value
      currentId = current.parentId;
    } else {
      // Heap property satisfied
      break;
    }
  }

  return {
    treeState: {
      ...treeState,
      nodes,
    },
  };
}

/**
 * Extracts the maximum value from a Max Heap.
 * 1. Remove root value
 * 2. Replace root with last node's value
 * 3. Remove last node
 * 4. Sink down to restore heap property
 */
function extractHeapMax(treeState: TreeState): { treeState: TreeState; extracted: boolean } {
  if (treeState.rootId === null) {
    return { treeState, extracted: false };
  }

  const nodesInOrder = getNodesInLevelOrder(treeState);

  // Only one node - just remove it
  if (nodesInOrder.length === 1) {
    return {
      treeState: createEmptyTreeState(),
      extracted: true,
    };
  }

  // Get the last node
  const lastNodeId = nodesInOrder[nodesInOrder.length - 1];
  if (!lastNodeId) {
    return { treeState, extracted: false };
  }

  const lastNode = treeState.nodes[lastNodeId];
  const rootNode = treeState.nodes[treeState.rootId];
  if (!lastNode || !rootNode) {
    return { treeState, extracted: false };
  }

  // Create new nodes map
  let nodes = { ...treeState.nodes };

  // Move last node's value to root
  nodes[treeState.rootId] = { ...rootNode, value: lastNode.value };

  // Remove last node and update its parent
  if (lastNode.parentId) {
    const lastParent = nodes[lastNode.parentId];
    if (lastParent) {
      if (lastParent.leftId === lastNodeId) {
        nodes[lastNode.parentId] = { ...lastParent, leftId: null };
      } else {
        nodes[lastNode.parentId] = { ...lastParent, rightId: null };
      }
    }
  }
  delete nodes[lastNodeId];

  // Sink down to restore heap property
  let currentId: string | null = treeState.rootId;
  const sinkValue = lastNode.value;

  while (currentId !== null) {
    const current: TreeNode | undefined = nodes[currentId];
    if (!current) break;

    const leftId: string | null = current.leftId;
    const rightId: string | null = current.rightId;

    // No children - done
    if (leftId === null && rightId === null) {
      break;
    }

    const leftNode = leftId ? nodes[leftId] : null;
    const rightNode = rightId ? nodes[rightId] : null;

    const leftValue = leftNode?.value ?? Number.NEGATIVE_INFINITY;
    const rightValue = rightNode?.value ?? Number.NEGATIVE_INFINITY;

    // Find larger child
    let largerChildId: string | null = null;
    let largerChildValue: number = Number.NEGATIVE_INFINITY;

    if (leftValue >= rightValue && leftId) {
      largerChildId = leftId;
      largerChildValue = leftValue;
    } else if (rightId) {
      largerChildId = rightId;
      largerChildValue = rightValue;
    }

    if (!largerChildId) break;

    // Check if swap is needed
    if (sinkValue < largerChildValue) {
      // Swap values
      const largerChild = nodes[largerChildId];
      if (largerChild) {
        nodes = {
          ...nodes,
          [currentId]: { ...current, value: largerChildValue },
          [largerChildId]: { ...largerChild, value: sinkValue },
        };
        currentId = largerChildId;
      } else {
        break;
      }
    } else {
      // Heap property satisfied
      break;
    }
  }

  return {
    treeState: {
      rootId: treeState.rootId,
      nodes,
    },
    extracted: true,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Splay Tree Helper Functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Performs a right rotation for splay operation (simpler than AVL, no height update).
 *
 *        y                x
 *       / \              / \
 *      x   C    →       A   y
 *     / \                  / \
 *    A   B                B   C
 */
function splayRotateRight(
  nodes: Record<string, TreeNode>,
  yId: string,
  rootId: string | null
): { nodes: Record<string, TreeNode>; newRootId: string | null } {
  const y = nodes[yId];
  if (!y || !y.leftId) return { nodes, newRootId: rootId };

  const xId = y.leftId;
  const x = nodes[xId];
  if (!x) return { nodes, newRootId: rootId };

  const bId = x.rightId;
  const updatedNodes = { ...nodes };

  // x becomes the new root of this subtree
  updatedNodes[xId] = {
    ...x,
    rightId: yId,
    parentId: y.parentId,
  };

  // y becomes right child of x
  updatedNodes[yId] = {
    ...y,
    leftId: bId,
    parentId: xId,
  };

  // B's parent changes to y (if B exists)
  if (bId) {
    const b = updatedNodes[bId];
    if (b) {
      updatedNodes[bId] = { ...b, parentId: yId };
    }
  }

  // Update parent's child reference (if parent exists)
  if (y.parentId) {
    const parent = updatedNodes[y.parentId];
    if (parent) {
      if (parent.leftId === yId) {
        updatedNodes[y.parentId] = { ...parent, leftId: xId };
      } else {
        updatedNodes[y.parentId] = { ...parent, rightId: xId };
      }
    }
  }

  // Update root if y was the root
  const newRootId = rootId === yId ? xId : rootId;

  return { nodes: updatedNodes, newRootId };
}

/**
 * Performs a left rotation for splay operation (simpler than AVL, no height update).
 *
 *      x                  y
 *     / \                / \
 *    A   y      →       x   C
 *       / \            / \
 *      B   C          A   B
 */
function splayRotateLeft(
  nodes: Record<string, TreeNode>,
  xId: string,
  rootId: string | null
): { nodes: Record<string, TreeNode>; newRootId: string | null } {
  const x = nodes[xId];
  if (!x || !x.rightId) return { nodes, newRootId: rootId };

  const yId = x.rightId;
  const y = nodes[yId];
  if (!y) return { nodes, newRootId: rootId };

  const bId = y.leftId;
  const updatedNodes = { ...nodes };

  // y becomes the new root of this subtree
  updatedNodes[yId] = {
    ...y,
    leftId: xId,
    parentId: x.parentId,
  };

  // x becomes left child of y
  updatedNodes[xId] = {
    ...x,
    rightId: bId,
    parentId: yId,
  };

  // B's parent changes to x (if B exists)
  if (bId) {
    const b = updatedNodes[bId];
    if (b) {
      updatedNodes[bId] = { ...b, parentId: xId };
    }
  }

  // Update parent's child reference (if parent exists)
  if (x.parentId) {
    const parent = updatedNodes[x.parentId];
    if (parent) {
      if (parent.leftId === xId) {
        updatedNodes[x.parentId] = { ...parent, leftId: yId };
      } else {
        updatedNodes[x.parentId] = { ...parent, rightId: yId };
      }
    }
  }

  // Update root if x was the root
  const newRootId = rootId === xId ? yId : rootId;

  return { nodes: updatedNodes, newRootId };
}

/**
 * Splays a node to the root using bottom-up rotations.
 * Splay operation uses three cases:
 * - Zig: x is child of root (single rotation)
 * - Zig-Zig: x and parent are both left or both right children (double same-direction)
 * - Zig-Zag: x is left child of right child or vice versa (double opposite-direction)
 */
function splayNodeToRoot(treeState: TreeState, nodeId: string): TreeState {
  let nodes = { ...treeState.nodes };
  let rootId = treeState.rootId;

  // If node doesn't exist or is already root, nothing to do
  const node = nodes[nodeId];
  if (!node || nodeId === rootId) {
    return treeState;
  }

  // Keep splaying until node is root
  while (nodes[nodeId]?.parentId !== null) {
    const current = nodes[nodeId];
    if (!current || !current.parentId) break;

    const parent = nodes[current.parentId];
    if (!parent) break;

    const grandparentId = parent.parentId;

    if (grandparentId === null) {
      // Zig case: parent is root, single rotation
      if (parent.leftId === nodeId) {
        // x is left child of root: rotate right
        const result = splayRotateRight(nodes, current.parentId, rootId);
        nodes = result.nodes;
        rootId = result.newRootId;
      } else {
        // x is right child of root: rotate left
        const result = splayRotateLeft(nodes, current.parentId, rootId);
        nodes = result.nodes;
        rootId = result.newRootId;
      }
    } else {
      const grandparent = nodes[grandparentId];
      if (!grandparent) break;

      const parentIsLeftChild = grandparent.leftId === current.parentId;
      const nodeIsLeftChild = parent.leftId === nodeId;

      if (parentIsLeftChild && nodeIsLeftChild) {
        // Zig-Zig (Left-Left): rotate grandparent right, then parent right
        const result1 = splayRotateRight(nodes, grandparentId, rootId);
        nodes = result1.nodes;
        rootId = result1.newRootId;
        const result2 = splayRotateRight(nodes, current.parentId, rootId);
        nodes = result2.nodes;
        rootId = result2.newRootId;
      } else if (!parentIsLeftChild && !nodeIsLeftChild) {
        // Zig-Zig (Right-Right): rotate grandparent left, then parent left
        const result1 = splayRotateLeft(nodes, grandparentId, rootId);
        nodes = result1.nodes;
        rootId = result1.newRootId;
        const result2 = splayRotateLeft(nodes, current.parentId, rootId);
        nodes = result2.nodes;
        rootId = result2.newRootId;
      } else if (parentIsLeftChild && !nodeIsLeftChild) {
        // Zig-Zag (Left-Right): rotate parent left, then grandparent right
        const result1 = splayRotateLeft(nodes, current.parentId, rootId);
        nodes = result1.nodes;
        rootId = result1.newRootId;
        const result2 = splayRotateRight(nodes, grandparentId, rootId);
        nodes = result2.nodes;
        rootId = result2.newRootId;
      } else {
        // Zig-Zag (Right-Left): rotate parent right, then grandparent left
        const result1 = splayRotateRight(nodes, current.parentId, rootId);
        nodes = result1.nodes;
        rootId = result1.newRootId;
        const result2 = splayRotateLeft(nodes, grandparentId, rootId);
        nodes = result2.nodes;
        rootId = result2.newRootId;
      }
    }
  }

  return { rootId, nodes };
}

export const useYieldStore = create<YieldStore>((set) => ({
  // Global initial state
  mode: "sorting",
  playbackSpeed: SPEED_CONFIG.DEFAULT,

  // Sorting initial state
  sortingAlgorithm: SORTING_CONFIG.ALGORITHM_DEFAULT,
  arraySize: SORTING_CONFIG.ARRAY_SIZE_DEFAULT,
  initialArray: null,

  // Pathfinding initial state
  pathfindingAlgorithm: PATHFINDING_CONFIG.ALGORITHM_DEFAULT,
  pathfindingHeuristic: "manhattan" as HeuristicType,
  gridConfig: defaultGridConfig,
  nodeState: createDefaultNodeState(defaultGridConfig),
  isGeneratingMaze: false,

  // Tree initial state
  treeDataStructure: TREE_CONFIG.DATA_STRUCTURE_DEFAULT,
  treeAlgorithm: TREE_CONFIG.ALGORITHM_DEFAULT,
  treeState: createEmptyTreeState(),

  // Graph initial state
  graphAlgorithm: GRAPH_CONFIG.ALGORITHM_DEFAULT,
  graphState: createEmptyGraphState(),

  // Interview initial state
  interviewProblem: INTERVIEW_CONFIG.DEFAULT_PROBLEM,
  interviewState: createDefaultInterviewState(DEFAULT_RAIN_WATER_HEIGHTS),

  // Patterns initial state
  patternProblem: PATTERNS_CONFIG.DEFAULT_PROBLEM,
  patternInput: DEFAULT_SLIDING_WINDOW_INPUT,
  patternState: createDefaultPatternState(DEFAULT_SLIDING_WINDOW_INPUT),

  // Global actions
  setMode: (mode) =>
    set({
      mode,
      // Set slower default speed for patterns mode (algorithm moves fast)
      playbackSpeed: mode === "patterns" ? 0.5 : SPEED_CONFIG.DEFAULT,
    }),

  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),

  // Sorting actions
  setSortingAlgorithm: (algo) => set({ sortingAlgorithm: algo, initialArray: null }),

  setArraySize: (size) =>
    set({
      arraySize: Math.max(
        SORTING_CONFIG.ARRAY_SIZE_MIN,
        Math.min(SORTING_CONFIG.ARRAY_SIZE_MAX, size)
      ),
      initialArray: null,
    }),

  setInitialArray: (array) => set({ initialArray: array }),

  clearInitialArray: () => set({ initialArray: null }),

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
  setTreeDataStructure: (structure) =>
    set((state) => {
      // Reset tree and algorithm when switching data structure
      const availableAlgorithms = TREE_OPERATIONS[structure];
      const newAlgorithm = availableAlgorithms.includes(state.treeAlgorithm)
        ? state.treeAlgorithm
        : (availableAlgorithms[0] ?? TREE_CONFIG.ALGORITHM_DEFAULT);
      return {
        treeDataStructure: structure,
        treeAlgorithm: newAlgorithm,
        treeState: createEmptyTreeState(),
      };
    }),

  setTreeAlgorithm: (algo) => set({ treeAlgorithm: algo }),

  insertNode: (value) => {
    let insertedId: string | null = null;

    set((state) => {
      const { treeState, treeDataStructure } = state;
      const nodeCount = Object.keys(treeState.nodes).length;

      // Enforce max node limit
      if (nodeCount >= TREE_CONFIG.MAX_NODES) {
        return state;
      }

      // Empty tree - insert as root (same for all data structures)
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

      // Max Heap: Insert at next available position, then bubble up
      if (treeDataStructure === "max-heap") {
        return insertHeapNode(treeState, value, (id) => {
          insertedId = id;
        });
      }

      // AVL: Insert like BST, then rebalance with rotations
      if (treeDataStructure === "avl") {
        return insertAVLNode(treeState, value, (id) => {
          insertedId = id;
        });
      }

      // BST/AVL: Find insertion point using BST property
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
      const { treeState, treeDataStructure } = state;

      // Empty tree
      if (treeState.rootId === null) {
        return state;
      }

      // Max Heap: Extract max (ignore value parameter - always removes root)
      if (treeDataStructure === "max-heap") {
        const result = extractHeapMax(treeState);
        deleted = result.extracted;
        return { treeState: result.treeState };
      }

      // AVL: Delete like BST, then rebalance with rotations
      if (treeDataStructure === "avl") {
        const result = deleteAVLNode(treeState, value);
        deleted = result.deleted;
        return { treeState: result.treeState };
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

  swapNodeChildren: (nodeId) =>
    set((state) => {
      const node = state.treeState.nodes[nodeId];
      if (!node) return state;

      return {
        treeState: {
          ...state.treeState,
          nodes: {
            ...state.treeState.nodes,
            [nodeId]: {
              ...node,
              leftId: node.rightId,
              rightId: node.leftId,
            },
          },
        },
      };
    }),

  splayNode: (nodeId) =>
    set((state) => {
      const newTreeState = splayNodeToRoot(state.treeState, nodeId);
      return { treeState: newTreeState };
    }),

  fillRandomHeap: (count) =>
    set(() => {
      // Clamp count to valid range
      const nodeCount = Math.min(Math.max(1, count), TREE_CONFIG.MAX_NODES);

      // Generate random unique values in the configured range
      const values: number[] = [];
      const usedValues = new Set<number>();

      while (values.length < nodeCount) {
        const value =
          Math.floor(Math.random() * (TREE_CONFIG.VALUE_MAX - TREE_CONFIG.VALUE_MIN + 1)) +
          TREE_CONFIG.VALUE_MIN;
        if (!usedValues.has(value)) {
          usedValues.add(value);
          values.push(value);
        }
      }

      // Build a complete binary tree with the random values
      // (complete = all levels full except possibly last, which is filled left-to-right)
      const nodes: Record<string, TreeNode> = {};
      const nodeIds: string[] = [];

      // Create all nodes first
      for (let i = 0; i < nodeCount; i++) {
        const id = generateNodeId();
        nodeIds.push(id);
        // Values array guaranteed to have nodeCount elements
        const value = values[i] as number;
        nodes[id] = {
          id,
          value,
          leftId: null,
          rightId: null,
          parentId: null,
        };
      }

      // Link nodes in complete binary tree structure
      for (let i = 0; i < nodeCount; i++) {
        const nodeId = nodeIds[i];
        // nodeId is guaranteed to exist since we just created nodeCount nodes
        if (!nodeId) continue;
        const node = nodes[nodeId];
        if (!node) continue;

        const leftChildIndex = 2 * i + 1;
        const rightChildIndex = 2 * i + 2;

        if (leftChildIndex < nodeCount) {
          const leftChildId = nodeIds[leftChildIndex];
          if (leftChildId) {
            node.leftId = leftChildId;
            const leftChild = nodes[leftChildId];
            if (leftChild) {
              leftChild.parentId = nodeId;
            }
          }
        }

        if (rightChildIndex < nodeCount) {
          const rightChildId = nodeIds[rightChildIndex];
          if (rightChildId) {
            node.rightId = rightChildId;
            const rightChild = nodes[rightChildId];
            if (rightChild) {
              rightChild.parentId = nodeId;
            }
          }
        }
      }

      return {
        treeState: {
          rootId: nodeIds[0] ?? null,
          nodes,
        },
      };
    }),

  heapifySwap: (parentId, childId) =>
    set((state) => {
      const parent = state.treeState.nodes[parentId];
      const child = state.treeState.nodes[childId];

      if (!parent || !child) return state;

      // Swap values between parent and child
      return {
        treeState: {
          ...state.treeState,
          nodes: {
            ...state.treeState.nodes,
            [parentId]: { ...parent, value: child.value },
            [childId]: { ...child, value: parent.value },
          },
        },
      };
    }),

  // Graph actions
  setGraphAlgorithm: (algo) => set({ graphAlgorithm: algo }),

  addGraphNode: (x, y, label) => {
    let insertedId: string | null = null;

    set((state) => {
      const nodeCount = Object.keys(state.graphState.nodes).length;

      // Enforce max node limit
      if (nodeCount >= GRAPH_CONFIG.MAX_NODES) {
        return state;
      }

      const newId = generateGraphNodeId();
      insertedId = newId;

      // Auto-generate label if not provided
      const nodeLabel = label ?? GRAPH_CONFIG.NODE_LABELS[nodeCount] ?? `N${nodeCount + 1}`;

      const newNode: GraphNode = {
        id: newId,
        x,
        y,
        label: nodeLabel,
      };

      return {
        graphState: {
          ...state.graphState,
          nodes: {
            ...state.graphState.nodes,
            [newId]: newNode,
          },
        },
      };
    });

    return insertedId;
  },

  addGraphEdge: (sourceId, targetId, weight) => {
    let insertedId: string | null = null;

    set((state) => {
      const { graphState } = state;
      const edgeCount = Object.keys(graphState.edges).length;

      // Enforce max edge limit
      if (edgeCount >= GRAPH_CONFIG.MAX_EDGES) {
        return state;
      }

      // Validate that both nodes exist
      if (!graphState.nodes[sourceId] || !graphState.nodes[targetId]) {
        return state;
      }

      // Prevent self-loops
      if (sourceId === targetId) {
        return state;
      }

      // Check for duplicate edges
      const existingEdge = Object.values(graphState.edges).find((edge) => {
        if (graphState.isDirected) {
          return edge.sourceId === sourceId && edge.targetId === targetId;
        }
        // For undirected graphs, check both directions
        return (
          (edge.sourceId === sourceId && edge.targetId === targetId) ||
          (edge.sourceId === targetId && edge.targetId === sourceId)
        );
      });

      if (existingEdge) {
        return state;
      }

      const newId = generateGraphEdgeId();
      insertedId = newId;

      const newEdge: GraphEdge = {
        id: newId,
        sourceId,
        targetId,
        weight: weight ?? GRAPH_CONFIG.DEFAULT_WEIGHT,
      };

      return {
        graphState: {
          ...graphState,
          edges: {
            ...graphState.edges,
            [newId]: newEdge,
          },
        },
      };
    });

    return insertedId;
  },

  updateGraphNodePosition: (nodeId, x, y) =>
    set((state) => {
      const node = state.graphState.nodes[nodeId];
      if (!node) return state;

      return {
        graphState: {
          ...state.graphState,
          nodes: {
            ...state.graphState.nodes,
            [nodeId]: { ...node, x, y },
          },
        },
      };
    }),

  updateGraphEdgeWeight: (edgeId, weight) =>
    set((state) => {
      const edge = state.graphState.edges[edgeId];
      if (!edge) return state;

      return {
        graphState: {
          ...state.graphState,
          edges: {
            ...state.graphState.edges,
            [edgeId]: { ...edge, weight },
          },
        },
      };
    }),

  removeGraphNode: (nodeId) => {
    let deleted = false;

    set((state) => {
      const { graphState } = state;

      if (!graphState.nodes[nodeId]) {
        return state;
      }

      deleted = true;

      // Remove the node
      const newNodes = { ...graphState.nodes };
      delete newNodes[nodeId];

      // Remove all edges connected to this node
      const newEdges: Record<string, GraphEdge> = {};
      for (const [edgeId, edge] of Object.entries(graphState.edges)) {
        if (edge.sourceId !== nodeId && edge.targetId !== nodeId) {
          newEdges[edgeId] = edge;
        }
      }

      return {
        graphState: {
          ...graphState,
          nodes: newNodes,
          edges: newEdges,
        },
      };
    });

    return deleted;
  },

  removeGraphEdge: (edgeId) => {
    let deleted = false;

    set((state) => {
      const { graphState } = state;

      if (!graphState.edges[edgeId]) {
        return state;
      }

      deleted = true;

      const newEdges = { ...graphState.edges };
      delete newEdges[edgeId];

      return {
        graphState: {
          ...graphState,
          edges: newEdges,
        },
      };
    });

    return deleted;
  },

  setGraphDirected: (isDirected) =>
    set((state) => ({
      graphState: {
        ...state.graphState,
        isDirected,
      },
    })),

  clearGraph: () =>
    set({
      graphState: createEmptyGraphState(),
    }),

  setGraphState: (newGraphState) => set({ graphState: newGraphState }),

  // Interview actions
  setInterviewProblem: (problem) => set({ interviewProblem: problem }),

  setInterviewHeights: (heights) =>
    set({
      interviewState: createDefaultInterviewState(heights),
    }),

  updateInterviewState: (partialState) =>
    set((state) => ({
      interviewState: {
        ...state.interviewState,
        ...partialState,
      },
    })),

  resetInterviewState: () =>
    set((state) => ({
      interviewState: createDefaultInterviewState(state.interviewState.heights),
    })),

  // Patterns actions
  setPatternProblem: (problem) => set({ patternProblem: problem }),

  setPatternInput: (input) =>
    set({
      patternInput: input,
      patternState: createDefaultPatternState(input),
    }),

  updatePatternState: (partialState) =>
    set((state) => ({
      patternState: {
        ...state.patternState,
        ...partialState,
      },
    })),

  resetPatternState: () =>
    set((state) => ({
      patternState: createDefaultPatternState(state.patternInput),
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
