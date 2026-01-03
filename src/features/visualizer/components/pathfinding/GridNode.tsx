"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";

/**
 * Visual states for a grid node.
 * Used for both interaction states and algorithm visualization.
 */
export type NodeState = "empty" | "wall" | "start" | "end" | "visited" | "path" | "current";

export interface GridNodeProps {
  row: number;
  col: number;
  state: NodeState;
  onMouseDown: (row: number, col: number) => void;
  onMouseEnter: (row: number, col: number) => void;
  onMouseUp: () => void;
}

/**
 * Single grid cell for pathfinding visualization.
 * Memoized to prevent unnecessary re-renders during high-frequency updates.
 *
 * Performance: With 1000+ nodes, memoization is critical.
 * Only re-renders when state, row, or col changes.
 */
export const GridNode = memo(
  function GridNode({ row, col, state, onMouseDown, onMouseEnter, onMouseUp }: GridNodeProps) {
    return (
      // biome-ignore lint/a11y/useSemanticElements: Grid nodes are visual cells for drag-painting, not semantic buttons
      <div
        className={cn(
          "h-6 w-6 shrink-0 border border-border/30 transition-colors duration-75",
          "cursor-pointer select-none",
          // Empty state
          state === "empty" && "bg-surface hover:bg-surface-elevated",
          // Wall state
          state === "wall" && "bg-slate-700 border-slate-600",
          // Start node - emerald green
          state === "start" &&
            "bg-emerald-500 border-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]",
          // End node - rose red
          state === "end" && "bg-rose-500 border-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.5)]",
          // Visited state - algorithm exploration
          state === "visited" && "bg-cyan-500/40 border-cyan-400/50",
          // Path state - final route
          state === "path" && "bg-amber-400 border-amber-300 shadow-[0_0_6px_rgba(251,191,36,0.5)]",
          // Current state - algorithm focus
          state === "current" && "bg-violet-500 border-violet-400"
        )}
        role="button"
        tabIndex={-1}
        aria-label={getAriaLabel(state, row, col)}
        data-row={row}
        data-col={col}
        onMouseDown={() => onMouseDown(row, col)}
        onMouseEnter={() => onMouseEnter(row, col)}
        onMouseUp={onMouseUp}
      />
    );
  },
  // Custom comparison for memoization
  (prevProps, nextProps) =>
    prevProps.state === nextProps.state &&
    prevProps.row === nextProps.row &&
    prevProps.col === nextProps.col
);

function getAriaLabel(state: NodeState, row: number, col: number): string {
  const position = `Row ${row + 1}, Column ${col + 1}`;
  switch (state) {
    case "start":
      return `Start node at ${position}`;
    case "end":
      return `End node at ${position}`;
    case "wall":
      return `Wall at ${position}`;
    case "visited":
      return `Visited node at ${position}`;
    case "path":
      return `Path node at ${position}`;
    case "current":
      return `Current node at ${position}`;
    default:
      return `Empty cell at ${position}`;
  }
}
