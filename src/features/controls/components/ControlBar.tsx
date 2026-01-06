"use client";

import * as Slider from "@radix-ui/react-slider";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { motion } from "framer-motion";
import { memo, useCallback, useMemo } from "react";
import { SPRING_PRESETS } from "@/lib/motion";
import { type PlaybackSpeedMultiplier, SORTING_CONFIG, useYieldStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { AlgorithmWheel } from "./AlgorithmWheel";

export interface ControlBarProps {
  className?: string;
}

const SPEED_OPTIONS: { value: PlaybackSpeedMultiplier; label: string }[] = [
  { value: 0.5, label: "0.5x" },
  { value: 1, label: "1x" },
  { value: 2, label: "2x" },
  { value: 4, label: "4x" },
];

export const ControlBar = memo(function ControlBar({ className }: ControlBarProps) {
  const arraySize = useYieldStore((state) => state.arraySize);
  const playbackSpeed = useYieldStore((state) => state.playbackSpeed);
  const setArraySize = useYieldStore((state) => state.setArraySize);
  const setPlaybackSpeed = useYieldStore((state) => state.setPlaybackSpeed);

  const handleSpeedChange = useCallback(
    (value: string) => {
      if (value) {
        setPlaybackSpeed(Number(value) as PlaybackSpeedMultiplier);
      }
    },
    [setPlaybackSpeed]
  );

  const handleSizeChange = useCallback(
    (values: number[]) => {
      const sliderValue = values[0];
      if (sliderValue !== undefined) {
        // Map slider [0-100] to array size [5-50]
        const size = Math.round(
          SORTING_CONFIG.ARRAY_SIZE_MIN +
            (sliderValue / 100) * (SORTING_CONFIG.ARRAY_SIZE_MAX - SORTING_CONFIG.ARRAY_SIZE_MIN)
        );
        setArraySize(size);
      }
    },
    [setArraySize]
  );

  // Convert array size back to slider value [0-100]
  const sliderValue = useMemo(() => {
    return (
      ((arraySize - SORTING_CONFIG.ARRAY_SIZE_MIN) /
        (SORTING_CONFIG.ARRAY_SIZE_MAX - SORTING_CONFIG.ARRAY_SIZE_MIN)) *
      100
    );
  }, [arraySize]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={SPRING_PRESETS.entrance}
      className={cn(
        "bg-surface-elevated/95 border-border flex w-full items-center gap-2 rounded-lg border px-2 py-2 shadow-lg backdrop-blur-sm md:w-auto md:gap-4 md:px-4",
        className
      )}
    >
      {/* Algorithm Tab Selector - Hidden on mobile (accessible via drawer) */}
      <div className="hidden md:block">
        <ControlSection label="Algorithm">
          <AlgorithmWheel />
        </ControlSection>
      </div>

      <Divider className="hidden md:block" />

      {/* Size Slider */}
      <ControlSection label={`Size: ${arraySize}`} className="flex-1 md:flex-none">
        <Slider.Root
          value={[sliderValue]}
          onValueChange={handleSizeChange}
          min={0}
          max={100}
          step={1}
          className="relative flex h-5 w-full min-w-16 touch-none select-none items-center md:w-32"
          aria-label="Array size"
        >
          <Slider.Track className="bg-border relative h-1.5 grow rounded-full">
            <Slider.Range className="bg-accent absolute h-full rounded-full" />
          </Slider.Track>
          <Slider.Thumb
            className={cn(
              "bg-surface-elevated border-border block h-5 w-5 rounded-full border-2 shadow-md md:h-4 md:w-4",
              "hover:border-accent transition-colors",
              "focus-visible:ring-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            )}
          />
        </Slider.Root>
      </ControlSection>

      <Divider />

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
                "text-muted relative rounded-md px-2 py-1 text-xs font-medium transition-colors md:px-2.5 md:py-1.5",
                "focus-visible:ring-accent focus-visible:outline-none focus-visible:ring-2",
                "data-[state=on]:text-primary"
              )}
              aria-label={`Set speed to ${option.label}`}
            >
              {playbackSpeed === option.value && (
                <motion.span
                  layoutId="speed-indicator"
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
