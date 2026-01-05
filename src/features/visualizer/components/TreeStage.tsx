"use client";

import { AnimatePresence, motion } from "framer-motion";
import { memo, useMemo } from "react";
import type { TraversalOutput, TreeNodeState } from "@/features/algorithms";
import { SPRING_PRESETS } from "@/lib/motion";
import { type TreeNode, type TreeState, useYieldStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export interface TreeStageProps {
  className?: string;
  /** Map of node IDs to their visual states during algorithm execution */
  nodeStates?: Map<string, TreeNodeState>;
  /** Output sequence from traversal operations */
  traversalOutput?: TraversalOutput[];
}

/**
 * Layout constants for tree positioning.
 */
const LAYOUT = {
  /** Y position of root as percentage of container height */
  ROOT_Y_PERCENT: 12,
  /** Vertical spacing between levels as percentage */
  LEVEL_HEIGHT_PERCENT: 16,
  /** Node diameter in pixels */
  NODE_SIZE: 48,
  /** Minimum horizontal gap between nodes at deepest level */
  MIN_NODE_GAP: 8,
} as const;

/**
 * Calculates the position of a node in the tree using the binary split algorithm.
 * Root is at X=50%, each level splits the remaining width.
 *
 * @param path - The path from root to this node (left/right decisions)
 * @returns The X position as a percentage (0-100)
 */
function calculateNodeX(path: ("left" | "right")[]): number {
  let x = 50;
  for (let i = 0; i < path.length; i++) {
    const offset = 50 / 2 ** (i + 1);
    x += path[i] === "left" ? -offset : offset;
  }
  return x;
}

/**
 * Calculates the Y position based on depth.
 */
function calculateNodeY(depth: number): number {
  return LAYOUT.ROOT_Y_PERCENT + depth * LAYOUT.LEVEL_HEIGHT_PERCENT;
}

/**
 * Represents a node with its calculated screen position.
 */
interface PositionedNode {
  node: TreeNode;
  x: number; // percentage
  y: number; // percentage
  depth: number;
  parentX: number | null;
  parentY: number | null;
}

/**
 * Builds an array of positioned nodes from the tree state.
 */
function buildPositionedNodes(treeState: TreeState): PositionedNode[] {
  const positioned: PositionedNode[] = [];

  if (!treeState.rootId) return positioned;

  const traverse = (
    nodeId: string,
    depth: number,
    path: ("left" | "right")[],
    parentX: number | null,
    parentY: number | null
  ) => {
    const node = treeState.nodes[nodeId];
    if (!node) return;

    const x = calculateNodeX(path);
    const y = calculateNodeY(depth);

    positioned.push({ node, x, y, depth, parentX, parentY });

    if (node.leftId) {
      traverse(node.leftId, depth + 1, [...path, "left"], x, y);
    }
    if (node.rightId) {
      traverse(node.rightId, depth + 1, [...path, "right"], x, y);
    }
  };

  traverse(treeState.rootId, 0, [], null, null);

  return positioned;
}

/**
 * TreeStage — The Tree Visualization Stage.
 *
 * Renders a binary search tree with:
 * - Layer 1 (Back): SVG lines connecting parent to child nodes
 * - Layer 2 (Front): Animated circular nodes with values
 * - Layer 3 (Bottom): Traversal output sequence
 */
export function TreeStage({ className, nodeStates, traversalOutput }: TreeStageProps) {
  const treeState = useYieldStore((state) => state.treeState);
  const treeAlgorithm = useYieldStore((state) => state.treeAlgorithm);

  const positionedNodes = useMemo(() => buildPositionedNodes(treeState), [treeState]);

  const isEmpty = positionedNodes.length === 0;
  const hasTraversalOutput = traversalOutput && traversalOutput.length > 0;

  return (
    <div className={cn("flex h-full flex-col", className)}>
      {/* Header Bar */}
      <header className="border-border-subtle bg-surface flex h-14 shrink-0 items-center justify-between border-b px-4">
        <div className="flex items-center gap-3">
          <h1 className="text-primary text-sm font-medium">Binary Search Tree</h1>
          <motion.span
            key={treeAlgorithm}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={SPRING_PRESETS.snappy}
            className="bg-emerald-500/20 text-emerald-400 rounded-full px-2 py-0.5 text-xs font-medium"
          >
            {getAlgorithmLabel(treeAlgorithm)}
          </motion.span>
        </div>

        {/* Node count */}
        <div className="text-muted text-xs">
          {positionedNodes.length} node{positionedNodes.length !== 1 ? "s" : ""}
        </div>
      </header>

      {/* Visualization Area */}
      <div className="bg-dot-pattern relative flex-1 overflow-hidden">
        {isEmpty ? (
          <EmptyTreeHint />
        ) : (
          <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
            {/* Layer 1: Edge Lines */}
            <g className="edges">
              {positionedNodes.map(
                ({ node, x, y, parentX, parentY }) =>
                  parentX !== null &&
                  parentY !== null && (
                    <TreeEdge key={`edge-${node.id}`} x1={parentX} y1={parentY} x2={x} y2={y} />
                  )
              )}
            </g>
          </svg>
        )}

        {/* Layer 2: Nodes */}
        <div className="absolute inset-0">
          <AnimatePresence mode="popLayout">
            {positionedNodes.map(({ node, x, y }) => (
              <TreeNodeCircle
                key={node.id}
                node={node}
                x={x}
                y={y}
                visualState={nodeStates?.get(node.id) ?? "idle"}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Status overlay */}
        {!isEmpty && (
          <div className="absolute top-4 left-4 flex items-center gap-3">
            <span className="text-muted text-xs">
              Depth: {Math.max(...positionedNodes.map((n) => n.depth))}
            </span>
          </div>
        )}

        {/* Traversal Output Display */}
        {hasTraversalOutput && (
          <div className="absolute right-4 bottom-4 left-4">
            <TraversalOutputDisplay output={traversalOutput} />
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Edge line connecting parent to child node.
 */
interface TreeEdgeProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

const TreeEdge = memo(function TreeEdge({ x1, y1, x2, y2 }: TreeEdgeProps) {
  return (
    <motion.line
      x1={`${x1}%`}
      y1={`${y1}%`}
      x2={`${x2}%`}
      y2={`${y2}%`}
      stroke="currentColor"
      strokeWidth={2}
      className="text-border"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    />
  );
});

/**
 * Visual state styling for tree nodes.
 */
const NODE_STATE_STYLES: Record<TreeNodeState, { border: string; shadow: string; bg?: string }> = {
  idle: {
    border: "border-emerald-500/50",
    shadow: "shadow-emerald-500/10",
  },
  comparing: {
    border: "border-amber-400",
    shadow: "shadow-amber-400/30",
    bg: "bg-amber-500/10",
  },
  visiting: {
    border: "border-cyan-400",
    shadow: "shadow-cyan-400/30",
    bg: "bg-cyan-500/10",
  },
  found: {
    border: "border-emerald-400",
    shadow: "shadow-emerald-400/40",
    bg: "bg-emerald-500/20",
  },
  "not-found": {
    border: "border-rose-400",
    shadow: "shadow-rose-400/30",
    bg: "bg-rose-500/10",
  },
  inserting: {
    border: "border-violet-400",
    shadow: "shadow-violet-400/30",
    bg: "bg-violet-500/10",
  },
  deleting: {
    border: "border-rose-400",
    shadow: "shadow-rose-400/30",
    bg: "bg-rose-500/10",
  },
  traversed: {
    border: "border-orange-400",
    shadow: "shadow-orange-400/30",
    bg: "bg-orange-500/10",
  },
};

/**
 * Animated circular node with value and visual state.
 */
interface TreeNodeCircleProps {
  node: TreeNode;
  x: number;
  y: number;
  visualState: TreeNodeState;
}

const TreeNodeCircle = memo(
  function TreeNodeCircle({ node, x, y, visualState }: TreeNodeCircleProps) {
    const styles = NODE_STATE_STYLES[visualState];

    return (
      <motion.div
        layout
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: visualState === "comparing" || visualState === "visiting" ? 1.1 : 1,
          opacity: 1,
        }}
        exit={{ scale: 0, opacity: 0 }}
        transition={SPRING_PRESETS.snappy}
        style={{
          left: `${x}%`,
          top: `${y}%`,
          width: LAYOUT.NODE_SIZE,
          height: LAYOUT.NODE_SIZE,
        }}
        className={cn(
          "absolute flex items-center justify-center",
          "rounded-full border-2",
          "bg-surface-elevated shadow-lg",
          "-translate-x-1/2 -translate-y-1/2",
          "transition-colors duration-200",
          styles.border,
          styles.shadow,
          styles.bg
        )}
        role="img"
        aria-label={`Node with value ${node.value}, state: ${visualState}`}
      >
        <span className="text-primary text-sm font-semibold tabular-nums">{node.value}</span>
      </motion.div>
    );
  },
  (prev, next) =>
    prev.node.id === next.node.id &&
    prev.node.value === next.node.value &&
    prev.x === next.x &&
    prev.y === next.y &&
    prev.visualState === next.visualState
);

/**
 * Hint displayed when the tree is empty.
 */
function EmptyTreeHint() {
  return (
    <div className="flex h-full items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <div className="text-muted mb-2 text-4xl">🌳</div>
        <p className="text-muted text-sm">Tree is empty</p>
        <p className="text-muted/60 mt-1 text-xs">Use the controls to insert nodes</p>
      </motion.div>
    </div>
  );
}

/**
 * Returns a human-readable label for the tree algorithm.
 */
function getAlgorithmLabel(algo: string): string {
  switch (algo) {
    case "insert":
      return "Insert";
    case "search":
      return "Search";
    case "delete":
      return "Delete";
    case "inorder":
      return "In-Order";
    case "preorder":
      return "Pre-Order";
    case "postorder":
      return "Post-Order";
    case "bfs":
      return "Level-Order";
    default:
      return algo;
  }
}

/**
 * Displays the traversal output sequence.
 */
interface TraversalOutputDisplayProps {
  output: TraversalOutput[];
}

function TraversalOutputDisplay({ output }: TraversalOutputDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm", "px-4 py-3")}
    >
      <div className="text-muted mb-2 text-xs font-medium uppercase tracking-wider">
        Traversal Output
      </div>
      <div className="flex flex-wrap gap-2">
        <AnimatePresence mode="popLayout">
          {output.map((item) => (
            <motion.span
              key={`output-${item.order}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={SPRING_PRESETS.snappy}
              className={cn(
                "inline-flex h-8 w-8 items-center justify-center",
                "rounded-full border border-orange-400/50 bg-orange-500/10",
                "text-sm font-semibold tabular-nums text-orange-400"
              )}
            >
              {item.value}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
