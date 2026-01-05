import type { GridCoord, MazeContext, MazeStep } from "./types";
import { toKey } from "./types";

/**
 * Get a random integer between min (inclusive) and max (exclusive).
 */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Choose a random element from an array.
 */
function randomChoice<T>(arr: T[]): T {
  return arr[randomInt(0, arr.length)] as T;
}

/**
 * Recursive Division Maze Generator (The "Chamber" Algorithm)
 *
 * A "Divide and Conquer" approach that splits the grid into chambers
 * with single gaps, creating structured, rectangular mazes.
 *
 * The key insight for maintaining connectivity:
 * - When a parent wall has a gap at position P, child walls in sub-chambers
 *   must have gaps that connect to P
 * - We track "entry points" (rows/cols that must remain accessible) from parent gaps
 * - New walls place their gaps at entry point positions to maintain connectivity
 *
 * @param context - Grid dimensions and start/end positions
 * @yields Wall placement steps for visualization
 */
export function* recursiveDivision(context: MazeContext): Generator<MazeStep, void, unknown> {
  const { rows, cols, start, end } = context;

  const protected_cells = new Set<string>();
  protected_cells.add(toKey(start));
  protected_cells.add(toKey(end));

  function isProtected(row: number, col: number): boolean {
    return protected_cells.has(toKey([row, col]));
  }

  /**
   * Recursively divide a rectangular region.
   *
   * @param rowStart - Top row (inclusive)
   * @param rowEnd - Bottom row (exclusive)
   * @param colStart - Left column (inclusive)
   * @param colEnd - Right column (exclusive)
   * @param entryRows - Rows where we must be able to enter/exit (from parent horizontal walls)
   * @param entryCols - Columns where we must be able to enter/exit (from parent vertical walls)
   */
  function* divide(
    rowStart: number,
    rowEnd: number,
    colStart: number,
    colEnd: number,
    entryRows: number[],
    entryCols: number[]
  ): Generator<MazeStep, void, unknown> {
    const height = rowEnd - rowStart;
    const width = colEnd - colStart;

    // Need at least 3 cells in each dimension to place a wall with passages on both sides
    if (height < 3 || width < 3) {
      return;
    }

    // Choose orientation: divide perpendicular to the longer axis
    const horizontal = height > width || (height === width && Math.random() < 0.5);

    if (horizontal) {
      // Place a horizontal wall
      const wallRow = randomInt(rowStart + 1, rowEnd - 1);

      // Gap must be at an entry column if any exist in range, otherwise random
      const validEntryCols = entryCols.filter((c) => c >= colStart && c < colEnd);
      const gapCol =
        validEntryCols.length > 0 ? randomChoice(validEntryCols) : randomInt(colStart, colEnd);

      // Build the wall
      for (let c = colStart; c < colEnd; c++) {
        if (c === gapCol) continue;
        if (isProtected(wallRow, c)) continue;
        yield { type: "wall", coord: [wallRow, c] as GridCoord };
      }

      // The gap connects cells at (wallRow-1, gapCol) and (wallRow+1, gapCol)
      // Top chamber's entry row is wallRow-1 (where it connects to the gap)
      // Bottom chamber's entry row is wallRow+1 (where it connects to the gap)
      const topEntryRows = entryRows.includes(wallRow - 1)
        ? entryRows
        : [...entryRows, wallRow - 1];
      const bottomEntryRows = entryRows.includes(wallRow + 1)
        ? entryRows
        : [...entryRows, wallRow + 1];

      // The gap column becomes an entry point for vertical walls in sub-chambers
      const newEntryCols = entryCols.includes(gapCol) ? entryCols : [...entryCols, gapCol];

      yield* divide(rowStart, wallRow, colStart, colEnd, topEntryRows, newEntryCols);
      yield* divide(wallRow + 1, rowEnd, colStart, colEnd, bottomEntryRows, newEntryCols);
    } else {
      // Place a vertical wall
      const wallCol = randomInt(colStart + 1, colEnd - 1);

      // Gap must be at an entry row if any exist in range, otherwise random
      const validEntryRows = entryRows.filter((r) => r >= rowStart && r < rowEnd);
      const gapRow =
        validEntryRows.length > 0 ? randomChoice(validEntryRows) : randomInt(rowStart, rowEnd);

      // Build the wall
      for (let r = rowStart; r < rowEnd; r++) {
        if (r === gapRow) continue;
        if (isProtected(r, wallCol)) continue;
        yield { type: "wall", coord: [r, wallCol] as GridCoord };
      }

      // The gap connects cells at (gapRow, wallCol-1) and (gapRow, wallCol+1)
      // Left chamber's entry col is wallCol-1 (where it connects to the gap)
      // Right chamber's entry col is wallCol+1 (where it connects to the gap)
      const leftEntryCols = entryCols.includes(wallCol - 1)
        ? entryCols
        : [...entryCols, wallCol - 1];
      const rightEntryCols = entryCols.includes(wallCol + 1)
        ? entryCols
        : [...entryCols, wallCol + 1];

      // The gap row becomes an entry point for horizontal walls in sub-chambers
      const newEntryRows = entryRows.includes(gapRow) ? entryRows : [...entryRows, gapRow];

      yield* divide(rowStart, rowEnd, colStart, wallCol, newEntryRows, leftEntryCols);
      yield* divide(rowStart, rowEnd, wallCol + 1, colEnd, newEntryRows, rightEntryCols);
    }
  }

  // Track all placed walls for connectivity verification
  const placedWalls = new Set<string>();

  // Wrapper to track walls
  function* divideAndTrack(
    rowStart: number,
    rowEnd: number,
    colStart: number,
    colEnd: number,
    entryRows: number[],
    entryCols: number[]
  ): Generator<MazeStep, void, unknown> {
    for (const step of divide(rowStart, rowEnd, colStart, colEnd, entryRows, entryCols)) {
      if (step.type === "wall") {
        placedWalls.add(toKey(step.coord));
      }
      yield step;
    }
  }

  // Start with entry points at start and end positions
  // This ensures the first walls have gaps that connect to start/end
  yield* divideAndTrack(0, rows, 0, cols, [start[0], end[0]], [start[1], end[1]]);

  // Verify connectivity and carve a path if needed
  // Use BFS to find cells reachable from start
  const reachableFromStart = new Set<string>();
  const queue: GridCoord[] = [start];
  reachableFromStart.add(toKey(start));

  while (queue.length > 0) {
    const [r, c] = queue.shift() as GridCoord;
    const neighbors: GridCoord[] = [
      [r - 1, c],
      [r + 1, c],
      [r, c - 1],
      [r, c + 1],
    ];

    for (const [nr, nc] of neighbors) {
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        const key = toKey([nr, nc]);
        if (!reachableFromStart.has(key) && !placedWalls.has(key)) {
          reachableFromStart.add(key);
          queue.push([nr, nc]);
        }
      }
    }
  }

  // If end is not reachable, carve a path
  if (!reachableFromStart.has(toKey(end))) {
    // BFS from end to find a path to the reachable set
    const parent = new Map<string, GridCoord>();
    const endQueue: GridCoord[] = [end];
    const visitedFromEnd = new Set<string>();
    visitedFromEnd.add(toKey(end));
    let meetingPoint: GridCoord | null = null;

    outer: while (endQueue.length > 0) {
      const [r, c] = endQueue.shift() as GridCoord;
      const neighbors: GridCoord[] = [
        [r - 1, c],
        [r + 1, c],
        [r, c - 1],
        [r, c + 1],
      ];

      for (const [nr, nc] of neighbors) {
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          const key = toKey([nr, nc]);

          // Check if we've reached the start-reachable region
          if (reachableFromStart.has(key)) {
            parent.set(key, [r, c]);
            meetingPoint = [nr, nc];
            break outer;
          }

          if (!visitedFromEnd.has(key)) {
            visitedFromEnd.add(key);
            parent.set(key, [r, c]);
            endQueue.push([nr, nc]);
          }
        }
      }
    }

    // Carve the path by removing walls
    if (meetingPoint) {
      let current: GridCoord | undefined = meetingPoint;
      while (current) {
        const key = toKey(current);
        if (placedWalls.has(key)) {
          placedWalls.delete(key);
          yield { type: "empty", coord: current };
        }
        current = parent.get(key);
      }
    }
  }

  yield { type: "complete" };
}
