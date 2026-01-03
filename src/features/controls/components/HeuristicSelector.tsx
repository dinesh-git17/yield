"use client";

import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { motion } from "framer-motion";
import { memo, useCallback } from "react";
import { HEURISTIC_METADATA } from "@/features/algorithms/pathfinding";
import { SPRING_PRESETS } from "@/lib/motion";
import { type HeuristicType, useYieldStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export interface HeuristicSelectorProps {
  className?: string;
}

const HEURISTIC_OPTIONS: HeuristicType[] = ["manhattan", "euclidean", "chebyshev"];

/**
 * Heuristic selector for informed search algorithms.
 * Displays as a toggle group with Manhattan, Euclidean, and Chebyshev options.
 */
export const HeuristicSelector = memo(function HeuristicSelector({
  className,
}: HeuristicSelectorProps) {
  const heuristic = useYieldStore((state) => state.pathfindingHeuristic);
  const setHeuristic = useYieldStore((state) => state.setPathfindingHeuristic);

  const handleChange = useCallback(
    (value: string) => {
      if (value) {
        setHeuristic(value as HeuristicType);
      }
    },
    [setHeuristic]
  );

  return (
    <ToggleGroup.Root
      type="single"
      value={heuristic}
      onValueChange={handleChange}
      className={cn("bg-surface flex rounded-lg p-0.5", className)}
      aria-label="Heuristic function selector"
    >
      {HEURISTIC_OPTIONS.map((option) => {
        const metadata = HEURISTIC_METADATA[option];
        return (
          <ToggleGroup.Item
            key={option}
            value={option}
            className={cn(
              "text-muted relative rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
              "focus-visible:ring-cyan-500 focus-visible:outline-none focus-visible:ring-2",
              "data-[state=on]:text-primary"
            )}
            aria-label={`Use ${metadata.label} distance heuristic`}
            title={`${metadata.label}: ${metadata.description}`}
          >
            {heuristic === option && (
              <motion.span
                layoutId="heuristic-indicator"
                className="bg-surface-elevated border-border absolute inset-0 rounded-md border shadow-sm"
                transition={SPRING_PRESETS.snappy}
              />
            )}
            <span className="relative z-10">{metadata.shortLabel}</span>
          </ToggleGroup.Item>
        );
      })}
    </ToggleGroup.Root>
  );
});
