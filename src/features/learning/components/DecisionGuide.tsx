import { ArrowRight, HelpCircle } from "lucide-react";
import Link from "next/link";
import { memo } from "react";
import type { VisualizerMode } from "@/lib/store";
import { cn } from "@/lib/utils";

/**
 * Represents a single decision card with a question and recommendations.
 */
export interface DecisionCard {
  /** The question users might ask */
  question: string;
  /** Recommended algorithm/structure slugs */
  recommendations: {
    slug: string;
    name: string;
    reason?: string;
  }[];
}

export interface DecisionGuideProps {
  /** Section title */
  title: string;
  /** Current mode for link generation */
  mode: VisualizerMode;
  /** Decision cards to display */
  cards: DecisionCard[];
}

/**
 * Decision guide component showing common questions and recommended algorithms.
 * Helps users quickly identify which algorithm fits their needs.
 */
export const DecisionGuide = memo(function DecisionGuide({
  title,
  mode,
  cards,
}: DecisionGuideProps) {
  return (
    <section className="space-y-6">
      <h2 className="text-primary flex items-center gap-3 text-2xl font-semibold">
        <span className="text-accent">
          <HelpCircle className="h-5 w-5" />
        </span>
        {title}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <div
            key={card.question}
            className={cn("rounded-xl border border-border bg-surface p-5", "space-y-4")}
          >
            <p className="text-primary font-medium">{card.question}</p>
            <div className="flex flex-wrap gap-2">
              {card.recommendations.map((rec) => (
                <Link
                  key={rec.slug}
                  href={`/learn/${mode}/${rec.slug}`}
                  className={cn(
                    "group inline-flex items-center gap-2 rounded-lg",
                    "bg-accent/10 px-3 py-1.5",
                    "text-sm text-accent transition-colors",
                    "hover:bg-accent/20"
                  )}
                >
                  <span className="font-medium">{rec.name}</span>
                  {rec.reason && <span className="text-muted text-xs">({rec.reason})</span>}
                  <ArrowRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
});
