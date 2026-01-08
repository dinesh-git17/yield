"use client";

import { motion } from "framer-motion";
import { memo, useMemo } from "react";
import type { CharacterBoxData, CharacterBoxState } from "@/features/algorithms/hooks";
import type { WindowStatus } from "@/features/algorithms/patterns/types";
import { SPRING_PRESETS } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface WindowArrayProps {
  characters: CharacterBoxData[];
  window: { start: number; end: number };
  windowStatus: WindowStatus;
  duplicateChar: string | null;
  speed: number;
}

/**
 * Maps character box states to their visual styles.
 * Extended to support constraint-satisfied state for min-window problems.
 */
const STATE_STYLES: Record<CharacterBoxState, string> = {
  idle: "bg-zinc-800/50 text-zinc-400 border-zinc-700",
  "in-window": "bg-emerald-500/20 text-emerald-300 border-emerald-500/50",
  entering: "bg-sky-500/30 text-sky-200 border-sky-400",
  leaving: "bg-amber-500/30 text-amber-200 border-amber-400",
  duplicate: "bg-rose-500/30 text-rose-200 border-rose-400",
  best: "bg-violet-500/30 text-violet-200 border-violet-400",
  "constraint-satisfied": "bg-teal-500/30 text-teal-200 border-teal-400",
};

/**
 * Character box dimensions and spacing.
 */
const BOX_SIZE = 48;
const BOX_GAP = 4;

/**
 * WindowArray — The Sliding Window Visualizer.
 *
 * Renders the input string as character boxes with an animated
 * "glass window" overlay that shows the current window boundaries.
 * Includes Left (L) and Right (R) pointer indicators.
 */
export const WindowArray = memo(function WindowArray({
  characters,
  window,
  windowStatus,
  duplicateChar,
  speed,
}: WindowArrayProps) {
  // Calculate window overlay position and width
  const windowStyle = useMemo(() => {
    if (window.end < window.start || window.end < 0) {
      return { width: 0, x: 0, visible: false };
    }

    const width = (window.end - window.start + 1) * (BOX_SIZE + BOX_GAP) - BOX_GAP + 8;
    const x = window.start * (BOX_SIZE + BOX_GAP) - 4;

    return { width, x, visible: true };
  }, [window.start, window.end]);

  // Determine window overlay color based on status
  const windowColor =
    windowStatus === "valid"
      ? "border-emerald-400/60 bg-emerald-500/5"
      : "border-rose-400/60 bg-rose-500/5";

  return (
    <div className="relative flex flex-col items-center gap-8">
      {/* Array Container */}
      <div className="relative">
        {/* Character Boxes */}
        <div className="relative flex items-center gap-1" style={{ gap: BOX_GAP }}>
          {characters.map((char) => (
            <CharacterBox
              key={char.id}
              char={char.char}
              index={char.index}
              state={char.state}
              isDuplicate={duplicateChar === char.char && char.isInWindow}
              speed={speed}
            />
          ))}
        </div>

        {/* Window Overlay */}
        {windowStyle.visible && (
          <motion.div
            className={cn(
              "pointer-events-none absolute -top-2 -bottom-2 rounded-lg border-2 backdrop-blur-[1px]",
              windowColor
            )}
            initial={{ width: 0, x: 0, opacity: 0 }}
            animate={{
              width: windowStyle.width,
              x: windowStyle.x,
              opacity: 1,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
          >
            {/* Left Pointer Label */}
            <motion.div
              className="absolute -top-7 left-0 flex flex-col items-center"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={SPRING_PRESETS.snappy}
            >
              <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-xs font-bold text-amber-400">
                L
              </span>
              <div className="h-1 w-px bg-amber-400/50" />
            </motion.div>

            {/* Right Pointer Label */}
            <motion.div
              className="absolute -top-7 right-0 flex flex-col items-center"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={SPRING_PRESETS.snappy}
            >
              <span className="rounded bg-sky-500/20 px-1.5 py-0.5 text-xs font-bold text-sky-400">
                R
              </span>
              <div className="h-1 w-px bg-sky-400/50" />
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Index Labels */}
      <div className="flex items-center" style={{ gap: BOX_GAP }}>
        {characters.map((char) => (
          <div
            key={`index-${char.index}`}
            className="text-muted flex items-center justify-center text-[10px] tabular-nums"
            style={{ width: BOX_SIZE }}
          >
            {char.index}
          </div>
        ))}
      </div>
    </div>
  );
});

interface CharacterBoxProps {
  char: string;
  index: number;
  state: CharacterBoxState;
  isDuplicate: boolean;
  speed: number;
}

/**
 * Individual character box with animation support.
 */
const CharacterBox = memo(
  function CharacterBox({ char, state, isDuplicate }: CharacterBoxProps) {
    const stateStyle = STATE_STYLES[state];
    const isHighlighted =
      state === "entering" || state === "leaving" || state === "duplicate" || state === "best";

    return (
      <motion.div
        className={cn(
          "flex items-center justify-center rounded-md border-2 font-mono text-lg font-semibold",
          "transition-colors duration-150",
          stateStyle
        )}
        style={{
          width: BOX_SIZE,
          height: BOX_SIZE,
        }}
        animate={{
          scale: isHighlighted ? 1.1 : 1,
          y: state === "entering" ? -4 : state === "leaving" ? 4 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25,
        }}
      >
        {char}

        {/* Duplicate indicator pulse */}
        {isDuplicate && state === "duplicate" && (
          <motion.div
            className="absolute inset-0 rounded-md border-2 border-rose-400"
            initial={{ opacity: 0.8, scale: 1 }}
            animate={{ opacity: 0, scale: 1.3 }}
            transition={{
              duration: 0.6,
              repeat: 2,
              ease: "easeOut",
            }}
          />
        )}
      </motion.div>
    );
  },
  (prev, next) =>
    prev.char === next.char && prev.state === next.state && prev.isDuplicate === next.isDuplicate
);
