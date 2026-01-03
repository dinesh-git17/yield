"use client";

import { motion } from "framer-motion";
import { memo, useCallback } from "react";
import { ALGO_METADATA } from "@/features/algorithms";
import { SPRING_PRESETS } from "@/lib/motion";
import { type AlgorithmType, useYieldStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export interface AlgorithmWheelProps {
  className?: string;
}

/**
 * Ordered list of algorithms for the wheel.
 * Order: O(n²) basics → O(n²) variants → O(n log n) advanced
 */
const ALGORITHM_ORDER: AlgorithmType[] = [
  "bubble",
  "selection",
  "insertion",
  "gnome",
  "quick",
  "merge",
  "heap",
];

const ITEM_WIDTH = 72;
const CONTAINER_WIDTH = ITEM_WIDTH * 3;

/**
 * Infinite tab-style algorithm selector (Apple alarm picker style).
 * Selected algorithm is always centered with neighbors on both sides.
 * Items slide into position when selection changes.
 */
export const AlgorithmWheel = memo(function AlgorithmWheel({ className }: AlgorithmWheelProps) {
  const currentAlgorithm = useYieldStore((state) => state.algorithm);
  const setAlgorithm = useYieldStore((state) => state.setAlgorithm);

  const currentIndex = ALGORITHM_ORDER.indexOf(currentAlgorithm);
  const total = ALGORITHM_ORDER.length;

  // Navigate by offset with wrapping
  const navigateByOffset = useCallback(
    (offset: number) => {
      const newIndex = (((currentIndex + offset) % total) + total) % total;
      const newAlgo = ALGORITHM_ORDER[newIndex];
      if (newAlgo) {
        setAlgorithm(newAlgo);
      }
    },
    [currentIndex, total, setAlgorithm]
  );

  return (
    <div
      className={cn("relative flex items-center overflow-hidden", className)}
      style={{ width: CONTAINER_WIDTH, height: 28 }}
      role="listbox"
      aria-label="Algorithm selector"
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
  algorithm: AlgorithmType;
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
  const metadata = ALGO_METADATA[algorithm];
  const label = metadata.label.replace(" Sort", "");

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
        "focus-visible:ring-accent focus-visible:ring-2 focus-visible:ring-offset-2",
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
          layoutId="algorithm-tab-indicator"
          className="bg-accent/15 border-accent/30 absolute inset-0 rounded-md border"
          transition={SPRING_PRESETS.snappy}
        />
      )}
      <span
        className={cn(
          "relative z-10 text-xs font-medium whitespace-nowrap",
          isActive ? "text-accent" : "text-muted"
        )}
      >
        {label}
      </span>
    </motion.button>
  );
});
