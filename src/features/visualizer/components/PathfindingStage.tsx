"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  Pause,
  Play,
  RotateCcw,
  SkipForward,
  Trash2,
} from "lucide-react";
import { useCallback } from "react";
import { useMazeGenerator } from "@/features/algorithms/hooks";
import type { MazeAlgorithmType } from "@/features/algorithms/maze";
import { getPathfindingAlgorithmMetadata } from "@/features/algorithms/pathfinding";
import { GenerateDropdown, PathfindingControlBar } from "@/features/controls";
import { badgeVariants, buttonInteraction, SPRING_PRESETS } from "@/lib/motion";
import { type PathfindingAlgorithmType, useYieldStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { usePathfinding } from "../context";
import { Grid } from "./pathfinding";

export interface PathfindingStageProps {
  className?: string;
}

/**
 * Pathfinding visualization stage.
 * Renders the interactive grid, playback controls, and algorithm info.
 */
export function PathfindingStage({ className }: PathfindingStageProps) {
  const pathfindingAlgorithm = useYieldStore((state) => state.pathfindingAlgorithm);
  const gridConfig = useYieldStore((state) => state.gridConfig);
  const clearWalls = useYieldStore((state) => state.clearWalls);
  const resetNodeState = useYieldStore((state) => state.resetNodeState);
  const isGeneratingMaze = useYieldStore((state) => state.isGeneratingMaze);

  // Use the pathfinding controller from context
  const controller = usePathfinding();

  // Use the maze generator
  const mazeGenerator = useMazeGenerator();

  // Get algorithm metadata
  const metadata = getPathfindingAlgorithmMetadata(pathfindingAlgorithm);

  const handleClearWalls = useCallback(() => {
    controller.reset();
    clearWalls();
  }, [controller, clearWalls]);

  const handleResetAll = useCallback(() => {
    controller.reset();
    resetNodeState();
  }, [controller, resetNodeState]);

  const handleGenerate = useCallback(
    (algorithm: MazeAlgorithmType) => {
      controller.reset();
      mazeGenerator.generate(algorithm);
    },
    [controller, mazeGenerator]
  );

  const isPlaying = controller.status === "playing";
  const isComplete = controller.status === "complete";
  const isIdle = controller.status === "idle";
  const isLocked =
    controller.status === "playing" || controller.status === "complete" || isGeneratingMaze;

  return (
    <div className={cn("flex h-full flex-col", className)}>
      {/* Header Bar */}
      <header className="border-border-subtle bg-surface flex h-14 shrink-0 items-center justify-between border-b px-4">
        <div className="flex items-center gap-3">
          <h1 className="text-primary text-sm font-medium">{metadata.label}</h1>
          <motion.span
            key={pathfindingAlgorithm}
            variants={badgeVariants}
            initial="hidden"
            animate="visible"
            className="bg-cyan-500/10 text-cyan-400 rounded-full px-2 py-0.5 text-xs font-medium"
          >
            {gridConfig.rows} x {gridConfig.cols}
          </motion.span>
          {metadata.guaranteesShortestPath && (
            <span className="text-emerald-400 text-xs">Shortest Path</span>
          )}
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <ControlButton
            label="Step"
            icon={<SkipForward className="h-3.5 w-3.5" />}
            onClick={controller.nextStep}
            disabled={isComplete || isGeneratingMaze}
          />
          <ControlButton
            label="Clear Walls"
            icon={<Trash2 className="h-3.5 w-3.5" />}
            onClick={handleClearWalls}
            disabled={isPlaying || isGeneratingMaze}
          />
          <GenerateDropdown onGenerate={handleGenerate} disabled={isPlaying || isGeneratingMaze} />
          <ControlButton
            label="Reset"
            icon={<RotateCcw className="h-3.5 w-3.5" />}
            onClick={handleResetAll}
            disabled={isIdle && !isGeneratingMaze}
          />
          <PlayPauseButton
            isPlaying={isPlaying}
            onClick={isPlaying ? controller.pause : controller.play}
            disabled={isComplete || isGeneratingMaze}
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
          <Grid
            visualizationState={controller.nodeStates}
            maxDistance={controller.maxDistance}
            isLocked={isLocked}
          />
        </motion.div>

        {/* Floating Control Bar */}
        <div className="absolute inset-x-0 bottom-16 z-30 flex justify-center">
          <PathfindingControlBar />
        </div>

        {/* Instructions Legend */}
        <div className="absolute bottom-4 left-4 flex items-center gap-4">
          <span className="text-muted text-xs">
            <span className="bg-emerald-500 mr-1.5 inline-block h-2.5 w-2.5 rounded-sm" />
            Start
          </span>
          <span className="text-muted text-xs">
            <span className="bg-rose-500 mr-1.5 inline-block h-2.5 w-2.5 rounded-sm" />
            End
          </span>
          <span className="text-muted text-xs">
            <span className="bg-slate-700 mr-1.5 inline-block h-2.5 w-2.5 rounded-sm" />
            Wall
          </span>
          <span className="text-muted text-xs">
            <span
              className="mr-1.5 inline-block h-2.5 w-2.5 rounded-sm"
              style={{
                background: "linear-gradient(to right, hsl(180, 70%, 55%), hsl(260, 85%, 40%))",
              }}
            />
            Visited (heat map)
          </span>
          <span className="text-muted text-xs">
            <span className="bg-amber-400 mr-1.5 inline-block h-2.5 w-2.5 rounded-sm" />
            Path
          </span>
        </div>

        {/* Interaction Hint */}
        <AnimatePresence>
          {isIdle && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-4 right-4"
            >
              <span className="text-muted/60 text-xs">
                Click and drag to draw walls · Drag start/end to reposition
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status Overlay */}
        <StatusOverlay
          status={controller.status}
          pathFound={controller.pathFound}
          stepCount={controller.currentStepIndex}
          algorithm={pathfindingAlgorithm}
        />
      </div>
    </div>
  );
}

interface StatusOverlayProps {
  status: "idle" | "playing" | "paused" | "complete";
  pathFound: boolean | null;
  stepCount: number;
  algorithm: PathfindingAlgorithmType;
}

function StatusOverlay({ status, pathFound, stepCount, algorithm }: StatusOverlayProps) {
  const metadata = getPathfindingAlgorithmMetadata(algorithm);

  return (
    <div className="absolute top-4 left-4 flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <span className="text-muted text-xs">
          Status: {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
        {stepCount > 0 && <span className="text-muted text-xs">Steps: {stepCount}</span>}
      </div>

      {/* Path result indicator */}
      <AnimatePresence>
        {status === "complete" && pathFound !== null && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium",
              pathFound ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
            )}
          >
            {pathFound ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" />
                Path found!
              </>
            ) : (
              <>
                <AlertCircle className="h-3.5 w-3.5" />
                No path exists
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Algorithm info */}
      <div className="flex items-center gap-2">
        <span className="text-muted/60 text-[10px]">Pattern: {metadata.visualPattern}</span>
        <span className="text-muted/60 text-[10px]">Time: {metadata.complexity}</span>
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
