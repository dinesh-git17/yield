import type { GraphAlgorithmType } from "@/lib/store";
import type { GraphStep } from "./types";

/**
 * Step type labels for display in the UI.
 */
export const GRAPH_STEP_LABELS: Record<GraphStep["type"], string> = {
  // Common MST operations
  start: "Starting from node",
  "consider-edge": "Considering edge",
  "add-to-mst": "Adding to MST",
  "reject-edge": "Rejecting edge",
  "visit-node": "Visiting node",
  complete: "MST complete",
  disconnected: "Graph not connected",
  // Kruskal's Union-Find operations
  "init-sets": "Initializing sets",
  "find-set": "Finding set",
  "union-sets": "Merging sets",
  // Prim's operations
  "update-priority": "Updating priority",
  "extract-min": "Extracting minimum",
  // Kahn's Topological Sort operations
  "init-indegrees": "Calculating indegrees",
  "enqueue-zero": "Enqueueing node (indegree 0)",
  dequeue: "Processing node",
  "process-outgoing-edge": "Processing edge",
  "decrement-indegree": "Decrementing indegree",
  "add-to-order": "Adding to order",
  "cycle-detected": "Cycle detected",
  "topo-complete": "Sort complete",
};

/**
 * Metadata for each graph algorithm.
 */
export interface GraphAlgorithmMetadata {
  /** Display name for the algorithm */
  label: string;
  /** Short label for compact display */
  shortLabel: string;
  /** Time complexity notation */
  complexity: string;
  /** Space complexity notation */
  spaceComplexity: string;
  /** Brief description of how the algorithm works */
  description: string;
  /** Visual pattern description */
  visualPattern: string;
  /** Whether this requires a start node selection */
  requiresStartNode: boolean;
  /** Whether this works on directed graphs */
  supportsDirected: boolean;
  /** Source code lines for display */
  code: string[];
  /** Maps step types to their corresponding line indices (0-based) */
  lineMapping: Partial<Record<GraphStep["type"], number>>;
}

/**
 * Graph algorithm metadata registry.
 */
export const GRAPH_ALGO_METADATA: Record<GraphAlgorithmType, GraphAlgorithmMetadata> = {
  prim: {
    label: "Prim's Algorithm",
    shortLabel: "Prim's",
    complexity: "O(E log V)",
    spaceComplexity: "O(V)",
    description:
      "Grows the MST from a single source node by always adding the minimum-weight edge connecting a visited node to an unvisited node. Like an infection spreading through the graph.",
    visualPattern: "Infection spreading",
    requiresStartNode: true,
    supportsDirected: false,
    code: [
      "function* prim(graph, start) {",
      "  const inMST = new Set();",
      "  const pq = new MinHeap();",
      "  pq.push({ node: start, weight: 0, edge: null });",
      "",
      "  while (pq.size > 0) {",
      "    // Extract minimum weight edge",
      "    const { node, weight, edge } = pq.pop();",
      "    yield { type: 'extract-min', nodeId: node };",
      "",
      "    if (inMST.has(node)) continue;",
      "",
      "    // Add node to MST",
      "    inMST.add(node);",
      "    yield { type: 'visit-node', nodeId: node };",
      "",
      "    if (edge !== null) {",
      "      yield { type: 'add-to-mst', edgeId: edge };",
      "    }",
      "",
      "    // Add edges to unvisited neighbors",
      "    for (const { neighbor, weight, edgeId } of graph.neighbors(node)) {",
      "      if (!inMST.has(neighbor)) {",
      "        yield { type: 'consider-edge', edgeId, weight };",
      "        pq.push({ node: neighbor, weight, edge: edgeId });",
      "        yield { type: 'update-priority', nodeId: neighbor };",
      "      }",
      "    }",
      "  }",
      "",
      "  yield { type: 'complete', totalWeight, edgeCount };",
      "}",
    ],
    lineMapping: {
      start: 0,
      "extract-min": 8,
      "visit-node": 14,
      "add-to-mst": 17,
      "consider-edge": 23,
      "update-priority": 25,
      complete: 30,
    },
  },

  kruskal: {
    label: "Kruskal's Algorithm",
    shortLabel: "Kruskal's",
    complexity: "O(E log E)",
    spaceComplexity: "O(V)",
    description:
      "Sorts all edges by weight and picks them one by one, skipping edges that would create a cycle. Uses Union-Find to track connected components. Watch the scattered sets merge into one!",
    visualPattern: "Scattered picking with set merging",
    requiresStartNode: false,
    supportsDirected: false,
    code: [
      "function* kruskal(graph) {",
      "  // Initialize Union-Find: each node is its own set",
      "  const uf = new UnionFind(graph.nodes);",
      "  yield { type: 'init-sets', nodeSets: uf.sets };",
      "",
      "  // Sort edges by weight (ascending)",
      "  const sortedEdges = graph.edges.sort((a, b) => a.weight - b.weight);",
      "",
      "  for (const edge of sortedEdges) {",
      "    yield { type: 'consider-edge', edgeId: edge.id, weight: edge.weight };",
      "",
      "    // Find sets of both endpoints",
      "    const rootA = uf.find(edge.source);",
      "    const rootB = uf.find(edge.target);",
      "    yield { type: 'find-set', nodeId: edge.source, setId: rootA };",
      "    yield { type: 'find-set', nodeId: edge.target, setId: rootB };",
      "",
      "    if (rootA === rootB) {",
      "      // Same set: would create cycle",
      "      yield { type: 'reject-edge', edgeId: edge.id, reason: 'same-set' };",
      "      continue;",
      "    }",
      "",
      "    // Different sets: merge them and add edge to MST",
      "    uf.union(edge.source, edge.target);",
      "    yield { type: 'union-sets', edgeId: edge.id, fromSet, toSet };",
      "    yield { type: 'add-to-mst', edgeId: edge.id };",
      "  }",
      "",
      "  yield { type: 'complete', totalWeight, edgeCount };",
      "}",
    ],
    lineMapping: {
      "init-sets": 3,
      "consider-edge": 9,
      "find-set": 14,
      "reject-edge": 19,
      "union-sets": 25,
      "add-to-mst": 26,
      complete: 29,
    },
  },

  kahn: {
    label: "Kahn's Algorithm",
    shortLabel: "Kahn's",
    complexity: "O(V + E)",
    spaceComplexity: "O(V)",
    description:
      "Topological sort for DAGs. Repeatedly removes nodes with no incoming edges (indegree 0) and decrements neighbors' indegrees. Used for dependency resolution and task scheduling.",
    visualPattern: "Indegree countdown",
    requiresStartNode: false,
    supportsDirected: true,
    code: [
      "function* kahn(graph) {",
      "  // Calculate initial indegrees",
      "  const indegree = new Map();",
      "  for (const node of graph.nodes) {",
      "    indegree.set(node.id, 0);",
      "  }",
      "  for (const edge of graph.edges) {",
      "    indegree.set(edge.target, (indegree.get(edge.target) || 0) + 1);",
      "  }",
      "  yield { type: 'init-indegrees', indegrees: indegree };",
      "",
      "  // Initialize queue with indegree-0 nodes",
      "  const queue = [];",
      "  for (const [nodeId, deg] of indegree) {",
      "    if (deg === 0) {",
      "      queue.push(nodeId);",
      "      yield { type: 'enqueue-zero', nodeId };",
      "    }",
      "  }",
      "",
      "  const order = [];",
      "  while (queue.length > 0) {",
      "    const node = queue.shift();",
      "    yield { type: 'dequeue', nodeId: node };",
      "",
      "    order.push(node);",
      "    yield { type: 'add-to-order', nodeId: node };",
      "",
      "    // Process outgoing edges",
      "    for (const edge of graph.outEdges(node)) {",
      "      yield { type: 'process-outgoing-edge', edgeId: edge.id };",
      "      const newDeg = indegree.get(edge.target) - 1;",
      "      indegree.set(edge.target, newDeg);",
      "      yield { type: 'decrement-indegree', nodeId: edge.target };",
      "",
      "      if (newDeg === 0) {",
      "        queue.push(edge.target);",
      "        yield { type: 'enqueue-zero', nodeId: edge.target };",
      "      }",
      "    }",
      "  }",
      "",
      "  if (order.length < graph.nodes.length) {",
      "    yield { type: 'cycle-detected' };",
      "  } else {",
      "    yield { type: 'topo-complete', order };",
      "  }",
      "}",
    ],
    lineMapping: {
      "init-indegrees": 9,
      "enqueue-zero": 16,
      dequeue: 23,
      "add-to-order": 26,
      "process-outgoing-edge": 30,
      "decrement-indegree": 33,
      "cycle-detected": 42,
      "topo-complete": 44,
    },
  },
};

/**
 * Color palette for Union-Find set visualization in Kruskal's algorithm.
 * Each set gets a distinct color to show the connected components.
 */
export const SET_COLORS = [
  "#f43f5e", // rose-500
  "#8b5cf6", // violet-500
  "#3b82f6", // blue-500
  "#22c55e", // green-500
  "#f59e0b", // amber-500
  "#06b6d4", // cyan-500
  "#ec4899", // pink-500
  "#14b8a6", // teal-500
  "#6366f1", // indigo-500
  "#84cc16", // lime-500
] as const;

/**
 * Gets a color for a set ID.
 * Cycles through the palette for IDs beyond the palette size.
 */
export function getSetColor(setId: number): string {
  return SET_COLORS[setId % SET_COLORS.length] ?? SET_COLORS[0];
}

/**
 * Get metadata for a specific graph algorithm.
 * Falls back to Prim's if algorithm not found.
 */
export function getGraphAlgorithmMetadata(algorithm: GraphAlgorithmType): GraphAlgorithmMetadata {
  return GRAPH_ALGO_METADATA[algorithm] ?? GRAPH_ALGO_METADATA.prim;
}
