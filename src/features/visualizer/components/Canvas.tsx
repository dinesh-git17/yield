"use client";

import { useEffect, useMemo, useState } from "react";
import { useSortingController } from "@/features/algorithms/hooks";
import { cn } from "@/lib/utils";
import { SortingBar } from "./SortingBar";

export interface CanvasProps {
  className?: string;
}

const BAR_COUNT = 50;
const MIN_HEIGHT = 5;
const MAX_HEIGHT = 100;

function generateOrderedValues(count: number): number[] {
  const values: number[] = [];
  const step = (MAX_HEIGHT - MIN_HEIGHT) / (count - 1);
  for (let i = 0; i < count; i++) {
    values.push(Math.round(MIN_HEIGHT + step * i));
  }
  return values;
}

function shuffleArray(arr: number[]): number[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = result[i];
    const jVal = result[j];
    if (temp !== undefined && jVal !== undefined) {
      result[i] = jVal;
      result[j] = temp;
    }
  }
  return result;
}

export function Canvas({ className }: CanvasProps) {
  const [initialValues, setInitialValues] = useState<number[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const ordered = generateOrderedValues(BAR_COUNT);
    const shuffled = shuffleArray(ordered);
    setInitialValues(shuffled);
    setIsClient(true);
  }, []);

  const stableInitialValues = useMemo(() => initialValues, [initialValues]);

  if (!isClient || initialValues.length === 0) {
    return (
      <div className={cn("flex h-full flex-col", className)}>
        <header className="border-border-subtle bg-surface flex h-14 shrink-0 items-center justify-between border-b px-4">
          <div className="flex items-center gap-3">
            <h1 className="text-primary text-sm font-medium">Bubble Sort</h1>
            <span className="bg-accent-muted text-accent rounded-full px-2 py-0.5 text-xs font-medium">
              O(n²)
            </span>
          </div>
        </header>
        <div className="flex flex-1 items-center justify-center">
          <div className="text-muted text-sm">Loading...</div>
        </div>
      </div>
    );
  }

  return <CanvasContent className={className} initialValues={stableInitialValues} />;
}

interface CanvasContentProps {
  className: string | undefined;
  initialValues: number[];
}

function CanvasContent({ className, initialValues }: CanvasContentProps) {
  const { bars, status, currentStepIndex, play, pause, nextStep, reset } =
    useSortingController(initialValues);

  const isPlaying = status === "playing";
  const isComplete = status === "complete";

  return (
    <div className={cn("flex h-full flex-col", className)}>
      {/* Header Bar */}
      <header className="border-border-subtle bg-surface flex h-14 shrink-0 items-center justify-between border-b px-4">
        <div className="flex items-center gap-3">
          <h1 className="text-primary text-sm font-medium">Bubble Sort</h1>
          <span className="bg-accent-muted text-accent rounded-full px-2 py-0.5 text-xs font-medium">
            O(n²)
          </span>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <ControlButton label="Reset" onClick={reset} disabled={status === "idle"} />
          <ControlButton label="Step" onClick={nextStep} disabled={isComplete} />
          <ControlButton
            label={isPlaying ? "Pause" : "Play"}
            onClick={isPlaying ? pause : play}
            disabled={isComplete}
            isPrimary
          />
        </div>
      </header>

      {/* Visualization Area */}
      <div className="relative flex flex-1 items-end justify-center overflow-hidden p-8">
        <div className="flex h-full w-full max-w-4xl items-end justify-center gap-0.5">
          {bars.map((bar, index) => (
            <SortingBar
              key={bar.id}
              value={bar.value}
              index={index}
              heightPercent={bar.value}
              state={bar.state}
            />
          ))}
        </div>
      </div>

      {/* Footer Status Bar */}
      <footer className="border-border-subtle bg-surface flex h-10 shrink-0 items-center justify-between border-t px-4">
        <div className="text-muted text-xs">
          Step: {currentStepIndex} {isComplete && "(Complete)"}
        </div>
        <div className="text-muted text-xs">Speed: 1x</div>
      </footer>
    </div>
  );
}

interface ControlButtonProps {
  label: string;
  onClick: () => void;
  isPrimary?: boolean;
  disabled?: boolean;
}

function ControlButton({ label, onClick, isPrimary, disabled }: ControlButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
        "focus-visible:ring-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        isPrimary
          ? "bg-accent hover:bg-accent/90 text-white disabled:bg-accent/50"
          : "bg-surface-elevated border-border text-primary hover:bg-border/50 border disabled:opacity-50",
        disabled && "cursor-not-allowed"
      )}
    >
      {label}
    </button>
  );
}
