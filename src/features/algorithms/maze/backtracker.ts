import type { GridCoord } from "@/lib/store";
import type { MazeContext, MazeStep } from "./types";
import { toKey } from "./types";

/**
 * Directions for carving passages (2 cells away to leave wall between).
 * Order: Up, Right, Down, Left
 */
const CARVE_DIRECTIONS: readonly GridCoord[] = [
  [-2, 0], // Up (2 cells)
  [0, 2], // Right (2 cells)
  [2, 0], // Down (2 cells)
  [0, -2], // Left (2 cells)
] as const;

/**
 * Shuffle an array in place using Fisher-Yates algorithm.
 */
function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j] as T;
    array[j] = temp as T;
  }
  return array;
}

/**
 * Check if a coordinate is within grid bounds.
 */
function isInBounds(coord: GridCoord, rows: number, cols: number): boolean {
  const [r, c] = coord;
  return r >= 0 && r < rows && c >= 0 && c < cols;
}

/**
 * Get the wall cell between two cells that are 2 apart.
 */
function getWallBetween(from: GridCoord, to: GridCoord): GridCoord {
  return [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2];
}

/**
 * Recursive Backtracker Maze Generator (The "Perfect" Maze)
 *
 * Uses DFS to carve passages through a grid initially filled with walls.
 * Creates "perfect" mazes with no loops - exactly one path between any two points.
 * Produces long, winding, snake-like corridors.
 *
 * IMPORTANT: This algorithm expects the grid to be PRE-FILLED with walls.
 * The useMazeGenerator hook handles this by filling all cells as walls
 * before running this generator.
 *
 * Algorithm:
 * 1. Start at a cell (aligned to odd coordinates for proper wall spacing)
 * 2. Mark current cell as carved (empty)
 * 3. Get unvisited neighbors 2 cells away (leaving room for walls)
 * 4. Pick random unvisited neighbor, carve wall between, recurse
 * 5. Backtrack when no unvisited neighbors remain
 *
 * @param context - Grid dimensions and start/end positions
 * @yields Empty steps to carve passages through the wall-filled grid
 */
export function* backtracker(context: MazeContext): Generator<MazeStep, void, unknown> {
  const { rows, cols, start, end } = context;
  const visited = new Set<string>();

  // Ensure start position is valid for carving
  // For proper maze structure, we carve from odd-aligned positions
  // But we also need to ensure start and end are accessible
  const startKey = toKey(start);
  const endKey = toKey(end);

  /**
   * Recursively carve passages using DFS.
   */
  function* carve(current: GridCoord): Generator<MazeStep, void, unknown> {
    const currentKey = toKey(current);

    // Skip if already visited
    if (visited.has(currentKey)) {
      return;
    }

    // Mark as visited and carve this cell
    visited.add(currentKey);
    yield { type: "empty", coord: current };

    // Get all possible neighbors (2 cells away in each direction)
    const neighbors: GridCoord[] = [];
    for (const [dr, dc] of CARVE_DIRECTIONS) {
      const neighbor: GridCoord = [current[0] + dr, current[1] + dc];
      if (isInBounds(neighbor, rows, cols) && !visited.has(toKey(neighbor))) {
        neighbors.push(neighbor);
      }
    }

    // Shuffle for random maze generation
    shuffle(neighbors);

    // Carve to each unvisited neighbor
    for (const neighbor of neighbors) {
      if (visited.has(toKey(neighbor))) {
        continue; // May have been visited by another branch
      }

      // Carve the wall between current and neighbor
      const wall = getWallBetween(current, neighbor);
      const wallKey = toKey(wall);

      // Don't re-carve if already visited (shouldn't happen, but safety check)
      if (!visited.has(wallKey)) {
        visited.add(wallKey);
        yield { type: "empty", coord: wall };
      }

      // Recurse to the neighbor
      yield* carve(neighbor);
    }
  }

  // Determine starting position for carving
  // Use an odd-aligned starting point near the actual start for proper grid structure
  // This ensures walls have proper spacing
  const carveStart: GridCoord = [
    start[0] % 2 === 0 ? Math.min(start[0] + 1, rows - 1) : start[0],
    start[1] % 2 === 0 ? Math.min(start[1] + 1, cols - 1) : start[1],
  ];

  // Start carving from the adjusted start position
  yield* carve(carveStart);

  // Ensure start and end positions are carved (accessible)
  if (!visited.has(startKey)) {
    yield { type: "empty", coord: start };
  }
  if (!visited.has(endKey)) {
    yield { type: "empty", coord: end };
  }

  // Carve path from start to the maze if needed
  // Connect start to the carved area
  if (start[0] !== carveStart[0] || start[1] !== carveStart[1]) {
    // Carve cells between start and carveStart
    const dr = carveStart[0] > start[0] ? 1 : carveStart[0] < start[0] ? -1 : 0;
    const dc = carveStart[1] > start[1] ? 1 : carveStart[1] < start[1] ? -1 : 0;

    let r = start[0];
    let c = start[1];
    while (r !== carveStart[0] || c !== carveStart[1]) {
      const key = toKey([r, c]);
      if (!visited.has(key)) {
        visited.add(key);
        yield { type: "empty", coord: [r, c] };
      }
      if (r !== carveStart[0]) r += dr;
      else if (c !== carveStart[1]) c += dc;
    }
  }

  yield { type: "complete" };
}
