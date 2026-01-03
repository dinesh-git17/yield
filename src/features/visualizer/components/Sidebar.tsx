"use client";

import { cn } from "@/lib/utils";

export interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <div className={cn("flex h-full flex-col", className)}>
      {/* Header */}
      <div className="border-border-subtle flex h-14 items-center border-b px-4">
        <div className="flex items-center gap-2">
          <div className="bg-accent flex h-7 w-7 items-center justify-center rounded-md">
            <span className="text-sm font-semibold text-white">Y</span>
          </div>
          <span className="text-primary text-sm font-semibold">Yield</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3">
        <div className="mb-2">
          <span className="text-muted px-2 text-xs font-medium uppercase tracking-wider">
            Algorithms
          </span>
        </div>

        {/* Algorithm Categories - Placeholder for Phase 1 */}
        <div className="space-y-1">
          <SidebarItem label="Sorting" isActive />
          <SidebarItem label="Pathfinding" disabled />
          <SidebarItem label="Trees" disabled />
          <SidebarItem label="Graphs" disabled />
        </div>

        <div className="border-border-subtle my-4 border-t" />

        <div className="mb-2">
          <span className="text-muted px-2 text-xs font-medium uppercase tracking-wider">
            Sorting
          </span>
        </div>

        <div className="space-y-1">
          <SidebarItem label="Bubble Sort" isActive />
          <SidebarItem label="Quick Sort" disabled />
          <SidebarItem label="Merge Sort" disabled />
          <SidebarItem label="Heap Sort" disabled />
        </div>
      </nav>

      {/* Footer */}
      <div className="border-border-subtle border-t p-3">
        <div className="text-muted text-xs">Phase 1: Vertical Slice</div>
      </div>
    </div>
  );
}

interface SidebarItemProps {
  label: string;
  isActive?: boolean;
  disabled?: boolean;
}

function SidebarItem({ label, isActive, disabled }: SidebarItemProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={cn(
        "flex w-full items-center rounded-md px-2 py-1.5 text-left text-sm transition-colors",
        isActive && "bg-accent-muted text-accent",
        !isActive && !disabled && "text-primary hover:bg-surface-elevated",
        disabled && "text-muted cursor-not-allowed opacity-50"
      )}
    >
      {label}
    </button>
  );
}
