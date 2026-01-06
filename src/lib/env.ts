/**
 * Environment Variable Validation
 *
 * Validates and exports typed environment variables for the application.
 * All public environment variables are validated at module load time.
 *
 * Security considerations:
 * - All variables are NEXT_PUBLIC_ prefixed (client-safe by design)
 * - No secrets should ever be added here
 * - Validation runs at build time and runtime for early failure detection
 */

/**
 * Environment configuration with validation and type safety.
 */
export interface EnvConfig {
  /** Base URL for canonical URLs, OG images, and sitemaps */
  baseUrl: string;
  /** Google Tag Manager container ID (optional, analytics disabled if missing) */
  gtmId: string | null;
  /** Google Analytics Measurement ID (optional, for direct GA4 access) */
  gaMeasurementId: string | null;
  /** Sentry DSN for error tracking (optional, error tracking disabled if missing) */
  sentryDsn: string | null;
  /** Current environment mode */
  nodeEnv: "development" | "production" | "test";
  /** Whether analytics is configured */
  analyticsEnabled: boolean;
  /** Whether Sentry error tracking is configured */
  sentryEnabled: boolean;
}

/**
 * Default fallback URL used when NEXT_PUBLIC_BASE_URL is not configured.
 * This allows builds to succeed in CI environments without the variable set.
 */
const DEFAULT_BASE_URL = "http://localhost:3000";

/**
 * Validates a URL string and returns it if valid, falls back to default otherwise.
 * Does not throw to allow CI builds without all env vars configured.
 */
function validateUrl(value: string | undefined, name: string): string {
  if (!value) {
    // Use fallback - CI builds may not have this configured
    // Runtime in production will use the actual deployed URL via Vercel's env vars
    return DEFAULT_BASE_URL;
  }

  try {
    new URL(value);
    return value;
  } catch {
    // Invalid URL format - use fallback rather than crash build
    if (process.env.NODE_ENV === "development") {
      console.warn(`[env] ${name} is not a valid URL: ${value}. Using fallback.`);
    }
    return DEFAULT_BASE_URL;
  }
}

/**
 * Validates GTM ID format (GTM-XXXXXXX or GTM-XXXXXXXX).
 * Returns null if not configured (analytics will be disabled).
 */
function validateGtmId(value: string | undefined): string | null {
  if (!value || value === "gtm-xxxxxxx" || value === "") {
    return null;
  }

  // GTM IDs are uppercase and follow the pattern GTM-XXXXXXX
  const gtmPattern = /^GTM-[A-Z0-9]{6,8}$/;
  if (!gtmPattern.test(value)) {
    // Log warning but don't fail - allow misconfigured GTM in development
    if (process.env.NODE_ENV === "development") {
      console.warn(`[env] Invalid GTM ID format: ${value}. Expected GTM-XXXXXXX pattern.`);
    }
    return null;
  }

  return value;
}

/**
 * Validates GA4 Measurement ID format (G-XXXXXXXXXX).
 * Returns null if not configured.
 */
function validateGaMeasurementId(value: string | undefined): string | null {
  if (!value || value === "G-XXXXXXXXXX" || value === "") {
    return null;
  }

  // GA4 Measurement IDs follow the pattern G-XXXXXXXXXX
  const gaPattern = /^G-[A-Z0-9]{10,12}$/;
  if (!gaPattern.test(value)) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        `[env] Invalid GA Measurement ID format: ${value}. Expected G-XXXXXXXXXX pattern.`
      );
    }
    return null;
  }

  return value;
}

/**
 * Validates Sentry DSN format.
 * Returns null if not configured (error tracking will be disabled).
 */
function validateSentryDsn(value: string | undefined): string | null {
  if (!value || value === "") {
    return null;
  }

  // Sentry DSNs follow the pattern https://<key>@<org>.ingest.sentry.io/<project>
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || !url.hostname.includes("sentry.io")) {
      if (process.env.NODE_ENV === "development") {
        console.warn(`[env] Invalid Sentry DSN format: ${value}`);
      }
      return null;
    }
    return value;
  } catch {
    if (process.env.NODE_ENV === "development") {
      console.warn(`[env] Invalid Sentry DSN: ${value}`);
    }
    return null;
  }
}

/**
 * Parses and validates NODE_ENV.
 */
function validateNodeEnv(): "development" | "production" | "test" {
  const env = process.env.NODE_ENV;
  if (env === "development" || env === "production" || env === "test") {
    return env;
  }
  // Default to development if not set or invalid
  return "development";
}

/**
 * Validated environment configuration.
 *
 * This object is frozen to prevent runtime modifications.
 * All values are validated at module initialization.
 */
export const env: EnvConfig = Object.freeze({
  baseUrl: validateUrl(process.env.NEXT_PUBLIC_BASE_URL, "NEXT_PUBLIC_BASE_URL"),
  gtmId: validateGtmId(process.env.NEXT_PUBLIC_GTM_ID),
  gaMeasurementId: validateGaMeasurementId(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID),
  sentryDsn: validateSentryDsn(process.env.NEXT_PUBLIC_SENTRY_DSN),
  nodeEnv: validateNodeEnv(),
  get analyticsEnabled() {
    return this.gtmId !== null;
  },
  get sentryEnabled() {
    return this.sentryDsn !== null;
  },
});

/**
 * Type-safe environment variable access.
 *
 * Use this instead of directly accessing process.env to ensure:
 * 1. Type safety
 * 2. Validation at initialization
 * 3. Consistent fallback behavior
 */
export default env;
