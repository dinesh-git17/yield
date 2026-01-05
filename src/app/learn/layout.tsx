"use client";

import { motion } from "framer-motion";
import { ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { ReactNode } from "react";
import { buttonInteraction, panelVariants } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface LearnLayoutProps {
  children: ReactNode;
}

/**
 * Dedicated layout for the Learn (Textbook) pages.
 * Optimized for reading with a navigation header and prose container.
 */
export default function LearnLayout({ children }: LearnLayoutProps) {
  const params = useParams<{ mode: string; algorithm: string }>();

  // Build back link with state preservation
  const backHref =
    params.mode && params.algorithm ? `/?mode=${params.mode}&algorithm=${params.algorithm}` : "/";

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Navigation Header */}
      <motion.header
        variants={panelVariants.slideFromLeft}
        initial="hidden"
        animate="visible"
        className={cn(
          "sticky top-0 z-50",
          "border-b border-border bg-background/80 backdrop-blur-xl",
          "px-6 py-4"
        )}
      >
        <nav className="mx-auto flex max-w-4xl items-center justify-between">
          <motion.div whileHover={buttonInteraction.hover} whileTap={buttonInteraction.tap}>
            <Link
              href={backHref}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg px-3 py-2",
                "text-muted hover:text-primary transition-colors",
                "hover:bg-surface"
              )}
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm font-medium">Back to Studio</span>
            </Link>
          </motion.div>

          <div className="flex items-center gap-2 text-muted">
            <BookOpen className="h-4 w-4" />
            <span className="text-sm font-medium">Learn</span>
          </div>
        </nav>
      </motion.header>

      {/* Main Content Area */}
      <main className="px-6 py-12">
        <motion.div
          variants={panelVariants.fadeScale}
          initial="hidden"
          animate="visible"
          className="prose-container mx-auto max-w-4xl"
        >
          {children}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-muted text-sm">
            Part of{" "}
            <Link href="/" className="text-accent hover:underline">
              Yield
            </Link>{" "}
            — Algorithm Visualizer
          </p>
        </div>
      </footer>
    </div>
  );
}
