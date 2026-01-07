"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CircleX, Clock, Code2, HardDrive, Network, Route, TreeDeciduous } from "lucide-react";
import { memo, useCallback, useEffect, useMemo } from "react";
import { getAlgorithmMetadata, getTreeAlgorithmMetadata } from "@/features/algorithms";
import { getGraphAlgorithmMetadata } from "@/features/algorithms/graph/config";
import { getInterviewProblemMetadata } from "@/features/algorithms/interview";
import { getPathfindingAlgorithmMetadata } from "@/features/algorithms/pathfinding";
import { getPatternProblemMetadata } from "@/features/algorithms/patterns";
import { buttonInteraction } from "@/lib/motion";
import type { TreeDataStructureType } from "@/lib/store";
import { useYieldStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export interface ComplexityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BACKDROP_VARIANTS = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
} as const;

const MODAL_VARIANTS = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 30,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: {
      duration: 0.15,
    },
  },
} as const;

function ComplexityModalComponent({ isOpen, onClose }: ComplexityModalProps) {
  const mode = useYieldStore((state) => state.mode);
  const sortingAlgorithm = useYieldStore((state) => state.sortingAlgorithm);
  const pathfindingAlgorithm = useYieldStore((state) => state.pathfindingAlgorithm);
  const treeAlgorithm = useYieldStore((state) => state.treeAlgorithm);
  const treeDataStructure = useYieldStore((state) => state.treeDataStructure);
  const graphAlgorithm = useYieldStore((state) => state.graphAlgorithm);
  const interviewProblem = useYieldStore((state) => state.interviewProblem);
  const patternProblem = useYieldStore((state) => state.patternProblem);

  const { label, description, complexity, spaceComplexity, hint, extras } = useMemo(() => {
    if (mode === "sorting") {
      const meta = getAlgorithmMetadata(sortingAlgorithm);
      return {
        label: meta.label,
        description: meta.description,
        complexity: meta.complexity,
        spaceComplexity: meta.spaceComplexity,
        hint: getSortingComparisonHint(sortingAlgorithm),
        extras: null,
      };
    }
    if (mode === "tree") {
      const meta = getTreeAlgorithmMetadata(treeAlgorithm, treeDataStructure);
      return {
        label: meta.label,
        description: meta.description,
        complexity: meta.complexity,
        spaceComplexity: meta.spaceComplexity,
        hint: getTreeComparisonHint(treeAlgorithm, treeDataStructure),
        extras: {
          isTraversal: meta.isTraversal,
          visualPattern: meta.visualPattern,
        },
      };
    }
    if (mode === "graph") {
      const meta = getGraphAlgorithmMetadata(graphAlgorithm);
      return {
        label: meta.label,
        description: meta.description,
        complexity: meta.complexity,
        spaceComplexity: meta.spaceComplexity,
        hint: getGraphComparisonHint(graphAlgorithm),
        extras: {
          visualPattern: meta.visualPattern,
          requiresStartNode: meta.requiresStartNode,
        },
      };
    }
    if (mode === "interview") {
      const meta = getInterviewProblemMetadata(interviewProblem);
      return {
        label: meta.label,
        description: meta.description,
        complexity: meta.complexity,
        spaceComplexity: meta.spaceComplexity,
        hint: getInterviewComparisonHint(interviewProblem),
        extras: {
          difficulty: meta.difficulty,
          pattern: meta.pattern,
        },
      };
    }
    if (mode === "patterns") {
      const meta = getPatternProblemMetadata(patternProblem);
      return {
        label: meta.label,
        description: meta.description,
        complexity: meta.complexity,
        spaceComplexity: meta.spaceComplexity,
        hint: getPatternComparisonHint(patternProblem),
        extras: {
          difficulty: meta.difficulty,
          pattern: meta.pattern,
        },
      };
    }
    const meta = getPathfindingAlgorithmMetadata(pathfindingAlgorithm);
    return {
      label: meta.label,
      description: meta.description,
      complexity: meta.complexity,
      spaceComplexity: meta.spaceComplexity,
      hint: getPathfindingComparisonHint(pathfindingAlgorithm),
      extras: {
        guaranteesShortestPath: meta.guaranteesShortestPath,
        visualPattern: meta.visualPattern,
      },
    };
  }, [
    mode,
    sortingAlgorithm,
    pathfindingAlgorithm,
    treeAlgorithm,
    treeDataStructure,
    graphAlgorithm,
    interviewProblem,
    patternProblem,
  ]);

  // Close on escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          variants={BACKDROP_VARIANTS}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={handleBackdropClick}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            variants={MODAL_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              "relative w-full max-w-md overflow-hidden rounded-2xl",
              "border border-white/10 bg-white/10 backdrop-blur-xl",
              "dark:border-white/5 dark:bg-black/40",
              "shadow-2xl shadow-black/20"
            )}
            role="dialog"
            aria-modal="true"
            aria-labelledby="complexity-modal-title"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <h2 id="complexity-modal-title" className="text-primary text-lg font-semibold">
                {label}
              </h2>

              <motion.button
                type="button"
                onClick={onClose}
                whileHover={buttonInteraction.hover}
                whileTap={buttonInteraction.tap}
                className="text-muted hover:text-primary rounded-full p-1 transition-colors"
                aria-label="Close modal"
              >
                <CircleX className="h-5 w-5" />
              </motion.button>
            </div>

            {/* Content */}
            <div className="space-y-6 p-6">
              {/* Description */}
              <p className="text-primary/80 text-sm leading-relaxed">{description}</p>

              {/* Mode-specific extras */}
              {extras && (
                <div className="flex items-center gap-3">
                  {"guaranteesShortestPath" in extras ? (
                    <>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                          extras.guaranteesShortestPath
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-amber-500/20 text-amber-400"
                        )}
                      >
                        <Route className="h-3 w-3" />
                        {extras.guaranteesShortestPath ? "Shortest Path" : "No Guarantee"}
                      </span>
                      <span className="text-muted text-xs">{extras.visualPattern}</span>
                    </>
                  ) : "requiresStartNode" in extras ? (
                    <>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                          extras.requiresStartNode
                            ? "bg-rose-500/20 text-rose-400"
                            : "bg-violet-500/20 text-violet-400"
                        )}
                      >
                        <Network className="h-3 w-3" />
                        {extras.requiresStartNode ? "Needs Start Node" : "Global Algorithm"}
                      </span>
                      <span className="text-muted text-xs">{extras.visualPattern}</span>
                    </>
                  ) : "difficulty" in extras ? (
                    <>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                          extras.difficulty === "Hard"
                            ? "bg-rose-500/20 text-rose-400"
                            : extras.difficulty === "Medium"
                              ? "bg-amber-500/20 text-amber-400"
                              : "bg-emerald-500/20 text-emerald-400"
                        )}
                      >
                        <Code2 className="h-3 w-3" />
                        {extras.difficulty}
                      </span>
                      <span className="text-muted text-xs">{extras.pattern}</span>
                    </>
                  ) : (
                    <>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                          extras.isTraversal
                            ? "bg-cyan-500/20 text-cyan-400"
                            : "bg-emerald-500/20 text-emerald-400"
                        )}
                      >
                        <TreeDeciduous className="h-3 w-3" />
                        {extras.isTraversal ? "Traversal" : "Operation"}
                      </span>
                      <span className="text-muted text-xs">{extras.visualPattern}</span>
                    </>
                  )}
                </div>
              )}

              {/* Complexity Cards */}
              <div className="grid grid-cols-2 gap-4">
                <ComplexityCard
                  icon={<Clock className="h-4 w-4" />}
                  label="Time Complexity"
                  value={complexity}
                  description={getTimeDescription(complexity, mode)}
                  variant={getComplexityVariant(complexity)}
                />
                <ComplexityCard
                  icon={<HardDrive className="h-4 w-4" />}
                  label="Space Complexity"
                  value={spaceComplexity}
                  description={getSpaceDescription(spaceComplexity, mode)}
                  variant={getComplexityVariant(spaceComplexity)}
                />
              </div>

              {/* Comparison hint */}
              <div className="rounded-lg border border-white/5 bg-white/5 p-3">
                <p className="text-muted text-xs leading-relaxed">{hint}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface ComplexityCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
  variant: "excellent" | "good" | "fair";
}

const VARIANT_STYLES = {
  excellent: {
    badge: "text-emerald-400 bg-emerald-500/20 border-emerald-500/30",
    glow: "shadow-emerald-500/10",
  },
  good: {
    badge: "text-sky-400 bg-sky-500/20 border-sky-500/30",
    glow: "shadow-sky-500/10",
  },
  fair: {
    badge: "text-amber-400 bg-amber-500/20 border-amber-500/30",
    glow: "shadow-amber-500/10",
  },
} as const;

function ComplexityCard({ icon, label, value, description, variant }: ComplexityCardProps) {
  const styles = VARIANT_STYLES[variant];

  return (
    <div
      className={cn("rounded-xl border border-white/10 bg-white/5 p-4", "shadow-lg", styles.glow)}
    >
      <div className="text-muted mb-2 flex items-center gap-1.5 text-xs uppercase tracking-wider">
        {icon}
        {label}
      </div>
      <div
        className={cn(
          "mb-2 inline-flex items-center rounded-md border px-2.5 py-1 font-mono text-sm font-semibold",
          styles.badge
        )}
      >
        {value}
      </div>
      <p className="text-muted text-xs leading-relaxed">{description}</p>
    </div>
  );
}

function getComplexityVariant(complexity: string): ComplexityCardProps["variant"] {
  if (complexity.includes("log n") && !complexity.includes("n log n")) {
    return "excellent";
  }
  if (complexity === "O(1)" || complexity === "O(n)" || complexity.includes("n log n")) {
    return "good";
  }
  return "fair";
}

function getTimeDescription(
  complexity: string,
  mode: "sorting" | "pathfinding" | "tree" | "graph" | "interview" | "patterns"
): string {
  if (mode === "pathfinding") {
    if (complexity.includes("V + E")) {
      return "Visits each vertex and edge once. Scales linearly with graph size.";
    }
    if (complexity.includes("log V")) {
      return "Priority queue operations add logarithmic factor per vertex.";
    }
    return "Execution time depends on graph structure.";
  }
  if (mode === "tree") {
    if (complexity.includes("log n")) {
      return "Balanced tree operations are logarithmic in height. Degrades to O(n) if skewed.";
    }
    if (complexity === "O(n)") {
      return "Traversals visit each node exactly once.";
    }
    return "Execution time depends on tree structure.";
  }
  if (mode === "graph") {
    if (complexity.includes("E log V")) {
      return "Edge sorting or priority queue operations dominate. Efficient for sparse graphs.";
    }
    if (complexity.includes("V + E")) {
      return "Linear in vertices and edges. Visits each element once.";
    }
    return "Execution time depends on graph density.";
  }
  if (mode === "patterns" || mode === "interview") {
    if (complexity === "O(n)") {
      return "Linear time—each element is processed at most a constant number of times.";
    }
    if (complexity === "O(n²)") {
      return "Quadratic time—nested iteration over all pairs. The naive approach to optimize.";
    }
    return "Execution time depends on input size and pattern complexity.";
  }
  if (complexity === "O(n²)") {
    return "Performance degrades quickly as input size grows. Suitable for small datasets.";
  }
  if (complexity.includes("n log n")) {
    return "Efficient for large datasets. Scales well with input size.";
  }
  return "Execution time varies with input.";
}

function getSpaceDescription(
  complexity: string,
  mode: "sorting" | "pathfinding" | "tree" | "graph" | "interview" | "patterns"
): string {
  if (mode === "pathfinding") {
    if (complexity === "O(V)") {
      return "Stores visited nodes and parent pointers proportional to vertices.";
    }
    return "Memory usage depends on graph structure.";
  }
  if (mode === "tree") {
    if (complexity.includes("log n") || complexity.includes("h")) {
      return "Stack space proportional to tree height for recursive operations.";
    }
    if (complexity === "O(n)") {
      return "Queue or result storage proportional to number of nodes.";
    }
    return "Memory usage depends on tree structure.";
  }
  if (mode === "graph") {
    if (complexity === "O(V)") {
      return "Stores visited set and result edges proportional to vertices.";
    }
    if (complexity.includes("E") || complexity.includes("V")) {
      return "Memory usage scales with graph size (vertices + edges).";
    }
    return "Memory usage depends on graph density.";
  }
  if (mode === "patterns" || mode === "interview") {
    if (complexity === "O(1)") {
      return "Constant space—only a few pointers or variables needed.";
    }
    if (complexity.includes("min(m, n)") || complexity.includes("min(n")) {
      return "Hash map stores at most the size of the character set or input length.";
    }
    if (complexity === "O(n)") {
      return "Auxiliary storage proportional to input size (stack, hash map, or result).";
    }
    return "Memory usage depends on algorithm approach.";
  }
  if (complexity === "O(1)") {
    return "Constant memory. Sorts in-place without extra allocation.";
  }
  if (complexity === "O(log n)") {
    return "Logarithmic stack space due to recursion depth.";
  }
  if (complexity === "O(n)") {
    return "Requires auxiliary array proportional to input size.";
  }
  return "Memory usage varies with input.";
}

function getSortingComparisonHint(algorithm: string): string {
  switch (algorithm) {
    case "bubble":
      return "Bubble Sort is simple to understand but inefficient. Consider Quick Sort or Merge Sort for larger datasets.";
    case "selection":
      return "Selection Sort minimizes swaps but still has O(n²) comparisons. Better than Bubble Sort for write-heavy storage.";
    case "insertion":
      return "Insertion Sort is efficient for small or nearly sorted arrays. Used as base case in hybrid sorts.";
    case "gnome":
      return "Gnome Sort is conceptually simple but inefficient. Similar to Insertion Sort without nested loops.";
    case "quick":
      return "Quick Sort is often the fastest in practice due to cache efficiency, despite O(n²) worst-case.";
    case "merge":
      return "Merge Sort guarantees O(n log n) but requires extra memory. Preferred when stability matters.";
    case "heap":
      return "Heap Sort has consistent O(n log n) performance and sorts in-place. Good for memory-constrained systems.";
    default:
      return "Compare different algorithms to understand their trade-offs.";
  }
}

function getPathfindingComparisonHint(algorithm: string): string {
  switch (algorithm) {
    case "bfs":
      return "BFS guarantees shortest path in unweighted graphs. Uses more memory than DFS due to queue storage.";
    case "dfs":
      return "DFS uses less memory but doesn't guarantee shortest path. Good for maze exploration and cycle detection.";
    case "dijkstra":
      return "Dijkstra handles weighted edges and guarantees optimal paths. A* is faster for point-to-point with good heuristics.";
    case "astar":
      return "A* uses heuristics to guide search toward the goal. Optimal when heuristic is admissible (never overestimates).";
    default:
      return "Compare different algorithms to understand their trade-offs.";
  }
}

function getTreeComparisonHint(algorithm: string, dataStructure: TreeDataStructureType): string {
  // Data-structure-specific hints for operations
  if (dataStructure === "max-heap") {
    switch (algorithm) {
      case "insert":
        return "Heap insert maintains the complete binary tree property. Bubble-up is O(log n) worst-case but O(1) average for random insertions.";
      case "delete":
        return "Extract-max always removes the root. Sink-down restores heap property. Used in priority queues and heap sort.";
      case "heapify":
        return "Floyd's algorithm builds a heap in O(n) time, faster than n insertions. Key insight: most nodes are near leaves.";
      case "bfs":
        return "Level-order on a heap shows values in array order. Each level has smaller values than the one above.";
      default:
        return "Max heaps are ideal for priority queues where you need fast access to the maximum element.";
    }
  }

  if (dataStructure === "avl") {
    switch (algorithm) {
      case "insert":
        return "AVL insert guarantees O(log n) worst-case. At most one rotation needed. Compare to BST's O(n) worst-case.";
      case "search":
        return "AVL search is identical to BST but guaranteed O(log n) due to balance property. No degenerate cases.";
      case "delete":
        return "AVL delete may require multiple rotations up the tree, unlike insert which needs at most one.";
      default:
        return "AVL trees maintain strict balance (height difference ≤ 1) for guaranteed O(log n) operations.";
    }
  }

  if (dataStructure === "splay") {
    switch (algorithm) {
      case "insert":
        return "Splay trees move accessed nodes to root. No balance tracking needed. Great for caching and locality patterns.";
      case "search":
        return "Repeated searches for the same key are O(1). Splaying exploits temporal locality in access patterns.";
      case "delete":
        return "Delete splays target to root first, then removes. Recently accessed nodes stay near root.";
      default:
        return "Splay trees are self-adjusting with O(log n) amortized cost. No explicit balance information stored.";
    }
  }

  // Default BST hints
  switch (algorithm) {
    case "insert":
      return "BST insert is O(log n) average but degrades to O(n) if insertions are sorted. Self-balancing trees (AVL, Red-Black) prevent this.";
    case "search":
      return "BST search follows a single path from root to target. Faster than linear search but requires sorted structure.";
    case "delete":
      return "BST delete has three cases: leaf (simple), one child (bypass), two children (find successor). The most complex BST operation.";
    case "inorder":
      return "In-order traversal visits nodes in sorted order for BST. Perfect for retrieving all values in ascending sequence.";
    case "preorder":
      return "Pre-order visits root before children. Useful for copying tree structure or creating prefix expressions.";
    case "postorder":
      return "Post-order visits root after children. Essential for safe tree deletion (children freed before parent).";
    case "bfs":
      return "Level-order uses a queue to visit breadth-first. Great for finding nodes closest to root or printing by level.";
    case "invert":
      return "The famous interview question. Swaps left/right children recursively. If you can't do this, apparently you can't work at Google.";
    default:
      return "Compare different tree operations to understand their use cases.";
  }
}

function getGraphComparisonHint(algorithm: string): string {
  switch (algorithm) {
    case "prim":
      return "Prim's grows MST from a single source. Better for dense graphs due to priority queue efficiency. Compare to Kruskal's for sparse graphs.";
    case "kruskal":
      return "Kruskal's processes edges globally by weight. Union-Find enables near-constant time cycle detection. Better for sparse graphs.";
    case "kahn":
      return "Kahn's algorithm detects cycles and produces topological order. Essential for dependency resolution and build systems.";
    default:
      return "Compare different graph algorithms to understand their trade-offs.";
  }
}

function getInterviewComparisonHint(problem: string): string {
  switch (problem) {
    case "trapping-rain-water":
      return "Classic 'Hard' problem. The Two Pointers approach achieves O(n) time and O(1) space—optimal for this problem. Compare to the naive O(n²) or stack-based O(n) space solutions.";
    default:
      return "Interview problems test problem-solving skills and algorithm design.";
  }
}

function getPatternComparisonHint(problem: string): string {
  switch (problem) {
    case "longest-substring-norepeat":
      return "Classic Sliding Window problem. The key insight: left pointer never moves backward—each character is visited at most twice, giving O(n) time. Compare to the naive O(n²) approach that recomputes each substring.";
    default:
      return "Pattern problems teach reusable techniques that unlock entire families of similar problems.";
  }
}

export const ComplexityModal = memo(ComplexityModalComponent);
