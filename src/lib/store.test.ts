import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  createEmptyGraphState,
  createEmptyTreeState,
  type GraphState,
  getAdjacencyList,
  resetGraphIdCounters,
  resetNodeIdCounter,
  type TreeState,
  useYieldStore,
} from "./store";

describe("Tree Store Actions", () => {
  beforeEach(() => {
    resetNodeIdCounter();
    useYieldStore.getState().resetTree();
  });

  afterEach(() => {
    useYieldStore.getState().resetTree();
  });

  describe("insertNode", () => {
    it("inserts first node as root", () => {
      const id = useYieldStore.getState().insertNode(50);
      const { treeState } = useYieldStore.getState();

      expect(id).toBe("node-1");
      expect(treeState.rootId).toBe("node-1");
      expect(treeState.nodes["node-1"]).toEqual({
        id: "node-1",
        value: 50,
        leftId: null,
        rightId: null,
        parentId: null,
      });
    });

    it("inserts smaller value as left child", () => {
      useYieldStore.getState().insertNode(50);
      const id = useYieldStore.getState().insertNode(25);
      const { treeState } = useYieldStore.getState();

      expect(id).toBe("node-2");
      expect(treeState.nodes["node-1"]?.leftId).toBe("node-2");
      expect(treeState.nodes["node-2"]).toEqual({
        id: "node-2",
        value: 25,
        leftId: null,
        rightId: null,
        parentId: "node-1",
      });
    });

    it("inserts larger value as right child", () => {
      useYieldStore.getState().insertNode(50);
      const id = useYieldStore.getState().insertNode(75);
      const { treeState } = useYieldStore.getState();

      expect(id).toBe("node-2");
      expect(treeState.nodes["node-1"]?.rightId).toBe("node-2");
      expect(treeState.nodes["node-2"]?.parentId).toBe("node-1");
    });

    it("rejects duplicate values", () => {
      useYieldStore.getState().insertNode(50);
      const id = useYieldStore.getState().insertNode(50);
      const { treeState } = useYieldStore.getState();

      expect(id).toBeNull();
      expect(Object.keys(treeState.nodes)).toHaveLength(1);
    });

    it("builds correct BST structure", () => {
      //       50
      //      /  \
      //    25    75
      //   /  \
      //  10   30
      useYieldStore.getState().insertNode(50);
      useYieldStore.getState().insertNode(25);
      useYieldStore.getState().insertNode(75);
      useYieldStore.getState().insertNode(10);
      useYieldStore.getState().insertNode(30);

      const { treeState } = useYieldStore.getState();

      expect(Object.keys(treeState.nodes)).toHaveLength(5);
      expect(treeState.nodes["node-1"]?.leftId).toBe("node-2");
      expect(treeState.nodes["node-1"]?.rightId).toBe("node-3");
      expect(treeState.nodes["node-2"]?.leftId).toBe("node-4");
      expect(treeState.nodes["node-2"]?.rightId).toBe("node-5");
    });
  });

  describe("deleteNode", () => {
    it("returns false when deleting from empty tree", () => {
      const result = useYieldStore.getState().deleteNode(50);
      expect(result).toBe(false);
    });

    it("returns false when value not found", () => {
      useYieldStore.getState().insertNode(50);
      const result = useYieldStore.getState().deleteNode(100);
      expect(result).toBe(false);
    });

    it("deletes leaf node (root)", () => {
      useYieldStore.getState().insertNode(50);
      const result = useYieldStore.getState().deleteNode(50);
      const { treeState } = useYieldStore.getState();

      expect(result).toBe(true);
      expect(treeState.rootId).toBeNull();
      expect(Object.keys(treeState.nodes)).toHaveLength(0);
    });

    it("deletes leaf node (non-root)", () => {
      useYieldStore.getState().insertNode(50);
      useYieldStore.getState().insertNode(25);
      useYieldStore.getState().insertNode(75);

      const result = useYieldStore.getState().deleteNode(25);
      const { treeState } = useYieldStore.getState();

      expect(result).toBe(true);
      expect(treeState.nodes["node-1"]?.leftId).toBeNull();
      expect(Object.keys(treeState.nodes)).toHaveLength(2);
    });

    it("deletes node with one left child", () => {
      useYieldStore.getState().insertNode(50);
      useYieldStore.getState().insertNode(25);
      useYieldStore.getState().insertNode(10);

      const result = useYieldStore.getState().deleteNode(25);
      const { treeState } = useYieldStore.getState();

      expect(result).toBe(true);
      expect(treeState.nodes["node-1"]?.leftId).toBe("node-3");
      expect(treeState.nodes["node-3"]?.parentId).toBe("node-1");
    });

    it("deletes node with one right child", () => {
      useYieldStore.getState().insertNode(50);
      useYieldStore.getState().insertNode(75);
      useYieldStore.getState().insertNode(100);

      const result = useYieldStore.getState().deleteNode(75);
      const { treeState } = useYieldStore.getState();

      expect(result).toBe(true);
      expect(treeState.nodes["node-1"]?.rightId).toBe("node-3");
      expect(treeState.nodes["node-3"]?.parentId).toBe("node-1");
    });

    it("deletes root with one child", () => {
      useYieldStore.getState().insertNode(50);
      useYieldStore.getState().insertNode(25);

      const result = useYieldStore.getState().deleteNode(50);
      const { treeState } = useYieldStore.getState();

      expect(result).toBe(true);
      expect(treeState.rootId).toBe("node-2");
      expect(treeState.nodes["node-2"]?.parentId).toBeNull();
    });

    it("deletes node with two children (uses in-order successor)", () => {
      //       50
      //      /  \
      //    25    75
      //         /
      //        60
      useYieldStore.getState().insertNode(50);
      useYieldStore.getState().insertNode(25);
      useYieldStore.getState().insertNode(75);
      useYieldStore.getState().insertNode(60);

      const result = useYieldStore.getState().deleteNode(50);
      const { treeState } = useYieldStore.getState();

      expect(result).toBe(true);
      // 60 becomes the new root value (in-order successor)
      expect(treeState.nodes["node-1"]?.value).toBe(60);
      // 75's left child should now be null
      expect(treeState.nodes["node-3"]?.leftId).toBeNull();
    });

    it("deletes node with two children (complex case)", () => {
      //       50
      //      /  \
      //    25    75
      //   / \    / \
      //  10 30  60  90
      useYieldStore.getState().insertNode(50);
      useYieldStore.getState().insertNode(25);
      useYieldStore.getState().insertNode(75);
      useYieldStore.getState().insertNode(10);
      useYieldStore.getState().insertNode(30);
      useYieldStore.getState().insertNode(60);
      useYieldStore.getState().insertNode(90);

      const result = useYieldStore.getState().deleteNode(50);
      const { treeState } = useYieldStore.getState();

      expect(result).toBe(true);
      // In-order successor of 50 is 60
      expect(treeState.nodes["node-1"]?.value).toBe(60);
      expect(Object.keys(treeState.nodes)).toHaveLength(6);
    });
  });

  describe("resetTree", () => {
    it("clears all nodes", () => {
      useYieldStore.getState().insertNode(50);
      useYieldStore.getState().insertNode(25);
      useYieldStore.getState().insertNode(75);

      useYieldStore.getState().resetTree();
      const { treeState } = useYieldStore.getState();

      expect(treeState.rootId).toBeNull();
      expect(Object.keys(treeState.nodes)).toHaveLength(0);
    });
  });

  describe("setTreeState", () => {
    it("sets entire tree state", () => {
      const customState: TreeState = {
        rootId: "custom-1",
        nodes: {
          "custom-1": {
            id: "custom-1",
            value: 42,
            leftId: null,
            rightId: null,
            parentId: null,
          },
        },
      };

      useYieldStore.getState().setTreeState(customState);
      const { treeState } = useYieldStore.getState();

      expect(treeState.rootId).toBe("custom-1");
      expect(treeState.nodes["custom-1"]?.value).toBe(42);
    });
  });

  describe("setTreeAlgorithm", () => {
    it("changes tree algorithm", () => {
      useYieldStore.getState().setTreeAlgorithm("inorder");
      expect(useYieldStore.getState().treeAlgorithm).toBe("inorder");

      useYieldStore.getState().setTreeAlgorithm("search");
      expect(useYieldStore.getState().treeAlgorithm).toBe("search");
    });
  });

  describe("mode switching", () => {
    it("preserves tree state when switching modes", () => {
      useYieldStore.getState().insertNode(50);
      useYieldStore.getState().insertNode(25);

      useYieldStore.getState().setMode("sorting");
      useYieldStore.getState().setMode("pathfinding");
      useYieldStore.getState().setMode("tree");

      const { treeState } = useYieldStore.getState();
      expect(Object.keys(treeState.nodes)).toHaveLength(2);
    });
  });
});

describe("createEmptyTreeState", () => {
  it("creates empty tree state", () => {
    const state = createEmptyTreeState();
    expect(state.rootId).toBeNull();
    expect(state.nodes).toEqual({});
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Graph Store Tests
// ─────────────────────────────────────────────────────────────────────────────

describe("Graph Store Actions", () => {
  beforeEach(() => {
    resetGraphIdCounters();
    useYieldStore.getState().clearGraph();
  });

  afterEach(() => {
    useYieldStore.getState().clearGraph();
  });

  describe("addGraphNode", () => {
    it("adds first node with auto-generated label", () => {
      const id = useYieldStore.getState().addGraphNode(50, 50);
      const { graphState } = useYieldStore.getState();

      expect(id).toBe("gnode-1");
      expect(graphState.nodes["gnode-1"]).toEqual({
        id: "gnode-1",
        x: 50,
        y: 50,
        label: "A",
      });
    });

    it("adds multiple nodes with sequential labels", () => {
      useYieldStore.getState().addGraphNode(10, 10);
      useYieldStore.getState().addGraphNode(20, 20);
      useYieldStore.getState().addGraphNode(30, 30);
      const { graphState } = useYieldStore.getState();

      expect(graphState.nodes["gnode-1"]?.label).toBe("A");
      expect(graphState.nodes["gnode-2"]?.label).toBe("B");
      expect(graphState.nodes["gnode-3"]?.label).toBe("C");
    });

    it("adds node with custom label", () => {
      const id = useYieldStore.getState().addGraphNode(50, 50, "Start");
      const { graphState } = useYieldStore.getState();

      expect(graphState.nodes[id as string]?.label).toBe("Start");
    });

    it("returns null when max nodes reached", () => {
      // Add 50 nodes (MAX_NODES)
      for (let i = 0; i < 50; i++) {
        useYieldStore.getState().addGraphNode(i, i);
      }

      const id = useYieldStore.getState().addGraphNode(100, 100);
      expect(id).toBeNull();
    });
  });

  describe("addGraphEdge", () => {
    beforeEach(() => {
      useYieldStore.getState().addGraphNode(10, 10); // gnode-1
      useYieldStore.getState().addGraphNode(20, 20); // gnode-2
      useYieldStore.getState().addGraphNode(30, 30); // gnode-3
    });

    it("adds edge between two nodes", () => {
      const edgeId = useYieldStore.getState().addGraphEdge("gnode-1", "gnode-2");
      const { graphState } = useYieldStore.getState();

      expect(edgeId).toBe("gedge-1");
      expect(graphState.edges["gedge-1"]).toEqual({
        id: "gedge-1",
        sourceId: "gnode-1",
        targetId: "gnode-2",
        weight: 1,
      });
    });

    it("adds edge with custom weight", () => {
      const edgeId = useYieldStore.getState().addGraphEdge("gnode-1", "gnode-2", 5);
      const { graphState } = useYieldStore.getState();

      expect(graphState.edges[edgeId as string]?.weight).toBe(5);
    });

    it("rejects self-loops", () => {
      const edgeId = useYieldStore.getState().addGraphEdge("gnode-1", "gnode-1");
      expect(edgeId).toBeNull();
    });

    it("rejects edges to non-existent nodes", () => {
      const edgeId = useYieldStore.getState().addGraphEdge("gnode-1", "gnode-99");
      expect(edgeId).toBeNull();
    });

    it("rejects duplicate edges in undirected mode", () => {
      useYieldStore.getState().addGraphEdge("gnode-1", "gnode-2");
      const edgeId = useYieldStore.getState().addGraphEdge("gnode-2", "gnode-1");
      expect(edgeId).toBeNull();
    });

    it("allows reverse edges in directed mode", () => {
      useYieldStore.getState().setGraphDirected(true);
      useYieldStore.getState().addGraphEdge("gnode-1", "gnode-2");
      const edgeId = useYieldStore.getState().addGraphEdge("gnode-2", "gnode-1");

      expect(edgeId).not.toBeNull();
    });
  });

  describe("updateGraphNodePosition", () => {
    it("updates node position", () => {
      useYieldStore.getState().addGraphNode(10, 10);
      useYieldStore.getState().updateGraphNodePosition("gnode-1", 75, 25);
      const { graphState } = useYieldStore.getState();

      expect(graphState.nodes["gnode-1"]?.x).toBe(75);
      expect(graphState.nodes["gnode-1"]?.y).toBe(25);
    });

    it("ignores non-existent node", () => {
      useYieldStore.getState().addGraphNode(10, 10);
      useYieldStore.getState().updateGraphNodePosition("gnode-99", 75, 25);
      const { graphState } = useYieldStore.getState();

      expect(graphState.nodes["gnode-1"]?.x).toBe(10);
    });
  });

  describe("updateGraphEdgeWeight", () => {
    it("updates edge weight", () => {
      useYieldStore.getState().addGraphNode(10, 10);
      useYieldStore.getState().addGraphNode(20, 20);
      useYieldStore.getState().addGraphEdge("gnode-1", "gnode-2", 1);
      useYieldStore.getState().updateGraphEdgeWeight("gedge-1", 10);
      const { graphState } = useYieldStore.getState();

      expect(graphState.edges["gedge-1"]?.weight).toBe(10);
    });
  });

  describe("removeGraphNode", () => {
    it("removes node and its connected edges", () => {
      useYieldStore.getState().addGraphNode(10, 10); // gnode-1
      useYieldStore.getState().addGraphNode(20, 20); // gnode-2
      useYieldStore.getState().addGraphNode(30, 30); // gnode-3
      useYieldStore.getState().addGraphEdge("gnode-1", "gnode-2"); // gedge-1
      useYieldStore.getState().addGraphEdge("gnode-2", "gnode-3"); // gedge-2

      const result = useYieldStore.getState().removeGraphNode("gnode-2");
      const { graphState } = useYieldStore.getState();

      expect(result).toBe(true);
      expect(graphState.nodes["gnode-2"]).toBeUndefined();
      expect(Object.keys(graphState.nodes)).toHaveLength(2);
      expect(Object.keys(graphState.edges)).toHaveLength(0); // Both edges removed
    });

    it("returns false for non-existent node", () => {
      const result = useYieldStore.getState().removeGraphNode("gnode-99");
      expect(result).toBe(false);
    });
  });

  describe("removeGraphEdge", () => {
    it("removes edge", () => {
      useYieldStore.getState().addGraphNode(10, 10);
      useYieldStore.getState().addGraphNode(20, 20);
      useYieldStore.getState().addGraphEdge("gnode-1", "gnode-2");

      const result = useYieldStore.getState().removeGraphEdge("gedge-1");
      const { graphState } = useYieldStore.getState();

      expect(result).toBe(true);
      expect(graphState.edges["gedge-1"]).toBeUndefined();
      expect(Object.keys(graphState.nodes)).toHaveLength(2); // Nodes preserved
    });

    it("returns false for non-existent edge", () => {
      const result = useYieldStore.getState().removeGraphEdge("gedge-99");
      expect(result).toBe(false);
    });
  });

  describe("setGraphDirected", () => {
    it("toggles directed mode", () => {
      expect(useYieldStore.getState().graphState.isDirected).toBe(false);

      useYieldStore.getState().setGraphDirected(true);
      expect(useYieldStore.getState().graphState.isDirected).toBe(true);

      useYieldStore.getState().setGraphDirected(false);
      expect(useYieldStore.getState().graphState.isDirected).toBe(false);
    });
  });

  describe("clearGraph", () => {
    it("clears all nodes and edges", () => {
      useYieldStore.getState().addGraphNode(10, 10);
      useYieldStore.getState().addGraphNode(20, 20);
      useYieldStore.getState().addGraphEdge("gnode-1", "gnode-2");

      useYieldStore.getState().clearGraph();
      const { graphState } = useYieldStore.getState();

      expect(Object.keys(graphState.nodes)).toHaveLength(0);
      expect(Object.keys(graphState.edges)).toHaveLength(0);
      expect(graphState.isDirected).toBe(false);
    });
  });

  describe("setGraphState", () => {
    it("sets entire graph state", () => {
      const customState: GraphState = {
        nodes: {
          "custom-1": { id: "custom-1", x: 25, y: 75, label: "X" },
          "custom-2": { id: "custom-2", x: 75, y: 25, label: "Y" },
        },
        edges: {
          "custom-edge-1": {
            id: "custom-edge-1",
            sourceId: "custom-1",
            targetId: "custom-2",
            weight: 42,
          },
        },
        isDirected: true,
      };

      useYieldStore.getState().setGraphState(customState);
      const { graphState } = useYieldStore.getState();

      expect(graphState.nodes["custom-1"]?.label).toBe("X");
      expect(graphState.edges["custom-edge-1"]?.weight).toBe(42);
      expect(graphState.isDirected).toBe(true);
    });
  });

  describe("mode switching", () => {
    it("preserves graph state when switching modes", () => {
      useYieldStore.getState().setMode("graph");
      useYieldStore.getState().addGraphNode(50, 50);
      useYieldStore.getState().addGraphNode(75, 25);

      useYieldStore.getState().setMode("sorting");
      useYieldStore.getState().setMode("pathfinding");
      useYieldStore.getState().setMode("graph");

      const { graphState } = useYieldStore.getState();
      expect(Object.keys(graphState.nodes)).toHaveLength(2);
    });
  });
});

describe("createEmptyGraphState", () => {
  it("creates empty graph state", () => {
    const state = createEmptyGraphState();
    expect(state.nodes).toEqual({});
    expect(state.edges).toEqual({});
    expect(state.isDirected).toBe(false);
  });
});

describe("getAdjacencyList", () => {
  it("returns empty map for empty graph", () => {
    const graphState = createEmptyGraphState();
    const adjList = getAdjacencyList(graphState);
    expect(adjList.size).toBe(0);
  });

  it("creates adjacency list for undirected graph", () => {
    const graphState: GraphState = {
      nodes: {
        A: { id: "A", x: 0, y: 0, label: "A" },
        B: { id: "B", x: 50, y: 0, label: "B" },
        C: { id: "C", x: 25, y: 50, label: "C" },
      },
      edges: {
        e1: { id: "e1", sourceId: "A", targetId: "B", weight: 5 },
        e2: { id: "e2", sourceId: "B", targetId: "C", weight: 3 },
      },
      isDirected: false,
    };

    const adjList = getAdjacencyList(graphState);

    // A connects to B
    expect(adjList.get("A")).toEqual([{ neighborId: "B", edgeId: "e1", weight: 5 }]);
    // B connects to A and C (undirected)
    expect(adjList.get("B")).toEqual([
      { neighborId: "A", edgeId: "e1", weight: 5 },
      { neighborId: "C", edgeId: "e2", weight: 3 },
    ]);
    // C connects to B
    expect(adjList.get("C")).toEqual([{ neighborId: "B", edgeId: "e2", weight: 3 }]);
  });

  it("creates adjacency list for directed graph", () => {
    const graphState: GraphState = {
      nodes: {
        A: { id: "A", x: 0, y: 0, label: "A" },
        B: { id: "B", x: 50, y: 0, label: "B" },
      },
      edges: {
        e1: { id: "e1", sourceId: "A", targetId: "B", weight: 1 },
      },
      isDirected: true,
    };

    const adjList = getAdjacencyList(graphState);

    // A -> B
    expect(adjList.get("A")).toEqual([{ neighborId: "B", edgeId: "e1", weight: 1 }]);
    // B has no outgoing edges
    expect(adjList.get("B")).toEqual([]);
  });
});
