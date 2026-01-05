"use client";

import { motion } from "framer-motion";
import { memo } from "react";
import type { GraphNodeState } from "@/features/visualizer/context";
import { SPRING_PRESETS } from "@/lib/motion";
import type { GraphNode as GraphNodeType } from "@/lib/store";
import { cn } from "@/lib/utils";

/**
 * Layout constants for graph node sizing.
 */
const LAYOUT = {
  /** Node diameter in pixels */
  NODE_SIZE: 48,
} as const;

/**
 * Visual state styling for graph nodes.
 */
const NODE_STATE_STYLES: Record<GraphNodeState, { border: string; shadow: string; bg?: string }> = {
  idle: {
    border: "border-violet-500/50",
    shadow: "shadow-violet-500/10",
  },
  selected: {
    border: "border-amber-400",
    shadow: "shadow-amber-400/40",
    bg: "bg-amber-500/10",
  },
  visiting: {
    border: "border-cyan-400",
    shadow: "shadow-cyan-400/30",
    bg: "bg-cyan-500/10",
  },
  visited: {
    border: "border-indigo-400",
    shadow: "shadow-indigo-400/30",
    bg: "bg-indigo-500/10",
  },
  "in-mst": {
    border: "border-emerald-400",
    shadow: "shadow-emerald-400/40",
    bg: "bg-emerald-500/20",
  },
  processing: {
    border: "border-fuchsia-400",
    shadow: "shadow-fuchsia-400/30",
    bg: "bg-fuchsia-500/10",
  },
  source: {
    border: "border-rose-400",
    shadow: "shadow-rose-400/40",
    bg: "bg-rose-500/20",
  },
  current: {
    border: "border-sky-400",
    shadow: "shadow-sky-400/40",
    bg: "bg-sky-500/20",
  },
  // Topological sort states
  queued: {
    border: "border-orange-400",
    shadow: "shadow-orange-400/30",
    bg: "bg-orange-500/10",
  },
  "in-order": {
    border: "border-emerald-400",
    shadow: "shadow-emerald-400/40",
    bg: "bg-emerald-500/20",
  },
};

export interface GraphNodeComponentProps {
  node: GraphNodeType;
  visualState: GraphNodeState;
  isConnecting?: boolean | undefined;
  /** Set ID for Union-Find visualization (Kruskal's algorithm) */
  setId?: number | undefined;
  /** Custom set color for Union-Find visualization */
  setColor?: string | undefined;
  /** Indegree count for Kahn's algorithm visualization */
  indegree?: number | undefined;
  onMouseDown?: ((e: React.MouseEvent) => void) | undefined;
  onMouseUp?: ((e: React.MouseEvent) => void) | undefined;
  onMouseEnter?: (() => void) | undefined;
  onDoubleClick?: (() => void) | undefined;
}

/**
 * GraphNode — Draggable node component for the graph visualizer.
 *
 * Renders a circular node with:
 * - Label display (A, B, C, etc.)
 * - Visual state styling based on algorithm execution
 * - Drag interaction for repositioning
 * - Connection point for edge creation
 */
export const GraphNodeComponent = memo(
  function GraphNodeComponent({
    node,
    visualState,
    isConnecting = false,
    setId,
    setColor,
    indegree,
    onMouseDown,
    onMouseUp,
    onMouseEnter,
    onDoubleClick,
  }: GraphNodeComponentProps) {
    const styles = NODE_STATE_STYLES[visualState];

    // Determine scale based on visual state
    const getScale = () => {
      switch (visualState) {
        case "selected":
        case "source":
        case "current":
          return 1.15;
        case "visiting":
        case "processing":
        case "queued":
          return 1.1;
        default:
          return 1;
      }
    };

    // Use set color for border if provided and in idle/processing state
    // This allows Kruskal's Union-Find visualization to show different connected components
    const showSetColor =
      setColor &&
      (visualState === "idle" || visualState === "processing" || visualState === "visiting");

    // Show indegree badge when indegree is defined and > 0, or when node is queued/in-order
    const showIndegree = indegree !== undefined;

    return (
      <motion.div
        layout
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: getScale(),
          opacity: 1,
        }}
        exit={{ scale: 0, opacity: 0 }}
        transition={SPRING_PRESETS.snappy}
        style={{
          left: `${node.x}%`,
          top: `${node.y}%`,
          width: LAYOUT.NODE_SIZE,
          height: LAYOUT.NODE_SIZE,
          ...(showSetColor
            ? {
                borderColor: setColor,
                boxShadow: `0 0 12px ${setColor}40`,
              }
            : {}),
        }}
        className={cn(
          "absolute flex items-center justify-center",
          "rounded-full border-2",
          "bg-surface-elevated shadow-lg",
          "-translate-x-1/2 -translate-y-1/2",
          "transition-colors duration-200",
          "cursor-grab active:cursor-grabbing",
          "select-none",
          // Only use class-based styles if not using set color
          !showSetColor && styles.border,
          !showSetColor && styles.shadow,
          styles.bg,
          // Highlight when connecting
          isConnecting && "ring-2 ring-cyan-400/50 ring-offset-2 ring-offset-transparent"
        )}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseEnter={onMouseEnter}
        onDoubleClick={onDoubleClick}
        role="button"
        tabIndex={0}
        aria-label={`Graph node ${node.label}, state: ${visualState}${setId !== undefined ? `, set ${setId}` : ""}${indegree !== undefined ? `, indegree ${indegree}` : ""}`}
      >
        <span className="text-primary text-sm font-semibold">{node.label}</span>

        {/* Indegree badge for topological sort visualization */}
        {showIndegree && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={cn(
              "absolute -top-1 -right-1",
              "flex items-center justify-center",
              "w-5 h-5 rounded-full",
              "text-[10px] font-bold",
              "border border-border",
              indegree === 0 ? "bg-emerald-500 text-white" : "bg-surface-elevated text-primary"
            )}
          >
            {indegree}
          </motion.div>
        )}
      </motion.div>
    );
  },
  (prev, next) =>
    prev.node.id === next.node.id &&
    prev.node.label === next.node.label &&
    prev.node.x === next.node.x &&
    prev.node.y === next.node.y &&
    prev.visualState === next.visualState &&
    prev.isConnecting === next.isConnecting &&
    prev.setId === next.setId &&
    prev.setColor === next.setColor &&
    prev.indegree === next.indegree
);
