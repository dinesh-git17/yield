import type { NextConfig } from "next";

/**
 * Content Security Policy (CSP) Configuration
 *
 * This CSP is designed to be secure while allowing the application to function:
 * - Google Tag Manager and Analytics for tracking (consent-gated)
 * - Google Fonts for typography
 * - KaTeX for math rendering (requires unsafe-inline for styles)
 * - Framer Motion animations
 *
 * Note: 'unsafe-inline' for script-src is required for GTM's inline consent
 * initialization script. This is a known tradeoff for GTM integration.
 * Consider using nonce-based CSP in the future if stricter requirements arise.
 */
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://ssl.google-analytics.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: https: blob:;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com;
  frame-src 'self' https://www.googletagmanager.com;
  frame-ancestors 'self';
  base-uri 'self';
  form-action 'self';
  object-src 'none';
  upgrade-insecure-requests;
`
	.replace(/\s{2,}/g, " ")
	.trim();

/**
 * Permissions Policy (formerly Feature Policy)
 *
 * Restricts access to browser features to minimize attack surface.
 * This application does not require camera, microphone, geolocation, etc.
 */
const PermissionsPolicy = [
	"camera=()",
	"microphone=()",
	"geolocation=()",
	"browsing-topics=()",
	"interest-cohort=()",
	"payment=()",
	"usb=()",
	"magnetometer=()",
	"gyroscope=()",
	"accelerometer=()",
].join(", ");

/**
 * Security Headers Configuration
 *
 * Applied to all routes for defense-in-depth protection:
 * - CSP: Prevents XSS and injection attacks
 * - HSTS: Enforces HTTPS connections
 * - X-Content-Type-Options: Prevents MIME type sniffing
 * - X-Frame-Options: Prevents clickjacking (backup for CSP frame-ancestors)
 * - X-XSS-Protection: Legacy XSS filter (deprecated but still useful for older browsers)
 * - Referrer-Policy: Controls referrer information sent with requests
 * - Permissions-Policy: Restricts browser feature access
 */
const securityHeaders = [
	{
		key: "Content-Security-Policy",
		value: ContentSecurityPolicy,
	},
	{
		key: "Strict-Transport-Security",
		value: "max-age=31536000; includeSubDomains; preload",
	},
	{
		key: "X-Content-Type-Options",
		value: "nosniff",
	},
	{
		key: "X-Frame-Options",
		value: "SAMEORIGIN",
	},
	{
		key: "X-XSS-Protection",
		value: "1; mode=block",
	},
	{
		key: "Referrer-Policy",
		value: "strict-origin-when-cross-origin",
	},
	{
		key: "Permissions-Policy",
		value: PermissionsPolicy,
	},
];

const nextConfig: NextConfig = {
	/**
	 * Security Headers
	 *
	 * Applied globally to all routes. These headers provide defense-in-depth
	 * against common web vulnerabilities including XSS, clickjacking, and
	 * MIME type confusion attacks.
	 */
	async headers() {
		return [
			{
				source: "/:path*",
				headers: securityHeaders,
			},
		];
	},

	/**
	 * Powered By Header
	 *
	 * Disabled to prevent information disclosure about the framework version.
	 * This makes fingerprinting the application slightly harder.
	 */
	poweredByHeader: false,

	/**
	 * Strict Mode
	 *
	 * Enables React Strict Mode for additional runtime checks during development.
	 * This helps identify potential problems early.
	 */
	reactStrictMode: true,
};

export default nextConfig;
