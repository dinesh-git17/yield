"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Cookie, Settings, Shield, X } from "lucide-react";
import { memo, useCallback, useState } from "react";

import { useOnboardingStore } from "@/features/onboarding";
import { ANALYTICS_EVENTS, useAnalytics } from "@/lib/analytics";
import { buttonInteraction } from "@/lib/motion";
import { cn } from "@/lib/utils";

const TOUR_START_DELAY_MS = 500;

// =============================================================================
// Animation Variants
// =============================================================================

const BANNER_VARIANTS = {
  hidden: {
    y: 100,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 30,
    },
  },
  exit: {
    y: 100,
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
} as const;

const PREFERENCES_VARIANTS = {
  hidden: {
    height: 0,
    opacity: 0,
  },
  visible: {
    height: "auto",
    opacity: 1,
    transition: {
      height: { type: "spring", stiffness: 500, damping: 30 },
      opacity: { duration: 0.2 },
    },
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: {
      height: { duration: 0.2 },
      opacity: { duration: 0.1 },
    },
  },
} as const;

// =============================================================================
// Component
// =============================================================================

function ConsentBannerComponent() {
  const { hasConsentDecision, updateConsent, trackEvent } = useAnalytics();
  const startTour = useOnboardingStore((state) => state.startTour);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    analytics: false,
    marketing: false,
  });

  // Don't show if consent decision already made
  if (hasConsentDecision) {
    return null;
  }

  const triggerOnboardingTour = () => {
    setTimeout(startTour, TOUR_START_DELAY_MS);
  };

  const handleAcceptAll = () => {
    updateConsent({ analytics: true, marketing: true });
    trackEvent({
      name: ANALYTICS_EVENTS.CONSENT_INTERACTION,
      payload: {
        action: "accept_all",
        analytics_enabled: true,
        marketing_enabled: true,
      },
    });
    triggerOnboardingTour();
  };

  const handleRejectAll = () => {
    updateConsent({ analytics: false, marketing: false });
    // Note: This event won't actually fire since analytics is denied
    // But we update consent anyway
    triggerOnboardingTour();
  };

  const handleSavePreferences = () => {
    updateConsent(preferences);
    if (preferences.analytics) {
      trackEvent({
        name: ANALYTICS_EVENTS.CONSENT_INTERACTION,
        payload: {
          action: "save_preferences",
          analytics_enabled: preferences.analytics,
          marketing_enabled: preferences.marketing,
        },
      });
    }
    triggerOnboardingTour();
  };

  const togglePreferences = () => {
    setShowPreferences((prev) => !prev);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-50 p-4 md:left-[180px] md:right-[420px] md:p-6"
        variants={BANNER_VARIANTS}
        initial="hidden"
        animate="visible"
        exit="exit"
        role="dialog"
        aria-modal="false"
        aria-label="Cookie consent"
      >
        <div
          className={cn(
            "mx-auto max-w-2xl overflow-hidden rounded-2xl",
            "border border-white/10 bg-white/10 backdrop-blur-xl",
            "dark:border-white/5 dark:bg-black/60",
            "shadow-2xl shadow-black/20"
          )}
        >
          {/* Main Banner Content */}
          <div className="p-4 md:p-6">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20">
                <Cookie className="h-5 w-5 text-violet-400" />
              </div>

              {/* Text Content */}
              <div className="flex-1 space-y-2">
                <h2 className="text-primary font-semibold">We value your privacy</h2>
                <p className="text-muted text-sm leading-relaxed">
                  We use cookies to understand how you interact with our visualizations and improve
                  your learning experience. No personal data is sold or shared with third parties.
                </p>
              </div>

              {/* Close/Reject button (mobile) */}
              <motion.button
                type="button"
                onClick={handleRejectAll}
                whileHover={buttonInteraction.hover}
                whileTap={buttonInteraction.tap}
                className="text-muted hover:text-primary -mt-1 rounded-full p-1 transition-colors md:hidden"
                aria-label="Reject all cookies"
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>

            {/* Preferences Panel (Expandable) */}
            <AnimatePresence>
              {showPreferences && (
                <motion.div
                  variants={PREFERENCES_VARIANTS}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="overflow-hidden"
                >
                  <div className="mt-4 space-y-3 border-t border-white/10 pt-4">
                    {/* Essential Cookies (Always On) */}
                    <PreferenceToggle
                      icon={<Shield className="h-4 w-4" />}
                      title="Essential"
                      description="Required for the site to function. Cannot be disabled."
                      checked={true}
                      disabled={true}
                      onChange={() => {}}
                    />

                    {/* Analytics Cookies */}
                    <PreferenceToggle
                      icon={<Cookie className="h-4 w-4" />}
                      title="Analytics"
                      description="Help us understand how you use the visualizer to improve it."
                      checked={preferences.analytics}
                      onChange={(checked) => setPreferences((p) => ({ ...p, analytics: checked }))}
                    />

                    {/* Marketing Cookies */}
                    <PreferenceToggle
                      icon={<Settings className="h-4 w-4" />}
                      title="Marketing"
                      description="Used for attribution and measuring ad effectiveness."
                      checked={preferences.marketing}
                      onChange={(checked) => setPreferences((p) => ({ ...p, marketing: checked }))}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
              {/* Manage Preferences Toggle */}
              <motion.button
                type="button"
                onClick={togglePreferences}
                whileHover={buttonInteraction.hover}
                whileTap={buttonInteraction.tap}
                className={cn(
                  "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  "text-muted hover:text-primary",
                  "sm:mr-auto"
                )}
              >
                {showPreferences ? "Hide preferences" : "Manage preferences"}
              </motion.button>

              <div className="flex gap-2">
                {/* Reject All */}
                <motion.button
                  type="button"
                  onClick={handleRejectAll}
                  whileHover={buttonInteraction.hover}
                  whileTap={buttonInteraction.tap}
                  className={cn(
                    "hidden rounded-lg px-4 py-2 text-sm font-medium transition-colors md:block",
                    "border border-white/10 bg-white/5 hover:bg-white/10",
                    "text-primary"
                  )}
                >
                  Reject all
                </motion.button>

                {/* Save Preferences (when expanded) or Accept All */}
                {showPreferences ? (
                  <motion.button
                    type="button"
                    onClick={handleSavePreferences}
                    whileHover={buttonInteraction.hover}
                    whileTap={buttonInteraction.tap}
                    className={cn(
                      "flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-colors sm:flex-none",
                      "bg-gradient-to-r from-violet-600 to-indigo-600",
                      "hover:from-violet-500 hover:to-indigo-500",
                      "text-white shadow-lg shadow-violet-500/20"
                    )}
                  >
                    Save preferences
                  </motion.button>
                ) : (
                  <motion.button
                    type="button"
                    onClick={handleAcceptAll}
                    whileHover={buttonInteraction.hover}
                    whileTap={buttonInteraction.tap}
                    className={cn(
                      "flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-colors sm:flex-none",
                      "bg-gradient-to-r from-violet-600 to-indigo-600",
                      "hover:from-violet-500 hover:to-indigo-500",
                      "text-white shadow-lg shadow-violet-500/20"
                    )}
                  >
                    Accept all
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// =============================================================================
// Sub-components
// =============================================================================

interface PreferenceToggleProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}

const PreferenceToggle = memo(function PreferenceToggle({
  icon,
  title,
  description,
  checked,
  disabled = false,
  onChange,
}: PreferenceToggleProps) {
  const handleToggle = useCallback(() => {
    if (!disabled) {
      onChange(!checked);
    }
  }, [checked, disabled, onChange]);

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border border-white/5 bg-white/5 p-3",
        disabled && "opacity-60"
      )}
    >
      <div className="text-muted">{icon}</div>
      <div className="flex-1">
        <div className="text-primary text-sm font-medium">{title}</div>
        <div className="text-muted text-xs">{description}</div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={`${title} cookies`}
        disabled={disabled}
        onClick={handleToggle}
        className={cn(
          "relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors",
          "focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
          checked ? "bg-violet-600" : "bg-white/20",
          disabled && "cursor-not-allowed"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
            checked && "translate-x-5"
          )}
        />
      </button>
    </div>
  );
});

// =============================================================================
// Export
// =============================================================================

export const ConsentBanner = memo(ConsentBannerComponent);
