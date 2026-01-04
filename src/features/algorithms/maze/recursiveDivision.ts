import type { MazeContext, MazeStep } from "./types";
import { toKey } from "./types";

/**
 * Minimum dimension for a chamber to be divided further.
 * A chamber must be at least this wide/tall to be split.
 */
const MIN_CHAMBER_SIZE = 2;

/**
 * Represents a rectangular chamber within the grid.
 */
interface Chamber {
  /** Top-left row (inclusive) */
  rowStart: number;
  /** Bottom row (exclusive) */
  rowEnd: number;
  /** Left column (inclusive) */
  colStart: number;
  /** Right column (exclusive) */
  colEnd: number;
}

/**
 * Get a random integer between min (inclusive) and max (exclusive).
 */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Recursive Division Maze Generator (The "Chamber" Algorithm)
 *
 * A "Divide and Conquer" approach that splits the grid into chambers
 * with single gaps, creating structured, rectangular mazes.
 *
 * Algorithm:
 * 1. Choose randomly to split horizontally or vertically
 * 2. Draw a wall along that line
 * 3. Punch one random hole in the wall
 * 4. Recurse on the two new sub-chambers
 *
 * @param context - Grid dimensions and start/end positions
 * @yields Wall placement steps for visualization
 */
export function* recursiveDivision(context: MazeContext): Generator<MazeStep, void, unknown> {
  const { rows, cols, start, end } = context;
  const startKey = toKey(start);
  const endKey = toKey(end);

  /**
   * Recursively divide a chamber into sub-chambers.
   */
  function* divide(chamber: Chamber): Generator<MazeStep, void, unknown> {
    const width = chamber.colEnd - chamber.colStart;
    const height = chamber.rowEnd - chamber.rowStart;

    // Base case: chamber too small to divide
    if (width < MIN_CHAMBER_SIZE || height < MIN_CHAMBER_SIZE) {
      return;
    }

    // Choose orientation: prefer to divide the longer dimension
    // This creates more balanced, natural-looking mazes
    const divideHorizontally = height > width ? true : width > height ? false : Math.random() < 0.5;

    if (divideHorizontally) {
      // Horizontal division: draw a horizontal wall
      // Wall row must leave at least 1 row on each side
      if (height < 2) return;

      const wallRow = randomInt(chamber.rowStart + 1, chamber.rowEnd);
      const gapCol = randomInt(chamber.colStart, chamber.colEnd);

      // Draw horizontal wall with one gap
      for (let c = chamber.colStart; c < chamber.colEnd; c++) {
        const key = toKey([wallRow, c]);

        // Skip the gap, start, and end positions
        if (c === gapCol || key === startKey || key === endKey) {
          continue;
        }

        yield { type: "wall", coord: [wallRow, c] };
      }

      // Recurse on top and bottom chambers
      yield* divide({
        rowStart: chamber.rowStart,
        rowEnd: wallRow,
        colStart: chamber.colStart,
        colEnd: chamber.colEnd,
      });

      yield* divide({
        rowStart: wallRow + 1,
        rowEnd: chamber.rowEnd,
        colStart: chamber.colStart,
        colEnd: chamber.colEnd,
      });
    } else {
      // Vertical division: draw a vertical wall
      // Wall column must leave at least 1 column on each side
      if (width < 2) return;

      const wallCol = randomInt(chamber.colStart + 1, chamber.colEnd);
      const gapRow = randomInt(chamber.rowStart, chamber.rowEnd);

      // Draw vertical wall with one gap
      for (let r = chamber.rowStart; r < chamber.rowEnd; r++) {
        const key = toKey([r, wallCol]);

        // Skip the gap, start, and end positions
        if (r === gapRow || key === startKey || key === endKey) {
          continue;
        }

        yield { type: "wall", coord: [r, wallCol] };
      }

      // Recurse on left and right chambers
      yield* divide({
        rowStart: chamber.rowStart,
        rowEnd: chamber.rowEnd,
        colStart: chamber.colStart,
        colEnd: wallCol,
      });

      yield* divide({
        rowStart: chamber.rowStart,
        rowEnd: chamber.rowEnd,
        colStart: wallCol + 1,
        colEnd: chamber.colEnd,
      });
    }
  }

  // Start with the entire grid as the initial chamber
  yield* divide({
    rowStart: 0,
    rowEnd: rows,
    colStart: 0,
    colEnd: cols,
  });

  yield { type: "complete" };
}
