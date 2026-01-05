import { Clock, Code2, Compass, HardDrive, Lightbulb, Route, Target, XCircle } from "lucide-react";
import { notFound } from "next/navigation";
import { getAlgorithmMetadata } from "@/features/algorithms";
import { getPathfindingAlgorithmMetadata } from "@/features/algorithms/pathfinding/config";
import { CodeTabs } from "@/features/learning/components";
import {
  getPathfindingArticle,
  type PathfindingArticle,
} from "@/features/learning/content/pathfinding";
import { getSortingArticle, type SortingArticle } from "@/features/learning/content/sorting";
import type { PathfindingAlgorithmType, SortingAlgorithmType, VisualizerMode } from "@/lib/store";
import { cn } from "@/lib/utils";

interface LearnPageProps {
  params: Promise<{
    mode: string;
    algorithm: string;
  }>;
}

const VALID_MODES = ["sorting", "pathfinding", "tree", "graph"] as const;
const VALID_SORTING_ALGORITHMS = [
  "bubble",
  "selection",
  "insertion",
  "gnome",
  "quick",
  "merge",
  "heap",
] as const;
const VALID_PATHFINDING_ALGORITHMS = [
  "bfs",
  "dfs",
  "dijkstra",
  "astar",
  "greedy",
  "bidirectional",
  "flood",
  "random",
] as const;

function isValidMode(mode: string): mode is VisualizerMode {
  return VALID_MODES.includes(mode as VisualizerMode);
}

function isValidSortingAlgorithm(algorithm: string): algorithm is SortingAlgorithmType {
  return VALID_SORTING_ALGORITHMS.includes(algorithm as SortingAlgorithmType);
}

function isValidPathfindingAlgorithm(algorithm: string): algorithm is PathfindingAlgorithmType {
  return VALID_PATHFINDING_ALGORITHMS.includes(algorithm as PathfindingAlgorithmType);
}

/**
 * Unified article type for polymorphic page rendering.
 */
type ArticleContent =
  | { mode: "sorting"; article: SortingArticle; algorithm: SortingAlgorithmType }
  | { mode: "pathfinding"; article: PathfindingArticle; algorithm: PathfindingAlgorithmType };

/**
 * Factory function to get the appropriate article based on mode and algorithm.
 */
function getArticle(mode: string, algorithm: string): ArticleContent | null {
  if (mode === "sorting" && isValidSortingAlgorithm(algorithm)) {
    return {
      mode: "sorting",
      article: getSortingArticle(algorithm),
      algorithm,
    };
  }
  if (mode === "pathfinding" && isValidPathfindingAlgorithm(algorithm)) {
    return {
      mode: "pathfinding",
      article: getPathfindingArticle(algorithm),
      algorithm,
    };
  }
  return null;
}

/**
 * Get algorithm metadata (time/space complexity) based on mode.
 */
function getMetadata(mode: string, algorithm: string) {
  if (mode === "sorting" && isValidSortingAlgorithm(algorithm)) {
    return getAlgorithmMetadata(algorithm);
  }
  if (mode === "pathfinding" && isValidPathfindingAlgorithm(algorithm)) {
    return getPathfindingAlgorithmMetadata(algorithm);
  }
  return null;
}

export default async function LearnPage({ params }: LearnPageProps) {
  const { mode, algorithm } = await params;

  if (!isValidMode(mode)) {
    notFound();
  }

  const content = getArticle(mode, algorithm);
  const metadata = getMetadata(mode, algorithm);

  if (!content || !metadata) {
    notFound();
  }

  const { article } = content;

  // Mode-specific labels and icons
  const modeConfig = {
    sorting: {
      label: "Sorting Algorithm",
      icon: <Target className="h-5 w-5" />,
    },
    pathfinding: {
      label: "Pathfinding Algorithm",
      icon: <Compass className="h-5 w-5" />,
    },
  };

  const config = modeConfig[content.mode];

  return (
    <article className="space-y-16">
      {/* Hero Section */}
      <header className="space-y-6 text-center">
        <div className="space-y-2">
          <p className="text-accent text-sm font-medium uppercase tracking-wider">{config.label}</p>
          <h1 className="text-primary text-4xl font-bold tracking-tight sm:text-5xl">
            {article.title}
          </h1>
          <p className="text-muted text-xl italic">&ldquo;{article.tagline}&rdquo;</p>
        </div>

        {/* Complexity Badges */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <ComplexityBadge
            icon={<Clock className="h-4 w-4" />}
            label="Time"
            value={metadata.complexity}
            variant={getComplexityVariant(metadata.complexity)}
          />
          <ComplexityBadge
            icon={<HardDrive className="h-4 w-4" />}
            label="Space"
            value={metadata.spaceComplexity}
            variant={getComplexityVariant(metadata.spaceComplexity)}
          />
          {/* Pathfinding-specific: Shortest Path Guarantee */}
          {content.mode === "pathfinding" && (
            <ComplexityBadge
              icon={<Route className="h-4 w-4" />}
              label="Shortest Path"
              value={content.article.guaranteesShortestPath ? "Guaranteed" : "Not Guaranteed"}
              variant={content.article.guaranteesShortestPath ? "excellent" : "fair"}
            />
          )}
        </div>
      </header>

      {/* History Section */}
      <Section title="History" icon={<Lightbulb className="h-5 w-5" />}>
        <Prose content={article.history} />
      </Section>

      {/* How it Works Section */}
      <Section title="How It Works" icon={config.icon}>
        <Prose content={article.mechanics} />

        {/* Complexity Details - Sorting has 4 cases, Pathfinding has 2 */}
        {content.mode === "sorting" ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <ComplexityCard
              title="Best Case"
              complexity={content.article.bestCase.complexity}
              explanation={content.article.bestCase.explanation}
              variant="good"
            />
            <ComplexityCard
              title="Worst Case"
              complexity={content.article.worstCase.complexity}
              explanation={content.article.worstCase.explanation}
              variant="fair"
            />
            <ComplexityCard
              title="Average Case"
              complexity={content.article.averageCase.complexity}
              explanation={content.article.averageCase.explanation}
              variant="neutral"
            />
            <ComplexityCard
              title="Space"
              complexity={content.article.spaceComplexity.complexity}
              explanation={content.article.spaceComplexity.explanation}
              variant={content.article.spaceComplexity.complexity === "O(1)" ? "good" : "neutral"}
            />
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <ComplexityCard
              title="Time Complexity"
              complexity={content.article.timeComplexity.complexity}
              explanation={content.article.timeComplexity.explanation}
              variant="neutral"
            />
            <ComplexityCard
              title="Space Complexity"
              complexity={content.article.spaceComplexity.complexity}
              explanation={content.article.spaceComplexity.explanation}
              variant={content.article.spaceComplexity.complexity === "O(1)" ? "good" : "neutral"}
            />
            <ComplexityCard
              title="Data Structure"
              complexity={content.article.dataStructure}
              explanation={`The core data structure powering ${content.article.title}.`}
              variant="neutral"
            />
            <ComplexityCard
              title="Visual Pattern"
              complexity={content.article.visualPattern}
              explanation="How this algorithm appears during visualization."
              variant="neutral"
            />
          </div>
        )}
      </Section>

      {/* Code Walkthrough Section */}
      <Section title="Code Walkthrough" icon={<Code2 className="h-5 w-5" />}>
        <p className="text-muted mb-4 text-sm">
          Real implementations in multiple programming languages. Select a language to view
          idiomatic code.
        </p>
        <CodeTabs mode={content.mode} algorithm={algorithm} />
      </Section>

      {/* Real World Use Cases Section */}
      <Section title="Real World Use Cases">
        <ul className="space-y-3">
          {article.useCases.map((useCase, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: Static content never reorders
            <li key={index} className="flex items-start gap-3">
              <span className="bg-accent/20 text-accent mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium">
                {index + 1}
              </span>
              <span className="text-primary/80">{useCase}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* Key Insights Section */}
      <Section title="Key Insights">
        <ul className="grid gap-3 sm:grid-cols-2">
          {article.keyInsights.map((insight, index) => (
            <li
              // biome-ignore lint/suspicious/noArrayIndexKey: Static content never reorders
              key={index}
              className={cn(
                "flex items-start gap-2 rounded-lg border border-border p-4",
                "bg-surface"
              )}
            >
              <Lightbulb className="text-accent mt-0.5 h-4 w-4 shrink-0" />
              <span className="text-primary/80 text-sm">{insight}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* When to Use / When Not to Use */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div
          className={cn(
            "rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-6",
            "space-y-3"
          )}
        >
          <div className="flex items-center gap-2 text-emerald-500">
            <Target className="h-5 w-5" />
            <h3 className="font-semibold">When to Use</h3>
          </div>
          <p className="text-primary/80 text-sm leading-relaxed">{article.whenToUse}</p>
        </div>

        <div className={cn("rounded-xl border border-rose-500/30 bg-rose-500/10 p-6", "space-y-3")}>
          <div className="flex items-center gap-2 text-rose-500">
            <XCircle className="h-5 w-5" />
            <h3 className="font-semibold">When NOT to Use</h3>
          </div>
          <p className="text-primary/80 text-sm leading-relaxed">{article.whenNotToUse}</p>
        </div>
      </div>

      {/* Back to Visualizer CTA */}
      <div className="pt-8 text-center">
        <a
          href={`/?mode=${mode}&algorithm=${algorithm}`}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl px-6 py-3",
            "bg-accent text-white font-medium",
            "transition-transform hover:scale-105 active:scale-95"
          )}
        >
          Watch {article.title} in Action
        </a>
      </div>
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper Components
// ─────────────────────────────────────────────────────────────────────────────

interface SectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

function Section({ title, icon, children }: SectionProps) {
  return (
    <section className="space-y-6">
      <h2 className="text-primary flex items-center gap-3 text-2xl font-semibold">
        {icon && <span className="text-accent">{icon}</span>}
        {title}
      </h2>
      {children}
    </section>
  );
}

interface ProseProps {
  content: string;
}

function Prose({ content }: ProseProps) {
  // Split content by double newlines for paragraphs
  // Handle **bold** markdown syntax
  const paragraphs = content.split(/\n\n+/);

  return (
    <div className="prose-content space-y-4">
      {paragraphs.map((paragraph, index) => {
        // Generate a stable key from content
        const key = `p-${index}-${paragraph.slice(0, 20).replace(/\W/g, "")}`;

        // Check if it's a list item or header
        if (paragraph.startsWith("**") && paragraph.includes(":**")) {
          // It's a subheading
          const parts = paragraph.split(":**");
          const heading = parts[0] ?? "";
          const rest = parts.slice(1);
          const headingText = heading.replace(/\*\*/g, "");
          return (
            <div key={key} className="space-y-2">
              <h4 className="text-primary font-semibold">{headingText}</h4>
              <p className="text-primary/80 leading-relaxed">{rest.join(":**")}</p>
            </div>
          );
        }

        if (paragraph.startsWith("- ") || paragraph.startsWith("1. ")) {
          // It's a list
          const items = paragraph.split("\n").filter(Boolean);
          const isOrdered = paragraph.startsWith("1. ");
          const ListTag = isOrdered ? "ol" : "ul";

          return (
            <ListTag
              key={key}
              className={cn("space-y-2", isOrdered ? "list-decimal pl-6" : "list-disc pl-6")}
            >
              {items.map((item) => (
                <li key={item.slice(0, 30)} className="text-primary/80 leading-relaxed">
                  {item.replace(/^[-\d]+\.\s*/, "").replace(/\*\*(.*?)\*\*/g, "$1")}
                </li>
              ))}
            </ListTag>
          );
        }

        // Regular paragraph - process bold text inline without dangerouslySetInnerHTML
        return <ProseParagraph key={key} text={paragraph} />;
      })}
    </div>
  );
}

/**
 * Renders a paragraph with inline bold text processing.
 * Avoids dangerouslySetInnerHTML by parsing markdown bold syntax into React elements.
 */
function ProseParagraph({ text }: { text: string }) {
  // Split by **...** patterns and render bold segments as <strong>
  const parts = text.split(/(\*\*.*?\*\*)/g);

  return (
    <p className="text-primary/80 leading-relaxed">
      {parts.map((part) => {
        // Use content as key since parts are unique text segments
        const key = `part-${part.slice(0, 20).replace(/\W/g, "") || "empty"}`;
        if (part.startsWith("**") && part.endsWith("**")) {
          const boldText = part.slice(2, -2);
          return (
            <strong key={key} className="text-primary font-semibold">
              {boldText}
            </strong>
          );
        }
        return <span key={key}>{part}</span>;
      })}
    </p>
  );
}

interface ComplexityBadgeProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  variant: "excellent" | "good" | "fair";
}

const BADGE_VARIANTS = {
  excellent: "bg-emerald-500/20 text-emerald-500 border-emerald-500/30",
  good: "bg-sky-500/20 text-sky-500 border-sky-500/30",
  fair: "bg-amber-500/20 text-amber-500 border-amber-500/30",
} as const;

function ComplexityBadge({ icon, label, value, variant }: ComplexityBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-4 py-2",
        BADGE_VARIANTS[variant]
      )}
    >
      {icon}
      <span className="text-sm font-medium">
        {label}: <span className="font-mono">{value}</span>
      </span>
    </div>
  );
}

interface ComplexityCardProps {
  title: string;
  complexity: string;
  explanation: string;
  variant: "good" | "fair" | "neutral";
}

const CARD_VARIANTS = {
  good: "border-emerald-500/30 bg-emerald-500/5",
  fair: "border-amber-500/30 bg-amber-500/5",
  neutral: "border-border bg-surface",
} as const;

const CARD_BADGE_VARIANTS = {
  good: "text-emerald-500 bg-emerald-500/20",
  fair: "text-amber-500 bg-amber-500/20",
  neutral: "text-accent bg-accent/20",
} as const;

function ComplexityCard({ title, complexity, explanation, variant }: ComplexityCardProps) {
  return (
    <div className={cn("rounded-xl border p-4 space-y-2", CARD_VARIANTS[variant])}>
      <div className="flex items-center justify-between">
        <span className="text-muted text-sm font-medium">{title}</span>
        <span
          className={cn(
            "rounded-md px-2 py-1 font-mono text-sm font-semibold",
            CARD_BADGE_VARIANTS[variant]
          )}
        >
          {complexity}
        </span>
      </div>
      <p className="text-primary/70 text-sm leading-relaxed">{explanation}</p>
    </div>
  );
}

function getComplexityVariant(complexity: string): "excellent" | "good" | "fair" {
  if (complexity.includes("log n") && !complexity.includes("n log n")) {
    return "excellent";
  }
  if (complexity === "O(1)" || complexity === "O(n)" || complexity.includes("n log n")) {
    return "good";
  }
  return "fair";
}

// ─────────────────────────────────────────────────────────────────────────────
// Metadata
// ─────────────────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: LearnPageProps) {
  const { mode, algorithm } = await params;

  const content = getArticle(mode, algorithm);

  if (content) {
    const modeLabel = content.mode === "sorting" ? "Sorting" : "Pathfinding";
    return {
      title: `${content.article.title} | ${modeLabel} | Learn | Yield`,
      description: `Learn about ${content.article.title}: ${content.article.tagline}. ${content.article.mechanics.slice(0, 150)}...`,
    };
  }

  return {
    title: "Learn | Yield",
    description: "Learn about algorithms with Yield — Algorithm Visualizer",
  };
}

export function generateStaticParams() {
  const sortingParams = VALID_SORTING_ALGORITHMS.map((algorithm) => ({
    mode: "sorting",
    algorithm,
  }));

  const pathfindingParams = VALID_PATHFINDING_ALGORITHMS.map((algorithm) => ({
    mode: "pathfinding",
    algorithm,
  }));

  return [...sortingParams, ...pathfindingParams];
}
