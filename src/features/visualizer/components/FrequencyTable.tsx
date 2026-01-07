"use client";

import { AnimatePresence, motion } from "framer-motion";
import { memo, useMemo } from "react";
import type { WindowStatus } from "@/features/algorithms/patterns/types";
import { SPRING_PRESETS } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface FrequencyTableProps {
  frequencyMap: Record<string, number>;
  windowStatus: WindowStatus;
  duplicateChar: string | null;
}

/**
 * FrequencyTable — Live Character Frequency Display.
 *
 * Shows what the algorithm "sees" in the current window.
 * Highlights characters with count > 1 as duplicates.
 */
export const FrequencyTable = memo(function FrequencyTable({
  frequencyMap,
  windowStatus,
  duplicateChar,
}: FrequencyTableProps) {
  // Sort entries alphabetically for consistent display
  const entries = useMemo(() => {
    return Object.entries(frequencyMap).sort(([a], [b]) => a.localeCompare(b));
  }, [frequencyMap]);

  const isEmpty = entries.length === 0;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <h3 className="text-muted text-xs font-medium uppercase tracking-wider">Frequency Map</h3>
        <StatusBadge status={windowStatus} />
      </div>

      <div
        className={cn(
          "border-border bg-surface-elevated/50 min-w-[180px] rounded-lg border p-3",
          windowStatus === "invalid" && "border-rose-500/30"
        )}
      >
        {isEmpty ? (
          <div className="text-muted py-2 text-center text-sm italic">Empty</div>
        ) : (
          <div className="flex flex-wrap gap-2">
            <AnimatePresence mode="popLayout">
              {entries.map(([char, count]) => {
                const isDuplicate = count > 1;
                const isHighlighted = duplicateChar === char;

                return (
                  <motion.div
                    key={char}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      opacity: 1,
                      scale: isHighlighted ? 1.1 : 1,
                    }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={SPRING_PRESETS.snappy}
                    className={cn(
                      "flex items-center gap-1.5 rounded-md border px-2.5 py-1.5",
                      isDuplicate
                        ? "border-rose-500/50 bg-rose-500/10"
                        : "border-zinc-600 bg-zinc-800/50"
                    )}
                  >
                    <span
                      className={cn(
                        "font-mono text-sm font-semibold",
                        isDuplicate ? "text-rose-300" : "text-zinc-200"
                      )}
                    >
                      "{char}"
                    </span>
                    <span className="text-muted">:</span>
                    <motion.span
                      key={`${char}-${count}`}
                      initial={{ scale: 1.3 }}
                      animate={{ scale: 1 }}
                      className={cn(
                        "min-w-[1.25rem] text-center font-mono text-sm font-bold",
                        isDuplicate ? "text-rose-400" : "text-emerald-400"
                      )}
                    >
                      {count}
                    </motion.span>
                    {isDuplicate && (
                      <motion.span
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-rose-400"
                      >
                        !
                      </motion.span>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
});

interface StatusBadgeProps {
  status: WindowStatus;
}

function StatusBadge({ status }: StatusBadgeProps) {
  const isValid = status === "valid";

  return (
    <motion.span
      key={status}
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        isValid ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
      )}
    >
      {isValid ? "Valid" : "Invalid"}
    </motion.span>
  );
}
