"use client";

import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { motion } from "framer-motion";
import { memo, useCallback } from "react";
import { SPRING_PRESETS } from "@/lib/motion";
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
        "bg-surface-elevated/95 border-border flex items-center gap-4 rounded-lg border px-4 py-2 shadow-lg backdrop-blur-sm",
        className
      )}
    >
      {/* Algorithm Wheel */}
      <ControlSection label="Algorithm">
        <PathfindingAlgorithmWheel />
      </ControlSection>

      <Divider />

      {/* Heuristic Selector (only for A* and Greedy) */}
      {showHeuristicSelector && (
        <>
          <ControlSection label="Heuristic">
            <HeuristicSelector />
          </ControlSection>

          <Divider />
        </>
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
}

function ControlSection({ label, children }: ControlSectionProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-muted text-[10px] font-medium uppercase tracking-wider">{label}</span>
      {children}
    </div>
  );
}

function Divider() {
  return <div className="bg-border h-6 w-px" />;
}
