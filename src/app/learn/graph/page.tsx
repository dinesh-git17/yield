import {
  AlertTriangle,
  BookOpen,
  Brain,
  Building,
  CheckCircle2,
  Database,
  GitBranch,
  Globe,
  GraduationCap,
  HelpCircle,
  Lightbulb,
  Link2,
  Network,
  Server,
  Sparkles,
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
import { GRAPH_ARTICLES } from "@/features/learning/content/graphs";
import type { GraphAlgorithmType } from "@/lib/store";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Graph Algorithms | Learn",
  description:
    "Master graph algorithms with intuitive explanations. Understand MST (Prim's, Kruskal's), topological sorting (Kahn's), and when to use each with real-world examples and interview questions.",
  alternates: {
    canonical: "/learn/graph",
  },
  openGraph: {
    title: "Graph Algorithms — Yield",
    description:
      "Master graph algorithms: MST with Prim's and Kruskal's, topological sorting with Kahn's. Real-world applications, interview prep, and interactive visualizations.",
    url: "/learn/graph",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Graph Algorithms — Yield",
    description:
      "Master MST and topological sorting algorithms with real-world examples and interview prep.",
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
          Master 3 graph algorithms with side-by-side comparisons. From Minimum Spanning Trees to
          topological sorting, understand when to use each one, explore real-world applications, and
          prepare for technical interviews.
        </p>
      </header>

      {/* What Is a Graph? */}
      <section className="space-y-6">
        <h2 className="text-primary flex items-center gap-3 text-2xl font-semibold">
          <span className="text-accent">
            <Lightbulb className="h-5 w-5" />
          </span>
          What Is a Graph? (A Model for Relationships)
        </h2>
        <div className="space-y-4">
          <p className="text-muted leading-relaxed">A graph is a data structure made of:</p>
          <ul className="text-muted grid gap-2 sm:grid-cols-2">
            <li className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-emerald-500" />
              <strong className="text-primary">Vertices (nodes)</strong> representing entities
            </li>
            <li className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-emerald-500" />
              <strong className="text-primary">Edges</strong> representing relationships between
              them
            </li>
          </ul>
          <p className="text-muted leading-relaxed">
            Graphs are powerful because they let you model{" "}
            <strong className="text-primary">connections</strong>, not just data. Those connections
            can represent:
          </p>
          <ul className="text-muted grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <li className="flex items-center gap-2">
              <span className="text-accent block h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
              Roads between cities
            </li>
            <li className="flex items-center gap-2">
              <span className="text-accent block h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
              Dependencies between tasks
            </li>
            <li className="flex items-center gap-2">
              <span className="text-accent block h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
              Links between webpages
            </li>
            <li className="flex items-center gap-2">
              <span className="text-accent block h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
              Relationships between users
            </li>
          </ul>
          <div
            className={cn(
              "rounded-lg border border-accent/20 bg-accent/5 p-4",
              "flex items-start gap-3"
            )}
          >
            <Brain className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
            <p className="text-muted text-sm leading-relaxed">
              <strong className="text-primary">Core idea:</strong> Graphs are how computers
              understand networks. If you are modeling relationships, you are probably building a
              graph.
            </p>
          </div>
        </div>
      </section>

      {/* Where Graphs Are Used */}
      <section className="space-y-6">
        <h2 className="text-primary flex items-center gap-3 text-2xl font-semibold">
          <span className="text-accent">
            <Globe className="h-5 w-5" />
          </span>
          Where Graphs Quietly Run the World
        </h2>
        <p className="text-muted leading-relaxed">Graphs appear whenever things are connected.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <RealWorldCard
            icon={<Server className="h-5 w-5" />}
            title="Networks & Infrastructure"
            examples={["Internet routing", "Power grids", "Social networks"]}
          />
          <RealWorldCard
            icon={<Building className="h-5 w-5" />}
            title="Mapping & Logistics"
            examples={["Cities connected by roads", "Delivery networks", "Cost-optimized routes"]}
          />
          <RealWorldCard
            icon={<GitBranch className="h-5 w-5" />}
            title="Build Systems & Compilers"
            examples={["Dependency graphs", "Task scheduling", "Build order resolution"]}
          />
          <RealWorldCard
            icon={<Database className="h-5 w-5" />}
            title="Data & Recommendations"
            examples={["Friend suggestions", "Content recommendations", "Knowledge graphs"]}
          />
        </div>
        <p className="text-muted text-sm">
          <strong className="text-primary">Key takeaway:</strong> If you are modeling relationships,
          you are probably building a graph.
        </p>
      </section>

      {/* Why Graph Problems Are Hard */}
      <section className="space-y-6">
        <h2 className="text-primary flex items-center gap-3 text-2xl font-semibold">
          <span className="text-accent">
            <AlertTriangle className="h-5 w-5" />
          </span>
          Why Graph Problems Get Tricky Fast
        </h2>
        <p className="text-muted leading-relaxed">Graphs grow complex quickly because:</p>
        <ul className="text-muted space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-accent mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
            <span>Nodes can connect to many other nodes</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
            <span>Cycles introduce infinite paths</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
            <span>Choices compound exponentially</span>
          </li>
        </ul>
        <p className="text-muted leading-relaxed">
          Small graphs are intuitive. Large graphs demand{" "}
          <strong className="text-primary">careful algorithms</strong>.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-surface p-5 text-center">
            <div className="text-accent mb-2 text-2xl font-bold">1</div>
            <h4 className="text-primary mb-1 font-semibold">Reduce Search Space</h4>
            <p className="text-muted text-sm">Prune paths that cannot lead to optimal solutions</p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-5 text-center">
            <div className="text-accent mb-2 text-2xl font-bold">2</div>
            <h4 className="text-primary mb-1 font-semibold">Enforce Structure</h4>
            <p className="text-muted text-sm">DAGs, trees, and constraints simplify problems</p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-5 text-center">
            <div className="text-accent mb-2 text-2xl font-bold">3</div>
            <h4 className="text-primary mb-1 font-semibold">Greedy Choices</h4>
            <p className="text-muted text-sm">Local optimums can lead to global optimums</p>
          </div>
        </div>
      </section>

      {/* What Is MST? */}
      <section className="space-y-6">
        <h2 className="text-primary flex items-center gap-3 text-2xl font-semibold">
          <span className="text-accent">
            <Link2 className="h-5 w-5" />
          </span>
          What Is a Minimum Spanning Tree (MST)?
        </h2>
        <p className="text-muted leading-relaxed">
          A Minimum Spanning Tree connects all nodes in a graph:
        </p>
        <ul className="text-muted space-y-2">
          <li className="flex items-start gap-2">
            <Zap className="h-4 w-4 shrink-0 text-emerald-500" />
            <span>Without cycles</span>
          </li>
          <li className="flex items-start gap-2">
            <Zap className="h-4 w-4 shrink-0 text-emerald-500" />
            <span>With minimum total edge weight</span>
          </li>
        </ul>
        <blockquote
          className={cn(
            "rounded-lg border-l-4 border-accent bg-accent/5 py-3 pr-4 pl-6",
            "text-primary italic"
          )}
        >
          The cheapest way to connect everything.
        </blockquote>
        <p className="text-muted leading-relaxed">MSTs appear in:</p>
        <ul className="text-muted grid gap-2 sm:grid-cols-3">
          <li className="flex items-center gap-2">
            <span className="text-accent block h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
            Network design
          </li>
          <li className="flex items-center gap-2">
            <span className="text-accent block h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
            City planning
          </li>
          <li className="flex items-center gap-2">
            <span className="text-accent block h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
            Clustering problems
          </li>
        </ul>
      </section>

      {/* Prim vs Kruskal */}
      <section className="space-y-6">
        <h2 className="text-primary flex items-center gap-3 text-2xl font-semibold">
          <span className="text-accent">
            <Brain className="h-5 w-5" />
          </span>
          How MST Algorithms Build Connections
        </h2>
        <p className="text-muted leading-relaxed">
          Prim&apos;s and Kruskal&apos;s solve the same problem but think differently.
        </p>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-surface">
                <th className="text-primary px-4 py-3 text-left font-semibold">Algorithm</th>
                <th className="text-primary px-4 py-3 text-left font-semibold">Strategy</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-border bg-background">
                <td className="px-4 py-3">
                  <Link href="/learn/graph/prim" className="text-accent hover:underline">
                    Prim&apos;s
                  </Link>
                </td>
                <td className="text-muted px-4 py-3">Grows outward from a starting node</td>
              </tr>
              <tr className="border-t border-border bg-surface/30">
                <td className="px-4 py-3">
                  <Link href="/learn/graph/kruskal" className="text-accent hover:underline">
                    Kruskal&apos;s
                  </Link>
                </td>
                <td className="text-muted px-4 py-3">Sorts edges and connects smallest first</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-surface p-5">
            <h4 className="text-primary mb-2 font-semibold">Prim&apos;s is vertex-focused</h4>
            <p className="text-muted text-sm">
              Like growing a tree from a seed. It expands from one node, always picking the cheapest
              edge to a new node.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-5">
            <h4 className="text-primary mb-2 font-semibold">Kruskal&apos;s is edge-focused</h4>
            <p className="text-muted text-sm">
              Like a bargain hunter. It sorts all edges by cost and picks the cheapest ones that
              connect new components.
            </p>
          </div>
        </div>
        <p className="text-muted text-sm">
          <strong className="text-primary">Engineering insight:</strong> Dense graphs favor
          Prim&apos;s. Sparse graphs favor Kruskal&apos;s.
        </p>
      </section>

      {/* What Is Topological Sorting? */}
      <section className="space-y-6">
        <h2 className="text-primary flex items-center gap-3 text-2xl font-semibold">
          <span className="text-accent">
            <GitBranch className="h-5 w-5" />
          </span>
          What Is Topological Sorting?
        </h2>
        <p className="text-muted leading-relaxed">Topological sorting orders nodes so that:</p>
        <blockquote
          className={cn(
            "rounded-lg border-l-4 border-accent bg-accent/5 py-3 pr-4 pl-6",
            "text-primary italic"
          )}
        >
          Every dependency comes before what depends on it.
        </blockquote>
        <p className="text-muted leading-relaxed">
          This only works on{" "}
          <strong className="text-primary">Directed Acyclic Graphs (DAGs)</strong>.
        </p>
        <p className="text-muted leading-relaxed">Real-world examples:</p>
        <ul className="text-muted grid gap-2 sm:grid-cols-3">
          <li className="flex items-center gap-2">
            <span className="text-accent block h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
            Build pipelines
          </li>
          <li className="flex items-center gap-2">
            <span className="text-accent block h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
            Course prerequisites
          </li>
          <li className="flex items-center gap-2">
            <span className="text-accent block h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
            Task scheduling systems
          </li>
        </ul>
        <div
          className={cn(
            "rounded-lg border border-accent/20 bg-accent/5 p-4",
            "flex items-start gap-3"
          )}
        >
          <Brain className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
          <p className="text-muted text-sm leading-relaxed">
            <strong className="text-primary">Mental model:</strong> You cannot build the roof before
            the foundation.
          </p>
        </div>
      </section>

      {/* How Kahn's Works */}
      <section className="space-y-6">
        <h2 className="text-primary flex items-center gap-3 text-2xl font-semibold">
          <span className="text-accent">
            <Zap className="h-5 w-5" />
          </span>
          How Kahn&apos;s Algorithm Resolves Dependencies
        </h2>
        <p className="text-muted leading-relaxed">Kahn&apos;s algorithm:</p>
        <ol className="text-muted space-y-2 pl-4">
          <li className="flex items-start gap-3">
            <span className="text-accent font-semibold">1.</span>
            Finds nodes with no incoming edges
          </li>
          <li className="flex items-start gap-3">
            <span className="text-accent font-semibold">2.</span>
            Processes them first
          </li>
          <li className="flex items-start gap-3">
            <span className="text-accent font-semibold">3.</span>
            Removes their edges
          </li>
          <li className="flex items-start gap-3">
            <span className="text-accent font-semibold">4.</span>
            Repeats until done
          </li>
        </ol>
        <p className="text-muted leading-relaxed">
          If nodes remain with dependencies,{" "}
          <strong className="text-primary">a cycle exists</strong>.
        </p>
        <div
          className={cn(
            "rounded-lg border border-amber-500/20 bg-amber-500/5 p-4",
            "flex items-start gap-3"
          )}
        >
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
          <p className="text-muted text-sm leading-relaxed">
            <strong className="text-primary">Why it matters:</strong> Kahn&apos;s algorithm detects
            impossible schedules automatically. If the output length does not match the number of
            nodes, you have a cycle.
          </p>
        </div>
      </section>

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
            question="Why does an MST never contain cycles?"
            answer="Because removing any edge in a cycle reduces total cost without disconnecting the graph. A cycle means there's a redundant edge."
          />
          <InterviewQuestion
            question="When should you prefer Kruskal over Prim?"
            answer="When the graph is sparse or edge-heavy. Kruskal's sorts edges once, while Prim's uses a priority queue that gets expensive with dense graphs."
            followUp="Also prefer Kruskal when you already have edges in a sorted list."
          />
          <InterviewQuestion
            question="Why can't topological sorting work on cyclic graphs?"
            answer="Because dependencies become circular and no valid order exists. If A depends on B and B depends on A, neither can go first."
          />
          <InterviewQuestion
            question="What data structure makes Kruskal efficient?"
            answer="Union-Find (Disjoint Set Union). It detects cycles in near-constant time using path compression and union by rank."
            followUp="This is often the real interview question: implement Union-Find."
          />
          <InterviewQuestion
            question="What happens if Kahn's algorithm processes fewer nodes than exist?"
            answer="A cycle is present in the graph. The remaining nodes are all part of circular dependencies."
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
              Graph Myths
            </h3>
            <div className="space-y-2">
              <MythCard
                myth='"Graphs are just trees"'
                reality="Trees are a special case of graphs (connected, acyclic)"
              />
              <MythCard
                myth='"MST gives shortest paths"'
                reality="It minimizes total cost, not individual paths"
              />
              <MythCard
                myth='"Topological sort is just sorting"'
                reality="It enforces dependency constraints, not value ordering"
              />
              <MythCard myth='"Dense graphs are rare"' reality="Social networks prove otherwise" />
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
                  Many real graphs are <strong className="text-primary">sparse</strong>
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
                  Cycles are often <strong className="text-primary">bugs</strong> in dependency
                  systems
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
                  MST algorithms are <strong className="text-primary">greedy but correct</strong>
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
                  Graph problems <strong className="text-primary">scale faster</strong> than most
                  data structures
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
            Prim&apos;s builds patiently from home. Kruskal&apos;s shops for the cheapest deals.
            Kahn&apos;s refuses to work without prerequisites.
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
        <h2 className="text-primary mb-4 text-2xl font-semibold">See Graph Algorithms in Action</h2>
        <p className="text-muted mx-auto mb-6 max-w-lg">
          Build graphs, adjust edge weights, and watch how algorithms connect nodes and resolve
          dependencies. Some grow carefully. Some choose greedily. Some fail loudly when constraints
          are impossible. Visualizing graphs turns abstraction into intuition.
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
