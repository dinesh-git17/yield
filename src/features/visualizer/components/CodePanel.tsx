"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Clipboard } from "lucide-react";
import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getAlgorithmMetadata, STEP_TYPE_LABELS } from "@/features/algorithms";
import {
  getPathfindingAlgorithmMetadata,
  PATHFINDING_STEP_LABELS,
} from "@/features/algorithms/pathfinding";
import { buttonInteraction, SPRING_PRESETS } from "@/lib/motion";
import { useYieldStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { usePathfinding, useSorting } from "../context";

export interface CodePanelProps {
  className?: string;
}

const COPY_FEEDBACK_DURATION = 2000;
const LINE_HEIGHT_PX = 28;

export function CodePanel({ className }: CodePanelProps) {
  const mode = useYieldStore((state) => state.mode);
  const sortingAlgorithm = useYieldStore((state) => state.sortingAlgorithm);
  const pathfindingAlgorithm = useYieldStore((state) => state.pathfindingAlgorithm);

  // Get context values based on mode
  const sortingContext = useSorting();
  const pathfindingContext = usePathfinding();

  const [isCopied, setIsCopied] = useState(false);
  const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Derive mode-specific values
  const { status, codeLines, stepLabel, algorithmKey, highlightedLine } = useMemo(() => {
    if (mode === "sorting") {
      const metadata = getAlgorithmMetadata(sortingAlgorithm);
      const stepType = sortingContext.currentStepType;
      const lineIndex = stepType ? (metadata.lineMapping[stepType] ?? null) : null;
      return {
        status: sortingContext.status,
        codeLines: metadata.code,
        stepLabel: stepType ? STEP_TYPE_LABELS[stepType] : null,
        algorithmKey: sortingAlgorithm,
        highlightedLine: lineIndex,
      };
    }
    const metadata = getPathfindingAlgorithmMetadata(pathfindingAlgorithm);
    const stepType = pathfindingContext.currentStepType;
    const lineIndex = stepType ? (metadata.lineMapping[stepType] ?? null) : null;
    return {
      status: pathfindingContext.status,
      codeLines: metadata.code,
      stepLabel: stepType ? PATHFINDING_STEP_LABELS[stepType] : null,
      algorithmKey: pathfindingAlgorithm,
      highlightedLine: lineIndex,
    };
  }, [
    mode,
    sortingAlgorithm,
    pathfindingAlgorithm,
    sortingContext.currentStepType,
    sortingContext.status,
    pathfindingContext.currentStepType,
    pathfindingContext.status,
  ]);

  const displayLine = highlightedLine !== null ? highlightedLine + 1 : null;

  const handleCopy = useCallback(async () => {
    const code = codeLines.join("\n");
    await navigator.clipboard.writeText(code);

    setIsCopied(true);

    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current);
    }
    copyTimeoutRef.current = setTimeout(() => {
      setIsCopied(false);
    }, COPY_FEEDBACK_DURATION);
  }, [codeLines]);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={cn("flex h-full flex-col", className)}>
      {/* Header */}
      <header className="border-border-subtle flex h-14 shrink-0 items-center justify-between border-b px-6">
        <div className="flex items-center gap-2">
          <CodeIcon />
          <span className="text-primary text-sm font-medium">Code</span>
        </div>
        <CopyButton isCopied={isCopied} onClick={handleCopy} />
      </header>

      {/* Code Display - IDE-style with sticky gutter */}
      <div className="flex-1 overflow-auto">
        <pre className="font-mono text-[13px] leading-7 py-6">
          <code className="relative block">
            {/* Single persistent highlight that animates position (sorting only) */}
            <AnimatePresence>
              {mode === "sorting" && highlightedLine !== null && (
                <motion.div
                  className="bg-accent-muted pointer-events-none absolute left-0 right-0 z-0"
                  style={{ height: LINE_HEIGHT_PX }}
                  initial={{ opacity: 0, y: highlightedLine * LINE_HEIGHT_PX }}
                  animate={{ opacity: 1, y: highlightedLine * LINE_HEIGHT_PX }}
                  exit={{ opacity: 0 }}
                  transition={SPRING_PRESETS.entrance}
                  aria-hidden="true"
                />
              )}
            </AnimatePresence>
            {codeLines.map((line, lineNumber) => (
              <CodeLine
                // biome-ignore lint/suspicious/noArrayIndexKey: Code lines are static per algorithm and don't reorder
                key={`${algorithmKey}-${lineNumber}`}
                line={line}
                lineNumber={lineNumber}
                isHighlighted={mode === "sorting" && lineNumber === highlightedLine}
              />
            ))}
          </code>
        </pre>
      </div>

      {/* Footer */}
      <footer className="border-border-subtle flex h-10 shrink-0 items-center border-t px-6">
        <span className="text-muted text-xs">
          {mode === "sorting" ? (
            <>
              {status === "idle" && "Ready to start"}
              {status === "complete" && "Sorting complete"}
              {(status === "playing" || status === "paused") &&
                displayLine &&
                stepLabel &&
                `Line ${displayLine}: ${stepLabel}`}
            </>
          ) : (
            <>
              {status === "idle" && "Ready to visualize"}
              {status === "complete" && "Pathfinding complete"}
              {(status === "playing" || status === "paused") && "Visualizing..."}
            </>
          )}
        </span>
      </footer>
    </div>
  );
}

interface CopyButtonProps {
  isCopied: boolean;
  onClick: () => void;
}

function CopyButton({ isCopied, onClick }: CopyButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={buttonInteraction.hover}
      whileTap={buttonInteraction.tap}
      transition={SPRING_PRESETS.snappy}
      className={cn(
        "flex items-center gap-1.5 text-xs transition-colors",
        isCopied ? "text-green-500" : "text-muted hover:text-primary"
      )}
      aria-label={isCopied ? "Copied!" : "Copy code"}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isCopied ? "check" : "clipboard"}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="flex items-center"
        >
          {isCopied ? <Check className="h-3.5 w-3.5" /> : <Clipboard className="h-3.5 w-3.5" />}
        </motion.span>
      </AnimatePresence>
      {isCopied ? "Copied!" : "Copy"}
    </motion.button>
  );
}

interface CodeLineProps {
  line: string;
  lineNumber: number;
  isHighlighted: boolean;
}

function CodeLine({ line, lineNumber, isHighlighted }: CodeLineProps) {
  return (
    <div className="relative flex min-h-7">
      {/* Sticky line number gutter */}
      <span
        className={cn(
          "sticky left-0 z-10 w-12 shrink-0 select-none pr-4 text-right transition-colors duration-150",
          isHighlighted ? "text-accent" : "text-muted/40"
        )}
      >
        {lineNumber + 1}
      </span>
      {/* Code content */}
      <span className="text-primary relative z-10 whitespace-pre pr-6">
        {highlightSyntax(line) || "\u00A0"}
      </span>
    </div>
  );
}

const KEYWORDS = ["function*", "function", "const", "let", "var", "yield", "for", "if", "return"];
const KEYWORD_PATTERN = new RegExp(`\\b(${KEYWORDS.join("|")})\\b`, "g");

function highlightSyntax(line: string): ReactNode {
  if (line.trim().startsWith("//")) {
    return <span className="text-muted/60 italic">{line}</span>;
  }

  const parts: ReactNode[] = [];
  let lastIndex = 0;
  const regex = new RegExp(KEYWORD_PATTERN);

  for (let match = regex.exec(line); match !== null; match = regex.exec(line)) {
    if (match.index > lastIndex) {
      parts.push(line.slice(lastIndex, match.index));
    }
    parts.push(
      <span key={match.index} className="text-accent">
        {match[0]}
      </span>
    );
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < line.length) {
    parts.push(line.slice(lastIndex));
  }

  return parts.length > 0 ? parts : line;
}

function CodeIcon() {
  return (
    <svg
      className="text-muted h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-label="Code"
      role="img"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
      />
    </svg>
  );
}
