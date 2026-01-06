"use client";

import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play, RotateCcw, SkipForward } from "lucide-react";
import { memo, useCallback } from "react";
import { usePathfinding } from "@/features/visualizer/context";
import { buttonInteraction, SPRING_PRESETS } from "@/lib/motion";
import { HEURISTIC_ALGORITHMS, type PlaybackSpeedMultiplier, useYieldStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { HeuristicSelector } from "./HeuristicSelector";
import { PathfindingAlgorithmWheel } from "./PathfindingAlgorithmWheel";

export interface PathfindingControlBarProps {
  className?: string;
}

const SPEED_OPTIONS: { value: PlaybackSpeedMultiplier; label: string }[] = [
  { value: 0.5, label: "0.5x" },
  { value: 1, label: "1x" },
  { value: 2, label: "2x" },
  { value: 4, label: "4x" },
];

export const PathfindingControlBar = memo(function PathfindingControlBar({
  className,
}: PathfindingControlBarProps) {
  const playbackSpeed = useYieldStore((state) => state.playbackSpeed);
  const setPlaybackSpeed = useYieldStore((state) => state.setPlaybackSpeed);
  const currentAlgorithm = useYieldStore((state) => state.pathfindingAlgorithm);
  const isGeneratingMaze = useYieldStore((state) => state.isGeneratingMaze);

  // Get controller from context for mobile playback controls
  const controller = usePathfinding();
  const isPlaying = controller.status === "playing";
  const isComplete = controller.status === "complete";
  const isIdle = controller.status === "idle";

  // Show heuristic selector only for algorithms that use heuristics
  const showHeuristicSelector = HEURISTIC_ALGORITHMS.includes(currentAlgorithm);

  const handleSpeedChange = useCallback(
    (value: string) => {
      if (value) {
        setPlaybackSpeed(Number(value) as PlaybackSpeedMultiplier);
      }
    },
    [setPlaybackSpeed]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={SPRING_PRESETS.entrance}
      className={cn(
        "bg-surface-elevated/95 border-border flex items-center gap-2 rounded-lg border px-3 py-2 shadow-lg backdrop-blur-sm md:gap-4 md:px-4",
        className
      )}
    >
      {/* Mobile Playback Controls */}
      <div className="flex items-center gap-1 md:hidden">
        <MobileControlButton
          icon={<SkipForward className="h-4 w-4" />}
          onClick={controller.nextStep}
          disabled={isComplete || isGeneratingMaze}
          aria-label="Step"
        />
        <MobileControlButton
          icon={<RotateCcw className="h-4 w-4" />}
          onClick={controller.reset}
          disabled={isIdle && !isGeneratingMaze}
          aria-label="Reset"
        />
        <MobilePlayPauseButton
          isPlaying={isPlaying}
          onClick={isPlaying ? controller.pause : controller.play}
          disabled={isComplete || isGeneratingMaze}
        />
      </div>

      <Divider className="md:hidden" />

      {/* Algorithm Wheel - Hidden on mobile (accessible via drawer) */}
      <div className="hidden md:block">
        <ControlSection label="Algorithm">
          <PathfindingAlgorithmWheel />
        </ControlSection>
      </div>

      <Divider className="hidden md:block" />

      {/* Heuristic Selector (only for A* and Greedy) - Hidden on mobile */}
      {showHeuristicSelector && (
        <div className="hidden md:flex md:items-center md:gap-4">
          <ControlSection label="Heuristic">
            <HeuristicSelector />
          </ControlSection>

          <Divider />
        </div>
      )}

      {/* Speed Toggle */}
      <ControlSection label="Speed">
        <ToggleGroup.Root
          type="single"
          value={String(playbackSpeed)}
          onValueChange={handleSpeedChange}
          className="bg-surface flex rounded-lg p-0.5"
        >
          {SPEED_OPTIONS.map((option) => (
            <ToggleGroup.Item
              key={option.value}
              value={String(option.value)}
              className={cn(
                "text-muted relative rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
                "focus-visible:ring-cyan-500 focus-visible:outline-none focus-visible:ring-2",
                "data-[state=on]:text-primary"
              )}
              aria-label={`Set speed to ${option.label}`}
            >
              {playbackSpeed === option.value && (
                <motion.span
                  layoutId="pathfinding-speed-indicator"
                  className="bg-surface-elevated border-border absolute inset-0 rounded-md border shadow-sm"
                  transition={SPRING_PRESETS.snappy}
                />
              )}
              <span className="relative z-10">{option.label}</span>
            </ToggleGroup.Item>
          ))}
        </ToggleGroup.Root>
      </ControlSection>
    </motion.div>
  );
});

interface ControlSectionProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

function ControlSection({ label, children, className }: ControlSectionProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <span className="text-muted text-[10px] font-medium uppercase tracking-wider">{label}</span>
      {children}
    </div>
  );
}

interface DividerProps {
  className?: string;
}

function Divider({ className }: DividerProps) {
  return <div className={cn("bg-border h-6 w-px", className)} />;
}

/**
 * Compact control button for mobile playback controls.
 */
interface MobileControlButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  "aria-label": string;
}

function MobileControlButton({
  icon,
  onClick,
  disabled,
  "aria-label": ariaLabel,
}: MobileControlButtonProps) {
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
        "bg-surface-elevated border-border text-primary flex h-9 w-9 items-center justify-center rounded-md border",
        "focus-visible:ring-cyan-500 focus-visible:outline-none focus-visible:ring-2",
        disabled && "cursor-not-allowed"
      )}
      aria-label={ariaLabel}
    >
      {icon}
    </motion.button>
  );
}

/**
 * Play/Pause button for mobile.
 */
interface MobilePlayPauseButtonProps {
  isPlaying: boolean;
  onClick: () => void;
  disabled?: boolean;
}

function MobilePlayPauseButton({ isPlaying, onClick, disabled }: MobilePlayPauseButtonProps) {
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
        "bg-cyan-500 flex h-9 w-9 items-center justify-center rounded-md text-white",
        "focus-visible:ring-cyan-500 focus-visible:outline-none focus-visible:ring-2",
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
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
