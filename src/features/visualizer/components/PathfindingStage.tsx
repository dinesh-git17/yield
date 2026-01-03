"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play, RotateCcw, Trash2 } from "lucide-react";
import { useCallback, useState } from "react";
import { badgeVariants, buttonInteraction, SPRING_PRESETS } from "@/lib/motion";
import { useYieldStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Grid } from "./pathfinding";

export interface PathfindingStageProps {
  className?: string;
}

/**
 * Algorithm display labels.
 */
const ALGORITHM_LABELS: Record<string, string> = {
  bfs: "Breadth-First Search",
  dfs: "Depth-First Search",
  dijkstra: "Dijkstra's Algorithm",
  astar: "A* Search",
};

/**
 * Pathfinding visualization stage.
 * Renders the interactive grid, playback controls, and algorithm info.
 */
export function PathfindingStage({ className }: PathfindingStageProps) {
  const pathfindingAlgorithm = useYieldStore((state) => state.pathfindingAlgorithm);
  const gridConfig = useYieldStore((state) => state.gridConfig);
  const clearWalls = useYieldStore((state) => state.clearWalls);
  const resetNodeState = useYieldStore((state) => state.resetNodeState);

  // Playback state (will be connected to pathfinding controller in Story 4.4)
  const [status, setStatus] = useState<"idle" | "playing" | "paused" | "complete">("idle");

  const algorithmLabel = ALGORITHM_LABELS[pathfindingAlgorithm] ?? "Pathfinding";

  const handlePlay = useCallback(() => {
    // TODO: Implement in Story 4.4
    setStatus("playing");
  }, []);

  const handlePause = useCallback(() => {
    setStatus("paused");
  }, []);

  const handleClearWalls = useCallback(() => {
    clearWalls();
  }, [clearWalls]);

  const handleResetAll = useCallback(() => {
    setStatus("idle");
    resetNodeState();
  }, [resetNodeState]);

  const isPlaying = status === "playing";
  const isComplete = status === "complete";
  const isLocked = status === "playing";

  return (
    <div className={cn("flex h-full flex-col", className)}>
      {/* Header Bar */}
      <header className="border-border-subtle bg-surface flex h-14 shrink-0 items-center justify-between border-b px-4">
        <div className="flex items-center gap-3">
          <h1 className="text-primary text-sm font-medium">{algorithmLabel}</h1>
          <motion.span
            key={pathfindingAlgorithm}
            variants={badgeVariants}
            initial="hidden"
            animate="visible"
            className="bg-cyan-500/10 text-cyan-400 rounded-full px-2 py-0.5 text-xs font-medium"
          >
            {gridConfig.rows} x {gridConfig.cols}
          </motion.span>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <ControlButton
            label="Clear Walls"
            icon={<Trash2 className="h-3.5 w-3.5" />}
            onClick={handleClearWalls}
            disabled={isPlaying}
          />
          <ControlButton
            label="Reset"
            icon={<RotateCcw className="h-3.5 w-3.5" />}
            onClick={handleResetAll}
            disabled={status === "idle"}
          />
          <PlayPauseButton
            isPlaying={isPlaying}
            onClick={isPlaying ? handlePause : handlePlay}
            disabled={isComplete}
          />
        </div>
      </header>

      {/* Visualization Area */}
      <div className="bg-dot-pattern relative flex flex-1 items-center justify-center overflow-auto p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={SPRING_PRESETS.entrance}
        >
          <Grid isLocked={isLocked} />
        </motion.div>

        {/* Instructions Overlay */}
        <div className="absolute bottom-4 left-4 flex items-center gap-4">
          <span className="text-muted text-xs">
            <span className="bg-emerald-500 mr-1.5 inline-block h-2.5 w-2.5 rounded-sm" />
            Drag to move start
          </span>
          <span className="text-muted text-xs">
            <span className="bg-rose-500 mr-1.5 inline-block h-2.5 w-2.5 rounded-sm" />
            Drag to move end
          </span>
          <span className="text-muted text-xs">
            <span className="bg-slate-700 mr-1.5 inline-block h-2.5 w-2.5 rounded-sm" />
            Click & drag to draw walls
          </span>
        </div>

        {/* Status Overlay */}
        <div className="absolute top-4 left-4 flex items-center gap-3">
          <span className="text-muted text-xs">
            Status: {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
      </div>
    </div>
  );
}

interface ControlButtonProps {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

function ControlButton({ label, icon, onClick, disabled }: ControlButtonProps) {
  const interactionProps = disabled
    ? {}
    : { whileHover: buttonInteraction.hover, whileTap: buttonInteraction.tap };

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      {...interactionProps}
      animate={{ opacity: disabled ? 0.5 : 1 }}
      transition={SPRING_PRESETS.snappy}
      className={cn(
        "bg-surface-elevated border-border text-primary flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium",
        "focus-visible:ring-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        disabled && "cursor-not-allowed"
      )}
      aria-label={label}
    >
      {icon}
      {label}
    </motion.button>
  );
}

interface PlayPauseButtonProps {
  isPlaying: boolean;
  onClick: () => void;
  disabled?: boolean;
}

function PlayPauseButton({ isPlaying, onClick, disabled }: PlayPauseButtonProps) {
  const interactionProps = disabled
    ? {}
    : { whileHover: buttonInteraction.hover, whileTap: buttonInteraction.tap };

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      {...interactionProps}
      animate={{ opacity: disabled ? 0.5 : 1 }}
      transition={SPRING_PRESETS.snappy}
      className={cn(
        "bg-cyan-500 flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-white",
        "focus-visible:ring-cyan-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        disabled && "cursor-not-allowed"
      )}
      aria-label={isPlaying ? "Pause" : "Play"}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isPlaying ? "pause" : "play"}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="flex items-center"
        >
          {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        </motion.span>
      </AnimatePresence>
      {isPlaying ? "Pause" : "Visualize"}
    </motion.button>
  );
}
