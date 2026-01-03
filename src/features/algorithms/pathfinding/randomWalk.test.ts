import { describe, expect, it } from "vitest";
import { randomWalk } from "./randomWalk";
import type { PathfindingContext, PathfindingStep } from "./types";

/**
 * Helper to collect all steps from a generator.
 */
function collectSteps(context: PathfindingContext): PathfindingStep[] {
  const steps: PathfindingStep[] = [];
  for (const step of randomWalk(context)) {
    steps.push(step);
  }
  return steps;
}

/**
 * Run the algorithm multiple times and check if any run finds a path.
 * Used to handle the non-deterministic nature of random walk.
 */
function runMultipleTimes(
  context: PathfindingContext,
  runs: number
): { foundPath: boolean; noPath: boolean; avgSteps: number } {
  let foundPath = false;
  let noPath = false;
  let totalVisits = 0;
  let successfulRuns = 0;

  for (let i = 0; i < runs; i++) {
    const steps = collectSteps(context);
    const pathSteps = steps.filter((s) => s.type === "path");
    const hasNoPath = steps.some((s) => s.type === "no-path");
    const visitSteps = steps.filter((s) => s.type === "visit");

    if (pathSteps.length > 0) {
      foundPath = true;
      successfulRuns++;
      totalVisits += visitSteps.length;
    }
    if (hasNoPath) {
      noPath = true;
    }
  }

  return {
    foundPath,
    noPath,
    avgSteps: successfulRuns > 0 ? totalVisits / successfulRuns : 0,
  };
}

describe("randomWalk", () => {
  it("finds a path in a small empty grid (high probability)", () => {
    const context: PathfindingContext = {
      rows: 3,
      cols: 3,
      start: [0, 0],
      end: [2, 2],
      walls: new Set(),
    };

    // Run multiple times to account for randomness
    const result = runMultipleTimes(context, 10);

    // Should find a path in at least one run
    expect(result.foundPath).toBe(true);
  });

  it("handles start equals end (immediate success)", () => {
    const context: PathfindingContext = {
      rows: 3,
      cols: 3,
      start: [1, 1],
      end: [1, 1],
      walls: new Set(),
    };

    const steps = collectSteps(context);

    // Should find "path" immediately or have no path steps (start = end)
    expect(steps.filter((s) => s.type === "path").length).toBe(0);
    expect(steps.some((s) => s.type === "no-path")).toBe(false);
  });

  it("handles adjacent start and end (high probability of success)", () => {
    const context: PathfindingContext = {
      rows: 3,
      cols: 3,
      start: [1, 1],
      end: [1, 2],
      walls: new Set(),
    };

    const result = runMultipleTimes(context, 10);
    expect(result.foundPath).toBe(true);
  });

  it("returns no-path when completely blocked", () => {
    const context: PathfindingContext = {
      rows: 3,
      cols: 3,
      start: [1, 1],
      end: [2, 2],
      walls: new Set(["0-1", "1-0", "1-2", "2-1"]),
    };

    const steps = collectSteps(context);
    expect(steps.some((s) => s.type === "no-path")).toBe(true);
  });

  it("includes distance (step count) in visit steps", () => {
    const context: PathfindingContext = {
      rows: 3,
      cols: 3,
      start: [0, 0],
      end: [2, 2],
      walls: new Set(),
    };

    const steps = collectSteps(context);
    const visitSteps = steps.filter((s) => s.type === "visit");

    for (const step of visitSteps) {
      if (step.type === "visit") {
        expect(typeof step.distance).toBe("number");
        expect(step.distance).toBeGreaterThan(0);
      }
    }
  });

  it("yields current step before visit step", () => {
    const context: PathfindingContext = {
      rows: 3,
      cols: 3,
      start: [0, 0],
      end: [2, 2],
      walls: new Set(),
    };

    const steps = collectSteps(context);

    // Check that current steps come before corresponding visit steps
    let lastCurrentCoord: [number, number] | null = null;

    for (const step of steps) {
      if (step.type === "current") {
        lastCurrentCoord = step.coord;
      } else if (step.type === "visit" && lastCurrentCoord) {
        // Visit should match the last current
        expect(step.coord).toEqual(lastCurrentCoord);
      }
    }
  });

  it("can fail to find path within max steps in difficult scenarios", () => {
    // Create a scenario where finding the path is unlikely
    // Large grid with start and end far apart
    const context: PathfindingContext = {
      rows: 20,
      cols: 20,
      start: [0, 0],
      end: [19, 19],
      walls: new Set(),
    };

    // Run once - might fail, might succeed
    const steps = collectSteps(context);

    // Should either find a path or report no-path (hit max steps)
    const foundPath = steps.some((s) => s.type === "path");
    const noPath = steps.some((s) => s.type === "no-path");

    expect(foundPath || noPath).toBe(true);
  });

  it("visits nodes multiple times (characteristic of random walk)", () => {
    const context: PathfindingContext = {
      rows: 5,
      cols: 5,
      start: [0, 0],
      end: [4, 4],
      walls: new Set(),
    };

    // Collect steps from multiple runs
    let totalVisits = 0;
    let totalUniqueNodes = 0;

    for (let i = 0; i < 5; i++) {
      const steps = collectSteps(context);
      const visitSteps = steps.filter((s) => s.type === "visit" || s.type === "current");
      const uniqueCoords = new Set(
        visitSteps.map((s) => {
          if (s.type === "visit" || s.type === "current") {
            return `${s.coord[0]}-${s.coord[1]}`;
          }
          return "";
        })
      );

      totalVisits += visitSteps.length;
      totalUniqueNodes += uniqueCoords.size;
    }

    // Random walk typically visits more total nodes than unique nodes
    // (revisits same nodes multiple times)
    expect(totalVisits).toBeGreaterThan(totalUniqueNodes);
  });

  it("reconstructs a valid path when goal is found", () => {
    const context: PathfindingContext = {
      rows: 3,
      cols: 3,
      start: [0, 0],
      end: [2, 2],
      walls: new Set(),
    };

    // Run multiple times until we find a successful run
    for (let i = 0; i < 20; i++) {
      const steps = collectSteps(context);
      const pathSteps = steps.filter((s) => s.type === "path");

      if (pathSteps.length > 0) {
        // Path should end at the goal
        const lastPath = pathSteps[pathSteps.length - 1];
        if (lastPath && lastPath.type === "path") {
          expect(lastPath.coord).toEqual([2, 2]);
        }
        return;
      }
    }

    // If we never found a path in 20 runs, that's unexpected for a 3x3 grid
    expect.fail("Expected to find a path in at least one of 20 runs");
  });

  it("handles single-cell grid", () => {
    const context: PathfindingContext = {
      rows: 1,
      cols: 1,
      start: [0, 0],
      end: [0, 0],
      walls: new Set(),
    };

    const steps = collectSteps(context);

    // Start equals end, should complete immediately
    expect(steps.some((s) => s.type === "no-path")).toBe(false);
  });
});
