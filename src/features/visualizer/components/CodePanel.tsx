"use client";

import { cn } from "@/lib/utils";

export interface CodePanelProps {
  className?: string;
}

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

export function CodePanel({ className }: CodePanelProps) {
  return (
    <div className={cn("flex h-full flex-col", className)}>
      {/* Header */}
      <header className="border-border-subtle flex h-14 shrink-0 items-center justify-between border-b px-4">
        <div className="flex items-center gap-2">
          <CodeIcon />
          <span className="text-primary text-sm font-medium">Code</span>
        </div>
        <button type="button" className="text-muted hover:text-primary text-xs transition-colors">
          Copy
        </button>
      </header>

      {/* Code Display */}
      <div className="flex-1 overflow-auto p-4">
        <pre className="font-mono text-xs leading-relaxed">
          <code>
            {BUBBLE_SORT_LINES.map((line, lineNumber) => (
              <CodeLine
                key={line || `empty-${lineNumber}`}
                line={line}
                lineNumber={lineNumber}
                isHighlighted={lineNumber === 6}
              />
            ))}
          </code>
        </pre>
      </div>

      {/* Footer */}
      <footer className="border-border-subtle flex h-10 shrink-0 items-center border-t px-4">
        <span className="text-muted text-xs">Line 7: Comparing elements</span>
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
    <div className={cn("flex", isHighlighted && "bg-accent-muted -mx-4 px-4")}>
      <span className="text-muted mr-4 w-5 select-none text-right">{lineNumber + 1}</span>
      <span className="text-primary">{line}</span>
    </div>
  );
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
