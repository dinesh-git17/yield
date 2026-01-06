import { ImageResponse } from "next/og";
import { getAlgorithmMetadata } from "@/features/algorithms";
import { getGraphAlgorithmMetadata } from "@/features/algorithms/graph/config";
import { getPathfindingAlgorithmMetadata } from "@/features/algorithms/pathfinding/config";
import { getGraphArticle } from "@/features/learning/content/graphs";
import { getPathfindingArticle } from "@/features/learning/content/pathfinding";
import { getSortingArticle } from "@/features/learning/content/sorting";
import { getTreeArticle } from "@/features/learning/content/trees";
import type {
  GraphAlgorithmType,
  PathfindingAlgorithmType,
  SortingAlgorithmType,
  TreeDataStructureType,
  VisualizerMode,
} from "@/lib/store";

export const runtime = "edge";
export const alt = "Algorithm Visualization";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

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

interface AlgorithmInfo {
  title: string;
  tagline: string;
  complexity: string;
  modeLabel: string;
}

function getAlgorithmInfo(mode: string, algorithm: string): AlgorithmInfo | null {
  if (mode === "sorting" && isValidSortingAlgorithm(algorithm)) {
    const article = getSortingArticle(algorithm);
    const metadata = getAlgorithmMetadata(algorithm);
    return {
      title: article.title,
      tagline: article.tagline,
      complexity: metadata?.complexity ?? "O(n)",
      modeLabel: "Sorting Algorithm",
    };
  }
  if (mode === "pathfinding" && isValidPathfindingAlgorithm(algorithm)) {
    const article = getPathfindingArticle(algorithm);
    const metadata = getPathfindingAlgorithmMetadata(algorithm);
    return {
      title: article.title,
      tagline: article.tagline,
      complexity: metadata?.complexity ?? "O(V+E)",
      modeLabel: "Pathfinding Algorithm",
    };
  }
  if (mode === "tree" && isValidTreeStructure(algorithm)) {
    const article = getTreeArticle(algorithm);
    return {
      title: article.title,
      tagline: article.tagline,
      complexity: article.searchComplexity.complexity,
      modeLabel: "Data Structure",
    };
  }
  if (mode === "graph" && isValidGraphAlgorithm(algorithm)) {
    const article = getGraphArticle(algorithm);
    const metadata = getGraphAlgorithmMetadata(algorithm);
    return {
      title: article.title,
      tagline: article.tagline,
      complexity: metadata?.complexity ?? "O(E log V)",
      modeLabel: "Graph Algorithm",
    };
  }
  return null;
}

interface Props {
  params: Promise<{
    mode: string;
    algorithm: string;
  }>;
}

export default async function OpenGraphImage({ params }: Props) {
  const { mode, algorithm } = await params;

  if (!isValidMode(mode)) {
    return new Response("Not Found", { status: 404 });
  }

  const info = getAlgorithmInfo(mode, algorithm);

  if (!info) {
    return new Response("Not Found", { status: 404 });
  }

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0a0a0b",
        backgroundImage:
          "radial-gradient(circle at 25% 25%, rgba(94, 106, 210, 0.15) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(94, 106, 210, 0.1) 0%, transparent 50%)",
        fontFamily: "system-ui, sans-serif",
        padding: "60px",
      }}
    >
      {/* Mode Label */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
          fontWeight: 500,
          color: "#5e6ad2",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: "24px",
        }}
      >
        {info.modeLabel}
      </div>

      {/* Title */}
      <div
        style={{
          display: "flex",
          fontSize: 72,
          fontWeight: 700,
          color: "#ffffff",
          textAlign: "center",
          lineHeight: 1.2,
          marginBottom: "16px",
        }}
      >
        {info.title}
      </div>

      {/* Tagline */}
      <div
        style={{
          display: "flex",
          fontSize: 28,
          fontWeight: 400,
          color: "#a1a1aa",
          fontStyle: "italic",
          textAlign: "center",
          marginBottom: "40px",
        }}
      >
        "{info.tagline}"
      </div>

      {/* Complexity Badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          backgroundColor: "rgba(94, 106, 210, 0.2)",
          border: "2px solid rgba(94, 106, 210, 0.4)",
          borderRadius: "9999px",
          padding: "12px 32px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 20,
            fontWeight: 500,
            color: "#5e6ad2",
          }}
        >
          Complexity:
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 28,
            fontWeight: 700,
            color: "#5e6ad2",
            fontFamily: "monospace",
          }}
        >
          {info.complexity}
        </div>
      </div>

      {/* Yield Branding */}
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          right: "60px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            fontWeight: 600,
            color: "#71717a",
          }}
        >
          yield
        </div>
      </div>

      {/* Decorative bars (sorting visualization hint) */}
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          left: "60px",
          display: "flex",
          alignItems: "flex-end",
          gap: "8px",
        }}
      >
        {[20, 40, 60, 80, 100].map((height, i) => (
          <div
            key={`bar-${height}`}
            style={{
              width: "12px",
              height: `${height * 0.6}px`,
              backgroundColor: "#5e6ad2",
              borderRadius: "4px 4px 0 0",
              opacity: 0.6 + i * 0.08,
            }}
          />
        ))}
      </div>
    </div>,
    {
      ...size,
    }
  );
}
