import { describe, expect, it } from "vitest";
import { aStar } from "./astar";
import { bidirectionalAStar } from "./bidirectionalAStar";
import type { HeuristicFunction } from "./heuristics";
import type { PathfindingContext, PathfindingStep } from "./types";

/**
 * Helper to collect all steps from a generator.
 */
function collectSteps(
  context: PathfindingContext,
  algorithm: (
    ctx: PathfindingContext,
    h?: HeuristicFunction
  ) => Generator<PathfindingStep, void, unknown>
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
  algorithm: (
    ctx: PathfindingContext,
    h?: HeuristicFunction
  ) => Generator<PathfindingStep, void, unknown>
): number | null {
  const steps = collectSteps(context, algorithm);
  const pathSteps = steps.filter((s) => s.type === "path");
  if (pathSteps.length === 0 && steps.some((s) => s.type === "no-path")) {
    return null;
  }
  return pathSteps.length;
}

describe("bidirectionalAStar", () => {
  it("finds a path in an empty grid", () => {
    const context: PathfindingContext = {
      rows: 5,
      cols: 5,
      start: [0, 0],
      end: [4, 4],
      walls: new Set(),
    };

    const steps = collectSteps(context, bidirectionalAStar);
    const pathSteps = steps.filter((s) => s.type === "path");

    expect(pathSteps.length).toBeGreaterThan(0);
    expect(steps.some((s) => s.type === "no-path")).toBe(false);
  });

  it("finds same shortest path length as unidirectional A*", () => {
    const context: PathfindingContext = {
      rows: 5,
      cols: 5,
      start: [0, 0],
      end: [4, 4],
      walls: new Set(),
    };

    const biPathLength = getPathLength(context, bidirectionalAStar);
    const astarPathLength = getPathLength(context, aStar);

    expect(biPathLength).toBe(astarPathLength);
  });

  it("finds shortest path through obstacle", () => {
    const context: PathfindingContext = {
      rows: 5,
      cols: 5,
      start: [0, 0],
      end: [0, 4],
      walls: new Set(["0-2"]),
    };

    const biPathLength = getPathLength(context, bidirectionalAStar);
    const astarPathLength = getPathLength(context, aStar);

    expect(biPathLength).toBe(astarPathLength);
  });

  it("visits fewer nodes than unidirectional A* on large grids", () => {
    const context: PathfindingContext = {
      rows: 15,
      cols: 15,
      start: [0, 0],
      end: [14, 14],
      walls: new Set(),
    };

    const biSteps = collectSteps(context, bidirectionalAStar);
    const astarSteps = collectSteps(context, aStar);

    const biVisits = biSteps.filter((s) => s.type === "visit" || s.type === "current").length;
    const astarVisits = astarSteps.filter((s) => s.type === "visit" || s.type === "current").length;

    // Bidirectional should visit fewer or equal nodes
    expect(biVisits).toBeLessThanOrEqual(astarVisits);
  });

  it("returns no-path when blocked", () => {
    const context: PathfindingContext = {
      rows: 3,
      cols: 3,
      start: [1, 1],
      end: [2, 2],
      walls: new Set(["0-1", "1-0", "1-2", "2-1"]),
    };

    const steps = collectSteps(context, bidirectionalAStar);
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

    const steps = collectSteps(context, bidirectionalAStar);
    expect(steps.filter((s) => s.type === "path").length).toBe(0);
    expect(steps.some((s) => s.type === "no-path")).toBe(false);
  });

  it("shows two-frontier expansion (visits from both directions)", () => {
    const context: PathfindingContext = {
      rows: 7,
      cols: 7,
      start: [3, 0],
      end: [3, 6],
      walls: new Set(),
    };

    const steps = collectSteps(context, bidirectionalAStar);
    const visitSteps = steps.filter((s) => s.type === "visit" || s.type === "current");

    // Check we have visits from both sides of the grid
    const leftVisits = visitSteps.filter((s) => s.type === "visit" && s.coord[1] <= 2);
    const rightVisits = visitSteps.filter((s) => s.type === "visit" && s.coord[1] >= 4);

    // Should have visits from both sides (tunnel bore effect)
    expect(leftVisits.length).toBeGreaterThan(0);
    expect(rightVisits.length).toBeGreaterThan(0);
  });

  it("handles complex maze", () => {
    const context: PathfindingContext = {
      rows: 7,
      cols: 7,
      start: [0, 0],
      end: [6, 6],
      walls: new Set([
        "1-0",
        "1-1",
        "1-2",
        "1-3",
        "1-4",
        "3-2",
        "3-3",
        "3-4",
        "3-5",
        "3-6",
        "5-0",
        "5-1",
        "5-2",
        "5-3",
        "5-4",
      ]),
    };

    const biPathLength = getPathLength(context, bidirectionalAStar);
    const astarPathLength = getPathLength(context, aStar);

    // Should find same length path as A*
    expect(biPathLength).toBe(astarPathLength);
  });

  it("handles U-shaped obstacle", () => {
    // U-shaped wall that requires going around
    const context: PathfindingContext = {
      rows: 7,
      cols: 7,
      start: [3, 1],
      end: [3, 5],
      walls: new Set(["1-3", "2-3", "3-3", "4-3", "5-3", "1-4", "1-5", "5-4", "5-5"]),
    };

    const steps = collectSteps(context, bidirectionalAStar);
    const pathSteps = steps.filter((s) => s.type === "path");

    expect(pathSteps.length).toBeGreaterThan(0);
    expect(steps.some((s) => s.type === "no-path")).toBe(false);
  });

  it("includes distance in visit steps for heat map", () => {
    const context: PathfindingContext = {
      rows: 3,
      cols: 3,
      start: [0, 0],
      end: [2, 2],
      walls: new Set(),
    };

    const steps = collectSteps(context, bidirectionalAStar);
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
    const steps = collectSteps(context, bidirectionalAStar);
    const duration = Date.now() - startTime;

    // Should complete quickly (under 100ms)
    expect(duration).toBeLessThan(100);
    expect(steps.filter((s) => s.type === "path").length).toBe(38);
  });

  it("handles adjacent start and end", () => {
    const context: PathfindingContext = {
      rows: 3,
      cols: 3,
      start: [1, 1],
      end: [1, 2],
      walls: new Set(),
    };

    const steps = collectSteps(context, bidirectionalAStar);
    const pathSteps = steps.filter((s) => s.type === "path");

    // Path should be just the end node
    expect(pathSteps.length).toBe(1);
  });

  it("handles narrow corridor", () => {
    // Force path through a 1-cell wide corridor
    // Grid visualization (. = open, W = wall, S = start, E = end):
    // S . W . .
    // W . W . .
    // W . W . .
    // W . . . .
    // W W W W E
    const context: PathfindingContext = {
      rows: 5,
      cols: 5,
      start: [0, 0],
      end: [4, 4],
      walls: new Set(["0-2", "1-0", "1-2", "2-0", "2-2", "3-0", "4-0", "4-1", "4-2", "4-3"]),
    };

    const steps = collectSteps(context, bidirectionalAStar);
    const pathSteps = steps.filter((s) => s.type === "path");

    // Path goes: (0,0)->(0,1)->(1,1)->(2,1)->(3,1)->(3,2)->(3,3)->(3,4)->(4,4)
    expect(pathSteps.length).toBeGreaterThan(0);
  });
});
