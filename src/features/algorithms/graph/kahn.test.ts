import { describe, expect, it } from "vitest";
import type { GraphState } from "@/lib/store";
import { kahn } from "./kahn";
import type { GraphContext, GraphStep } from "./types";

/**
 * Helper to collect all steps from a generator.
 */
function collectSteps(context: GraphContext): GraphStep[] {
  const steps: GraphStep[] = [];
  for (const step of kahn(context)) {
    steps.push(step);
  }
  return steps;
}

/**
 * Creates a directed graph state for testing.
 */
function createDirectedGraphState(
  nodes: Array<{ id: string; label: string }>,
  edges: Array<{ id: string; sourceId: string; targetId: string; weight: number }>
): GraphState {
  const nodeMap: GraphState["nodes"] = {};
  for (const node of nodes) {
    nodeMap[node.id] = { ...node, x: 50, y: 50 };
  }

  const edgeMap: GraphState["edges"] = {};
  for (const edge of edges) {
    edgeMap[edge.id] = edge;
  }

  return { nodes: nodeMap, edges: edgeMap, isDirected: true };
}

/**
 * Creates a simple DAG: A -> B -> C
 */
function createLinearDAG(): GraphState {
  return createDirectedGraphState(
    [
      { id: "a", label: "A" },
      { id: "b", label: "B" },
      { id: "c", label: "C" },
    ],
    [
      { id: "e1", sourceId: "a", targetId: "b", weight: 1 },
      { id: "e2", sourceId: "b", targetId: "c", weight: 1 },
    ]
  );
}

/**
 * Creates a diamond DAG:
 *     A
 *    / \
 *   B   C
 *    \ /
 *     D
 */
function createDiamondDAG(): GraphState {
  return createDirectedGraphState(
    [
      { id: "a", label: "A" },
      { id: "b", label: "B" },
      { id: "c", label: "C" },
      { id: "d", label: "D" },
    ],
    [
      { id: "e1", sourceId: "a", targetId: "b", weight: 1 },
      { id: "e2", sourceId: "a", targetId: "c", weight: 1 },
      { id: "e3", sourceId: "b", targetId: "d", weight: 1 },
      { id: "e4", sourceId: "c", targetId: "d", weight: 1 },
    ]
  );
}

/**
 * Creates a graph with a cycle: A -> B -> C -> A
 */
function createCyclicGraph(): GraphState {
  return createDirectedGraphState(
    [
      { id: "a", label: "A" },
      { id: "b", label: "B" },
      { id: "c", label: "C" },
    ],
    [
      { id: "e1", sourceId: "a", targetId: "b", weight: 1 },
      { id: "e2", sourceId: "b", targetId: "c", weight: 1 },
      { id: "e3", sourceId: "c", targetId: "a", weight: 1 },
    ]
  );
}

/**
 * Creates an undirected graph (which is not a valid DAG).
 */
function createUndirectedGraph(): GraphState {
  return {
    nodes: {
      a: { id: "a", label: "A", x: 50, y: 50 },
      b: { id: "b", label: "B", x: 50, y: 50 },
    },
    edges: {
      e1: { id: "e1", sourceId: "a", targetId: "b", weight: 1 },
    },
    isDirected: false,
  };
}

/**
 * Creates a complex DAG with multiple valid topological orders.
 *
 *   A     B
 *   |     |
 *   v     v
 *   C --> D --> E
 */
function createComplexDAG(): GraphState {
  return createDirectedGraphState(
    [
      { id: "a", label: "A" },
      { id: "b", label: "B" },
      { id: "c", label: "C" },
      { id: "d", label: "D" },
      { id: "e", label: "E" },
    ],
    [
      { id: "e1", sourceId: "a", targetId: "c", weight: 1 },
      { id: "e2", sourceId: "b", targetId: "d", weight: 1 },
      { id: "e3", sourceId: "c", targetId: "d", weight: 1 },
      { id: "e4", sourceId: "d", targetId: "e", weight: 1 },
    ]
  );
}

describe("kahn", () => {
  describe("basic topological sort", () => {
    it("sorts a linear DAG (A -> B -> C)", () => {
      const context: GraphContext = {
        graphState: createLinearDAG(),
      };

      const steps = collectSteps(context);
      const completeStep = steps.find((s) => s.type === "topo-complete");

      expect(completeStep).toBeDefined();
      if (completeStep?.type === "topo-complete") {
        expect(completeStep.order).toEqual(["a", "b", "c"]);
      }
    });

    it("sorts a diamond DAG with correct order", () => {
      const context: GraphContext = {
        graphState: createDiamondDAG(),
      };

      const steps = collectSteps(context);
      const completeStep = steps.find((s) => s.type === "topo-complete");

      expect(completeStep).toBeDefined();
      if (completeStep?.type === "topo-complete") {
        // A must come before B and C
        // B and C must come before D
        const order = completeStep.order;
        expect(order.indexOf("a")).toBeLessThan(order.indexOf("b"));
        expect(order.indexOf("a")).toBeLessThan(order.indexOf("c"));
        expect(order.indexOf("b")).toBeLessThan(order.indexOf("d"));
        expect(order.indexOf("c")).toBeLessThan(order.indexOf("d"));
      }
    });

    it("handles complex DAG with multiple valid orderings", () => {
      const context: GraphContext = {
        graphState: createComplexDAG(),
      };

      const steps = collectSteps(context);
      const completeStep = steps.find((s) => s.type === "topo-complete");

      expect(completeStep).toBeDefined();
      if (completeStep?.type === "topo-complete") {
        const order = completeStep.order;

        // Verify dependency constraints
        expect(order.indexOf("a")).toBeLessThan(order.indexOf("c"));
        expect(order.indexOf("c")).toBeLessThan(order.indexOf("d"));
        expect(order.indexOf("b")).toBeLessThan(order.indexOf("d"));
        expect(order.indexOf("d")).toBeLessThan(order.indexOf("e"));
      }
    });
  });

  describe("cycle detection", () => {
    it("detects a simple cycle (A -> B -> C -> A)", () => {
      const context: GraphContext = {
        graphState: createCyclicGraph(),
      };

      const steps = collectSteps(context);
      const cycleStep = steps.find((s) => s.type === "cycle-detected");

      expect(cycleStep).toBeDefined();
      if (cycleStep?.type === "cycle-detected") {
        expect(cycleStep.remainingNodes).toBe(3);
      }
    });

    it("rejects undirected graphs as cyclic", () => {
      const context: GraphContext = {
        graphState: createUndirectedGraph(),
      };

      const steps = collectSteps(context);
      expect(steps.some((s) => s.type === "cycle-detected")).toBe(true);
    });
  });

  describe("edge cases", () => {
    it("handles empty graph", () => {
      const context: GraphContext = {
        graphState: { nodes: {}, edges: {}, isDirected: true },
      };

      const steps = collectSteps(context);
      const completeStep = steps.find((s) => s.type === "topo-complete");

      expect(completeStep).toBeDefined();
      if (completeStep?.type === "topo-complete") {
        expect(completeStep.order).toEqual([]);
      }
    });

    it("handles single node graph", () => {
      const context: GraphContext = {
        graphState: createDirectedGraphState([{ id: "a", label: "A" }], []),
      };

      const steps = collectSteps(context);
      const completeStep = steps.find((s) => s.type === "topo-complete");

      expect(completeStep).toBeDefined();
      if (completeStep?.type === "topo-complete") {
        expect(completeStep.order).toEqual(["a"]);
      }
    });

    it("handles disconnected DAG (multiple components)", () => {
      const graphState = createDirectedGraphState(
        [
          { id: "a", label: "A" },
          { id: "b", label: "B" },
          { id: "c", label: "C" },
          { id: "d", label: "D" },
        ],
        [
          { id: "e1", sourceId: "a", targetId: "b", weight: 1 },
          { id: "e2", sourceId: "c", targetId: "d", weight: 1 },
        ]
      );

      const context: GraphContext = { graphState };
      const steps = collectSteps(context);
      const completeStep = steps.find((s) => s.type === "topo-complete");

      expect(completeStep).toBeDefined();
      if (completeStep?.type === "topo-complete") {
        // All nodes should be in the order
        expect(completeStep.order.length).toBe(4);
        // A before B, C before D
        expect(completeStep.order.indexOf("a")).toBeLessThan(completeStep.order.indexOf("b"));
        expect(completeStep.order.indexOf("c")).toBeLessThan(completeStep.order.indexOf("d"));
      }
    });

    it("handles graph with isolated nodes", () => {
      const graphState = createDirectedGraphState(
        [
          { id: "a", label: "A" },
          { id: "b", label: "B" },
          { id: "isolated", label: "X" },
        ],
        [{ id: "e1", sourceId: "a", targetId: "b", weight: 1 }]
      );

      const context: GraphContext = { graphState };
      const steps = collectSteps(context);
      const completeStep = steps.find((s) => s.type === "topo-complete");

      expect(completeStep).toBeDefined();
      if (completeStep?.type === "topo-complete") {
        expect(completeStep.order.length).toBe(3);
        expect(completeStep.order).toContain("isolated");
        expect(completeStep.order.indexOf("a")).toBeLessThan(completeStep.order.indexOf("b"));
      }
    });
  });

  describe("visualization steps", () => {
    it("yields init-indegrees step with correct values", () => {
      const context: GraphContext = {
        graphState: createLinearDAG(),
      };

      const steps = collectSteps(context);
      const initStep = steps.find((s) => s.type === "init-indegrees");

      expect(initStep).toBeDefined();
      if (initStep?.type === "init-indegrees") {
        // A has indegree 0 (no incoming edges)
        expect(initStep.indegrees.get("a")).toBe(0);
        // B has indegree 1 (from A)
        expect(initStep.indegrees.get("b")).toBe(1);
        // C has indegree 1 (from B)
        expect(initStep.indegrees.get("c")).toBe(1);
      }
    });

    it("yields enqueue-zero steps for nodes with indegree 0", () => {
      const context: GraphContext = {
        graphState: createDiamondDAG(),
      };

      const steps = collectSteps(context);
      const enqueueSteps = steps.filter((s) => s.type === "enqueue-zero");

      // First enqueue should be for node A (only node with initial indegree 0)
      expect(enqueueSteps.length).toBeGreaterThan(0);
      // Check that A was enqueued first (before processing)
      const firstEnqueue = enqueueSteps[0];
      if (firstEnqueue?.type === "enqueue-zero") {
        expect(firstEnqueue.nodeId).toBe("a");
      }
    });

    it("yields dequeue steps with order indices", () => {
      const context: GraphContext = {
        graphState: createLinearDAG(),
      };

      const steps = collectSteps(context);
      const dequeueSteps = steps.filter((s) => s.type === "dequeue");

      expect(dequeueSteps.length).toBe(3);

      // Check order indices are sequential
      let expectedIndex = 0;
      for (const step of dequeueSteps) {
        if (step.type === "dequeue") {
          expect(step.orderIndex).toBe(expectedIndex++);
        }
      }
    });

    it("yields process-outgoing-edge steps for each edge", () => {
      const context: GraphContext = {
        graphState: createLinearDAG(),
      };

      const steps = collectSteps(context);
      const processSteps = steps.filter((s) => s.type === "process-outgoing-edge");

      // Should process 2 edges (A->B and B->C)
      expect(processSteps.length).toBe(2);
    });

    it("yields decrement-indegree steps with new values", () => {
      const context: GraphContext = {
        graphState: createLinearDAG(),
      };

      const steps = collectSteps(context);
      const decrementSteps = steps.filter((s) => s.type === "decrement-indegree");

      // Should decrement twice (B's indegree when A processed, C's indegree when B processed)
      expect(decrementSteps.length).toBe(2);

      // All decrements should result in indegree 0 for linear graph
      for (const step of decrementSteps) {
        if (step.type === "decrement-indegree") {
          expect(step.newIndegree).toBe(0);
        }
      }
    });

    it("yields add-to-order steps for each node processed", () => {
      const context: GraphContext = {
        graphState: createDiamondDAG(),
      };

      const steps = collectSteps(context);
      const addToOrderSteps = steps.filter((s) => s.type === "add-to-order");

      expect(addToOrderSteps.length).toBe(4);

      // Check that order indices match the count
      for (let i = 0; i < addToOrderSteps.length; i++) {
        const step = addToOrderSteps[i];
        if (step?.type === "add-to-order") {
          expect(step.orderIndex).toBe(i);
        }
      }
    });
  });

  describe("performance", () => {
    it("completes efficiently for larger DAGs", () => {
      // Create a large DAG (chain of 50 nodes)
      const nodeCount = 50;
      const nodes = Array.from({ length: nodeCount }, (_, i) => ({
        id: `n${i}`,
        label: `N${i}`,
      }));
      const edges = Array.from({ length: nodeCount - 1 }, (_, i) => ({
        id: `e${i}`,
        sourceId: `n${i}`,
        targetId: `n${i + 1}`,
        weight: 1,
      }));

      const graphState = createDirectedGraphState(nodes, edges);
      const context: GraphContext = { graphState };

      const startTime = Date.now();
      const steps = collectSteps(context);
      const duration = Date.now() - startTime;

      // Should complete quickly
      expect(duration).toBeLessThan(100);

      const completeStep = steps.find((s) => s.type === "topo-complete");
      if (completeStep?.type === "topo-complete") {
        expect(completeStep.order.length).toBe(nodeCount);
      }
    });
  });

  describe("indegree calculations", () => {
    it("calculates correct indegrees for diamond DAG", () => {
      const context: GraphContext = {
        graphState: createDiamondDAG(),
      };

      const steps = collectSteps(context);
      const initStep = steps.find((s) => s.type === "init-indegrees");

      if (initStep?.type === "init-indegrees") {
        expect(initStep.indegrees.get("a")).toBe(0);
        expect(initStep.indegrees.get("b")).toBe(1);
        expect(initStep.indegrees.get("c")).toBe(1);
        expect(initStep.indegrees.get("d")).toBe(2);
      }
    });

    it("decrements D's indegree twice in diamond DAG", () => {
      const context: GraphContext = {
        graphState: createDiamondDAG(),
      };

      const steps = collectSteps(context);
      const decrementSteps = steps.filter(
        (s) => s.type === "decrement-indegree" && s.nodeId === "d"
      );

      expect(decrementSteps.length).toBe(2);

      // First decrement should give D indegree 1
      const firstDecrement = decrementSteps[0];
      if (firstDecrement?.type === "decrement-indegree") {
        expect(firstDecrement.newIndegree).toBe(1);
      }

      // Second decrement should give D indegree 0
      const secondDecrement = decrementSteps[1];
      if (secondDecrement?.type === "decrement-indegree") {
        expect(secondDecrement.newIndegree).toBe(0);
      }
    });
  });
});
