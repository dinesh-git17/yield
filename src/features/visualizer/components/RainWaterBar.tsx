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
};

/**
 * Color palette for the bar states.
 * Left side processing uses warm colors (Amber/Orange).
 * Right side processing uses cool colors (Rose/Pink).
 */
const TERRAIN_COLORS: Record<RainWaterBarState, string> = {
  idle: "#71717a", // Zinc-500
  "left-pointer": "#f59e0b", // Amber-500
  "right-pointer": "#f43f5e", // Rose-500
  "left-max": "#d97706", // Amber-600 (darker for max)
  "right-max": "#e11d48", // Rose-600 (darker for max)
  filling: "#a78bfa", // Violet-400 (during fill animation)
  complete: "#10b981", // Emerald-500
};

/** Semi-transparent blue for water */
const WATER_COLOR = "rgba(56, 189, 248, 0.7)"; // Sky-400 at 70% opacity

/**
 * Box shadow styles for different states.
 * Pointers get distinct glow effects for accessibility.
 */
const POINTER_GLOW_LEFT = "0 0 12px 3px rgba(245, 158, 11, 0.5)";
const POINTER_GLOW_RIGHT = "0 0 12px 3px rgba(244, 63, 94, 0.5)";
const WATER_GLOW = "0 0 8px 2px rgba(56, 189, 248, 0.4)";
const COMPLETE_GLOW = "0 0 12px 3px rgba(16, 185, 129, 0.5)";

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

  const isPointer = state === "left-pointer" || state === "right-pointer";
  const isMax = state === "left-max" || state === "right-max";
  const isFilling = state === "filling";
  const isComplete = state === "complete";
  const isActive = isPointer || isMax || isFilling;
  const isFastMode = speed < FAST_SPEED_THRESHOLD;

  // Calculate heights as percentages of container
  // Total height = terrain height + water level
  const terrainHeightPercent = (height / maxHeight) * 100;
  const waterHeightPercent = (waterLevel / maxHeight) * 100;
  const totalHeightPercent = terrainHeightPercent + waterHeightPercent;

  const terrainAnimateProps = useMemo(() => {
    return {
      backgroundColor: TERRAIN_COLORS[state],
      scaleX: isPointer ? 1.2 : isMax ? 1.1 : 1,
      y: isPointer ? -4 : isMax ? -2 : 0,
    };
  }, [state, isPointer, isMax]);

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
    if (state === "left-pointer" || state === "left-max") return POINTER_GLOW_LEFT;
    if (state === "right-pointer" || state === "right-max") return POINTER_GLOW_RIGHT;
    if (isFilling) return WATER_GLOW;
    if (isComplete) return COMPLETE_GLOW;
    return "none";
  }, [state, isFilling, isComplete]);

  const pointerLabel = state === "left-pointer" ? "L" : state === "right-pointer" ? "R" : null;

  return (
    <div
      className="relative flex h-full flex-1 flex-col items-center justify-end"
      style={{ minWidth: "20px", maxWidth: "48px" }}
    >
      {/* Pointer Label Above Bar */}
      <AnimatePresence mode="wait">
        {pointerLabel && (
          <motion.span
            key={pointerLabel}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute -top-6 text-xs font-bold"
            style={{
              color:
                state === "left-pointer"
                  ? TERRAIN_COLORS["left-pointer"]
                  : TERRAIN_COLORS["right-pointer"],
            }}
          >
            {pointerLabel}
          </motion.span>
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
            zIndex: isPointer ? 20 : isMax ? 15 : isActive ? 10 : 1,
          }}
        />
      </div>

      {/* Index Label Below Bar */}
      <span className="text-muted mt-1 text-xs tabular-nums">{index}</span>
    </div>
  );
}

export const RainWaterBar = memo(RainWaterBarComponent);
