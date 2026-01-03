import { describe, expect, it } from "vitest";
import { aStar } from "./astar";
import { bfs } from "./bfs";
import { greedyBestFirst } from "./greedyBestFirst";
import type { PathfindingContext, PathfindingStep } from "./types";

/**
 * Helper to collect all steps from a generator.
 */
function collectSteps(
  context: PathfindingContext,
  algorithm: (ctx: PathfindingContext) => Generator<PathfindingStep, void, unknown>
): PathfindingStep[] {
  const steps: PathfindingStep[] = [];
  for (const step of algorithm(context)) {
    steps.push(step);
  }
  return steps;
}

/**
 * Helper to get path length.
 */
function getPathLength(
  context: PathfindingContext,
  algorithm: (ctx: PathfindingContext) => Generator<PathfindingStep, void, unknown>
): number | null {
  const steps = collectSteps(context, algorithm);
  const pathSteps = steps.filter((s) => s.type === "path");
  if (pathSteps.length === 0 && steps.some((s) => s.type === "no-path")) {
    return null;
  }
  return pathSteps.length;
}

describe("greedyBestFirst", () => {
  it("finds a path in an empty grid", () => {
    const context: PathfindingContext = {
      rows: 5,
      cols: 5,
      start: [0, 0],
      end: [4, 4],
      walls: new Set(),
    };

    const steps = collectSteps(context, greedyBestFirst);
    const pathSteps = steps.filter((s) => s.type === "path");

    expect(pathSteps.length).toBeGreaterThan(0);
    expect(steps.some((s) => s.type === "no-path")).toBe(false);
  });

  it("finds optimal path in open grid (no obstacles)", () => {
    const context: PathfindingContext = {
      rows: 5,
      cols: 5,
      start: [0, 0],
      end: [4, 4],
      walls: new Set(),
    };

    // In an open grid, greedy finds the optimal path
    const pathLength = getPathLength(context, greedyBestFirst);
    expect(pathLength).toBe(8); // Manhattan distance: 4 down + 4 right
  });

  it("visits fewer nodes than BFS in open grid (laser beam effect)", () => {
    const context: PathfindingContext = {
      rows: 10,
      cols: 10,
      start: [0, 0],
      end: [9, 9],
      walls: new Set(),
    };

    const greedySteps = collectSteps(context, greedyBestFirst);
    const bfsSteps = collectSteps(context, bfs);

    const greedyVisits = greedySteps.filter((s) => s.type === "visit").length;
    const bfsVisits = bfsSteps.filter((s) => s.type === "visit").length;

    // Greedy should visit significantly fewer nodes in open grid
    expect(greedyVisits).toBeLessThan(bfsVisits);
  });

  it("visits fewer or equal nodes than A* in open grid", () => {
    const context: PathfindingContext = {
      rows: 10,
      cols: 10,
      start: [0, 0],
      end: [9, 9],
      walls: new Set(),
    };

    const greedySteps = collectSteps(context, greedyBestFirst);
    const astarSteps = collectSteps(context, aStar);

    const greedyVisits = greedySteps.filter((s) => s.type === "visit").length;
    const astarVisits = astarSteps.filter((s) => s.type === "visit").length;

    // Greedy is more aggressive toward goal
    expect(greedyVisits).toBeLessThanOrEqual(astarVisits);
  });

  it("returns no-path when blocked", () => {
    const context: PathfindingContext = {
      rows: 3,
      cols: 3,
      start: [1, 1],
      end: [2, 2],
      walls: new Set(["0-1", "1-0", "1-2", "2-1"]),
    };

    const steps = collectSteps(context, greedyBestFirst);
    expect(steps.some((s) => s.type === "no-path")).toBe(true);
  });

  it("handles start equals end", () => {
    const context: PathfindingContext = {
      rows: 3,
      cols: 3,
      start: [1, 1],
      end: [1, 1],
      walls: new Set(),
    };

    const steps = collectSteps(context, greedyBestFirst);
    expect(steps.filter((s) => s.type === "path").length).toBe(0);
    expect(steps.some((s) => s.type === "no-path")).toBe(false);
  });

  it("may find suboptimal path when obstacles exist", () => {
    // U-shaped obstacle that tricks greedy
    const context: PathfindingContext = {
      rows: 7,
      cols: 7,
      start: [3, 0],
      end: [3, 6],
      // Create a U-shaped wall that greedy may navigate poorly
      walls: new Set(["2-2", "2-3", "2-4", "3-2", "4-2", "4-3", "4-4"]),
    };

    const greedyPath = getPathLength(context, greedyBestFirst);
    const optimalPath = getPathLength(context, aStar);

    // Greedy should still find A path, even if not optimal
    expect(greedyPath).not.toBeNull();
    expect(optimalPath).not.toBeNull();

    // Greedy may find longer path (or same if lucky)
    if (greedyPath !== null && optimalPath !== null) {
      expect(greedyPath).toBeGreaterThanOrEqual(optimalPath);
    }
  });

  it("includes distance in visit steps for heat map", () => {
    const context: PathfindingContext = {
      rows: 3,
      cols: 3,
      start: [0, 0],
      end: [2, 2],
      walls: new Set(),
    };

    const steps = collectSteps(context, greedyBestFirst);
    const visitSteps = steps.filter((s) => s.type === "visit");

    for (const step of visitSteps) {
      if (step.type === "visit") {
        expect(typeof step.distance).toBe("number");
        expect(step.distance).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it("handles adjacent start and end", () => {
    const context: PathfindingContext = {
      rows: 3,
      cols: 3,
      start: [1, 1],
      end: [1, 2],
      walls: new Set(),
    };

    const steps = collectSteps(context, greedyBestFirst);
    const pathSteps = steps.filter((s) => s.type === "path");

    expect(pathSteps.length).toBe(1);
  });

  it("handles large grid efficiently", () => {
    const context: PathfindingContext = {
      rows: 20,
      cols: 20,
      start: [0, 0],
      end: [19, 19],
      walls: new Set(),
    };

    const startTime = Date.now();
    const steps = collectSteps(context, greedyBestFirst);
    const duration = Date.now() - startTime;

    // Should complete quickly (under 100ms)
    expect(duration).toBeLessThan(100);
    // Path exists
    expect(steps.filter((s) => s.type === "path").length).toBeGreaterThan(0);
  });

  it("prioritizes nodes closer to goal (h-score only)", () => {
    const context: PathfindingContext = {
      rows: 5,
      cols: 5,
      start: [0, 0],
      end: [4, 4],
      walls: new Set(),
    };

    const steps = collectSteps(context, greedyBestFirst);
    const visitSteps = steps.filter((s) => s.type === "visit");

    // Greedy should make steady progress toward goal
    // Early visits should have increasing distance from start
    if (visitSteps.length > 2) {
      const firstVisit = visitSteps[0];
      const lastVisit = visitSteps[visitSteps.length - 1];

      if (firstVisit && lastVisit) {
        expect(lastVisit.distance).toBeGreaterThanOrEqual(firstVisit.distance);
      }
    }
  });
});
