import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

/**
 * Dynamic robots.txt generation for search engine crawlers.
 * Allows crawling of all public content, disallows internal routes.
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = env.baseUrl;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/_next/", "/private/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
