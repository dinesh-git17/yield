/**
 * Sentry Client-side Configuration
 *
 * Initializes Sentry error tracking for the browser runtime.
 * This config is loaded via instrumentation when the app starts.
 */

import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

// Only initialize if DSN is configured
if (dsn) {
  Sentry.init({
    dsn,

    // Performance Monitoring
    // Capture 10% of transactions in production, 100% in development
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

    // Session Replay for debugging user interactions
    // Capture 10% of sessions, 100% on error
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    // Only send errors in production
    enabled: process.env.NODE_ENV === "production",

    // Environment tagging
    environment: process.env.NODE_ENV,

    // Filter out noisy errors
    ignoreErrors: [
      // Browser extensions
      /^chrome-extension:\/\//,
      /^moz-extension:\/\//,
      // Network errors that are often transient
      "Network request failed",
      "Failed to fetch",
      "Load failed",
      // User aborted requests
      "AbortError",
      // Resize observer loop limit (benign)
      "ResizeObserver loop limit exceeded",
      "ResizeObserver loop completed with undelivered notifications",
    ],

    integrations: [
      Sentry.replayIntegration({
        // Mask all text and block all media for privacy
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
  });
}
