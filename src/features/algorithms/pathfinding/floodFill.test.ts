import { describe, expect, it } from "vitest";
import { bfs } from "./bfs";
import { floodFill } from "./floodFill";
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
 * Count unique visited coordinates.
 */
function countUniqueVisits(steps: PathfindingStep[]): number {
  const coords = new Set<string>();
  for (const step of steps) {
    if (step.type === "visit") {
      coords.add(`${step.coord[0]}-${step.coord[1]}`);
    }
  }
  return coords.size;
}

describe("floodFill", () => {
  it("finds a path in an empty grid", () => {
    const context: PathfindingContext = {
      rows: 5,
      cols: 5,
      start: [0, 0],
      end: [4, 4],
      walls: new Set(),
    };

    const steps = collectSteps(context, floodFill);
    const pathSteps = steps.filter((s) => s.type === "path");

    expect(pathSteps.length).toBeGreaterThan(0);
    expect(steps.some((s) => s.type === "no-path")).toBe(false);
  });

  it("finds shortest path (same as BFS)", () => {
    const context: PathfindingContext = {
      rows: 5,
      cols: 5,
      start: [0, 0],
      end: [4, 4],
      walls: new Set(),
    };

    const floodSteps = collectSteps(context, floodFill);
    const bfsSteps = collectSteps(context, bfs);

    const floodPath = floodSteps.filter((s) => s.type === "path").length;
    const bfsPath = bfsSteps.filter((s) => s.type === "path").length;

    // Both should find the same shortest path
    expect(floodPath).toBe(bfsPath);
    expect(floodPath).toBe(8); // Manhattan distance: 4 down + 4 right
  });

  it("explores MORE nodes than BFS (complete flood)", () => {
    const context: PathfindingContext = {
      rows: 5,
      cols: 5,
      start: [0, 0],
      end: [2, 2], // End is in the middle, not at corner
      walls: new Set(),
    };

    const floodSteps = collectSteps(context, floodFill);
    const bfsSteps = collectSteps(context, bfs);

    const floodVisits = countUniqueVisits(floodSteps);
    const bfsVisits = countUniqueVisits(bfsSteps);

    // Flood fill should visit more nodes (continues after finding end)
    expect(floodVisits).toBeGreaterThan(bfsVisits);
  });

  it("explores ALL reachable nodes in empty grid", () => {
    const context: PathfindingContext = {
      rows: 3,
      cols: 3,
      start: [1, 1],
      end: [0, 0],
      walls: new Set(),
    };

    const steps = collectSteps(context, floodFill);
    const uniqueVisits = countUniqueVisits(steps);

    // Should visit all 8 non-start nodes (3x3 grid - 1 start = 8)
    expect(uniqueVisits).toBe(8);
  });

  it("returns no-path when end is completely blocked", () => {
    const context: PathfindingContext = {
      rows: 3,
      cols: 3,
      start: [0, 0],
      end: [2, 2],
      walls: new Set(["1-0", "1-1", "1-2", "0-1"]),
    };

    const steps = collectSteps(context, floodFill);
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

    const steps = collectSteps(context, floodFill);

    // Should still flood entire grid, but path is empty
    expect(steps.filter((s) => s.type === "path").length).toBe(0);
    expect(steps.some((s) => s.type === "no-path")).toBe(false);

    // Should visit all reachable nodes
    const uniqueVisits = countUniqueVisits(steps);
    expect(uniqueVisits).toBe(8); // All non-start nodes
  });

  it("includes distance in visit steps for heat map", () => {
    const context: PathfindingContext = {
      rows: 3,
      cols: 3,
      start: [0, 0],
      end: [2, 2],
      walls: new Set(),
    };

    const steps = collectSteps(context, floodFill);
    const visitSteps = steps.filter((s) => s.type === "visit");

    for (const step of visitSteps) {
      if (step.type === "visit") {
        expect(typeof step.distance).toBe("number");
        expect(step.distance).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it("explores isolated regions separately", () => {
    // Create two separate regions
    const context: PathfindingContext = {
      rows: 5,
      cols: 5,
      start: [0, 0],
      end: [4, 4],
      // Wall divides grid in half vertically
      walls: new Set(["0-2", "1-2", "2-2", "3-2", "4-2"]),
    };

    const steps = collectSteps(context, floodFill);

    // End is unreachable
    expect(steps.some((s) => s.type === "no-path")).toBe(true);

    // But should still explore all of left region
    const uniqueVisits = countUniqueVisits(steps);
    // Left region: 5 rows × 2 cols = 10, minus start = 9
    expect(uniqueVisits).toBe(9);
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
    const steps = collectSteps(context, floodFill);
    const duration = Date.now() - startTime;

    // Should complete quickly (under 100ms)
    expect(duration).toBeLessThan(100);

    // Should explore all nodes (20x20 - 1 start = 399)
    const uniqueVisits = countUniqueVisits(steps);
    expect(uniqueVisits).toBe(399);

    // Should find path
    expect(steps.filter((s) => s.type === "path").length).toBe(38);
  });

  it("path is reconstructed AFTER complete flood", () => {
    const context: PathfindingContext = {
      rows: 3,
      cols: 3,
      start: [0, 0],
      end: [1, 1],
      walls: new Set(),
    };

    const steps = collectSteps(context, floodFill);

    // Find the index of first path step
    const firstPathIndex = steps.findIndex((s) => s.type === "path");
    const lastVisitIndex = steps.findLastIndex((s) => s.type === "visit");

    // Path should come AFTER all visits
    expect(firstPathIndex).toBeGreaterThan(lastVisitIndex);
  });

  it("handles maze with single path", () => {
    // Create a simple maze
    const context: PathfindingContext = {
      rows: 5,
      cols: 5,
      start: [0, 0],
      end: [4, 4],
      walls: new Set(["0-1", "1-1", "2-1", "3-1", "1-3", "2-3", "3-3", "4-3"]),
    };

    const steps = collectSteps(context, floodFill);
    const pathSteps = steps.filter((s) => s.type === "path");

    // Should find a path
    expect(pathSteps.length).toBeGreaterThan(0);
  });
});
