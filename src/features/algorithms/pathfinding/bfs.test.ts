import { describe, expect, it } from "vitest";
import { bfs } from "./bfs";
import type { PathfindingContext } from "./types";

/**
 * Helper to collect all steps from a generator.
 */
function collectSteps(context: PathfindingContext) {
  const steps = [];
  for (const step of bfs(context)) {
    steps.push(step);
  }
  return steps;
}

/**
 * Helper to check if path was found and get path length.
 */
function getPathLength(context: PathfindingContext): number | null {
  const steps = collectSteps(context);
  const pathSteps = steps.filter((s) => s.type === "path");
  if (pathSteps.length === 0 && steps.some((s) => s.type === "no-path")) {
    return null;
  }
  return pathSteps.length;
}

describe("bfs", () => {
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

  it("finds shortest path in an empty grid", () => {
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

  it("finds path around a wall", () => {
    const context: PathfindingContext = {
      rows: 5,
      cols: 5,
      start: [2, 0],
      end: [2, 4],
      // Vertical wall blocking direct path
      walls: new Set(["0-2", "1-2", "2-2", "3-2"]),
    };

    const steps = collectSteps(context);
    const pathSteps = steps.filter((s) => s.type === "path");

    expect(pathSteps.length).toBeGreaterThan(0);
  });

  it("returns no-path when start is blocked", () => {
    const context: PathfindingContext = {
      rows: 3,
      cols: 3,
      start: [1, 1],
      end: [2, 2],
      // Surround start with walls
      walls: new Set(["0-1", "1-0", "1-2", "2-1"]),
    };

    const steps = collectSteps(context);
    expect(steps.some((s) => s.type === "no-path")).toBe(true);
  });

  it("returns no-path when end is blocked", () => {
    const context: PathfindingContext = {
      rows: 3,
      cols: 3,
      start: [0, 0],
      end: [2, 2],
      // Surround end with walls
      walls: new Set(["1-2", "2-1"]),
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
    // Should find immediately with no path steps needed
    expect(steps.filter((s) => s.type === "path").length).toBe(0);
    expect(steps.some((s) => s.type === "no-path")).toBe(false);
  });

  it("visits nodes layer by layer (flood pattern)", () => {
    const context: PathfindingContext = {
      rows: 5,
      cols: 5,
      start: [2, 2], // Center
      end: [4, 4],
      walls: new Set(),
    };

    const steps = collectSteps(context);
    const visitSteps = steps.filter((s) => s.type === "visit");

    // First visited nodes should be adjacent to start (distance 1)
    const firstVisits = visitSteps.slice(0, 4);
    for (const step of firstVisits) {
      if (step.type === "visit") {
        expect(step.distance).toBe(1);
      }
    }
  });

  it("includes distance in visit steps", () => {
    const context: PathfindingContext = {
      rows: 3,
      cols: 3,
      start: [0, 0],
      end: [2, 2],
      walls: new Set(),
    };

    const steps = collectSteps(context);
    const visitSteps = steps.filter((s) => s.type === "visit");

    // All visit steps should have distance defined
    for (const step of visitSteps) {
      if (step.type === "visit") {
        expect(step.distance).toBeGreaterThanOrEqual(0);
      }
    }
  });
});
