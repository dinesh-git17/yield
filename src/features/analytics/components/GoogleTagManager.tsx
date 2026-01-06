"use client";

import Script from "next/script";

// =============================================================================
// Environment Variables
// =============================================================================

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

// =============================================================================
// Script Content (Static, Trusted)
// =============================================================================

/**
 * GTM loader script - standard GTM snippet.
 * This is static content that only references the environment variable.
 */
function getGTMScript(gtmId: string): string {
  return `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`;
}

/**
 * GTM Consent Mode default state - sets all consent categories to denied.
 * This ensures GDPR/CCPA compliance by default.
 */
const GTM_CONSENT_SCRIPT = `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  'analytics_storage': 'denied',
  'ad_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'wait_for_update': 500
});`;

// =============================================================================
// Component
// =============================================================================

/**
 * Google Tag Manager Script
 *
 * Loads GTM using Next.js Script component with afterInteractive strategy.
 * This ensures the script doesn't block initial page load or hydration.
 *
 * Important: GTM is configured to require consent_granted event before
 * firing the GA4 Configuration tag. No tracking occurs until user consents.
 */
export function GoogleTagManager() {
  // Don't render anything if GTM_ID is not configured
  if (!GTM_ID) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[Analytics] GTM_ID not configured. Skipping GTM initialization.");
    }
    return null;
  }

  const gtmScriptProps = { __html: getGTMScript(GTM_ID) };
  const consentScriptProps = { __html: GTM_CONSENT_SCRIPT };

  return (
    <>
      {/* GTM Script */}
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={gtmScriptProps}
      />

      {/* GTM Default Consent State */}
      <Script
        id="gtm-consent-default"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={consentScriptProps}
      />

      {/* GTM NoScript Fallback */}
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
          title="Google Tag Manager"
        />
      </noscript>
    </>
  );
}
