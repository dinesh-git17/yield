import { describe, expect, it } from "vitest";
import { dijkstra } from "./dijkstra";
import type { PathfindingContext } from "./types";

/**
 * Helper to collect all steps from a generator.
 */
function collectSteps(context: PathfindingContext) {
  const steps = [];
  for (const step of dijkstra(context)) {
    steps.push(step);
  }
  return steps;
}

/**
 * Helper to get path length.
 */
function getPathLength(context: PathfindingContext): number | null {
  const steps = collectSteps(context);
  const pathSteps = steps.filter((s) => s.type === "path");
  if (pathSteps.length === 0 && steps.some((s) => s.type === "no-path")) {
    return null;
  }
  return pathSteps.length;
}

describe("dijkstra", () => {
  it("finds a path in an empty grid", () => {
    const context: PathfindingContext = {
      rows: 5,
      cols: 5,
      start: [0, 0],
      end: [4, 4],
      walls: new Set(),
    };

    const steps = collectSteps(context);
    const pathSteps = steps.filter((s) => s.type === "path");

    expect(pathSteps.length).toBeGreaterThan(0);
    expect(steps.some((s) => s.type === "no-path")).toBe(false);
  });

  it("finds shortest path (guarantees optimality)", () => {
    const context: PathfindingContext = {
      rows: 5,
      cols: 5,
      start: [0, 0],
      end: [4, 4],
      walls: new Set(),
    };

    // Manhattan distance is 8 (4 down + 4 right)
    const pathLength = getPathLength(context);
    expect(pathLength).toBe(8);
  });

  it("finds shortest path around obstacles", () => {
    const context: PathfindingContext = {
      rows: 5,
      cols: 5,
      start: [0, 0],
      end: [0, 4],
      // Wall at [0, 2] forces detour
      walls: new Set(["0-2"]),
    };

    // Shortest path: right, down, right, up, right, right = 6 steps
    // Or: right, right, down, right, up, right = 6 steps
    const pathLength = getPathLength(context);
    expect(pathLength).toBe(6);
  });

  it("returns no-path when blocked", () => {
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

  it("handles start equals end", () => {
    const context: PathfindingContext = {
      rows: 3,
      cols: 3,
      start: [1, 1],
      end: [1, 1],
      walls: new Set(),
    };

    const steps = collectSteps(context);
    expect(steps.filter((s) => s.type === "path").length).toBe(0);
    expect(steps.some((s) => s.type === "no-path")).toBe(false);
  });

  it("explores nodes by increasing distance", () => {
    const context: PathfindingContext = {
      rows: 5,
      cols: 5,
      start: [2, 2],
      end: [4, 4],
      walls: new Set(),
    };

    const steps = collectSteps(context);
    const visitSteps = steps.filter((s) => s.type === "visit");

    // Distances should be non-decreasing (priority queue property)
    let lastDistance = 0;
    for (const step of visitSteps) {
      if (step.type === "visit") {
        expect(step.distance).toBeGreaterThanOrEqual(lastDistance);
        lastDistance = step.distance;
      }
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

    const steps = collectSteps(context);
    const visitSteps = steps.filter((s) => s.type === "visit");

    for (const step of visitSteps) {
      if (step.type === "visit") {
        expect(typeof step.distance).toBe("number");
        expect(step.distance).toBeGreaterThanOrEqual(0);
      }
    }
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
    const steps = collectSteps(context);
    const duration = Date.now() - startTime;

    // Should complete quickly (under 100ms)
    expect(duration).toBeLessThan(100);
    expect(steps.filter((s) => s.type === "path").length).toBe(38);
  });
});
