"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { type BarState, SortingBar } from "./SortingBar";

export interface CanvasProps {
  className?: string;
}

interface BarItem {
  id: string;
  value: number;
  state: BarState;
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

function createBarsFromValues(values: number[]): BarItem[] {
  return values.map((value, index) => ({
    id: `bar-${index}`,
    value,
    state: "idle" as const,
  }));
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

const INITIAL_VALUES = generateOrderedValues(BAR_COUNT);
const INITIAL_BARS = createBarsFromValues(INITIAL_VALUES);

export function Canvas({ className }: CanvasProps) {
  const [bars, setBars] = useState<BarItem[]>(INITIAL_BARS);

  useEffect(() => {
    const shuffled = shuffleArray(INITIAL_VALUES);
    setBars(createBarsFromValues(shuffled));
  }, []);

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

        {/* Playback Controls Placeholder */}
        <div className="flex items-center gap-2">
          <ControlButton label="Reset" />
          <ControlButton label="Step" />
          <ControlButton label="Play" isPrimary />
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
        <div className="text-muted text-xs">Step: 0 / 0</div>
        <div className="text-muted text-xs">Speed: 1x</div>
      </footer>
    </div>
  );
}

interface ControlButtonProps {
  label: string;
  isPrimary?: boolean;
}

function ControlButton({ label, isPrimary }: ControlButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
        isPrimary
          ? "bg-accent hover:bg-accent/90 text-white"
          : "bg-surface-elevated border-border text-primary hover:bg-border/50 border"
      )}
    >
      {label}
    </button>
  );
}
