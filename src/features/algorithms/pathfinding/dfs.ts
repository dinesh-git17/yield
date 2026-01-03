import type { GridCoord } from "@/lib/store";
import {
  coordsEqual,
  getNeighbors,
  type PathfindingContext,
  type PathfindingStep,
  toKey,
} from "./types";

/**
 * Depth-First Search pathfinding algorithm.
 *
 * Explores as deep as possible before backtracking, creating
 * a "snake-like" exploration pattern. Does not guarantee shortest path.
 *
 * @param context - Grid configuration and node positions
 * @yields PathfindingStep - visit, current, path, or no-path operations
 */
export function* dfs(context: PathfindingContext): Generator<PathfindingStep, void, unknown> {
  const { start, end } = context;

  // DFS uses a stack (LIFO)
  const stack: Array<{ coord: GridCoord; distance: number }> = [{ coord: start, distance: 0 }];

  // Track visited nodes and their parents for path reconstruction
  const visited = new Set<string>();
  const parent = new Map<string, GridCoord>();

  while (stack.length > 0) {
    // Pop from top of stack
    const current = stack.pop();
    if (!current) break;

    const { coord, distance } = current;
    const key = toKey(coord);

    // Skip if already visited (can happen due to stack nature)
    if (visited.has(key)) continue;
    visited.add(key);

    // Skip start node for visualization (it's already visible)
    if (!coordsEqual(coord, start)) {
      yield { type: "current", coord, distance };
    }

    // Check if we reached the end
    if (coordsEqual(coord, end)) {
      // Reconstruct path from end to start
      yield* reconstructPath(parent, start, end);
      return;
    }

    // Mark as visited after checking
    if (!coordsEqual(coord, start)) {
      yield { type: "visit", coord, distance };
    }

    // Explore neighbors (push in reverse order for consistent left-to-right exploration)
    const neighbors = getNeighbors(coord, context);
    for (let i = neighbors.length - 1; i >= 0; i--) {
      const neighbor = neighbors[i];
      if (!neighbor) continue;

      const neighborKey = toKey(neighbor);
      if (!visited.has(neighborKey)) {
        parent.set(neighborKey, coord);
        stack.push({ coord: neighbor, distance: distance + 1 });
      }
    }
  }

  // No path found
  yield { type: "no-path" };
}

/**
 * Reconstruct the path from start to end using parent pointers.
 */
function* reconstructPath(
  parent: Map<string, GridCoord>,
  start: GridCoord,
  end: GridCoord
): Generator<PathfindingStep, void, unknown> {
  const path: GridCoord[] = [];
  let current: GridCoord | undefined = end;

  while (current && !coordsEqual(current, start)) {
    path.push(current);
    current = parent.get(toKey(current));
  }

  // Yield path nodes from start to end (reverse order)
  for (let i = path.length - 1; i >= 0; i--) {
    const coord = path[i];
    if (coord) {
      yield { type: "path", coord };
    }
  }
}
