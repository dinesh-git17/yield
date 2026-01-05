"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useYieldStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { GraphStage } from "./GraphStage";
import { PathfindingStage } from "./PathfindingStage";
import { SortingStage } from "./SortingStage";
import { TreeStage } from "./TreeStage";

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

  const renderStage = () => {
    switch (mode) {
      case "sorting":
        return (
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
        );
      case "pathfinding":
        return (
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
        );
      case "tree":
        return (
          <motion.div
            key="tree-stage"
            variants={stageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="h-full"
          >
            <TreeStage className="h-full" />
          </motion.div>
        );
      case "graph":
        return (
          <motion.div
            key="graph-stage"
            variants={stageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="h-full"
          >
            <GraphStage className="h-full" />
          </motion.div>
        );
    }
  };

  return (
    <div className={cn("relative h-full overflow-hidden", className)}>
      <AnimatePresence mode="wait" initial={false}>
        {renderStage()}
      </AnimatePresence>
    </div>
  );
}
