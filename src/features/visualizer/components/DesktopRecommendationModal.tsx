"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Monitor, X } from "lucide-react";
import { memo, useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const DISPLAY_DURATION_MS = 3000;

/**
 * Delay before showing modal to wait for splash screen completion.
 * Splash screen: 2500ms display + 500ms reveal delay + 700ms CSS fade = 3700ms
 * Adding buffer to ensure CSS transition completes before our animation starts.
 */
const SPLASH_SCREEN_DELAY_MS = 3900;

function DesktopRecommendationModalComponent() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    if (!isMobile) return;

    // Wait for splash screen to complete before showing
    const showTimer = setTimeout(() => {
      setIsOpen(true);
    }, SPLASH_SCREEN_DELAY_MS);

    return () => clearTimeout(showTimer);
  }, []);

  // Auto-dismiss after display duration
  useEffect(() => {
    if (!isOpen) return;

    const dismissTimer = setTimeout(() => {
      setIsOpen(false);
    }, DISPLAY_DURATION_MS);

    return () => clearTimeout(dismissTimer);
  }, [isOpen]);

  const handleDismiss = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          key="desktop-recommendation-modal"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-6 left-4 right-4 z-[60] md:hidden"
        >
          <div
            className={cn(
              "flex items-start gap-3 rounded-xl p-4 shadow-xl",
              "border border-white/10 bg-white/10 backdrop-blur-xl",
              "dark:border-white/5 dark:bg-black/40"
            )}
          >
            <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
              <Monitor className="h-5 w-5" />
            </div>

            <div className="flex-1 space-y-1">
              <h3 className="text-primary text-sm font-semibold">Best on Desktop</h3>
              <p className="text-muted text-xs leading-relaxed">
                For an immersive view of the algorithms, try a larger screen.
              </p>
            </div>

            <motion.button
              type="button"
              onClick={handleDismiss}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-muted hover:text-primary p-1 transition-colors"
              aria-label="Dismiss recommendation"
            >
              <X className="h-4 w-4" />
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export const DesktopRecommendationModal = memo(DesktopRecommendationModalComponent);
