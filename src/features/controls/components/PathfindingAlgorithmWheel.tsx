"use client";

import { motion } from "framer-motion";
import { memo, useCallback } from "react";
import { PATHFINDING_ALGO_METADATA } from "@/features/algorithms/pathfinding";
import { SPRING_PRESETS } from "@/lib/motion";
import { type PathfindingAlgorithmType, useYieldStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export interface PathfindingAlgorithmWheelProps {
  className?: string;
}

/**
 * Ordered list of pathfinding algorithms for the wheel.
 */
const ALGORITHM_ORDER: PathfindingAlgorithmType[] = ["bfs", "dfs", "dijkstra", "astar"];

const ITEM_WIDTH = 72;
const CONTAINER_WIDTH = ITEM_WIDTH * 3;

/**
 * Infinite tab-style pathfinding algorithm selector.
 * Selected algorithm is always centered with neighbors on both sides.
 */
export const PathfindingAlgorithmWheel = memo(function PathfindingAlgorithmWheel({
  className,
}: PathfindingAlgorithmWheelProps) {
  const currentAlgorithm = useYieldStore((state) => state.pathfindingAlgorithm);
  const setPathfindingAlgorithm = useYieldStore((state) => state.setPathfindingAlgorithm);

  const currentIndex = ALGORITHM_ORDER.indexOf(currentAlgorithm);
  const total = ALGORITHM_ORDER.length;

  // Navigate by offset with wrapping
  const navigateByOffset = useCallback(
    (offset: number) => {
      const newIndex = (((currentIndex + offset) % total) + total) % total;
      const newAlgo = ALGORITHM_ORDER[newIndex];
      if (newAlgo) {
        setPathfindingAlgorithm(newAlgo);
      }
    },
    [currentIndex, total, setPathfindingAlgorithm]
  );

  return (
    <div
      className={cn("relative flex items-center overflow-hidden", className)}
      style={{ width: CONTAINER_WIDTH, height: 28 }}
      role="listbox"
      aria-label="Pathfinding algorithm selector"
    >
      {ALGORITHM_ORDER.map((algo, index) => {
        // Calculate position relative to current selection with wrapping
        let relativePos = index - currentIndex;

        // Handle wrapping for infinite scroll effect
        if (relativePos > total / 2) relativePos -= total;
        if (relativePos < -total / 2) relativePos += total;

        const isVisible = Math.abs(relativePos) <= 1;
        const isActive = relativePos === 0;

        return (
          <TabItem
            key={algo}
            algorithm={algo}
            relativePosition={relativePos}
            isActive={isActive}
            isVisible={isVisible}
            onClick={() => {
              if (!isActive && isVisible) {
                navigateByOffset(relativePos);
              }
            }}
          />
        );
      })}
    </div>
  );
});

interface TabItemProps {
  algorithm: PathfindingAlgorithmType;
  relativePosition: number;
  isActive: boolean;
  isVisible: boolean;
  onClick: () => void;
}

const TabItem = memo(function TabItem({
  algorithm,
  relativePosition,
  isActive,
  isVisible,
  onClick,
}: TabItemProps) {
  const metadata = PATHFINDING_ALGO_METADATA[algorithm];
  const label = metadata.shortLabel;

  // Calculate x position: center of container + relative offset
  const centerOffset = (CONTAINER_WIDTH - ITEM_WIDTH) / 2;
  const xPosition = centerOffset + relativePosition * ITEM_WIDTH;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      animate={{
        x: xPosition,
        opacity: isVisible ? (isActive ? 1 : 0.5) : 0,
      }}
      transition={SPRING_PRESETS.snappy}
      style={{ width: ITEM_WIDTH }}
      className={cn(
        "absolute left-0 top-0 flex h-full shrink-0 items-center justify-center",
        "cursor-pointer focus:outline-none",
        "focus-visible:ring-cyan-500 focus-visible:ring-2 focus-visible:ring-offset-2",
        !isActive && isVisible && "hover:opacity-70"
      )}
      role="option"
      aria-selected={isActive}
      aria-label={`Select ${metadata.label}`}
      aria-hidden={!isVisible}
      tabIndex={isVisible ? 0 : -1}
    >
      {/* Active tab background indicator */}
      {isActive && (
        <motion.span
          layoutId="pathfinding-algorithm-tab-indicator"
          className="bg-cyan-500/15 border-cyan-500/30 absolute inset-0 rounded-md border"
          transition={SPRING_PRESETS.snappy}
        />
      )}
      <span
        className={cn(
          "relative z-10 text-xs font-medium whitespace-nowrap",
          isActive ? "text-cyan-400" : "text-muted"
        )}
      >
        {label}
      </span>
    </motion.button>
  );
});
