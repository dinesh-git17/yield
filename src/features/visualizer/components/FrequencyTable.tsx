"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { memo, useMemo } from "react";
import type { OptimizationObjective, WindowStatus } from "@/features/algorithms/patterns/types";
import { SPRING_PRESETS } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface FrequencyTableProps {
  frequencyMap: Record<string, number>;
  windowStatus: WindowStatus;
  duplicateChar: string | null;
  /** Target frequency map for constraint-based problems (e.g., min-window-substring) */
  targetFrequencyMap?: Record<string, number>;
  /** Optimization objective - affects display mode */
  objective?: OptimizationObjective;
}

/**
 * FrequencyTable — Live Character Frequency Display.
 *
 * Shows what the algorithm "sees" in the current window.
 * For max objectives: Highlights characters with count > 1 as duplicates.
 * For min objectives: Shows "Current / Required" format with satisfaction indicators.
 */
export const FrequencyTable = memo(function FrequencyTable({
  frequencyMap,
  windowStatus,
  duplicateChar,
  targetFrequencyMap,
  objective = "max",
}: FrequencyTableProps) {
  const hasTarget = targetFrequencyMap && Object.keys(targetFrequencyMap).length > 0;
  const isMinObjective = objective === "min" && hasTarget;

  // For min-window: merge target and frequency maps to show all required chars
  // For max: just use frequency map
  const entries = useMemo(() => {
    if (isMinObjective && targetFrequencyMap) {
      // Get all chars from both maps, prioritize target chars
      const allChars = new Set([...Object.keys(targetFrequencyMap), ...Object.keys(frequencyMap)]);
      return Array.from(allChars)
        .sort((a, b) => a.localeCompare(b))
        .map((char) => ({
          char,
          current: frequencyMap[char] ?? 0,
          required: targetFrequencyMap[char] ?? 0,
          isTargetChar: char in targetFrequencyMap,
        }));
    }
    return Object.entries(frequencyMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([char, count]) => ({
        char,
        current: count,
        required: 0,
        isTargetChar: false,
      }));
  }, [frequencyMap, targetFrequencyMap, isMinObjective]);

  const isEmpty = entries.length === 0;

  // Calculate satisfaction count for min-window header
  const satisfactionInfo = useMemo(() => {
    if (!isMinObjective || !targetFrequencyMap) return null;
    let satisfied = 0;
    let total = 0;
    for (const [char, required] of Object.entries(targetFrequencyMap)) {
      total++;
      if ((frequencyMap[char] ?? 0) >= required) {
        satisfied++;
      }
    }
    return { satisfied, total };
  }, [frequencyMap, targetFrequencyMap, isMinObjective]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <h3 className="text-muted text-xs font-medium uppercase tracking-wider">
          {isMinObjective ? "Have / Need" : "Frequency Map"}
        </h3>
        {isMinObjective && satisfactionInfo ? (
          <SatisfactionBadge
            satisfied={satisfactionInfo.satisfied}
            total={satisfactionInfo.total}
            windowStatus={windowStatus}
          />
        ) : (
          <StatusBadge status={windowStatus} />
        )}
      </div>

      <div
        className={cn(
          "border-border bg-surface-elevated/50 min-w-[180px] rounded-lg border p-3",
          windowStatus === "invalid" && "border-rose-500/30",
          windowStatus === "valid" && isMinObjective && "border-emerald-500/30"
        )}
      >
        {isEmpty ? (
          <div className="text-muted py-2 text-center text-sm italic">
            {isMinObjective ? "Expand window to collect characters" : "Empty"}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            <AnimatePresence mode="popLayout">
              {entries.map(({ char, current, required, isTargetChar }) => {
                if (isMinObjective) {
                  return (
                    <FrequencyEntryMinWindow
                      key={char}
                      char={char}
                      current={current}
                      required={required}
                      isTargetChar={isTargetChar}
                      isHighlighted={duplicateChar === char}
                    />
                  );
                }

                const isDuplicate = current > 1;
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
                      key={`${char}-${current}`}
                      initial={{ scale: 1.3 }}
                      animate={{ scale: 1 }}
                      className={cn(
                        "min-w-[1.25rem] text-center font-mono text-sm font-bold",
                        isDuplicate ? "text-rose-400" : "text-emerald-400"
                      )}
                    >
                      {current}
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

interface FrequencyEntryMinWindowProps {
  char: string;
  current: number;
  required: number;
  isTargetChar: boolean;
  isHighlighted: boolean;
}

/**
 * Frequency entry for min-window problems showing Current/Required format.
 */
const FrequencyEntryMinWindow = memo(function FrequencyEntryMinWindow({
  char,
  current,
  required,
  isTargetChar,
  isHighlighted,
}: FrequencyEntryMinWindowProps) {
  const isSatisfied = isTargetChar && current >= required;
  const isMissing = isTargetChar && current < required;

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
        isSatisfied && "border-emerald-500/50 bg-emerald-500/10",
        isMissing && "border-amber-500/50 bg-amber-500/10",
        !isTargetChar && "border-zinc-600 bg-zinc-800/50"
      )}
    >
      <span
        className={cn(
          "font-mono text-sm font-semibold",
          isSatisfied && "text-emerald-300",
          isMissing && "text-amber-300",
          !isTargetChar && "text-zinc-400"
        )}
      >
        "{char}"
      </span>
      <span className="text-muted">:</span>
      <div className="flex items-center gap-0.5">
        <motion.span
          key={`${char}-${current}`}
          initial={{ scale: 1.3 }}
          animate={{ scale: 1 }}
          className={cn(
            "min-w-[1rem] text-center font-mono text-sm font-bold",
            isSatisfied && "text-emerald-400",
            isMissing && "text-amber-400",
            !isTargetChar && "text-zinc-500"
          )}
        >
          {current}
        </motion.span>
        {isTargetChar && (
          <>
            <span className="text-muted text-xs">/</span>
            <span
              className={cn(
                "min-w-[1rem] text-center font-mono text-sm",
                isSatisfied ? "text-emerald-400/60" : "text-amber-400/60"
              )}
            >
              {required}
            </span>
          </>
        )}
      </div>
      {/* Satisfaction indicator */}
      {isTargetChar && (
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="ml-0.5"
        >
          {isSatisfied ? (
            <Check className="h-3.5 w-3.5 text-emerald-400" />
          ) : (
            <X className="h-3.5 w-3.5 text-amber-400" />
          )}
        </motion.span>
      )}
    </motion.div>
  );
});

interface SatisfactionBadgeProps {
  satisfied: number;
  total: number;
  windowStatus: WindowStatus;
}

/**
 * Shows satisfaction count for min-window problems (e.g., "2/3 chars").
 */
function SatisfactionBadge({ satisfied, total, windowStatus }: SatisfactionBadgeProps) {
  const isComplete = satisfied === total;

  return (
    <motion.span
      key={`${satisfied}-${total}`}
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        isComplete
          ? "bg-emerald-500/10 text-emerald-400"
          : windowStatus === "invalid"
            ? "bg-amber-500/10 text-amber-400"
            : "bg-zinc-500/10 text-zinc-400"
      )}
    >
      {satisfied}/{total} chars
    </motion.span>
  );
}

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
