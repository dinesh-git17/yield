import { ArrowUpDown, BookOpen } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  type ComparisonRow,
  ComparisonTable,
  type DecisionCard,
  DecisionGuide,
} from "@/features/learning/components";
import { SORTING_ARTICLES } from "@/features/learning/content/sorting";
import type { SortingAlgorithmType } from "@/lib/store";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Sorting Algorithms | Learn",
  description:
    "Compare sorting algorithms side-by-side. Find the right algorithm for your use case with our interactive comparison tables and decision guides.",
  alternates: {
    canonical: "/learn/sorting",
  },
  openGraph: {
    title: "Sorting Algorithms — Yield",
    description:
      "Compare Bubble, Quick, Merge, Heap and more sorting algorithms. Interactive comparison tables, decision guides, and live demos.",
    url: "/learn/sorting",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sorting Algorithms — Yield",
    description: "Compare Bubble, Quick, Merge, Heap and more sorting algorithms side-by-side.",
  },
};

const SORTING_ORDER: SortingAlgorithmType[] = [
  "bubble",
  "selection",
  "insertion",
  "gnome",
  "quick",
  "merge",
  "heap",
];

const TABLE_HEADERS = ["Best", "Average", "Worst", "Space", "Stable?", "In-Place?"];

function buildSortingRows(): ComparisonRow[] {
  return SORTING_ORDER.map((slug) => {
    const article = SORTING_ARTICLES[slug];
    return {
      slug,
      name: article.title,
      columns: [
        article.bestCase.complexity,
        article.averageCase.complexity,
        article.worstCase.complexity,
        article.spaceComplexity.complexity,
        article.isStable,
        article.isInPlace,
      ],
    };
  });
}

const DECISION_CARDS: DecisionCard[] = [
  {
    question: "Need stability? (preserve order of equal elements)",
    recommendations: [
      { slug: "merge", name: "Merge Sort", reason: "O(n log n)" },
      { slug: "insertion", name: "Insertion Sort", reason: "small arrays" },
      { slug: "bubble", name: "Bubble Sort", reason: "educational" },
    ],
  },
  {
    question: "Working with nearly sorted data?",
    recommendations: [
      { slug: "insertion", name: "Insertion Sort", reason: "O(n) best case" },
      { slug: "bubble", name: "Bubble Sort", reason: "early exit" },
    ],
  },
  {
    question: "Need guaranteed O(n log n) performance?",
    recommendations: [
      { slug: "merge", name: "Merge Sort", reason: "consistent" },
      { slug: "heap", name: "Heap Sort", reason: "in-place" },
    ],
  },
  {
    question: "Memory constrained environment?",
    recommendations: [
      { slug: "heap", name: "Heap Sort", reason: "O(1) space" },
      { slug: "quick", name: "Quick Sort", reason: "O(log n) stack" },
    ],
  },
  {
    question: "General purpose, fastest average case?",
    recommendations: [
      { slug: "quick", name: "Quick Sort", reason: "cache efficient" },
      { slug: "merge", name: "Merge Sort", reason: "parallelizable" },
    ],
  },
  {
    question: "Teaching or learning algorithms?",
    recommendations: [
      { slug: "bubble", name: "Bubble Sort", reason: "simplest" },
      { slug: "selection", name: "Selection Sort", reason: "predictable" },
      { slug: "insertion", name: "Insertion Sort", reason: "intuitive" },
    ],
  },
];

export default function SortingIndexPage() {
  const rows = buildSortingRows();

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <header className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="bg-accent/10 text-accent rounded-lg p-2">
            <ArrowUpDown className="h-6 w-6" />
          </span>
          <h1 className="text-primary text-4xl font-bold">Sorting Algorithms</h1>
        </div>
        <p className="text-muted max-w-2xl text-lg leading-relaxed">
          Compare 7 sorting algorithms side-by-side. Use the table below to find the right algorithm
          for your use case, or check the decision guide for quick recommendations.
        </p>
      </header>

      {/* Comparison Table */}
      <section className="space-y-6">
        <h2 className="text-primary flex items-center gap-3 text-2xl font-semibold">
          <span className="text-accent">
            <BookOpen className="h-5 w-5" />
          </span>
          Complexity Comparison
        </h2>
        <ComparisonTable mode="sorting" headers={TABLE_HEADERS} rows={rows} />
        <p className="text-muted text-sm">
          Click any algorithm name to read its full article with code examples, history, and use
          cases.
        </p>
      </section>

      {/* Decision Guide */}
      <DecisionGuide title="Quick Decision Guide" mode="sorting" cards={DECISION_CARDS} />

      {/* CTA */}
      <section
        className={cn(
          "rounded-xl border border-border bg-gradient-to-r from-accent/5 to-transparent p-8",
          "text-center"
        )}
      >
        <h2 className="text-primary mb-4 text-2xl font-semibold">Ready to See Them in Action?</h2>
        <p className="text-muted mx-auto mb-6 max-w-lg">
          Watch sorting algorithms race against each other with our interactive visualizer.
        </p>
        <Link
          href="/?mode=sorting"
          className={cn(
            "inline-flex items-center gap-2 rounded-lg",
            "bg-accent px-6 py-3 font-medium text-white",
            "transition-colors hover:bg-accent/90"
          )}
        >
          Open Sorting Visualizer
        </Link>
      </section>
    </div>
  );
}
