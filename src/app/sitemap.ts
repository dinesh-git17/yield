import type { MetadataRoute } from "next";
import { env } from "@/lib/env";
import { generateLearnRoutes, VALID_MODES } from "@/lib/seo";

/**
 * Dynamic sitemap generation for search engine discovery.
 * Includes all static pages, category hubs, and algorithm detail pages.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = env.baseUrl;
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/learn`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  // Category hub pages (/learn/sorting, /learn/pathfinding, etc.)
  const categoryRoutes: MetadataRoute.Sitemap = VALID_MODES.map((mode) => ({
    url: `${baseUrl}/learn/${mode}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Detail pages (/learn/sorting/bubble, /learn/pathfinding/astar, etc.)
  const learnRoutes = generateLearnRoutes();
  const detailRoutes: MetadataRoute.Sitemap = learnRoutes.map(({ mode, slug }) => ({
    url: `${baseUrl}/learn/${mode}/${slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...categoryRoutes, ...detailRoutes];
}
