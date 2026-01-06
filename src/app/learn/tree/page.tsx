import { BookOpen, TreeDeciduous } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  type ComparisonRow,
  ComparisonTable,
  type DecisionCard,
  DecisionGuide,
} from "@/features/learning/components";
import { TREE_ARTICLES } from "@/features/learning/content/trees";
import type { TreeDataStructureType } from "@/lib/store";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Tree Data Structures | Learn",
  description:
    "Compare tree data structures side-by-side. Understand the tradeoffs between BST, AVL, Max Heap, and Splay trees.",
  alternates: {
    canonical: "/learn/tree",
  },
  openGraph: {
    title: "Tree Data Structures — Yield",
    description:
      "Compare BST, AVL, Max Heap, and Splay trees. Interactive comparison tables, decision guides, and live demos.",
    url: "/learn/tree",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tree Data Structures — Yield",
    description: "Compare BST, AVL, Max Heap, and Splay trees side-by-side.",
  },
};

const TREE_ORDER: TreeDataStructureType[] = ["bst", "avl", "max-heap", "splay"];

const TABLE_HEADERS = ["Search", "Insert", "Delete", "Space", "Self-Balancing?"];

function buildTreeRows(): ComparisonRow[] {
  return TREE_ORDER.map((slug) => {
    const article = TREE_ARTICLES[slug];
    return {
      slug,
      name: article.title,
      columns: [
        article.searchComplexity.complexity,
        article.insertComplexity.complexity,
        article.deleteComplexity.complexity,
        article.spaceComplexity.complexity,
        article.selfBalancing,
      ],
    };
  });
}

const DECISION_CARDS: DecisionCard[] = [
  {
    question: "Need guaranteed O(log n) operations?",
    recommendations: [
      { slug: "avl", name: "AVL Tree", reason: "strict balance" },
      { slug: "max-heap", name: "Max Heap", reason: "complete tree" },
    ],
  },
  {
    question: "Simple implementation, don't need guarantees?",
    recommendations: [{ slug: "bst", name: "BST", reason: "simplest" }],
  },
  {
    question: "Frequently accessing recently used elements?",
    recommendations: [{ slug: "splay", name: "Splay Tree", reason: "cache-like behavior" }],
  },
  {
    question: "Need a priority queue?",
    recommendations: [{ slug: "max-heap", name: "Max Heap", reason: "O(1) max access" }],
  },
  {
    question: "Building a database index?",
    recommendations: [
      { slug: "avl", name: "AVL Tree", reason: "balanced reads" },
      { slug: "bst", name: "BST", reason: "if data is random" },
    ],
  },
  {
    question: "Implementing Heap Sort?",
    recommendations: [{ slug: "max-heap", name: "Max Heap", reason: "core data structure" }],
  },
];

export default function TreeIndexPage() {
  const rows = buildTreeRows();

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <header className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="bg-accent/10 text-accent rounded-lg p-2">
            <TreeDeciduous className="h-6 w-6" />
          </span>
          <h1 className="text-primary text-4xl font-bold">Tree Data Structures</h1>
        </div>
        <p className="text-muted max-w-2xl text-lg leading-relaxed">
          Compare 4 tree data structures side-by-side. Understand the tradeoffs between balance
          guarantees, operation complexity, and use cases.
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
        <ComparisonTable mode="tree" headers={TABLE_HEADERS} rows={rows} />
        <p className="text-muted text-sm">
          Click any structure name to read its full article with code examples, history, and use
          cases.
        </p>
      </section>

      {/* Decision Guide */}
      <DecisionGuide title="Quick Decision Guide" mode="tree" cards={DECISION_CARDS} />

      {/* CTA */}
      <section
        className={cn(
          "rounded-xl border border-border bg-gradient-to-r from-accent/5 to-transparent p-8",
          "text-center"
        )}
      >
        <h2 className="text-primary mb-4 text-2xl font-semibold">Ready to See Them in Action?</h2>
        <p className="text-muted mx-auto mb-6 max-w-lg">
          Insert, search, and delete nodes to watch tree operations animate step by step.
        </p>
        <Link
          href="/?mode=tree"
          className={cn(
            "inline-flex items-center gap-2 rounded-lg",
            "bg-accent px-6 py-3 font-medium text-white",
            "transition-colors hover:bg-accent/90"
          )}
        >
          Open Tree Visualizer
        </Link>
      </section>
    </div>
  );
}
