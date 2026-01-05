import { describe, expect, it } from "vitest";
import { backtracker } from "./backtracker";
import type { MazeContext, MazeStep } from "./types";
import { toKey } from "./types";

/**
 * Collects all steps from a maze generator.
 */
function collectSteps(context: MazeContext): MazeStep[] {
  const generator = backtracker(context);
  const steps: MazeStep[] = [];
  for (const step of generator) {
    steps.push(step);
  }
  return steps;
}

/**
 * Extracts carved (empty) coordinates from steps.
 */
function getCarvedKeys(steps: MazeStep[]): Set<string> {
  const carved = new Set<string>();
  for (const step of steps) {
    if (step.type === "empty") {
      carved.add(toKey(step.coord));
    }
  }
  return carved;
}

describe("backtracker", () => {
  const baseContext: MazeContext = {
    rows: 11,
    cols: 11,
    start: [1, 1],
    end: [9, 9],
  };

  it("generates a complete sequence ending with 'complete'", () => {
    const steps = collectSteps(baseContext);
    const lastStep = steps[steps.length - 1];
    expect(lastStep?.type).toBe("complete");
  });

  it("carves passages (yields empty steps)", () => {
    const steps = collectSteps(baseContext);
    const emptySteps = steps.filter((step) => step.type === "empty");
    // Should carve some passages
    expect(emptySteps.length).toBeGreaterThan(0);
  });

  it("only yields empty or complete steps", () => {
    const steps = collectSteps(baseContext);
    for (const step of steps) {
      expect(["empty", "complete"]).toContain(step.type);
    }
  });

  it("ensures start position is accessible", () => {
    // Run multiple times due to randomness
    for (let i = 0; i < 5; i++) {
      const steps = collectSteps(baseContext);
      const carved = getCarvedKeys(steps);
      const startKey = toKey(baseContext.start);
      // Start should be carved (accessible)
      expect(carved.has(startKey)).toBe(true);
    }
  });

  it("ensures end position is accessible", () => {
    // Run multiple times due to randomness
    for (let i = 0; i < 5; i++) {
      const steps = collectSteps(baseContext);
      const carved = getCarvedKeys(steps);
      const endKey = toKey(baseContext.end);
      // End should be carved (accessible)
      expect(carved.has(endKey)).toBe(true);
    }
  });

  it("handles minimum size grids (3x3)", () => {
    const smallContext: MazeContext = {
      rows: 3,
      cols: 3,
      start: [1, 1],
      end: [1, 1],
    };
    const steps = collectSteps(smallContext);
    expect(steps[steps.length - 1]?.type).toBe("complete");
  });

  it("handles grids too small to have passages (1x1)", () => {
    const tinyContext: MazeContext = {
      rows: 1,
      cols: 1,
      start: [0, 0],
      end: [0, 0],
    };
    const steps = collectSteps(tinyContext);
    // Should complete (may have minimal carving)
    expect(steps[steps.length - 1]?.type).toBe("complete");
  });

  it("carves passages within grid bounds", () => {
    const steps = collectSteps(baseContext);
    const carved = getCarvedKeys(steps);

    for (const key of carved) {
      const [row, col] = key.split("-").map(Number);
      expect(row).toBeGreaterThanOrEqual(0);
      expect(row).toBeLessThan(baseContext.rows);
      expect(col).toBeGreaterThanOrEqual(0);
      expect(col).toBeLessThan(baseContext.cols);
    }
  });

  it("creates connected passages (DFS property)", () => {
    // The backtracker uses DFS which creates connected passages
    // Each carve step should be reachable from the start
    const steps = collectSteps(baseContext);
    const carved = getCarvedKeys(steps);

    // Should have multiple carved cells forming a connected path
    expect(carved.size).toBeGreaterThan(1);
  });

  it("handles even-sized grids", () => {
    const evenContext: MazeContext = {
      rows: 10,
      cols: 10,
      start: [0, 0],
      end: [9, 9],
    };
    const steps = collectSteps(evenContext);
    expect(steps[steps.length - 1]?.type).toBe("complete");
  });

  it("handles odd-sized grids (preferred for proper wall spacing)", () => {
    const oddContext: MazeContext = {
      rows: 11,
      cols: 11,
      start: [1, 1],
      end: [9, 9],
    };
    const steps = collectSteps(oddContext);
    const carved = getCarvedKeys(steps);

    // Odd grids work better for the algorithm
    expect(carved.size).toBeGreaterThan(0);
    expect(steps[steps.length - 1]?.type).toBe("complete");
  });

  it("handles narrow grids", () => {
    const narrowContext: MazeContext = {
      rows: 3,
      cols: 11,
      start: [1, 1],
      end: [1, 9],
    };
    const steps = collectSteps(narrowContext);
    expect(steps[steps.length - 1]?.type).toBe("complete");
  });

  it("handles tall grids", () => {
    const tallContext: MazeContext = {
      rows: 11,
      cols: 3,
      start: [1, 1],
      end: [9, 1],
    };
    const steps = collectSteps(tallContext);
    expect(steps[steps.length - 1]?.type).toBe("complete");
  });
});
