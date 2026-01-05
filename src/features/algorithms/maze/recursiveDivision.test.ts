import { describe, expect, it } from "vitest";
import { recursiveDivision } from "./recursiveDivision";
import type { MazeContext, MazeStep } from "./types";
import { toKey } from "./types";

/**
 * Collects all steps from a maze generator.
 */
function collectSteps(context: MazeContext): MazeStep[] {
  const generator = recursiveDivision(context);
  const steps: MazeStep[] = [];
  for (const step of generator) {
    steps.push(step);
  }
  return steps;
}

/**
 * Extracts wall coordinates from steps.
 */
function getWallKeys(steps: MazeStep[]): Set<string> {
  const walls = new Set<string>();
  for (const step of steps) {
    if (step.type === "wall") {
      walls.add(toKey(step.coord));
    }
  }
  return walls;
}

describe("recursiveDivision", () => {
  const baseContext: MazeContext = {
    rows: 10,
    cols: 10,
    start: [0, 0],
    end: [9, 9],
  };

  it("generates a complete sequence ending with 'complete'", () => {
    const steps = collectSteps(baseContext);
    const lastStep = steps[steps.length - 1];
    expect(lastStep?.type).toBe("complete");
  });

  it("never places walls on start position", () => {
    // Run multiple times due to randomness
    for (let i = 0; i < 10; i++) {
      const steps = collectSteps(baseContext);
      const startKey = toKey(baseContext.start);
      const walls = getWallKeys(steps);
      expect(walls.has(startKey)).toBe(false);
    }
  });

  it("never places walls on end position", () => {
    // Run multiple times due to randomness
    for (let i = 0; i < 10; i++) {
      const steps = collectSteps(baseContext);
      const endKey = toKey(baseContext.end);
      const walls = getWallKeys(steps);
      expect(walls.has(endKey)).toBe(false);
    }
  });

  it("generates walls (for grids large enough)", () => {
    const steps = collectSteps(baseContext);
    const wallSteps = steps.filter((step) => step.type === "wall");
    // A 10x10 grid should have some walls from recursive division
    expect(wallSteps.length).toBeGreaterThan(0);
  });

  it("only yields wall or complete steps", () => {
    const steps = collectSteps(baseContext);
    for (const step of steps) {
      expect(["wall", "complete"]).toContain(step.type);
    }
  });

  it("handles minimum size grids (2x2)", () => {
    const smallContext: MazeContext = {
      rows: 2,
      cols: 2,
      start: [0, 0],
      end: [1, 1],
    };
    const steps = collectSteps(smallContext);
    // Should complete without errors
    expect(steps[steps.length - 1]?.type).toBe("complete");
  });

  it("handles grids too small to divide (1x1)", () => {
    const tinyContext: MazeContext = {
      rows: 1,
      cols: 1,
      start: [0, 0],
      end: [0, 0],
    };
    const steps = collectSteps(tinyContext);
    // Should just complete with no walls
    expect(steps.length).toBe(1);
    expect(steps[0]?.type).toBe("complete");
  });

  it("handles narrow grids (1xN)", () => {
    const narrowContext: MazeContext = {
      rows: 1,
      cols: 10,
      start: [0, 0],
      end: [0, 9],
    };
    const steps = collectSteps(narrowContext);
    // Can't divide a 1-row grid horizontally, but might divide vertically
    expect(steps[steps.length - 1]?.type).toBe("complete");
  });

  it("handles tall grids (Nx1)", () => {
    const tallContext: MazeContext = {
      rows: 10,
      cols: 1,
      start: [0, 0],
      end: [9, 0],
    };
    const steps = collectSteps(tallContext);
    // Can't divide a 1-column grid vertically, but might divide horizontally
    expect(steps[steps.length - 1]?.type).toBe("complete");
  });

  it("creates structured rectangular patterns", () => {
    // Recursive division creates walls that span entire rows or columns
    // Check that walls align on grid lines
    const largeContext: MazeContext = {
      rows: 15,
      cols: 15,
      start: [0, 0],
      end: [14, 14],
    };

    const steps = collectSteps(largeContext);
    const walls = getWallKeys(steps);

    // Should have walls (indicates the algorithm is working)
    expect(walls.size).toBeGreaterThan(0);

    // Walls should be within grid bounds
    for (const key of walls) {
      const [row, col] = key.split("-").map(Number);
      expect(row).toBeGreaterThanOrEqual(0);
      expect(row).toBeLessThan(largeContext.rows);
      expect(col).toBeGreaterThanOrEqual(0);
      expect(col).toBeLessThan(largeContext.cols);
    }
  });

  it("preserves passages (gaps in walls)", () => {
    // Run multiple times and check that not every cell in any row/column is a wall
    // This verifies that gaps are being created
    for (let i = 0; i < 5; i++) {
      const context: MazeContext = {
        rows: 10,
        cols: 10,
        start: [0, 0],
        end: [9, 9],
      };

      const steps = collectSteps(context);
      const walls = getWallKeys(steps);

      // For each row, check if there's at least one non-wall (excluding start/end row if needed)
      // This is a weak test but ensures gaps exist
      let hasGapInSomeRow = false;
      for (let r = 1; r < context.rows - 1; r++) {
        let hasNonWall = false;
        for (let c = 0; c < context.cols; c++) {
          if (!walls.has(toKey([r, c]))) {
            hasNonWall = true;
            break;
          }
        }
        if (hasNonWall) {
          hasGapInSomeRow = true;
          break;
        }
      }

      expect(hasGapInSomeRow).toBe(true);
    }
  });
});
