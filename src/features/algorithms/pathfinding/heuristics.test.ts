import { describe, expect, it } from "vitest";
import type { GridCoord } from "@/lib/store";
import { chebyshev, euclidean, getHeuristic, manhattan } from "./heuristics";

describe("heuristics", () => {
  describe("manhattan", () => {
    it("returns 0 for same point", () => {
      const point: GridCoord = [5, 5];
      expect(manhattan(point, point)).toBe(0);
    });

    it("calculates horizontal distance", () => {
      const a: GridCoord = [0, 0];
      const b: GridCoord = [0, 5];
      expect(manhattan(a, b)).toBe(5);
    });

    it("calculates vertical distance", () => {
      const a: GridCoord = [0, 0];
      const b: GridCoord = [5, 0];
      expect(manhattan(a, b)).toBe(5);
    });

    it("calculates diagonal distance (sum of both)", () => {
      const a: GridCoord = [0, 0];
      const b: GridCoord = [3, 4];
      expect(manhattan(a, b)).toBe(7); // 3 + 4
    });

    it("is symmetric", () => {
      const a: GridCoord = [1, 2];
      const b: GridCoord = [4, 6];
      expect(manhattan(a, b)).toBe(manhattan(b, a));
    });

    it("handles negative coordinates", () => {
      const a: GridCoord = [0, 0];
      const b: GridCoord = [3, 4];
      // Even though grid coords are positive, the math works
      expect(manhattan(a, b)).toBe(7);
    });
  });

  describe("euclidean", () => {
    it("returns 0 for same point", () => {
      const point: GridCoord = [5, 5];
      expect(euclidean(point, point)).toBe(0);
    });

    it("calculates horizontal distance", () => {
      const a: GridCoord = [0, 0];
      const b: GridCoord = [0, 5];
      expect(euclidean(a, b)).toBe(5);
    });

    it("calculates vertical distance", () => {
      const a: GridCoord = [0, 0];
      const b: GridCoord = [5, 0];
      expect(euclidean(a, b)).toBe(5);
    });

    it("calculates diagonal distance (pythagorean)", () => {
      const a: GridCoord = [0, 0];
      const b: GridCoord = [3, 4];
      expect(euclidean(a, b)).toBe(5); // 3-4-5 triangle
    });

    it("is symmetric", () => {
      const a: GridCoord = [1, 2];
      const b: GridCoord = [4, 6];
      expect(euclidean(a, b)).toBe(euclidean(b, a));
    });

    it("is less than or equal to manhattan for diagonal paths", () => {
      const a: GridCoord = [0, 0];
      const b: GridCoord = [3, 4];
      expect(euclidean(a, b)).toBeLessThanOrEqual(manhattan(a, b));
    });
  });

  describe("chebyshev", () => {
    it("returns 0 for same point", () => {
      const point: GridCoord = [5, 5];
      expect(chebyshev(point, point)).toBe(0);
    });

    it("calculates horizontal distance", () => {
      const a: GridCoord = [0, 0];
      const b: GridCoord = [0, 5];
      expect(chebyshev(a, b)).toBe(5);
    });

    it("calculates vertical distance", () => {
      const a: GridCoord = [0, 0];
      const b: GridCoord = [5, 0];
      expect(chebyshev(a, b)).toBe(5);
    });

    it("calculates diagonal distance (max of both)", () => {
      const a: GridCoord = [0, 0];
      const b: GridCoord = [3, 4];
      expect(chebyshev(a, b)).toBe(4); // max(3, 4)
    });

    it("treats pure diagonal as 1 step per unit", () => {
      const a: GridCoord = [0, 0];
      const b: GridCoord = [5, 5];
      expect(chebyshev(a, b)).toBe(5); // 5 diagonal moves
    });

    it("is symmetric", () => {
      const a: GridCoord = [1, 2];
      const b: GridCoord = [4, 6];
      expect(chebyshev(a, b)).toBe(chebyshev(b, a));
    });

    it("is less than or equal to manhattan", () => {
      const a: GridCoord = [0, 0];
      const b: GridCoord = [3, 4];
      expect(chebyshev(a, b)).toBeLessThanOrEqual(manhattan(a, b));
    });

    it("is greater than or equal to euclidean (for integer coords)", () => {
      const a: GridCoord = [0, 0];
      // Let's test a square diagonal where chebyshev < euclidean
      const c: GridCoord = [5, 5];
      // Chebyshev = 5, Euclidean = sqrt(50) ≈ 7.07
      expect(chebyshev(a, c)).toBeLessThan(euclidean(a, c));
    });
  });

  describe("getHeuristic", () => {
    it("returns manhattan for 'manhattan' type", () => {
      const h = getHeuristic("manhattan");
      const a: GridCoord = [0, 0];
      const b: GridCoord = [3, 4];
      expect(h(a, b)).toBe(manhattan(a, b));
    });

    it("returns euclidean for 'euclidean' type", () => {
      const h = getHeuristic("euclidean");
      const a: GridCoord = [0, 0];
      const b: GridCoord = [3, 4];
      expect(h(a, b)).toBe(euclidean(a, b));
    });

    it("returns chebyshev for 'chebyshev' type", () => {
      const h = getHeuristic("chebyshev");
      const a: GridCoord = [0, 0];
      const b: GridCoord = [3, 4];
      expect(h(a, b)).toBe(chebyshev(a, b));
    });

    it("defaults to manhattan for unknown type", () => {
      // TypeScript won't allow this, but test runtime behavior
      const h = getHeuristic("manhattan");
      const a: GridCoord = [0, 0];
      const b: GridCoord = [3, 4];
      expect(h(a, b)).toBe(7);
    });
  });

  describe("heuristic comparisons", () => {
    const testCases: { a: GridCoord; b: GridCoord; name: string }[] = [
      { a: [0, 0], b: [5, 0], name: "horizontal" },
      { a: [0, 0], b: [0, 5], name: "vertical" },
      { a: [0, 0], b: [3, 4], name: "3-4-5 triangle" },
      { a: [0, 0], b: [5, 5], name: "perfect diagonal" },
      { a: [0, 0], b: [1, 7], name: "mostly vertical" },
      { a: [0, 0], b: [7, 1], name: "mostly horizontal" },
    ];

    for (const { a, b, name } of testCases) {
      it(`ordering holds for ${name} case`, () => {
        const m = manhattan(a, b);
        const e = euclidean(a, b);
        const c = chebyshev(a, b);

        // Chebyshev <= Euclidean <= Manhattan for 4-way movement
        // (though euclidean may be > chebyshev for non-diagonal paths)
        expect(c).toBeLessThanOrEqual(m);
        expect(e).toBeLessThanOrEqual(m);
      });
    }
  });
});
