/**
 * Centralized SEO configuration for sitemap and metadata generation.
 * Keep in sync with store.ts type definitions.
 */

import type {
  GraphAlgorithmType,
  PathfindingAlgorithmType,
  SortingAlgorithmType,
  TreeDataStructureType,
  VisualizerMode,
} from "./store";

/**
 * All valid visualizer modes for sitemap generation.
 */
export const VALID_MODES: VisualizerMode[] = ["sorting", "pathfinding", "tree", "graph"];

/**
 * All valid sorting algorithms.
 */
export const VALID_SORTING_ALGORITHMS: SortingAlgorithmType[] = [
  "bubble",
  "selection",
  "insertion",
  "gnome",
  "quick",
  "merge",
  "heap",
];

/**
 * All valid pathfinding algorithms.
 */
export const VALID_PATHFINDING_ALGORITHMS: PathfindingAlgorithmType[] = [
  "bfs",
  "dfs",
  "dijkstra",
  "astar",
  "greedy",
  "bidirectional",
  "flood",
  "random",
];

/**
 * All valid tree data structures.
 */
export const VALID_TREE_STRUCTURES: TreeDataStructureType[] = ["bst", "avl", "max-heap", "splay"];

/**
 * All valid graph algorithms.
 */
export const VALID_GRAPH_ALGORITHMS: GraphAlgorithmType[] = ["prim", "kruskal", "kahn"];

/**
 * Generates all learn page routes for sitemap generation.
 */
export function generateLearnRoutes(): Array<{ mode: VisualizerMode; slug: string }> {
  const routes: Array<{ mode: VisualizerMode; slug: string }> = [];

  for (const algorithm of VALID_SORTING_ALGORITHMS) {
    routes.push({ mode: "sorting", slug: algorithm });
  }

  for (const algorithm of VALID_PATHFINDING_ALGORITHMS) {
    routes.push({ mode: "pathfinding", slug: algorithm });
  }

  for (const structure of VALID_TREE_STRUCTURES) {
    routes.push({ mode: "tree", slug: structure });
  }

  for (const algorithm of VALID_GRAPH_ALGORITHMS) {
    routes.push({ mode: "graph", slug: algorithm });
  }

  return routes;
}
