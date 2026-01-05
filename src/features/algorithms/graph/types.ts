import type { GraphState } from "@/lib/store";

/**
 * Represents the set ID for Union-Find visualization in Kruskal's algorithm.
 * Each connected component gets a unique set identifier.
 */
export type UnionFindSetId = number;

/**
 * Represents a single step in a graph algorithm execution.
 * Used by generator functions to yield operations for visualization.
 */
export type GraphStep =
  // ─────────────────────────────────────────────────────────────────────────────
  // Common MST Operations
  // ─────────────────────────────────────────────────────────────────────────────
  | {
      /** Starting the algorithm from a specific node */
      type: "start";
      /** ID of the starting node */
      nodeId: string;
    }
  | {
      /** Considering an edge for inclusion in MST */
      type: "consider-edge";
      /** ID of the edge being considered */
      edgeId: string;
      /** Weight of the edge */
      weight: number;
    }
  | {
      /** Edge has been added to the MST */
      type: "add-to-mst";
      /** ID of the edge added to MST */
      edgeId: string;
      /** ID of the node being added to MST (for Prim's) */
      nodeId?: string;
    }
  | {
      /** Edge was rejected (would form a cycle) */
      type: "reject-edge";
      /** ID of the rejected edge */
      edgeId: string;
      /** Reason for rejection */
      reason: "cycle" | "same-set";
    }
  | {
      /** Visiting/processing a node */
      type: "visit-node";
      /** ID of the node being visited */
      nodeId: string;
    }
  | {
      /** Algorithm complete */
      type: "complete";
      /** Total weight of the MST */
      totalWeight: number;
      /** Number of edges in MST */
      edgeCount: number;
    }
  | {
      /** Graph is not connected - cannot form MST */
      type: "disconnected";
    }
  // ─────────────────────────────────────────────────────────────────────────────
  // Kruskal's Union-Find Specific Operations
  // ─────────────────────────────────────────────────────────────────────────────
  | {
      /** Initializing sets for each node (Union-Find setup) */
      type: "init-sets";
      /** Map of node IDs to their initial set IDs */
      nodeSets: Map<string, UnionFindSetId>;
    }
  | {
      /** Finding the set of a node */
      type: "find-set";
      /** ID of the node whose set is being found */
      nodeId: string;
      /** The set ID found */
      setId: UnionFindSetId;
    }
  | {
      /** Merging two sets (union operation) */
      type: "union-sets";
      /** ID of the edge connecting the two sets */
      edgeId: string;
      /** Set ID being merged from */
      fromSetId: UnionFindSetId;
      /** Set ID being merged into */
      toSetId: UnionFindSetId;
      /** All node IDs that changed set membership */
      affectedNodes: string[];
    }
  // ─────────────────────────────────────────────────────────────────────────────
  // Prim's Specific Operations
  // ─────────────────────────────────────────────────────────────────────────────
  | {
      /** Updating the priority queue with new edge distances */
      type: "update-priority";
      /** ID of the node whose priority is being updated */
      nodeId: string;
      /** The new priority (edge weight) */
      priority: number;
      /** ID of the edge providing this priority */
      edgeId: string;
    }
  | {
      /** Extracting minimum from priority queue */
      type: "extract-min";
      /** ID of the node being extracted */
      nodeId: string;
      /** The priority value of the extracted node */
      priority: number;
    };

/**
 * Context passed to graph algorithms.
 * Contains the current graph state for read-only operations.
 */
export interface GraphContext {
  /** The current graph state (read-only snapshot) */
  graphState: GraphState;
  /** Starting node ID for algorithms that need one (e.g., Prim's) */
  startNodeId?: string | undefined;
}

/**
 * Signature for graph algorithm generator functions.
 */
export type GraphAlgorithmGenerator = (
  context: GraphContext
) => Generator<GraphStep, void, unknown>;

/**
 * Priority queue entry for Prim's algorithm.
 */
export interface PrimPriorityEntry {
  nodeId: string;
  priority: number;
  parentEdgeId: string | null;
}

/**
 * Union-Find data structure for Kruskal's algorithm.
 */
export interface UnionFindState {
  /** Parent pointer for each node (for path compression) */
  parent: Map<string, string>;
  /** Rank for union by rank optimization */
  rank: Map<string, number>;
  /** Set ID for visualization (which color/group) */
  setId: Map<string, UnionFindSetId>;
}

/**
 * Creates a new Union-Find state with each node in its own set.
 */
export function createUnionFindState(nodeIds: string[]): UnionFindState {
  const parent = new Map<string, string>();
  const rank = new Map<string, number>();
  const setId = new Map<string, UnionFindSetId>();

  for (let i = 0; i < nodeIds.length; i++) {
    const nodeId = nodeIds[i];
    if (nodeId === undefined) continue;
    parent.set(nodeId, nodeId); // Each node is its own parent initially
    rank.set(nodeId, 0);
    setId.set(nodeId, i); // Unique set ID for each node
  }

  return { parent, rank, setId };
}

/**
 * Find operation with path compression.
 * Returns the root of the set containing the given node.
 */
export function unionFindFind(state: UnionFindState, nodeId: string): string {
  const parentId = state.parent.get(nodeId);
  if (parentId === undefined || parentId === nodeId) {
    return nodeId;
  }
  // Path compression: point directly to root
  const root = unionFindFind(state, parentId);
  state.parent.set(nodeId, root);
  return root;
}

/**
 * Union operation with union by rank.
 * Merges the sets containing the two nodes.
 * Returns the nodes that changed their set ID (for visualization).
 */
export function unionFindUnion(
  state: UnionFindState,
  nodeA: string,
  nodeB: string
): {
  merged: boolean;
  fromSetId: UnionFindSetId;
  toSetId: UnionFindSetId;
  affectedNodes: string[];
} {
  const rootA = unionFindFind(state, nodeA);
  const rootB = unionFindFind(state, nodeB);

  if (rootA === rootB) {
    const setIdA = state.setId.get(rootA) ?? 0;
    return { merged: false, fromSetId: setIdA, toSetId: setIdA, affectedNodes: [] };
  }

  const rankA = state.rank.get(rootA) ?? 0;
  const rankB = state.rank.get(rootB) ?? 0;
  const setIdA = state.setId.get(rootA) ?? 0;
  const setIdB = state.setId.get(rootB) ?? 0;

  // Collect all nodes in the set being merged
  const affectedNodes: string[] = [];

  // Union by rank
  let fromSetId: UnionFindSetId;
  let toSetId: UnionFindSetId;

  if (rankA < rankB) {
    state.parent.set(rootA, rootB);
    // All nodes with setIdA get setIdB
    for (const [nId, sId] of state.setId.entries()) {
      if (sId === setIdA) {
        state.setId.set(nId, setIdB);
        affectedNodes.push(nId);
      }
    }
    fromSetId = setIdA;
    toSetId = setIdB;
  } else if (rankA > rankB) {
    state.parent.set(rootB, rootA);
    // All nodes with setIdB get setIdA
    for (const [nId, sId] of state.setId.entries()) {
      if (sId === setIdB) {
        state.setId.set(nId, setIdA);
        affectedNodes.push(nId);
      }
    }
    fromSetId = setIdB;
    toSetId = setIdA;
  } else {
    state.parent.set(rootB, rootA);
    state.rank.set(rootA, rankA + 1);
    // All nodes with setIdB get setIdA
    for (const [nId, sId] of state.setId.entries()) {
      if (sId === setIdB) {
        state.setId.set(nId, setIdA);
        affectedNodes.push(nId);
      }
    }
    fromSetId = setIdB;
    toSetId = setIdA;
  }

  return { merged: true, fromSetId, toSetId, affectedNodes };
}
