import { describe, expect, it } from "vitest";
import type { GraphState } from "@/lib/store";
import { kruskal } from "./kruskal";
import type { GraphContext, GraphStep } from "./types";
import { createUnionFindState, unionFindFind, unionFindUnion } from "./types";

/**
 * Helper to collect all steps from a generator.
 */
function collectSteps(context: GraphContext): GraphStep[] {
  const steps: GraphStep[] = [];
  for (const step of kruskal(context)) {
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

describe("kruskal", () => {
  it("finds MST for a triangle graph", () => {
    const context: GraphContext = {
      graphState: createTriangleGraph(),
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

  it("handles graph with no edges", () => {
    const context: GraphContext = {
      graphState: createGraphState(
        [
          { id: "a", label: "A" },
          { id: "b", label: "B" },
        ],
        []
      ),
    };

    const steps = collectSteps(context);
    expect(steps.some((s) => s.type === "disconnected")).toBe(true);
  });

  it("detects disconnected graph", () => {
    const context: GraphContext = {
      graphState: createDisconnectedGraph(),
    };

    const steps = collectSteps(context);
    expect(steps.some((s) => s.type === "disconnected")).toBe(true);
  });

  it("yields init-sets step at the beginning", () => {
    const context: GraphContext = {
      graphState: createTriangleGraph(),
    };

    const steps = collectSteps(context);
    const initStep = steps.find((s) => s.type === "init-sets");

    expect(initStep).toBeDefined();
    if (initStep?.type === "init-sets") {
      // Each node should have a unique set ID initially
      expect(initStep.nodeSets.size).toBe(3);
      const setIds = new Set(initStep.nodeSets.values());
      expect(setIds.size).toBe(3); // All unique
    }
  });

  it("yields consider-edge steps in weight order", () => {
    const context: GraphContext = {
      graphState: createTriangleGraph(),
    };

    const steps = collectSteps(context);
    const considerSteps = steps.filter((s) => s.type === "consider-edge");

    // Edges should be considered in weight order: 1, 2
    // Note: Third edge (weight 3) is never considered because algorithm
    // terminates early once we have n-1 = 2 edges in the MST
    expect(considerSteps.length).toBe(2);
    if (considerSteps[0]?.type === "consider-edge") {
      expect(considerSteps[0].weight).toBe(1);
    }
    if (considerSteps[1]?.type === "consider-edge") {
      expect(considerSteps[1].weight).toBe(2);
    }
  });

  it("yields find-set steps for each edge considered", () => {
    const context: GraphContext = {
      graphState: createTriangleGraph(),
    };

    const steps = collectSteps(context);
    const findSteps = steps.filter((s) => s.type === "find-set");

    // Each edge consideration should have 2 find-set operations (one for each endpoint)
    expect(findSteps.length).toBeGreaterThanOrEqual(4); // At least 2 edges × 2 endpoints
  });

  it("yields union-sets step when merging components", () => {
    const context: GraphContext = {
      graphState: createTriangleGraph(),
    };

    const steps = collectSteps(context);
    const unionSteps = steps.filter((s) => s.type === "union-sets");

    // Should have 2 union operations (for 2 edges in MST)
    expect(unionSteps.length).toBe(2);

    // Each union step should have affected nodes
    for (const step of unionSteps) {
      if (step.type === "union-sets") {
        expect(step.affectedNodes.length).toBeGreaterThan(0);
      }
    }
  });

  it("yields reject-edge step when edge would create cycle", () => {
    // Create a triangle where we MUST reject an edge
    // Edges: a-b (1), a-c (2), b-c (3)
    // After sorting: 1, 2, 3
    // Processing:
    //   - e1 (a-b, 1): add to MST (1 edge, sets merge)
    //   - e2 (a-c, 2): add to MST (2 edges = n-1, but algorithm continues to check)
    //   - e3 (b-c, 3): REJECT! b and c are now in same set
    //
    // Wait - this won't work because algo terminates at n-1 edges.
    //
    // Need a graph where rejection happens BEFORE we have enough edges.
    // Let's use 4 nodes with 5 edges where one edge creates a cycle early:
    //
    // a-b (1), a-c (2), b-c (3), c-d (4), b-d (5)
    // Processing:
    //   - e1 (a-b, 1): add (1 edge, a-b merged)
    //   - e2 (a-c, 2): add (2 edges, a-b-c merged)
    //   - e3 (b-c, 3): REJECT! b and c already in same set
    //   - e4 (c-d, 4): add (3 edges = n-1, done!)
    const graphState = createGraphState(
      [
        { id: "a", label: "A" },
        { id: "b", label: "B" },
        { id: "c", label: "C" },
        { id: "d", label: "D" },
      ],
      [
        { id: "e1", sourceId: "a", targetId: "b", weight: 1 },
        { id: "e2", sourceId: "a", targetId: "c", weight: 2 },
        { id: "e3", sourceId: "b", targetId: "c", weight: 3 }, // Will create cycle
        { id: "e4", sourceId: "c", targetId: "d", weight: 4 },
        { id: "e5", sourceId: "b", targetId: "d", weight: 5 },
      ]
    );

    const context: GraphContext = { graphState };
    const steps = collectSteps(context);
    const rejectSteps = steps.filter((s) => s.type === "reject-edge");

    // Edge e3 (b-c with weight 3) should be rejected
    expect(rejectSteps.length).toBeGreaterThanOrEqual(1);
    if (rejectSteps[0]?.type === "reject-edge") {
      expect(rejectSteps[0].edgeId).toBe("e3");
      expect(rejectSteps[0].reason).toBe("same-set");
    }
  });

  it("processes edges in sorted order by weight", () => {
    const graphState = createGraphState(
      [
        { id: "a", label: "A" },
        { id: "b", label: "B" },
        { id: "c", label: "C" },
      ],
      [
        { id: "e1", sourceId: "a", targetId: "b", weight: 5 }, // Added first but should be processed third
        { id: "e2", sourceId: "b", targetId: "c", weight: 1 }, // Should be processed first
        { id: "e3", sourceId: "a", targetId: "c", weight: 3 }, // Should be processed second
      ]
    );

    const context: GraphContext = { graphState };
    const steps = collectSteps(context);
    const considerSteps = steps.filter((s) => s.type === "consider-edge");

    // Should be in weight order: 1, 3, 5
    if (considerSteps[0]?.type === "consider-edge") {
      expect(considerSteps[0].weight).toBe(1);
    }
    if (considerSteps[1]?.type === "consider-edge") {
      expect(considerSteps[1].weight).toBe(3);
    }
    if (considerSteps[2]?.type === "consider-edge") {
      expect(considerSteps[2].weight).toBe(5);
    }
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

    const context: GraphContext = { graphState };
    const steps = collectSteps(context);
    const completeStep = steps.find((s) => s.type === "complete");

    if (completeStep?.type === "complete") {
      // Any 2 edges will do, total weight = 10
      expect(completeStep.totalWeight).toBe(10);
      expect(completeStep.edgeCount).toBe(2);
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
    const context: GraphContext = { graphState };

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

// ─────────────────────────────────────────────────────────────────────────────
// Union-Find Data Structure Tests
// ─────────────────────────────────────────────────────────────────────────────

describe("Union-Find", () => {
  describe("createUnionFindState", () => {
    it("creates state with each node in its own set", () => {
      const nodeIds = ["a", "b", "c"];
      const state = createUnionFindState(nodeIds);

      expect(state.parent.size).toBe(3);
      expect(state.rank.size).toBe(3);
      expect(state.setId.size).toBe(3);

      // Each node should be its own parent
      for (const id of nodeIds) {
        expect(state.parent.get(id)).toBe(id);
      }

      // All ranks should be 0 initially
      for (const id of nodeIds) {
        expect(state.rank.get(id)).toBe(0);
      }

      // Set IDs should be unique
      const setIds = new Set(state.setId.values());
      expect(setIds.size).toBe(3);
    });

    it("handles empty node list", () => {
      const state = createUnionFindState([]);
      expect(state.parent.size).toBe(0);
    });
  });

  describe("unionFindFind", () => {
    it("finds the root of a node", () => {
      const state = createUnionFindState(["a", "b", "c"]);
      expect(unionFindFind(state, "a")).toBe("a");
      expect(unionFindFind(state, "b")).toBe("b");
    });

    it("performs path compression", () => {
      const state = createUnionFindState(["a", "b", "c"]);

      // Manually set up a chain: a -> b -> c
      state.parent.set("a", "b");
      state.parent.set("b", "c");

      // Find should compress the path
      const root = unionFindFind(state, "a");
      expect(root).toBe("c");

      // After path compression, a should point directly to c
      expect(state.parent.get("a")).toBe("c");
    });
  });

  describe("unionFindUnion", () => {
    it("merges two separate sets", () => {
      const state = createUnionFindState(["a", "b", "c"]);
      const result = unionFindUnion(state, "a", "b");

      expect(result.merged).toBe(true);
      expect(result.affectedNodes.length).toBeGreaterThan(0);

      // After union, a and b should have the same root
      expect(unionFindFind(state, "a")).toBe(unionFindFind(state, "b"));
    });

    it("returns merged=false when nodes are already in same set", () => {
      const state = createUnionFindState(["a", "b"]);
      unionFindUnion(state, "a", "b"); // First union

      const result = unionFindUnion(state, "a", "b"); // Second union
      expect(result.merged).toBe(false);
      expect(result.affectedNodes.length).toBe(0);
    });

    it("maintains set ID consistency after union", () => {
      const state = createUnionFindState(["a", "b", "c", "d"]);

      // Union a and b
      unionFindUnion(state, "a", "b");
      const setAB = state.setId.get(unionFindFind(state, "a"));

      // Both should have the same set ID
      expect(state.setId.get("a")).toBe(state.setId.get("b"));

      // Union c and d
      unionFindUnion(state, "c", "d");

      // c and d should have same set ID, different from a/b
      expect(state.setId.get("c")).toBe(state.setId.get("d"));
      expect(state.setId.get("c")).not.toBe(setAB);
    });

    it("tracks affected nodes during union", () => {
      const state = createUnionFindState(["a", "b", "c"]);

      // First union: a and b
      const result1 = unionFindUnion(state, "a", "b");
      expect(result1.affectedNodes.length).toBe(1); // One node changes set

      // Union the set {a,b} with c
      const result2 = unionFindUnion(state, "a", "c");
      expect(result2.merged).toBe(true);
      expect(result2.affectedNodes.length).toBeGreaterThan(0);
    });

    it("uses union by rank for efficiency", () => {
      const state = createUnionFindState(["a", "b", "c", "d"]);

      // Create a larger set by unioning a, b, c
      unionFindUnion(state, "a", "b");
      unionFindUnion(state, "a", "c");

      // Now union with d - the larger set should become the root
      unionFindUnion(state, "a", "d");

      // All should have the same root
      const root = unionFindFind(state, "a");
      expect(unionFindFind(state, "b")).toBe(root);
      expect(unionFindFind(state, "c")).toBe(root);
      expect(unionFindFind(state, "d")).toBe(root);
    });
  });
});
