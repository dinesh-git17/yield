import katex from "katex";
import {
  AlertTriangle,
  Clock,
  Code2,
  Compass,
  GraduationCap,
  HardDrive,
  Lightbulb,
  Network,
  Route,
  Target,
  TreeDeciduous,
  XCircle,
} from "lucide-react";
import { notFound } from "next/navigation";
import { getAlgorithmMetadata } from "@/features/algorithms";
import { getGraphAlgorithmMetadata } from "@/features/algorithms/graph/config";
import { getPathfindingAlgorithmMetadata } from "@/features/algorithms/pathfinding/config";
import { CodeTabs } from "@/features/learning/components";
import { type GraphArticle, getGraphArticle } from "@/features/learning/content/graphs";
import {
  getPathfindingArticle,
  type PathfindingArticle,
} from "@/features/learning/content/pathfinding";
import { getSortingArticle, type SortingArticle } from "@/features/learning/content/sorting";
import { getTreeArticle, type TreeArticle } from "@/features/learning/content/trees";
import type {
  GraphAlgorithmType,
  PathfindingAlgorithmType,
  SortingAlgorithmType,
  TreeDataStructureType,
  VisualizerMode,
} from "@/lib/store";
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
const VALID_TREE_STRUCTURES = ["bst", "avl", "max-heap", "splay"] as const;
const VALID_GRAPH_ALGORITHMS = ["prim", "kruskal", "kahn"] as const;

function isValidMode(mode: string): mode is VisualizerMode {
  return VALID_MODES.includes(mode as VisualizerMode);
}

function isValidSortingAlgorithm(algorithm: string): algorithm is SortingAlgorithmType {
  return VALID_SORTING_ALGORITHMS.includes(algorithm as SortingAlgorithmType);
}

function isValidPathfindingAlgorithm(algorithm: string): algorithm is PathfindingAlgorithmType {
  return VALID_PATHFINDING_ALGORITHMS.includes(algorithm as PathfindingAlgorithmType);
}

function isValidTreeStructure(structure: string): structure is TreeDataStructureType {
  return VALID_TREE_STRUCTURES.includes(structure as TreeDataStructureType);
}

function isValidGraphAlgorithm(algorithm: string): algorithm is GraphAlgorithmType {
  return VALID_GRAPH_ALGORITHMS.includes(algorithm as GraphAlgorithmType);
}

/**
 * Unified article type for polymorphic page rendering.
 */
type ArticleContent =
  | { mode: "sorting"; article: SortingArticle; algorithm: SortingAlgorithmType }
  | { mode: "pathfinding"; article: PathfindingArticle; algorithm: PathfindingAlgorithmType }
  | { mode: "tree"; article: TreeArticle; structure: TreeDataStructureType }
  | { mode: "graph"; article: GraphArticle; algorithm: GraphAlgorithmType };

/**
 * Factory function to get the appropriate article based on mode and algorithm/structure.
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
  if (mode === "tree" && isValidTreeStructure(algorithm)) {
    return {
      mode: "tree",
      article: getTreeArticle(algorithm),
      structure: algorithm,
    };
  }
  if (mode === "graph" && isValidGraphAlgorithm(algorithm)) {
    return {
      mode: "graph",
      article: getGraphArticle(algorithm),
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
  if (mode === "graph" && isValidGraphAlgorithm(algorithm)) {
    return getGraphAlgorithmMetadata(algorithm);
  }
  return null;
}

export default async function LearnPage({ params }: LearnPageProps) {
  const { mode, algorithm } = await params;

  if (!isValidMode(mode)) {
    notFound();
  }

  const content = getArticle(mode, algorithm);
  // Tree mode has complexity info inline in the article, not in separate metadata
  const metadata = getMetadata(mode, algorithm);

  if (!content) {
    notFound();
  }

  // For non-tree modes, metadata is required
  if (content.mode !== "tree" && !metadata) {
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
    tree: {
      label: "Data Structure",
      icon: <TreeDeciduous className="h-5 w-5" />,
    },
    graph: {
      label: "Graph Algorithm",
      icon: <Network className="h-5 w-5" />,
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
          {/* Tree mode shows search complexity + self-balancing */}
          {content.mode === "tree" ? (
            <>
              <ComplexityBadge
                icon={<Clock className="h-4 w-4" />}
                label="Search"
                value={content.article.searchComplexity.complexity}
                variant={getComplexityVariant(content.article.searchComplexity.complexity)}
              />
              <ComplexityBadge
                icon={<HardDrive className="h-4 w-4" />}
                label="Space"
                value={content.article.spaceComplexity.complexity}
                variant={getComplexityVariant(content.article.spaceComplexity.complexity)}
              />
              <ComplexityBadge
                icon={<TreeDeciduous className="h-4 w-4" />}
                label="Self-Balancing"
                value={content.article.selfBalancing ? "Yes" : "No"}
                variant={content.article.selfBalancing ? "excellent" : "fair"}
              />
            </>
          ) : content.mode === "graph" ? (
            <>
              <ComplexityBadge
                icon={<Clock className="h-4 w-4" />}
                label="Time"
                value={content.article.timeComplexity.complexity}
                variant={getComplexityVariant(content.article.timeComplexity.complexity)}
              />
              <ComplexityBadge
                icon={<HardDrive className="h-4 w-4" />}
                label="Space"
                value={content.article.spaceComplexity.complexity}
                variant={getComplexityVariant(content.article.spaceComplexity.complexity)}
              />
              <ComplexityBadge
                icon={<Network className="h-4 w-4" />}
                label="Output"
                value={content.article.output}
                variant="good"
              />
            </>
          ) : (
            <>
              <ComplexityBadge
                icon={<Clock className="h-4 w-4" />}
                label="Time"
                value={metadata?.complexity ?? "N/A"}
                variant={getComplexityVariant(metadata?.complexity ?? "")}
              />
              <ComplexityBadge
                icon={<HardDrive className="h-4 w-4" />}
                label="Space"
                value={metadata?.spaceComplexity ?? "N/A"}
                variant={getComplexityVariant(metadata?.spaceComplexity ?? "")}
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
            </>
          )}
        </div>
      </header>

      {/* History Section */}
      <Section title="History" icon={<Lightbulb className="h-5 w-5" />}>
        <Prose content={article.history} />
      </Section>

      {/* Core Property Section - Trees only */}
      {content.mode === "tree" && (
        <Section title="Core Property" icon={<TreeDeciduous className="h-5 w-5" />}>
          <Prose content={content.article.coreProperty} />
        </Section>
      )}

      {/* How it Works Section */}
      <Section title="How It Works" icon={config.icon}>
        <Prose content={article.mechanics} />

        {/* Complexity Details - mode-specific rendering */}
        {content.mode === "sorting" && (
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
        )}
        {content.mode === "pathfinding" && (
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
              stacked
            />
          </div>
        )}
        {content.mode === "tree" && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <ComplexityCard
              title="Search"
              complexity={content.article.searchComplexity.complexity}
              explanation={content.article.searchComplexity.explanation}
              variant={getComplexityCardVariant(content.article.searchComplexity.complexity)}
            />
            <ComplexityCard
              title="Insert"
              complexity={content.article.insertComplexity.complexity}
              explanation={content.article.insertComplexity.explanation}
              variant={getComplexityCardVariant(content.article.insertComplexity.complexity)}
            />
            <ComplexityCard
              title="Delete"
              complexity={content.article.deleteComplexity.complexity}
              explanation={content.article.deleteComplexity.explanation}
              variant={getComplexityCardVariant(content.article.deleteComplexity.complexity)}
            />
            <ComplexityCard
              title="Space"
              complexity={content.article.spaceComplexity.complexity}
              explanation={content.article.spaceComplexity.explanation}
              variant={content.article.spaceComplexity.complexity === "O(1)" ? "good" : "neutral"}
            />
          </div>
        )}
        {content.mode === "graph" && (
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
              variant="neutral"
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
              stacked
            />
          </div>
        )}
      </Section>

      {/* Code Walkthrough Section */}
      <Section title="Code Walkthrough" icon={<Code2 className="h-5 w-5" />}>
        <p className="text-muted mb-4 text-sm">
          {content.mode === "tree"
            ? "Complete data structure implementations in multiple programming languages. Select a language to view idiomatic code."
            : "Real implementations in multiple programming languages. Select a language to view idiomatic code."}
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
              <span className="text-primary/80">{parseTextWithMath(useCase)}</span>
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
              <span className="text-primary/80 text-sm">{parseTextWithMath(insight)}</span>
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
          <p className="text-primary/80 text-sm leading-relaxed">
            {parseTextWithMath(article.whenToUse)}
          </p>
        </div>

        <div className={cn("rounded-xl border border-rose-500/30 bg-rose-500/10 p-6", "space-y-3")}>
          <div className="flex items-center gap-2 text-rose-500">
            <XCircle className="h-5 w-5" />
            <h3 className="font-semibold">When NOT to Use</h3>
          </div>
          <p className="text-primary/80 text-sm leading-relaxed">
            {parseTextWithMath(article.whenNotToUse)}
          </p>
        </div>
      </div>

      {/* Pitfall Section - Trees only */}
      {content.mode === "tree" && (
        <div
          className={cn("rounded-xl border border-amber-500/30 bg-amber-500/10 p-6", "space-y-3")}
        >
          <div className="flex items-center gap-2 text-amber-500">
            <AlertTriangle className="h-5 w-5" />
            <h3 className="font-semibold">Watch Out</h3>
          </div>
          <p className="text-primary/80 text-sm leading-relaxed">
            {parseTextWithMath(content.article.pitfall)}
          </p>
        </div>
      )}

      {/* Interview Tip Section - Graphs only */}
      {content.mode === "graph" && (
        <div
          className={cn("rounded-xl border border-violet-500/30 bg-violet-500/10 p-6", "space-y-3")}
        >
          <div className="flex items-center gap-2 text-violet-500">
            <GraduationCap className="h-5 w-5" />
            <h3 className="font-semibold">Interview Tip</h3>
          </div>
          <p className="text-primary/80 text-sm leading-relaxed">
            {parseTextWithMath(content.article.interviewTip)}
          </p>
        </div>
      )}

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
          const rest = parts.slice(1).join(":**");
          const headingText = heading.replace(/\*\*/g, "");
          return (
            <div key={key} className="space-y-2">
              <h4 className="text-primary font-semibold">{headingText}</h4>
              <p className="text-primary/80 leading-relaxed">{parseTextWithMath(rest)}</p>
            </div>
          );
        }

        if (paragraph.startsWith("- ") || paragraph.startsWith("1. ")) {
          // It's a list - handle nested lists via indentation
          const lines = paragraph.split("\n").filter(Boolean);
          const isOrdered = paragraph.startsWith("1. ");

          return <NestedList key={key} lines={lines} isOrdered={isOrdered} />;
        }

        // Regular paragraph - process bold text inline without dangerouslySetInnerHTML
        return <ProseParagraph key={key} text={paragraph} />;
      })}
    </div>
  );
}

/**
 * Renders LaTeX math expression to HTML string using KaTeX.
 * Returns the original text if parsing fails.
 */
function renderMath(latex: string, displayMode: boolean): string {
  try {
    return katex.renderToString(latex, {
      displayMode,
      throwOnError: false,
      strict: false,
    });
  } catch {
    return latex;
  }
}

/**
 * Parses text with markdown bold and LaTeX math, returning an array of React elements.
 * Supports:
 * - Inline math: $...$
 * - Display math: $$...$$
 * - Bold text: **...**
 */
function parseTextWithMath(text: string): React.ReactNode[] {
  const elements: React.ReactNode[] = [];
  // Pattern matches: $$...$$, $...$, or **...**
  const pattern = /(\$\$[\s\S]*?\$\$|\$[^$\n]+?\$|\*\*.*?\*\*)/g;
  let lastIndex = 0;
  let keyIndex = 0;

  for (let match = pattern.exec(text); match !== null; match = pattern.exec(text)) {
    // Add text before this match
    if (match.index > lastIndex) {
      const before = text.slice(lastIndex, match.index);
      elements.push(<span key={`text-${keyIndex++}`}>{before}</span>);
    }

    const matched = match[0];

    if (matched.startsWith("$$") && matched.endsWith("$$")) {
      // Display math
      const latex = matched.slice(2, -2).trim();
      const html = renderMath(latex, true);
      elements.push(
        <span
          key={`math-${keyIndex++}`}
          className="block my-4"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: KaTeX sanitizes output
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    } else if (matched.startsWith("$") && matched.endsWith("$")) {
      // Inline math
      const latex = matched.slice(1, -1);
      const html = renderMath(latex, false);
      elements.push(
        <span
          key={`math-${keyIndex++}`}
          // biome-ignore lint/security/noDangerouslySetInnerHtml: KaTeX sanitizes output
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    } else if (matched.startsWith("**") && matched.endsWith("**")) {
      // Bold text
      const boldText = matched.slice(2, -2);
      elements.push(
        <strong key={`bold-${keyIndex++}`} className="text-primary font-semibold">
          {boldText}
        </strong>
      );
    }

    lastIndex = pattern.lastIndex;
  }

  // Add remaining text after last match
  if (lastIndex < text.length) {
    elements.push(<span key={`text-${keyIndex++}`}>{text.slice(lastIndex)}</span>);
  }

  return elements;
}

/**
 * Renders a paragraph with inline bold text and LaTeX math processing.
 */
function ProseParagraph({ text }: { text: string }) {
  return <p className="text-primary/80 leading-relaxed">{parseTextWithMath(text)}</p>;
}

/**
 * Represents a parsed list item with potential children for nested lists.
 */
interface ListNode {
  content: string;
  children: ListNode[];
  isOrdered: boolean;
}

/**
 * Renders nested lists by parsing indentation levels.
 * Handles mixed ordered/unordered sublists.
 */
function NestedList({ lines, isOrdered }: { lines: string[]; isOrdered: boolean }) {
  // Parse lines into a tree structure based on indentation
  const rootNodes: ListNode[] = [];
  const stack: { node: ListNode; indent: number }[] = [];

  for (const line of lines) {
    // Measure leading whitespace
    const leadingSpaces = line.match(/^(\s*)/)?.[1]?.length ?? 0;
    // Determine if this line is an unordered sub-item (starts with - after whitespace)
    const isSubItemUnordered = /^\s+-\s/.test(line);
    // Clean the line content
    const cleanedContent = line.replace(/^\s*(?:-\s*|\d+\.\s*)/, "");

    const newNode: ListNode = {
      content: cleanedContent,
      children: [],
      isOrdered: !isSubItemUnordered && isOrdered,
    };

    if (leadingSpaces === 0) {
      // Top-level item
      rootNodes.push(newNode);
      stack.length = 0;
      stack.push({ node: newNode, indent: 0 });
    } else {
      // Nested item - find parent by indentation
      while (stack.length > 0 && (stack[stack.length - 1]?.indent ?? 0) >= leadingSpaces) {
        stack.pop();
      }

      if (stack.length > 0) {
        const parent = stack[stack.length - 1];
        if (parent) {
          parent.node.children.push(newNode);
        }
      } else {
        // Fallback: treat as top-level if no valid parent
        rootNodes.push(newNode);
      }

      stack.push({ node: newNode, indent: leadingSpaces });
    }
  }

  // Render the tree
  const renderNodes = (nodes: ListNode[], parentOrdered: boolean) => {
    if (nodes.length === 0) return null;

    // Check if we should render as ordered or unordered
    // Use the first node's isOrdered property to determine list type
    const firstNode = nodes[0];
    const useOrdered = firstNode?.isOrdered ?? parentOrdered;
    const ListTag = useOrdered ? "ol" : "ul";

    return (
      <ListTag className={cn("space-y-2", useOrdered ? "list-decimal pl-6" : "list-disc pl-6")}>
        {nodes.map((node, idx) => {
          const itemKey = `li-${idx}-${node.content.slice(0, 20).replace(/\W/g, "")}`;
          return (
            <li key={itemKey} className="text-primary/80 leading-relaxed">
              {parseTextWithMath(node.content)}
              {node.children.length > 0 && renderNodes(node.children, node.isOrdered)}
            </li>
          );
        })}
      </ListTag>
    );
  };

  return renderNodes(rootNodes, isOrdered);
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
  stacked?: boolean;
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

function ComplexityCard({ title, complexity, explanation, variant, stacked }: ComplexityCardProps) {
  return (
    <div className={cn("rounded-xl border p-4 space-y-2", CARD_VARIANTS[variant])}>
      {stacked ? (
        <div className="space-y-2">
          <span className="text-muted text-sm font-medium">{title}</span>
          <span
            className={cn(
              "block w-fit rounded-md px-2 py-1 font-mono text-sm font-semibold",
              CARD_BADGE_VARIANTS[variant]
            )}
          >
            {complexity}
          </span>
        </div>
      ) : (
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
      )}
      <p className="text-primary/70 text-sm leading-relaxed">{explanation}</p>
    </div>
  );
}

function getComplexityVariant(complexity: string): "excellent" | "good" | "fair" {
  // Handle O(log n) or O(log V) - excellent (guaranteed logarithmic)
  if (
    (complexity.includes("log n") || complexity.includes("log V")) &&
    !complexity.includes("n log n") &&
    !complexity.includes("E log")
  ) {
    return "excellent";
  }
  // Handle O(h) - good (depends on tree height, can be log n if balanced)
  if (complexity === "O(h)") {
    return "good";
  }
  // Handle linear complexities - good
  if (
    complexity === "O(1)" ||
    complexity === "O(n)" ||
    complexity === "O(V)" ||
    complexity === "O(V + E)" ||
    complexity.includes("n log n")
  ) {
    return "good";
  }
  // Handle graph log complexities - good (E log V, E log E are efficient)
  if (complexity.includes("E log V") || complexity.includes("E log E")) {
    return "good";
  }
  return "fair";
}

/**
 * Get variant for complexity cards - maps complexity to card styling.
 * Used for tree operation complexity cards.
 */
function getComplexityCardVariant(complexity: string): "good" | "fair" | "neutral" {
  // O(log n) is excellent - show as good
  if (complexity.includes("log n") && !complexity.includes("n log n")) {
    return "good";
  }
  // O(h) depends on balance - neutral (could be good or bad)
  if (complexity === "O(h)") {
    return "neutral";
  }
  // O(n) for search is not great - fair
  if (complexity === "O(n)") {
    return "fair";
  }
  return "neutral";
}

// ─────────────────────────────────────────────────────────────────────────────
// Metadata
// ─────────────────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: LearnPageProps) {
  const { mode, algorithm } = await params;

  const content = getArticle(mode, algorithm);

  if (content) {
    const modeLabels = {
      sorting: "Sorting",
      pathfinding: "Pathfinding",
      tree: "Data Structures",
      graph: "Graph Algorithms",
    } as const;
    const modeLabel = modeLabels[content.mode];
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

  const treeParams = VALID_TREE_STRUCTURES.map((structure) => ({
    mode: "tree",
    algorithm: structure,
  }));

  const graphParams = VALID_GRAPH_ALGORITHMS.map((algorithm) => ({
    mode: "graph",
    algorithm,
  }));

  return [...sortingParams, ...pathfindingParams, ...treeParams, ...graphParams];
}
