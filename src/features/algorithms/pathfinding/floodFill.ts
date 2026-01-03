import type { GridCoord } from "@/lib/store";
import {
  coordsEqual,
  getNeighbors,
  type PathfindingContext,
  type PathfindingStep,
  toKey,
} from "./types";

/**
 * Flood Fill (Wave Propagation) pathfinding algorithm.
 *
 * Essentially BFS, but it doesn't stop when it hits the target.
 * It explores EVERY reachable node, showing the complete "basin of attraction"
 * for the start node.
 *
 * This visualizes like a wave expanding outward until it fills all
 * reachable space. The path to the end (if reachable) is reconstructed
 * after the flood completes.
 *
 * Useful for:
 * - Visualizing all reachable areas from a starting point
 * - Understanding connectivity in a maze
 * - Showing distance gradients across the entire grid
 *
 * @param context - Grid configuration and node positions
 * @yields PathfindingStep - visit, current, path, or no-path operations
 */
export function* floodFill(context: PathfindingContext): Generator<PathfindingStep, void, unknown> {
  const { start, end } = context;

  // BFS uses a queue (FIFO)
  const queue: Array<{ coord: GridCoord; distance: number }> = [{ coord: start, distance: 0 }];

  // Track visited nodes and their parents for path reconstruction
  const visited = new Set<string>([toKey(start)]);
  const parent = new Map<string, GridCoord>();

  // Track if we found the end (but don't stop there)
  let foundEnd = false;

  while (queue.length > 0) {
    // Dequeue front element
    const current = queue.shift();
    if (!current) break;

    const { coord, distance } = current;

    // Skip start node for visualization (it's already visible)
    if (!coordsEqual(coord, start)) {
      yield { type: "current", coord, distance };
    }

    // Note if we found the end (but keep going)
    if (coordsEqual(coord, end)) {
      foundEnd = true;
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

  // After flooding everything, reconstruct path if end was reached
  if (foundEnd) {
    yield* reconstructPath(parent, start, end);
  } else {
    yield { type: "no-path" };
  }
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
