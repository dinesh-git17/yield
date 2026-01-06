import type { MetadataRoute } from "next";

/**
 * Dynamic robots.txt generation for search engine crawlers.
 * Allows crawling of all public content, disallows internal routes.
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/_next/", "/private/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
