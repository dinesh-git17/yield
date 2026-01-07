"use client";

import { AnimatePresence, motion } from "framer-motion";
import { memo, useMemo } from "react";
import type { RainWaterBarState } from "@/features/algorithms/hooks";
import { INTERVIEW_CONFIG } from "@/features/algorithms/interview/config";
import { SPRING_PRESETS } from "@/lib/motion";

export interface RainWaterBarProps {
  /** The terrain height value (0 to MAX_HEIGHT) */
  height: number;
  /** Zero-based index position in the array */
  index: number;
  /** Water level at this position (0 to height difference) */
  waterLevel: number;
  /** Current visual state of the bar */
  state: RainWaterBarState;
  /** Maximum height for scaling (usually INTERVIEW_CONFIG.MAX_HEIGHT) */
  maxHeight?: number;
  /** Current animation speed in ms */
  speed?: number;
}

const STATE_LABELS: Record<RainWaterBarState, string> = {
  idle: "",
  "left-pointer": "Left pointer (L)",
  "right-pointer": "Right pointer (R)",
  "left-max": "Maximum left height",
  "right-max": "Maximum right height",
  filling: "Trapping water",
  complete: "Complete",
  // Histogram states
  "in-stack": "In stack",
  current: "Current position",
  popped: "Popped from stack",
  "calculating-area": "Calculating area",
  "max-rectangle": "Maximum rectangle",
};

/**
 * Color palette for the bar states.
 * Rain Water: Left side uses warm colors (Amber/Orange), right side uses cool colors (Rose/Pink).
 * Histogram: Uses a distinct blue/red/violet/emerald palette.
 */
const TERRAIN_COLORS: Record<RainWaterBarState, string> = {
  idle: "#71717a", // Zinc-500
  // Rain Water states
  "left-pointer": "#f59e0b", // Amber-500
  "right-pointer": "#f43f5e", // Rose-500
  "left-max": "#d97706", // Amber-600 (darker for max)
  "right-max": "#e11d48", // Rose-600 (darker for max)
  filling: "#a78bfa", // Violet-400 (during fill animation)
  complete: "#10b981", // Emerald-500
  // Histogram states
  "in-stack": "#3b82f6", // Blue-500 (bars on monotonic stack)
  current: "#f59e0b", // Amber-500 (current iterator position)
  popped: "#ef4444", // Red-500 (bar being popped - determines rectangle height)
  "calculating-area": "#8b5cf6", // Violet-500 (bars within calculated rectangle)
  "max-rectangle": "#10b981", // Emerald-500 (bars in maximum rectangle)
};

/** Semi-transparent blue for water */
const WATER_COLOR = "rgba(56, 189, 248, 0.7)"; // Sky-400 at 70% opacity

/**
 * Box shadow styles for different states.
 * Distinct glow effects enhance accessibility and visual clarity.
 */
const POINTER_GLOW_LEFT = "0 0 12px 3px rgba(245, 158, 11, 0.5)";
const POINTER_GLOW_RIGHT = "0 0 12px 3px rgba(244, 63, 94, 0.5)";
const WATER_GLOW = "0 0 8px 2px rgba(56, 189, 248, 0.4)";
const COMPLETE_GLOW = "0 0 12px 3px rgba(16, 185, 129, 0.5)";

// Histogram-specific glow effects
const STACK_GLOW = "0 0 8px 2px rgba(59, 130, 246, 0.5)"; // Blue glow for stack
const CURRENT_GLOW = "0 0 12px 3px rgba(245, 158, 11, 0.5)"; // Amber glow for current
const POPPED_GLOW = "0 0 14px 4px rgba(239, 68, 68, 0.6)"; // Red glow for popped
const CALCULATING_GLOW = "0 0 10px 3px rgba(139, 92, 246, 0.5)"; // Violet glow
const MAX_RECT_GLOW = "0 0 12px 3px rgba(16, 185, 129, 0.5)"; // Emerald glow

const COLOR_TRANSITION_DURATION = 0.15;
const FAST_SPEED_THRESHOLD = 300;

function RainWaterBarComponent({
  height,
  index,
  waterLevel,
  state,
  maxHeight = INTERVIEW_CONFIG.MAX_HEIGHT,
  speed = 400,
}: RainWaterBarProps) {
  const stateLabel = STATE_LABELS[state];
  const ariaLabel = useMemo(() => {
    const base = `Index ${index}, Height ${height}`;
    if (waterLevel > 0) {
      return stateLabel
        ? `${base}, Water ${waterLevel}, ${stateLabel}`
        : `${base}, Water ${waterLevel}`;
    }
    return stateLabel ? `${base}, ${stateLabel}` : base;
  }, [index, height, waterLevel, stateLabel]);

  // Rain Water states
  const isPointer = state === "left-pointer" || state === "right-pointer";
  const isMax = state === "left-max" || state === "right-max";
  const isFilling = state === "filling";
  const isComplete = state === "complete";

  // Histogram states
  const isInStack = state === "in-stack";
  const isCurrent = state === "current";
  const isPopped = state === "popped";
  const isCalculatingArea = state === "calculating-area";
  const isMaxRectangle = state === "max-rectangle";

  const isActive = isPointer || isMax || isFilling || isInStack || isCurrent || isPopped;
  const isFastMode = speed < FAST_SPEED_THRESHOLD;

  // Calculate heights as percentages of container
  // Total height = terrain height + water level
  const terrainHeightPercent = (height / maxHeight) * 100;
  const waterHeightPercent = (waterLevel / maxHeight) * 100;
  const totalHeightPercent = terrainHeightPercent + waterHeightPercent;

  const terrainAnimateProps = useMemo(() => {
    // Scale and lift for emphasized states
    let scaleX = 1;
    let y = 0;

    // Rain Water pointer states
    if (isPointer) {
      scaleX = 1.2;
      y = -4;
    } else if (isMax) {
      scaleX = 1.1;
      y = -2;
    }
    // Histogram states
    else if (isPopped) {
      scaleX = 1.25;
      y = -6;
    } else if (isCurrent) {
      scaleX = 1.15;
      y = -3;
    } else if (isInStack) {
      scaleX = 1.05;
      y = -1;
    } else if (isCalculatingArea || isMaxRectangle) {
      scaleX = 1.08;
      y = -2;
    }

    return {
      backgroundColor: TERRAIN_COLORS[state],
      scaleX,
      y,
    };
  }, [state, isPointer, isMax, isPopped, isCurrent, isInStack, isCalculatingArea, isMaxRectangle]);

  const transitionProps = useMemo(() => {
    const springTransition = { ...SPRING_PRESETS.layout };
    return {
      backgroundColor: { duration: COLOR_TRANSITION_DURATION },
      scaleX: springTransition,
      y: springTransition,
      height: isFastMode ? { duration: 0.1 } : springTransition,
    };
  }, [isFastMode]);

  const boxShadow = useMemo(() => {
    // Rain Water states
    if (state === "left-pointer" || state === "left-max") return POINTER_GLOW_LEFT;
    if (state === "right-pointer" || state === "right-max") return POINTER_GLOW_RIGHT;
    if (isFilling) return WATER_GLOW;
    if (isComplete) return COMPLETE_GLOW;
    // Histogram states
    if (isPopped) return POPPED_GLOW;
    if (isCurrent) return CURRENT_GLOW;
    if (isInStack) return STACK_GLOW;
    if (isCalculatingArea) return CALCULATING_GLOW;
    if (isMaxRectangle) return MAX_RECT_GLOW;
    return "none";
  }, [
    state,
    isFilling,
    isComplete,
    isPopped,
    isCurrent,
    isInStack,
    isCalculatingArea,
    isMaxRectangle,
  ]);

  // Determine pointer/indicator label to show above the bar
  const indicatorLabel = useMemo(() => {
    if (state === "left-pointer") return "L";
    if (state === "right-pointer") return "R";
    if (isCurrent) return "i"; // Current iterator index
    if (isPopped) return "H"; // Height bar (popped)
    return null;
  }, [state, isCurrent, isPopped]);

  const indicatorColor = useMemo(() => {
    if (state === "left-pointer") return TERRAIN_COLORS["left-pointer"];
    if (state === "right-pointer") return TERRAIN_COLORS["right-pointer"];
    if (isCurrent) return TERRAIN_COLORS.current;
    if (isPopped) return TERRAIN_COLORS.popped;
    return undefined;
  }, [state, isCurrent, isPopped]);

  // Stack indicator (small dot) for bars in the stack
  const showStackIndicator = isInStack && !isCurrent && !isPopped;

  // Calculate z-index for layering
  const zIndex = useMemo(() => {
    if (isPopped) return 25;
    if (isPointer || isCurrent) return 20;
    if (isMax) return 15;
    if (isInStack || isCalculatingArea || isMaxRectangle) return 12;
    if (isActive) return 10;
    return 1;
  }, [
    isPopped,
    isPointer,
    isCurrent,
    isMax,
    isInStack,
    isCalculatingArea,
    isMaxRectangle,
    isActive,
  ]);

  return (
    <div
      className="relative flex h-full flex-1 flex-col items-center justify-end"
      style={{ minWidth: "20px", maxWidth: "48px" }}
    >
      {/* Indicator Label Above Bar (L/R for pointers, i for current, H for popped) */}
      <AnimatePresence mode="wait">
        {indicatorLabel && (
          <motion.span
            key={indicatorLabel}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute -top-6 text-xs font-bold"
            style={{ color: indicatorColor }}
          >
            {indicatorLabel}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Stack Indicator (small dot below the indicator) for in-stack bars */}
      <AnimatePresence>
        {showStackIndicator && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute -top-4 h-2 w-2 rounded-full"
            style={{ backgroundColor: TERRAIN_COLORS["in-stack"] }}
          />
        )}
      </AnimatePresence>

      {/* Bar Container - holds both terrain and water */}
      <div
        className="relative flex w-full flex-col items-stretch"
        style={{ height: `${totalHeightPercent}%` }}
        role="img"
        aria-label={ariaLabel}
      >
        {/* Water Layer - rendered above terrain */}
        <AnimatePresence>
          {waterLevel > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: `${(waterHeightPercent / totalHeightPercent) * 100}%`,
                opacity: 1,
              }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                height: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.15 },
              }}
              className="w-full rounded-t-sm"
              style={{
                backgroundColor: WATER_COLOR,
                boxShadow: isFilling ? WATER_GLOW : "none",
              }}
            />
          )}
        </AnimatePresence>

        {/* Terrain Layer */}
        <motion.div
          animate={terrainAnimateProps}
          transition={transitionProps}
          className="w-full rounded-t-md"
          style={{
            height:
              waterLevel > 0 ? `${(terrainHeightPercent / totalHeightPercent) * 100}%` : "100%",
            boxShadow,
            zIndex,
            // Add border for stack bars to distinguish them
            border: isInStack ? "2px solid rgba(59, 130, 246, 0.8)" : "none",
          }}
        />
      </div>

      {/* Index Label Below Bar */}
      <span className="text-muted mt-1 text-xs tabular-nums">{index}</span>
    </div>
  );
}

export const RainWaterBar = memo(RainWaterBarComponent);
