"use client";

import { motion } from "framer-motion";
import { memo, useMemo } from "react";
import { SPRING_PRESETS } from "@/lib/motion";

/**
 * Visual states for a sorting bar during algorithm execution.
 * - idle: Default state, not currently being operated on
 * - comparing: Currently being compared with another element
 * - swapping: Currently being swapped with another element
 * - scanning: Current minimum element being tracked (Selection Sort)
 * - sorted: Has reached its final sorted position
 */
export type BarState = "idle" | "comparing" | "swapping" | "scanning" | "sorted";

export interface SortingBarProps {
  /** The numeric value this bar represents */
  value: number;
  /** Zero-based index position in the array */
  index: number;
  /** Percentage height (0-100) relative to container */
  heightPercent: number;
  /** Current visual state of the bar */
  state: BarState;
  /** Whether the sorting is complete (for wave animation) */
  isComplete?: boolean;
  /** Current animation speed in ms (disable layout if too fast) */
  speed?: number;
}

const STATE_LABELS: Record<BarState, string> = {
  idle: "",
  comparing: "Comparing",
  swapping: "Swapping",
  scanning: "Current minimum",
  sorted: "Sorted",
};

/**
 * Hex color values for each state.
 * Must match CSS variables in globals.css for consistency.
 */
const STATE_COLORS_HEX: Record<BarState, string> = {
  idle: "#a1a1aa",
  comparing: "#f59e0b",
  swapping: "#8b5cf6",
  scanning: "#3b82f6", // Electric Blue
  sorted: "#10b981",
};

const COLOR_TRANSITION_DURATION = 0.15;
const COMPLETION_WAVE_DELAY_PER_BAR = 0.02;
const FAST_SPEED_THRESHOLD = 500;

function SortingBarComponent({
  value,
  index,
  heightPercent,
  state,
  isComplete = false,
  speed = 100,
}: SortingBarProps) {
  const stateLabel = STATE_LABELS[state];
  const ariaLabel = stateLabel
    ? `Value ${value}, Index ${index}, ${stateLabel}`
    : `Value ${value}, Index ${index}`;

  const isActive = state === "comparing" || state === "swapping" || state === "scanning";
  const isFastMode = speed < FAST_SPEED_THRESHOLD;

  const animateProps = useMemo(() => {
    return {
      backgroundColor: STATE_COLORS_HEX[state],
      scaleX: isActive ? 1.3 : 1,
      y: isActive ? -2 : 0,
      zIndex: isActive ? 10 : 1,
    };
  }, [state, isActive]);

  const transitionProps = useMemo(() => {
    const springTransition = { ...SPRING_PRESETS.layout };

    if (isComplete) {
      return {
        backgroundColor: {
          duration: COLOR_TRANSITION_DURATION,
          delay: index * COMPLETION_WAVE_DELAY_PER_BAR,
        },
        scaleX: springTransition,
        y: springTransition,
        layout: springTransition,
      };
    }

    return {
      backgroundColor: { duration: COLOR_TRANSITION_DURATION },
      scaleX: springTransition,
      y: springTransition,
      layout: isFastMode ? springTransition : { duration: 0 },
    };
  }, [isComplete, index, isFastMode]);

  return (
    <motion.div
      layout={isFastMode}
      animate={animateProps}
      transition={transitionProps}
      className="w-4 min-w-2 rounded-t-md"
      style={{
        height: `${heightPercent}%`,
        boxShadow: isActive ? "0 4px 12px rgba(0, 0, 0, 0.15)" : "none",
      }}
      role="img"
      aria-label={ariaLabel}
    />
  );
}

export const SortingBar = memo(SortingBarComponent);
