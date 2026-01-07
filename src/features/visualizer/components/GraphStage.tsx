"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Circle,
  GitBranch,
  MousePointer2,
  Pause,
  Play,
  RotateCcw,
  SkipForward,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { getSetColor } from "@/features/algorithms/graph";
import { useSponsorship } from "@/features/sponsorship";
import { buttonInteraction, SPRING_PRESETS } from "@/lib/motion";
import {
  GRAPH_CONFIG,
  type GraphAlgorithmType,
  type GraphEdge,
  type GraphNode,
  useYieldStore,
} from "@/lib/store";
import { cn } from "@/lib/utils";
import { type GraphInteractionMode, useGraph } from "../context";
import { DrawingEdge, GraphEdgeComponent, GraphNodeComponent } from "./graph";

export interface GraphStageProps {
  className?: string;
}

/**
 * Preset graph configurations.
 */
const GRAPH_PRESETS = [
  { id: "random", label: "Random Graph" },
  { id: "complete", label: "Complete (K5)" },
  { id: "grid", label: "Grid Layout" },
  { id: "tree", label: "Tree Structure" },
] as const;

type PresetType = (typeof GRAPH_PRESETS)[number]["id"];

/**
 * Generates a random graph with N nodes and random edges.
 */
function generateRandomGraph(): { nodes: GraphNode[]; edges: Omit<GraphEdge, "id">[] } {
  const nodeCount = 8;
  const nodes: GraphNode[] = [];
  const edges: Omit<GraphEdge, "id">[] = [];

  // Generate nodes in a roughly circular layout with some randomness
  for (let i = 0; i < nodeCount; i++) {
    const angle = (i / nodeCount) * 2 * Math.PI;
    const radius = 30 + Math.random() * 10;
    const x = 50 + radius * Math.cos(angle);
    const y = 50 + radius * Math.sin(angle);
    const label = GRAPH_CONFIG.NODE_LABELS[i] ?? `N${i + 1}`;
    nodes.push({ id: `temp-${i}`, x, y, label });
  }

  // Generate random edges (ensure connectivity)
  const connectedNodes = new Set<number>([0]);
  const unconnectedNodes = new Set<number>();
  for (let i = 1; i < nodeCount; i++) {
    unconnectedNodes.add(i);
  }

  // First, ensure all nodes are connected
  while (unconnectedNodes.size > 0) {
    const fromArray = Array.from(connectedNodes);
    const fromIndex = fromArray[Math.floor(Math.random() * fromArray.length)] ?? 0;
    const toArray = Array.from(unconnectedNodes);
    const toIndex = toArray[Math.floor(Math.random() * toArray.length)] ?? 1;

    edges.push({
      sourceId: `temp-${fromIndex}`,
      targetId: `temp-${toIndex}`,
      weight: Math.floor(Math.random() * 9) + 1,
    });

    connectedNodes.add(toIndex);
    unconnectedNodes.delete(toIndex);
  }

  // Add a few more random edges
  const extraEdges = Math.floor(Math.random() * 4) + 2;
  for (let i = 0; i < extraEdges; i++) {
    const from = Math.floor(Math.random() * nodeCount);
    let to = Math.floor(Math.random() * nodeCount);
    while (to === from) {
      to = Math.floor(Math.random() * nodeCount);
    }

    // Check if edge already exists
    const exists = edges.some(
      (e) =>
        (e.sourceId === `temp-${from}` && e.targetId === `temp-${to}`) ||
        (e.sourceId === `temp-${to}` && e.targetId === `temp-${from}`)
    );

    if (!exists) {
      edges.push({
        sourceId: `temp-${from}`,
        targetId: `temp-${to}`,
        weight: Math.floor(Math.random() * 9) + 1,
      });
    }
  }

  return { nodes, edges };
}

/**
 * Generates a complete graph (K5 - all nodes connected to all other nodes).
 */
function generateCompleteGraph(): { nodes: GraphNode[]; edges: Omit<GraphEdge, "id">[] } {
  const nodeCount = 5;
  const nodes: GraphNode[] = [];
  const edges: Omit<GraphEdge, "id">[] = [];

  // Pentagon layout
  for (let i = 0; i < nodeCount; i++) {
    const angle = (i / nodeCount) * 2 * Math.PI - Math.PI / 2;
    const radius = 30;
    const x = 50 + radius * Math.cos(angle);
    const y = 50 + radius * Math.sin(angle);
    const label = GRAPH_CONFIG.NODE_LABELS[i] ?? `N${i + 1}`;
    nodes.push({ id: `temp-${i}`, x, y, label });
  }

  // Connect every node to every other node
  for (let i = 0; i < nodeCount; i++) {
    for (let j = i + 1; j < nodeCount; j++) {
      edges.push({
        sourceId: `temp-${i}`,
        targetId: `temp-${j}`,
        weight: Math.floor(Math.random() * 9) + 1,
      });
    }
  }

  return { nodes, edges };
}

/**
 * Generates a grid-like graph layout.
 */
function generateGridGraph(): { nodes: GraphNode[]; edges: Omit<GraphEdge, "id">[] } {
  const rows = 3;
  const cols = 3;
  const nodes: GraphNode[] = [];
  const edges: Omit<GraphEdge, "id">[] = [];

  // Create grid of nodes
  let nodeIndex = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = 25 + (c / (cols - 1)) * 50;
      const y = 25 + (r / (rows - 1)) * 50;
      const label = GRAPH_CONFIG.NODE_LABELS[nodeIndex] ?? `N${nodeIndex + 1}`;
      nodes.push({ id: `temp-${nodeIndex}`, x, y, label });
      nodeIndex++;
    }
  }

  // Connect adjacent nodes (horizontal and vertical)
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const current = r * cols + c;

      // Right neighbor
      if (c < cols - 1) {
        edges.push({
          sourceId: `temp-${current}`,
          targetId: `temp-${current + 1}`,
          weight: Math.floor(Math.random() * 5) + 1,
        });
      }

      // Bottom neighbor
      if (r < rows - 1) {
        edges.push({
          sourceId: `temp-${current}`,
          targetId: `temp-${current + cols}`,
          weight: Math.floor(Math.random() * 5) + 1,
        });
      }
    }
  }

  return { nodes, edges };
}

/**
 * Generates a tree-like graph structure.
 */
function generateTreeGraph(): { nodes: GraphNode[]; edges: Omit<GraphEdge, "id">[] } {
  const nodes: GraphNode[] = [];
  const edges: Omit<GraphEdge, "id">[] = [];

  // Binary tree layout
  const positions = [
    { x: 50, y: 15 }, // Root
    { x: 30, y: 40 }, // Level 1 left
    { x: 70, y: 40 }, // Level 1 right
    { x: 20, y: 65 }, // Level 2
    { x: 40, y: 65 },
    { x: 60, y: 65 },
    { x: 80, y: 65 },
  ];

  for (let i = 0; i < positions.length; i++) {
    const pos = positions[i];
    if (!pos) continue;
    const label = GRAPH_CONFIG.NODE_LABELS[i] ?? `N${i + 1}`;
    nodes.push({ id: `temp-${i}`, x: pos.x, y: pos.y, label });
  }

  // Tree edges
  const treeEdges = [
    [0, 1],
    [0, 2],
    [1, 3],
    [1, 4],
    [2, 5],
    [2, 6],
  ];
  for (const [from, to] of treeEdges) {
    if (from === undefined || to === undefined) continue;
    edges.push({
      sourceId: `temp-${from}`,
      targetId: `temp-${to}`,
      weight: Math.floor(Math.random() * 9) + 1,
    });
  }

  return { nodes, edges };
}

/**
 * GraphStage — The Graph Visualization Stage.
 *
 * Renders an interactive graph with:
 * - Header with algorithm selection and controls
 * - SVG layer for edges
 * - HTML layer for draggable nodes
 * - Double-click to add nodes
 * - Drag from node to node to create edges
 * - Drag nodes to reposition
 */
export function GraphStage({ className }: GraphStageProps) {
  const graphState = useYieldStore((state) => state.graphState);
  const graphAlgorithm = useYieldStore((state) => state.graphAlgorithm);
  const addGraphNode = useYieldStore((state) => state.addGraphNode);
  const addGraphEdge = useYieldStore((state) => state.addGraphEdge);
  const updateGraphNodePosition = useYieldStore((state) => state.updateGraphNodePosition);
  const removeGraphNode = useYieldStore((state) => state.removeGraphNode);
  const clearGraph = useYieldStore((state) => state.clearGraph);
  const setGraphDirected = useYieldStore((state) => state.setGraphDirected);

  const controller = useGraph();
  const containerRef = useRef<HTMLDivElement>(null);

  const nodes = useMemo(() => Object.values(graphState.nodes), [graphState.nodes]);
  const edges = useMemo(() => Object.values(graphState.edges), [graphState.edges]);

  const isEmpty = nodes.length === 0;
  const isPlaying = controller.status === "playing";
  const isComplete = controller.status === "complete";
  const isIdle = controller.status === "idle";

  // Sponsorship engagement tracking
  const { incrementCompletion } = useSponsorship();
  const hasTrackedCompletion = useRef(false);
  useEffect(() => {
    if (isComplete && !hasTrackedCompletion.current) {
      hasTrackedCompletion.current = true;
      incrementCompletion();
    } else if (isIdle) {
      hasTrackedCompletion.current = false;
    }
  }, [isComplete, isIdle, incrementCompletion]);

  /**
   * Converts mouse event coordinates to percentage-based canvas coordinates.
   */
  const getCanvasCoordinates = useCallback(
    (e: React.MouseEvent): { x: number; y: number } | null => {
      const container = containerRef.current;
      if (!container) return null;

      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
    },
    []
  );

  /**
   * Handles double-click on canvas to add a new node.
   */
  const handleCanvasDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      // Don't add node if clicking on an existing node
      if ((e.target as HTMLElement).closest("[role='button']")) return;

      const coords = getCanvasCoordinates(e);
      if (coords) {
        addGraphNode(coords.x, coords.y);
      }
    },
    [getCanvasCoordinates, addGraphNode]
  );

  /**
   * Handles mouse down on a node (start drag or edge creation).
   */
  const handleNodeMouseDown = useCallback(
    (nodeId: string, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const coords = getCanvasCoordinates(e);
      if (!coords) return;

      const node = graphState.nodes[nodeId];
      if (!node) return;

      // If holding Shift, start edge creation mode
      if (e.shiftKey) {
        controller.setInteractionMode({
          type: "drawing-edge",
          sourceId: nodeId,
          mouseX: coords.x,
          mouseY: coords.y,
        });
      } else {
        // Start node drag
        controller.setInteractionMode({
          type: "dragging-node",
          nodeId,
          offsetX: coords.x - node.x,
          offsetY: coords.y - node.y,
        });
      }
    },
    [getCanvasCoordinates, graphState.nodes, controller]
  );

  /**
   * Handles mouse move on the canvas.
   */
  const handleCanvasMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const coords = getCanvasCoordinates(e);
      if (!coords) return;

      const mode = controller.interactionMode;

      if (mode.type === "dragging-node") {
        const newX = coords.x - mode.offsetX;
        const newY = coords.y - mode.offsetY;
        updateGraphNodePosition(
          mode.nodeId,
          Math.max(5, Math.min(95, newX)),
          Math.max(5, Math.min(95, newY))
        );
      } else if (mode.type === "drawing-edge") {
        controller.setInteractionMode({
          ...mode,
          mouseX: coords.x,
          mouseY: coords.y,
        });
      }
    },
    [getCanvasCoordinates, controller, updateGraphNodePosition]
  );

  /**
   * Handles mouse up on a node (complete edge creation).
   */
  const handleNodeMouseUp = useCallback(
    (targetNodeId: string) => {
      const mode = controller.interactionMode;

      if (mode.type === "drawing-edge" && mode.sourceId !== targetNodeId) {
        addGraphEdge(mode.sourceId, targetNodeId);
      }

      controller.setInteractionMode({ type: "idle" });
    },
    [controller, addGraphEdge]
  );

  /**
   * Handles mouse up on the canvas (end any interaction).
   */
  const handleCanvasMouseUp = useCallback(() => {
    controller.setInteractionMode({ type: "idle" });
  }, [controller]);

  /**
   * Handles double-click on a node (delete it).
   */
  const handleNodeDoubleClick = useCallback(
    (nodeId: string) => {
      removeGraphNode(nodeId);
    },
    [removeGraphNode]
  );

  /**
   * Handles generating a preset graph.
   */
  const handleGeneratePreset = useCallback(
    (preset: PresetType) => {
      clearGraph();

      let graphData: { nodes: GraphNode[]; edges: Omit<GraphEdge, "id">[] };

      switch (preset) {
        case "random":
          graphData = generateRandomGraph();
          break;
        case "complete":
          graphData = generateCompleteGraph();
          break;
        case "grid":
          graphData = generateGridGraph();
          break;
        case "tree":
          graphData = generateTreeGraph();
          break;
        default:
          return;
      }

      // Add nodes and build ID mapping
      const idMap = new Map<string, string>();
      for (const node of graphData.nodes) {
        const newId = addGraphNode(node.x, node.y, node.label);
        if (newId) {
          idMap.set(node.id, newId);
        }
      }

      // Add edges with mapped IDs
      for (const edge of graphData.edges) {
        const sourceId = idMap.get(edge.sourceId);
        const targetId = idMap.get(edge.targetId);
        if (sourceId && targetId) {
          addGraphEdge(sourceId, targetId, edge.weight);
        }
      }
    },
    [clearGraph, addGraphNode, addGraphEdge]
  );

  /**
   * Handles running the selected algorithm.
   */
  const handleRunAlgorithm = useCallback(() => {
    if (isEmpty) return;

    // For Prim's, use the first node as start (or selected if available)
    const startNodeId = controller.selectedNodeId ?? nodes[0]?.id;
    controller.runAlgorithm(graphAlgorithm, graphState, startNodeId);
  }, [graphAlgorithm, graphState, isEmpty, nodes, controller]);

  /**
   * Handles clearing the graph.
   */
  const handleClearGraph = useCallback(() => {
    controller.reset();
    clearGraph();
  }, [controller, clearGraph]);

  /**
   * Toggles directed/undirected mode.
   */
  const handleToggleDirected = useCallback(() => {
    setGraphDirected(!graphState.isDirected);
  }, [setGraphDirected, graphState.isDirected]);

  // Get the source node for drawing edge
  const drawingSourceNode =
    controller.interactionMode.type === "drawing-edge"
      ? graphState.nodes[controller.interactionMode.sourceId]
      : null;

  return (
    <div className={cn("flex h-full min-h-0 flex-col", className)}>
      {/* Header Bar - pl-14 on mobile to clear hamburger button */}
      <header className="border-border-subtle bg-surface flex h-14 shrink-0 items-center justify-between gap-2 overflow-x-auto border-b pl-14 pr-2 md:px-4">
        <h1 className="text-primary text-xs font-medium md:text-sm">
          {graphState.isDirected ? "Directed" : "Undirected"}
        </h1>

        {/* Controls */}
        <div className="flex shrink-0 items-center gap-2 md:gap-4">
          {/* Graph Actions */}
          <div className="flex items-center gap-1 md:gap-2">
            {/* Generate Dropdown */}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <motion.button
                  type="button"
                  disabled={isPlaying}
                  whileHover={isPlaying ? {} : buttonInteraction.hover}
                  whileTap={isPlaying ? {} : buttonInteraction.tap}
                  className={cn(
                    "flex shrink-0 items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium md:gap-1.5 md:px-2.5",
                    "bg-violet-500/10 text-violet-400 hover:bg-violet-500/20",
                    "focus-visible:ring-violet-500 focus-visible:outline-none focus-visible:ring-2",
                    isPlaying && "cursor-not-allowed opacity-50"
                  )}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span className="hidden md:inline">Generate</span>
                  <ChevronDown className="h-3 w-3" />
                </motion.button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className={cn(
                    "bg-surface-elevated border-border z-50 min-w-[140px] rounded-lg border p-1 shadow-lg",
                    "animate-in fade-in-0 zoom-in-95"
                  )}
                  sideOffset={5}
                >
                  {GRAPH_PRESETS.map((preset) => (
                    <DropdownMenu.Item
                      key={preset.id}
                      onSelect={() => handleGeneratePreset(preset.id)}
                      className={cn(
                        "text-primary flex cursor-pointer items-center rounded-md px-2 py-1.5 text-xs font-medium outline-none",
                        "hover:bg-surface focus:bg-surface"
                      )}
                    >
                      {preset.label}
                    </DropdownMenu.Item>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>

            <ActionButton
              label={graphState.isDirected ? "Directed" : "Undirected"}
              icon={<GitBranch className="h-3.5 w-3.5" />}
              onClick={handleToggleDirected}
              disabled={isPlaying}
              variant={graphState.isDirected ? "active" : "secondary"}
            />

            <ActionButton
              label="Clear"
              icon={<Trash2 className="h-3.5 w-3.5" />}
              onClick={handleClearGraph}
              disabled={isPlaying || isEmpty}
              variant="destructive"
            />
          </div>

          <div className="bg-border hidden h-6 w-px md:block" />

          {/* Playback Controls */}
          <div className="flex items-center gap-1 md:gap-2">
            <ControlButton
              label="Step"
              icon={<SkipForward className="h-3.5 w-3.5" />}
              onClick={controller.step}
              disabled={isComplete || isIdle || isEmpty}
            />
            <ControlButton
              label="Reset"
              icon={<RotateCcw className="h-3.5 w-3.5" />}
              onClick={controller.reset}
              disabled={isIdle}
            />
            <PlayPauseButton
              isPlaying={isPlaying}
              hasStarted={controller.currentStepIndex > 0 && !isComplete}
              onClick={
                isPlaying
                  ? controller.pause
                  : isIdle || isComplete
                    ? handleRunAlgorithm
                    : controller.play
              }
              disabled={isEmpty}
            />
          </div>
        </div>
      </header>

      {/* Visualization Area */}
      <div
        ref={containerRef}
        role="application"
        aria-label="Graph canvas - double-click to add nodes, shift-drag to connect"
        className="bg-dot-pattern relative min-h-0 flex-1 overflow-hidden"
        onDoubleClick={handleCanvasDoubleClick}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onMouseLeave={handleCanvasMouseUp}
      >
        {isEmpty ? (
          <EmptyGraphHint />
        ) : (
          <>
            {/* SVG Layer: Edges */}
            <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
              <g className="edges">
                {edges.map((edge) => {
                  const sourceNode = graphState.nodes[edge.sourceId];
                  const targetNode = graphState.nodes[edge.targetId];
                  if (!sourceNode || !targetNode) return null;

                  return (
                    <GraphEdgeComponent
                      key={edge.id}
                      edge={edge}
                      sourceNode={sourceNode}
                      targetNode={targetNode}
                      visualState={controller.edgeStates.get(edge.id) ?? "idle"}
                      isDirected={graphState.isDirected}
                      showWeight={true}
                    />
                  );
                })}

                {/* Drawing edge preview */}
                {drawingSourceNode && controller.interactionMode.type === "drawing-edge" && (
                  <DrawingEdge
                    sourceNode={drawingSourceNode}
                    mouseX={controller.interactionMode.mouseX}
                    mouseY={controller.interactionMode.mouseY}
                  />
                )}
              </g>
            </svg>

            {/* HTML Layer: Nodes */}
            <div className="absolute inset-0">
              <AnimatePresence mode="popLayout">
                {nodes.map((node) => {
                  const setId = controller.nodeSetIds.get(node.id);
                  const indegree = controller.nodeIndegrees.get(node.id);
                  return (
                    <GraphNodeComponent
                      key={node.id}
                      node={node}
                      visualState={controller.nodeStates.get(node.id) ?? "idle"}
                      isConnecting={
                        controller.interactionMode.type === "drawing-edge" &&
                        controller.interactionMode.sourceId !== node.id
                      }
                      setId={setId}
                      setColor={setId !== undefined ? getSetColor(setId) : undefined}
                      indegree={indegree}
                      onMouseDown={(e) => handleNodeMouseDown(node.id, e)}
                      onMouseUp={() => handleNodeMouseUp(node.id)}
                      onDoubleClick={() => handleNodeDoubleClick(node.id)}
                    />
                  );
                })}
              </AnimatePresence>
            </div>
          </>
        )}

        {/* Status Overlay */}
        <StatusOverlay
          stepCount={controller.currentStepIndex}
          interactionMode={controller.interactionMode}
          mstTotalWeight={controller.mstTotalWeight}
          mstEdgeCount={controller.mstEdgeCount}
          isDisconnected={controller.isDisconnected}
          topologicalOrder={controller.topologicalOrder}
          hasCycle={controller.hasCycle}
          nodes={graphState.nodes}
          isComplete={isComplete}
        />

        {/* Graph Stats (Top Right) */}
        <div className="absolute top-4 right-4">
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-medium",
              graphState.isDirected
                ? "bg-cyan-500/10 text-cyan-400"
                : "bg-violet-500/10 text-violet-400"
            )}
          >
            {nodes.length} nodes · {edges.length} edges
          </span>
        </div>

        {/* Legend (shown when algorithm is running) */}
        <AnimatePresence>
          {!isIdle && !isEmpty && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute right-4 bottom-4 left-4 flex justify-center"
            >
              <AlgorithmLegend algorithm={graphAlgorithm} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Interaction Hint */}
        <AnimatePresence>
          {isEmpty && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute right-4 bottom-4 left-4 flex justify-center"
            >
              <InteractionHint />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/**
 * Status overlay showing current state.
 */
interface StatusOverlayProps {
  stepCount: number;
  interactionMode: GraphInteractionMode;
  mstTotalWeight: number | null;
  mstEdgeCount: number | null;
  isDisconnected: boolean;
  topologicalOrder: string[] | null;
  hasCycle: boolean;
  nodes: Record<string, GraphNode>;
  isComplete: boolean;
}

function StatusOverlay({
  stepCount,
  interactionMode,
  mstTotalWeight,
  mstEdgeCount,
  isDisconnected,
  topologicalOrder,
  hasCycle,
  nodes,
  isComplete,
}: StatusOverlayProps) {
  return (
    <div className="absolute top-4 left-4 flex flex-col gap-2">
      <div className="flex items-center gap-3">
        {stepCount > 0 && <span className="text-muted text-xs">Steps: {stepCount}</span>}
      </div>

      {/* MST Result */}
      <AnimatePresence>
        {isComplete && mstTotalWeight !== null && (
          <motion.div
            key="mst-result"
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={SPRING_PRESETS.snappy}
            className="border border-emerald-500/30 bg-emerald-500/10 rounded-lg px-3 py-2 text-xs font-medium text-emerald-400"
          >
            <span className="font-bold">MST Complete</span>
            <span className="text-emerald-300 ml-2">
              Weight: {mstTotalWeight} · Edges: {mstEdgeCount}
            </span>
          </motion.div>
        )}

        {isComplete && isDisconnected && (
          <motion.div
            key="disconnected-warning"
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={SPRING_PRESETS.snappy}
            className="border border-rose-500/30 bg-rose-500/10 rounded-lg px-3 py-2 text-xs font-medium text-rose-400"
          >
            <span className="font-bold">Graph Not Connected</span>
            <span className="text-rose-300 ml-2">Cannot form MST</span>
          </motion.div>
        )}

        {/* Topological Sort Result */}
        {isComplete && topologicalOrder !== null && (
          <motion.div
            key="topo-result"
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={SPRING_PRESETS.snappy}
            className="border border-emerald-500/30 bg-emerald-500/10 rounded-lg px-3 py-2 text-xs font-medium text-emerald-400"
          >
            <span className="font-bold">Topological Order</span>
            <span className="text-emerald-300 ml-2">
              {topologicalOrder.map((id) => nodes[id]?.label ?? id).join(" → ")}
            </span>
          </motion.div>
        )}

        {/* Cycle Detected */}
        {isComplete && hasCycle && (
          <motion.div
            key="cycle-warning"
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={SPRING_PRESETS.snappy}
            className="border border-rose-500/30 bg-rose-500/10 rounded-lg px-3 py-2 text-xs font-medium text-rose-400"
          >
            <span className="font-bold">Cycle Detected</span>
            <span className="text-rose-300 ml-2">Graph is not a DAG</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interaction mode indicator */}
      <AnimatePresence>
        {interactionMode.type !== "idle" && (
          <motion.div
            key="interaction-indicator"
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={SPRING_PRESETS.snappy}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium",
              interactionMode.type === "drawing-edge" &&
                "border border-cyan-500/30 bg-cyan-500/10 text-cyan-400",
              interactionMode.type === "dragging-node" &&
                "border border-amber-500/30 bg-amber-500/10 text-amber-400"
            )}
          >
            {interactionMode.type === "drawing-edge" && (
              <>
                <GitBranch className="h-3.5 w-3.5" />
                Drawing edge...
              </>
            )}
            {interactionMode.type === "dragging-node" && (
              <>
                <MousePointer2 className="h-3.5 w-3.5" />
                Moving node...
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Hint displayed when the graph is empty.
 */
function EmptyGraphHint() {
  return (
    <div className="flex h-full items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <div className="text-muted mb-2 text-4xl">🕸️</div>
        <p className="text-muted text-sm">Graph is empty</p>
        <p className="text-muted/60 mt-1 text-xs">Double-click to add nodes</p>
      </motion.div>
    </div>
  );
}

/**
 * Interaction hint for new users.
 */
function InteractionHint() {
  return (
    <motion.div
      className={cn(
        "rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm",
        "px-3 py-2 md:px-4 md:py-3"
      )}
    >
      <div className="flex flex-col items-start gap-2 text-xs md:flex-row md:items-center md:gap-6">
        <div className="flex items-center gap-2">
          <Circle className="h-3 w-3 text-violet-400" />
          <span className="text-muted">Double-click to add</span>
        </div>
        <div className="flex items-center gap-2">
          <GitBranch className="h-3 w-3 text-cyan-400" />
          <span className="text-muted">Shift+drag to connect</span>
        </div>
        <div className="flex items-center gap-2">
          <MousePointer2 className="h-3 w-3 text-amber-400" />
          <span className="text-muted">Drag to move</span>
        </div>
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
        "bg-surface-elevated border-border text-primary flex shrink-0 items-center gap-1.5 rounded-md border px-2 py-1.5 text-xs font-medium md:px-3",
        "focus-visible:ring-violet-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        disabled && "cursor-not-allowed"
      )}
      aria-label={label}
    >
      {icon}
      <span className="hidden md:inline">{label}</span>
    </motion.button>
  );
}

/**
 * Play/Pause toggle button.
 */
interface PlayPauseButtonProps {
  isPlaying: boolean;
  hasStarted: boolean;
  onClick: () => void;
  disabled?: boolean;
}

function PlayPauseButton({ isPlaying, hasStarted, onClick, disabled }: PlayPauseButtonProps) {
  const interactionProps = disabled
    ? {}
    : { whileHover: buttonInteraction.hover, whileTap: buttonInteraction.tap };

  const label = isPlaying ? "Pause" : hasStarted ? "Resume" : "Play";

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      {...interactionProps}
      animate={{ opacity: disabled ? 0.5 : 1 }}
      transition={SPRING_PRESETS.snappy}
      className={cn(
        "bg-violet-500 flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-white md:px-3",
        "focus-visible:ring-violet-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        disabled && "cursor-not-allowed"
      )}
      aria-label={label}
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
      <span className="hidden md:inline">{label}</span>
    </motion.button>
  );
}

/**
 * Action button for graph operations.
 */
interface ActionButtonProps {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: "secondary" | "active" | "destructive";
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
        "flex shrink-0 items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors md:gap-1.5 md:px-2.5",
        "focus-visible:ring-violet-500 focus-visible:outline-none focus-visible:ring-2",
        variant === "secondary" && "bg-slate-500/10 text-slate-400 hover:bg-slate-500/20",
        variant === "active" && "bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20",
        variant === "destructive" && "bg-rose-500/10 text-rose-400 hover:bg-rose-500/20",
        disabled && "cursor-not-allowed"
      )}
      aria-label={label}
    >
      {icon}
      <span className="hidden md:inline">{label}</span>
    </motion.button>
  );
}

/**
 * Legend item configuration.
 */
interface LegendItem {
  color: string;
  label: string;
  type: "node" | "edge";
}

/**
 * Legend configuration for each algorithm.
 */
const ALGORITHM_LEGENDS: Record<GraphAlgorithmType, LegendItem[]> = {
  prim: [
    { color: "bg-rose-400", label: "Start", type: "node" },
    { color: "bg-cyan-400", label: "Visiting", type: "node" },
    { color: "bg-emerald-400", label: "In MST", type: "node" },
    { color: "bg-amber-400", label: "Considering", type: "edge" },
    { color: "bg-emerald-400", label: "MST Edge", type: "edge" },
    { color: "bg-rose-400/40", label: "Rejected", type: "edge" },
  ],
  kruskal: [
    { color: "bg-fuchsia-400", label: "Finding Set", type: "node" },
    { color: "bg-emerald-400", label: "In MST", type: "node" },
    { color: "bg-amber-400", label: "Considering", type: "edge" },
    { color: "bg-emerald-400", label: "MST Edge", type: "edge" },
    { color: "bg-rose-400/40", label: "Same Set", type: "edge" },
  ],
  kahn: [
    { color: "bg-orange-400", label: "Queued (0°)", type: "node" },
    { color: "bg-sky-400", label: "Processing", type: "node" },
    { color: "bg-emerald-400", label: "In Order", type: "node" },
    { color: "bg-cyan-400", label: "Processing", type: "edge" },
    { color: "bg-slate-400/30", label: "Processed", type: "edge" },
  ],
};

/**
 * Algorithm legend component.
 * Shows what the colors mean during algorithm execution.
 */
interface AlgorithmLegendProps {
  algorithm: GraphAlgorithmType;
}

function AlgorithmLegend({ algorithm }: AlgorithmLegendProps) {
  const items = ALGORITHM_LEGENDS[algorithm];

  const nodeItems = items.filter((item) => item.type === "node");
  const edgeItems = items.filter((item) => item.type === "edge");

  return (
    <motion.div
      className={cn("rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm", "px-4 py-3")}
    >
      <div className="flex items-center gap-6 text-xs">
        {/* Node legends */}
        <div className="flex items-center gap-4">
          <span className="text-muted font-medium">Nodes:</span>
          {nodeItems.map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <span className={cn("h-3 w-3 rounded-full", item.color)} />
              <span className="text-muted">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="bg-white/10 h-4 w-px" />

        {/* Edge legends */}
        <div className="flex items-center gap-4">
          <span className="text-muted font-medium">Edges:</span>
          {edgeItems.map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <span className={cn("h-0.5 w-4 rounded-full", item.color)} />
              <span className="text-muted">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
