import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  Clock,
  Code2,
  Gauge,
  Globe,
  HelpCircle,
  Layers,
  Lightbulb,
  LineChart,
  Search,
  Shield,
  Sparkles,
  Target,
  XCircle,
  Zap,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Patterns | Learn",
  description:
    "Master algorithmic patterns — the reusable mental templates for solving whole families of problems. Learn Sliding Window, Two Pointers, Prefix Sums, Monotonic Stack, and more.",
  alternates: {
    canonical: "/learn/patterns",
  },
  openGraph: {
    title: "Algorithmic Patterns — Yield",
    description:
      "Master the reusable mental templates that unlock hundreds of coding problems. Sliding Window, Two Pointers, Hash Maps, and more.",
    url: "/learn/patterns",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Algorithmic Patterns — Yield",
    description: "Master the mental templates that unlock hundreds of coding problems.",
  },
};

/* ---------------------------------------------------------------------------
 * Helper Components
 * --------------------------------------------------------------------------- */

interface InterviewQuestionProps {
  question: string;
  answer: string;
}

function InterviewQuestion({ question, answer }: InterviewQuestionProps) {
  return (
    <div className={cn("rounded-xl border border-border bg-surface p-5", "space-y-3")}>
      <div className="flex items-start gap-3">
        <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
        <p className="text-primary font-medium">{question}</p>
      </div>
      <p className="text-muted pl-8 leading-relaxed">{answer}</p>
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

interface PatternCardProps {
  title: string;
  description: string;
  signals: string[];
  tools: string[];
  href?: string;
}

function PatternCard({ title, description, signals, tools, href }: PatternCardProps) {
  const content = (
    <div
      className={cn(
        "rounded-xl border border-border bg-surface p-5",
        "space-y-4 transition-all duration-200",
        href && "hover:border-accent/50 hover:bg-accent/5"
      )}
    >
      <div className="flex items-center justify-between">
        <h4 className="text-primary text-lg font-semibold">{title}</h4>
        {href && (
          <ArrowRight className="h-4 w-4 text-accent opacity-0 transition-opacity group-hover:opacity-100" />
        )}
      </div>
      <p className="text-muted text-sm leading-relaxed">{description}</p>
      <div className="space-y-3">
        <div>
          <p className="text-primary mb-1.5 text-xs font-medium uppercase tracking-wide">
            Use when you see
          </p>
          <ul className="text-muted text-sm space-y-1">
            {signals.map((signal) => (
              <li key={signal} className="flex items-start gap-2">
                <Zap className="mt-0.5 h-3 w-3 shrink-0 text-emerald-500" />
                {signal}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-primary mb-1.5 text-xs font-medium uppercase tracking-wide">
            Typical tools
          </p>
          <div className="flex flex-wrap gap-1.5">
            {tools.map((tool) => (
              <span
                key={tool}
                className="bg-surface-elevated text-muted rounded px-2 py-0.5 font-mono text-xs"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="group block">
        {content}
      </Link>
    );
  }

  return content;
}

interface StrategyStepProps {
  number: string;
  title: string;
  description: string;
  details?: string[];
}

function StrategyStep({ number, title, description, details }: StrategyStepProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5 space-y-3">
      <div className="flex items-center gap-2">
        <span className="bg-accent/20 text-accent rounded-full px-3 py-1 text-sm font-medium">
          {number}
        </span>
        <h4 className="text-primary font-semibold">{title}</h4>
      </div>
      <p className="text-muted text-sm leading-relaxed">{description}</p>
      {details && (
        <ul className="text-muted text-sm space-y-1 pl-1">
          {details.map((detail) => (
            <li key={detail} className="flex items-start gap-2">
              <span className="text-accent mt-1.5 block h-1 w-1 shrink-0 rounded-full bg-current" />
              {detail}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * Page Component
 * --------------------------------------------------------------------------- */

export default function PatternsIndexPage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <header className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="bg-accent/10 text-accent rounded-lg p-2">
            <Layers className="h-6 w-6" />
          </span>
          <h1 className="text-primary text-4xl font-bold">Patterns</h1>
        </div>
        <p className="text-muted max-w-2xl text-lg leading-relaxed">
          Patterns are reusable &ldquo;mental templates&rdquo; for solving whole families of
          problems. Instead of memorizing 200 solutions, learn a handful of patterns that unlock
          them all.
        </p>
      </header>

      {/* What Are Patterns? */}
      <section className="space-y-6">
        <h2 className="text-primary flex items-center gap-3 text-2xl font-semibold">
          <span className="text-accent">
            <Lightbulb className="h-5 w-5" />
          </span>
          What Are Patterns?
        </h2>
        <div className="space-y-4">
          <p className="text-muted leading-relaxed">
            A pattern tells you three things about any problem:
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-surface p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-emerald-500" />
                <span className="text-primary font-semibold">What to track</span>
              </div>
              <p className="text-muted text-sm">counts, pointers, min/max, state</p>
            </div>
            <div className="rounded-lg border border-border bg-surface p-4 space-y-2">
              <div className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-emerald-500" />
                <span className="text-primary font-semibold">How to move</span>
              </div>
              <p className="text-muted text-sm">expand, contract, scan, split</p>
            </div>
            <div className="rounded-lg border border-border bg-surface p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span className="text-primary font-semibold">When you&apos;re done</span>
              </div>
              <p className="text-muted text-sm">invariants, constraints satisfied</p>
            </div>
          </div>
          <div
            className={cn(
              "rounded-lg border border-accent/20 bg-accent/5 p-4",
              "flex items-start gap-3"
            )}
          >
            <Brain className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
            <p className="text-muted text-sm leading-relaxed">
              <strong className="text-primary">Key insight:</strong> The best candidates don&apos;t
              &ldquo;guess the trick&rdquo; — they{" "}
              <strong className="text-primary">recognize the pattern</strong>, state the invariant,
              and implement cleanly.
            </p>
          </div>
        </div>
      </section>

      {/* Why Patterns Matter */}
      <section className="space-y-6">
        <h2 className="text-primary flex items-center gap-3 text-2xl font-semibold">
          <span className="text-accent">
            <Globe className="h-5 w-5" />
          </span>
          Why Patterns Matter
        </h2>
        <p className="text-muted leading-relaxed">
          Patterns aren&apos;t just interview tricks. They solve real problems in production systems
          every day.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <RealWorldCard
            icon={<Search className="h-5 w-5" />}
            title="Search & Autocomplete"
            examples={[
              "Sliding window + frequency maps",
              "Keep results relevant and fast",
              "Real-time query suggestions",
            ]}
          />
          <RealWorldCard
            icon={<Shield className="h-5 w-5" />}
            title="Fraud & Anomaly Detection"
            examples={[
              "Rolling windows for streaming signals",
              "Prefix sums for cumulative checks",
              '"Last seen" maps for pattern detection',
            ]}
          />
          <RealWorldCard
            icon={<LineChart className="h-5 w-5" />}
            title="Log & Metrics Dashboards"
            examples={[
              "Two pointers for time-range queries",
              "Windowed aggregates for KPIs",
              "Avoid reprocessing everything",
            ]}
          />
          <RealWorldCard
            icon={<Gauge className="h-5 w-5" />}
            title="User Behavior Analytics"
            examples={[
              '"Longest streak" → sliding window',
              '"Most frequent" → hash map counting',
              '"First time seen" → last seen maps',
            ]}
          />
        </div>
      </section>

      {/* The Pattern Strategy */}
      <section className="space-y-6">
        <h2 className="text-primary flex items-center gap-3 text-2xl font-semibold">
          <span className="text-accent">
            <Target className="h-5 w-5" />
          </span>
          The Pattern Strategy
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <StrategyStep
            number="1"
            title="Clarify"
            description="Ask what matters before jumping in."
            details={[
              "Are we optimizing time, space, or both?",
              "Can we reorder input?",
              "Is the input streaming?",
              "Are duplicates allowed?",
            ]}
          />
          <StrategyStep
            number="2"
            title="Name the Pattern"
            description="Say it out loud. Interviewers love this."
            details={[
              '"This is a sliding window because we need a best subarray."',
              '"This is two pointers because sorted input + monotonic movement."',
            ]}
          />
          <StrategyStep
            number="3"
            title="State the Invariant"
            description="The rule that must always be true."
            details={[
              '"Window contains unique characters."',
              '"Left pointer is the smallest index that still satisfies constraints."',
            ]}
          />
          <StrategyStep
            number="4"
            title="Implement Cleanly"
            description="Write the simplest correct version first."
            details={[
              "Reduce nested loops",
              "Avoid unnecessary recalculation",
              "Use the right data structure",
            ]}
          />
        </div>
      </section>

      {/* Core Patterns */}
      <section className="space-y-6">
        <h2 className="text-primary flex items-center gap-3 text-2xl font-semibold">
          <span className="text-accent">
            <BookOpen className="h-5 w-5" />
          </span>
          Core Patterns
        </h2>
        <div className="grid gap-4 lg:grid-cols-2">
          <PatternCard
            title="Sliding Window"
            description='The go-to pattern for "best subarray/substring" problems. Expand right, shrink left, track state.'
            signals={[
              '"Longest/shortest subarray/substring"',
              '"At most K…"',
              '"Contains all…"',
              '"Maximum sum/average in a range"',
            ]}
            tools={["left/right pointers", "hashmap / counts", "shrink while invalid"]}
            href="/?mode=sliding-window"
          />
          <PatternCard
            title="Two Pointers"
            description="For sorted arrays, pairs, and problems with monotonic movement. Move inward or fast/slow."
            signals={[
              "Sorted arrays",
              "Pairs / triplets",
              '"Closest to target"',
              '"Remove duplicates" / "partition"',
            ]}
            tools={["inward pointers", "fast/slow pointers", "greedy movement"]}
          />
          <PatternCard
            title="Hash Map / Last Seen"
            description="When you need fast lookup for uniqueness, frequency, or position tracking."
            signals={["Uniqueness, frequency, first time", '"Most common"', "Fast lookup needed"]}
            tools={["map[value] = index", "frequency counters", "sets for membership"]}
          />
          <PatternCard
            title="Prefix Sums"
            description="Precompute cumulative totals for instant range queries and subarray sum problems."
            signals={["Range sums", "Subarray sum = K", "Many queries on cumulative totals"]}
            tools={["prefix[i] = prefix[i-1] + arr[i]", "map of prefix sums seen"]}
          />
          <PatternCard
            title="Monotonic Stack"
            description='Maintain a stack with an invariant for "next greater element" style problems.'
            signals={[
              '"Next greater element"',
              '"Daily temperatures"',
              "Histogram / trapping style shapes",
            ]}
            tools={["stack of indices", "increasing/decreasing invariant"]}
          />
          <PatternCard
            title="Dynamic Programming"
            description="For overlapping subproblems and optimal substructure. State + transitions + memoization."
            signals={[
              "Overlapping subproblems",
              '"Count ways", "min cost", "best score"',
              "Decisions with state",
            ]}
            tools={["dp[state]", "transitions based on choices", "memoization or bottom-up"]}
          />
        </div>
      </section>

      {/* Classic Problems */}
      <section className="space-y-6">
        <h2 className="text-primary flex items-center gap-3 text-2xl font-semibold">
          <span className="text-accent">
            <Code2 className="h-5 w-5" />
          </span>
          Classic Problems
        </h2>
        <Link
          href="/learn/sliding-window/longest-substring"
          className={cn(
            "group block rounded-xl border border-border bg-surface p-6",
            "transition-all duration-200",
            "hover:border-accent/50 hover:bg-accent/5"
          )}
        >
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <div>
                <span className="bg-amber-500/20 text-amber-500 rounded-md px-2 py-1 text-xs font-medium">
                  Medium
                </span>
              </div>
              <h3 className="text-primary text-xl font-semibold">
                Longest Substring Without Repeating Characters
              </h3>
              <p className="text-muted text-sm italic">&ldquo;The Bouncer at the Club&rdquo;</p>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="bg-accent/20 text-accent rounded-md px-2 py-1 font-medium">
                  Sliding Window + Hash Map
                </span>
                <span className="bg-surface-elevated text-muted rounded-md px-2 py-1">
                  <Clock className="mr-1 inline-block h-3 w-3" />
                  O(n)
                </span>
                <span className="bg-surface-elevated text-muted rounded-md px-2 py-1">
                  <Code2 className="mr-1 inline-block h-3 w-3" />
                  O(min(n, alphabet))
                </span>
              </div>
            </div>
            <ArrowRight
              className={cn(
                "h-5 w-5 text-accent opacity-0 transition-all duration-200",
                "group-hover:translate-x-1 group-hover:opacity-100"
              )}
            />
          </div>
          <div className="mt-4 space-y-3">
            <div>
              <p className="text-primary text-sm font-medium">What you&apos;ll learn:</p>
              <ul className="text-muted mt-1 text-sm space-y-1">
                <li className="flex items-start gap-2">
                  <Zap className="mt-0.5 h-3 w-3 shrink-0 text-emerald-500" />
                  How to keep a window valid (unique chars)
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="mt-0.5 h-3 w-3 shrink-0 text-emerald-500" />
                  When to move left vs right
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="mt-0.5 h-3 w-3 shrink-0 text-emerald-500" />
                  Why left = max(left, lastSeen[char] + 1) matters
                </li>
              </ul>
            </div>
            <div
              className={cn(
                "rounded-lg border border-amber-500/20 bg-amber-500/5 p-3",
                "flex items-start gap-2"
              )}
            >
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
              <p className="text-muted text-sm">
                <strong className="text-primary">Common pitfall:</strong> Moving left backwards.
                Once left moves forward, it never goes back.
              </p>
            </div>
          </div>
        </Link>
        <p className="text-muted text-sm">
          More pattern problems coming soon. Each includes visual walkthroughs and interview tips.
        </p>
      </section>

      {/* Meta Pattern Questions */}
      <section className="space-y-6">
        <h2 className="text-primary flex items-center gap-3 text-2xl font-semibold">
          <span className="text-accent">
            <HelpCircle className="h-5 w-5" />
          </span>
          Meta Pattern Questions
        </h2>
        <div className="space-y-4">
          <InterviewQuestion
            question="How do I choose the right pattern quickly?"
            answer={`Look at the shape of the requirement. "Best subarray/substring" → Sliding Window. "Sorted + pair/closest" → Two Pointers. "Range sum repeated" → Prefix Sums. "Next greater / skyline" → Monotonic Stack. "Optimal + choices" → DP. If you can state the invariant in one sentence, you're probably on the right track.`}
          />
          <InterviewQuestion
            question="What if I start with the wrong pattern?"
            answer={`That's normal. Say it, then pivot: "I tried sliding window, but validity doesn't behave monotonically." or "This needs backtracking/DP because choices branch." Interviewers don't penalize pivots — they penalize silent guessing.`}
          />
          <InterviewQuestion
            question="Should I memorize solutions?"
            answer="Memorize pattern templates, not solutions. The window expand/shrink loop. The two-pointer movement rules. The prefix sum map trick. The monotonic stack invariant. The DP state + transition. Patterns transfer. Copy-pasting solutions does not."
          />
        </div>
      </section>

      {/* Myths vs Reality */}
      <section className="space-y-6">
        <h2 className="text-primary flex items-center gap-3 text-2xl font-semibold">
          <span className="text-accent">
            <Sparkles className="h-5 w-5" />
          </span>
          Myths vs Reality
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <MythCard
            myth="You need to instantly know the trick"
            reality="Most strong candidates discover the trick by asking the right questions and naming patterns."
          />
          <MythCard
            myth="Sliding window is only for strings"
            reality="It's for any 'best range' problem: arrays, streams, logs, metrics, anything."
          />
          <MythCard
            myth="Hash maps are cheating"
            reality="They're the point. If the constraint says 'fast lookup', the map is your best friend."
          />
          <MythCard
            myth="DP is always complicated"
            reality='Many DP problems are just "make the state obvious" and write transitions cleanly.'
          />
        </div>
      </section>

      {/* Practice Patterns */}
      <section className="space-y-6">
        <h2 className="text-primary flex items-center gap-3 text-2xl font-semibold">
          <span className="text-accent">
            <Target className="h-5 w-5" />
          </span>
          Practice Patterns
        </h2>
        <div className="space-y-4">
          <p className="text-muted leading-relaxed">
            Pick a pattern and grind 3 reps. You don&apos;t need 50 problems a day. You need{" "}
            <strong className="text-primary">pattern clarity</strong> and{" "}
            <strong className="text-primary">consistency</strong>.
          </p>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-surface">
                  <th className="text-primary px-4 py-3 text-left font-semibold">Pattern</th>
                  <th className="text-primary px-4 py-3 text-left font-semibold">Practice Focus</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-border bg-background">
                  <td className="text-accent px-4 py-3 font-medium">Sliding Window</td>
                  <td className="text-muted px-4 py-3">
                    unique chars / at most K / min window substring
                  </td>
                </tr>
                <tr className="border-t border-border bg-surface/30">
                  <td className="text-accent px-4 py-3 font-medium">Two Pointers</td>
                  <td className="text-muted px-4 py-3">pair sum / partition / remove duplicates</td>
                </tr>
                <tr className="border-t border-border bg-background">
                  <td className="text-accent px-4 py-3 font-medium">Prefix Sum</td>
                  <td className="text-muted px-4 py-3">subarray sum K / range queries</td>
                </tr>
                <tr className="border-t border-border bg-surface/30">
                  <td className="text-accent px-4 py-3 font-medium">Monotonic Stack</td>
                  <td className="text-muted px-4 py-3">next greater / histogram area</td>
                </tr>
                <tr className="border-t border-border bg-background">
                  <td className="text-accent px-4 py-3 font-medium">DP</td>
                  <td className="text-muted px-4 py-3">
                    climbing stairs / house robber / knapsack-lite
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className={cn(
          "rounded-xl border border-border bg-gradient-to-r from-accent/5 to-transparent p-8",
          "text-center"
        )}
      >
        <h2 className="text-primary mb-4 text-2xl font-semibold">Practice Pattern Problems</h2>
        <p className="text-muted mx-auto mb-6 max-w-lg">
          Watch patterns in action with step-by-step visualizations. See how the window expands, how
          pointers move, and how state evolves.
        </p>
        <Link
          href="/?mode=sliding-window"
          className={cn(
            "inline-flex items-center gap-2 rounded-lg",
            "bg-accent px-6 py-3 font-medium text-white",
            "transition-colors hover:bg-accent/90"
          )}
        >
          Open Patterns Visualizer
        </Link>
      </section>
    </div>
  );
}
