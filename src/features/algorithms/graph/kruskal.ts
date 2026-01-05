import type { GraphEdge } from "@/lib/store";
import type { GraphContext, GraphStep } from "./types";
import { createUnionFindState, unionFindFind, unionFindUnion } from "./types";

/**
 * Kruskal's algorithm for Minimum Spanning Tree.
 *
 * Visual pattern: "Scattered picking" - sorts all edges by weight and picks
 * the minimum weight edge that doesn't form a cycle. Uses Union-Find to
 * efficiently detect cycles.
 *
 * Key visualization feature: Color-coded connected components (sets).
 * When two components are merged, their colors combine, showing how
 * the MST grows from scattered pieces.
 *
 * Time complexity: O(E log E) for sorting edges
 * Space complexity: O(V) for Union-Find structure
 *
 * @param context - The graph context containing graph state
 * @yields GraphStep - Steps for visualization
 */
export function* kruskal(context: GraphContext): Generator<GraphStep, void, unknown> {
  const { graphState } = context;
  const nodeIds = Object.keys(graphState.nodes);
  const edges = Object.values(graphState.edges);

  // Handle empty graph
  if (nodeIds.length === 0) {
    yield { type: "disconnected" };
    return;
  }

  // Handle single node (trivial MST)
  if (nodeIds.length === 1) {
    const singleNodeId = nodeIds[0];
    if (singleNodeId) {
      yield { type: "visit-node", nodeId: singleNodeId };
      yield { type: "complete", totalWeight: 0, edgeCount: 0 };
    }
    return;
  }

  // Handle no edges
  if (edges.length === 0) {
    yield { type: "disconnected" };
    return;
  }

  // Initialize Union-Find with each node in its own set
  const uf = createUnionFindState(nodeIds);

  // Yield initial set assignments for visualization
  yield { type: "init-sets", nodeSets: new Map(uf.setId) };

  // Sort edges by weight (ascending)
  const sortedEdges: GraphEdge[] = [...edges].sort((a, b) => a.weight - b.weight);

  // MST result tracking
  const mstEdges: string[] = [];
  let totalWeight = 0;
  const requiredEdges = nodeIds.length - 1;

  // Process edges in order of weight
  for (const edge of sortedEdges) {
    // Early termination if we have enough edges
    if (mstEdges.length >= requiredEdges) {
      break;
    }

    // Show we're considering this edge
    yield { type: "consider-edge", edgeId: edge.id, weight: edge.weight };

    // Find the sets of both endpoints
    const rootSource = unionFindFind(uf, edge.sourceId);
    const rootTarget = unionFindFind(uf, edge.targetId);

    yield { type: "find-set", nodeId: edge.sourceId, setId: uf.setId.get(rootSource) ?? 0 };
    yield { type: "find-set", nodeId: edge.targetId, setId: uf.setId.get(rootTarget) ?? 0 };

    // Check if adding this edge would create a cycle
    if (rootSource === rootTarget) {
      // Same set - would create a cycle
      yield { type: "reject-edge", edgeId: edge.id, reason: "same-set" };
      continue;
    }

    // Different sets - safe to add this edge
    // Perform union operation
    const unionResult = unionFindUnion(uf, edge.sourceId, edge.targetId);

    // Visualize the set merge
    yield {
      type: "union-sets",
      edgeId: edge.id,
      fromSetId: unionResult.fromSetId,
      toSetId: unionResult.toSetId,
      affectedNodes: unionResult.affectedNodes,
    };

    // Add edge to MST
    mstEdges.push(edge.id);
    totalWeight += edge.weight;
    yield { type: "add-to-mst", edgeId: edge.id };
  }

  // Check if graph is connected
  if (mstEdges.length < requiredEdges) {
    yield { type: "disconnected" };
    return;
  }

  yield { type: "complete", totalWeight, edgeCount: mstEdges.length };
}
