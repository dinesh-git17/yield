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
 * Priority queue node for A* algorithm.
 */
interface AStarNode {
  coord: GridCoord;
  g: number;
  f: number;
}

/**
 * Min-heap implementation for A* priority queue.
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
 * Bidirectional A* pathfinding algorithm.
 *
 * Runs two simultaneous A* searches: one from Start, one from End.
 * They expand alternately until their frontiers meet in the middle.
 *
 * Advantages:
 * - Explores roughly half the nodes compared to unidirectional A*
 * - Creates a distinctive "tunnel bore" visual effect
 *
 * The meeting point detection checks if the current node being expanded
 * has already been visited by the other search frontier.
 *
 * @param context - Grid configuration and node positions
 * @param heuristic - Distance estimation function (defaults to Manhattan)
 * @yields PathfindingStep - visit, current, path, or no-path operations
 */
export function* bidirectionalAStar(
  context: PathfindingContext,
  heuristic: HeuristicFunction = manhattan
): Generator<PathfindingStep, void, unknown> {
  const { start, end } = context;

  // Early exit if start equals end
  if (coordsEqual(start, end)) {
    return;
  }

  // Forward search (from start toward end)
  const openStart = new AStarHeap();
  const gScoresStart = new Map<string, number>();
  const closedStart = new Set<string>();
  const parentStart = new Map<string, GridCoord>();

  // Backward search (from end toward start)
  const openEnd = new AStarHeap();
  const gScoresEnd = new Map<string, number>();
  const closedEnd = new Set<string>();
  const parentEnd = new Map<string, GridCoord>();

  // Initialize forward search
  const startH = heuristic(start, end);
  openStart.push({ coord: start, g: 0, f: startH });
  gScoresStart.set(toKey(start), 0);

  // Initialize backward search
  const endH = heuristic(end, start);
  openEnd.push({ coord: end, g: 0, f: endH });
  gScoresEnd.set(toKey(end), 0);

  // Track the best meeting point found
  let meetingPoint: GridCoord | null = null;
  let bestPathLength = Number.POSITIVE_INFINITY;

  // Alternate between expanding forward and backward frontiers
  while (openStart.size > 0 || openEnd.size > 0) {
    // Expand one node from forward frontier
    if (openStart.size > 0) {
      const result = yield* expandNode(
        openStart,
        gScoresStart,
        closedStart,
        parentStart,
        closedEnd,
        gScoresEnd,
        start,
        end,
        context,
        heuristic,
        "forward"
      );

      if (result) {
        const pathLen = result.totalDistance;
        if (pathLen < bestPathLength) {
          bestPathLength = pathLen;
          meetingPoint = result.coord;
        }
      }
    }

    // Early termination: if both queues' minimum f-scores exceed best path length
    // we can't find a better path
    if (meetingPoint !== null) {
      const minFStart = openStart.size > 0 ? peekMinF(openStart) : Number.POSITIVE_INFINITY;
      const minFEnd = openEnd.size > 0 ? peekMinF(openEnd) : Number.POSITIVE_INFINITY;
      if (minFStart >= bestPathLength && minFEnd >= bestPathLength) {
        break;
      }
    }

    // Expand one node from backward frontier
    if (openEnd.size > 0) {
      const result = yield* expandNode(
        openEnd,
        gScoresEnd,
        closedEnd,
        parentEnd,
        closedStart,
        gScoresStart,
        end,
        start,
        context,
        heuristic,
        "backward"
      );

      if (result) {
        const pathLen = result.totalDistance;
        if (pathLen < bestPathLength) {
          bestPathLength = pathLen;
          meetingPoint = result.coord;
        }
      }
    }

    // Check termination again after backward expansion
    if (meetingPoint !== null) {
      const minFStart = openStart.size > 0 ? peekMinF(openStart) : Number.POSITIVE_INFINITY;
      const minFEnd = openEnd.size > 0 ? peekMinF(openEnd) : Number.POSITIVE_INFINITY;
      if (minFStart >= bestPathLength && minFEnd >= bestPathLength) {
        break;
      }
    }
  }

  // Reconstruct path if meeting point found
  if (meetingPoint !== null) {
    yield* reconstructBidirectionalPath(parentStart, parentEnd, start, end, meetingPoint);
    return;
  }

  // No path found
  yield { type: "no-path" };
}

/**
 * Peek at minimum f-score without removing the node.
 * Used for termination check.
 */
function peekMinF(heap: AStarHeap): number {
  // Pop and re-push to peek (heap doesn't expose internal array)
  const node = heap.pop();
  if (!node) return Number.POSITIVE_INFINITY;
  heap.push(node);
  return node.f;
}

/**
 * Expand one node from the given frontier.
 * Returns meeting info if this node intersects with the other frontier.
 */
function* expandNode(
  openSet: AStarHeap,
  gScores: Map<string, number>,
  closedSet: Set<string>,
  parent: Map<string, GridCoord>,
  otherClosedSet: Set<string>,
  otherGScores: Map<string, number>,
  origin: GridCoord,
  target: GridCoord,
  context: PathfindingContext,
  heuristic: HeuristicFunction,
  _direction: "forward" | "backward"
): Generator<PathfindingStep, { coord: GridCoord; totalDistance: number } | null, unknown> {
  const current = openSet.pop();
  if (!current) return null;

  const { coord, g: distance } = current;
  const key = toKey(coord);

  // Skip if already processed
  if (closedSet.has(key)) return null;
  closedSet.add(key);

  // Visualize current node (skip origin)
  if (!coordsEqual(coord, origin)) {
    yield { type: "current", coord, distance };
  }

  // Check for intersection with other frontier
  if (otherClosedSet.has(key)) {
    const otherG = otherGScores.get(key) ?? 0;
    return { coord, totalDistance: distance + otherG };
  }

  // Mark as visited
  if (!coordsEqual(coord, origin)) {
    yield { type: "visit", coord, distance };
  }

  // Explore neighbors
  const neighbors = getNeighbors(coord, context);
  for (const neighbor of neighbors) {
    const neighborKey = toKey(neighbor);

    if (closedSet.has(neighborKey)) continue;

    const tentativeG = distance + 1;
    const currentG = gScores.get(neighborKey) ?? Number.POSITIVE_INFINITY;

    if (tentativeG < currentG) {
      parent.set(neighborKey, coord);
      gScores.set(neighborKey, tentativeG);

      const h = heuristic(neighbor, target);
      const f = tentativeG + h;

      openSet.push({ coord: neighbor, g: tentativeG, f });
    }
  }

  return null;
}

/**
 * Reconstruct the path by stitching forward and backward paths at meeting point.
 * Forward path: start -> ... -> meetingPoint
 * Backward path: meetingPoint -> ... -> end (reversed from parentEnd)
 */
function* reconstructBidirectionalPath(
  parentStart: Map<string, GridCoord>,
  parentEnd: Map<string, GridCoord>,
  start: GridCoord,
  end: GridCoord,
  meetingPoint: GridCoord
): Generator<PathfindingStep, void, unknown> {
  // Build forward path: meetingPoint back to start, then reverse
  const forwardPath: GridCoord[] = [];
  let current: GridCoord | undefined = meetingPoint;

  while (current && !coordsEqual(current, start)) {
    forwardPath.push(current);
    current = parentStart.get(toKey(current));
  }

  // Build backward path: meetingPoint to end (follow parentEnd backward)
  const backwardPath: GridCoord[] = [];
  current = parentEnd.get(toKey(meetingPoint));

  while (current && !coordsEqual(current, end)) {
    backwardPath.push(current);
    current = parentEnd.get(toKey(current));
  }

  if (current && coordsEqual(current, end)) {
    backwardPath.push(end);
  }

  // Yield forward path from start to meeting point (reversed)
  for (let i = forwardPath.length - 1; i >= 0; i--) {
    const coord = forwardPath[i];
    if (coord) {
      yield { type: "path", coord };
    }
  }

  // Yield backward path from meeting point to end
  for (const coord of backwardPath) {
    yield { type: "path", coord };
  }
}
