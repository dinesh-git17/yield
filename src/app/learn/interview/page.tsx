import {
  AlertTriangle,
  BookOpen,
  Brain,
  CheckCircle2,
  Clock,
  Code2,
  GraduationCap,
  HelpCircle,
  Lightbulb,
  Target,
  XCircle,
  Zap,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { INTERVIEW_ARTICLES } from "@/features/learning/content/interview";
import type { InterviewProblemType } from "@/lib/store";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Interview Problems | Learn",
  description:
    "Master classic coding interview problems with visual explanations. Understand the optimal approaches, common pitfalls, and interview strategies for problems like Trapping Rain Water.",
  alternates: {
    canonical: "/learn/interview",
  },
  openGraph: {
    title: "Interview Problems — Yield",
    description:
      "Master classic coding interview problems with visual explanations and optimal solutions.",
    url: "/learn/interview",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Interview Problems — Yield",
    description: "Master classic coding interview problems with visual explanations.",
  },
};

const PROBLEM_ORDER: InterviewProblemType[] = ["trapping-rain-water"];

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

interface ProblemCardProps {
  slug: InterviewProblemType;
  title: string;
  tagline: string;
  difficulty: "Easy" | "Medium" | "Hard";
  pattern: string;
  timeComplexity: string;
  spaceComplexity: string;
}

function ProblemCard({
  slug,
  title,
  tagline,
  difficulty,
  pattern,
  timeComplexity,
  spaceComplexity,
}: ProblemCardProps) {
  const difficultyColors = {
    Easy: "bg-emerald-500/20 text-emerald-500",
    Medium: "bg-amber-500/20 text-amber-500",
    Hard: "bg-rose-500/20 text-rose-500",
  };

  return (
    <Link
      href={`/learn/interview/${slug}`}
      className={cn(
        "group relative block rounded-xl border border-border bg-surface p-6",
        "transition-all duration-200",
        "hover:border-accent/50 hover:bg-accent/5",
        "focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
      )}
    >
      {/* Difficulty badge */}
      <span
        className={cn(
          "absolute right-4 top-4 rounded-md px-2 py-1 text-xs font-medium",
          difficultyColors[difficulty]
        )}
      >
        {difficulty}
      </span>

      <div className="space-y-4">
        <div>
          <h3 className="text-primary text-xl font-semibold pr-16">{title}</h3>
          <p className="text-muted text-sm italic">&ldquo;{tagline}&rdquo;</p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="bg-accent/20 text-accent rounded-md px-2 py-1 font-medium">
            {pattern}
          </span>
          <span className="bg-surface-elevated text-muted rounded-md px-2 py-1">
            <Clock className="mr-1 inline-block h-3 w-3" />
            {timeComplexity}
          </span>
          <span className="bg-surface-elevated text-muted rounded-md px-2 py-1">
            <Code2 className="mr-1 inline-block h-3 w-3" />
            {spaceComplexity}
          </span>
        </div>

        <p className="text-muted text-sm">
          Click to learn the optimal approach with visual walkthroughs and interview tips.
        </p>
      </div>
    </Link>
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

export default function InterviewIndexPage() {
  const problems = PROBLEM_ORDER.map((slug) => ({
    slug,
    ...INTERVIEW_ARTICLES[slug],
  }));

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <header className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="bg-accent/10 text-accent rounded-lg p-2">
            <GraduationCap className="h-6 w-6" />
          </span>
          <h1 className="text-primary text-4xl font-bold">Interview Problems</h1>
        </div>
        <p className="text-muted max-w-2xl text-lg leading-relaxed">
          Master classic coding interview problems with visual explanations. Each problem includes
          multiple approaches, complexity analysis, and common interview pitfalls.
        </p>
      </header>

      {/* What Are Interview Problems? */}
      <section className="space-y-6">
        <h2 className="text-primary flex items-center gap-3 text-2xl font-semibold">
          <span className="text-accent">
            <Lightbulb className="h-5 w-5" />
          </span>
          What Are Interview Problems?
        </h2>
        <div className="space-y-4">
          <p className="text-muted leading-relaxed">
            Interview problems are carefully crafted puzzles that test your ability to:
          </p>
          <ul className="text-muted grid gap-2 sm:grid-cols-2">
            <li className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-emerald-500" />
              Recognize patterns and constraints
            </li>
            <li className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-emerald-500" />
              Choose the right data structure
            </li>
            <li className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-emerald-500" />
              Optimize from brute force to optimal
            </li>
            <li className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-emerald-500" />
              Communicate your thought process
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
              <strong className="text-primary">Key insight:</strong> The best interviewees
              don&apos;t just solve problems—they explain their reasoning, discuss tradeoffs, and
              iterate toward better solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Problems List */}
      <section className="space-y-6">
        <h2 className="text-primary flex items-center gap-3 text-2xl font-semibold">
          <span className="text-accent">
            <BookOpen className="h-5 w-5" />
          </span>
          Classic Problems
        </h2>
        <div className="grid gap-4">
          {problems.map((problem) => (
            <ProblemCard
              key={problem.slug}
              slug={problem.slug}
              title={problem.title}
              tagline={problem.tagline}
              difficulty={problem.difficulty}
              pattern={problem.pattern}
              timeComplexity={problem.timeComplexity.complexity}
              spaceComplexity={problem.spaceComplexity.complexity}
            />
          ))}
        </div>
        <p className="text-muted text-sm">
          More interview problems coming soon. Each includes multiple approaches, visual
          walkthroughs, and interview strategies.
        </p>
      </section>

      {/* Interview Strategy */}
      <section className="space-y-6">
        <h2 className="text-primary flex items-center gap-3 text-2xl font-semibold">
          <span className="text-accent">
            <Target className="h-5 w-5" />
          </span>
          The Interview Strategy
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-surface p-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="bg-accent/20 text-accent rounded-full px-3 py-1 text-sm font-medium">
                1
              </span>
              <h4 className="text-primary font-semibold">Clarify</h4>
            </div>
            <p className="text-muted text-sm leading-relaxed">
              Ask about constraints, edge cases, and expected inputs. Never assume.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="bg-accent/20 text-accent rounded-full px-3 py-1 text-sm font-medium">
                2
              </span>
              <h4 className="text-primary font-semibold">Brute Force First</h4>
            </div>
            <p className="text-muted text-sm leading-relaxed">
              Show understanding with a naive solution. This proves you can solve it.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="bg-accent/20 text-accent rounded-full px-3 py-1 text-sm font-medium">
                3
              </span>
              <h4 className="text-primary font-semibold">Identify the Pattern</h4>
            </div>
            <p className="text-muted text-sm leading-relaxed">
              Look for two pointers, sliding window, stack, or DP opportunities.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="bg-accent/20 text-accent rounded-full px-3 py-1 text-sm font-medium">
                4
              </span>
              <h4 className="text-primary font-semibold">Optimize & Code</h4>
            </div>
            <p className="text-muted text-sm leading-relaxed">
              Upgrade to the optimal solution and implement cleanly.
            </p>
          </div>
        </div>
      </section>

      {/* Common Interview Questions */}
      <section className="space-y-6">
        <h2 className="text-primary flex items-center gap-3 text-2xl font-semibold">
          <span className="text-accent">
            <HelpCircle className="h-5 w-5" />
          </span>
          Meta Interview Questions
        </h2>
        <div className="space-y-4">
          <InterviewQuestion
            question="What if I can't solve the problem optimally?"
            answer="That's okay. Interviewers want to see your thought process. Start with brute force, explain why it's suboptimal, and work toward improvements. Partial progress is better than silence."
          />
          <InterviewQuestion
            question="Should I memorize solutions?"
            answer="Memorize patterns, not solutions. If you understand why Two Pointers works for Trapping Rain Water, you can apply it to Container With Most Water and other problems."
          />
          <InterviewQuestion
            question="How do I know which pattern to use?"
            answer="Look at the constraints. Sorted array? Consider binary search. Need O(n) with O(1) space? Consider two pointers. Subarray/substring problems? Consider sliding window."
          />
        </div>
      </section>

      {/* Myths vs Reality */}
      <section className="space-y-6">
        <h2 className="text-primary flex items-center gap-3 text-2xl font-semibold">
          <span className="text-accent">
            <AlertTriangle className="h-5 w-5" />
          </span>
          Myths vs Reality
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <MythCard
            myth="You need to solve every problem in 15 minutes"
            reality="Most interviews allow 30-45 minutes per problem. Use time to clarify and explain."
          />
          <MythCard
            myth="You must have the optimal solution immediately"
            reality="Showing progression from naive to optimal demonstrates strong problem-solving skills."
          />
          <MythCard
            myth="Silence while thinking is bad"
            reality="Narrating your thought process (even when stuck) shows reasoning ability."
          />
          <MythCard
            myth="LeetCode Hard problems are common"
            reality="Most interviews focus on Medium problems with follow-up questions."
          />
        </div>
      </section>

      {/* Back to Visualizer CTA */}
      <div className="pt-8 text-center">
        <Link
          href="/?mode=interview"
          className={cn(
            "inline-flex items-center gap-2 rounded-xl px-6 py-3",
            "bg-accent text-white font-medium",
            "transition-transform hover:scale-105 active:scale-95"
          )}
        >
          Practice Interview Problems
        </Link>
      </div>
    </div>
  );
}
