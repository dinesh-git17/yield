"use client";

import { motion } from "framer-motion";
import { memo } from "react";
import type { GraphEdgeState } from "@/features/visualizer/context";
import type { GraphEdge as GraphEdgeType, GraphNode } from "@/lib/store";
import { cn } from "@/lib/utils";

/**
 * Visual state styling for graph edges.
 */
const EDGE_STATE_STYLES: Record<
  GraphEdgeState,
  { stroke: string; strokeWidth: number; opacity?: number }
> = {
  idle: {
    stroke: "stroke-border",
    strokeWidth: 2,
  },
  considering: {
    stroke: "stroke-amber-400",
    strokeWidth: 3,
  },
  "in-mst": {
    stroke: "stroke-emerald-400",
    strokeWidth: 3,
  },
  rejected: {
    stroke: "stroke-rose-400/40",
    strokeWidth: 2,
  },
  highlighted: {
    stroke: "stroke-cyan-400",
    strokeWidth: 3,
  },
  // Topological sort: edge has been "removed" (neighbor's indegree decremented)
  processed: {
    stroke: "stroke-border",
    strokeWidth: 2,
    opacity: 0.3,
  },
};

export interface GraphEdgeComponentProps {
  edge: GraphEdgeType;
  sourceNode: GraphNode;
  targetNode: GraphNode;
  visualState: GraphEdgeState;
  isDirected: boolean;
  showWeight?: boolean;
}

/**
 * Node radius in percentage terms (for calculating arrow endpoints).
 * This should be half the node diameter as a percentage of parent width.
 */
const NODE_RADIUS_PERCENT = 1.5;

/**
 * Calculates the intersection point of a line with a circle.
 * Used to position arrow endpoints at the edge of nodes.
 */
function getEdgeEndpoint(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  radiusPercent: number
): { x: number; y: number } {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.sqrt(dx * dx + dy * dy);

  if (length === 0) return { x: x2, y: y2 };

  // Normalize and scale by radius
  const scale = radiusPercent / length;
  return {
    x: x2 - dx * scale,
    y: y2 - dy * scale,
  };
}

/**
 * GraphEdge — SVG edge component for the graph visualizer.
 *
 * Renders a line or arrow connecting two nodes with:
 * - Visual state styling based on algorithm execution
 * - Optional weight label at midpoint
 * - Arrow marker for directed edges
 */
export const GraphEdgeComponent = memo(
  function GraphEdgeComponent({
    edge,
    sourceNode,
    targetNode,
    visualState,
    isDirected,
    showWeight = true,
  }: GraphEdgeComponentProps) {
    const styles = EDGE_STATE_STYLES[visualState];

    // Calculate edge endpoint (for directed edges, stop at node boundary)
    const endpoint = isDirected
      ? getEdgeEndpoint(sourceNode.x, sourceNode.y, targetNode.x, targetNode.y, NODE_RADIUS_PERCENT)
      : { x: targetNode.x, y: targetNode.y };

    // Midpoint for weight label
    const midX = (sourceNode.x + targetNode.x) / 2;
    const midY = (sourceNode.y + targetNode.y) / 2;

    // Generate unique marker ID for this edge
    const markerId = `arrow-${edge.id}`;

    return (
      <g aria-label={`Edge from ${sourceNode.label} to ${targetNode.label}, weight ${edge.weight}`}>
        {/* Arrow marker definition for directed edges */}
        {isDirected && (
          <defs>
            <marker
              id={markerId}
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
              className={styles.stroke}
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" className={styles.stroke} />
            </marker>
          </defs>
        )}

        {/* Edge line */}
        <motion.line
          x1={`${sourceNode.x}%`}
          y1={`${sourceNode.y}%`}
          x2={`${endpoint.x}%`}
          y2={`${endpoint.y}%`}
          strokeWidth={styles.strokeWidth}
          className={cn("transition-colors duration-200", styles.stroke)}
          markerEnd={isDirected ? `url(#${markerId})` : undefined}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: styles.opacity ?? 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />

        {/* Weight label background */}
        {showWeight && edge.weight > 0 && (
          <>
            <motion.circle
              cx={`${midX}%`}
              cy={`${midY}%`}
              r="12"
              className="fill-surface-elevated stroke-border"
              strokeWidth={1}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.2, delay: 0.1 }}
            />
            <motion.text
              x={`${midX}%`}
              y={`${midY}%`}
              textAnchor="middle"
              dominantBaseline="central"
              className="fill-primary text-[10px] font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, delay: 0.15 }}
            >
              {edge.weight}
            </motion.text>
          </>
        )}
      </g>
    );
  },
  (prev, next) =>
    prev.edge.id === next.edge.id &&
    prev.edge.weight === next.edge.weight &&
    prev.sourceNode.x === next.sourceNode.x &&
    prev.sourceNode.y === next.sourceNode.y &&
    prev.targetNode.x === next.targetNode.x &&
    prev.targetNode.y === next.targetNode.y &&
    prev.visualState === next.visualState &&
    prev.isDirected === next.isDirected &&
    prev.showWeight === next.showWeight
);

/**
 * Temporary edge shown while drawing a new connection.
 */
export interface DrawingEdgeProps {
  sourceNode: GraphNode;
  mouseX: number;
  mouseY: number;
}

export function DrawingEdge({ sourceNode, mouseX, mouseY }: DrawingEdgeProps) {
  return (
    <line
      x1={`${sourceNode.x}%`}
      y1={`${sourceNode.y}%`}
      x2={`${mouseX}%`}
      y2={`${mouseY}%`}
      strokeWidth={2}
      strokeDasharray="4 4"
      className="stroke-cyan-400/60"
    />
  );
}
