"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { motion } from "framer-motion";
import {
  BadgeHelp,
  BadgeInfo,
  BookOpen,
  ChevronsLeft,
  FileText,
  GraduationCap,
  HeartHandshake,
  HelpCircle,
  Info,
  Mail,
  MoreHorizontal,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useSponsorship } from "@/features/sponsorship";
import { buttonInteraction, SPRING_PRESETS } from "@/lib/motion";
import {
  type GraphAlgorithmType,
  type InterviewProblemType,
  type PathfindingAlgorithmType,
  type PatternProblemType,
  type SortingAlgorithmType,
  type TreeDataStructureType,
  useYieldStore,
  type VisualizerMode,
} from "@/lib/store";
import { cn } from "@/lib/utils";
import { ComplexityModal } from "./ComplexityModal";
import { Logo } from "./Logo";

export interface SidebarProps {
  className?: string;
  onCollapse?: () => void;
  /** Hide the header (logo + collapse button). Used in mobile drawer which has its own header. */
  hideHeader?: boolean;
}

const SORTING_ALGORITHMS: { id: SortingAlgorithmType; label: string; enabled: boolean }[] = [
  { id: "bubble", label: "Bubble Sort", enabled: true },
  { id: "selection", label: "Selection Sort", enabled: true },
  { id: "insertion", label: "Insertion Sort", enabled: true },
  { id: "gnome", label: "Gnome Sort", enabled: true },
  { id: "quick", label: "Quick Sort", enabled: true },
  { id: "merge", label: "Merge Sort", enabled: true },
  { id: "heap", label: "Heap Sort", enabled: true },
];

const PATHFINDING_ALGORITHMS: {
  id: PathfindingAlgorithmType;
  label: string;
  enabled: boolean;
}[] = [
  { id: "bfs", label: "Breadth-First Search", enabled: true },
  { id: "dfs", label: "Depth-First Search", enabled: true },
  { id: "dijkstra", label: "Dijkstra's Algorithm", enabled: true },
  { id: "astar", label: "A* Search", enabled: true },
  { id: "greedy", label: "Greedy Best-First", enabled: true },
  { id: "bidirectional", label: "Bidirectional A*", enabled: true },
  { id: "flood", label: "Flood Fill", enabled: true },
  { id: "random", label: "Random Walk", enabled: true },
];

const TREE_DATA_STRUCTURES: {
  id: TreeDataStructureType;
  label: string;
  enabled: boolean;
}[] = [
  { id: "bst", label: "Binary Search Tree", enabled: true },
  { id: "avl", label: "AVL Tree", enabled: true },
  { id: "splay", label: "Splay Tree", enabled: true },
  { id: "max-heap", label: "Max Heap", enabled: true },
];

const GRAPH_ALGORITHMS: {
  id: GraphAlgorithmType;
  label: string;
  enabled: boolean;
}[] = [
  { id: "prim", label: "Prim's MST", enabled: true },
  { id: "kruskal", label: "Kruskal's MST", enabled: true },
  { id: "kahn", label: "Topological Sort", enabled: true },
];

const INTERVIEW_PROBLEMS: {
  id: InterviewProblemType;
  label: string;
  enabled: boolean;
}[] = [{ id: "trapping-rain-water", label: "Trapping Rain Water", enabled: true }];

const PATTERN_PROBLEMS: {
  id: PatternProblemType;
  label: string;
  enabled: boolean;
}[] = [{ id: "longest-substring-norepeat", label: "Longest Substring (No Repeat)", enabled: true }];

export function Sidebar({ className, onCollapse, hideHeader }: SidebarProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isComplexityOpen, setIsComplexityOpen] = useState(false);

  const { openModal: openSupportModal } = useSponsorship();

  const mode = useYieldStore((state) => state.mode);
  const setMode = useYieldStore((state) => state.setMode);
  const sortingAlgorithm = useYieldStore((state) => state.sortingAlgorithm);
  const setSortingAlgorithm = useYieldStore((state) => state.setSortingAlgorithm);
  const pathfindingAlgorithm = useYieldStore((state) => state.pathfindingAlgorithm);
  const setPathfindingAlgorithm = useYieldStore((state) => state.setPathfindingAlgorithm);
  const treeDataStructure = useYieldStore((state) => state.treeDataStructure);
  const setTreeDataStructure = useYieldStore((state) => state.setTreeDataStructure);
  const graphAlgorithm = useYieldStore((state) => state.graphAlgorithm);
  const setGraphAlgorithm = useYieldStore((state) => state.setGraphAlgorithm);
  const interviewProblem = useYieldStore((state) => state.interviewProblem);
  const setInterviewProblem = useYieldStore((state) => state.setInterviewProblem);
  const patternProblem = useYieldStore((state) => state.patternProblem);
  const setPatternProblem = useYieldStore((state) => state.setPatternProblem);

  const handleModeSelect = useCallback(
    (newMode: VisualizerMode) => {
      setMode(newMode);
    },
    [setMode]
  );

  const handleSortingAlgorithmSelect = useCallback(
    (algo: SortingAlgorithmType) => {
      setSortingAlgorithm(algo);
    },
    [setSortingAlgorithm]
  );

  const handlePathfindingAlgorithmSelect = useCallback(
    (algo: PathfindingAlgorithmType) => {
      setPathfindingAlgorithm(algo);
    },
    [setPathfindingAlgorithm]
  );

  const handleTreeDataStructureSelect = useCallback(
    (structure: TreeDataStructureType) => {
      setTreeDataStructure(structure);
    },
    [setTreeDataStructure]
  );

  const handleGraphAlgorithmSelect = useCallback(
    (algo: GraphAlgorithmType) => {
      setGraphAlgorithm(algo);
    },
    [setGraphAlgorithm]
  );

  const handleInterviewProblemSelect = useCallback(
    (problem: InterviewProblemType) => {
      setInterviewProblem(problem);
    },
    [setInterviewProblem]
  );

  const handlePatternProblemSelect = useCallback(
    (problem: PatternProblemType) => {
      setPatternProblem(problem);
    },
    [setPatternProblem]
  );

  const openComplexityModal = useCallback(() => {
    setIsComplexityOpen(true);
  }, []);

  const closeComplexityModal = useCallback(() => {
    setIsComplexityOpen(false);
  }, []);

  const handleSupportClick = useCallback(() => {
    openSupportModal("sidebar");
  }, [openSupportModal]);

  return (
    <div className={cn("flex h-full flex-col", className)}>
      {/* Header - Hidden when used in mobile drawer */}
      {!hideHeader && (
        <div className="border-border-subtle flex h-14 items-center justify-between border-b px-4">
          <Logo />
          {onCollapse && (
            <motion.button
              type="button"
              onClick={onCollapse}
              whileHover={buttonInteraction.hover}
              whileTap={buttonInteraction.tap}
              className="text-muted hover:text-primary hover:bg-border/50 rounded-md p-1.5 transition-colors"
              aria-label="Collapse sidebar"
            >
              <motion.span
                className="block"
                initial={{ rotate: 0 }}
                transition={SPRING_PRESETS.snappy}
              >
                <ChevronsLeft className="h-4 w-4" />
              </motion.span>
            </motion.button>
          )}
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3" onMouseLeave={() => setHoveredItem(null)}>
        <div className="mb-2">
          <span className="text-muted px-2 text-xs font-medium uppercase tracking-wider">
            Algorithms
          </span>
        </div>

        {/* Algorithm Categories */}
        <div data-tour-id="tour-modes">
          <SidebarGroup hoveredItem={hoveredItem} onHover={setHoveredItem}>
            <SidebarItem
              id="cat-sorting"
              label="Sorting"
              isActive={mode === "sorting"}
              hoveredItem={hoveredItem}
              onHover={setHoveredItem}
              onClick={() => handleModeSelect("sorting")}
              infoLink="/learn/sorting"
            />
            <SidebarItem
              id="cat-pathfinding"
              label="Pathfinding"
              isActive={mode === "pathfinding"}
              hoveredItem={hoveredItem}
              onHover={setHoveredItem}
              onClick={() => handleModeSelect("pathfinding")}
              infoLink="/learn/pathfinding"
            />
            <SidebarItem
              id="cat-trees"
              label="Trees"
              isActive={mode === "tree"}
              hoveredItem={hoveredItem}
              onHover={setHoveredItem}
              onClick={() => handleModeSelect("tree")}
              infoLink="/learn/tree"
            />
            <SidebarItem
              id="cat-graphs"
              label="Graphs"
              isActive={mode === "graph"}
              hoveredItem={hoveredItem}
              onHover={setHoveredItem}
              onClick={() => handleModeSelect("graph")}
              infoLink="/learn/graph"
            />
            <SidebarItem
              id="cat-interview"
              label="Interview"
              isActive={mode === "interview"}
              hoveredItem={hoveredItem}
              onHover={setHoveredItem}
              onClick={() => handleModeSelect("interview")}
              infoLink="/learn/interview"
            />
            <SidebarItem
              id="cat-patterns"
              label="Patterns"
              isActive={mode === "patterns"}
              hoveredItem={hoveredItem}
              onHover={setHoveredItem}
              onClick={() => handleModeSelect("patterns")}
              infoLink="/learn/patterns"
            />
          </SidebarGroup>
        </div>

        <div className="border-border-subtle my-4 border-t" />

        {/* Sorting Algorithms List */}
        {mode === "sorting" && (
          <>
            <div className="mb-2">
              <span className="text-muted px-2 text-xs font-medium uppercase tracking-wider">
                Sorting
              </span>
            </div>

            <div data-tour-id="tour-algo-list">
              <SidebarGroup hoveredItem={hoveredItem} onHover={setHoveredItem}>
                {SORTING_ALGORITHMS.map((algo) => (
                  <SidebarItem
                    key={algo.id}
                    id={`algo-${algo.id}`}
                    label={algo.label}
                    isActive={sortingAlgorithm === algo.id}
                    disabled={!algo.enabled}
                    hoveredItem={hoveredItem}
                    onHover={setHoveredItem}
                    onClick={() => algo.enabled && handleSortingAlgorithmSelect(algo.id)}
                  />
                ))}
              </SidebarGroup>
            </div>

            <div className="border-border-subtle my-4 border-t" />

            {/* CTA Group: Theory, Complexity, Learn */}
            <div className="space-y-2">
              {/* Theory */}
              <motion.div
                data-tour-id="tour-theory"
                whileHover={buttonInteraction.hover}
                whileTap={buttonInteraction.tap}
              >
                <Link
                  href="/learn"
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-3 py-2.5",
                    "border border-amber-500/20 bg-amber-500/10 backdrop-blur-sm",
                    "text-primary hover:bg-amber-500/20 transition-colors",
                    "dark:border-amber-500/10 dark:bg-amber-500/5"
                  )}
                >
                  <GraduationCap className="h-4 w-4 text-amber-400" />
                  <span className="text-sm font-medium">Theory</span>
                </Link>
              </motion.div>

              {/* Complexity */}
              <motion.button
                type="button"
                data-tour-id="tour-complexity"
                onClick={openComplexityModal}
                whileHover={buttonInteraction.hover}
                whileTap={buttonInteraction.tap}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg px-3 py-2.5",
                  "border border-white/10 bg-white/5 backdrop-blur-sm",
                  "text-primary hover:bg-white/10 transition-colors",
                  "dark:border-white/5 dark:bg-black/20"
                )}
              >
                <BadgeHelp className="h-4 w-4 text-violet-400" />
                <span className="text-sm font-medium">Complexity</span>
              </motion.button>

              {/* Learn */}
              <motion.div
                data-tour-id="tour-learn"
                whileHover={buttonInteraction.hover}
                whileTap={buttonInteraction.tap}
              >
                <Link
                  href={`/learn/sorting/${sortingAlgorithm}`}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-3 py-2.5",
                    "border border-sky-500/20 bg-sky-500/10 backdrop-blur-sm",
                    "text-primary hover:bg-sky-500/20 transition-colors",
                    "dark:border-sky-500/10 dark:bg-sky-500/5"
                  )}
                >
                  <BookOpen className="h-4 w-4 text-sky-400" />
                  <span className="text-sm font-medium">Learn</span>
                </Link>
              </motion.div>
            </div>
          </>
        )}

        {/* Pathfinding Algorithms List */}
        {mode === "pathfinding" && (
          <>
            <div className="mb-2">
              <span className="text-muted px-2 text-xs font-medium uppercase tracking-wider">
                Pathfinding
              </span>
            </div>

            <SidebarGroup hoveredItem={hoveredItem} onHover={setHoveredItem}>
              {PATHFINDING_ALGORITHMS.map((algo) => (
                <SidebarItem
                  key={algo.id}
                  id={`algo-${algo.id}`}
                  label={algo.label}
                  isActive={pathfindingAlgorithm === algo.id}
                  disabled={!algo.enabled}
                  hoveredItem={hoveredItem}
                  onHover={setHoveredItem}
                  onClick={() => algo.enabled && handlePathfindingAlgorithmSelect(algo.id)}
                />
              ))}
            </SidebarGroup>

            <div className="border-border-subtle my-4 border-t" />

            {/* CTA Group: Theory, Complexity, Learn */}
            <div className="space-y-2">
              {/* Theory */}
              <motion.div whileHover={buttonInteraction.hover} whileTap={buttonInteraction.tap}>
                <Link
                  href="/learn"
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-3 py-2.5",
                    "border border-amber-500/20 bg-amber-500/10 backdrop-blur-sm",
                    "text-primary hover:bg-amber-500/20 transition-colors",
                    "dark:border-amber-500/10 dark:bg-amber-500/5"
                  )}
                >
                  <GraduationCap className="h-4 w-4 text-amber-400" />
                  <span className="text-sm font-medium">Theory</span>
                </Link>
              </motion.div>

              {/* Complexity */}
              <motion.button
                type="button"
                onClick={openComplexityModal}
                whileHover={buttonInteraction.hover}
                whileTap={buttonInteraction.tap}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg px-3 py-2.5",
                  "border border-white/10 bg-white/5 backdrop-blur-sm",
                  "text-primary hover:bg-white/10 transition-colors",
                  "dark:border-white/5 dark:bg-black/20"
                )}
              >
                <BadgeHelp className="h-4 w-4 text-cyan-400" />
                <span className="text-sm font-medium">Complexity</span>
              </motion.button>

              {/* Learn */}
              <motion.div whileHover={buttonInteraction.hover} whileTap={buttonInteraction.tap}>
                <Link
                  href={`/learn/pathfinding/${pathfindingAlgorithm}`}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-3 py-2.5",
                    "border border-sky-500/20 bg-sky-500/10 backdrop-blur-sm",
                    "text-primary hover:bg-sky-500/20 transition-colors",
                    "dark:border-sky-500/10 dark:bg-sky-500/5"
                  )}
                >
                  <BookOpen className="h-4 w-4 text-sky-400" />
                  <span className="text-sm font-medium">Learn</span>
                </Link>
              </motion.div>
            </div>
          </>
        )}

        {/* Tree Data Structures List */}
        {mode === "tree" && (
          <>
            <div className="mb-2">
              <span className="text-muted px-2 text-xs font-medium uppercase tracking-wider">
                Data Structures
              </span>
            </div>

            <SidebarGroup hoveredItem={hoveredItem} onHover={setHoveredItem}>
              {TREE_DATA_STRUCTURES.map((ds) => (
                <SidebarItem
                  key={ds.id}
                  id={`tree-${ds.id}`}
                  label={ds.label}
                  isActive={treeDataStructure === ds.id}
                  disabled={!ds.enabled}
                  hoveredItem={hoveredItem}
                  onHover={setHoveredItem}
                  onClick={() => ds.enabled && handleTreeDataStructureSelect(ds.id)}
                />
              ))}
            </SidebarGroup>

            <div className="border-border-subtle my-4 border-t" />

            {/* CTA Group: Theory, Complexity, Learn */}
            <div className="space-y-2">
              {/* Theory */}
              <motion.div whileHover={buttonInteraction.hover} whileTap={buttonInteraction.tap}>
                <Link
                  href="/learn"
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-3 py-2.5",
                    "border border-amber-500/20 bg-amber-500/10 backdrop-blur-sm",
                    "text-primary hover:bg-amber-500/20 transition-colors",
                    "dark:border-amber-500/10 dark:bg-amber-500/5"
                  )}
                >
                  <GraduationCap className="h-4 w-4 text-amber-400" />
                  <span className="text-sm font-medium">Theory</span>
                </Link>
              </motion.div>

              {/* Complexity */}
              <motion.button
                type="button"
                onClick={openComplexityModal}
                whileHover={buttonInteraction.hover}
                whileTap={buttonInteraction.tap}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg px-3 py-2.5",
                  "border border-white/10 bg-white/5 backdrop-blur-sm",
                  "text-primary hover:bg-white/10 transition-colors",
                  "dark:border-white/5 dark:bg-black/20"
                )}
              >
                <BadgeHelp className="h-4 w-4 text-emerald-400" />
                <span className="text-sm font-medium">Complexity</span>
              </motion.button>

              {/* Learn */}
              <motion.div whileHover={buttonInteraction.hover} whileTap={buttonInteraction.tap}>
                <Link
                  href={`/learn/tree/${treeDataStructure}`}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-3 py-2.5",
                    "border border-sky-500/20 bg-sky-500/10 backdrop-blur-sm",
                    "text-primary hover:bg-sky-500/20 transition-colors",
                    "dark:border-sky-500/10 dark:bg-sky-500/5"
                  )}
                >
                  <BookOpen className="h-4 w-4 text-sky-400" />
                  <span className="text-sm font-medium">Learn</span>
                </Link>
              </motion.div>
            </div>
          </>
        )}

        {/* Graph Algorithms List */}
        {mode === "graph" && (
          <>
            <div className="mb-2">
              <span className="text-muted px-2 text-xs font-medium uppercase tracking-wider">
                Graph Algorithms
              </span>
            </div>

            <SidebarGroup hoveredItem={hoveredItem} onHover={setHoveredItem}>
              {GRAPH_ALGORITHMS.map((algo) => (
                <SidebarItem
                  key={algo.id}
                  id={`graph-${algo.id}`}
                  label={algo.label}
                  isActive={graphAlgorithm === algo.id}
                  disabled={!algo.enabled}
                  hoveredItem={hoveredItem}
                  onHover={setHoveredItem}
                  onClick={() => algo.enabled && handleGraphAlgorithmSelect(algo.id)}
                />
              ))}
            </SidebarGroup>

            <div className="border-border-subtle my-4 border-t" />

            {/* CTA Group: Theory, Complexity, Learn */}
            <div className="space-y-2">
              {/* Theory */}
              <motion.div whileHover={buttonInteraction.hover} whileTap={buttonInteraction.tap}>
                <Link
                  href="/learn"
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-3 py-2.5",
                    "border border-amber-500/20 bg-amber-500/10 backdrop-blur-sm",
                    "text-primary hover:bg-amber-500/20 transition-colors",
                    "dark:border-amber-500/10 dark:bg-amber-500/5"
                  )}
                >
                  <GraduationCap className="h-4 w-4 text-amber-400" />
                  <span className="text-sm font-medium">Theory</span>
                </Link>
              </motion.div>

              {/* Complexity */}
              <motion.button
                type="button"
                onClick={openComplexityModal}
                whileHover={buttonInteraction.hover}
                whileTap={buttonInteraction.tap}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg px-3 py-2.5",
                  "border border-white/10 bg-white/5 backdrop-blur-sm",
                  "text-primary hover:bg-white/10 transition-colors",
                  "dark:border-white/5 dark:bg-black/20"
                )}
              >
                <BadgeHelp className="h-4 w-4 text-rose-400" />
                <span className="text-sm font-medium">Complexity</span>
              </motion.button>

              {/* Learn */}
              <motion.div whileHover={buttonInteraction.hover} whileTap={buttonInteraction.tap}>
                <Link
                  href={`/learn/graph/${graphAlgorithm}`}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-3 py-2.5",
                    "border border-sky-500/20 bg-sky-500/10 backdrop-blur-sm",
                    "text-primary hover:bg-sky-500/20 transition-colors",
                    "dark:border-sky-500/10 dark:bg-sky-500/5"
                  )}
                >
                  <BookOpen className="h-4 w-4 text-sky-400" />
                  <span className="text-sm font-medium">Learn</span>
                </Link>
              </motion.div>
            </div>
          </>
        )}

        {/* Interview Problems List */}
        {mode === "interview" && (
          <>
            <div className="mb-2">
              <span className="text-muted px-2 text-xs font-medium uppercase tracking-wider">
                Problems
              </span>
            </div>

            <SidebarGroup hoveredItem={hoveredItem} onHover={setHoveredItem}>
              {INTERVIEW_PROBLEMS.map((problem) => (
                <SidebarItem
                  key={problem.id}
                  id={`interview-${problem.id}`}
                  label={problem.label}
                  isActive={interviewProblem === problem.id}
                  disabled={!problem.enabled}
                  hoveredItem={hoveredItem}
                  onHover={setHoveredItem}
                  onClick={() => problem.enabled && handleInterviewProblemSelect(problem.id)}
                />
              ))}
            </SidebarGroup>

            <div className="border-border-subtle my-4 border-t" />

            {/* CTA Group: Theory, Complexity, Learn */}
            <div className="space-y-2">
              {/* Theory */}
              <motion.div whileHover={buttonInteraction.hover} whileTap={buttonInteraction.tap}>
                <Link
                  href="/learn"
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-3 py-2.5",
                    "border border-amber-500/20 bg-amber-500/10 backdrop-blur-sm",
                    "text-primary hover:bg-amber-500/20 transition-colors",
                    "dark:border-amber-500/10 dark:bg-amber-500/5"
                  )}
                >
                  <GraduationCap className="h-4 w-4 text-amber-400" />
                  <span className="text-sm font-medium">Theory</span>
                </Link>
              </motion.div>

              {/* Complexity */}
              <motion.button
                type="button"
                onClick={openComplexityModal}
                whileHover={buttonInteraction.hover}
                whileTap={buttonInteraction.tap}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg px-3 py-2.5",
                  "border border-white/10 bg-white/5 backdrop-blur-sm",
                  "text-primary hover:bg-white/10 transition-colors",
                  "dark:border-white/5 dark:bg-black/20"
                )}
              >
                <BadgeHelp className="h-4 w-4 text-cyan-400" />
                <span className="text-sm font-medium">Complexity</span>
              </motion.button>

              {/* Learn */}
              <motion.div whileHover={buttonInteraction.hover} whileTap={buttonInteraction.tap}>
                <Link
                  href={`/learn/interview/${interviewProblem}`}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-3 py-2.5",
                    "border border-sky-500/20 bg-sky-500/10 backdrop-blur-sm",
                    "text-primary hover:bg-sky-500/20 transition-colors",
                    "dark:border-sky-500/10 dark:bg-sky-500/5"
                  )}
                >
                  <BookOpen className="h-4 w-4 text-sky-400" />
                  <span className="text-sm font-medium">Learn</span>
                </Link>
              </motion.div>
            </div>
          </>
        )}

        {/* Pattern Problems List */}
        {mode === "patterns" && (
          <>
            <div className="mb-2">
              <span className="text-muted px-2 text-xs font-medium uppercase tracking-wider">
                Patterns
              </span>
            </div>

            <SidebarGroup hoveredItem={hoveredItem} onHover={setHoveredItem}>
              {PATTERN_PROBLEMS.map((problem) => (
                <SidebarItem
                  key={problem.id}
                  id={`pattern-${problem.id}`}
                  label={problem.label}
                  isActive={patternProblem === problem.id}
                  disabled={!problem.enabled}
                  hoveredItem={hoveredItem}
                  onHover={setHoveredItem}
                  onClick={() => problem.enabled && handlePatternProblemSelect(problem.id)}
                />
              ))}
            </SidebarGroup>

            <div className="border-border-subtle my-4 border-t" />

            {/* CTA Group: Theory, Complexity, Learn */}
            <div className="space-y-2">
              {/* Theory */}
              <motion.div whileHover={buttonInteraction.hover} whileTap={buttonInteraction.tap}>
                <Link
                  href="/learn"
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-3 py-2.5",
                    "border border-amber-500/20 bg-amber-500/10 backdrop-blur-sm",
                    "text-primary hover:bg-amber-500/20 transition-colors",
                    "dark:border-amber-500/10 dark:bg-amber-500/5"
                  )}
                >
                  <GraduationCap className="h-4 w-4 text-amber-400" />
                  <span className="text-sm font-medium">Theory</span>
                </Link>
              </motion.div>

              {/* Complexity */}
              <motion.button
                type="button"
                onClick={openComplexityModal}
                whileHover={buttonInteraction.hover}
                whileTap={buttonInteraction.tap}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg px-3 py-2.5",
                  "border border-white/10 bg-white/5 backdrop-blur-sm",
                  "text-primary hover:bg-white/10 transition-colors",
                  "dark:border-white/5 dark:bg-black/20"
                )}
              >
                <BadgeHelp className="h-4 w-4 text-fuchsia-400" />
                <span className="text-sm font-medium">Complexity</span>
              </motion.button>

              {/* Learn */}
              <motion.div whileHover={buttonInteraction.hover} whileTap={buttonInteraction.tap}>
                <Link
                  href={`/learn/patterns/${patternProblem}`}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-3 py-2.5",
                    "border border-sky-500/20 bg-sky-500/10 backdrop-blur-sm",
                    "text-primary hover:bg-sky-500/20 transition-colors",
                    "dark:border-sky-500/10 dark:bg-sky-500/5"
                  )}
                >
                  <BookOpen className="h-4 w-4 text-sky-400" />
                  <span className="text-sm font-medium">Learn</span>
                </Link>
              </motion.div>
            </div>
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="border-border-subtle border-t px-4 py-3">
        {/* Support Button */}
        <motion.button
          type="button"
          onClick={handleSupportClick}
          whileHover={buttonInteraction.hover}
          whileTap={buttonInteraction.tap}
          className={cn(
            "mb-3 flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2",
            "border border-rose-500/20 bg-rose-500/10 backdrop-blur-sm",
            "text-primary hover:bg-rose-500/20 transition-colors",
            "dark:border-rose-500/10 dark:bg-rose-500/5"
          )}
          title="Help keep Yield free"
        >
          <HeartHandshake className="h-4 w-4 text-rose-400" />
          <span className="text-sm font-medium">Support Yield</span>
        </motion.button>

        {/* Copyright & Links */}
        <div className="flex items-center justify-between">
          <p className="text-muted/60 text-[11px] font-medium tracking-wide">
            © {new Date().getFullYear()} Yield
          </p>
          <FooterMenu />
        </div>
      </div>

      {/* Complexity Modal */}
      <ComplexityModal isOpen={isComplexityOpen} onClose={closeComplexityModal} />
    </div>
  );
}

interface SidebarGroupProps {
  children: React.ReactNode;
  hoveredItem: string | null;
  onHover: (id: string | null) => void;
}

function SidebarGroup({ children }: SidebarGroupProps) {
  return <div className="relative space-y-1">{children}</div>;
}

interface SidebarItemProps {
  id: string;
  label: string;
  isActive?: boolean;
  disabled?: boolean;
  hoveredItem: string | null;
  onHover: (id: string | null) => void;
  onClick?: () => void;
  /** Optional link to index/info page (renders BadgeInfo icon) */
  infoLink?: string;
}

function SidebarItem({
  id,
  label,
  isActive,
  disabled,
  hoveredItem,
  onHover,
  onClick,
  infoLink,
}: SidebarItemProps) {
  const isHovered = hoveredItem === id && !disabled && !isActive;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => !disabled && onHover(id)}
      className={cn(
        "relative flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm transition-colors",
        isActive && "text-accent",
        !isActive && !disabled && "text-primary hover:text-accent",
        disabled && "text-muted cursor-not-allowed opacity-50"
      )}
    >
      {/* Sliding hover background */}
      {isHovered && (
        <motion.span
          layoutId="sidebar-hover"
          className="bg-surface-elevated absolute inset-0 rounded-md"
          transition={SPRING_PRESETS.snappy}
        />
      )}
      {/* Active background (static) */}
      {isActive && <span className="bg-accent-muted absolute inset-0 rounded-md" />}
      {/* Label text */}
      <span className="relative z-10">{label}</span>
      {/* Info link icon - only shown when active */}
      {infoLink && isActive && (
        <Link
          href={infoLink}
          onClick={(e) => e.stopPropagation()}
          data-tour-id="tour-info-icon"
          className={cn(
            "relative z-10 rounded p-0.5",
            "text-sky-400 transition-colors",
            "hover:text-sky-300"
          )}
          title={`Compare all ${label.toLowerCase()}`}
        >
          <BadgeInfo className="h-4 w-4" />
        </Link>
      )}
    </button>
  );
}

const FOOTER_LINKS = [
  { id: "about", label: "About", icon: Info, href: "/about", enabled: true },
  { id: "privacy", label: "Privacy", icon: Shield, href: "/privacy", enabled: true },
  { id: "terms", label: "Terms", icon: FileText, href: "/terms", enabled: true },
  { id: "faq", label: "FAQ", icon: HelpCircle, href: "/faq", enabled: true },
  { id: "contact", label: "Contact", icon: Mail, href: "/contact", enabled: true },
] as const;

function FooterMenu() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const buttonClasses = cn(
    "text-muted/60 hover:text-muted rounded-md p-1 transition-colors",
    "hover:bg-surface-elevated focus:outline-none"
  );

  if (!mounted) {
    return (
      <button type="button" className={buttonClasses} aria-label="More options">
        <MoreHorizontal className="h-4 w-4" />
      </button>
    );
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <motion.button
          type="button"
          whileHover={buttonInteraction.hover}
          whileTap={buttonInteraction.tap}
          className={buttonClasses}
          aria-label="More options"
        >
          <MoreHorizontal className="h-4 w-4" />
        </motion.button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          side="right"
          align="end"
          sideOffset={8}
          className={cn(
            "bg-surface border-border z-50 min-w-[140px] rounded-lg border p-1 shadow-lg",
            "animate-in fade-in-0 zoom-in-95 data-[side=right]:slide-in-from-left-2"
          )}
        >
          {FOOTER_LINKS.map((link) =>
            link.enabled ? (
              <DropdownMenu.Item key={link.id} asChild>
                <Link
                  href={link.href}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none",
                    "text-primary hover:bg-surface-elevated focus:bg-surface-elevated"
                  )}
                >
                  <link.icon className="h-3.5 w-3.5" />
                  <span>{link.label}</span>
                </Link>
              </DropdownMenu.Item>
            ) : (
              <DropdownMenu.Item
                key={link.id}
                disabled
                className={cn(
                  "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none",
                  "text-muted cursor-not-allowed opacity-50"
                )}
              >
                <link.icon className="h-3.5 w-3.5" />
                <span>{link.label}</span>
              </DropdownMenu.Item>
            )
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
