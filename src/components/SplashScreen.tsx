"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { memo, useEffect, useState } from "react";
import { useOnboardingStore } from "@/features/onboarding";
import { useAnalytics } from "@/lib/analytics";
import { SPRING_PRESETS, useReducedMotion } from "@/lib/motion";

/**
 * Minimum time (ms) for the splash screen to display.
 * Ensures full brand impression even on fast networks.
 */
const MIN_DISPLAY_TIME_MS = 2500;

/**
 * Time (ms) to trigger the "Resolution" phase (sorted bars).
 */
const RESOLUTION_TRIGGER_MS = 1600;

/**
 * Delay (ms) before revealing main content after loader exits.
 */
const CONTENT_REVEAL_DELAY_MS = 500;

/**
 * Static bar configuration for the sorting animation.
 * Each bar has a stable id and its sorted height percentage.
 */
const BARS = [
  { id: "bar-0", sortedHeight: 20 },
  { id: "bar-1", sortedHeight: 40 },
  { id: "bar-2", sortedHeight: 60 },
  { id: "bar-3", sortedHeight: 80 },
  { id: "bar-4", sortedHeight: 100 },
] as const;

/**
 * Reduced motion: shorter display time since we skip chaos animation.
 */
const REDUCED_MOTION_DISPLAY_MS = 1200;

export interface SplashScreenProps {
  children: React.ReactNode;
}

/**
 * Application initialization wrapper with "The Sort Sync" brand loading experience.
 * Displays an animated sorting visualization before revealing the main app.
 *
 * Animation Timeline:
 * - Entropy (0s - 1.6s): Bars oscillate chaotically
 * - Resolution (1.6s - 2.0s): Bars snap to sorted ascending order
 * - Yield (2.0s - 2.5s): Loader fades out, app content reveals
 *
 * @accessibility Respects prefers-reduced-motion by showing static logo pulse instead.
 */
/**
 * Delay (ms) before starting the onboarding tour after content reveal.
 * Ensures sidebar elements are rendered and positioned before tour starts.
 */
const TOUR_START_DELAY_MS = 800;

export const SplashScreen = memo(function SplashScreen({ children }: SplashScreenProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const reducedMotion = useReducedMotion();
  const startTour = useOnboardingStore((state) => state.startTour);
  const { hasConsentDecision } = useAnalytics();

  useEffect(() => {
    const displayTime = reducedMotion ? REDUCED_MOTION_DISPLAY_MS : MIN_DISPLAY_TIME_MS;

    const timer = setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => {
        setShowContent(true);
        // Only auto-start tour if user already made consent decision (returning user)
        // First-time users will see the tour after interacting with consent banner
        if (hasConsentDecision) {
          setTimeout(startTour, TOUR_START_DELAY_MS);
        }
      }, CONTENT_REVEAL_DELAY_MS);
    }, displayTime);

    return () => clearTimeout(timer);
  }, [reducedMotion, startTour, hasConsentDecision]);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <Loader key="loader" reducedMotion={reducedMotion} />}
      </AnimatePresence>
      <div
        className={`transition-opacity duration-700 ${
          showContent ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!showContent}
      >
        {children}
      </div>
    </>
  );
});

interface LoaderProps {
  reducedMotion: boolean;
}

/**
 * The animated loader component displaying the "From Chaos to Order" visualization.
 */
const Loader = memo(function Loader({ reducedMotion }: LoaderProps) {
  const [isSorted, setIsSorted] = useState(false);

  useEffect(() => {
    if (reducedMotion) {
      // Skip chaos phase for reduced motion
      setIsSorted(true);
      return;
    }

    const timer = setTimeout(() => setIsSorted(true), RESOLUTION_TRIGGER_MS);
    return () => clearTimeout(timer);
  }, [reducedMotion]);

  return (
    <motion.div
      exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
      role="status"
      aria-label="Loading application"
    >
      {reducedMotion ? <ReducedMotionLoader /> : <SortSyncAnimation isSorted={isSorted} />}
    </motion.div>
  );
});

interface SortSyncAnimationProps {
  isSorted: boolean;
}

/**
 * The full "Sort Sync" animation with chaos-to-order bar visualization.
 */
const SortSyncAnimation = memo(function SortSyncAnimation({ isSorted }: SortSyncAnimationProps) {
  return (
    <>
      <div className="flex items-end gap-2 h-24 mb-8" aria-hidden="true">
        {BARS.map((bar, index) => (
          <motion.div
            key={bar.id}
            className="w-3 rounded-t-sm"
            initial={{
              height: "20%",
              backgroundColor: "var(--bar-idle)",
            }}
            animate={
              isSorted
                ? {
                    height: `${bar.sortedHeight}%`,
                    backgroundColor: "var(--accent)",
                  }
                : {
                    height: ["20%", "70%", "30%", "100%", "50%"],
                    backgroundColor: [
                      "var(--bar-idle)",
                      "var(--bar-swapping)",
                      "var(--bar-comparing)",
                      "var(--bar-swapping)",
                      "var(--bar-idle)",
                    ],
                  }
            }
            transition={
              isSorted
                ? { ...SPRING_PRESETS.snappy, delay: index * 0.05 }
                : {
                    duration: 1.2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "mirror",
                    delay: index * 0.1,
                  }
            }
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
      >
        <Image
          src="/logo/logo.png"
          alt="Yield"
          width={120}
          height={40}
          className="dark:invert opacity-80"
          priority
        />
      </motion.div>
    </>
  );
});

/**
 * Simplified loader for users with reduced motion preference.
 * Shows a gentle logo pulse instead of high-frequency bar animations.
 */
const ReducedMotionLoader = memo(function ReducedMotionLoader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: [0.6, 1, 0.6] }}
      transition={{
        duration: 1.5,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
    >
      <Image
        src="/logo/logo.png"
        alt="Yield"
        width={120}
        height={40}
        className="dark:invert"
        priority
      />
    </motion.div>
  );
});
