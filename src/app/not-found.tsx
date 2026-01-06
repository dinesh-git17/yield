"use client";

import { motion } from "framer-motion";
import { Home, Waypoints } from "lucide-react";
import Link from "next/link";
import { buttonInteraction, SPRING_PRESETS } from "@/lib/motion";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="bg-background flex h-dvh w-full flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={SPRING_PRESETS.entrance}
        className="flex flex-col items-center text-center"
      >
        {/* Decorative Icon */}
        <div className="bg-surface-elevated border-border mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border shadow-sm">
          <Waypoints className="text-muted h-10 w-10 opacity-50" />
        </div>

        {/* Text Content */}
        <h1 className="text-primary mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Path not found
        </h1>
        <p className="text-muted max-w-[450px] text-base leading-relaxed">
          We ran a search, but the page you are looking for couldn't be visited. It might have been
          moved or deleted.
        </p>

        {/* Action Button */}
        <div className="mt-8">
          <motion.div whileHover={buttonInteraction.hover} whileTap={buttonInteraction.tap}>
            <Link
              href="/"
              className={cn(
                "inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors",
                "bg-primary text-background hover:bg-primary/90 shadow-sm",
                "dark:bg-white dark:text-black dark:hover:bg-white/90"
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
