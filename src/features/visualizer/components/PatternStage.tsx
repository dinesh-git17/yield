"use client";

import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ChevronRight,
  Clock,
  Lightbulb,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  StepForward,
  Trophy,
  Zap,
} from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useRef } from "react";
import {
  getPatternProblemMetadata,
  PATTERN_STEP_LABELS,
  SLIDING_WINDOW_PRESETS,
} from "@/features/algorithms/patterns/config";
import type { PatternStep } from "@/features/algorithms/patterns/types";
import { useSponsorship } from "@/features/sponsorship";
import { badgeVariants, buttonInteraction, SPRING_PRESETS } from "@/lib/motion";
import { type PlaybackSpeedMultiplier, useYieldStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { usePattern } from "../context/PatternContext";
import { FrequencyTable } from "./FrequencyTable";
import { WindowArray } from "./WindowArray";

export interface PatternStageProps {
  className?: string;
}

/**
 * Pattern visualization stage.
 * Renders the sliding window problem visualization with educational UI.
 * Note: Expects to be rendered within a PatternProvider (provided at page level).
 */
export function PatternStage({ className }: PatternStageProps) {
  return <PatternStageContent className={className ?? ""} />;
}

const SPEED_OPTIONS: { value: PlaybackSpeedMultiplier; label: string }[] = [
  { value: 0.5, label: "0.5x" },
  { value: 1, label: "1x" },
  { value: 2, label: "2x" },
  { value: 4, label: "4x" },
];

const PRESET_OPTIONS = [
  { value: "classic", label: "Classic", hint: "abcabcbb" },
  { value: "allUnique", label: "Unique", hint: "abcdefgh" },
  { value: "allSame", label: "Same", hint: "bbbbb" },
  { value: "twoChars", label: "Two", hint: "pwwkew" },
];

function PatternStageContent({ className }: { className?: string }) {
  const {
    characters,
    status,
    currentStepType,
    window,
    frequencyMap,
    windowStatus,
    globalMax,
    bestSubstring,
    currentSubstring,
    speed,
    dynamicInsight,
    duplicateChar,
    play,
    pause,
    nextStep,
    reset,
    resetWithInput,
    isReady,
  } = usePattern();

  const patternProblem = useYieldStore((state) => state.patternProblem);
  const playbackSpeed = useYieldStore((state) => state.playbackSpeed);
  const setPlaybackSpeed = useYieldStore((state) => state.setPlaybackSpeed);
  const { incrementCompletion } = useSponsorship();

  const problemMetadata = useMemo(
    () => getPatternProblemMetadata(patternProblem),
    [patternProblem]
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
      const presetInput = SLIDING_WINDOW_PRESETS[preset];
      if (presetInput !== undefined) {
        resetWithInput(presetInput);
      }
    },
    [resetWithInput]
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
            key={patternProblem}
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
        {/* Insight Banner - Dynamic educational banner */}
        <InsightBanner
          currentStepType={currentStepType}
          dynamicInsight={dynamicInsight}
          isComplete={isComplete}
          globalMax={globalMax}
          bestSubstring={bestSubstring}
        />

        {/* Main Visualization */}
        <div className="flex flex-1 flex-col items-center justify-center gap-8 px-4 pb-24 md:gap-12 md:px-6">
          {/* Window Array */}
          <WindowArray
            characters={characters}
            window={window}
            windowStatus={windowStatus}
            duplicateChar={duplicateChar}
            speed={speed}
          />

          {/* Stats Row */}
          <div className="flex flex-wrap items-start justify-center gap-6 md:gap-10">
            {/* Frequency Table */}
            <FrequencyTable
              frequencyMap={frequencyMap}
              windowStatus={windowStatus}
              duplicateChar={duplicateChar}
            />

            {/* Current Window Info */}
            <WindowInfo
              currentSubstring={currentSubstring}
              globalMax={globalMax}
              bestSubstring={bestSubstring}
              windowStatus={windowStatus}
            />
          </div>
        </div>

        {/* Floating Control Bar */}
        <div className="absolute inset-x-0 bottom-3 z-30 flex justify-center px-2 md:bottom-6 md:px-0">
          <PatternControlBar
            playbackSpeed={playbackSpeed}
            onSpeedChange={handleSpeedChange}
            onPresetChange={handlePresetChange}
            disabled={isPlaying}
          />
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 hidden flex-col gap-1 md:bottom-6 md:flex">
          <LegendItem color="bg-emerald-500/30" label="In Window" />
          <LegendItem color="bg-sky-500/30" label="Entering (R)" />
          <LegendItem color="bg-amber-500/30" label="Leaving (L)" />
          <LegendItem color="bg-rose-500/30" label="Duplicate" />
        </div>
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

/**
 * Maps step types to their visual styling configuration.
 */
const STEP_BANNER_CONFIG: Record<
  PatternStep["type"],
  {
    icon: React.ReactNode;
    bgClass: string;
    borderClass: string;
    iconBgClass: string;
    iconTextClass: string;
    labelClass: string;
  }
> = {
  init: {
    icon: <Lightbulb className="h-4 w-4" />,
    bgClass: "bg-sky-500/10",
    borderClass: "border-sky-500/30",
    iconBgClass: "bg-sky-500/20",
    iconTextClass: "text-sky-400",
    labelClass: "text-sky-300",
  },
  expand: {
    icon: <ChevronRight className="h-4 w-4" />,
    bgClass: "bg-emerald-500/10",
    borderClass: "border-emerald-500/30",
    iconBgClass: "bg-emerald-500/20",
    iconTextClass: "text-emerald-400",
    labelClass: "text-emerald-300",
  },
  "found-duplicate": {
    icon: <AlertTriangle className="h-4 w-4" />,
    bgClass: "bg-rose-500/10",
    borderClass: "border-rose-500/30",
    iconBgClass: "bg-rose-500/20",
    iconTextClass: "text-rose-400",
    labelClass: "text-rose-300",
  },
  shrink: {
    icon: <ChevronRight className="h-4 w-4 rotate-180" />,
    bgClass: "bg-amber-500/10",
    borderClass: "border-amber-500/30",
    iconBgClass: "bg-amber-500/20",
    iconTextClass: "text-amber-400",
    labelClass: "text-amber-300",
  },
  "update-max": {
    icon: <Trophy className="h-4 w-4" />,
    bgClass: "bg-violet-500/10",
    borderClass: "border-violet-500/30",
    iconBgClass: "bg-violet-500/20",
    iconTextClass: "text-violet-400",
    labelClass: "text-violet-300",
  },
  complete: {
    icon: <Sparkles className="h-4 w-4" />,
    bgClass: "bg-emerald-500/10",
    borderClass: "border-emerald-500/30",
    iconBgClass: "bg-emerald-500/20",
    iconTextClass: "text-emerald-400",
    labelClass: "text-emerald-300",
  },
};

interface InsightBannerProps {
  currentStepType: PatternStep["type"] | null;
  dynamicInsight: string;
  isComplete: boolean;
  globalMax: number;
  bestSubstring: string;
}

const InsightBanner = memo(function InsightBanner({
  currentStepType,
  dynamicInsight,
  isComplete,
  globalMax,
  bestSubstring,
}: InsightBannerProps) {
  // Show completion summary with Linear Time highlight when done
  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
        className="absolute top-4 left-4 right-4 z-10 flex flex-col gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 shadow-lg backdrop-blur-sm md:right-auto md:max-w-md"
      >
        {/* Success header */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/20">
            <Sparkles className="h-5 w-5 text-emerald-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-primary text-base font-semibold">Algorithm Complete!</span>
            <span className="text-muted text-sm">
              Max length: <span className="font-bold text-emerald-400">{globalMax}</span>
              {bestSubstring && (
                <>
                  {" · "}
                  <span className="font-mono text-violet-400">"{bestSubstring}"</span>
                </>
              )}
            </span>
          </div>
        </div>

        {/* Linear Time Insight - Key Educational Takeaway */}
        <div className="flex items-start gap-2 rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-3">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500/20">
            <Zap className="h-3.5 w-3.5 text-cyan-400" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-cyan-300">Linear Time: O(n)</span>
            <p className="text-muted text-xs leading-relaxed">
              Each character was visited at most twice — once when the right pointer expanded, and
              once when the left pointer contracted. This is the power of the sliding window!
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  // Idle state - show hint
  if (!currentStepType) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute top-4 left-4 z-10 flex max-w-sm items-center gap-3 rounded-lg border border-zinc-500/20 bg-zinc-500/5 p-3 backdrop-blur-sm"
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-500/10">
          <Clock className="h-4 w-4 text-zinc-400" />
        </div>
        <div className="flex flex-col">
          <span className="text-muted text-sm">Ready to visualize</span>
          <span className="text-muted/60 text-xs">Press Play or Step to begin</span>
        </div>
      </motion.div>
    );
  }

  const config = STEP_BANNER_CONFIG[currentStepType];
  const label = PATTERN_STEP_LABELS[currentStepType];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentStepType}
        initial={{ opacity: 0, y: -10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.98 }}
        transition={{ duration: 0.2, type: "spring", stiffness: 400, damping: 30 }}
        className={cn(
          "absolute top-4 left-4 right-4 z-10 flex flex-col gap-2 rounded-xl border p-3 shadow-lg backdrop-blur-sm md:right-auto md:max-w-md",
          config.bgClass,
          config.borderClass
        )}
      >
        {/* Header with step type */}
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
              config.iconBgClass
            )}
          >
            <span className={config.iconTextClass}>{config.icon}</span>
          </div>
          <span className={cn("text-sm font-semibold", config.labelClass)}>{label}</span>
        </div>

        {/* Dynamic insight message */}
        {dynamicInsight && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="text-primary/90 pl-11 text-sm leading-relaxed"
          >
            {dynamicInsight}
          </motion.p>
        )}
      </motion.div>
    </AnimatePresence>
  );
});

interface WindowInfoProps {
  currentSubstring: string;
  globalMax: number;
  bestSubstring: string;
  windowStatus: "valid" | "invalid";
}

function WindowInfo({ currentSubstring, globalMax, bestSubstring, windowStatus }: WindowInfoProps) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-muted text-xs font-medium uppercase tracking-wider">Window Stats</h3>
      <div className="border-border bg-surface-elevated/50 flex flex-col gap-3 rounded-lg border p-3">
        {/* Current Window */}
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted text-sm">Current:</span>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "font-mono text-sm",
                windowStatus === "valid" ? "text-emerald-400" : "text-rose-400"
              )}
            >
              {currentSubstring ? `"${currentSubstring}"` : "—"}
            </span>
            <span className="text-muted text-xs">({currentSubstring.length})</span>
          </div>
        </div>

        {/* Divider */}
        <div className="bg-border h-px" />

        {/* Best Found - High Score Indicator */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <Trophy className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-muted text-sm">Best:</span>
          </div>
          <div className="flex items-center gap-2">
            <AnimatePresence mode="wait">
              <motion.span
                key={bestSubstring}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="font-mono text-sm text-violet-400"
              >
                {bestSubstring ? `"${bestSubstring}"` : "—"}
              </motion.span>
            </AnimatePresence>
            <HighScoreBadge value={globalMax} />
          </div>
        </div>
      </div>
    </div>
  );
}

interface HighScoreBadgeProps {
  value: number;
}

/**
 * High Score Badge with pop animation.
 * Shows the maximum window length found with a celebratory animation on updates.
 */
const HighScoreBadge = memo(function HighScoreBadge({ value }: HighScoreBadgeProps) {
  return (
    <motion.div key={value} className="relative">
      {/* Background glow pulse on update */}
      <motion.div
        className="absolute inset-0 rounded bg-violet-500/40"
        initial={{ scale: 1.8, opacity: 0.8 }}
        animate={{ scale: 1, opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
      {/* Ring pulse animation */}
      <motion.div
        className="absolute inset-0 rounded border-2 border-violet-400"
        initial={{ scale: 1, opacity: 0.8 }}
        animate={{ scale: 1.5, opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
      {/* Main badge with pop */}
      <motion.span
        className="relative z-10 inline-flex items-center justify-center rounded bg-violet-500/30 px-2 py-0.5 text-sm font-bold text-violet-200 shadow-lg shadow-violet-500/20"
        initial={{ scale: 1.5, y: -8 }}
        animate={{ scale: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 20,
        }}
      >
        {value}
      </motion.span>
    </motion.div>
  );
});

interface PatternControlBarProps {
  playbackSpeed: PlaybackSpeedMultiplier;
  onSpeedChange: (value: string) => void;
  onPresetChange: (preset: string) => void;
  disabled?: boolean;
}

const PatternControlBar = memo(function PatternControlBar({
  playbackSpeed,
  onSpeedChange,
  onPresetChange,
  disabled,
}: PatternControlBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={SPRING_PRESETS.entrance}
      className="bg-surface-elevated/95 border-border flex w-full items-center gap-2 rounded-lg border px-2 py-2 shadow-lg backdrop-blur-sm md:w-auto md:gap-4 md:px-4"
    >
      {/* Preset Selector */}
      <ControlSection label="Input">
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
                title={option.hint}
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
                  layoutId="pattern-speed-indicator"
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

interface LegendItemProps {
  color: string;
  label: string;
}

function LegendItem({ color, label }: LegendItemProps) {
  return (
    <div className="flex items-center gap-2">
      <span className={cn("h-3 w-3 rounded-sm", color)} />
      <span className="text-muted text-xs">{label}</span>
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
