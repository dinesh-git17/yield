"use client";

import { memo, useCallback, useMemo, useRef } from "react";
import type { NodeVisualization } from "@/features/algorithms/hooks";
import { coordToKey, useYieldStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { GridNode, type NodeState } from "./GridNode";

export interface GridProps {
  className?: string;
  /** Node visualization states from algorithm (includes state and optional distance) */
  visualizationState?: Map<string, NodeVisualization>;
  /** Maximum distance for normalizing heat map colors */
  maxDistance?: number;
  /** Whether the grid is locked during algorithm execution */
  isLocked?: boolean;
}

/**
 * Interaction modes for the grid.
 * - idle: No interaction in progress
 * - painting: Drawing or erasing walls
 * - dragging-start: Moving the start node
 * - dragging-end: Moving the end node
 */
type InteractionMode =
  | { type: "idle" }
  | { type: "painting"; action: "add" | "remove" }
  | { type: "dragging-start" }
  | { type: "dragging-end" };

/**
 * Interactive pathfinding grid.
 *
 * Performance optimizations:
 * - Uses flex rows instead of CSS Grid for 1000+ nodes
 * - Memoized GridNode components
 * - Refs for interaction state to avoid re-renders
 * - Single event handlers delegated to container
 */
export const Grid = memo(function Grid({
  className,
  visualizationState,
  maxDistance = 0,
  isLocked = false,
}: GridProps) {
  const gridConfig = useYieldStore((state) => state.gridConfig);
  const nodeState = useYieldStore((state) => state.nodeState);
  const setStartNode = useYieldStore((state) => state.setStartNode);
  const setEndNode = useYieldStore((state) => state.setEndNode);
  const toggleWall = useYieldStore((state) => state.toggleWall);

  // Use ref for interaction mode to avoid re-renders during drag
  const interactionModeRef = useRef<InteractionMode>({ type: "idle" });

  // Compute node states and distances for the entire grid
  const nodeData = useMemo(() => {
    const data = new Map<string, { state: NodeState; heatIntensity: number | undefined }>();
    const { rows, cols } = gridConfig;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const key = coordToKey([r, c]);

        // Check visualization state first (algorithm running)
        const vizData = visualizationState?.get(key);
        if (vizData) {
          // Calculate heat intensity for visited nodes
          const heatIntensity: number | undefined =
            vizData.state === "visited" && vizData.distance !== undefined && maxDistance > 0
              ? vizData.distance / maxDistance
              : undefined;
          data.set(key, { state: vizData.state, heatIntensity });
          continue;
        }

        // Check special nodes
        if (r === nodeState.start[0] && c === nodeState.start[1]) {
          data.set(key, { state: "start", heatIntensity: undefined });
          continue;
        }
        if (r === nodeState.end[0] && c === nodeState.end[1]) {
          data.set(key, { state: "end", heatIntensity: undefined });
          continue;
        }

        // Check walls
        if (nodeState.walls.has(key)) {
          data.set(key, { state: "wall", heatIntensity: undefined });
          continue;
        }

        data.set(key, { state: "empty", heatIntensity: undefined });
      }
    }

    return data;
  }, [gridConfig, nodeState, visualizationState, maxDistance]);

  // Extract just node states for interaction checks
  const nodeStates = useMemo(() => {
    const states = new Map<string, NodeState>();
    for (const [key, value] of nodeData) {
      states.set(key, value.state);
    }
    return states;
  }, [nodeData]);

  // Handle mouse down on a node
  const handleMouseDown = useCallback(
    (row: number, col: number) => {
      if (isLocked) return;

      const key = coordToKey([row, col]);
      const currentState = nodeStates.get(key);

      // Start dragging start node
      if (currentState === "start") {
        interactionModeRef.current = { type: "dragging-start" };
        return;
      }

      // Start dragging end node
      if (currentState === "end") {
        interactionModeRef.current = { type: "dragging-end" };
        return;
      }

      // Start painting walls
      if (currentState === "wall") {
        interactionModeRef.current = { type: "painting", action: "remove" };
        toggleWall([row, col]);
      } else if (currentState === "empty") {
        interactionModeRef.current = { type: "painting", action: "add" };
        toggleWall([row, col]);
      }
    },
    [isLocked, nodeStates, toggleWall]
  );

  // Handle mouse enter on a node (during drag)
  const handleMouseEnter = useCallback(
    (row: number, col: number) => {
      if (isLocked) return;

      const mode = interactionModeRef.current;
      const key = coordToKey([row, col]);
      const currentState = nodeStates.get(key);

      // Handle start node dragging
      if (mode.type === "dragging-start") {
        // Can't place start on wall or end
        if (currentState === "empty" || currentState === "visited" || currentState === "path") {
          setStartNode([row, col]);
        }
        return;
      }

      // Handle end node dragging
      if (mode.type === "dragging-end") {
        // Can't place end on wall or start
        if (currentState === "empty" || currentState === "visited" || currentState === "path") {
          setEndNode([row, col]);
        }
        return;
      }

      // Handle wall painting
      if (mode.type === "painting") {
        // Don't paint over start/end
        if (currentState === "start" || currentState === "end") return;

        if (mode.action === "add" && currentState === "empty") {
          toggleWall([row, col]);
        } else if (mode.action === "remove" && currentState === "wall") {
          toggleWall([row, col]);
        }
      }
    },
    [isLocked, nodeStates, setStartNode, setEndNode, toggleWall]
  );

  // Handle mouse up - end any interaction
  const handleMouseUp = useCallback(() => {
    interactionModeRef.current = { type: "idle" };
  }, []);

  // Handle mouse leave from grid - end any interaction
  const handleMouseLeave = useCallback(() => {
    interactionModeRef.current = { type: "idle" };
  }, []);

  // Build rows for flex layout
  const rows = useMemo(() => {
    const rowElements: React.ReactNode[] = [];
    const { rows: numRows, cols: numCols } = gridConfig;

    for (let r = 0; r < numRows; r++) {
      const cells: React.ReactNode[] = [];
      for (let c = 0; c < numCols; c++) {
        const key = coordToKey([r, c]);
        const data = nodeData.get(key) ?? { state: "empty" as const, heatIntensity: undefined };
        cells.push(
          <GridNode
            key={key}
            row={r}
            col={c}
            state={data.state}
            heatIntensity={data.heatIntensity}
            onMouseDown={handleMouseDown}
            onMouseEnter={handleMouseEnter}
            onMouseUp={handleMouseUp}
          />
        );
      }
      rowElements.push(
        <div key={`row-${r}`} className="flex">
          {cells}
        </div>
      );
    }

    return rowElements;
  }, [gridConfig, nodeData, handleMouseDown, handleMouseEnter, handleMouseUp]);

  return (
    <div
      className={cn(
        "inline-flex flex-col rounded-lg border border-border/50 bg-surface/50 p-1",
        "shadow-inner backdrop-blur-sm",
        isLocked && "pointer-events-none opacity-75",
        className
      )}
      role="application"
      aria-label="Pathfinding grid"
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
    >
      {rows}
    </div>
  );
});
