import { ArrowRight, Clock, Link2 } from "lucide-react";
import Link from "next/link";
import { memo } from "react";
import { getAlgorithmMetadata } from "@/features/algorithms";
import { getGraphAlgorithmMetadata } from "@/features/algorithms/graph/config";
import { getPathfindingAlgorithmMetadata } from "@/features/algorithms/pathfinding/config";
import { getGraphArticle } from "@/features/learning/content/graphs";
import { getInterviewArticle } from "@/features/learning/content/interview";
import { getPathfindingArticle } from "@/features/learning/content/pathfinding";
import type { RelatedAlgorithm } from "@/features/learning/content/sorting";
import { getSortingArticle } from "@/features/learning/content/sorting";
import { getTreeArticle } from "@/features/learning/content/trees";
import type {
  GraphAlgorithmType,
  InterviewProblemType,
  PathfindingAlgorithmType,
  SortingAlgorithmType,
  TreeDataStructureType,
  VisualizerMode,
} from "@/lib/store";
import { cn } from "@/lib/utils";

export interface RelatedAlgorithmsProps {
  /** List of related algorithms to display */
  relatedAlgorithms: RelatedAlgorithm[];
  /** Current mode (used for same-mode links) */
  currentMode: VisualizerMode;
}

/**
 * Get the display name for an algorithm based on its mode.
 */
function getAlgorithmTitle(algorithm: string, mode: VisualizerMode): string {
  switch (mode) {
    case "sorting":
      return getSortingArticle(algorithm as SortingAlgorithmType)?.title ?? algorithm;
    case "pathfinding":
      return getPathfindingArticle(algorithm as PathfindingAlgorithmType)?.title ?? algorithm;
    case "tree":
      return getTreeArticle(algorithm as TreeDataStructureType)?.title ?? algorithm;
    case "graph":
      return getGraphArticle(algorithm as GraphAlgorithmType)?.title ?? algorithm;
    case "interview":
      return getInterviewArticle(algorithm as InterviewProblemType)?.title ?? algorithm;
    default:
      return algorithm;
  }
}

/**
 * Get complexity badge info for an algorithm.
 */
function getComplexityBadge(
  algorithm: string,
  mode: VisualizerMode
): { complexity: string; variant: "excellent" | "good" | "fair" } | null {
  let complexity: string | undefined;

  switch (mode) {
    case "sorting": {
      const meta = getAlgorithmMetadata(algorithm as SortingAlgorithmType);
      complexity = meta?.complexity;
      break;
    }
    case "pathfinding": {
      const meta = getPathfindingAlgorithmMetadata(algorithm as PathfindingAlgorithmType);
      complexity = meta?.complexity;
      break;
    }
    case "tree": {
      const article = getTreeArticle(algorithm as TreeDataStructureType);
      complexity = article?.searchComplexity?.complexity;
      break;
    }
    case "graph": {
      const meta = getGraphAlgorithmMetadata(algorithm as GraphAlgorithmType);
      complexity = meta?.complexity;
      break;
    }
    case "interview": {
      const article = getInterviewArticle(algorithm as InterviewProblemType);
      complexity = article?.timeComplexity?.complexity;
      break;
    }
  }

  if (!complexity) return null;

  // Determine variant based on complexity
  const variant = getComplexityVariant(complexity);
  return { complexity, variant };
}

function getComplexityVariant(complexity: string): "excellent" | "good" | "fair" {
  if (
    (complexity.includes("log n") || complexity.includes("log V")) &&
    !complexity.includes("n log n") &&
    !complexity.includes("E log")
  ) {
    return "excellent";
  }
  if (
    complexity === "O(1)" ||
    complexity === "O(n)" ||
    complexity === "O(V)" ||
    complexity === "O(V + E)" ||
    complexity.includes("n log n") ||
    complexity.includes("E log V") ||
    complexity.includes("E log E")
  ) {
    return "good";
  }
  return "fair";
}

const BADGE_VARIANTS = {
  excellent: "bg-emerald-500/20 text-emerald-500",
  good: "bg-sky-500/20 text-sky-500",
  fair: "bg-amber-500/20 text-amber-500",
} as const;

const MODE_LABELS: Record<VisualizerMode, string> = {
  sorting: "Sorting",
  pathfinding: "Pathfinding",
  tree: "Trees",
  graph: "Graphs",
  interview: "Interview",
  patterns: "Patterns",
};

/**
 * Displays a grid of related algorithm cards for cross-linking on Learn pages.
 * Supports both same-mode and cross-domain links.
 */
export const RelatedAlgorithms = memo(function RelatedAlgorithms({
  relatedAlgorithms,
  currentMode,
}: RelatedAlgorithmsProps) {
  if (relatedAlgorithms.length === 0) return null;

  return (
    <section className="space-y-6">
      <h2 className="text-primary flex items-center gap-3 text-2xl font-semibold">
        <span className="text-accent">
          <Link2 className="h-5 w-5" />
        </span>
        Related Algorithms
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {relatedAlgorithms.map((related) => {
          const targetMode = related.mode ?? currentMode;
          const title = getAlgorithmTitle(related.algorithm, targetMode);
          const badge = getComplexityBadge(related.algorithm, targetMode);
          const isCrossDomain = targetMode !== currentMode;

          return (
            <Link
              key={`${targetMode}-${related.algorithm}`}
              href={`/learn/${targetMode}/${related.algorithm}`}
              className={cn(
                "group relative rounded-xl border border-border bg-surface p-4",
                "transition-all duration-200",
                "hover:border-accent/50 hover:bg-accent/5",
                "focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
              )}
            >
              {/* Cross-domain indicator */}
              {isCrossDomain && (
                <span className="absolute right-3 top-3 rounded-md bg-accent/20 px-2 py-0.5 text-xs text-accent">
                  {MODE_LABELS[targetMode]}
                </span>
              )}

              <div className="space-y-3">
                {/* Algorithm name */}
                <h3 className="text-primary pr-16 font-semibold">{title}</h3>

                {/* Relationship description */}
                <p className="text-muted text-sm leading-relaxed">{related.relationship}</p>

                {/* Footer with complexity badge and arrow */}
                <div className="flex items-center justify-between pt-1">
                  {badge ? (
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium",
                        BADGE_VARIANTS[badge.variant]
                      )}
                    >
                      <Clock className="h-3 w-3" />
                      {badge.complexity}
                    </span>
                  ) : (
                    <span />
                  )}
                  <ArrowRight
                    className={cn(
                      "h-4 w-4 text-muted transition-all duration-200",
                      "group-hover:translate-x-1 group-hover:text-accent"
                    )}
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
});
