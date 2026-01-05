import { getAdjacencyList } from "@/lib/store";
import type { GraphContext, GraphStep } from "./types";

/**
 * Kahn's algorithm for Topological Sort.
 *
 * Visual pattern: "Indegree countdown" - nodes with indegree 0 are processed
 * and their outgoing edges are "removed" (decremented from neighbors).
 * Nodes turn green when added to the topological order.
 *
 * Prerequisites: Graph must be directed (DAG). If a cycle is detected,
 * yields a "cycle-detected" step.
 *
 * Time complexity: O(V + E)
 * Space complexity: O(V)
 *
 * @param context - The graph context containing graph state
 * @yields GraphStep - Steps for visualization
 */
export function* kahn(context: GraphContext): Generator<GraphStep, void, unknown> {
  const { graphState } = context;
  const nodeIds = Object.keys(graphState.nodes);
  const edges = Object.values(graphState.edges);

  // Handle empty graph
  if (nodeIds.length === 0) {
    yield { type: "topo-complete", order: [] };
    return;
  }

  // Handle single node
  if (nodeIds.length === 1) {
    const singleNodeId = nodeIds[0];
    if (singleNodeId) {
      const indegrees = new Map<string, number>([[singleNodeId, 0]]);
      yield { type: "init-indegrees", indegrees };
      yield { type: "enqueue-zero", nodeId: singleNodeId };
      yield { type: "dequeue", nodeId: singleNodeId, orderIndex: 0 };
      yield { type: "add-to-order", nodeId: singleNodeId, orderIndex: 0 };
      yield { type: "topo-complete", order: [singleNodeId] };
    }
    return;
  }

  // Force directed mode for topological sort
  // (In practice, the UI should enforce this, but we handle it here)
  if (!graphState.isDirected) {
    // For undirected graphs, we can't do topological sort
    // Treat it as a cycle since every edge creates a back-reference
    yield { type: "cycle-detected", remainingNodes: nodeIds.length };
    return;
  }

  // Calculate initial indegrees
  const indegrees = new Map<string, number>();
  for (const nodeId of nodeIds) {
    indegrees.set(nodeId, 0);
  }

  // Count incoming edges for each node
  for (const edge of edges) {
    const currentIndegree = indegrees.get(edge.targetId) ?? 0;
    indegrees.set(edge.targetId, currentIndegree + 1);
  }

  // Yield initial indegree state for visualization
  yield { type: "init-indegrees", indegrees: new Map(indegrees) };

  // Get adjacency list for outgoing edges
  const adjacencyList = getAdjacencyList(graphState);

  // Create a map from (sourceId, targetId) to edgeId for quick lookup
  const edgeLookup = new Map<string, string>();
  for (const edge of edges) {
    edgeLookup.set(`${edge.sourceId}->${edge.targetId}`, edge.id);
  }

  // Initialize queue with indegree-0 nodes
  const queue: string[] = [];
  for (const nodeId of nodeIds) {
    const indegree = indegrees.get(nodeId) ?? 0;
    if (indegree === 0) {
      queue.push(nodeId);
      yield { type: "enqueue-zero", nodeId };
    }
  }

  // Process nodes in topological order
  const order: string[] = [];

  while (queue.length > 0) {
    // Dequeue the next node with indegree 0
    const nodeId = queue.shift();
    if (!nodeId) break;

    // Show dequeue action
    yield { type: "dequeue", nodeId, orderIndex: order.length };

    // Add to topological order
    order.push(nodeId);
    yield { type: "add-to-order", nodeId, orderIndex: order.length - 1 };

    // Process outgoing edges (decrement neighbor indegrees)
    const neighbors = adjacencyList.get(nodeId) ?? [];

    for (const { neighborId, edgeId } of neighbors) {
      // Show we're processing this outgoing edge
      yield { type: "process-outgoing-edge", edgeId, sourceId: nodeId, targetId: neighborId };

      // Decrement the neighbor's indegree
      const currentIndegree = indegrees.get(neighborId) ?? 0;
      const newIndegree = currentIndegree - 1;
      indegrees.set(neighborId, newIndegree);

      yield { type: "decrement-indegree", nodeId: neighborId, newIndegree };

      // If neighbor now has indegree 0, add to queue
      if (newIndegree === 0) {
        queue.push(neighborId);
        yield { type: "enqueue-zero", nodeId: neighborId };
      }
    }
  }

  // Check if all nodes were processed (no cycle)
  if (order.length < nodeIds.length) {
    // Cycle detected - some nodes still have incoming edges
    yield { type: "cycle-detected", remainingNodes: nodeIds.length - order.length };
    return;
  }

  // Topological sort complete
  yield { type: "topo-complete", order };
}
