import {
  ArrowRight,
  ArrowUpDown,
  BookOpen,
  Brain,
  Briefcase,
  ChevronRight,
  Code2,
  Eye,
  GraduationCap,
  HelpCircle,
  Layers,
  Lightbulb,
  MessageCircleQuestion,
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
    "Master algorithms through visual learning. Explore sorting, pathfinding, trees, and graph algorithms with intuition-first explanations, interactive demos, and real-world context.",
  alternates: {
    canonical: "/learn",
  },
  openGraph: {
    title: "Learn Algorithms, Visually — Yield",
    description:
      "Master algorithms by seeing them move, not memorizing steps. Interactive learning for sorting, pathfinding, trees, and graphs.",
    url: "/learn",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Learn Algorithms, Visually — Yield",
    description:
      "Master algorithms by seeing them move. Interactive learning for sorting, pathfinding, trees, and graphs.",
  },
};

/* ---------------------------------------------------------------------------
 * Domain Cards (Enhanced)
 * --------------------------------------------------------------------------- */

interface DomainCardProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  algorithmCount: number;
  tagline: string;
  description: string;
  startingPoint: {
    name: string;
    slug: string;
  };
}

function DomainCard({
  href,
  icon,
  title,
  algorithmCount,
  tagline,
  description,
  startingPoint,
}: DomainCardProps) {
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
        <p className="text-accent text-sm font-medium">{tagline}</p>
        <p className="text-muted text-sm leading-relaxed">{description}</p>
      </div>
      <div className="mt-auto pt-2">
        <p className="text-muted flex items-center gap-1.5 text-xs">
          <Lightbulb className="h-3 w-3" />
          <span>Start with:</span>
          <span className="text-accent font-medium">{startingPoint.name}</span>
        </p>
      </div>
    </Link>
  );
}

const DOMAIN_CARDS: DomainCardProps[] = [
  {
    href: "/learn/sorting",
    icon: <ArrowUpDown className="h-5 w-5" />,
    title: "Sorting",
    algorithmCount: 7,
    tagline: "Organize data efficiently.",
    description:
      "The foundation of searching, databases, and many interview problems. Learn when stability, space, and speed tradeoffs matter.",
    startingPoint: { name: "Insertion Sort", slug: "insertion" },
  },
  {
    href: "/learn/pathfinding",
    icon: <Route className="h-5 w-5" />,
    title: "Pathfinding",
    algorithmCount: 8,
    tagline: "Navigate grids, mazes, and graphs.",
    description:
      "Used in maps, games, robotics, and AI systems. Understand when BFS beats Dijkstra and why A* is the gold standard.",
    startingPoint: { name: "Breadth-First Search (BFS)", slug: "bfs" },
  },
  {
    href: "/learn/tree",
    icon: <TreeDeciduous className="h-5 w-5" />,
    title: "Trees",
    algorithmCount: 4,
    tagline: "Model hierarchical data efficiently.",
    description:
      "Power databases, file systems, and indexes. Learn self-balancing tradeoffs and when to use each structure.",
    startingPoint: { name: "Binary Search Tree (BST)", slug: "bst" },
  },
  {
    href: "/learn/graph",
    icon: <Network className="h-5 w-5" />,
    title: "Graphs",
    algorithmCount: 3,
    tagline: "Model relationships and dependencies.",
    description:
      "Essential for networks, scheduling, and system design. Master minimum spanning trees and topological sorting.",
    startingPoint: { name: "Kahn's Algorithm", slug: "kahn" },
  },
];

/* ---------------------------------------------------------------------------
 * Stats Card
 * --------------------------------------------------------------------------- */

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

/* ---------------------------------------------------------------------------
 * Learning Path Card
 * --------------------------------------------------------------------------- */

interface LearningPathProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  steps: Array<{ label: string; href: string }>;
  highlight: string;
}

function LearningPathCard({
  icon,
  title,
  subtitle,
  description,
  steps,
  highlight,
}: LearningPathProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-surface p-6",
        "flex flex-col gap-4",
        "transition-colors hover:border-accent/30"
      )}
    >
      <div className="flex items-center gap-3">
        <span className="bg-accent/10 text-accent rounded-lg p-2">{icon}</span>
        <div>
          <h3 className="text-primary font-semibold">{title}</h3>
          <p className="text-muted text-sm">{subtitle}</p>
        </div>
      </div>
      <p className="text-muted text-sm leading-relaxed">{description}</p>
      <div className="flex flex-wrap items-center gap-2">
        {steps.map((step, index) => (
          <span key={step.href} className="flex items-center gap-1">
            <Link
              href={step.href}
              className="text-primary rounded bg-surface-elevated px-2 py-1 text-sm font-medium transition-colors hover:bg-accent/10 hover:text-accent"
            >
              {step.label}
            </Link>
            {index < steps.length - 1 && <ChevronRight className="text-muted h-3 w-3" />}
          </span>
        ))}
      </div>
      <p className="text-muted mt-auto border-t border-border pt-3 text-xs italic">{highlight}</p>
    </div>
  );
}

const LEARNING_PATHS: LearningPathProps[] = [
  {
    icon: <GraduationCap className="h-5 w-5" />,
    title: "Beginner Path",
    subtitle: "New to algorithms? Start here.",
    description:
      "Start with ordering data, then move into structure, navigation, and relationships. Build foundational intuition step by step.",
    steps: [
      { label: "Sorting", href: "/learn/sorting" },
      { label: "Trees", href: "/learn/tree" },
      { label: "Pathfinding", href: "/learn/pathfinding" },
      { label: "Graphs", href: "/learn/graph" },
    ],
    highlight: "You start with ordering, then structure, then navigation, then relationships.",
  },
  {
    icon: <Briefcase className="h-5 w-5" />,
    title: "Interview Prep",
    subtitle: "Optimized for technical interviews.",
    description:
      "Focus on algorithms and patterns that appear most often in coding interviews and system design discussions.",
    steps: [
      { label: "Quick Sort", href: "/learn/sorting/quick" },
      { label: "Merge Sort", href: "/learn/sorting/merge" },
      { label: "BST", href: "/learn/tree/bst" },
      { label: "A*", href: "/learn/pathfinding/astar" },
    ],
    highlight: "These concepts appear repeatedly in coding interviews and system discussions.",
  },
  {
    icon: <Eye className="h-5 w-5" />,
    title: "Visual Learner",
    subtitle: "Learn by watching algorithms move.",
    description:
      "Visual intuition builds faster than abstract explanations. Watch the behavior first, then understand the theory.",
    steps: [
      { label: "Sorting", href: "/?mode=sorting" },
      { label: "Pathfinding", href: "/?mode=pathfinding" },
      { label: "Trees", href: "/?mode=tree" },
      { label: "Graphs", href: "/?mode=graph" },
    ],
    highlight: "Visual intuition builds faster than abstract explanations.",
  },
];

/* ---------------------------------------------------------------------------
 * Featured Algorithm
 * --------------------------------------------------------------------------- */

const FEATURED_ALGORITHMS = [
  {
    mode: "sorting",
    algorithm: "quick",
    title: "Quick Sort",
    tagline: "The Divide-and-Conquer Champion",
    reason:
      "One of the most widely used sorting algorithms in practice due to excellent cache performance and strong average-case behavior. Appears frequently in interviews despite its worst-case edge case.",
  },
  {
    mode: "pathfinding",
    algorithm: "astar",
    title: "A* Search",
    tagline: "The Informed Explorer",
    reason:
      "The gold standard for pathfinding in games and robotics, combining the completeness of Dijkstra with heuristic guidance for faster solutions.",
  },
  {
    mode: "tree",
    algorithm: "avl",
    title: "AVL Tree",
    tagline: "The Balanced Pioneer",
    reason:
      "The first self-balancing BST ever invented. Guarantees O(log n) operations in all cases through rotation-based rebalancing.",
  },
  {
    mode: "graph",
    algorithm: "kruskal",
    title: "Kruskal's Algorithm",
    tagline: "The Edge Collector",
    reason:
      "An elegant Union-Find implementation for finding minimum spanning trees. Works well on sparse graphs where edges are the focus.",
  },
];

/* ---------------------------------------------------------------------------
 * FAQ Item
 * --------------------------------------------------------------------------- */

interface FAQItemProps {
  question: string;
  answer: string;
}

function FAQItem({ question, answer }: FAQItemProps) {
  return (
    <div
      className={cn("rounded-lg border border-border bg-surface/50 p-4", "flex items-start gap-3")}
    >
      <MessageCircleQuestion className="text-accent mt-0.5 h-5 w-5 shrink-0" />
      <div className="space-y-1">
        <p className="text-primary font-medium">{question}</p>
        <p className="text-muted text-sm leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

const FAQ_ITEMS: FAQItemProps[] = [
  {
    question: "Do I need advanced math?",
    answer:
      "No. Most concepts rely on logic and intuition, not formulas. The visualizations help you understand behavior without proofs.",
  },
  {
    question: "Is this good for interview prep?",
    answer:
      "Yes. Yield focuses on the algorithms and patterns that appear most often in technical interviews at all levels.",
  },
  {
    question: "Should I read first or visualize first?",
    answer:
      "Either works. Many learners prefer to watch first to build intuition, then read for deeper understanding.",
  },
];

/* ---------------------------------------------------------------------------
 * Page Component
 * --------------------------------------------------------------------------- */

export default function LearnHubPage() {
  const featuredIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % FEATURED_ALGORITHMS.length;
  // Array access is safe: modulo guarantees valid index for non-empty constant array
  const featured = FEATURED_ALGORITHMS[featuredIndex] as (typeof FEATURED_ALGORITHMS)[number];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <header className="space-y-6">
        <div className="flex items-center gap-3">
          <span className="bg-accent/10 text-accent rounded-lg p-2">
            <BookOpen className="h-6 w-6" />
          </span>
          <span className="text-accent text-sm font-medium uppercase tracking-wide">
            Learning Hub
          </span>
        </div>
        <h1 className="text-primary text-4xl font-bold tracking-tight sm:text-5xl">
          Learn Algorithms, Visually
        </h1>
        <p className="text-muted max-w-2xl text-lg leading-relaxed">
          Master the fundamentals of computer science through interactive learning.
          <br />
          Understand how algorithms work by <em>seeing</em> them move, not memorizing steps.
        </p>
        <p className="text-muted max-w-2xl leading-relaxed">
          Each domain combines intuition, real-world context, complexity tradeoffs, and live
          visualizations so you can build understanding that actually sticks.
        </p>
      </header>

      {/* How to Learn with Yield */}
      <section className="space-y-6">
        <h2 className="text-primary flex items-center gap-3 text-2xl font-semibold">
          <span className="text-accent">
            <Lightbulb className="h-5 w-5" />
          </span>
          How to Learn with Yield
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="text-muted space-y-4 leading-relaxed">
            <p>
              Yield is designed to be simple and flexible. You can explore casually or follow a
              structured path.
            </p>
            <p className="text-primary font-medium">A good way to learn:</p>
            <ol className="text-muted list-inside list-decimal space-y-2">
              <li>Start with a domain</li>
              <li>Read the intuition and real-world context</li>
              <li>Watch the algorithm run step by step</li>
              <li>Compare it with alternatives</li>
              <li>Come back and try a different approach</li>
            </ol>
          </div>
          <div
            className={cn(
              "rounded-xl border border-accent/20 bg-accent/5 p-5",
              "flex items-start gap-3 self-start"
            )}
          >
            <Brain className="text-accent mt-0.5 h-5 w-5 shrink-0" />
            <div className="space-y-2">
              <p className="text-primary font-semibold">Key Idea</p>
              <p className="text-muted leading-relaxed">
                Understanding comes from seeing behavior, not memorizing code. Watch the algorithm
                move, then the theory clicks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Paths */}
      <section className="space-y-6">
        <h2 className="text-primary flex items-center gap-3 text-2xl font-semibold">
          <span className="text-accent">
            <Route className="h-5 w-5" />
          </span>
          Choose a Learning Path
        </h2>
        <p className="text-muted max-w-2xl">
          Not everyone learns algorithms for the same reason. Pick a path that matches your goal.
        </p>
        <div className="grid gap-4 lg:grid-cols-3">
          {LEARNING_PATHS.map((path) => (
            <LearningPathCard key={path.title} {...path} />
          ))}
        </div>
      </section>

      {/* Domain Cards Grid */}
      <section className="space-y-6">
        <h2 className="text-primary flex items-center gap-3 text-2xl font-semibold">
          <span className="text-accent">
            <Layers className="h-5 w-5" />
          </span>
          Explore by Domain
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {DOMAIN_CARDS.map((card) => (
            <DomainCard key={card.href} {...card} />
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

      {/* What You'll Explore - Stats */}
      <section className="space-y-6">
        <h2 className="text-primary flex items-center gap-3 text-2xl font-semibold">
          <span className="text-accent">
            <Code2 className="h-5 w-5" />
          </span>
          What You&apos;ll Explore
        </h2>
        <div
          className={cn(
            "rounded-xl border border-border bg-surface p-6",
            "grid grid-cols-2 gap-6 sm:grid-cols-4"
          )}
        >
          <StatCard icon={<BookOpen className="h-5 w-5" />} value="22" label="Algorithms" />
          <StatCard icon={<Layers className="h-5 w-5" />} value="4" label="Domains" />
          <StatCard icon={<Code2 className="h-5 w-5" />} value="22" label="Code Examples" />
          <StatCard icon={<Sparkles className="h-5 w-5" />} value="40+" label="Interactive Demos" />
        </div>
        <p className="text-muted text-sm">Everything designed to build intuition, not overwhelm.</p>
      </section>

      {/* Why Yield Exists */}
      <section className="space-y-6">
        <h2 className="text-primary flex items-center gap-3 text-2xl font-semibold">
          <span className="text-accent">
            <HelpCircle className="h-5 w-5" />
          </span>
          Why Yield?
        </h2>
        <div
          className={cn(
            "rounded-xl border border-border bg-surface p-6",
            "flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6"
          )}
        >
          <span className="bg-accent/10 text-accent shrink-0 rounded-lg p-2.5">
            <Sparkles className="h-5 w-5" />
          </span>
          <div className="text-muted space-y-3 leading-relaxed">
            <p>Yield started as a personal cheat sheet while grinding algorithms late at night.</p>
            <p>
              The goal was simple:{" "}
              <strong className="text-primary">understand algorithms by seeing them move.</strong>
            </p>
            <p>
              What began as a study tool slowly turned into a full visual learning platform designed
              to make core computer science concepts feel intuitive and approachable.
            </p>
          </div>
        </div>
      </section>

      {/* Mini FAQ */}
      <section className="space-y-6">
        <h2 className="text-primary flex items-center gap-3 text-2xl font-semibold">
          <span className="text-accent">
            <MessageCircleQuestion className="h-5 w-5" />
          </span>
          Quick Questions
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FAQ_ITEMS.map((item) => (
            <FAQItem key={item.question} {...item} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        className={cn(
          "rounded-xl border border-border bg-gradient-to-r from-accent/5 to-transparent p-8",
          "text-center"
        )}
      >
        <h2 className="text-primary mb-4 text-2xl font-semibold">Ready to Start Learning?</h2>
        <p className="text-muted mx-auto mb-2 max-w-lg">
          Pick a domain above to explore algorithms in depth, or jump straight into the visualizer
          to see them in action.
        </p>
        <p className="text-muted mx-auto mb-6 max-w-lg text-sm italic">
          You don&apos;t need to memorize. You just need to understand how things behave.
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
