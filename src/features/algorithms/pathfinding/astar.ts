import type { GridCoord } from "@/lib/store";
import {
  coordsEqual,
  getNeighbors,
  type PathfindingContext,
  type PathfindingStep,
  toKey,
} from "./types";

/**
 * Priority queue node for A* algorithm.
 * Uses f = g + h scoring where:
 * - g: actual cost from start to this node
 * - h: heuristic estimate from this node to goal
 * - f: total estimated cost (used for priority)
 */
interface AStarNode {
  coord: GridCoord;
  g: number; // Cost from start
  f: number; // Total score (g + h)
}

/**
 * Min-heap implementation for A* priority queue.
 * Orders by f-score (total estimated cost).
 */
class AStarHeap {
  private heap: AStarNode[] = [];

  get size(): number {
    return this.heap.length;
  }

  push(node: AStarNode): void {
    this.heap.push(node);
    this.bubbleUp(this.heap.length - 1);
  }

  pop(): AStarNode | undefined {
    if (this.heap.length === 0) return undefined;
    if (this.heap.length === 1) return this.heap.pop();

    const min = this.heap[0];
    const last = this.heap.pop();
    if (last && this.heap.length > 0) {
      this.heap[0] = last;
      this.bubbleDown(0);
    }
    return min;
  }

  private bubbleUp(index: number): void {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      const parent = this.heap[parentIndex];
      const current = this.heap[index];

      if (!parent || !current || parent.f <= current.f) break;

      this.heap[parentIndex] = current;
      this.heap[index] = parent;
      index = parentIndex;
    }
  }

  private bubbleDown(index: number): void {
    const length = this.heap.length;

    while (true) {
      const leftIndex = 2 * index + 1;
      const rightIndex = 2 * index + 2;
      let smallest = index;

      const current = this.heap[index];
      const left = this.heap[leftIndex];
      const right = this.heap[rightIndex];

      if (left && leftIndex < length && left.f < (current?.f ?? Number.POSITIVE_INFINITY)) {
        smallest = leftIndex;
      }

      const smallestNode = this.heap[smallest];
      if (right && rightIndex < length && right.f < (smallestNode?.f ?? Number.POSITIVE_INFINITY)) {
        smallest = rightIndex;
      }

      if (smallest === index) break;

      const swap = this.heap[smallest];
      if (swap && current) {
        this.heap[smallest] = current;
        this.heap[index] = swap;
      }
      index = smallest;
    }
  }
}

/**
 * Manhattan distance heuristic.
 * Admissible heuristic for 4-directional grid movement.
 */
function manhattanDistance(a: GridCoord, b: GridCoord): number {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

/**
 * A* pathfinding algorithm.
 *
 * Uses Manhattan distance heuristic to guide search toward the goal.
 * Guarantees shortest path when heuristic is admissible (never overestimates).
 * More efficient than Dijkstra for single-target searches.
 *
 * The heuristic makes A* expand nodes preferentially toward the goal,
 * resulting in fewer visited nodes compared to Dijkstra.
 *
 * @param context - Grid configuration and node positions
 * @yields PathfindingStep - visit, current, path, or no-path operations
 */
export function* aStar(context: PathfindingContext): Generator<PathfindingStep, void, unknown> {
  const { start, end } = context;

  // Priority queue ordered by f-score
  const openSet = new AStarHeap();
  const startH = manhattanDistance(start, end);
  openSet.push({ coord: start, g: 0, f: startH });

  // Track g-scores (cost from start) and visited nodes
  const gScores = new Map<string, number>();
  gScores.set(toKey(start), 0);

  const closedSet = new Set<string>();
  const parent = new Map<string, GridCoord>();

  while (openSet.size > 0) {
    const current = openSet.pop();
    if (!current) break;

    const { coord, g: distance } = current;
    const key = toKey(coord);

    // Skip if already processed
    if (closedSet.has(key)) continue;
    closedSet.add(key);

    // Visualize current node (skip start)
    if (!coordsEqual(coord, start)) {
      yield { type: "current", coord, distance };
    }

    // Check if we reached the end
    if (coordsEqual(coord, end)) {
      yield* reconstructPath(parent, start, end);
      return;
    }

    // Mark as visited
    if (!coordsEqual(coord, start)) {
      yield { type: "visit", coord, distance };
    }

    // Explore neighbors
    const neighbors = getNeighbors(coord, context);
    for (const neighbor of neighbors) {
      const neighborKey = toKey(neighbor);

      if (closedSet.has(neighborKey)) continue;

      // Calculate tentative g-score (all edges have weight 1)
      const tentativeG = distance + 1;
      const currentG = gScores.get(neighborKey) ?? Number.POSITIVE_INFINITY;

      if (tentativeG < currentG) {
        // Found a better path to neighbor
        parent.set(neighborKey, coord);
        gScores.set(neighborKey, tentativeG);

        const h = manhattanDistance(neighbor, end);
        const f = tentativeG + h;

        openSet.push({ coord: neighbor, g: tentativeG, f });
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
