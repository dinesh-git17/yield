"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { type StepType, useSorting } from "../context";

export interface CodePanelProps {
  className?: string;
}

/**
 * Maps algorithm step types to their corresponding line indices in the code display.
 * These indices correspond to the yield statements in BUBBLE_SORT_LINES.
 */
const STEP_TYPE_TO_LINE: Record<NonNullable<StepType>, number> = {
  compare: 6,
  swap: 11,
  sorted: 15,
};

const BUBBLE_SORT_LINES = [
  "function* bubbleSort(arr) {",
  "  const n = arr.length;",
  "",
  "  for (let i = 0; i < n - 1; i++) {",
  "    for (let j = 0; j < n - i - 1; j++) {",
  "      // Compare adjacent elements",
  "      yield { type: 'compare', indices: [j, j + 1] };",
  "",
  "      if (arr[j] > arr[j + 1]) {",
  "        // Swap elements",
  "        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];",
  "        yield { type: 'swap', indices: [j, j + 1] };",
  "      }",
  "    }",
  "    // Mark element as sorted",
  "    yield { type: 'sorted', index: n - i - 1 };",
  "  }",
  "",
  "  yield { type: 'sorted', index: 0 };",
  "}",
];

const STEP_TYPE_LABELS: Record<NonNullable<StepType>, string> = {
  compare: "Comparing elements",
  swap: "Swapping elements",
  sorted: "Marking as sorted",
};

export function CodePanel({ className }: CodePanelProps) {
  const { currentStepType, status } = useSorting();

  const highlightedLine = currentStepType ? STEP_TYPE_TO_LINE[currentStepType] : null;
  const stepLabel = currentStepType ? STEP_TYPE_LABELS[currentStepType] : null;
  const displayLine = highlightedLine !== null ? highlightedLine + 1 : null;

  return (
    <div className={cn("flex h-full flex-col", className)}>
      {/* Header */}
      <header className="border-border-subtle flex h-14 shrink-0 items-center justify-between border-b px-6">
        <div className="flex items-center gap-2">
          <CodeIcon />
          <span className="text-primary text-sm font-medium">Code</span>
        </div>
        <button type="button" className="text-muted hover:text-primary text-xs transition-colors">
          Copy
        </button>
      </header>

      {/* Code Display - IDE-style with sticky gutter */}
      <div className="flex-1 overflow-auto">
        <pre className="font-mono text-[13px] leading-7 py-6">
          <code>
            {BUBBLE_SORT_LINES.map((line, lineNumber) => (
              <CodeLine
                key={line || `empty-${lineNumber}`}
                line={line}
                lineNumber={lineNumber}
                isHighlighted={lineNumber === highlightedLine}
              />
            ))}
          </code>
        </pre>
      </div>

      {/* Footer */}
      <footer className="border-border-subtle flex h-10 shrink-0 items-center border-t px-6">
        <span className="text-muted text-xs">
          {status === "idle" && "Ready to start"}
          {status === "complete" && "Sorting complete"}
          {(status === "playing" || status === "paused") &&
            displayLine &&
            stepLabel &&
            `Line ${displayLine}: ${stepLabel}`}
        </span>
      </footer>
    </div>
  );
}

interface CodeLineProps {
  line: string;
  lineNumber: number;
  isHighlighted: boolean;
}

function CodeLine({ line, lineNumber, isHighlighted }: CodeLineProps) {
  return (
    <div className={cn("flex min-h-7", isHighlighted && "bg-accent-muted")}>
      {/* Sticky line number gutter */}
      <span
        className={cn(
          "bg-surface sticky left-0 w-12 shrink-0 select-none pr-4 text-right",
          isHighlighted ? "bg-accent-muted text-accent" : "text-muted/40"
        )}
      >
        {lineNumber + 1}
      </span>
      {/* Code content */}
      <span className="text-primary whitespace-pre pr-6">{highlightSyntax(line) || "\u00A0"}</span>
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
