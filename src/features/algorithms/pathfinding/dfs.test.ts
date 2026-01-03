import { describe, expect, it } from "vitest";
import { dfs } from "./dfs";
import type { PathfindingContext } from "./types";

/**
 * Helper to collect all steps from a generator.
 */
function collectSteps(context: PathfindingContext) {
  const steps = [];
  for (const step of dfs(context)) {
    steps.push(step);
  }
  return steps;
}

describe("dfs", () => {
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

  it("returns no-path when blocked", () => {
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

  it("explores deep before backtracking (snake pattern)", () => {
    const context: PathfindingContext = {
      rows: 5,
      cols: 5,
      start: [0, 0],
      end: [4, 4],
      walls: new Set(),
    };

    const steps = collectSteps(context);
    const visitSteps = steps.filter((s) => s.type === "visit");

    // DFS should generally explore in one direction before backtracking
    // Check that distances generally increase before decreasing
    if (visitSteps.length > 2) {
      const firstStep = visitSteps[0];
      const secondStep = visitSteps[1];
      if (firstStep?.type === "visit" && secondStep?.type === "visit") {
        // Distance should tend to increase in early steps
        expect(secondStep.distance).toBeGreaterThanOrEqual(firstStep.distance);
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

    for (const step of visitSteps) {
      if (step.type === "visit") {
        expect(step.distance).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it("does not guarantee shortest path", () => {
    // DFS may find a longer path than BFS
    const context: PathfindingContext = {
      rows: 5,
      cols: 5,
      start: [0, 0],
      end: [0, 4],
      walls: new Set(),
    };

    const steps = collectSteps(context);
    const pathSteps = steps.filter((s) => s.type === "path");

    // DFS should find a path
    expect(pathSteps.length).toBeGreaterThan(0);
    // Path length may be >= 4 (shortest is 4)
    expect(pathSteps.length).toBeGreaterThanOrEqual(4);
  });
});
