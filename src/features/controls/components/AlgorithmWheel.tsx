"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { memo, useCallback, useEffect, useRef } from "react";
import { ALGO_METADATA } from "@/features/algorithms";
import { type AlgorithmType, useYieldStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export interface AlgorithmWheelProps {
  className?: string;
  /** Width of each item in pixels */
  itemWidth?: number;
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

const DEFAULT_ITEM_WIDTH = 100;
const VISIBLE_ITEMS = 3;

/**
 * Gesture-driven horizontal carousel for algorithm selection.
 * Features smooth scroll snapping, edge fading, and scale effects.
 */
export const AlgorithmWheel = memo(function AlgorithmWheel({
  className,
  itemWidth = DEFAULT_ITEM_WIDTH,
}: AlgorithmWheelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentAlgorithm = useYieldStore((state) => state.algorithm);
  const setAlgorithm = useYieldStore((state) => state.setAlgorithm);

  const containerWidth = itemWidth * VISIBLE_ITEMS;

  const scrollX = useMotionValue(0);
  const smoothScrollX = useSpring(scrollX, {
    stiffness: 300,
    damping: 30,
  });

  // Scroll to algorithm on mount and when algorithm changes externally
  useEffect(() => {
    const index = ALGORITHM_ORDER.indexOf(currentAlgorithm);
    if (index !== -1 && scrollRef.current) {
      const targetScroll = index * itemWidth;
      scrollRef.current.scrollLeft = targetScroll;
      scrollX.set(targetScroll);
    }
  }, [currentAlgorithm, scrollX, itemWidth]);

  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      const newScrollX = scrollRef.current.scrollLeft;
      scrollX.set(newScrollX);

      // Determine which algorithm is centered (after snap)
      const centeredIndex = Math.round(newScrollX / itemWidth);
      const clampedIndex = Math.max(0, Math.min(centeredIndex, ALGORITHM_ORDER.length - 1));
      const centeredAlgo = ALGORITHM_ORDER[clampedIndex];

      if (centeredAlgo && centeredAlgo !== currentAlgorithm) {
        setAlgorithm(centeredAlgo);
      }
    }
  }, [scrollX, currentAlgorithm, setAlgorithm, itemWidth]);

  const scrollToIndex = useCallback(
    (index: number) => {
      if (scrollRef.current) {
        const targetScroll = index * itemWidth;
        scrollRef.current.scrollTo({
          left: targetScroll,
          behavior: "smooth",
        });
      }
    },
    [itemWidth]
  );

  const handleItemClick = useCallback(
    (algo: AlgorithmType) => {
      const index = ALGORITHM_ORDER.indexOf(algo);
      if (index !== -1) {
        scrollToIndex(index);
        setAlgorithm(algo);
      }
    },
    [scrollToIndex, setAlgorithm]
  );

  return (
    <div className={cn("relative", className)}>
      {/* Edge fade masks */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8"
        style={{
          background: "linear-gradient(to right, var(--color-surface) 0%, transparent 100%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8"
        style={{
          background: "linear-gradient(to left, var(--color-surface) 0%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* Scrollable wheel container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="scrollbar-hide flex snap-x snap-mandatory overflow-x-auto"
        style={{
          width: containerWidth,
          paddingLeft: itemWidth,
          paddingRight: itemWidth,
        }}
        role="listbox"
        aria-label="Algorithm selector"
        tabIndex={0}
      >
        {ALGORITHM_ORDER.map((algo, index) => (
          <WheelItem
            key={algo}
            algorithm={algo}
            index={index}
            itemWidth={itemWidth}
            containerWidth={containerWidth}
            scrollX={smoothScrollX}
            isActive={algo === currentAlgorithm}
            onClick={() => handleItemClick(algo)}
          />
        ))}
      </div>
    </div>
  );
});

interface WheelItemProps {
  algorithm: AlgorithmType;
  index: number;
  itemWidth: number;
  containerWidth: number;
  scrollX: ReturnType<typeof useSpring>;
  isActive: boolean;
  onClick: () => void;
}

const WheelItem = memo(function WheelItem({
  algorithm,
  index,
  itemWidth,
  containerWidth,
  scrollX,
  isActive,
  onClick,
}: WheelItemProps) {
  const metadata = ALGO_METADATA[algorithm];
  const itemCenter = index * itemWidth + itemWidth / 2;

  // Calculate distance from center of viewport
  const distance = useTransform(scrollX, (scroll) => {
    const viewportCenter = scroll + containerWidth / 2;
    return Math.abs(itemCenter - viewportCenter);
  });

  // Scale: 1.0 at center, 0.85 at edges
  const scale = useTransform(distance, [0, itemWidth], [1, 0.85]);

  // Opacity: 1.0 at center, 0.4 at edges
  const opacity = useTransform(distance, [0, itemWidth], [1, 0.4]);

  return (
    <motion.button
      type="button"
      onClick={onClick}
      style={{ scale, opacity, width: itemWidth }}
      className={cn(
        "flex shrink-0 snap-center flex-col items-center justify-center py-2",
        "cursor-pointer transition-colors focus:outline-none",
        "focus-visible:ring-accent focus-visible:ring-2 focus-visible:ring-offset-2",
        isActive && "text-accent"
      )}
      role="option"
      aria-selected={isActive}
      aria-label={`Select ${metadata.label}`}
    >
      <span
        className={cn(
          "text-sm font-medium transition-colors",
          isActive ? "text-accent" : "text-primary"
        )}
      >
        {metadata.label.replace(" Sort", "")}
      </span>
      <span
        className={cn(
          "mt-0.5 text-xs transition-colors",
          isActive ? "text-accent/70" : "text-muted"
        )}
      >
        {metadata.complexity}
      </span>
    </motion.button>
  );
});
