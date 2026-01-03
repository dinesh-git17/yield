"use client";

import { motion } from "framer-motion";
import { ChevronsLeft } from "lucide-react";
import { useState } from "react";
import { buttonInteraction, SPRING_PRESETS } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

export interface SidebarProps {
  className?: string;
  onCollapse?: () => void;
}

export function Sidebar({ className, onCollapse }: SidebarProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <div className={cn("flex h-full flex-col", className)}>
      {/* Header */}
      <div className="border-border-subtle flex h-14 items-center justify-between border-b px-4">
        <Logo />
        {onCollapse && (
          <motion.button
            type="button"
            onClick={onCollapse}
            whileHover={buttonInteraction.hover}
            whileTap={buttonInteraction.tap}
            className="text-muted hover:text-primary hover:bg-border/50 rounded-md p-1.5 transition-colors"
            aria-label="Collapse sidebar"
          >
            <motion.span
              className="block"
              initial={{ rotate: 0 }}
              transition={SPRING_PRESETS.snappy}
            >
              <ChevronsLeft className="h-4 w-4" />
            </motion.span>
          </motion.button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3" onMouseLeave={() => setHoveredItem(null)}>
        <div className="mb-2">
          <span className="text-muted px-2 text-xs font-medium uppercase tracking-wider">
            Algorithms
          </span>
        </div>

        {/* Algorithm Categories - Placeholder for Phase 1 */}
        <SidebarGroup hoveredItem={hoveredItem} onHover={setHoveredItem}>
          <SidebarItem
            id="cat-sorting"
            label="Sorting"
            isActive
            hoveredItem={hoveredItem}
            onHover={setHoveredItem}
          />
          <SidebarItem
            id="cat-pathfinding"
            label="Pathfinding"
            disabled
            hoveredItem={hoveredItem}
            onHover={setHoveredItem}
          />
          <SidebarItem
            id="cat-trees"
            label="Trees"
            disabled
            hoveredItem={hoveredItem}
            onHover={setHoveredItem}
          />
          <SidebarItem
            id="cat-graphs"
            label="Graphs"
            disabled
            hoveredItem={hoveredItem}
            onHover={setHoveredItem}
          />
        </SidebarGroup>

        <div className="border-border-subtle my-4 border-t" />

        <div className="mb-2">
          <span className="text-muted px-2 text-xs font-medium uppercase tracking-wider">
            Sorting
          </span>
        </div>

        <SidebarGroup hoveredItem={hoveredItem} onHover={setHoveredItem}>
          <SidebarItem
            id="algo-bubble"
            label="Bubble Sort"
            isActive
            hoveredItem={hoveredItem}
            onHover={setHoveredItem}
          />
          <SidebarItem
            id="algo-quick"
            label="Quick Sort"
            disabled
            hoveredItem={hoveredItem}
            onHover={setHoveredItem}
          />
          <SidebarItem
            id="algo-merge"
            label="Merge Sort"
            disabled
            hoveredItem={hoveredItem}
            onHover={setHoveredItem}
          />
          <SidebarItem
            id="algo-heap"
            label="Heap Sort"
            disabled
            hoveredItem={hoveredItem}
            onHover={setHoveredItem}
          />
        </SidebarGroup>
      </nav>

      {/* Footer */}
      <div className="border-border-subtle border-t p-3">
        <div className="text-muted text-xs">Phase 1: Vertical Slice</div>
      </div>
    </div>
  );
}

interface SidebarGroupProps {
  children: React.ReactNode;
  hoveredItem: string | null;
  onHover: (id: string | null) => void;
}

function SidebarGroup({ children }: SidebarGroupProps) {
  return <div className="relative space-y-1">{children}</div>;
}

interface SidebarItemProps {
  id: string;
  label: string;
  isActive?: boolean;
  disabled?: boolean;
  hoveredItem: string | null;
  onHover: (id: string | null) => void;
}

function SidebarItem({ id, label, isActive, disabled, hoveredItem, onHover }: SidebarItemProps) {
  const isHovered = hoveredItem === id && !disabled && !isActive;

  return (
    <button
      type="button"
      disabled={disabled}
      onMouseEnter={() => !disabled && onHover(id)}
      className={cn(
        "relative flex w-full items-center rounded-md px-2 py-1.5 text-left text-sm transition-colors",
        isActive && "text-accent",
        !isActive && !disabled && "text-primary",
        disabled && "text-muted cursor-not-allowed opacity-50"
      )}
    >
      {/* Sliding hover background */}
      {isHovered && (
        <motion.span
          layoutId="sidebar-hover"
          className="bg-surface-elevated absolute inset-0 rounded-md"
          transition={SPRING_PRESETS.snappy}
        />
      )}
      {/* Active background (static) */}
      {isActive && <span className="bg-accent-muted absolute inset-0 rounded-md" />}
      {/* Label text */}
      <span className="relative z-10">{label}</span>
    </button>
  );
}
