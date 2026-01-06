"use client";

import * as Sentry from "@sentry/nextjs";
import { motion } from "framer-motion";
import { AlertCircle, Home, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { buttonInteraction, SPRING_PRESETS } from "@/lib/motion";
import { cn } from "@/lib/utils";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="bg-background flex h-dvh w-full flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={SPRING_PRESETS.entrance}
        className="flex flex-col items-center text-center"
      >
        {/* Decorative Icon - Amber/Red tint for errors */}
        <div className="bg-surface-elevated border-border mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border shadow-sm">
          <AlertCircle className="text-amber-500/80 h-10 w-10" />
        </div>

        {/* Text Content */}
        <h1 className="text-primary mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
          System malfunction
        </h1>
        <p className="text-muted max-w-[450px] text-base leading-relaxed">
          The algorithm encountered an unexpected variable. We've logged the issue and you can try
          attempting the operation again.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {/* Primary: Try Again */}
          <motion.button
            type="button"
            onClick={reset}
            whileHover={buttonInteraction.hover}
            whileTap={buttonInteraction.tap}
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors",
              "bg-primary text-background hover:bg-primary/90 shadow-sm",
              "dark:bg-white dark:text-black dark:hover:bg-white/90"
            )}
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </motion.button>

          {/* Secondary: Go Home */}
          <motion.div whileHover={buttonInteraction.hover} whileTap={buttonInteraction.tap}>
            <Link
              href="/"
              className={cn(
                "inline-flex w-full items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors",
                "bg-surface border-border border text-primary hover:bg-surface-elevated"
              )}
            >
              <Home className="h-4 w-4" />
              Return Home
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
