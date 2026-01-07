/**
 * Centralized SEO configuration for sitemap and metadata generation.
 * Keep in sync with store.ts type definitions.
 */

import type { PatternSlug } from "@/features/learning/content/patterns";
import type {
  GraphAlgorithmType,
  InterviewProblemType,
  PathfindingAlgorithmType,
  SortingAlgorithmType,
  TreeDataStructureType,
  VisualizerMode,
} from "./store";

/**
 * Learn page mode type (includes sliding-window which maps to patterns in the visualizer).
 */
export type LearnPageMode = VisualizerMode | "sliding-window";

/**
 * All valid visualizer modes for sitemap generation.
 */
export const VALID_MODES: VisualizerMode[] = [
  "sorting",
  "pathfinding",
  "tree",
  "graph",
  "interview",
];

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
 * All valid interview problems.
 */
export const VALID_INTERVIEW_PROBLEMS: InterviewProblemType[] = [
  "trapping-rain-water",
  "largest-rectangle-histogram",
];

/**
 * All valid pattern problem slugs for learn pages.
 */
export const VALID_PATTERN_SLUGS: PatternSlug[] = ["longest-substring"];

/**
 * Generates all learn page routes for sitemap generation.
 */
export function generateLearnRoutes(): Array<{ mode: LearnPageMode; slug: string }> {
  const routes: Array<{ mode: LearnPageMode; slug: string }> = [];

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

  for (const problem of VALID_INTERVIEW_PROBLEMS) {
    routes.push({ mode: "interview", slug: problem });
  }

  for (const slug of VALID_PATTERN_SLUGS) {
    routes.push({ mode: "sliding-window", slug });
  }

  return routes;
}
