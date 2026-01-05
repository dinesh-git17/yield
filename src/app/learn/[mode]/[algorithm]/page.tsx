import { Clock, Code2, HardDrive, Lightbulb, Target, XCircle } from "lucide-react";
import { notFound } from "next/navigation";
import { getAlgorithmMetadata } from "@/features/algorithms";
import { getSortingArticle } from "@/features/learning/content/sorting";
import type { SortingAlgorithmType, VisualizerMode } from "@/lib/store";
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

function isValidMode(mode: string): mode is VisualizerMode {
  return VALID_MODES.includes(mode as VisualizerMode);
}

function isValidSortingAlgorithm(algorithm: string): algorithm is SortingAlgorithmType {
  return VALID_SORTING_ALGORITHMS.includes(algorithm as SortingAlgorithmType);
}

export default async function LearnPage({ params }: LearnPageProps) {
  const { mode, algorithm } = await params;

  if (!isValidMode(mode)) {
    notFound();
  }

  // Currently only sorting content is available
  if (mode !== "sorting" || !isValidSortingAlgorithm(algorithm)) {
    notFound();
  }

  const article = getSortingArticle(algorithm);
  const metadata = getAlgorithmMetadata(algorithm);

  return (
    <article className="space-y-16">
      {/* Hero Section */}
      <header className="space-y-6 text-center">
        <div className="space-y-2">
          <p className="text-accent text-sm font-medium uppercase tracking-wider">
            Sorting Algorithm
          </p>
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
        </div>
      </header>

      {/* History Section */}
      <Section title="History" icon={<Lightbulb className="h-5 w-5" />}>
        <Prose content={article.history} />
      </Section>

      {/* How it Works Section */}
      <Section title="How It Works" icon={<Target className="h-5 w-5" />}>
        <Prose content={article.mechanics} />

        {/* Complexity Details */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <ComplexityCard
            title="Best Case"
            complexity={article.bestCase.complexity}
            explanation={article.bestCase.explanation}
            variant="good"
          />
          <ComplexityCard
            title="Worst Case"
            complexity={article.worstCase.complexity}
            explanation={article.worstCase.explanation}
            variant="fair"
          />
          <ComplexityCard
            title="Average Case"
            complexity={article.averageCase.complexity}
            explanation={article.averageCase.explanation}
            variant="neutral"
          />
          <ComplexityCard
            title="Space"
            complexity={article.spaceComplexity.complexity}
            explanation={article.spaceComplexity.explanation}
            variant={article.spaceComplexity.complexity === "O(1)" ? "good" : "neutral"}
          />
        </div>
      </Section>

      {/* Code Walkthrough Section */}
      <Section title="Code Walkthrough" icon={<Code2 className="h-5 w-5" />}>
        <div
          className={cn(
            "overflow-hidden rounded-xl border border-border",
            "bg-surface font-mono text-sm"
          )}
        >
          <div className="border-b border-border bg-surface-elevated px-4 py-2">
            <span className="text-muted text-xs">pseudocode</span>
          </div>
          <pre className="overflow-x-auto p-4">
            <code className="text-primary">
              {metadata.code.map((line, index) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: Static code lines never reorder
                <div key={index} className="leading-relaxed">
                  <span className="text-muted mr-4 inline-block w-6 select-none text-right">
                    {index + 1}
                  </span>
                  <span>{line}</span>
                </div>
              ))}
            </code>
          </pre>
        </div>
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

  if (mode === "sorting" && isValidSortingAlgorithm(algorithm)) {
    const article = getSortingArticle(algorithm);
    return {
      title: `${article.title} | Learn | Yield`,
      description: `Learn about ${article.title}: ${article.tagline}. ${article.mechanics.slice(0, 150)}...`,
    };
  }

  return {
    title: "Learn | Yield",
    description: "Learn about algorithms with Yield — Algorithm Visualizer",
  };
}

export function generateStaticParams() {
  return VALID_SORTING_ALGORITHMS.map((algorithm) => ({
    mode: "sorting",
    algorithm,
  }));
}
