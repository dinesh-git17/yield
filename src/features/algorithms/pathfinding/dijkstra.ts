import type { GridCoord } from "@/lib/store";
import {
  coordsEqual,
  getNeighbors,
  type PathfindingContext,
  type PathfindingStep,
  toKey,
} from "./types";

/**
 * Priority queue node for Dijkstra's algorithm.
 */
interface PriorityNode {
  coord: GridCoord;
  distance: number;
}

/**
 * Min-heap implementation for priority queue.
 * Optimized for pathfinding where we need efficient extract-min operations.
 */
class MinHeap {
  private heap: PriorityNode[] = [];

  get size(): number {
    return this.heap.length;
  }

  push(node: PriorityNode): void {
    this.heap.push(node);
    this.bubbleUp(this.heap.length - 1);
  }

  pop(): PriorityNode | undefined {
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

      if (!parent || !current || parent.distance <= current.distance) break;

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

      if (
        left &&
        leftIndex < length &&
        left.distance < (current?.distance ?? Number.POSITIVE_INFINITY)
      ) {
        smallest = leftIndex;
      }

      const smallestNode = this.heap[smallest];
      if (
        right &&
        rightIndex < length &&
        right.distance < (smallestNode?.distance ?? Number.POSITIVE_INFINITY)
      ) {
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
 * Dijkstra's pathfinding algorithm.
 *
 * Uses a priority queue to always explore the nearest unvisited node.
 * Guarantees shortest path and provides distance information for heat map.
 * In an unweighted grid, behaves similarly to BFS but with explicit distance tracking.
 *
 * @param context - Grid configuration and node positions
 * @yields PathfindingStep - visit, current, path, or no-path operations
 */
export function* dijkstra(context: PathfindingContext): Generator<PathfindingStep, void, unknown> {
  const { start, end } = context;

  // Priority queue ordered by distance
  const pq = new MinHeap();
  pq.push({ coord: start, distance: 0 });

  // Track distances and visited nodes
  const distances = new Map<string, number>();
  distances.set(toKey(start), 0);

  const visited = new Set<string>();
  const parent = new Map<string, GridCoord>();

  while (pq.size > 0) {
    const current = pq.pop();
    if (!current) break;

    const { coord, distance } = current;
    const key = toKey(coord);

    // Skip if already visited with shorter distance
    if (visited.has(key)) continue;
    visited.add(key);

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

      if (visited.has(neighborKey)) continue;

      // All edges have weight 1 in unweighted grid
      const newDistance = distance + 1;
      const currentDistance = distances.get(neighborKey) ?? Number.POSITIVE_INFINITY;

      if (newDistance < currentDistance) {
        distances.set(neighborKey, newDistance);
        parent.set(neighborKey, coord);
        pq.push({ coord: neighbor, distance: newDistance });
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
