import { BookOpen, Network } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  type ComparisonRow,
  ComparisonTable,
  type DecisionCard,
  DecisionGuide,
} from "@/features/learning/components";
import { GRAPH_ARTICLES } from "@/features/learning/content/graphs";
import type { GraphAlgorithmType } from "@/lib/store";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Graph Algorithms | Learn",
  description:
    "Compare graph algorithms side-by-side. Understand MST algorithms, topological sorting, and when to use each.",
  alternates: {
    canonical: "/learn/graph",
  },
  openGraph: {
    title: "Graph Algorithms — Yield",
    description:
      "Compare Prim's, Kruskal's MST and Kahn's topological sort. Interactive comparison tables, decision guides, and live demos.",
    url: "/learn/graph",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Graph Algorithms — Yield",
    description: "Compare Prim's, Kruskal's MST and Kahn's topological sort side-by-side.",
  },
};

const GRAPH_ORDER: GraphAlgorithmType[] = ["prim", "kruskal", "kahn"];

const TABLE_HEADERS = ["Time", "Space", "Output", "Data Structure"];

function buildGraphRows(): ComparisonRow[] {
  return GRAPH_ORDER.map((slug) => {
    const article = GRAPH_ARTICLES[slug];
    return {
      slug,
      name: article.title,
      columns: [
        article.timeComplexity.complexity,
        article.spaceComplexity.complexity,
        article.output,
        article.dataStructure,
      ],
    };
  });
}

const DECISION_CARDS: DecisionCard[] = [
  {
    question: "Need a Minimum Spanning Tree?",
    recommendations: [
      { slug: "prim", name: "Prim's", reason: "dense graphs" },
      { slug: "kruskal", name: "Kruskal's", reason: "sparse graphs" },
    ],
  },
  {
    question: "Graph is dense (many edges)?",
    recommendations: [{ slug: "prim", name: "Prim's", reason: "vertex-focused" }],
  },
  {
    question: "Graph is sparse (few edges)?",
    recommendations: [{ slug: "kruskal", name: "Kruskal's", reason: "edge-focused" }],
  },
  {
    question: "Need topological ordering (DAG)?",
    recommendations: [{ slug: "kahn", name: "Kahn's", reason: "BFS-based" }],
  },
  {
    question: "Building a network or connecting cities?",
    recommendations: [
      { slug: "prim", name: "Prim's", reason: "grows from seed" },
      { slug: "kruskal", name: "Kruskal's", reason: "sorts edges" },
    ],
  },
  {
    question: "Resolving build dependencies?",
    recommendations: [{ slug: "kahn", name: "Kahn's", reason: "topological sort" }],
  },
];

export default function GraphIndexPage() {
  const rows = buildGraphRows();

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <header className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="bg-accent/10 text-accent rounded-lg p-2">
            <Network className="h-6 w-6" />
          </span>
          <h1 className="text-primary text-4xl font-bold">Graph Algorithms</h1>
        </div>
        <p className="text-muted max-w-2xl text-lg leading-relaxed">
          Compare 3 graph algorithms side-by-side. From Minimum Spanning Trees to topological
          sorting, find the right algorithm for your graph problem.
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
        <ComparisonTable mode="graph" headers={TABLE_HEADERS} rows={rows} />
        <p className="text-muted text-sm">
          Click any algorithm name to read its full article with code examples, history, and use
          cases.
        </p>
      </section>

      {/* Decision Guide */}
      <DecisionGuide title="Quick Decision Guide" mode="graph" cards={DECISION_CARDS} />

      {/* CTA */}
      <section
        className={cn(
          "rounded-xl border border-border bg-gradient-to-r from-accent/5 to-transparent p-8",
          "text-center"
        )}
      >
        <h2 className="text-primary mb-4 text-2xl font-semibold">Ready to See Them in Action?</h2>
        <p className="text-muted mx-auto mb-6 max-w-lg">
          Build graphs, adjust edge weights, and watch MST and topological sorting algorithms run.
        </p>
        <Link
          href="/?mode=graph"
          className={cn(
            "inline-flex items-center gap-2 rounded-lg",
            "bg-accent px-6 py-3 font-medium text-white",
            "transition-colors hover:bg-accent/90"
          )}
        >
          Open Graph Visualizer
        </Link>
      </section>
    </div>
  );
}
