"use client";

import { AnimatePresence, motion } from "framer-motion";
import { memo } from "react";
import type { RectangleHighlight } from "@/features/algorithms/hooks";
import { INTERVIEW_CONFIG } from "@/features/algorithms/interview/config";
import { SPRING_PRESETS } from "@/lib/motion";

export interface AreaOverlayProps {
  /** The rectangle to highlight (or null if none) */
  rectangle: RectangleHighlight | null;
  /** Whether this is the maximum rectangle found so far */
  isMaxRectangle?: boolean;
  /** Number of bars in the visualization */
  barCount: number;
  /** Maximum bar height for scaling */
  maxHeight?: number;
}

/**
 * Semi-transparent overlay that visualizes the rectangle area being calculated.
 * Positioned absolutely over the bar visualization area.
 */
function AreaOverlayComponent({
  rectangle,
  isMaxRectangle = false,
  barCount,
  maxHeight = INTERVIEW_CONFIG.MAX_HEIGHT,
}: AreaOverlayProps) {
  if (!rectangle || barCount === 0) {
    return null;
  }

  // Calculate position and size as percentages
  // Each bar takes up 1/barCount of the width
  const barWidthPercent = 100 / barCount;
  const leftPercent = rectangle.left * barWidthPercent;
  const widthPercent = (rectangle.right - rectangle.left) * barWidthPercent;
  const heightPercent = (rectangle.height / maxHeight) * 100;

  // Colors based on whether this is the max rectangle
  const backgroundColor = isMaxRectangle
    ? "rgba(16, 185, 129, 0.25)" // Emerald with transparency
    : "rgba(139, 92, 246, 0.25)"; // Violet with transparency

  const borderColor = isMaxRectangle
    ? "rgba(16, 185, 129, 0.8)" // Emerald border
    : "rgba(139, 92, 246, 0.8)"; // Violet border

  return (
    <AnimatePresence>
      <motion.div
        key={`${rectangle.left}-${rectangle.right}-${rectangle.height}`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={SPRING_PRESETS.snappy}
        className="pointer-events-none absolute bottom-0 flex items-end justify-center"
        style={{
          left: `${leftPercent}%`,
          width: `${widthPercent}%`,
          height: "100%",
        }}
      >
        {/* The rectangle visualization */}
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: `${heightPercent}%` }}
          transition={SPRING_PRESETS.layout}
          className="w-full rounded-t-sm"
          style={{
            backgroundColor,
            border: `2px dashed ${borderColor}`,
            borderBottom: "none",
          }}
        >
          {/* Area label inside the rectangle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex h-full items-center justify-center"
          >
            <span
              className="rounded-md px-2 py-1 text-xs font-bold tabular-nums"
              style={{
                backgroundColor: isMaxRectangle
                  ? "rgba(16, 185, 129, 0.9)"
                  : "rgba(139, 92, 246, 0.9)",
                color: "white",
              }}
            >
              {rectangle.height} × {rectangle.right - rectangle.left} ={" "}
              {rectangle.height * (rectangle.right - rectangle.left)}
            </span>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export const AreaOverlay = memo(AreaOverlayComponent);
