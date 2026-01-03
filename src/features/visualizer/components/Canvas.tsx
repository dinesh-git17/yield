"use client";

import { cn } from "@/lib/utils";

export interface CanvasProps {
  className?: string;
}

const PLACEHOLDER_HEIGHTS = [
  67, 23, 89, 45, 12, 78, 34, 56, 91, 38, 72, 19, 84, 41, 63, 27, 95, 52, 76, 31, 88, 14, 59, 43,
  81, 25, 70, 36, 93, 48,
];

export function Canvas({ className }: CanvasProps) {
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
        {/* Placeholder bars for visual feedback */}
        <div className="flex h-full w-full max-w-4xl items-end justify-center gap-1">
          {PLACEHOLDER_HEIGHTS.map((height) => (
            <div
              key={height}
              className="bg-accent/30 w-3 rounded-t-sm transition-all duration-300"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>

        {/* Empty state overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-muted mb-2 text-sm">Bubble Sort Visualization</div>
            <div className="text-muted/60 text-xs">Click Play to start the animation</div>
          </div>
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
