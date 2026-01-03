"use client";

import { motion } from "framer-motion";
import { BadgeHelp, ChevronsLeft } from "lucide-react";
import { useCallback, useState } from "react";
import { buttonInteraction, SPRING_PRESETS } from "@/lib/motion";
import { type AlgorithmType, useYieldStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { ComplexityModal } from "./ComplexityModal";
import { Logo } from "./Logo";

export interface SidebarProps {
  className?: string;
  onCollapse?: () => void;
}

const SORTING_ALGORITHMS: { id: AlgorithmType; label: string; enabled: boolean }[] = [
  { id: "bubble", label: "Bubble Sort", enabled: true },
  { id: "selection", label: "Selection Sort", enabled: true },
  { id: "quick", label: "Quick Sort", enabled: true },
  { id: "merge", label: "Merge Sort", enabled: true },
];

export function Sidebar({ className, onCollapse }: SidebarProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isComplexityOpen, setIsComplexityOpen] = useState(false);
  const currentAlgorithm = useYieldStore((state) => state.algorithm);
  const setAlgorithm = useYieldStore((state) => state.setAlgorithm);

  const handleAlgorithmSelect = useCallback(
    (algo: AlgorithmType) => {
      setAlgorithm(algo);
    },
    [setAlgorithm]
  );

  const openComplexityModal = useCallback(() => {
    setIsComplexityOpen(true);
  }, []);

  const closeComplexityModal = useCallback(() => {
    setIsComplexityOpen(false);
  }, []);

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
          {SORTING_ALGORITHMS.map((algo) => (
            <SidebarItem
              key={algo.id}
              id={`algo-${algo.id}`}
              label={algo.label}
              isActive={currentAlgorithm === algo.id}
              disabled={!algo.enabled}
              hoveredItem={hoveredItem}
              onHover={setHoveredItem}
              onClick={() => algo.enabled && handleAlgorithmSelect(algo.id)}
            />
          ))}
        </SidebarGroup>

        <div className="border-border-subtle my-4 border-t" />

        {/* Complexity Trigger */}
        <motion.button
          type="button"
          onClick={openComplexityModal}
          whileHover={buttonInteraction.hover}
          whileTap={buttonInteraction.tap}
          className={cn(
            "flex w-full items-center gap-2 rounded-lg px-3 py-2.5",
            "border border-white/10 bg-white/5 backdrop-blur-sm",
            "text-primary hover:bg-white/10 transition-colors",
            "dark:border-white/5 dark:bg-black/20"
          )}
        >
          <BadgeHelp className="h-4 w-4 text-violet-400" />
          <span className="text-sm font-medium">Complexity</span>
        </motion.button>
      </nav>

      {/* Footer */}
      <div className="border-border-subtle border-t p-3">
        <div className="text-muted text-xs">Phase 3: Divide & Conquer</div>
      </div>

      {/* Complexity Modal */}
      <ComplexityModal isOpen={isComplexityOpen} onClose={closeComplexityModal} />
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
  onClick?: () => void;
}

function SidebarItem({
  id,
  label,
  isActive,
  disabled,
  hoveredItem,
  onHover,
  onClick,
}: SidebarItemProps) {
  const isHovered = hoveredItem === id && !disabled && !isActive;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => !disabled && onHover(id)}
      className={cn(
        "relative flex w-full items-center rounded-md px-2 py-1.5 text-left text-sm transition-colors",
        isActive && "text-accent",
        !isActive && !disabled && "text-primary hover:text-accent",
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
