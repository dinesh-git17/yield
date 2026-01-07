import {
  AlertTriangle,
  ArrowUpDown,
  BookOpen,
  Brain,
  Briefcase,
  CheckCircle2,
  CreditCard,
  Globe,
  GraduationCap,
  Heart,
  HelpCircle,
  Lightbulb,
  Smartphone,
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
import { SORTING_ARTICLES } from "@/features/learning/content/sorting";
import type { SortingAlgorithmType } from "@/lib/store";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Sorting Algorithms | Learn",
  description:
    "Master sorting algorithms with interactive comparisons. Understand when to use Bubble, Quick, Merge, and Heap Sort with real-world examples and interview questions.",
  alternates: {
    canonical: "/learn/sorting",
  },
  openGraph: {
    title: "Sorting Algorithms — Yield",
    description:
      "Master sorting algorithms with interactive comparisons. Understand when to use Bubble, Quick, Merge, and Heap Sort with real-world examples and interview questions.",
    url: "/learn/sorting",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sorting Algorithms — Yield",
    description:
      "Master sorting algorithms: Bubble, Quick, Merge, Heap and more with real-world examples.",
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
          Master 7 sorting algorithms with side-by-side comparisons. Understand when to use each
          one, explore real-world applications, and prepare for technical interviews.
        </p>
      </header>

      {/* What Is Sorting? */}
      <section className="space-y-6">
        <h2 className="text-primary flex items-center gap-3 text-2xl font-semibold">
          <span className="text-accent">
            <Lightbulb className="h-5 w-5" />
          </span>
          What Is Sorting?
        </h2>
        <div className="space-y-4">
          <p className="text-muted leading-relaxed">
            Sorting is the process of arranging data into a meaningful order so computers can work
            with it more efficiently. When data is sorted:
          </p>
          <ul className="text-muted grid gap-2 sm:grid-cols-2">
            <li className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-emerald-500" />
              Searching becomes faster
            </li>
            <li className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-emerald-500" />
              Duplicate detection becomes easier
            </li>
            <li className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-emerald-500" />
              Range queries become possible
            </li>
            <li className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-emerald-500" />
              Humans can understand the data
            </li>
          </ul>
          <p className="text-muted leading-relaxed">
            At its core, sorting is about <strong className="text-primary">reducing chaos</strong>.
            An unsorted list forces a computer to scan everything. A sorted list lets it skip huge
            chunks instantly.
          </p>
          <div
            className={cn(
              "rounded-lg border border-accent/20 bg-accent/5 p-4",
              "flex items-start gap-3"
            )}
          >
            <Brain className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
            <p className="text-muted text-sm leading-relaxed">
              <strong className="text-primary">Mental model:</strong> Sorting is like organizing
              your room. Once everything has a place, finding things stops being stressful and
              starts being fast.
            </p>
          </div>
        </div>
      </section>

      {/* Why Sorting Speed Matters */}
      <section className="space-y-6">
        <h2 className="text-primary flex items-center gap-3 text-2xl font-semibold">
          <span className="text-accent">
            <Briefcase className="h-5 w-5" />
          </span>
          Why Sorting Speed Matters
        </h2>
        <p className="text-muted leading-relaxed">
          Sorting is not an academic problem. It sits at the heart of real systems that people rely
          on every day.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <RealWorldCard
            icon={<Heart className="h-5 w-5" />}
            title="Healthcare"
            examples={[
              "Patient records sorted by urgency",
              "Lab results sorted by timestamp",
              "Delays in sorting can delay decisions",
            ]}
          />
          <RealWorldCard
            icon={<CreditCard className="h-5 w-5" />}
            title="Finance & Trading"
            examples={[
              "Orders sorted by price and time",
              "Risk systems sorting positions in real time",
              "A slow sort here costs real money",
            ]}
          />
          <RealWorldCard
            icon={<Globe className="h-5 w-5" />}
            title="Search Engines"
            examples={[
              "Results sorted by relevance",
              "Ads sorted by bid and quality score",
              "Millions of sorts per second",
            ]}
          />
          <RealWorldCard
            icon={<Smartphone className="h-5 w-5" />}
            title="Everyday Apps"
            examples={[
              "Messages sorted by time",
              "Notifications sorted by priority",
              "Photos sorted by date or location",
            ]}
          />
        </div>
        <p className="text-muted text-sm">
          <strong className="text-primary">Key takeaway:</strong> Sorting is invisible when it is
          fast. Very noticeable when it is slow.
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
        <ComparisonTable mode="sorting" headers={TABLE_HEADERS} rows={rows} />
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
          Why There Is No "Best" Sorting Algorithm
        </h2>
        <p className="text-muted leading-relaxed">
          Different problems come with different constraints. Some care about speed. Some care about
          memory. Some care about preserving order. Some deal with nearly sorted data. Some deal
          with chaos.
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
                <td className="text-muted px-4 py-3">Small or nearly sorted arrays</td>
                <td className="px-4 py-3">
                  <Link href="/learn/sorting/insertion" className="text-accent hover:underline">
                    Insertion Sort
                  </Link>
                </td>
              </tr>
              <tr className="border-t border-border bg-surface/30">
                <td className="text-muted px-4 py-3">Large datasets</td>
                <td className="px-4 py-3">
                  <Link href="/learn/sorting/merge" className="text-accent hover:underline">
                    Merge Sort
                  </Link>{" "}
                  or{" "}
                  <Link href="/learn/sorting/quick" className="text-accent hover:underline">
                    Quick Sort
                  </Link>
                </td>
              </tr>
              <tr className="border-t border-border bg-background">
                <td className="text-muted px-4 py-3">Memory-constrained systems</td>
                <td className="px-4 py-3">
                  <Link href="/learn/sorting/heap" className="text-accent hover:underline">
                    Heap Sort
                  </Link>
                </td>
              </tr>
              <tr className="border-t border-border bg-surface/30">
                <td className="text-muted px-4 py-3">Learning fundamentals</td>
                <td className="px-4 py-3">
                  <Link href="/learn/sorting/bubble" className="text-accent hover:underline">
                    Bubble
                  </Link>{" "}
                  or{" "}
                  <Link href="/learn/sorting/selection" className="text-accent hover:underline">
                    Selection Sort
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-muted text-sm">
          <strong className="text-primary">Engineering reality:</strong> Choosing a sorting
          algorithm is about tradeoffs, not perfection.
        </p>
      </section>

      {/* Decision Guide */}
      <DecisionGuide title="Quick Decision Guide" mode="sorting" cards={DECISION_CARDS} />

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
            question="Why is Quick Sort usually faster than Merge Sort in practice?"
            answer="Quick Sort has better cache locality and sorts in place. Even though both are O(n log n), constant factors matter."
          />
          <InterviewQuestion
            question="Is Quick Sort stable?"
            answer="No. Equal elements can change relative order during partitioning."
            followUp="Follow-up: Merge Sort is stable by default, making it better for sorting objects with multiple keys."
          />
          <InterviewQuestion
            question="What is the fastest possible comparison-based sorting algorithm?"
            answer="O(n log n). You cannot do better using only comparisons. This is a proven mathematical lower bound."
          />
          <InterviewQuestion
            question="When does Insertion Sort run in O(n)?"
            answer="When the array is already sorted or nearly sorted. This is why it is used inside real-world hybrid sorts like Timsort."
          />
          <InterviewQuestion
            question="Why is Bubble Sort still taught?"
            answer="Because it is simple, visual, and helps build intuition around comparisons and swaps. It exists to teach concepts, not to win benchmarks."
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
              Sorting Myths
            </h3>
            <div className="space-y-2">
              <MythCard
                myth='"Bubble Sort is useless"'
                reality="Great for learning and has early-exit optimization"
              />
              <MythCard
                myth='"Big O is everything"'
                reality="Cache behavior, memory, and constants matter"
              />
              <MythCard
                myth='"One algorithm fits all cases"'
                reality="Real engineers choose based on constraints"
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
                  Many standard libraries use <strong className="text-primary">hybrid sorts</strong>{" "}
                  (Timsort, Introsort)
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
                  Sorting is often the <strong className="text-primary">slowest step</strong> in
                  data pipelines
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
                  Many interview problems secretly start with{" "}
                  <strong className="text-primary">"sort the input first"</strong>
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
                  Real data is often <strong className="text-primary">nearly sorted</strong>, not
                  random
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
          <h3 className="text-primary font-semibold">Sorting Is Just Organized Chaos</h3>
          <p className="text-muted text-sm leading-relaxed">
            Bubble Sort politely swaps neighbors. Quick Sort aggressively partitions. Heap Sort
            repeatedly throws the largest element to the end. Different personalities, same goal.
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
        <h2 className="text-primary mb-4 text-2xl font-semibold">See Sorting in Action</h2>
        <p className="text-muted mx-auto mb-6 max-w-lg">
          Pick an algorithm and watch how it transforms chaos into order. Try sorting the same array
          with different algorithms and feel the difference in behavior, speed, and movement.
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
