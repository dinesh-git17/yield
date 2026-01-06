"use client";

/**
 * Analytics Context & Hook
 *
 * Provides a React-friendly API for analytics tracking.
 * Handles initialization and exposes tracking methods.
 */

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { analytics } from "./service";
import type { AnalyticsEvent, ConsentState } from "./types";

// =============================================================================
// Context Types
// =============================================================================

interface AnalyticsContextValue {
  /** Whether analytics has been initialized */
  isInitialized: boolean;

  /** Current consent state */
  consent: ConsentState;

  /** Whether user has made a consent decision */
  hasConsentDecision: boolean;

  /** Update consent preferences */
  updateConsent: (consent: Partial<Omit<ConsentState, "essential">>) => void;

  /** Track an analytics event */
  trackEvent: (event: AnalyticsEvent) => void;

  /** Track a page view */
  trackPageView: (path: string, title?: string) => void;
}

// =============================================================================
// Context
// =============================================================================

const AnalyticsContext = createContext<AnalyticsContextValue | null>(null);

// =============================================================================
// Provider Component
// =============================================================================

export interface AnalyticsProviderProps {
  children: ReactNode;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [consent, setConsent] = useState<ConsentState>(analytics.getConsent());

  // Initialize analytics on mount
  useEffect(() => {
    analytics.init();
    setConsent(analytics.getConsent());
    setIsInitialized(true);
  }, []);

  // Update consent handler
  const updateConsent = useCallback((newConsent: Partial<Omit<ConsentState, "essential">>) => {
    analytics.updateConsent(newConsent);
    setConsent(analytics.getConsent());
  }, []);

  // Track event handler
  const trackEvent = useCallback((event: AnalyticsEvent) => {
    analytics.trackEvent(event);
  }, []);

  // Track page view handler
  const trackPageView = useCallback((path: string, title?: string) => {
    analytics.trackPageView({
      path,
      title,
      referrer: analytics.getInitialReferrer() ?? undefined,
    });
  }, []);

  const value = useMemo<AnalyticsContextValue>(
    () => ({
      isInitialized,
      consent,
      hasConsentDecision: consent.timestamp !== null,
      updateConsent,
      trackEvent,
      trackPageView,
    }),
    [isInitialized, consent, updateConsent, trackEvent, trackPageView]
  );

  return <AnalyticsContext.Provider value={value}>{children}</AnalyticsContext.Provider>;
}

// =============================================================================
// Hook
// =============================================================================

/**
 * Hook to access analytics functionality.
 * Must be used within an AnalyticsProvider.
 */
export function useAnalytics(): AnalyticsContextValue {
  const context = useContext(AnalyticsContext);

  if (!context) {
    throw new Error("useAnalytics must be used within an AnalyticsProvider");
  }

  return context;
}
