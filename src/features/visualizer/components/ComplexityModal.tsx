"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CircleX, Clock, HardDrive } from "lucide-react";
import { memo, useCallback, useEffect } from "react";
import { getAlgorithmMetadata } from "@/features/algorithms";
import { buttonInteraction } from "@/lib/motion";
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
  const sortingAlgorithm = useYieldStore((state) => state.sortingAlgorithm);
  const metadata = getAlgorithmMetadata(sortingAlgorithm);

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
                {metadata.label}
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
              <p className="text-primary/80 text-sm leading-relaxed">{metadata.description}</p>

              {/* Complexity Cards */}
              <div className="grid grid-cols-2 gap-4">
                <ComplexityCard
                  icon={<Clock className="h-4 w-4" />}
                  label="Time Complexity"
                  value={metadata.complexity}
                  description={getTimeDescription(metadata.complexity)}
                  variant={getComplexityVariant(metadata.complexity)}
                />
                <ComplexityCard
                  icon={<HardDrive className="h-4 w-4" />}
                  label="Space Complexity"
                  value={metadata.spaceComplexity}
                  description={getSpaceDescription(metadata.spaceComplexity)}
                  variant={getComplexityVariant(metadata.spaceComplexity)}
                />
              </div>

              {/* Comparison hint */}
              <div className="rounded-lg border border-white/5 bg-white/5 p-3">
                <p className="text-muted text-xs leading-relaxed">
                  {getComparisonHint(sortingAlgorithm)}
                </p>
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

function getTimeDescription(complexity: string): string {
  if (complexity === "O(n²)") {
    return "Performance degrades quickly as input size grows. Suitable for small datasets.";
  }
  if (complexity.includes("n log n")) {
    return "Efficient for large datasets. Scales well with input size.";
  }
  return "Execution time varies with input.";
}

function getSpaceDescription(complexity: string): string {
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

function getComparisonHint(algorithm: string): string {
  switch (algorithm) {
    case "bubble":
      return "Bubble Sort is simple to understand but inefficient. Consider Quick Sort or Merge Sort for larger datasets.";
    case "selection":
      return "Selection Sort minimizes swaps but still has O(n²) comparisons. Better than Bubble Sort for write-heavy storage.";
    case "quick":
      return "Quick Sort is often the fastest in practice due to cache efficiency, despite O(n²) worst-case.";
    case "merge":
      return "Merge Sort guarantees O(n log n) but requires extra memory. Preferred when stability matters.";
    default:
      return "Compare different algorithms to understand their trade-offs.";
  }
}

export const ComplexityModal = memo(ComplexityModalComponent);
