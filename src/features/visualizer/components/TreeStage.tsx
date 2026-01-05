"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Dices,
  Pause,
  Play,
  RotateCcw,
  SkipForward,
  Trash2,
} from "lucide-react";
import { memo, useCallback, useMemo, useRef, useState } from "react";
import type { TraversalOutput, TreeNodeState } from "@/features/algorithms";
import { generateBalancedInsertionOrder } from "@/features/algorithms/tree";
import { TreeControlBar } from "@/features/controls";
import { buttonInteraction, SPRING_PRESETS } from "@/lib/motion";
import { type TreeAlgorithmType, type TreeNode, type TreeState, useYieldStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useTree } from "../context";

export interface TreeStageProps {
  className?: string;
}

/**
 * Layout constants for tree positioning.
 */
const LAYOUT = {
  /** Y position of root as percentage of container height */
  ROOT_Y_PERCENT: 12,
  /** Vertical spacing between levels as percentage */
  LEVEL_HEIGHT_PERCENT: 16,
  /** Node diameter in pixels */
  NODE_SIZE: 48,
} as const;

const TRAVERSALS: { value: TreeAlgorithmType; label: string }[] = [
  { value: "inorder", label: "In-Order" },
  { value: "preorder", label: "Pre-Order" },
  { value: "postorder", label: "Post-Order" },
  { value: "bfs", label: "Level-Order (BFS)" },
];

/**
 * Calculates the position of a node in the tree using the binary split algorithm.
 */
function calculateNodeX(path: ("left" | "right")[]): number {
  let x = 50;
  for (let i = 0; i < path.length; i++) {
    const offset = 50 / 2 ** (i + 1);
    x += path[i] === "left" ? -offset : offset;
  }
  return x;
}

/**
 * Calculates the Y position based on depth.
 */
function calculateNodeY(depth: number): number {
  return LAYOUT.ROOT_Y_PERCENT + depth * LAYOUT.LEVEL_HEIGHT_PERCENT;
}

/**
 * Represents a node with its calculated screen position.
 */
interface PositionedNode {
  node: TreeNode;
  x: number;
  y: number;
  depth: number;
  parentX: number | null;
  parentY: number | null;
}

/**
 * Builds an array of positioned nodes from the tree state.
 */
function buildPositionedNodes(treeState: TreeState): PositionedNode[] {
  const positioned: PositionedNode[] = [];

  if (!treeState.rootId) return positioned;

  const traverse = (
    nodeId: string,
    depth: number,
    path: ("left" | "right")[],
    parentX: number | null,
    parentY: number | null
  ) => {
    const node = treeState.nodes[nodeId];
    if (!node) return;

    const x = calculateNodeX(path);
    const y = calculateNodeY(depth);

    positioned.push({ node, x, y, depth, parentX, parentY });

    if (node.leftId) {
      traverse(node.leftId, depth + 1, [...path, "left"], x, y);
    }
    if (node.rightId) {
      traverse(node.rightId, depth + 1, [...path, "right"], x, y);
    }
  };

  traverse(treeState.rootId, 0, [], null, null);

  return positioned;
}

/**
 * TreeStage — The Tree Visualization Stage.
 *
 * Renders a binary search tree with:
 * - Header with playback controls
 * - Layer 1 (Back): SVG lines connecting parent to child nodes
 * - Layer 2 (Front): Animated circular nodes with values
 * - Layer 3 (Bottom): TreeControlBar and traversal output
 */
export function TreeStage({ className }: TreeStageProps) {
  const treeState = useYieldStore((state) => state.treeState);
  const treeAlgorithm = useYieldStore((state) => state.treeAlgorithm);
  const insertNode = useYieldStore((state) => state.insertNode);
  const resetTree = useYieldStore((state) => state.resetTree);
  const setTreeAlgorithm = useYieldStore((state) => state.setTreeAlgorithm);

  // Get controller from context
  const controller = useTree();

  // Track insertion sequence for balanced tree generation
  const balancedInsertionRef = useRef<number[]>([]);
  const balancedInsertionIndexRef = useRef<number>(0);
  const balancedInsertionIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const positionedNodes = useMemo(() => buildPositionedNodes(treeState), [treeState]);

  const isEmpty = positionedNodes.length === 0;
  const hasTraversalOutput = controller.traversalOutput && controller.traversalOutput.length > 0;

  const isPlaying = controller.status === "playing";
  const isComplete = controller.status === "complete";
  const isIdle = controller.status === "idle";

  // State for traversal dropdown
  const [selectedTraversal, setSelectedTraversal] = useState<TreeAlgorithmType>("inorder");

  /**
   * Handles executing a traversal from the dropdown.
   */
  const handleTraversalExecute = useCallback(
    (traversal: TreeAlgorithmType) => {
      setSelectedTraversal(traversal);
      setTreeAlgorithm(traversal);
      controller.executeOperation(traversal);
    },
    [setTreeAlgorithm, controller]
  );

  /**
   * Handles executing an operation from the control bar.
   */
  const handleExecute = useCallback(
    (algorithm: TreeAlgorithmType, value?: number) => {
      // For operations that need a value, insert/delete from store first
      if (algorithm === "insert" && value !== undefined) {
        const insertedId = insertNode(value);
        if (insertedId) {
          // Execute the visualization after insert
          setTreeAlgorithm(algorithm);
          controller.executeOperation(algorithm, value);
        }
      } else if (algorithm === "delete" && value !== undefined) {
        // For delete, run the visualization first, then delete from store
        setTreeAlgorithm(algorithm);
        controller.executeOperation(algorithm, value);
        // Note: actual deletion happens via store action separately
      } else {
        // For search and traversals
        setTreeAlgorithm(algorithm);
        controller.executeOperation(algorithm, value);
      }
    },
    [insertNode, setTreeAlgorithm, controller]
  );

  /**
   * Resets the tree and controller.
   */
  const handleReset = useCallback(() => {
    // Clear any balanced insertion in progress
    if (balancedInsertionIntervalRef.current) {
      clearInterval(balancedInsertionIntervalRef.current);
      balancedInsertionIntervalRef.current = null;
    }
    balancedInsertionRef.current = [];
    balancedInsertionIndexRef.current = 0;

    controller.reset();
    resetTree();
  }, [controller, resetTree]);

  /**
   * Generates a balanced tree with animated insertion.
   */
  const handleGenerateBalanced = useCallback(() => {
    // Reset first
    handleReset();

    // Generate the insertion order for a balanced tree (15 nodes = nice 4-level tree)
    const values = generateBalancedInsertionOrder(15);
    balancedInsertionRef.current = values;
    balancedInsertionIndexRef.current = 0;

    // Insert nodes with a delay for visual effect
    balancedInsertionIntervalRef.current = setInterval(() => {
      const index = balancedInsertionIndexRef.current;
      if (index >= balancedInsertionRef.current.length) {
        if (balancedInsertionIntervalRef.current) {
          clearInterval(balancedInsertionIntervalRef.current);
          balancedInsertionIntervalRef.current = null;
        }
        return;
      }

      // Safe: index is always within bounds since we check against length above
      const value = balancedInsertionRef.current[index] as number;
      insertNode(value);
      balancedInsertionIndexRef.current += 1;
    }, 150);
  }, [handleReset, insertNode]);

  return (
    <div className={cn("flex h-full flex-col", className)}>
      {/* Header Bar */}
      <header className="border-border-subtle bg-surface flex h-14 shrink-0 items-center justify-between border-b px-4">
        <div className="flex items-center gap-3">
          <h1 className="text-primary text-sm font-medium">Binary Search Tree</h1>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          {/* Traversal Dropdown */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <motion.button
                type="button"
                disabled={isPlaying || isEmpty}
                whileHover={isPlaying || isEmpty ? {} : buttonInteraction.hover}
                whileTap={isPlaying || isEmpty ? {} : buttonInteraction.tap}
                className={cn(
                  "bg-surface-elevated border-border text-primary flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-medium",
                  "focus-visible:ring-emerald-500 focus-visible:outline-none focus-visible:ring-2",
                  (isPlaying || isEmpty) && "cursor-not-allowed opacity-50"
                )}
              >
                <span>
                  {TRAVERSALS.find((t) => t.value === selectedTraversal)?.label ?? "Traversal"}
                </span>
                <ChevronDown className="h-3 w-3" />
              </motion.button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className={cn(
                  "bg-surface-elevated border-border z-50 min-w-[160px] rounded-lg border p-1 shadow-lg",
                  "animate-in fade-in-0 zoom-in-95"
                )}
                sideOffset={5}
              >
                {TRAVERSALS.map((traversal) => (
                  <DropdownMenu.Item
                    key={traversal.value}
                    onSelect={() => handleTraversalExecute(traversal.value)}
                    className={cn(
                      "text-primary flex cursor-pointer items-center rounded-md px-2 py-1.5 text-xs font-medium outline-none",
                      "hover:bg-surface focus:bg-surface",
                      selectedTraversal === traversal.value && "text-emerald-400"
                    )}
                  >
                    {traversal.label}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>

          <div className="bg-border h-6 w-px" />

          {/* Tree Actions */}
          <div className="flex items-center gap-2">
            <ActionButton
              label="Random"
              icon={<Dices className="h-3.5 w-3.5" />}
              onClick={handleGenerateBalanced}
              disabled={isPlaying}
              variant="secondary"
            />
            <ActionButton
              label="Clear"
              icon={<Trash2 className="h-3.5 w-3.5" />}
              onClick={handleReset}
              disabled={isPlaying || isEmpty}
              variant="destructive"
            />
          </div>

          <div className="bg-border h-6 w-px" />

          {/* Playback Controls */}
          <div className="flex items-center gap-2">
            <ControlButton
              label="Step"
              icon={<SkipForward className="h-3.5 w-3.5" />}
              onClick={controller.step}
              disabled={isComplete || isIdle}
            />
            <ControlButton
              label="Reset"
              icon={<RotateCcw className="h-3.5 w-3.5" />}
              onClick={() => controller.reset()}
              disabled={isIdle}
            />
            <PlayPauseButton
              isPlaying={isPlaying}
              onClick={isPlaying ? controller.pause : controller.play}
              disabled={isComplete || isIdle}
            />
          </div>
        </div>
      </header>

      {/* Visualization Area */}
      <div className="bg-dot-pattern relative flex-1 overflow-hidden">
        {isEmpty ? (
          <EmptyTreeHint />
        ) : (
          <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
            {/* Layer 1: Edge Lines */}
            <g className="edges">
              {positionedNodes.map(
                ({ node, x, y, parentX, parentY }) =>
                  parentX !== null &&
                  parentY !== null && (
                    <TreeEdge key={`edge-${node.id}`} x1={parentX} y1={parentY} x2={x} y2={y} />
                  )
              )}
            </g>
          </svg>
        )}

        {/* Layer 2: Nodes */}
        <div className="absolute inset-0">
          <AnimatePresence mode="popLayout">
            {positionedNodes.map(({ node, x, y }) => (
              <TreeNodeCircle
                key={node.id}
                node={node}
                x={x}
                y={y}
                visualState={controller.nodeStates?.get(node.id) ?? "idle"}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Status Overlay */}
        <StatusOverlay
          status={controller.status}
          lastResult={controller.lastResult}
          stepCount={controller.currentStepIndex}
          nodeCount={positionedNodes.length}
          maxDepth={
            positionedNodes.length > 0 ? Math.max(...positionedNodes.map((n) => n.depth)) : 0
          }
        />

        {/* Traversal Output Display */}
        <AnimatePresence>
          {hasTraversalOutput && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute right-4 bottom-24 left-4"
            >
              <TraversalOutputDisplay output={controller.traversalOutput} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Control Bar */}
        <div className="absolute inset-x-0 bottom-4 z-30 flex justify-center px-4">
          <TreeControlBar onExecute={handleExecute} status={controller.status} />
        </div>
      </div>
    </div>
  );
}

/**
 * Status overlay showing current operation state.
 */
interface StatusOverlayProps {
  status: "idle" | "playing" | "paused" | "complete";
  lastResult: "found" | "not-found" | "inserted" | "deleted" | null;
  stepCount: number;
  nodeCount: number;
  maxDepth: number;
}

function StatusOverlay({ status, lastResult, stepCount, nodeCount, maxDepth }: StatusOverlayProps) {
  return (
    <div className="absolute top-4 left-4 flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <span className="text-muted text-xs">
          {nodeCount} node{nodeCount !== 1 ? "s" : ""}
        </span>
        {nodeCount > 0 && <span className="text-muted text-xs">Depth: {maxDepth}</span>}
        {stepCount > 0 && <span className="text-muted text-xs">Steps: {stepCount}</span>}
      </div>

      {/* Result indicator */}
      <AnimatePresence>
        {status === "complete" && lastResult && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium",
              lastResult === "found" && "bg-emerald-500/10 text-emerald-400",
              lastResult === "not-found" && "bg-rose-500/10 text-rose-400",
              lastResult === "inserted" && "bg-violet-500/10 text-violet-400",
              lastResult === "deleted" && "bg-orange-500/10 text-orange-400"
            )}
          >
            {lastResult === "found" && (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" />
                Value found!
              </>
            )}
            {lastResult === "not-found" && (
              <>
                <AlertCircle className="h-3.5 w-3.5" />
                Value not found
              </>
            )}
            {lastResult === "inserted" && (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" />
                Node inserted
              </>
            )}
            {lastResult === "deleted" && (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" />
                Node deleted
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Edge line connecting parent to child node.
 */
interface TreeEdgeProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

const TreeEdge = memo(function TreeEdge({ x1, y1, x2, y2 }: TreeEdgeProps) {
  return (
    <motion.line
      x1={`${x1}%`}
      y1={`${y1}%`}
      x2={`${x2}%`}
      y2={`${y2}%`}
      stroke="currentColor"
      strokeWidth={2}
      className="text-border"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    />
  );
});

/**
 * Visual state styling for tree nodes.
 */
const NODE_STATE_STYLES: Record<TreeNodeState, { border: string; shadow: string; bg?: string }> = {
  idle: {
    border: "border-emerald-500/50",
    shadow: "shadow-emerald-500/10",
  },
  comparing: {
    border: "border-amber-400",
    shadow: "shadow-amber-400/30",
    bg: "bg-amber-500/10",
  },
  visiting: {
    border: "border-cyan-400",
    shadow: "shadow-cyan-400/30",
    bg: "bg-cyan-500/10",
  },
  found: {
    border: "border-emerald-400",
    shadow: "shadow-emerald-400/40",
    bg: "bg-emerald-500/20",
  },
  "not-found": {
    border: "border-rose-400",
    shadow: "shadow-rose-400/30",
    bg: "bg-rose-500/10",
  },
  inserting: {
    border: "border-violet-400",
    shadow: "shadow-violet-400/30",
    bg: "bg-violet-500/10",
  },
  deleting: {
    border: "border-rose-400",
    shadow: "shadow-rose-400/30",
    bg: "bg-rose-500/10",
  },
  traversed: {
    border: "border-orange-400",
    shadow: "shadow-orange-400/30",
    bg: "bg-orange-500/10",
  },
};

/**
 * Animated circular node with value and visual state.
 */
interface TreeNodeCircleProps {
  node: TreeNode;
  x: number;
  y: number;
  visualState: TreeNodeState;
}

const TreeNodeCircle = memo(
  function TreeNodeCircle({ node, x, y, visualState }: TreeNodeCircleProps) {
    const styles = NODE_STATE_STYLES[visualState];

    return (
      <motion.div
        layout
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: visualState === "comparing" || visualState === "visiting" ? 1.1 : 1,
          opacity: 1,
        }}
        exit={{ scale: 0, opacity: 0 }}
        transition={SPRING_PRESETS.snappy}
        style={{
          left: `${x}%`,
          top: `${y}%`,
          width: LAYOUT.NODE_SIZE,
          height: LAYOUT.NODE_SIZE,
        }}
        className={cn(
          "absolute flex items-center justify-center",
          "rounded-full border-2",
          "bg-surface-elevated shadow-lg",
          "-translate-x-1/2 -translate-y-1/2",
          "transition-colors duration-200",
          styles.border,
          styles.shadow,
          styles.bg
        )}
        role="img"
        aria-label={`Node with value ${node.value}, state: ${visualState}`}
      >
        <span className="text-primary text-sm font-semibold tabular-nums">{node.value}</span>
      </motion.div>
    );
  },
  (prev, next) =>
    prev.node.id === next.node.id &&
    prev.node.value === next.node.value &&
    prev.x === next.x &&
    prev.y === next.y &&
    prev.visualState === next.visualState
);

/**
 * Hint displayed when the tree is empty.
 */
function EmptyTreeHint() {
  return (
    <div className="flex h-full items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <div className="text-muted mb-2 text-4xl">🌳</div>
        <p className="text-muted text-sm">Tree is empty</p>
        <p className="text-muted/60 mt-1 text-xs">Use the controls below to insert nodes</p>
      </motion.div>
    </div>
  );
}

/**
 * Displays the traversal output sequence.
 */
interface TraversalOutputDisplayProps {
  output: TraversalOutput[];
}

function TraversalOutputDisplay({ output }: TraversalOutputDisplayProps) {
  return (
    <motion.div
      className={cn("rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm", "px-4 py-3")}
    >
      <div className="text-muted mb-2 text-xs font-medium uppercase tracking-wider">
        Traversal Output
      </div>
      <div className="flex flex-wrap gap-2">
        <AnimatePresence mode="popLayout">
          {output.map((item) => (
            <motion.span
              key={`output-${item.order}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={SPRING_PRESETS.snappy}
              className={cn(
                "inline-flex h-8 w-8 items-center justify-center",
                "rounded-full border border-orange-400/50 bg-orange-500/10",
                "text-sm font-semibold tabular-nums text-orange-400"
              )}
            >
              {item.value}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/**
 * Control button in the header.
 */
interface ControlButtonProps {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

function ControlButton({ label, icon, onClick, disabled }: ControlButtonProps) {
  const interactionProps = disabled
    ? {}
    : { whileHover: buttonInteraction.hover, whileTap: buttonInteraction.tap };

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      {...interactionProps}
      animate={{ opacity: disabled ? 0.5 : 1 }}
      transition={SPRING_PRESETS.snappy}
      className={cn(
        "bg-surface-elevated border-border text-primary flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium",
        "focus-visible:ring-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        disabled && "cursor-not-allowed"
      )}
      aria-label={label}
    >
      {icon}
      {label}
    </motion.button>
  );
}

/**
 * Play/Pause toggle button.
 */
interface PlayPauseButtonProps {
  isPlaying: boolean;
  onClick: () => void;
  disabled?: boolean;
}

function PlayPauseButton({ isPlaying, onClick, disabled }: PlayPauseButtonProps) {
  const interactionProps = disabled
    ? {}
    : { whileHover: buttonInteraction.hover, whileTap: buttonInteraction.tap };

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      {...interactionProps}
      animate={{ opacity: disabled ? 0.5 : 1 }}
      transition={SPRING_PRESETS.snappy}
      className={cn(
        "bg-emerald-500 flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-white",
        "focus-visible:ring-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        disabled && "cursor-not-allowed"
      )}
      aria-label={isPlaying ? "Pause" : "Play"}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isPlaying ? "pause" : "play"}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="flex items-center"
        >
          {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        </motion.span>
      </AnimatePresence>
      {isPlaying ? "Pause" : "Resume"}
    </motion.button>
  );
}

/**
 * Action button for tree operations (Random, Clear).
 */
interface ActionButtonProps {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: "secondary" | "destructive";
}

function ActionButton({
  label,
  icon,
  onClick,
  disabled,
  variant = "secondary",
}: ActionButtonProps) {
  const interactionProps = disabled
    ? {}
    : { whileHover: buttonInteraction.hover, whileTap: buttonInteraction.tap };

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      {...interactionProps}
      animate={{ opacity: disabled ? 0.5 : 1 }}
      transition={SPRING_PRESETS.snappy}
      className={cn(
        "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
        "focus-visible:ring-emerald-500 focus-visible:outline-none focus-visible:ring-2",
        variant === "secondary" && "bg-violet-500/10 text-violet-400 hover:bg-violet-500/20",
        variant === "destructive" && "bg-rose-500/10 text-rose-400 hover:bg-rose-500/20",
        disabled && "cursor-not-allowed"
      )}
      aria-label={label}
    >
      {icon}
      {label}
    </motion.button>
  );
}
