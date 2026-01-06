/**
 * Google Tag Manager Provider
 *
 * Implements the AnalyticsProvider interface for GTM/GA4.
 * All events are pushed to the dataLayer for GTM to process.
 */

import type { AnalyticsEvent, AnalyticsProvider, PageViewPayload } from "./types";

// =============================================================================
// DataLayer Type Definitions
// =============================================================================

interface DataLayerEvent {
  event: string;
  [key: string]: unknown;
}

declare global {
  interface Window {
    dataLayer?: DataLayerEvent[];
  }
}

// =============================================================================
// GTM Provider Implementation
// =============================================================================

class GTMProvider implements AnalyticsProvider {
  private initialized = false;
  private debug: boolean;

  constructor(options: { debug?: boolean } = {}) {
    this.debug = options.debug ?? process.env.NODE_ENV === "development";
  }

  /**
   * Initialize the GTM provider.
   * Ensures dataLayer exists and is ready to receive events.
   */
  init(): void {
    if (typeof window === "undefined") return;

    // Initialize dataLayer if it doesn't exist
    window.dataLayer = window.dataLayer ?? [];

    this.initialized = true;

    if (this.debug) {
      console.log("[Analytics] GTM Provider initialized");
    }
  }

  /**
   * Push an event to the GTM dataLayer.
   */
  trackEvent(event: AnalyticsEvent): void {
    if (!this.initialized) {
      if (this.debug) {
        console.warn("[Analytics] Provider not initialized, event dropped:", event.name);
      }
      return;
    }

    const dataLayerEvent: DataLayerEvent = {
      event: event.name,
      ...event.payload,
    };

    this.pushToDataLayer(dataLayerEvent);
  }

  /**
   * Track a page view event.
   * GTM/GA4 uses a specific event name for page views.
   */
  trackPageView(payload: PageViewPayload): void {
    if (!this.initialized) {
      if (this.debug) {
        console.warn("[Analytics] Provider not initialized, page view dropped:", payload.path);
      }
      return;
    }

    const dataLayerEvent: DataLayerEvent = {
      event: "page_view",
      page_path: payload.path,
      page_title: payload.title,
      page_referrer: payload.referrer,
    };

    this.pushToDataLayer(dataLayerEvent);
  }

  /**
   * Set user properties in the dataLayer.
   */
  setUserProperties(properties: Record<string, unknown>): void {
    if (!this.initialized) return;

    this.pushToDataLayer({
      event: "set_user_properties",
      user_properties: properties,
    });
  }

  /**
   * Signal consent granted to GTM.
   * This triggers the GA4 configuration tag in GTM.
   */
  grantConsent(categories: { analytics: boolean; marketing: boolean }): void {
    if (!this.initialized) return;

    // Update Google Consent Mode v2 state via gtag
    // This is required for Google to recognize consent was granted
    const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
    if (gtag) {
      gtag("consent", "update", {
        analytics_storage: categories.analytics ? "granted" : "denied",
        ad_storage: categories.marketing ? "granted" : "denied",
        ad_user_data: categories.marketing ? "granted" : "denied",
        ad_personalization: categories.marketing ? "granted" : "denied",
      });
    }

    // Push consent update event for GTM triggers
    this.pushToDataLayer({
      event: "consent_update",
      consent_analytics: categories.analytics ? "granted" : "denied",
      consent_marketing: categories.marketing ? "granted" : "denied",
    });

    // If analytics consent is granted, fire the consent_granted event
    // This is what the GA4 Configuration tag should trigger on
    if (categories.analytics) {
      this.pushToDataLayer({
        event: "consent_granted",
      });
    }

    if (this.debug) {
      console.log("[Analytics] Consent updated:", categories);
    }
  }

  /**
   * Signal consent denied/revoked to GTM.
   */
  denyConsent(): void {
    if (!this.initialized) return;

    // Update Google Consent Mode v2 state via gtag
    const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
    if (gtag) {
      gtag("consent", "update", {
        analytics_storage: "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      });
    }

    this.pushToDataLayer({
      event: "consent_update",
      consent_analytics: "denied",
      consent_marketing: "denied",
    });

    if (this.debug) {
      console.log("[Analytics] Consent denied");
    }
  }

  /**
   * Internal helper to push events to dataLayer with debug logging.
   */
  private pushToDataLayer(event: DataLayerEvent): void {
    if (typeof window === "undefined" || !window.dataLayer) return;

    window.dataLayer.push(event);

    if (this.debug) {
      console.log("[Analytics] Event pushed:", event);
    }
  }
}

// =============================================================================
// Singleton Export
// =============================================================================

export const gtmProvider = new GTMProvider();
