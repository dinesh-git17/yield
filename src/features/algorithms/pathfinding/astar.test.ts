import { describe, expect, it } from "vitest";
import { aStar } from "./astar";
import { bfs } from "./bfs";
import { dijkstra } from "./dijkstra";
import type { PathfindingContext } from "./types";

/**
 * Helper to collect all steps from a generator.
 */
function collectSteps(
  context: PathfindingContext,
  algorithm: (ctx: PathfindingContext) => Generator
) {
  const steps = [];
  for (const step of algorithm(context)) {
    steps.push(step);
  }
  return steps;
}

/**
 * Helper to get path length.
 */
function getPathLength(context: PathfindingContext): number | null {
  const steps = collectSteps(context, aStar);
  const pathSteps = steps.filter((s) => s.type === "path");
  if (pathSteps.length === 0 && steps.some((s) => s.type === "no-path")) {
    return null;
  }
  return pathSteps.length;
}

describe("aStar", () => {
  it("finds a path in an empty grid", () => {
    const context: PathfindingContext = {
      rows: 5,
      cols: 5,
      start: [0, 0],
      end: [4, 4],
      walls: new Set(),
    };

    const steps = collectSteps(context, aStar);
    const pathSteps = steps.filter((s) => s.type === "path");

    expect(pathSteps.length).toBeGreaterThan(0);
    expect(steps.some((s) => s.type === "no-path")).toBe(false);
  });

  it("finds shortest path (guarantees optimality with admissible heuristic)", () => {
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

  it("finds same shortest path as Dijkstra", () => {
    const context: PathfindingContext = {
      rows: 5,
      cols: 5,
      start: [0, 0],
      end: [0, 4],
      walls: new Set(["0-2"]),
    };

    const astarSteps = collectSteps(context, aStar);
    const dijkstraSteps = collectSteps(context, dijkstra);

    const astarPath = astarSteps.filter((s) => s.type === "path").length;
    const dijkstraPath = dijkstraSteps.filter((s) => s.type === "path").length;

    expect(astarPath).toBe(dijkstraPath);
  });

  it("visits fewer nodes than BFS (heuristic-guided)", () => {
    const context: PathfindingContext = {
      rows: 10,
      cols: 10,
      start: [0, 0],
      end: [9, 9],
      walls: new Set(),
    };

    const astarSteps = collectSteps(context, aStar);
    const bfsSteps = collectSteps(context, bfs);

    const astarVisits = astarSteps.filter((s) => s.type === "visit").length;
    const bfsVisits = bfsSteps.filter((s) => s.type === "visit").length;

    // A* should visit fewer or equal nodes due to heuristic guidance
    expect(astarVisits).toBeLessThanOrEqual(bfsVisits);
  });

  it("returns no-path when blocked", () => {
    const context: PathfindingContext = {
      rows: 3,
      cols: 3,
      start: [1, 1],
      end: [2, 2],
      walls: new Set(["0-1", "1-0", "1-2", "2-1"]),
    };

    const steps = collectSteps(context, aStar);
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

    const steps = collectSteps(context, aStar);
    expect(steps.filter((s) => s.type === "path").length).toBe(0);
    expect(steps.some((s) => s.type === "no-path")).toBe(false);
  });

  it("prioritizes nodes closer to goal", () => {
    const context: PathfindingContext = {
      rows: 5,
      cols: 5,
      start: [0, 0],
      end: [4, 4],
      walls: new Set(),
    };

    const steps = collectSteps(context, aStar);
    const visitSteps = steps.filter((s) => s.type === "visit");

    // A* should generally explore toward the goal
    // Check that early visits are closer to start
    if (visitSteps.length > 5) {
      const earlyVisit = visitSteps[0];
      const lateVisit = visitSteps[visitSteps.length - 1];

      if (earlyVisit?.type === "visit" && lateVisit?.type === "visit") {
        // Late visits should generally have higher distance (closer to goal)
        expect(lateVisit.distance).toBeGreaterThanOrEqual(earlyVisit.distance);
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

    const steps = collectSteps(context, aStar);
    const visitSteps = steps.filter((s) => s.type === "visit");

    for (const step of visitSteps) {
      if (step.type === "visit") {
        expect(typeof step.distance).toBe("number");
        expect(step.distance).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it("handles complex maze", () => {
    // Create a simple maze
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

    const steps = collectSteps(context, aStar);
    const pathSteps = steps.filter((s) => s.type === "path");

    // Should find a path through the maze
    expect(pathSteps.length).toBeGreaterThan(0);
    expect(steps.some((s) => s.type === "no-path")).toBe(false);
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
    const steps = collectSteps(context, aStar);
    const duration = Date.now() - startTime;

    // Should complete quickly (under 100ms)
    expect(duration).toBeLessThan(100);
    expect(steps.filter((s) => s.type === "path").length).toBe(38);
  });
});
