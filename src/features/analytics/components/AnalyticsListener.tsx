"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

import { useAnalytics } from "@/lib/analytics";

// =============================================================================
// Component
// =============================================================================

/**
 * Analytics Listener
 *
 * Listens to Next.js App Router navigation events and tracks page views.
 * Next.js App Router uses soft navigation (no full page reloads), so we need
 * to manually track page views when the pathname changes.
 *
 * Also handles:
 * - UTM parameter capture on landing (handled by analytics service init)
 * - Referrer tracking
 */
export function AnalyticsListener() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isInitialized, trackPageView } = useAnalytics();

  // Track previous pathname to avoid duplicate events
  const previousPathnameRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isInitialized) return;
    if (!pathname) return;

    // Skip if pathname hasn't changed (prevents double-tracking on initial load)
    if (pathname === previousPathnameRef.current) return;

    // Track page view
    trackPageView(pathname, document.title);

    // Update previous pathname
    previousPathnameRef.current = pathname;
  }, [isInitialized, pathname, trackPageView]);

  // Track search param changes (for filtered views, etc.)
  // This is separate from pathname tracking to avoid noise
  useEffect(() => {
    // Only log in development for debugging
    if (process.env.NODE_ENV === "development" && searchParams) {
      const params = searchParams.toString();
      if (params) {
        console.log("[Analytics] Search params:", params);
      }
    }
  }, [searchParams]);

  // This component renders nothing
  return null;
}
