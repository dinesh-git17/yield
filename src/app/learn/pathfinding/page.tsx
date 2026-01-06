import { BookOpen, Route } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  type ComparisonRow,
  ComparisonTable,
  type DecisionCard,
  DecisionGuide,
} from "@/features/learning/components";
import { PATHFINDING_ARTICLES } from "@/features/learning/content/pathfinding";
import type { PathfindingAlgorithmType } from "@/lib/store";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Pathfinding Algorithms | Learn",
  description:
    "Compare pathfinding algorithms side-by-side. Find the right algorithm for navigation, mazes, and graph traversal with our interactive comparison tables.",
  alternates: {
    canonical: "/learn/pathfinding",
  },
  openGraph: {
    title: "Pathfinding Algorithms — Yield",
    description:
      "Compare BFS, DFS, Dijkstra, A* and more pathfinding algorithms. Interactive comparison tables, decision guides, and maze demos.",
    url: "/learn/pathfinding",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pathfinding Algorithms — Yield",
    description: "Compare BFS, DFS, Dijkstra, A* and more pathfinding algorithms side-by-side.",
  },
};

const PATHFINDING_ORDER: PathfindingAlgorithmType[] = [
  "bfs",
  "dfs",
  "dijkstra",
  "astar",
  "greedy",
  "bidirectional",
  "flood",
  "random",
];

const TABLE_HEADERS = ["Time", "Space", "Shortest?", "Data Structure"];

function buildPathfindingRows(): ComparisonRow[] {
  return PATHFINDING_ORDER.map((slug) => {
    const article = PATHFINDING_ARTICLES[slug];
    return {
      slug,
      name: article.title,
      columns: [
        article.timeComplexity.complexity,
        article.spaceComplexity.complexity,
        article.guaranteesShortestPath,
        article.dataStructure,
      ],
    };
  });
}

const DECISION_CARDS: DecisionCard[] = [
  {
    question: "Need guaranteed shortest path?",
    recommendations: [
      { slug: "bfs", name: "BFS", reason: "unweighted graphs" },
      { slug: "dijkstra", name: "Dijkstra", reason: "weighted graphs" },
      { slug: "astar", name: "A*", reason: "with heuristic" },
    ],
  },
  {
    question: "Working with unweighted grids?",
    recommendations: [
      { slug: "bfs", name: "BFS", reason: "optimal" },
      { slug: "bidirectional", name: "Bidirectional A*", reason: "faster" },
    ],
  },
  {
    question: "Graph has weighted edges?",
    recommendations: [
      { slug: "dijkstra", name: "Dijkstra", reason: "classic choice" },
      { slug: "astar", name: "A*", reason: "with good heuristic" },
    ],
  },
  {
    question: "Memory is very limited?",
    recommendations: [
      { slug: "dfs", name: "DFS", reason: "O(depth) space" },
      { slug: "greedy", name: "Greedy", reason: "minimal frontier" },
    ],
  },
  {
    question: "Need to explore entire space?",
    recommendations: [
      { slug: "flood", name: "Flood Fill", reason: "complete coverage" },
      { slug: "bfs", name: "BFS", reason: "level-by-level" },
    ],
  },
  {
    question: "Unknown terrain or learning algorithms?",
    recommendations: [
      { slug: "bfs", name: "BFS", reason: "safe baseline" },
      { slug: "random", name: "Random Walk", reason: "chaos mode" },
    ],
  },
];

export default function PathfindingIndexPage() {
  const rows = buildPathfindingRows();

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <header className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="bg-accent/10 text-accent rounded-lg p-2">
            <Route className="h-6 w-6" />
          </span>
          <h1 className="text-primary text-4xl font-bold">Pathfinding Algorithms</h1>
        </div>
        <p className="text-muted max-w-2xl text-lg leading-relaxed">
          Compare 8 pathfinding algorithms side-by-side. From BFS to A*, find the right algorithm
          for navigation, mazes, and graph traversal.
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
        <ComparisonTable mode="pathfinding" headers={TABLE_HEADERS} rows={rows} />
        <p className="text-muted text-sm">
          Click any algorithm name to read its full article with code examples, history, and use
          cases.
        </p>
      </section>

      {/* Decision Guide */}
      <DecisionGuide title="Quick Decision Guide" mode="pathfinding" cards={DECISION_CARDS} />

      {/* CTA */}
      <section
        className={cn(
          "rounded-xl border border-border bg-gradient-to-r from-accent/5 to-transparent p-8",
          "text-center"
        )}
      >
        <h2 className="text-primary mb-4 text-2xl font-semibold">Ready to See Them in Action?</h2>
        <p className="text-muted mx-auto mb-6 max-w-lg">
          Draw walls, move start and end points, and watch algorithms find their way through mazes.
        </p>
        <Link
          href="/?mode=pathfinding"
          className={cn(
            "inline-flex items-center gap-2 rounded-lg",
            "bg-accent px-6 py-3 font-medium text-white",
            "transition-colors hover:bg-accent/90"
          )}
        >
          Open Pathfinding Visualizer
        </Link>
      </section>
    </div>
  );
}
