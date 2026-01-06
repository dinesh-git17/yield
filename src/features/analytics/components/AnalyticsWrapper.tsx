"use client";

import { type ReactNode, Suspense } from "react";

import { AnalyticsProvider } from "@/lib/analytics";

import { AnalyticsListener } from "./AnalyticsListener";
import { AnalyticsSubscriber } from "./AnalyticsSubscriber";
import { ConsentBanner } from "./ConsentBanner";
import { GoogleTagManager } from "./GoogleTagManager";

// =============================================================================
// Component
// =============================================================================

export interface AnalyticsWrapperProps {
  children: ReactNode;
}

/**
 * Analytics Wrapper Component
 *
 * Client-side wrapper that provides:
 * - Google Tag Manager script injection
 * - Analytics context provider
 * - SPA route tracking for page views
 * - Zustand store subscriber for automatic event tracking
 * - Consent banner UI
 *
 * This component should wrap the entire application in the root layout.
 */
export function AnalyticsWrapper({ children }: AnalyticsWrapperProps) {
  return (
    <AnalyticsProvider>
      <GoogleTagManager />
      {/* Suspense required for useSearchParams in AnalyticsListener */}
      <Suspense fallback={null}>
        <AnalyticsListener />
      </Suspense>
      <AnalyticsSubscriber />
      {children}
      <ConsentBanner />
    </AnalyticsProvider>
  );
}
