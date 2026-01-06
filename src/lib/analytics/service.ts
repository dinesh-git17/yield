/**
 * Analytics Service
 *
 * Central orchestrator for analytics tracking.
 * - Checks consent before dispatching events
 * - Buffers events if consent is pending
 * - Provides a clean API for the application
 */

import { env } from "@/lib/env";
import { gtmProvider } from "./gtm-provider";
import {
  type AnalyticsEvent,
  type ConsentState,
  DEFAULT_CONSENT_STATE,
  type PageViewPayload,
  type UTMParams,
} from "./types";

// =============================================================================
// Constants
// =============================================================================

const CONSENT_STORAGE_KEY = "yield_consent";
const UTM_SESSION_KEY = "yield_utm";
const REFERRER_SESSION_KEY = "yield_referrer";

// =============================================================================
// Analytics Service Class
// =============================================================================

class AnalyticsService {
  private consent: ConsentState = DEFAULT_CONSENT_STATE;
  private initialized = false;
  private eventBuffer: AnalyticsEvent[] = [];
  private debug: boolean;

  constructor() {
    this.debug = env.nodeEnv === "development";
  }

  /**
   * Initialize the analytics service.
   * Loads persisted consent and initializes the provider.
   */
  init(): void {
    if (typeof window === "undefined") return;
    if (this.initialized) return;

    // Load persisted consent
    this.loadConsent();

    // Initialize the provider
    gtmProvider.init();

    // Capture initial UTM params and referrer
    this.captureAttribution();

    this.initialized = true;

    // If consent was previously granted, signal to GTM
    if (this.consent.analytics) {
      gtmProvider.grantConsent({
        analytics: this.consent.analytics,
        marketing: this.consent.marketing,
      });

      // Flush any buffered events
      this.flushBuffer();
    }

    if (this.debug) {
      console.log("[Analytics] Service initialized, consent:", this.consent);
    }
  }

  /**
   * Update consent state.
   * Called when user interacts with the consent banner.
   */
  updateConsent(newConsent: Partial<Omit<ConsentState, "essential">>): void {
    this.consent = {
      ...this.consent,
      ...newConsent,
      timestamp: Date.now(),
    };

    // Persist to localStorage
    this.saveConsent();

    // Signal consent update to GTM
    if (this.consent.analytics || this.consent.marketing) {
      gtmProvider.grantConsent({
        analytics: this.consent.analytics,
        marketing: this.consent.marketing,
      });

      // Flush buffered events if analytics is now enabled
      if (this.consent.analytics) {
        this.flushBuffer();
      }
    } else {
      gtmProvider.denyConsent();
    }
  }

  /**
   * Get current consent state.
   */
  getConsent(): ConsentState {
    return { ...this.consent };
  }

  /**
   * Check if user has made a consent decision.
   */
  hasConsentDecision(): boolean {
    return this.consent.timestamp !== null;
  }

  /**
   * Track an analytics event.
   * Events are only dispatched if analytics consent is granted.
   */
  trackEvent(event: AnalyticsEvent): void {
    if (!this.initialized) {
      if (this.debug) {
        console.warn("[Analytics] Service not initialized, buffering event:", event.name);
      }
      this.eventBuffer.push(event);
      return;
    }

    // Only track if analytics consent is granted
    if (!this.consent.analytics) {
      if (this.debug) {
        console.log("[Analytics] Consent not granted, event dropped:", event.name);
      }
      return;
    }

    gtmProvider.trackEvent(event);
  }

  /**
   * Track a page view.
   * Only dispatched if analytics consent is granted.
   */
  trackPageView(payload: PageViewPayload): void {
    if (!this.initialized) {
      if (this.debug) {
        console.warn("[Analytics] Service not initialized, skipping page view");
      }
      return;
    }

    if (!this.consent.analytics) {
      if (this.debug) {
        console.log("[Analytics] Consent not granted, page view dropped:", payload.path);
      }
      return;
    }

    gtmProvider.trackPageView(payload);
  }

  /**
   * Get captured UTM parameters from the landing session.
   */
  getUTMParams(): UTMParams | null {
    if (typeof window === "undefined") return null;

    const stored = sessionStorage.getItem(UTM_SESSION_KEY);
    if (!stored) return null;

    try {
      return JSON.parse(stored) as UTMParams;
    } catch {
      return null;
    }
  }

  /**
   * Get the initial referrer from the landing session.
   */
  getInitialReferrer(): string | null {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem(REFERRER_SESSION_KEY);
  }

  // ===========================================================================
  // Private Methods
  // ===========================================================================

  /**
   * Load consent state from localStorage.
   */
  private loadConsent(): void {
    if (typeof window === "undefined") return;

    try {
      const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as ConsentState;
        this.consent = {
          essential: true, // Always true
          analytics: parsed.analytics ?? false,
          marketing: parsed.marketing ?? false,
          timestamp: parsed.timestamp ?? null,
        };
      }
    } catch {
      // Invalid stored data, use defaults
      this.consent = DEFAULT_CONSENT_STATE;
    }
  }

  /**
   * Save consent state to localStorage.
   */
  private saveConsent(): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(this.consent));
    } catch {
      // localStorage might be unavailable (private browsing, etc.)
      if (this.debug) {
        console.warn("[Analytics] Failed to persist consent to localStorage");
      }
    }
  }

  /**
   * Capture UTM parameters and referrer from the landing page.
   */
  private captureAttribution(): void {
    if (typeof window === "undefined") return;

    // Only capture once per session
    if (sessionStorage.getItem(UTM_SESSION_KEY)) return;

    const params = new URLSearchParams(window.location.search);
    const utmParams: UTMParams = {};

    const utmKeys: (keyof UTMParams)[] = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
    ];

    for (const key of utmKeys) {
      const value = params.get(key);
      if (value) {
        utmParams[key] = value;
      }
    }

    // Store UTM params if any were found
    if (Object.keys(utmParams).length > 0) {
      sessionStorage.setItem(UTM_SESSION_KEY, JSON.stringify(utmParams));
    }

    // Store initial referrer
    if (document.referrer && !sessionStorage.getItem(REFERRER_SESSION_KEY)) {
      sessionStorage.setItem(REFERRER_SESSION_KEY, document.referrer);
    }
  }

  /**
   * Flush buffered events (called when consent is granted).
   */
  private flushBuffer(): void {
    if (this.eventBuffer.length === 0) return;

    if (this.debug) {
      console.log("[Analytics] Flushing", this.eventBuffer.length, "buffered events");
    }

    for (const event of this.eventBuffer) {
      gtmProvider.trackEvent(event);
    }

    this.eventBuffer = [];
  }
}

// =============================================================================
// Singleton Export
// =============================================================================

export const analytics = new AnalyticsService();
