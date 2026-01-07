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
 * Overlay that visualizes the rectangle area being calculated.
 *
 * Positioned relative to the bar wrapper container (not the full stage).
 * Uses percentage-based positioning that aligns with flex-distributed bars.
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

  const rectWidth = rectangle.right - rectangle.left;
  const heightPercent = (rectangle.height / maxHeight) * 100;
  const area = rectangle.height * rectWidth;

  // Simple percentage-based positioning
  // Bars are flex-1, so each takes equal width (gaps are handled by the flex container)
  const barSlotPercent = 100 / barCount;
  const leftPercent = rectangle.left * barSlotPercent;
  const widthPercent = rectWidth * barSlotPercent;
  const centerPercent = leftPercent + widthPercent / 2;

  // Colors
  const borderColor = isMaxRectangle ? "rgba(16, 185, 129, 0.8)" : "rgba(139, 92, 246, 0.8)";
  const labelBgColor = isMaxRectangle ? "rgb(16, 185, 129)" : "rgb(139, 92, 246)";

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`overlay-${rectangle.left}-${rectangle.right}-${rectangle.height}-${isMaxRectangle}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="pointer-events-none absolute inset-0"
      >
        {/* Dashed border rectangle */}
        <motion.div
          initial={{ opacity: 0, scaleY: 0.8 }}
          animate={{ opacity: 1, scaleY: 1 }}
          transition={SPRING_PRESETS.snappy}
          className="absolute origin-bottom"
          style={{
            left: `${leftPercent}%`,
            width: `${widthPercent}%`,
            height: `${heightPercent}%`,
            bottom: "1.25rem", // Account for index labels (mt-1 + text height)
            border: `2px dashed ${borderColor}`,
            borderBottom: "none",
            borderRadius: "4px 4px 0 0",
          }}
        />

        {/* Floating label - positioned above the rectangle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05, duration: 0.15 }}
          className="absolute"
          style={{
            left: `${centerPercent}%`,
            // Position above the rectangle top edge
            bottom: `calc(${heightPercent}% + 1.25rem + 0.5rem)`,
            transform: "translateX(-50%)",
            zIndex: 50,
          }}
        >
          <span
            className="whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-bold tabular-nums shadow-lg"
            style={{
              backgroundColor: labelBgColor,
              color: "white",
            }}
          >
            {rectangle.height} × {rectWidth} = {area}
          </span>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export const AreaOverlay = memo(AreaOverlayComponent);
