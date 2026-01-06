/**
 * Sentry Server-side Configuration
 *
 * Initializes Sentry error tracking for the Node.js server runtime.
 * This config is loaded via instrumentation when the server starts.
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

    // Only send errors in production
    enabled: process.env.NODE_ENV === "production",

    // Environment tagging
    environment: process.env.NODE_ENV,
  });
}
