import { getAdjacencyList } from "@/lib/store";
import type { GraphContext, GraphStep, PrimPriorityEntry } from "./types";

/**
 * Prim's algorithm for Minimum Spanning Tree.
 *
 * Visual pattern: "Infection spreading" - starts from a single node and
 * grows the MST by always adding the minimum-weight edge that connects
 * a visited node to an unvisited node.
 *
 * Time complexity: O(E log V) with priority queue
 * Space complexity: O(V + E)
 *
 * @param context - The graph context containing graph state and optional start node
 * @yields GraphStep - Steps for visualization
 */
export function* prim(context: GraphContext): Generator<GraphStep, void, unknown> {
  const { graphState, startNodeId } = context;
  const nodeIds = Object.keys(graphState.nodes);

  // Handle empty graph
  if (nodeIds.length === 0) {
    yield { type: "disconnected" };
    return;
  }

  // Handle single node (trivial MST)
  if (nodeIds.length === 1) {
    const singleNodeId = nodeIds[0];
    if (singleNodeId) {
      yield { type: "start", nodeId: singleNodeId };
      yield { type: "visit-node", nodeId: singleNodeId };
      yield { type: "complete", totalWeight: 0, edgeCount: 0 };
    }
    return;
  }

  // Get adjacency list for efficient neighbor lookup
  const adjacencyList = getAdjacencyList(graphState);

  // Determine starting node (use provided or first node)
  const start = startNodeId && graphState.nodes[startNodeId] ? startNodeId : nodeIds[0];
  if (!start) {
    yield { type: "disconnected" };
    return;
  }

  yield { type: "start", nodeId: start };

  // Track visited nodes (nodes in MST)
  const inMST = new Set<string>();

  // Priority queue: [priority, nodeId, edgeId that brings us here]
  // Using a simple array and sorting - for production, use a proper heap
  const priorityQueue: PrimPriorityEntry[] = [];

  // MST result tracking
  const mstEdges: string[] = [];
  let totalWeight = 0;

  // Initialize: start node has priority 0
  priorityQueue.push({ nodeId: start, priority: 0, parentEdgeId: null });

  while (priorityQueue.length > 0) {
    // Sort to get minimum (O(n log n) - for production use binary heap)
    priorityQueue.sort((a, b) => a.priority - b.priority);

    // Extract minimum
    const minEntry = priorityQueue.shift();
    if (!minEntry) break;

    const { nodeId, priority, parentEdgeId } = minEntry;

    // Skip if already in MST
    if (inMST.has(nodeId)) {
      continue;
    }

    // Show extraction from priority queue
    yield { type: "extract-min", nodeId, priority };

    // Add node to MST
    inMST.add(nodeId);
    yield { type: "visit-node", nodeId };

    // Add the edge that brought us here (if not the start node)
    if (parentEdgeId !== null) {
      mstEdges.push(parentEdgeId);
      totalWeight += priority;
      yield { type: "add-to-mst", edgeId: parentEdgeId, nodeId };
    }

    // Check if we have a complete MST (n-1 edges for n nodes)
    if (mstEdges.length === nodeIds.length - 1) {
      break;
    }

    // Explore neighbors
    const neighbors = adjacencyList.get(nodeId) ?? [];

    for (const { neighborId, edgeId, weight } of neighbors) {
      // Skip if neighbor is already in MST
      if (inMST.has(neighborId)) {
        continue;
      }

      // Show we're considering this edge
      yield { type: "consider-edge", edgeId, weight };

      // Check if we should update the priority for this neighbor
      const existingEntry = priorityQueue.find((e) => e.nodeId === neighborId);

      if (!existingEntry) {
        // First time seeing this neighbor - add to queue
        priorityQueue.push({ nodeId: neighborId, priority: weight, parentEdgeId: edgeId });
        yield { type: "update-priority", nodeId: neighborId, priority: weight, edgeId };
      } else if (weight < existingEntry.priority) {
        // Found a shorter edge to this neighbor - update
        existingEntry.priority = weight;
        existingEntry.parentEdgeId = edgeId;
        yield { type: "update-priority", nodeId: neighborId, priority: weight, edgeId };
      }
    }
  }

  // Check if graph is connected (we should have n-1 edges)
  if (mstEdges.length < nodeIds.length - 1) {
    yield { type: "disconnected" };
    return;
  }

  yield { type: "complete", totalWeight, edgeCount: mstEdges.length };
}
