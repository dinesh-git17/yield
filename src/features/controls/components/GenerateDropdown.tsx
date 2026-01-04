"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { motion } from "framer-motion";
import { ChevronDown, Sparkles } from "lucide-react";
import { memo, useCallback } from "react";
import {
  getMazeAlgorithmMetadata,
  MAZE_ALGORITHM_ORDER,
  type MazeAlgorithmType,
} from "@/features/algorithms/maze";
import { buttonInteraction, SPRING_PRESETS } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface GenerateDropdownProps {
  /** Callback when a maze algorithm is selected */
  onGenerate: (algorithm: MazeAlgorithmType) => void;
  /** Whether the dropdown is disabled */
  disabled?: boolean;
  className?: string;
}

/**
 * Dropdown menu for selecting and triggering maze generation algorithms.
 */
export const GenerateDropdown = memo(function GenerateDropdown({
  onGenerate,
  disabled = false,
  className,
}: GenerateDropdownProps) {
  const handleSelect = useCallback(
    (algorithm: MazeAlgorithmType) => {
      onGenerate(algorithm);
    },
    [onGenerate]
  );

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild disabled={disabled}>
        <motion.button
          type="button"
          {...(disabled
            ? {}
            : { whileHover: buttonInteraction.hover, whileTap: buttonInteraction.tap })}
          animate={{ opacity: disabled ? 0.5 : 1 }}
          transition={SPRING_PRESETS.snappy}
          className={cn(
            "bg-surface-elevated border-border text-primary flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium",
            "focus-visible:ring-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
            disabled && "cursor-not-allowed",
            className
          )}
          aria-label="Generate maze"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Generate
          <ChevronDown className="h-3 w-3 opacity-60" />
        </motion.button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className={cn(
            "bg-surface-elevated border-border z-50 min-w-[180px] rounded-lg border p-1 shadow-xl",
            "animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2",
            "data-[side=top]:slide-in-from-bottom-2"
          )}
          sideOffset={5}
          align="start"
        >
          {MAZE_ALGORITHM_ORDER.map((algorithm) => {
            const metadata = getMazeAlgorithmMetadata(algorithm);
            return (
              <DropdownMenu.Item
                key={algorithm}
                className={cn(
                  "text-primary flex cursor-pointer select-none flex-col gap-0.5 rounded-md px-3 py-2 text-xs outline-none",
                  "focus:bg-surface hover:bg-surface transition-colors"
                )}
                onSelect={() => handleSelect(algorithm)}
              >
                <span className="font-medium">{metadata.label}</span>
                <span className="text-muted text-[10px]">{metadata.description}</span>
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
});
