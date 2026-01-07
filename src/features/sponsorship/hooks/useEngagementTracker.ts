"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEYS = {
  COMPLETION_COUNT: "yield_viz_completions",
  BANNER_DISMISSED: "yield_support_banner_dismissed",
} as const;

const BANNER_THRESHOLD = 5;

/**
 * Hook for tracking visualization completions and managing banner visibility.
 * Uses sessionStorage so counts reset on new browser sessions.
 */
export function useEngagementTracker() {
  const [completionCount, setCompletionCount] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from sessionStorage on mount
  useEffect(() => {
    const storedCount = sessionStorage.getItem(STORAGE_KEYS.COMPLETION_COUNT);
    const storedDismissed = sessionStorage.getItem(STORAGE_KEYS.BANNER_DISMISSED);

    if (storedCount !== null) {
      const parsed = Number.parseInt(storedCount, 10);
      if (!Number.isNaN(parsed)) {
        setCompletionCount(parsed);
      }
    }

    if (storedDismissed === "true") {
      setIsDismissed(true);
    }

    setIsHydrated(true);
  }, []);

  const incrementCompletion = useCallback(() => {
    setCompletionCount((prev) => {
      const next = prev + 1;
      sessionStorage.setItem(STORAGE_KEYS.COMPLETION_COUNT, String(next));
      return next;
    });
  }, []);

  const dismissBanner = useCallback(() => {
    setIsDismissed(true);
    sessionStorage.setItem(STORAGE_KEYS.BANNER_DISMISSED, "true");
  }, []);

  const shouldShowBanner = isHydrated && completionCount >= BANNER_THRESHOLD && !isDismissed;

  return {
    completionCount,
    incrementCompletion,
    shouldShowBanner,
    dismissBanner,
    isHydrated,
  };
}
