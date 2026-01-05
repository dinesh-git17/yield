import { describe, expect, it } from "vitest";
import { randomNoise } from "./randomNoise";
import type { MazeContext, MazeStep } from "./types";
import { toKey } from "./types";

/**
 * Collects all steps from a maze generator.
 */
function collectSteps(context: MazeContext): MazeStep[] {
  const generator = randomNoise(context);
  const steps: MazeStep[] = [];
  for (const step of generator) {
    steps.push(step);
  }
  return steps;
}

describe("randomNoise", () => {
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
    // Run multiple times to reduce flakiness from randomness
    for (let i = 0; i < 10; i++) {
      const steps = collectSteps(baseContext);
      const startKey = toKey(baseContext.start);

      const wallOnStart = steps.some(
        (step) => step.type === "wall" && toKey(step.coord) === startKey
      );
      expect(wallOnStart).toBe(false);
    }
  });

  it("never places walls on end position", () => {
    // Run multiple times to reduce flakiness from randomness
    for (let i = 0; i < 10; i++) {
      const steps = collectSteps(baseContext);
      const endKey = toKey(baseContext.end);

      const wallOnEnd = steps.some((step) => step.type === "wall" && toKey(step.coord) === endKey);
      expect(wallOnEnd).toBe(false);
    }
  });

  it("generates some walls (probabilistically)", () => {
    // With 30% probability and 100 cells, we should see some walls
    // Run a few times to ensure we get walls
    let foundWalls = false;
    for (let i = 0; i < 5; i++) {
      const steps = collectSteps(baseContext);
      const wallSteps = steps.filter((step) => step.type === "wall");
      if (wallSteps.length > 0) {
        foundWalls = true;
        break;
      }
    }
    expect(foundWalls).toBe(true);
  });

  it("only yields wall or complete steps", () => {
    const steps = collectSteps(baseContext);
    for (const step of steps) {
      expect(["wall", "complete"]).toContain(step.type);
    }
  });

  it("handles small grids", () => {
    const smallContext: MazeContext = {
      rows: 3,
      cols: 3,
      start: [0, 0],
      end: [2, 2],
    };
    const steps = collectSteps(smallContext);
    expect(steps.length).toBeGreaterThan(0);
    expect(steps[steps.length - 1]?.type).toBe("complete");
  });

  it("handles edge case where start and end are adjacent", () => {
    const adjacentContext: MazeContext = {
      rows: 2,
      cols: 2,
      start: [0, 0],
      end: [0, 1],
    };
    const steps = collectSteps(adjacentContext);

    // Should still complete
    expect(steps[steps.length - 1]?.type).toBe("complete");

    // Neither start nor end should have walls
    const startKey = toKey(adjacentContext.start);
    const endKey = toKey(adjacentContext.end);
    const wallKeys = steps
      .filter((s): s is Extract<MazeStep, { type: "wall" }> => s.type === "wall")
      .map((s) => toKey(s.coord));

    expect(wallKeys).not.toContain(startKey);
    expect(wallKeys).not.toContain(endKey);
  });
});
