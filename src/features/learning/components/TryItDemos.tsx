import { Play } from "lucide-react";
import Link from "next/link";
import { memo } from "react";
import type { SortingDemo } from "@/features/learning/content/sorting";
import type { SortingAlgorithmType } from "@/lib/store";
import { cn } from "@/lib/utils";

export interface TryItDemosProps {
  /** The sorting algorithm slug for URL generation */
  algorithm: SortingAlgorithmType;
  /** List of demo presets to display */
  demos: SortingDemo[];
}

/**
 * Formats an array for preview display.
 * Shows first 5 elements with ellipsis if longer.
 */
function formatArrayPreview(array: number[]): string {
  const maxPreview = 5;
  if (array.length <= maxPreview) {
    return `[${array.join(", ")}]`;
  }
  const preview = array.slice(0, maxPreview);
  return `[${preview.join(", ")}, ...]`;
}

/**
 * Builds the URL for a demo link with array parameter.
 */
function buildDemoUrl(algorithm: SortingAlgorithmType, array: number[]): string {
  const arrayParam = array.join(",");
  return `/?mode=sorting&algorithm=${algorithm}&array=${arrayParam}`;
}

/**
 * Displays "Try It Yourself" demo cards for sorting algorithms.
 * Each card links to the visualizer with a pre-configured input array
 * to demonstrate specific algorithm behavior (best/worst case, etc).
 */
export const TryItDemos = memo(function TryItDemos({ algorithm, demos }: TryItDemosProps) {
  if (demos.length === 0) return null;

  return (
    <section className="space-y-6">
      <h2 className="text-primary flex items-center gap-3 text-2xl font-semibold">
        <span className="text-accent">
          <Play className="h-5 w-5" />
        </span>
        Try It Yourself
      </h2>
      <p className="text-muted">
        Watch how this algorithm behaves on different inputs. Click a demo to launch the visualizer.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {demos.map((demo) => (
          <Link
            key={demo.label}
            href={buildDemoUrl(algorithm, demo.array)}
            className={cn(
              "group relative rounded-xl border border-border bg-surface p-4",
              "transition-all duration-200",
              "hover:border-accent/50 hover:bg-accent/5",
              "focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
            )}
          >
            <div className="space-y-3">
              {/* Demo label */}
              <div className="flex items-center justify-between">
                <h3 className="text-primary font-semibold">{demo.label}</h3>
                <Play
                  className={cn(
                    "h-4 w-4 text-muted transition-all duration-200",
                    "group-hover:scale-110 group-hover:text-accent"
                  )}
                />
              </div>

              {/* Description */}
              <p className="text-muted text-sm leading-relaxed">{demo.description}</p>

              {/* Array preview */}
              <div className="pt-1">
                <span
                  className={cn(
                    "inline-block rounded-md bg-muted/20 px-2 py-1",
                    "font-mono text-xs text-primary/70"
                  )}
                >
                  {formatArrayPreview(demo.array)}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
});
