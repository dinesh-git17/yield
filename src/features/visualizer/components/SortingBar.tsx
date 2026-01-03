"use client";

import { motion } from "framer-motion";
import { memo } from "react";
import { cn } from "@/lib/utils";

/**
 * Visual states for a sorting bar during algorithm execution.
 * - idle: Default state, not currently being operated on
 * - comparing: Currently being compared with another element
 * - swapping: Currently being swapped with another element
 * - sorted: Has reached its final sorted position
 */
export type BarState = "idle" | "comparing" | "swapping" | "sorted";

export interface SortingBarProps {
  /** The numeric value this bar represents */
  value: number;
  /** Zero-based index position in the array */
  index: number;
  /** Percentage height (0-100) relative to container */
  heightPercent: number;
  /** Current visual state of the bar */
  state: BarState;
}

const STATE_LABELS: Record<BarState, string> = {
  idle: "",
  comparing: "Comparing",
  swapping: "Swapping",
  sorted: "Sorted",
};

const STATE_COLORS: Record<BarState, string> = {
  idle: "bg-bar-idle",
  comparing: "bg-bar-comparing",
  swapping: "bg-bar-swapping",
  sorted: "bg-bar-sorted",
};

const SPRING_CONFIG = {
  type: "spring",
  stiffness: 500,
  damping: 30,
  mass: 1,
} as const;

function SortingBarComponent({ value, index, heightPercent, state }: SortingBarProps) {
  const stateLabel = STATE_LABELS[state];
  const ariaLabel = stateLabel
    ? `Value ${value}, Index ${index}, ${stateLabel}`
    : `Value ${value}, Index ${index}`;

  return (
    <motion.div
      layout
      transition={SPRING_CONFIG}
      className={cn("w-4 min-w-2 rounded-t-md", STATE_COLORS[state])}
      style={{ height: `${heightPercent}%` }}
      role="img"
      aria-label={ariaLabel}
    />
  );
}

export const SortingBar = memo(SortingBarComponent);
