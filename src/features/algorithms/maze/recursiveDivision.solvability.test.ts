import { describe, expect, it } from "vitest";
import { recursiveDivision } from "./recursiveDivision";
import type { GridCoord, MazeContext } from "./types";
import { toKey } from "./types";

/**
 * Test that recursive division creates solvable mazes.
 * Uses BFS to verify a path exists from start to end.
 */
function isSolvable(context: MazeContext): boolean {
  const { rows, cols, start, end } = context;
  const walls = new Set<string>();

  // Run the generator and collect walls
  const gen = recursiveDivision(context);
  for (const step of gen) {
    if (step.type === "wall") walls.add(toKey(step.coord));
    if (step.type === "empty") walls.delete(toKey(step.coord));
  }

  // BFS to check connectivity
  const visited = new Set<string>();
  const queue: GridCoord[] = [start];
  visited.add(toKey(start));

  while (queue.length > 0) {
    const [r, c] = queue.shift() as GridCoord;
    if (r === end[0] && c === end[1]) return true;

    const neighbors: GridCoord[] = [
      [r - 1, c],
      [r + 1, c],
      [r, c - 1],
      [r, c + 1],
    ];

    for (const [nr, nc] of neighbors) {
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        const key = toKey([nr, nc]);
        if (!visited.has(key) && !walls.has(key)) {
          visited.add(key);
          queue.push([nr, nc]);
        }
      }
    }
  }

  return false;
}

describe("recursiveDivision solvability", () => {
  const runSolvabilityTest = (name: string, context: MazeContext, iterations: number = 20) => {
    it(`always creates solvable mazes for ${name}`, () => {
      let solvable = 0;
      for (let i = 0; i < iterations; i++) {
        if (isSolvable(context)) solvable++;
      }
      // With connectivity verification, should be 100%
      expect(solvable).toBe(iterations);
    });
  };

  runSolvabilityTest("middle positions (15x30)", {
    rows: 15,
    cols: 30,
    start: [7, 7],
    end: [7, 22],
  });

  runSolvabilityTest("corner positions (15x30)", {
    rows: 15,
    cols: 30,
    start: [0, 0],
    end: [14, 29],
  });

  runSolvabilityTest("small grid (10x10)", {
    rows: 10,
    cols: 10,
    start: [0, 0],
    end: [9, 9],
  });

  runSolvabilityTest("larger grid middle (21x41)", {
    rows: 21,
    cols: 41,
    start: [10, 10],
    end: [10, 30],
  });

  runSolvabilityTest("edge start to corner end (15x30)", {
    rows: 15,
    cols: 30,
    start: [0, 15],
    end: [14, 29],
  });
});
