import {
  AlertTriangle,
  BookOpen,
  Brain,
  CheckCircle2,
  Code2,
  Database,
  FolderTree,
  GraduationCap,
  HelpCircle,
  Lightbulb,
  Search,
  Settings,
  Sparkles,
  TreeDeciduous,
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
import { TREE_ARTICLES } from "@/features/learning/content/trees";
import type { TreeDataStructureType } from "@/lib/store";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Tree Data Structures | Learn",
  description:
    "Master tree data structures with intuitive explanations. Understand BST, AVL, Heap, and Splay trees with real-world examples and interview questions.",
  alternates: {
    canonical: "/learn/tree",
  },
  openGraph: {
    title: "Tree Data Structures — Yield",
    description:
      "Master tree data structures with intuitive explanations. Understand BST, AVL, Heap, and Splay trees with real-world examples and interview questions.",
    url: "/learn/tree",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tree Data Structures — Yield",
    description: "Master tree data structures: BST, AVL, Heap, and Splay with real-world examples.",
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
          Master 4 tree data structures with side-by-side comparisons. Understand hierarchical
          organization, balance tradeoffs, and real-world applications that power databases, file
          systems, and compilers.
        </p>
      </header>

      {/* What Is a Tree? */}
      <section className="space-y-6">
        <h2 className="text-primary flex items-center gap-3 text-2xl font-semibold">
          <span className="text-accent">
            <Lightbulb className="h-5 w-5" />
          </span>
          What Is a Tree? (And Why Engineers Love Them)
        </h2>
        <div className="space-y-4">
          <p className="text-muted leading-relaxed">
            A tree is a data structure that organizes data{" "}
            <strong className="text-primary">hierarchically</strong>. Instead of a flat list, data
            is arranged in levels:
          </p>
          <ul className="text-muted grid gap-2 sm:grid-cols-2">
            <li className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-emerald-500" />A root at the top
            </li>
            <li className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-emerald-500" />
              Nodes connected by parent-child relationships
            </li>
            <li className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-emerald-500" />
              Branches that grow as data is added
            </li>
            <li className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-emerald-500" />
              Leaves at the bottom with no children
            </li>
          </ul>
          <p className="text-muted leading-relaxed">
            Trees are powerful because they reflect real-world hierarchies naturally, reduce search
            space dramatically, and scale better than linear structures.
          </p>
          <div
            className={cn(
              "rounded-lg border border-accent/20 bg-accent/5 p-4",
              "flex items-start gap-3"
            )}
          >
            <Brain className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
            <p className="text-muted text-sm leading-relaxed">
              <strong className="text-primary">Simple intuition:</strong> A tree is how you avoid
              checking everything when you only need one thing.
            </p>
          </div>
        </div>
      </section>

      {/* Where Trees Are Used */}
      <section className="space-y-6">
        <h2 className="text-primary flex items-center gap-3 text-2xl font-semibold">
          <span className="text-accent">
            <Settings className="h-5 w-5" />
          </span>
          Where Tree Structures Power Real Systems
        </h2>
        <p className="text-muted leading-relaxed">
          Trees quietly run a large part of modern software. Whenever data has levels, trees are
          usually involved.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <RealWorldCard
            icon={<Database className="h-5 w-5" />}
            title="Databases & Indexing"
            examples={[
              "Indexes use balanced trees to find rows quickly",
              "Without trees, queries degrade to full scans",
              "B-trees power most database engines",
            ]}
          />
          <RealWorldCard
            icon={<FolderTree className="h-5 w-5" />}
            title="File Systems"
            examples={[
              "Folders and files form a tree",
              "Path traversal is tree traversal",
              "Every directory listing is a subtree",
            ]}
          />
          <RealWorldCard
            icon={<Code2 className="h-5 w-5" />}
            title="Compilers & Interpreters"
            examples={[
              "Abstract Syntax Trees (ASTs)",
              "Code becomes structured data",
              "Every expression parses into a tree",
            ]}
          />
          <RealWorldCard
            icon={<Search className="h-5 w-5" />}
            title="Search & Autocomplete"
            examples={[
              "Prefix trees power autocomplete",
              "Balanced trees enable fast lookup",
              "No need to scan everything",
            ]}
          />
        </div>
      </section>

      {/* Why Balance Matters */}
      <section className="space-y-6">
        <h2 className="text-primary flex items-center gap-3 text-2xl font-semibold">
          <span className="text-accent">
            <AlertTriangle className="h-5 w-5" />
          </span>
          Why an Unbalanced Tree Is a Performance Trap
        </h2>
        <p className="text-muted leading-relaxed">
          Trees promise fast operations only{" "}
          <strong className="text-primary">when they stay balanced</strong>. A balanced tree keeps
          its height small. A skewed tree quietly turns into a linked list.
        </p>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-surface">
                <th className="text-primary px-4 py-3 text-left font-semibold">Tree Shape</th>
                <th className="text-primary px-4 py-3 text-left font-semibold">Height</th>
                <th className="text-primary px-4 py-3 text-left font-semibold">Search Time</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-border bg-background">
                <td className="text-muted px-4 py-3">Balanced tree</td>
                <td className="px-4 py-3 text-emerald-500">O(log n)</td>
                <td className="px-4 py-3 text-emerald-500">O(log n)</td>
              </tr>
              <tr className="border-t border-border bg-surface/30">
                <td className="text-muted px-4 py-3">Skewed tree (linked list)</td>
                <td className="px-4 py-3 text-rose-500">O(n)</td>
                <td className="px-4 py-3 text-rose-500">O(n)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-muted leading-relaxed">
          This is why self-balancing trees exist. AVL Trees rotate aggressively to stay balanced.
          Splay Trees rebalance based on usage. Heaps enforce structure differently for priority
          access.
        </p>
        <div
          className={cn(
            "rounded-lg border border-accent/20 bg-accent/5 p-4",
            "flex items-start gap-3"
          )}
        >
          <Brain className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
          <p className="text-muted text-sm leading-relaxed">
            <strong className="text-primary">Engineering lesson:</strong> Structure without balance
            is a performance illusion.
          </p>
        </div>
      </section>

      {/* Different Trees, Different Tradeoffs */}
      <section className="space-y-6">
        <h2 className="text-primary flex items-center gap-3 text-2xl font-semibold">
          <span className="text-accent">
            <BookOpen className="h-5 w-5" />
          </span>
          Different Trees, Different Tradeoffs
        </h2>
        <p className="text-muted leading-relaxed">
          Trees are optimized around different priorities. Some optimize worst-case guarantees. Some
          optimize average access patterns. Some sacrifice search speed for priority access. There
          is no universal winner—only tradeoffs.
        </p>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-surface">
                <th className="text-primary px-4 py-3 text-left font-semibold">Goal</th>
                <th className="text-primary px-4 py-3 text-left font-semibold">Best Structure</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-border bg-background">
                <td className="text-muted px-4 py-3">Simple implementation</td>
                <td className="px-4 py-3">
                  <Link href="/learn/tree/bst" className="text-accent hover:underline">
                    BST
                  </Link>
                </td>
              </tr>
              <tr className="border-t border-border bg-surface/30">
                <td className="text-muted px-4 py-3">Guaranteed fast operations</td>
                <td className="px-4 py-3">
                  <Link href="/learn/tree/avl" className="text-accent hover:underline">
                    AVL Tree
                  </Link>
                </td>
              </tr>
              <tr className="border-t border-border bg-background">
                <td className="text-muted px-4 py-3">Fast max or min access</td>
                <td className="px-4 py-3">
                  <Link href="/learn/tree/max-heap" className="text-accent hover:underline">
                    Heap
                  </Link>
                </td>
              </tr>
              <tr className="border-t border-border bg-surface/30">
                <td className="text-muted px-4 py-3">Cache-friendly access patterns</td>
                <td className="px-4 py-3">
                  <Link href="/learn/tree/splay" className="text-accent hover:underline">
                    Splay Tree
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* How Tree Operations Work */}
      <section className="space-y-6">
        <h2 className="text-primary flex items-center gap-3 text-2xl font-semibold">
          <span className="text-accent">
            <Zap className="h-5 w-5" />
          </span>
          How Trees Think About Data
        </h2>
        <p className="text-muted leading-relaxed">
          Most tree operations revolve around a few key concepts. Insertions and deletions are not
          just adds and removes—they are structural changes that preserve invariants.
        </p>
        <ul className="text-muted grid gap-2 sm:grid-cols-2">
          <li className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-emerald-500" />
            <strong className="text-primary">Traversal:</strong> how you move through nodes
          </li>
          <li className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-emerald-500" />
            <strong className="text-primary">Comparison:</strong> deciding left or right
          </li>
          <li className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-emerald-500" />
            <strong className="text-primary">Rotation:</strong> restoring balance
          </li>
          <li className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-emerald-500" />
            <strong className="text-primary">Reheapification:</strong> maintaining priority
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
            <strong className="text-primary">Mental model:</strong> Trees constantly reorganize
            themselves to stay efficient.
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
        <ComparisonTable mode="tree" headers={TABLE_HEADERS} rows={rows} />
        <p className="text-muted text-sm">
          Click any structure name to read its full article with code examples, history, and use
          cases.
        </p>
      </section>

      {/* Decision Guide */}
      <DecisionGuide title="Quick Decision Guide" mode="tree" cards={DECISION_CARDS} />

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
            question="Why is a balanced tree O(log n)?"
            answer="Because each level eliminates half of the remaining search space. With n nodes, a balanced tree has log n levels."
          />
          <InterviewQuestion
            question="When does a BST degrade to O(n)?"
            answer="When values are inserted in sorted order without rebalancing. The tree becomes a linked list."
            followUp="This is why AVL trees exist—they rotate to prevent this degradation."
          />
          <InterviewQuestion
            question="Why are AVL Trees faster for searches but slower for inserts?"
            answer="Because they perform rotations aggressively to maintain strict balance. Every insert may trigger rebalancing."
          />
          <InterviewQuestion
            question="Why is heap search O(n)?"
            answer="Because heaps only guarantee order between parent and children, not across subtrees. You cannot binary search a heap."
          />
          <InterviewQuestion
            question="Why are splay trees useful?"
            answer="They move frequently accessed elements closer to the root, optimizing for access patterns. Great for caches and autocomplete."
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
              Tree Myths
            </h3>
            <div className="space-y-2">
              <MythCard myth='"BSTs are always fast"' reality="Only if balanced" />
              <MythCard
                myth='"Heaps are sorted trees"'
                reality="They are not—only parent-child order is guaranteed"
              />
              <MythCard
                myth='"AVL trees are always better"'
                reality="Inserts and deletes are more expensive"
              />
              <MythCard
                myth='"Splay trees are unpredictable"'
                reality="Amortized performance is still strong"
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
                  Most databases use <strong className="text-primary">B-trees or variants</strong>,
                  not simple BSTs
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
                  Tree rotations are <strong className="text-primary">constant-time</strong>{" "}
                  operations
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
                  Heaps are usually stored as <strong className="text-primary">arrays</strong>, not
                  node-pointer structures
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
                  Trees show up <strong className="text-primary">everywhere</strong> once you start
                  looking
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Easter Egg - Tree Personalities */}
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
          <h3 className="text-primary font-semibold">Tree Personalities</h3>
          <p className="text-muted text-sm leading-relaxed">
            BST trusts the input and hopes for the best. AVL is strict and never relaxes. Heap only
            cares about priority. Splay tree remembers what you like.
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
        <h2 className="text-primary mb-4 text-2xl font-semibold">See Trees Reshape Themselves</h2>
        <p className="text-muted mx-auto mb-6 max-w-lg">
          Insert, search, and delete values to watch how trees change shape. Some rebalance
          aggressively. Some adapt slowly. Some prioritize access over structure. Seeing these
          changes builds intuition that diagrams cannot.
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
