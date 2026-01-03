import type { PathfindingAlgorithmType } from "@/lib/store";
import type { PathfindingStep } from "./types";

/**
 * Step type labels for display in the UI.
 */
export const PATHFINDING_STEP_LABELS: Record<PathfindingStep["type"], string> = {
  visit: "Exploring node",
  current: "Processing node",
  path: "Building path",
  "no-path": "No path found",
};

/**
 * Metadata for each pathfinding algorithm.
 */
export interface PathfindingAlgorithmMetadata {
  /** Display name for the algorithm */
  label: string;
  /** Short label for compact display */
  shortLabel: string;
  /** Time complexity notation */
  complexity: string;
  /** Space complexity notation */
  spaceComplexity: string;
  /** Brief description of how the algorithm works */
  description: string;
  /** Whether this algorithm guarantees shortest path */
  guaranteesShortestPath: boolean;
  /** Visual pattern description */
  visualPattern: string;
  /** Source code lines for display */
  code: string[];
  /** Maps step types to their corresponding line indices (0-based) */
  lineMapping: Partial<Record<PathfindingStep["type"], number>>;
}

/**
 * Pathfinding algorithm metadata registry.
 */
export const PATHFINDING_ALGO_METADATA: Record<
  PathfindingAlgorithmType,
  PathfindingAlgorithmMetadata
> = {
  bfs: {
    label: "Breadth-First Search",
    shortLabel: "BFS",
    complexity: "O(V + E)",
    spaceComplexity: "O(V)",
    description:
      "Explores layer by layer, visiting all neighbors before moving deeper. Guarantees shortest path in unweighted graphs.",
    guaranteesShortestPath: true,
    visualPattern: "Flood expansion",
    code: [
      "function* bfs(grid, start, end) {",
      "  const queue = [{ coord: start, dist: 0 }];",
      "  const visited = new Set([key(start)]);",
      "  const parent = new Map();",
      "",
      "  while (queue.length > 0) {",
      "    // Dequeue front element",
      "    const { coord, dist } = queue.shift();",
      "    yield { type: 'current', coord, dist };",
      "",
      "    // Check if we reached the end",
      "    if (equals(coord, end)) {",
      "      yield* reconstructPath(parent, start, end);",
      "      return;",
      "    }",
      "",
      "    yield { type: 'visit', coord, dist };",
      "",
      "    // Explore all neighbors",
      "    for (const neighbor of getNeighbors(coord)) {",
      "      if (!visited.has(key(neighbor))) {",
      "        visited.add(key(neighbor));",
      "        parent.set(key(neighbor), coord);",
      "        queue.push({ coord: neighbor, dist: dist + 1 });",
      "      }",
      "    }",
      "  }",
      "",
      "  yield { type: 'no-path' };",
      "}",
    ],
    lineMapping: {
      current: 8,
      path: 12,
      visit: 16,
      "no-path": 28,
    },
  },

  dfs: {
    label: "Depth-First Search",
    shortLabel: "DFS",
    complexity: "O(V + E)",
    spaceComplexity: "O(V)",
    description:
      "Explores as deep as possible before backtracking. Does not guarantee shortest path but uses less memory.",
    guaranteesShortestPath: false,
    visualPattern: "Snake exploration",
    code: [
      "function* dfs(grid, start, end) {",
      "  const stack = [{ coord: start, dist: 0 }];",
      "  const visited = new Set();",
      "  const parent = new Map();",
      "",
      "  while (stack.length > 0) {",
      "    // Pop from top of stack",
      "    const { coord, dist } = stack.pop();",
      "",
      "    if (visited.has(key(coord))) continue;",
      "    visited.add(key(coord));",
      "",
      "    yield { type: 'current', coord, dist };",
      "",
      "    // Check if we reached the end",
      "    if (equals(coord, end)) {",
      "      yield* reconstructPath(parent, start, end);",
      "      return;",
      "    }",
      "",
      "    yield { type: 'visit', coord, dist };",
      "",
      "    // Push neighbors to stack (reverse for consistent order)",
      "    for (const neighbor of getNeighbors(coord).reverse()) {",
      "      if (!visited.has(key(neighbor))) {",
      "        parent.set(key(neighbor), coord);",
      "        stack.push({ coord: neighbor, dist: dist + 1 });",
      "      }",
      "    }",
      "  }",
      "",
      "  yield { type: 'no-path' };",
      "}",
    ],
    lineMapping: {
      current: 12,
      path: 16,
      visit: 20,
      "no-path": 31,
    },
  },

  dijkstra: {
    label: "Dijkstra's Algorithm",
    shortLabel: "Dijkstra",
    complexity: "O((V + E) log V)",
    spaceComplexity: "O(V)",
    description:
      "Uses a priority queue to always explore the nearest unvisited node. Guarantees shortest path even in weighted graphs.",
    guaranteesShortestPath: true,
    visualPattern: "Radial expansion",
    code: [
      "function* dijkstra(grid, start, end) {",
      "  const pq = new MinHeap();",
      "  pq.push({ coord: start, dist: 0 });",
      "",
      "  const distances = new Map([[key(start), 0]]);",
      "  const visited = new Set();",
      "  const parent = new Map();",
      "",
      "  while (pq.size > 0) {",
      "    // Extract minimum distance node",
      "    const { coord, dist } = pq.pop();",
      "",
      "    if (visited.has(key(coord))) continue;",
      "    visited.add(key(coord));",
      "",
      "    yield { type: 'current', coord, dist };",
      "",
      "    if (equals(coord, end)) {",
      "      yield* reconstructPath(parent, start, end);",
      "      return;",
      "    }",
      "",
      "    yield { type: 'visit', coord, dist };",
      "",
      "    // Relax edges to neighbors",
      "    for (const neighbor of getNeighbors(coord)) {",
      "      const newDist = dist + 1;",
      "      const oldDist = distances.get(key(neighbor)) ?? Infinity;",
      "",
      "      if (newDist < oldDist) {",
      "        distances.set(key(neighbor), newDist);",
      "        parent.set(key(neighbor), coord);",
      "        pq.push({ coord: neighbor, dist: newDist });",
      "      }",
      "    }",
      "  }",
      "",
      "  yield { type: 'no-path' };",
      "}",
    ],
    lineMapping: {
      current: 15,
      path: 18,
      visit: 22,
      "no-path": 37,
    },
  },

  astar: {
    label: "A* Search",
    shortLabel: "A*",
    complexity: "O((V + E) log V)",
    spaceComplexity: "O(V)",
    description:
      "Uses heuristic (Manhattan distance) to guide search toward goal. More efficient than Dijkstra for point-to-point search.",
    guaranteesShortestPath: true,
    visualPattern: "Directed expansion",
    code: [
      "function* aStar(grid, start, end) {",
      "  const pq = new MinHeap();",
      "  const h = manhattan(start, end);",
      "  pq.push({ coord: start, g: 0, f: h });",
      "",
      "  const gScores = new Map([[key(start), 0]]);",
      "  const closed = new Set();",
      "  const parent = new Map();",
      "",
      "  while (pq.size > 0) {",
      "    // Extract node with lowest f-score",
      "    const { coord, g } = pq.pop();",
      "",
      "    if (closed.has(key(coord))) continue;",
      "    closed.add(key(coord));",
      "",
      "    yield { type: 'current', coord, distance: g };",
      "",
      "    if (equals(coord, end)) {",
      "      yield* reconstructPath(parent, start, end);",
      "      return;",
      "    }",
      "",
      "    yield { type: 'visit', coord, distance: g };",
      "",
      "    for (const neighbor of getNeighbors(coord)) {",
      "      if (closed.has(key(neighbor))) continue;",
      "",
      "      const tentativeG = g + 1;",
      "      const currentG = gScores.get(key(neighbor)) ?? Infinity;",
      "",
      "      if (tentativeG < currentG) {",
      "        parent.set(key(neighbor), coord);",
      "        gScores.set(key(neighbor), tentativeG);",
      "        const f = tentativeG + manhattan(neighbor, end);",
      "        pq.push({ coord: neighbor, g: tentativeG, f });",
      "      }",
      "    }",
      "  }",
      "",
      "  yield { type: 'no-path' };",
      "}",
    ],
    lineMapping: {
      current: 16,
      path: 19,
      visit: 23,
      "no-path": 40,
    },
  },
};

/**
 * Get metadata for a specific pathfinding algorithm.
 * Falls back to BFS if algorithm not found.
 */
export function getPathfindingAlgorithmMetadata(
  algorithm: PathfindingAlgorithmType
): PathfindingAlgorithmMetadata {
  return PATHFINDING_ALGO_METADATA[algorithm] ?? PATHFINDING_ALGO_METADATA.bfs;
}
