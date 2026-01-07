"use client";

import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { AnimatePresence, motion } from "framer-motion";
import { Droplets, Lightbulb, Pause, Play, RotateCcw, StepForward } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useRef } from "react";
import {
  getInterviewProblemMetadata,
  INTERVIEW_CONFIG,
  RAIN_WATER_PRESETS,
} from "@/features/algorithms/interview/config";
import { useSponsorship } from "@/features/sponsorship";
import { badgeVariants, buttonInteraction, SPRING_PRESETS } from "@/lib/motion";
import { type PlaybackSpeedMultiplier, useYieldStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { InterviewProvider, useInterview } from "../context";
import { RainWaterBar } from "./RainWaterBar";

export interface InterviewStageProps {
  className?: string;
}

/**
 * Interview visualization stage.
 * Renders the rain water problem visualization with educational UI.
 */
export function InterviewStage({ className }: InterviewStageProps) {
  return (
    <InterviewProvider>
      <InterviewStageContent className={className ?? ""} />
    </InterviewProvider>
  );
}

const SPEED_OPTIONS: { value: PlaybackSpeedMultiplier; label: string }[] = [
  { value: 0.5, label: "0.5x" },
  { value: 1, label: "1x" },
  { value: 2, label: "2x" },
  { value: 4, label: "4x" },
];

const PRESET_OPTIONS = [
  { value: "classic", label: "Classic" },
  { value: "valley", label: "Valley" },
  { value: "pool", label: "Pool" },
  { value: "random", label: "Random" },
];

function InterviewStageContent({ className }: { className?: string }) {
  const {
    bars,
    status,
    currentStepIndex,
    currentStepType,
    totalWater,
    maxLeft,
    maxRight,
    insight,
    speed,
    play,
    pause,
    nextStep,
    reset,
    resetWithHeights,
    isReady,
  } = useInterview();

  const interviewProblem = useYieldStore((state) => state.interviewProblem);
  const playbackSpeed = useYieldStore((state) => state.playbackSpeed);
  const setPlaybackSpeed = useYieldStore((state) => state.setPlaybackSpeed);
  const setInterviewHeights = useYieldStore((state) => state.setInterviewHeights);
  const { incrementCompletion } = useSponsorship();

  const problemMetadata = useMemo(
    () => getInterviewProblemMetadata(interviewProblem),
    [interviewProblem]
  );

  // Track visualization completions for engagement
  const hasTrackedCompletion = useRef(false);
  useEffect(() => {
    if (status === "complete" && !hasTrackedCompletion.current) {
      hasTrackedCompletion.current = true;
      incrementCompletion();
    } else if (status === "idle") {
      hasTrackedCompletion.current = false;
    }
  }, [status, incrementCompletion]);

  const handleSpeedChange = useCallback(
    (value: string) => {
      if (value) {
        setPlaybackSpeed(Number(value) as PlaybackSpeedMultiplier);
      }
    },
    [setPlaybackSpeed]
  );

  const handlePresetChange = useCallback(
    (preset: string) => {
      if (preset === "random") {
        // Generate random heights
        const count = INTERVIEW_CONFIG.DEFAULT_BARS;
        const heights: number[] = [];
        for (let i = 0; i < count; i++) {
          heights.push(Math.floor(Math.random() * (INTERVIEW_CONFIG.MAX_HEIGHT + 1)));
        }
        setInterviewHeights(heights);
        resetWithHeights(heights);
      } else {
        const presetHeights = RAIN_WATER_PRESETS[preset];
        if (presetHeights && presetHeights.length > 0) {
          setInterviewHeights(presetHeights);
          resetWithHeights(presetHeights);
        }
      }
    },
    [setInterviewHeights, resetWithHeights]
  );

  if (!isReady) {
    return (
      <div className={cn("flex h-full min-h-0 flex-col", className)}>
        <header className="border-border-subtle bg-surface flex h-14 shrink-0 items-center justify-between border-b pl-14 pr-2 md:px-4">
          <div className="flex items-center gap-2 md:gap-3">
            <h1 className="text-primary text-xs font-medium md:text-sm">{problemMetadata.label}</h1>
            <DifficultyBadge difficulty={problemMetadata.difficulty} />
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
    <div className={cn("flex h-full min-h-0 flex-col", className)}>
      {/* Header Bar */}
      <header className="border-border-subtle bg-surface flex h-14 shrink-0 items-center justify-between border-b pl-14 pr-2 md:px-4">
        <div className="flex items-center gap-2 md:gap-3">
          <h1 className="text-primary text-xs font-medium md:text-sm">{problemMetadata.label}</h1>
          <DifficultyBadge difficulty={problemMetadata.difficulty} />
          <motion.span
            key={interviewProblem}
            variants={badgeVariants}
            initial="hidden"
            animate="visible"
            className="bg-accent-muted text-accent hidden rounded-full px-2 py-0.5 text-xs font-medium md:inline-block"
          >
            {problemMetadata.complexity}
          </motion.span>
          <motion.span
            variants={badgeVariants}
            initial="hidden"
            animate="visible"
            className="bg-surface-elevated text-muted hidden rounded-full px-2 py-0.5 text-xs font-medium md:inline-block"
          >
            {problemMetadata.pattern}
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
      <div className="bg-dot-pattern relative flex min-h-0 flex-1 flex-col overflow-hidden">
        {/* Insight Banner */}
        <AnimatePresence mode="wait">
          {insight && (
            <motion.div
              key={currentStepType}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-surface-elevated/90 border-border mx-4 mt-4 flex items-start gap-3 rounded-lg border p-3 shadow-sm backdrop-blur-sm md:mx-6"
            >
              <Lightbulb className="text-accent mt-0.5 h-4 w-4 shrink-0" />
              <p className="text-primary text-sm leading-relaxed">{insight}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bar Visualization */}
        <div className="flex flex-1 items-end justify-center p-4 pb-24 md:p-6 md:pb-32">
          <div className="border-border/50 flex h-full max-h-[360px] w-full max-w-3xl items-end justify-center gap-1 border-b pb-2 md:max-h-[420px] md:gap-2">
            {bars.map((bar) => (
              <RainWaterBar
                key={bar.id}
                height={bar.height}
                index={bar.index}
                waterLevel={bar.waterLevel}
                state={bar.state}
                maxHeight={INTERVIEW_CONFIG.MAX_HEIGHT}
                speed={speed}
              />
            ))}
          </div>
        </div>

        {/* Floating Control Bar */}
        <div className="absolute inset-x-0 bottom-3 z-30 flex justify-center px-2 md:bottom-6 md:px-0">
          <InterviewControlBar
            playbackSpeed={playbackSpeed}
            onSpeedChange={handleSpeedChange}
            onPresetChange={handlePresetChange}
            disabled={isPlaying}
          />
        </div>

        {/* Stats Overlay */}
        <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
          <div className="bg-surface-elevated/90 border-border flex items-center gap-2 rounded-lg border px-3 py-1.5 shadow-sm backdrop-blur-sm">
            <Droplets className="h-4 w-4 text-sky-400" />
            <span className="text-primary text-sm font-medium tabular-nums">
              {totalWater} units
            </span>
          </div>
          <span className="text-muted text-xs">
            Step: {currentStepIndex} {isComplete && "(Complete)"}
          </span>
        </div>

        {/* Pointer Legend */}
        <div className="absolute bottom-20 left-4 hidden flex-col gap-1 md:bottom-24 md:flex">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: "#f59e0b" }} />
            <span className="text-muted text-xs">Left Pointer</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: "#f43f5e" }} />
            <span className="text-muted text-xs">Right Pointer</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-sm"
              style={{ backgroundColor: "rgba(56, 189, 248, 0.7)" }}
            />
            <span className="text-muted text-xs">Trapped Water</span>
          </div>
        </div>

        {/* Max Values Display */}
        {(maxLeft > 0 || maxRight > 0) && (
          <div className="absolute top-4 left-4 flex flex-col gap-1">
            <span className="text-muted text-xs">
              Max Left: <span className="text-amber-500 font-medium">{maxLeft}</span>
            </span>
            <span className="text-muted text-xs">
              Max Right: <span className="text-rose-500 font-medium">{maxRight}</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

interface DifficultyBadgeProps {
  difficulty: "Easy" | "Medium" | "Hard";
}

function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  const colorClass = useMemo(() => {
    switch (difficulty) {
      case "Easy":
        return "bg-emerald-500/10 text-emerald-500";
      case "Medium":
        return "bg-amber-500/10 text-amber-500";
      case "Hard":
        return "bg-rose-500/10 text-rose-500";
      default:
        return "bg-zinc-500/10 text-zinc-500";
    }
  }, [difficulty]);

  return (
    <motion.span
      variants={badgeVariants}
      initial="hidden"
      animate="visible"
      className={cn("rounded-full px-2 py-0.5 text-xs font-medium", colorClass)}
    >
      {difficulty}
    </motion.span>
  );
}

interface InterviewControlBarProps {
  playbackSpeed: PlaybackSpeedMultiplier;
  onSpeedChange: (value: string) => void;
  onPresetChange: (preset: string) => void;
  disabled?: boolean;
}

const InterviewControlBar = memo(function InterviewControlBar({
  playbackSpeed,
  onSpeedChange,
  onPresetChange,
  disabled,
}: InterviewControlBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={SPRING_PRESETS.entrance}
      className="bg-surface-elevated/95 border-border flex w-full items-center gap-2 rounded-lg border px-2 py-2 shadow-lg backdrop-blur-sm md:w-auto md:gap-4 md:px-4"
    >
      {/* Preset Selector */}
      <ControlSection label="Terrain">
        <div className="flex gap-1">
          {PRESET_OPTIONS.map((option) => {
            const interactionProps = disabled
              ? {}
              : { whileHover: buttonInteraction.hover, whileTap: buttonInteraction.tap };
            return (
              <motion.button
                key={option.value}
                type="button"
                onClick={() => onPresetChange(option.value)}
                disabled={disabled}
                {...interactionProps}
                className={cn(
                  "text-muted rounded-md px-2 py-1 text-xs font-medium transition-colors",
                  "hover:bg-surface hover:text-primary",
                  "focus-visible:ring-accent focus-visible:outline-none focus-visible:ring-2",
                  disabled && "cursor-not-allowed opacity-50"
                )}
              >
                {option.label}
              </motion.button>
            );
          })}
        </div>
      </ControlSection>

      <Divider />

      {/* Speed Toggle */}
      <ControlSection label="Speed">
        <ToggleGroup.Root
          type="single"
          value={String(playbackSpeed)}
          onValueChange={onSpeedChange}
          className="bg-surface flex rounded-lg p-0.5"
        >
          {SPEED_OPTIONS.map((option) => (
            <ToggleGroup.Item
              key={option.value}
              value={String(option.value)}
              className={cn(
                "text-muted relative rounded-md px-2 py-1 text-xs font-medium transition-colors md:px-2.5 md:py-1.5",
                "focus-visible:ring-accent focus-visible:outline-none focus-visible:ring-2",
                "data-[state=on]:text-primary"
              )}
              aria-label={`Set speed to ${option.label}`}
            >
              {playbackSpeed === option.value && (
                <motion.span
                  layoutId="interview-speed-indicator"
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

function Divider() {
  return <div className="bg-border h-6 w-px" />;
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
