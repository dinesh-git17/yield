"use client";

import { memo, useMemo } from "react";
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
  /** Distance from start node for heat map visualization (0-1 normalized) */
  heatIntensity: number | undefined;
  onMouseDown: (row: number, col: number) => void;
  onMouseEnter: (row: number, col: number) => void;
  onMouseUp: () => void;
}

/**
 * Heat map color gradient from cyan (near) to indigo (far).
 * Returns HSL values for smooth gradient interpolation.
 */
function getHeatMapColor(intensity: number): string {
  // Clamp intensity to 0-1
  const t = Math.max(0, Math.min(1, intensity));

  // Gradient: Cyan (180) -> Blue (220) -> Indigo (260)
  // Near start = cyan (cool), far from start = indigo (warm)
  const hue = 180 + t * 80; // 180 to 260
  const saturation = 70 + t * 15; // 70% to 85%
  const lightness = 55 - t * 15; // 55% to 40% (darker at edges)

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

/**
 * Single grid cell for pathfinding visualization.
 * Memoized to prevent unnecessary re-renders during high-frequency updates.
 *
 * Performance: With 1000+ nodes, memoization is critical.
 * Only re-renders when state, row, col, or heatIntensity changes.
 */
export const GridNode = memo(
  function GridNode({
    row,
    col,
    state,
    heatIntensity,
    onMouseDown,
    onMouseEnter,
    onMouseUp,
  }: GridNodeProps) {
    // Compute heat map style for visited nodes
    const heatMapStyle = useMemo(() => {
      if (state !== "visited" || heatIntensity === undefined) {
        return undefined;
      }
      return {
        backgroundColor: getHeatMapColor(heatIntensity),
        borderColor: getHeatMapColor(heatIntensity * 0.8),
      };
    }, [state, heatIntensity]);

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
          // Visited state - heat map or default cyan
          state === "visited" && !heatMapStyle && "bg-cyan-500/40 border-cyan-400/50",
          // Path state - final route
          state === "path" && "bg-amber-400 border-amber-300 shadow-[0_0_6px_rgba(251,191,36,0.5)]",
          // Current state - algorithm focus
          state === "current" && "bg-violet-500 border-violet-400"
        )}
        style={heatMapStyle}
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
    prevProps.col === nextProps.col &&
    prevProps.heatIntensity === nextProps.heatIntensity
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
