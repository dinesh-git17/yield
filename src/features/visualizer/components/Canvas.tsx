"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play, RotateCcw, StepForward } from "lucide-react";
import { getAlgorithmMetadata } from "@/features/algorithms";
import { ControlBar } from "@/features/controls";
import { badgeVariants, buttonInteraction, SPRING_PRESETS } from "@/lib/motion";
import { useYieldStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useSorting } from "../context";
import { SortingBar } from "./SortingBar";

export interface CanvasProps {
  className?: string;
}

export function Canvas({ className }: CanvasProps) {
  const { bars, status, currentStepIndex, speed, play, pause, nextStep, reset, isReady } =
    useSorting();
  const algorithm = useYieldStore((state) => state.algorithm);
  const playbackSpeed = useYieldStore((state) => state.playbackSpeed);

  const algorithmInfo = getAlgorithmMetadata(algorithm);

  if (!isReady) {
    return (
      <div className={cn("flex h-full flex-col", className)}>
        <header className="border-border-subtle bg-surface flex h-14 shrink-0 items-center justify-between border-b px-4">
          <div className="flex items-center gap-3">
            <h1 className="text-primary text-sm font-medium">{algorithmInfo.label}</h1>
            <motion.span
              variants={badgeVariants}
              initial="hidden"
              animate="visible"
              className="bg-accent-muted text-accent rounded-full px-2 py-0.5 text-xs font-medium"
            >
              {algorithmInfo.complexity}
            </motion.span>
          </div>
        </header>
        <div className="flex flex-1 items-center justify-center">
          <div className="text-muted text-sm">Loading...</div>
        </div>
      </div>
    );
  }

  const isPlaying = status === "playing";
  const isComplete = status === "complete";

  return (
    <div className={cn("flex h-full flex-col", className)}>
      {/* Header Bar */}
      <header className="border-border-subtle bg-surface flex h-14 shrink-0 items-center justify-between border-b px-4">
        <div className="flex items-center gap-3">
          <h1 className="text-primary text-sm font-medium">{algorithmInfo.label}</h1>
          <motion.span
            key={algorithm}
            variants={badgeVariants}
            initial="hidden"
            animate="visible"
            className="bg-accent-muted text-accent rounded-full px-2 py-0.5 text-xs font-medium"
          >
            {algorithmInfo.complexity}
          </motion.span>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <ControlButton
            label="Reset"
            icon={<RotateCcw className="h-3.5 w-3.5" />}
            onClick={reset}
            disabled={status === "idle"}
          />
          <ControlButton
            label="Step"
            icon={<StepForward className="h-3.5 w-3.5" />}
            onClick={nextStep}
            disabled={isComplete}
          />
          <PlayPauseButton
            isPlaying={isPlaying}
            onClick={isPlaying ? pause : play}
            disabled={isComplete}
          />
        </div>
      </header>

      {/* Visualization Area */}
      <div className="bg-dot-pattern relative flex flex-1 items-end justify-center overflow-hidden p-8 pb-24">
        <div className="flex h-full w-full max-w-4xl items-end justify-center gap-1 border-b border-border/50">
          {bars.map((bar, index) => (
            <SortingBar
              key={bar.id}
              value={bar.value}
              index={index}
              heightPercent={bar.value}
              state={bar.state}
              isComplete={isComplete}
              speed={speed}
            />
          ))}
        </div>

        {/* Floating Control Bar */}
        <div className="absolute inset-x-0 bottom-4 flex justify-center">
          <ControlBar />
        </div>

        {/* Status Overlay */}
        <div className="absolute top-4 left-4 flex items-center gap-3">
          <span className="text-muted text-xs">
            Step: {currentStepIndex} {isComplete && "(Complete)"}
          </span>
          <span className="text-muted text-xs">Speed: {playbackSpeed}x</span>
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
        "bg-accent flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-white",
        "focus-visible:ring-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
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
      {isPlaying ? "Pause" : "Play"}
    </motion.button>
  );
}
