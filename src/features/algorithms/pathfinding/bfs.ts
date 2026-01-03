import type { GridCoord } from "@/lib/store";
import {
  coordsEqual,
  getNeighbors,
  type PathfindingContext,
  type PathfindingStep,
  toKey,
} from "./types";

/**
 * Breadth-First Search pathfinding algorithm.
 *
 * Explores the grid layer by layer, guaranteeing the shortest path
 * in an unweighted graph. Visualizes like a "flood" expanding outward.
 *
 * @param context - Grid configuration and node positions
 * @yields PathfindingStep - visit, current, path, or no-path operations
 */
export function* bfs(context: PathfindingContext): Generator<PathfindingStep, void, unknown> {
  const { start, end } = context;

  // BFS uses a queue (FIFO)
  const queue: Array<{ coord: GridCoord; distance: number }> = [{ coord: start, distance: 0 }];

  // Track visited nodes and their parents for path reconstruction
  const visited = new Set<string>([toKey(start)]);
  const parent = new Map<string, GridCoord>();

  while (queue.length > 0) {
    // Dequeue front element
    const current = queue.shift();
    if (!current) break;

    const { coord, distance } = current;

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

    // Explore neighbors
    const neighbors = getNeighbors(coord, context);
    for (const neighbor of neighbors) {
      const neighborKey = toKey(neighbor);

      if (!visited.has(neighborKey)) {
        visited.add(neighborKey);
        parent.set(neighborKey, coord);
        queue.push({ coord: neighbor, distance: distance + 1 });
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
