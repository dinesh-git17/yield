import { Check, Clock, X } from "lucide-react";
import Link from "next/link";
import { memo } from "react";
import type { VisualizerMode } from "@/lib/store";
import { cn } from "@/lib/utils";

/**
 * Represents a row in the comparison table.
 */
export interface ComparisonRow {
  /** Algorithm/structure slug for linking */
  slug: string;
  /** Display name */
  name: string;
  /** Mode-specific data columns */
  columns: (string | boolean)[];
}

export interface ComparisonTableProps {
  /** Current mode for link generation */
  mode: VisualizerMode;
  /** Column headers for the table */
  headers: string[];
  /** Data rows */
  rows: ComparisonRow[];
}

const COMPLEXITY_COLORS: Record<string, string> = {
  "O(1)": "text-emerald-500",
  "O(log n)": "text-emerald-500",
  "O(log V)": "text-emerald-500",
  "O(n)": "text-sky-500",
  "O(V)": "text-sky-500",
  "O(V + E)": "text-sky-500",
  "O(n log n)": "text-sky-500",
  "O(E log V)": "text-sky-500",
  "O(E log E)": "text-sky-500",
  "O(E α(V))": "text-sky-500",
  "O(n²)": "text-amber-500",
  "O(V²)": "text-amber-500",
};

function getComplexityColor(complexity: string): string {
  return COMPLEXITY_COLORS[complexity] ?? "text-muted";
}

/**
 * Renders a cell value based on its type.
 * - Booleans render as check/x icons
 * - Strings render as text with complexity coloring
 */
function renderCellValue(value: string | boolean): React.ReactNode {
  if (typeof value === "boolean") {
    return value ? (
      <Check className="mx-auto h-4 w-4 text-emerald-500" />
    ) : (
      <X className="mx-auto h-4 w-4 text-rose-500/50" />
    );
  }

  const colorClass = getComplexityColor(value);
  return (
    <span className={cn("inline-flex items-center gap-1", colorClass)}>
      {value.startsWith("O(") && <Clock className="h-3 w-3" />}
      {value}
    </span>
  );
}

/**
 * Comparison table component for Learn index pages.
 * Displays algorithms side-by-side with their key metrics.
 */
export const ComparisonTable = memo(function ComparisonTable({
  mode,
  headers,
  rows,
}: ComparisonTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-surface">
            <th className="text-primary sticky left-0 z-10 bg-surface px-4 py-3 text-left font-semibold">
              Algorithm
            </th>
            {headers.map((header) => (
              <th
                key={header}
                className="text-muted whitespace-nowrap px-4 py-3 text-center font-medium"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={row.slug}
              className={cn(
                "border-t border-border transition-colors hover:bg-accent/5",
                index % 2 === 0 ? "bg-background" : "bg-surface/30"
              )}
            >
              <td className="text-primary sticky left-0 z-10 bg-inherit px-4 py-3 font-medium">
                <Link
                  href={`/learn/${mode}/${row.slug}`}
                  className="hover:text-accent hover:underline"
                >
                  {row.name}
                </Link>
              </td>
              {row.columns.map((value, colIndex) => (
                <td
                  key={`${row.slug}-${headers[colIndex]}`}
                  className="whitespace-nowrap px-4 py-3 text-center"
                >
                  {renderCellValue(value)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});
