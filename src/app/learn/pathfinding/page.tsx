import {
  AlertTriangle,
  BookOpen,
  Bot,
  Brain,
  CheckCircle2,
  Gamepad2,
  Globe,
  GraduationCap,
  HelpCircle,
  Lightbulb,
  MapIcon,
  Route,
  Sparkles,
  Truck,
  XCircle,
  Zap,
} from "lucide-react";
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
    "Master pathfinding algorithms with interactive comparisons. Understand when to use BFS, DFS, Dijkstra, and A* with real-world examples and interview questions.",
  alternates: {
    canonical: "/learn/pathfinding",
  },
  openGraph: {
    title: "Pathfinding Algorithms — Yield",
    description:
      "Master pathfinding algorithms with interactive comparisons. Understand when to use BFS, DFS, Dijkstra, and A* with real-world examples and interview questions.",
    url: "/learn/pathfinding",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pathfinding Algorithms — Yield",
    description:
      "Master pathfinding algorithms: BFS, DFS, Dijkstra, A* and more with real-world examples.",
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

interface InterviewQuestionProps {
  question: string;
  answer: string;
  followUp?: string;
}

function InterviewQuestion({ question, answer, followUp }: InterviewQuestionProps) {
  return (
    <div className={cn("rounded-xl border border-border bg-surface p-5", "space-y-3")}>
      <div className="flex items-start gap-3">
        <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
        <p className="text-primary font-medium">{question}</p>
      </div>
      <p className="text-muted pl-8 leading-relaxed">{answer}</p>
      {followUp && (
        <p className="text-muted border-l-2 border-accent/30 pl-6 text-sm italic">{followUp}</p>
      )}
    </div>
  );
}

interface RealWorldCardProps {
  icon: React.ReactNode;
  title: string;
  examples: string[];
}

function RealWorldCard({ icon, title, examples }: RealWorldCardProps) {
  return (
    <div className={cn("rounded-xl border border-border bg-surface p-5", "space-y-3")}>
      <div className="flex items-center gap-3">
        <span className="text-accent">{icon}</span>
        <h4 className="text-primary font-semibold">{title}</h4>
      </div>
      <ul className="text-muted space-y-1.5 text-sm">
        {examples.map((example) => (
          <li key={example} className="flex items-start gap-2">
            <span className="text-accent mt-1.5 block h-1 w-1 shrink-0 rounded-full bg-current" />
            {example}
          </li>
        ))}
      </ul>
    </div>
  );
}

interface MythCardProps {
  myth: string;
  reality: string;
}

function MythCard({ myth, reality }: MythCardProps) {
  return (
    <div className={cn("rounded-lg border border-border bg-surface/50 p-4", "space-y-2")}>
      <div className="flex items-start gap-2">
        <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500/70" />
        <p className="text-primary text-sm font-medium">{myth}</p>
      </div>
      <div className="flex items-start gap-2 pl-6">
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500/70" />
        <p className="text-muted text-sm">{reality}</p>
      </div>
    </div>
  );
}

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
          Master 8 pathfinding algorithms with side-by-side comparisons. Understand when to use each
          one, explore real-world applications, and prepare for technical interviews.
        </p>
      </header>

      {/* What Is Pathfinding? */}
      <section className="space-y-6">
        <h2 className="text-primary flex items-center gap-3 text-2xl font-semibold">
          <span className="text-accent">
            <Lightbulb className="h-5 w-5" />
          </span>
          What Is Pathfinding? (More Than Just Mazes)
        </h2>
        <div className="space-y-4">
          <p className="text-muted leading-relaxed">
            Pathfinding is the process of finding a route from one point to another while navigating
            constraints. Those constraints might include:
          </p>
          <ul className="text-muted grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            <li className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-emerald-500" />
              Distance
            </li>
            <li className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-emerald-500" />
              Cost
            </li>
            <li className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-emerald-500" />
              Obstacles
            </li>
            <li className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-emerald-500" />
              Time
            </li>
            <li className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-emerald-500" />
              Risk
            </li>
            <li className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-emerald-500" />
              Memory limits
            </li>
          </ul>
          <p className="text-muted leading-relaxed">
            At its core, pathfinding is about{" "}
            <strong className="text-primary">decision making under uncertainty</strong>. Every step
            answers the same question:
          </p>
          <blockquote
            className={cn(
              "rounded-lg border-l-4 border-accent bg-accent/5 py-3 pr-4 pl-6",
              "text-primary italic"
            )}
          >
            Where should I go next to get closer to my goal?
          </blockquote>
          <p className="text-muted leading-relaxed">
            Pathfinding algorithms are not just about maps. They are about{" "}
            <strong className="text-primary">exploring possibilities efficiently</strong>.
          </p>
          <div
            className={cn(
              "rounded-lg border border-accent/20 bg-accent/5 p-4",
              "flex items-start gap-3"
            )}
          >
            <Brain className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
            <p className="text-muted text-sm leading-relaxed">
              <strong className="text-primary">Mental model:</strong> Pathfinding is like navigating
              a new city without GPS. You explore, backtrack, remember dead ends, and eventually
              find your way. Different strategies work better depending on how much you know about
              the terrain.
            </p>
          </div>
        </div>
      </section>

      {/* Where Pathfinding Is Used */}
      <section className="space-y-6">
        <h2 className="text-primary flex items-center gap-3 text-2xl font-semibold">
          <span className="text-accent">
            <MapIcon className="h-5 w-5" />
          </span>
          Where Pathfinding Actually Matters
        </h2>
        <p className="text-muted leading-relaxed">
          Pathfinding powers systems people use every day.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <RealWorldCard
            icon={<Globe className="h-5 w-5" />}
            title="Navigation & Maps"
            examples={[
              "GPS route planning",
              "Traffic-aware rerouting",
              "Walking, driving, cycling paths",
            ]}
          />
          <RealWorldCard
            icon={<Gamepad2 className="h-5 w-5" />}
            title="Games & Simulations"
            examples={["NPC movement", "Enemy pursuit logic", "Strategy and resource planning"]}
          />
          <RealWorldCard
            icon={<Bot className="h-5 w-5" />}
            title="Robotics"
            examples={["Obstacle avoidance", "Warehouse robots", "Autonomous vehicles"]}
          />
          <RealWorldCard
            icon={<Truck className="h-5 w-5" />}
            title="Logistics & Networks"
            examples={[
              "Packet routing on the internet",
              "Shortest routes for pick-and-pack",
              "Robot fleet coordination",
            ]}
          />
        </div>
        <p className="text-muted text-sm">
          <strong className="text-primary">Key idea:</strong> Pathfinding is everywhere decisions
          involve moving through a space efficiently.
        </p>
      </section>

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

      {/* Why No "Best" Algorithm */}
      <section className="space-y-6">
        <h2 className="text-primary flex items-center gap-3 text-2xl font-semibold">
          <span className="text-accent">
            <AlertTriangle className="h-5 w-5" />
          </span>
          Why Different Problems Need Different Algorithms
        </h2>
        <p className="text-muted leading-relaxed">
          Pathfinding algorithms optimize for different things. Some guarantee the shortest path.
          Some explore faster but may miss the best solution. Some use more memory. Some trade
          accuracy for speed.
        </p>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-surface">
                <th className="text-primary px-4 py-3 text-left font-semibold">Scenario</th>
                <th className="text-primary px-4 py-3 text-left font-semibold">Good Choice</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-border bg-background">
                <td className="text-muted px-4 py-3">Unweighted grid</td>
                <td className="px-4 py-3">
                  <Link href="/learn/pathfinding/bfs" className="text-accent hover:underline">
                    BFS
                  </Link>
                </td>
              </tr>
              <tr className="border-t border-border bg-surface/30">
                <td className="text-muted px-4 py-3">Weighted graph</td>
                <td className="px-4 py-3">
                  <Link href="/learn/pathfinding/dijkstra" className="text-accent hover:underline">
                    Dijkstra
                  </Link>
                </td>
              </tr>
              <tr className="border-t border-border bg-background">
                <td className="text-muted px-4 py-3">Large search space</td>
                <td className="px-4 py-3">
                  <Link href="/learn/pathfinding/astar" className="text-accent hover:underline">
                    A*
                  </Link>
                </td>
              </tr>
              <tr className="border-t border-border bg-surface/30">
                <td className="text-muted px-4 py-3">Limited memory</td>
                <td className="px-4 py-3">
                  <Link href="/learn/pathfinding/dfs" className="text-accent hover:underline">
                    DFS
                  </Link>
                </td>
              </tr>
              <tr className="border-t border-border bg-background">
                <td className="text-muted px-4 py-3">Fast approximation</td>
                <td className="px-4 py-3">
                  <Link href="/learn/pathfinding/greedy" className="text-accent hover:underline">
                    Greedy
                  </Link>
                </td>
              </tr>
              <tr className="border-t border-border bg-surface/30">
                <td className="text-muted px-4 py-3">Unknown environment</td>
                <td className="px-4 py-3">
                  <Link href="/learn/pathfinding/random" className="text-accent hover:underline">
                    Random Walk
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-muted text-sm">
          <strong className="text-primary">Engineering truth:</strong> The &ldquo;best&rdquo;
          algorithm depends on what you can afford to trade.
        </p>
      </section>

      {/* How Algorithms Think */}
      <section className="space-y-6">
        <h2 className="text-primary flex items-center gap-3 text-2xl font-semibold">
          <span className="text-accent">
            <Brain className="h-5 w-5" />
          </span>
          How Algorithms Decide Where to Go Next
        </h2>
        <p className="text-muted leading-relaxed">
          Most pathfinding algorithms revolve around three ideas:
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-surface p-5 text-center">
            <div className="text-accent mb-2 text-2xl font-bold">1</div>
            <h4 className="text-primary mb-1 font-semibold">Frontier</h4>
            <p className="text-muted text-sm">The set of places we can go next</p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-5 text-center">
            <div className="text-accent mb-2 text-2xl font-bold">2</div>
            <h4 className="text-primary mb-1 font-semibold">Visited Set</h4>
            <p className="text-muted text-sm">Where we have already been</p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-5 text-center">
            <div className="text-accent mb-2 text-2xl font-bold">3</div>
            <h4 className="text-primary mb-1 font-semibold">Priority</h4>
            <p className="text-muted text-sm">Which option looks most promising</p>
          </div>
        </div>
        <p className="text-muted leading-relaxed">
          Different algorithms change{" "}
          <strong className="text-primary">how the frontier is ordered</strong>:
        </p>
        <ul className="text-muted space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-accent mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
            <span>
              <strong className="text-primary">BFS</strong> explores evenly (first-in, first-out)
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
            <span>
              <strong className="text-primary">DFS</strong> dives deep (last-in, first-out)
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
            <span>
              <strong className="text-primary">Dijkstra</strong> prioritizes lowest cost so far
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
            <span>
              <strong className="text-primary">A*</strong> balances cost and heuristic guess
            </span>
          </li>
        </ul>
        <p className="text-muted text-sm">
          <strong className="text-primary">Same ingredients. Different strategy.</strong>
        </p>
      </section>

      {/* Decision Guide */}
      <DecisionGuide title="Quick Decision Guide" mode="pathfinding" cards={DECISION_CARDS} />

      {/* Interview Questions */}
      <section className="space-y-6">
        <h2 className="text-primary flex items-center gap-3 text-2xl font-semibold">
          <span className="text-accent">
            <GraduationCap className="h-5 w-5" />
          </span>
          Common Interview Questions
        </h2>
        <div className="space-y-4">
          <InterviewQuestion
            question="Why does BFS guarantee the shortest path?"
            answer="Because it explores level by level. The first time it reaches the target is the shortest path in an unweighted graph."
          />
          <InterviewQuestion
            question="When should you not use DFS for pathfinding?"
            answer="When you need the shortest path or when the graph is very deep. DFS can wander far before finding a solution."
            followUp="Follow-up: DFS is great when memory is tight or when any path will do."
          />
          <InterviewQuestion
            question="Why is Dijkstra slower than BFS?"
            answer="Because it handles weights and uses a priority queue. Extra flexibility comes with extra cost."
          />
          <InterviewQuestion
            question="What makes A* faster than Dijkstra?"
            answer="A* uses a heuristic to guide the search toward the goal instead of expanding evenly. A good heuristic dramatically reduces explored nodes."
          />
          <InterviewQuestion
            question="Can A* be incorrect?"
            answer="Yes. If the heuristic overestimates, A* can miss the shortest path. The heuristic must be admissible (never overestimate) to guarantee optimality."
          />
        </div>
      </section>

      {/* Myths and Did You Know */}
      <section className="space-y-6">
        <h2 className="text-primary flex items-center gap-3 text-2xl font-semibold">
          <span className="text-accent">
            <Sparkles className="h-5 w-5" />
          </span>
          Myths and Quick Facts
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-3">
            <h3 className="text-primary flex items-center gap-2 font-medium">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Pathfinding Myths
            </h3>
            <div className="space-y-2">
              <MythCard myth='"DFS is always bad"' reality="It is great when memory is tight" />
              <MythCard myth='"A* is always best"' reality="Only with a good heuristic" />
              <MythCard
                myth='"Shortest path is always required"'
                reality="Sometimes fast and good-enough wins"
              />
              <MythCard
                myth='"Random Walk is useless"'
                reality="Great teaching tool for exploration vs exploitation"
              />
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-primary flex items-center gap-2 font-medium">
              <Lightbulb className="h-4 w-4 text-sky-500" />
              Did You Know?
            </h3>
            <ul className="space-y-2">
              <li
                className={cn(
                  "rounded-lg border border-border bg-surface/50 p-3",
                  "flex items-start gap-2 text-sm"
                )}
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-500/70" />
                <span className="text-muted">
                  Many AI systems combine{" "}
                  <strong className="text-primary">multiple pathfinding strategies</strong>
                </span>
              </li>
              <li
                className={cn(
                  "rounded-lg border border-border bg-surface/50 p-3",
                  "flex items-start gap-2 text-sm"
                )}
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-500/70" />
                <span className="text-muted">
                  Heuristics are <strong className="text-primary">educated guesses</strong>, not
                  magic
                </span>
              </li>
              <li
                className={cn(
                  "rounded-lg border border-border bg-surface/50 p-3",
                  "flex items-start gap-2 text-sm"
                )}
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-500/70" />
                <span className="text-muted">
                  Pathfinding problems <strong className="text-primary">scale exponentially</strong>
                </span>
              </li>
              <li
                className={cn(
                  "rounded-lg border border-border bg-surface/50 p-3",
                  "flex items-start gap-2 text-sm"
                )}
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-500/70" />
                <span className="text-muted">
                  Most real systems accept{" "}
                  <strong className="text-primary">approximate paths</strong>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Easter Egg */}
      <section
        className={cn(
          "rounded-xl border border-border bg-surface p-6",
          "flex items-start gap-4 sm:items-center"
        )}
      >
        <span className="bg-accent/10 text-accent shrink-0 rounded-lg p-2.5">
          <Sparkles className="h-5 w-5" />
        </span>
        <div className="space-y-1">
          <h3 className="text-primary font-semibold">Algorithm Personalities</h3>
          <p className="text-muted text-sm leading-relaxed">
            BFS is careful and methodical. DFS is adventurous and reckless. Dijkstra is precise and
            expensive. A* is smart when given good hints. Random Walk has no plan and vibes only.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section
        className={cn(
          "rounded-xl border border-border bg-gradient-to-r from-accent/5 to-transparent p-8",
          "text-center"
        )}
      >
        <h2 className="text-primary mb-4 text-2xl font-semibold">See Pathfinding in Action</h2>
        <p className="text-muted mx-auto mb-6 max-w-lg">
          Draw walls, move the start and end points, and watch how different algorithms explore the
          space. Some rush forward. Some carefully evaluate every option. Some get lost.
          Understanding these behaviors visually builds intuition that textbooks cannot.
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
