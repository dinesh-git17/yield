"use client";

import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { motion } from "framer-motion";
import { Dices, Minus, Plus, Search, Trash2 } from "lucide-react";
import { memo, useCallback, useState } from "react";
import { SPRING_PRESETS } from "@/lib/motion";
import {
  type PlaybackSpeedMultiplier,
  TREE_CONFIG,
  type TreeAlgorithmType,
  useYieldStore,
} from "@/lib/store";
import { cn } from "@/lib/utils";

export interface TreeControlBarProps {
  className?: string;
  /** Callback when an operation should be executed */
  onExecute?: (algorithm: TreeAlgorithmType, value?: number) => void;
  /** Callback when tree should be reset */
  onReset?: () => void;
  /** Callback when balanced tree should be generated */
  onGenerateBalanced?: () => void;
  /** Current playback status */
  status?: "idle" | "playing" | "paused" | "complete";
}

/**
 * Tree algorithms grouped by category.
 */
const OPERATIONS: { value: TreeAlgorithmType; label: string; icon: React.ReactNode }[] = [
  { value: "insert", label: "Insert", icon: <Plus className="h-3.5 w-3.5" /> },
  { value: "search", label: "Search", icon: <Search className="h-3.5 w-3.5" /> },
  { value: "delete", label: "Delete", icon: <Minus className="h-3.5 w-3.5" /> },
];

const TRAVERSALS: { value: TreeAlgorithmType; label: string; shortLabel: string }[] = [
  { value: "inorder", label: "In-Order", shortLabel: "In" },
  { value: "preorder", label: "Pre-Order", shortLabel: "Pre" },
  { value: "postorder", label: "Post-Order", shortLabel: "Post" },
  { value: "bfs", label: "Level-Order", shortLabel: "BFS" },
];

const SPEED_OPTIONS: { value: PlaybackSpeedMultiplier; label: string }[] = [
  { value: 0.5, label: "0.5x" },
  { value: 1, label: "1x" },
  { value: 2, label: "2x" },
  { value: 4, label: "4x" },
];

export const TreeControlBar = memo(function TreeControlBar({
  className,
  onExecute,
  onReset,
  onGenerateBalanced,
  status = "idle",
}: TreeControlBarProps) {
  const [inputValue, setInputValue] = useState("");
  const [selectedOperation, setSelectedOperation] = useState<TreeAlgorithmType>("insert");

  const treeAlgorithm = useYieldStore((state) => state.treeAlgorithm);
  const setTreeAlgorithm = useYieldStore((state) => state.setTreeAlgorithm);
  const playbackSpeed = useYieldStore((state) => state.playbackSpeed);
  const setPlaybackSpeed = useYieldStore((state) => state.setPlaybackSpeed);
  const treeState = useYieldStore((state) => state.treeState);

  const nodeCount = Object.keys(treeState.nodes).length;
  const isMaxNodes = nodeCount >= TREE_CONFIG.MAX_NODES;
  const isOperating = status === "playing";
  const isDisabled = isOperating || status === "complete";

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow digits
    if (value === "" || /^\d+$/.test(value)) {
      setInputValue(value);
    }
  }, []);

  const handleOperationExecute = useCallback(
    (operation: TreeAlgorithmType) => {
      const numValue = Number.parseInt(inputValue, 10);

      // Check value bounds
      if (numValue < TREE_CONFIG.VALUE_MIN || numValue > TREE_CONFIG.VALUE_MAX) {
        return;
      }

      // Check max nodes for insert
      if (operation === "insert" && isMaxNodes) {
        return;
      }

      setSelectedOperation(operation);
      setTreeAlgorithm(operation);
      onExecute?.(operation, numValue);
      setInputValue(""); // Clear after execution
    },
    [inputValue, isMaxNodes, setTreeAlgorithm, onExecute]
  );

  const handleTraversalExecute = useCallback(
    (traversal: TreeAlgorithmType) => {
      setTreeAlgorithm(traversal);
      onExecute?.(traversal);
    },
    [setTreeAlgorithm, onExecute]
  );

  const handleSpeedChange = useCallback(
    (value: string) => {
      if (value) {
        setPlaybackSpeed(Number(value) as PlaybackSpeedMultiplier);
      }
    },
    [setPlaybackSpeed]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && inputValue) {
        handleOperationExecute(selectedOperation);
      }
    },
    [inputValue, selectedOperation, handleOperationExecute]
  );

  const isValidInput =
    inputValue !== "" &&
    Number.parseInt(inputValue, 10) >= TREE_CONFIG.VALUE_MIN &&
    Number.parseInt(inputValue, 10) <= TREE_CONFIG.VALUE_MAX;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={SPRING_PRESETS.entrance}
      className={cn(
        "bg-surface-elevated/95 border-border flex items-center gap-3 rounded-lg border px-3 py-2 shadow-lg backdrop-blur-sm",
        className
      )}
    >
      {/* Value Input Section */}
      <ControlSection label="Value">
        <div className="flex items-center gap-1.5">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={`${TREE_CONFIG.VALUE_MIN}-${TREE_CONFIG.VALUE_MAX}`}
            disabled={isDisabled}
            className={cn(
              "bg-surface border-border text-primary h-8 w-16 rounded-md border px-2 text-center text-sm tabular-nums",
              "placeholder:text-muted/50",
              "focus-visible:ring-emerald-500 focus-visible:outline-none focus-visible:ring-2",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
            aria-label="Value to insert, search, or delete"
          />
        </div>
      </ControlSection>

      <Divider />

      {/* Operations Section */}
      <ControlSection label="Operations">
        <div className="flex items-center gap-1">
          {OPERATIONS.map((op) => {
            const isInsertDisabled = op.value === "insert" && isMaxNodes;
            const needsInput = ["insert", "search", "delete"].includes(op.value);
            const buttonDisabled = isDisabled || isInsertDisabled || (needsInput && !isValidInput);

            return (
              <OperationButton
                key={op.value}
                label={op.label}
                icon={op.icon}
                isActive={treeAlgorithm === op.value && isOperating}
                disabled={buttonDisabled}
                onClick={() => handleOperationExecute(op.value)}
              />
            );
          })}
        </div>
      </ControlSection>

      <Divider />

      {/* Traversals Section */}
      <ControlSection label="Traversals">
        <ToggleGroup.Root
          type="single"
          value={TRAVERSALS.some((t) => t.value === treeAlgorithm) ? treeAlgorithm : ""}
          onValueChange={(value) => value && handleTraversalExecute(value as TreeAlgorithmType)}
          disabled={isDisabled || nodeCount === 0}
          className="bg-surface flex rounded-lg p-0.5"
        >
          {TRAVERSALS.map((traversal) => (
            <ToggleGroup.Item
              key={traversal.value}
              value={traversal.value}
              disabled={isDisabled || nodeCount === 0}
              className={cn(
                "text-muted relative rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
                "focus-visible:ring-emerald-500 focus-visible:outline-none focus-visible:ring-2",
                "disabled:cursor-not-allowed disabled:opacity-50",
                "data-[state=on]:text-primary"
              )}
              aria-label={`Run ${traversal.label} traversal`}
            >
              {treeAlgorithm === traversal.value && (
                <motion.span
                  layoutId="tree-traversal-indicator"
                  className="bg-surface-elevated border-border absolute inset-0 rounded-md border shadow-sm"
                  transition={SPRING_PRESETS.snappy}
                />
              )}
              <span className="relative z-10">{traversal.shortLabel}</span>
            </ToggleGroup.Item>
          ))}
        </ToggleGroup.Root>
      </ControlSection>

      <Divider />

      {/* Speed Control */}
      <ControlSection label="Speed">
        <ToggleGroup.Root
          type="single"
          value={String(playbackSpeed)}
          onValueChange={handleSpeedChange}
          className="bg-surface flex rounded-lg p-0.5"
        >
          {SPEED_OPTIONS.map((option) => (
            <ToggleGroup.Item
              key={option.value}
              value={String(option.value)}
              className={cn(
                "text-muted relative rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
                "focus-visible:ring-emerald-500 focus-visible:outline-none focus-visible:ring-2",
                "data-[state=on]:text-primary"
              )}
              aria-label={`Set speed to ${option.label}`}
            >
              {playbackSpeed === option.value && (
                <motion.span
                  layoutId="tree-speed-indicator"
                  className="bg-surface-elevated border-border absolute inset-0 rounded-md border shadow-sm"
                  transition={SPRING_PRESETS.snappy}
                />
              )}
              <span className="relative z-10">{option.label}</span>
            </ToggleGroup.Item>
          ))}
        </ToggleGroup.Root>
      </ControlSection>

      <Divider />

      {/* Actions Section */}
      <ControlSection label="Actions">
        <div className="flex items-center gap-1">
          <ActionButton
            label="Random"
            icon={<Dices className="h-3.5 w-3.5" />}
            onClick={onGenerateBalanced ?? (() => {})}
            disabled={isOperating}
            variant="secondary"
          />
          <ActionButton
            label="Clear"
            icon={<Trash2 className="h-3.5 w-3.5" />}
            onClick={onReset ?? (() => {})}
            disabled={isOperating || nodeCount === 0}
            variant="destructive"
          />
        </div>
      </ControlSection>
    </motion.div>
  );
});

interface ControlSectionProps {
  label: string;
  children: React.ReactNode;
}

function ControlSection({ label, children }: ControlSectionProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-muted text-[10px] font-medium uppercase tracking-wider">{label}</span>
      {children}
    </div>
  );
}

function Divider() {
  return <div className="bg-border h-8 w-px" />;
}

interface OperationButtonProps {
  label: string;
  icon: React.ReactNode;
  isActive?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

const OperationButton = memo(function OperationButton({
  label,
  icon,
  isActive,
  disabled,
  onClick,
}: OperationButtonProps) {
  const hoverAnimation = disabled ? {} : { whileHover: { scale: 1.02 } };
  const tapAnimation = disabled ? {} : { whileTap: { scale: 0.98 } };

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      {...hoverAnimation}
      {...tapAnimation}
      className={cn(
        "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
        "focus-visible:ring-emerald-500 focus-visible:outline-none focus-visible:ring-2",
        isActive
          ? "bg-emerald-500/20 text-emerald-400"
          : "bg-surface hover:bg-surface-elevated text-primary border-border border",
        disabled && "cursor-not-allowed opacity-50"
      )}
      aria-label={label}
    >
      {icon}
      {label}
    </motion.button>
  );
});

interface ActionButtonProps {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: "secondary" | "destructive";
}

const ActionButton = memo(function ActionButton({
  label,
  icon,
  onClick,
  disabled,
  variant = "secondary",
}: ActionButtonProps) {
  const hoverAnimation = disabled ? {} : { whileHover: { scale: 1.02 } };
  const tapAnimation = disabled ? {} : { whileTap: { scale: 0.98 } };

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      {...hoverAnimation}
      {...tapAnimation}
      className={cn(
        "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
        "focus-visible:ring-emerald-500 focus-visible:outline-none focus-visible:ring-2",
        variant === "secondary" && "bg-violet-500/10 text-violet-400 hover:bg-violet-500/20",
        variant === "destructive" && "bg-rose-500/10 text-rose-400 hover:bg-rose-500/20",
        disabled && "cursor-not-allowed opacity-50"
      )}
      aria-label={label}
    >
      {icon}
      {label}
    </motion.button>
  );
});
