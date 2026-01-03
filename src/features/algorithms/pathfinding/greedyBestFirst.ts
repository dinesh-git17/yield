import type { GridCoord } from "@/lib/store";
import { type HeuristicFunction, manhattan } from "./heuristics";
import {
  coordsEqual,
  getNeighbors,
  type PathfindingContext,
  type PathfindingStep,
  toKey,
} from "./types";

/**
 * Priority queue node for Greedy Best-First Search.
 * Uses f = h scoring where h is the heuristic estimate to the goal.
 * Unlike A*, we don't track g (cost from start).
 */
interface GreedyNode {
  coord: GridCoord;
  h: number; // Heuristic estimate to goal (used as priority)
  /** Distance from start (tracked for visualization only, not used in priority) */
  distance: number;
}

/**
 * Min-heap implementation for Greedy Best-First priority queue.
 * Orders by h-score (heuristic estimate only).
 */
class GreedyHeap {
  private heap: GreedyNode[] = [];

  get size(): number {
    return this.heap.length;
  }

  push(node: GreedyNode): void {
    this.heap.push(node);
    this.bubbleUp(this.heap.length - 1);
  }

  pop(): GreedyNode | undefined {
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

      if (!parent || !current || parent.h <= current.h) break;

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

      if (left && leftIndex < length && left.h < (current?.h ?? Number.POSITIVE_INFINITY)) {
        smallest = leftIndex;
      }

      const smallestNode = this.heap[smallest];
      if (right && rightIndex < length && right.h < (smallestNode?.h ?? Number.POSITIVE_INFINITY)) {
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
 * Greedy Best-First Search pathfinding algorithm.
 *
 * Uses only a configurable heuristic to guide search toward the goal.
 * Does NOT guarantee shortest path - only considers distance to goal, ignoring
 * distance traveled from start.
 *
 * This creates a "laser beam" effect toward the target, making it very fast
 * on open grids but prone to getting stuck in concave obstacles (U-shaped walls).
 *
 * The search front is narrow and directed, unlike A*'s expanding circle.
 *
 * @param context - Grid configuration and node positions
 * @param heuristic - Distance estimation function (defaults to Manhattan)
 * @yields PathfindingStep - visit, current, path, or no-path operations
 */
export function* greedyBestFirst(
  context: PathfindingContext,
  heuristic: HeuristicFunction = manhattan
): Generator<PathfindingStep, void, unknown> {
  const { start, end } = context;

  // Priority queue ordered by heuristic only (f = h)
  const openSet = new GreedyHeap();
  const startH = heuristic(start, end);
  openSet.push({ coord: start, h: startH, distance: 0 });

  const closedSet = new Set<string>();
  const parent = new Map<string, GridCoord>();
  const distances = new Map<string, number>();
  distances.set(toKey(start), 0);

  while (openSet.size > 0) {
    const current = openSet.pop();
    if (!current) break;

    const { coord, distance } = current;
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

      // Only add if not already seen (no re-evaluation like A*)
      if (!distances.has(neighborKey)) {
        parent.set(neighborKey, coord);
        distances.set(neighborKey, distance + 1);

        // Priority is purely heuristic - ignore cost from start
        const h = heuristic(neighbor, end);
        openSet.push({ coord: neighbor, h, distance: distance + 1 });
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
