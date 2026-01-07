"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Heart, X } from "lucide-react";
import { memo, useEffect, useRef } from "react";

import { trackSupportBannerDismiss, trackSupportBannerImpression } from "@/lib/analytics/hooks";
import { buttonInteraction } from "@/lib/motion";
import { cn } from "@/lib/utils";

import { useSponsorship } from "../context/SponsorshipContext";

const BANNER_VARIANTS = {
  hidden: {
    opacity: 0,
    y: 100,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 30,
    },
  },
  exit: {
    opacity: 0,
    y: 50,
    scale: 0.95,
    transition: {
      duration: 0.2,
    },
  },
} as const;

function SupportBannerComponent() {
  const { shouldShowBanner, completionCount, dismissBanner, openModal } = useSponsorship();
  const hasTrackedImpression = useRef(false);

  // Track impression once when banner becomes visible
  useEffect(() => {
    if (shouldShowBanner && !hasTrackedImpression.current) {
      trackSupportBannerImpression(completionCount);
      hasTrackedImpression.current = true;
    }
  }, [shouldShowBanner, completionCount]);

  const handleDismiss = () => {
    trackSupportBannerDismiss(completionCount);
    dismissBanner();
  };

  const handleSupport = () => {
    openModal("banner");
  };

  return (
    <AnimatePresence>
      {shouldShowBanner && (
        <motion.div
          variants={BANNER_VARIANTS}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={cn(
            "fixed bottom-4 left-4 right-4 z-40",
            "md:left-auto md:right-6 md:max-w-md"
          )}
        >
          <div
            className={cn(
              "relative overflow-hidden rounded-xl",
              "border border-white/10 bg-white/10 backdrop-blur-xl",
              "dark:border-white/5 dark:bg-black/60",
              "shadow-2xl shadow-black/20"
            )}
          >
            {/* Dismiss button */}
            <motion.button
              type="button"
              onClick={handleDismiss}
              whileHover={buttonInteraction.hover}
              whileTap={buttonInteraction.tap}
              className={cn(
                "absolute right-2 top-2",
                "text-muted hover:text-primary rounded-full p-1.5 transition-colors"
              )}
              aria-label="Dismiss banner"
            >
              <X className="h-4 w-4" />
            </motion.button>

            <div className="p-4 pr-10">
              {/* Content */}
              <div className="flex items-start gap-3">
                <div className="bg-rose-500/20 shrink-0 rounded-lg p-2">
                  <Heart className="text-rose-400 h-5 w-5" />
                </div>
                <div className="min-w-0 space-y-2">
                  <p className="text-primary text-sm leading-relaxed">
                    Yield is free and ad-free. If it&apos;s helped you, consider supporting it for
                    the price of a coffee.
                  </p>

                  {/* CTA */}
                  <motion.button
                    type="button"
                    onClick={handleSupport}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5",
                      "bg-rose-500/20 text-rose-400 text-sm font-medium",
                      "hover:bg-rose-500/30 transition-colors"
                    )}
                  >
                    <Heart className="h-3.5 w-3.5" />
                    Support Yield
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export const SupportBanner = memo(SupportBannerComponent);
