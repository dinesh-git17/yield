"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useYieldStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { PathfindingStage } from "./PathfindingStage";
import { SortingStage } from "./SortingStage";

export interface CanvasProps {
  className?: string;
}

/**
 * Stage transition variants.
 * Premium feel with subtle opacity fade and vertical slide.
 */
const stageVariants = {
  initial: {
    opacity: 0,
    y: 8,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.2,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
} as const;

/**
 * Canvas — The Stage Manager.
 *
 * Smart wrapper that orchestrates which visualization stage is rendered
 * based on the current mode. Handles smooth transitions between modes
 * with AnimatePresence for a premium feel.
 */
export function Canvas({ className }: CanvasProps) {
  const mode = useYieldStore((state) => state.mode);

  return (
    <div className={cn("relative h-full overflow-hidden", className)}>
      <AnimatePresence mode="wait" initial={false}>
        {mode === "sorting" ? (
          <motion.div
            key="sorting-stage"
            variants={stageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="h-full"
          >
            <SortingStage className="h-full" />
          </motion.div>
        ) : (
          <motion.div
            key="pathfinding-stage"
            variants={stageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="h-full"
          >
            <PathfindingStage className="h-full" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
