import {
  ArrowRight,
  ArrowUpDown,
  BookOpen,
  Code2,
  Layers,
  Network,
  Route,
  Sparkles,
  TreeDeciduous,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Learn Algorithms",
  description:
    "Master algorithms through interactive learning. Explore sorting, pathfinding, trees, and graph algorithms with side-by-side comparisons, decision guides, and live demos.",
  alternates: {
    canonical: "/learn",
  },
  openGraph: {
    title: "Learn Algorithms — Yield",
    description:
      "Master algorithms through interactive learning. Explore sorting, pathfinding, trees, and graph algorithms with side-by-side comparisons, decision guides, and live demos.",
    url: "/learn",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Learn Algorithms — Yield",
    description:
      "Master algorithms through interactive learning. Explore sorting, pathfinding, trees, and graph algorithms.",
  },
};

interface ModeCardProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  algorithmCount: number;
  description: string;
}

function ModeCard({ href, icon, title, algorithmCount, description }: ModeCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex flex-col gap-4 rounded-xl border border-border p-6",
        "bg-surface transition-all duration-200",
        "hover:border-accent/50 hover:bg-accent/5"
      )}
    >
      <div className="flex items-center justify-between">
        <span className="bg-accent/10 text-accent rounded-lg p-2.5">{icon}</span>
        <span className="text-muted rounded-full bg-surface-elevated px-3 py-1 text-sm font-medium">
          {algorithmCount} {algorithmCount === 1 ? "algorithm" : "algorithms"}
        </span>
      </div>
      <div className="space-y-2">
        <h3 className="text-primary flex items-center gap-2 text-xl font-semibold">
          {title}
          <ArrowRight
            className={cn(
              "h-4 w-4 opacity-0 transition-all duration-200",
              "group-hover:translate-x-1 group-hover:opacity-100"
            )}
          />
        </h3>
        <p className="text-muted text-sm leading-relaxed">{description}</p>
      </div>
    </Link>
  );
}

const MODE_CARDS: ModeCardProps[] = [
  {
    href: "/learn/sorting",
    icon: <ArrowUpDown className="h-5 w-5" />,
    title: "Sorting",
    algorithmCount: 7,
    description:
      "From Bubble to Quick Sort. Compare stability, space complexity, and find the right algorithm for your data.",
  },
  {
    href: "/learn/pathfinding",
    icon: <Route className="h-5 w-5" />,
    title: "Pathfinding",
    algorithmCount: 8,
    description:
      "Navigate mazes and graphs. Learn when BFS beats Dijkstra and why A* is the gold standard.",
  },
  {
    href: "/learn/tree",
    icon: <TreeDeciduous className="h-5 w-5" />,
    title: "Trees",
    algorithmCount: 4,
    description:
      "BST, AVL, Heaps, and more. Understand self-balancing tradeoffs and when to use each structure.",
  },
  {
    href: "/learn/graph",
    icon: <Network className="h-5 w-5" />,
    title: "Graphs",
    algorithmCount: 3,
    description:
      "Minimum spanning trees and topological sorting. Master Prim's, Kruskal's, and Kahn's algorithms.",
  },
];

interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
}

function StatCard({ icon, value, label }: StatCardProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-accent">{icon}</span>
      <div>
        <p className="text-primary text-2xl font-bold">{value}</p>
        <p className="text-muted text-sm">{label}</p>
      </div>
    </div>
  );
}

const FEATURED_ALGORITHMS = [
  {
    mode: "sorting",
    algorithm: "quick",
    title: "Quick Sort",
    tagline: "The Divide-and-Conquer Champion",
    reason:
      "The most widely used sorting algorithm in practice due to excellent cache performance.",
  },
  {
    mode: "pathfinding",
    algorithm: "astar",
    title: "A* Search",
    tagline: "The Informed Explorer",
    reason:
      "The gold standard for pathfinding in games and robotics, combining speed with optimality.",
  },
  {
    mode: "tree",
    algorithm: "avl",
    title: "AVL Tree",
    tagline: "The Balanced Pioneer",
    reason: "The first self-balancing BST, guaranteeing O(log n) operations in all cases.",
  },
  {
    mode: "graph",
    algorithm: "kruskal",
    title: "Kruskal's Algorithm",
    tagline: "The Edge Collector",
    reason:
      "Elegant Union-Find implementation for finding minimum spanning trees in sparse graphs.",
  },
];

export default function LearnHubPage() {
  const featuredIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % FEATURED_ALGORITHMS.length;
  // Array access is safe: modulo guarantees valid index for non-empty constant array
  const featured = FEATURED_ALGORITHMS[featuredIndex] as (typeof FEATURED_ALGORITHMS)[number];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <header className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="bg-accent/10 text-accent rounded-lg p-2">
            <BookOpen className="h-6 w-6" />
          </span>
          <h1 className="text-primary text-4xl font-bold">Learn Algorithms</h1>
        </div>
        <p className="text-muted max-w-2xl text-lg leading-relaxed">
          Master the fundamentals of computer science through interactive learning. Each algorithm
          includes detailed explanations, complexity analysis, code examples, and live demos.
        </p>
      </header>

      {/* Mode Cards Grid */}
      <section className="space-y-6">
        <h2 className="text-primary flex items-center gap-3 text-2xl font-semibold">
          <span className="text-accent">
            <Layers className="h-5 w-5" />
          </span>
          Choose a Domain
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {MODE_CARDS.map((card) => (
            <ModeCard key={card.href} {...card} />
          ))}
        </div>
      </section>

      {/* Featured Algorithm */}
      <section className="space-y-6">
        <h2 className="text-primary flex items-center gap-3 text-2xl font-semibold">
          <span className="text-accent">
            <Sparkles className="h-5 w-5" />
          </span>
          Featured Algorithm
        </h2>
        <Link
          href={`/learn/${featured.mode}/${featured.algorithm}`}
          className={cn(
            "group block rounded-xl border border-border p-6",
            "bg-gradient-to-r from-accent/5 to-transparent",
            "transition-all duration-200 hover:border-accent/50"
          )}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-accent text-sm font-medium uppercase tracking-wide">
                {featured.mode}
              </p>
              <h3 className="text-primary flex items-center gap-2 text-xl font-semibold">
                {featured.title}
                <ArrowRight
                  className={cn(
                    "h-4 w-4 opacity-0 transition-all duration-200",
                    "group-hover:translate-x-1 group-hover:opacity-100"
                  )}
                />
              </h3>
              <p className="text-muted italic">{featured.tagline}</p>
            </div>
          </div>
          <p className="text-muted mt-4 leading-relaxed">{featured.reason}</p>
        </Link>
      </section>

      {/* Quick Stats */}
      <section
        className={cn(
          "rounded-xl border border-border bg-surface p-6",
          "grid grid-cols-2 gap-6 sm:grid-cols-4"
        )}
      >
        <StatCard icon={<BookOpen className="h-5 w-5" />} value="22" label="Algorithms" />
        <StatCard icon={<Layers className="h-5 w-5" />} value="4" label="Domains" />
        <StatCard icon={<Code2 className="h-5 w-5" />} value="22" label="Code Examples" />
        <StatCard icon={<Sparkles className="h-5 w-5" />} value="40+" label="Interactive Demos" />
      </section>

      {/* CTA */}
      <section
        className={cn(
          "rounded-xl border border-border bg-gradient-to-r from-accent/5 to-transparent p-8",
          "text-center"
        )}
      >
        <h2 className="text-primary mb-4 text-2xl font-semibold">Ready to Start Learning?</h2>
        <p className="text-muted mx-auto mb-6 max-w-lg">
          Pick a domain above to explore algorithms, or jump straight to the visualizer to see them
          in action.
        </p>
        <Link
          href="/"
          className={cn(
            "inline-flex items-center gap-2 rounded-lg",
            "bg-accent px-6 py-3 font-medium text-white",
            "transition-colors hover:bg-accent/90"
          )}
        >
          Open Visualizer
        </Link>
      </section>
    </div>
  );
}
