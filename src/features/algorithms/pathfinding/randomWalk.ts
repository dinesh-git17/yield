import type { GridCoord } from "@/lib/store";
import {
  coordsEqual,
  getNeighbors,
  type PathfindingContext,
  type PathfindingStep,
  toKey,
} from "./types";

/**
 * Maximum number of steps before giving up.
 * Random walks can take a very long time to find the goal.
 */
const MAX_STEPS = 1000;

/**
 * Random Walk (Chaos Mode) pathfinding algorithm.
 *
 * A "Monte Carlo" style approach where the agent randomly picks a valid
 * neighbor and moves there. No heuristics, no memory of where it's been
 * (beyond parent tracking for path reconstruction).
 *
 * This algorithm demonstrates why heuristics matter - it shows how "dumb"
 * a search can be without guidance. The agent wanders aimlessly and may
 * never find the goal, or take an extremely long path.
 *
 * Visual pattern: Chaotic wandering, often revisiting the same areas.
 *
 * @param context - Grid configuration and node positions
 * @yields PathfindingStep - visit, current, path, or no-path operations
 */
export function* randomWalk(
  context: PathfindingContext
): Generator<PathfindingStep, void, unknown> {
  const { start, end } = context;

  // Handle start equals end case
  if (coordsEqual(start, end)) {
    return;
  }

  let current = start;
  let steps = 0;

  // Track first visit to each node for path reconstruction
  const firstVisitParent = new Map<string, GridCoord>();
  const visited = new Set<string>();
  visited.add(toKey(start));

  while (steps < MAX_STEPS) {
    steps++;

    // Get valid neighbors
    const neighbors = getNeighbors(current, context);

    if (neighbors.length === 0) {
      // Stuck with no valid moves - should be rare
      yield { type: "no-path" };
      return;
    }

    // Pick a random neighbor
    const randomIndex = Math.floor(Math.random() * neighbors.length);
    const next = neighbors[randomIndex];
    if (!next) continue;

    const nextKey = toKey(next);

    // Track parent only on first visit (for valid path reconstruction)
    if (!visited.has(nextKey)) {
      firstVisitParent.set(nextKey, current);
      visited.add(nextKey);
    }

    // Move to the next position
    current = next;

    // Yield current position (the "head" of the walk)
    yield { type: "current", coord: current, distance: steps };

    // Check if we reached the end
    if (coordsEqual(current, end)) {
      yield* reconstructPath(firstVisitParent, start, end);
      return;
    }

    // Mark as visited for visualization
    yield { type: "visit", coord: current, distance: steps };
  }

  // Max steps reached without finding the goal
  yield { type: "no-path" };
}

/**
 * Reconstruct the path from start to end using first-visit parent pointers.
 * This gives a valid (though not necessarily shortest) path.
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
