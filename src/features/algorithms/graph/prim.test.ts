import { describe, expect, it } from "vitest";
import type { GraphState } from "@/lib/store";
import { prim } from "./prim";
import type { GraphContext, GraphStep } from "./types";

/**
 * Helper to collect all steps from a generator.
 */
function collectSteps(context: GraphContext): GraphStep[] {
  const steps: GraphStep[] = [];
  for (const step of prim(context)) {
    steps.push(step);
  }
  return steps;
}

/**
 * Creates a simple graph state for testing.
 */
function createGraphState(
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

  return { nodes: nodeMap, edges: edgeMap, isDirected: false };
}

/**
 * Creates a simple triangle graph (3 nodes, 3 edges).
 */
function createTriangleGraph(): GraphState {
  return createGraphState(
    [
      { id: "a", label: "A" },
      { id: "b", label: "B" },
      { id: "c", label: "C" },
    ],
    [
      { id: "e1", sourceId: "a", targetId: "b", weight: 1 },
      { id: "e2", sourceId: "b", targetId: "c", weight: 2 },
      { id: "e3", sourceId: "a", targetId: "c", weight: 3 },
    ]
  );
}

/**
 * Creates a square graph with diagonal.
 */
function createSquareGraph(): GraphState {
  return createGraphState(
    [
      { id: "a", label: "A" },
      { id: "b", label: "B" },
      { id: "c", label: "C" },
      { id: "d", label: "D" },
    ],
    [
      { id: "e1", sourceId: "a", targetId: "b", weight: 1 },
      { id: "e2", sourceId: "b", targetId: "c", weight: 2 },
      { id: "e3", sourceId: "c", targetId: "d", weight: 3 },
      { id: "e4", sourceId: "d", targetId: "a", weight: 4 },
      { id: "e5", sourceId: "a", targetId: "c", weight: 5 }, // Diagonal
    ]
  );
}

/**
 * Creates a disconnected graph (two separate components).
 */
function createDisconnectedGraph(): GraphState {
  return createGraphState(
    [
      { id: "a", label: "A" },
      { id: "b", label: "B" },
      { id: "c", label: "C" },
      { id: "d", label: "D" },
    ],
    [
      { id: "e1", sourceId: "a", targetId: "b", weight: 1 },
      { id: "e2", sourceId: "c", targetId: "d", weight: 2 },
    ]
  );
}

describe("prim", () => {
  it("finds MST for a triangle graph", () => {
    const context: GraphContext = {
      graphState: createTriangleGraph(),
      startNodeId: "a",
    };

    const steps = collectSteps(context);
    const mstEdges = steps.filter((s) => s.type === "add-to-mst");
    const completeStep = steps.find((s) => s.type === "complete");

    // MST should have n-1 = 2 edges
    expect(mstEdges.length).toBe(2);

    // Complete step should show total weight = 1 + 2 = 3 (edges e1 and e2)
    expect(completeStep).toBeDefined();
    if (completeStep?.type === "complete") {
      expect(completeStep.totalWeight).toBe(3);
      expect(completeStep.edgeCount).toBe(2);
    }
  });

  it("finds MST for a square graph with diagonal", () => {
    const context: GraphContext = {
      graphState: createSquareGraph(),
      startNodeId: "a",
    };

    const steps = collectSteps(context);
    const completeStep = steps.find((s) => s.type === "complete");

    // MST should have 3 edges (n-1 for 4 nodes)
    if (completeStep?.type === "complete") {
      expect(completeStep.edgeCount).toBe(3);
      // Minimum spanning tree: 1 + 2 + 3 = 6 (edges e1, e2, e3)
      expect(completeStep.totalWeight).toBe(6);
    }
  });

  it("handles empty graph", () => {
    const context: GraphContext = {
      graphState: { nodes: {}, edges: {}, isDirected: false },
    };

    const steps = collectSteps(context);
    expect(steps.some((s) => s.type === "disconnected")).toBe(true);
  });

  it("handles single node graph", () => {
    const context: GraphContext = {
      graphState: createGraphState([{ id: "a", label: "A" }], []),
    };

    const steps = collectSteps(context);
    const completeStep = steps.find((s) => s.type === "complete");

    // Single node is a trivial MST
    if (completeStep?.type === "complete") {
      expect(completeStep.totalWeight).toBe(0);
      expect(completeStep.edgeCount).toBe(0);
    }
  });

  it("detects disconnected graph", () => {
    const context: GraphContext = {
      graphState: createDisconnectedGraph(),
      startNodeId: "a",
    };

    const steps = collectSteps(context);
    expect(steps.some((s) => s.type === "disconnected")).toBe(true);
  });

  it("yields start step with correct node", () => {
    const context: GraphContext = {
      graphState: createTriangleGraph(),
      startNodeId: "b",
    };

    const steps = collectSteps(context);
    const startStep = steps.find((s) => s.type === "start");

    expect(startStep).toBeDefined();
    if (startStep?.type === "start") {
      expect(startStep.nodeId).toBe("b");
    }
  });

  it("yields consider-edge steps for each edge examined", () => {
    const context: GraphContext = {
      graphState: createTriangleGraph(),
      startNodeId: "a",
    };

    const steps = collectSteps(context);
    const considerSteps = steps.filter((s) => s.type === "consider-edge");

    // Should consider multiple edges during the algorithm
    expect(considerSteps.length).toBeGreaterThan(0);

    // Each consider step should have weight information
    for (const step of considerSteps) {
      if (step.type === "consider-edge") {
        expect(typeof step.weight).toBe("number");
      }
    }
  });

  it("yields visit-node steps for nodes added to MST", () => {
    const context: GraphContext = {
      graphState: createTriangleGraph(),
      startNodeId: "a",
    };

    const steps = collectSteps(context);
    const visitSteps = steps.filter((s) => s.type === "visit-node");

    // Should visit all 3 nodes
    expect(visitSteps.length).toBe(3);

    // Extract visited node IDs
    const visitedNodes = visitSteps.map((s) => (s.type === "visit-node" ? s.nodeId : null));
    expect(visitedNodes).toContain("a");
    expect(visitedNodes).toContain("b");
    expect(visitedNodes).toContain("c");
  });

  it("yields extract-min steps showing priority queue operations", () => {
    const context: GraphContext = {
      graphState: createTriangleGraph(),
      startNodeId: "a",
    };

    const steps = collectSteps(context);
    const extractSteps = steps.filter((s) => s.type === "extract-min");

    // Should have extract steps for each node processed
    expect(extractSteps.length).toBeGreaterThanOrEqual(3);
  });

  it("handles graph with all equal weights", () => {
    const graphState = createGraphState(
      [
        { id: "a", label: "A" },
        { id: "b", label: "B" },
        { id: "c", label: "C" },
      ],
      [
        { id: "e1", sourceId: "a", targetId: "b", weight: 5 },
        { id: "e2", sourceId: "b", targetId: "c", weight: 5 },
        { id: "e3", sourceId: "a", targetId: "c", weight: 5 },
      ]
    );

    const context: GraphContext = { graphState, startNodeId: "a" };
    const steps = collectSteps(context);
    const completeStep = steps.find((s) => s.type === "complete");

    if (completeStep?.type === "complete") {
      // Any 2 edges will do, total weight = 10
      expect(completeStep.totalWeight).toBe(10);
      expect(completeStep.edgeCount).toBe(2);
    }
  });

  it("uses first node if startNodeId not provided", () => {
    const context: GraphContext = {
      graphState: createTriangleGraph(),
    };

    const steps = collectSteps(context);
    const startStep = steps.find((s) => s.type === "start");

    // Should still find a valid MST
    expect(startStep).toBeDefined();
    expect(steps.some((s) => s.type === "complete")).toBe(true);
  });

  it("handles linear graph (chain)", () => {
    const graphState = createGraphState(
      [
        { id: "a", label: "A" },
        { id: "b", label: "B" },
        { id: "c", label: "C" },
        { id: "d", label: "D" },
      ],
      [
        { id: "e1", sourceId: "a", targetId: "b", weight: 1 },
        { id: "e2", sourceId: "b", targetId: "c", weight: 2 },
        { id: "e3", sourceId: "c", targetId: "d", weight: 3 },
      ]
    );

    const context: GraphContext = { graphState, startNodeId: "a" };
    const steps = collectSteps(context);
    const completeStep = steps.find((s) => s.type === "complete");

    if (completeStep?.type === "complete") {
      // All edges are part of MST
      expect(completeStep.totalWeight).toBe(6);
      expect(completeStep.edgeCount).toBe(3);
    }
  });

  it("completes efficiently for larger graphs", () => {
    // Create a complete graph K6
    const nodes = ["a", "b", "c", "d", "e", "f"].map((id) => ({ id, label: id.toUpperCase() }));
    const edges: Array<{ id: string; sourceId: string; targetId: string; weight: number }> = [];
    let edgeCount = 0;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const nodeI = nodes[i];
        const nodeJ = nodes[j];
        if (nodeI && nodeJ) {
          edges.push({
            id: `e${edgeCount++}`,
            sourceId: nodeI.id,
            targetId: nodeJ.id,
            weight: Math.floor(Math.random() * 10) + 1,
          });
        }
      }
    }

    const graphState = createGraphState(nodes, edges);
    const context: GraphContext = { graphState, startNodeId: "a" };

    const startTime = Date.now();
    const steps = collectSteps(context);
    const duration = Date.now() - startTime;

    // Should complete quickly
    expect(duration).toBeLessThan(100);

    const completeStep = steps.find((s) => s.type === "complete");
    if (completeStep?.type === "complete") {
      expect(completeStep.edgeCount).toBe(5); // n-1 edges for 6 nodes
    }
  });
});
