/**
 * JSON-LD structured data utilities for SEO rich snippets.
 * Generates schema.org compliant markup for search engines.
 */

import { env } from "./env";
import type { VisualizerMode } from "./store";

const BASE_URL = env.baseUrl;

/**
 * Mode labels for human-readable breadcrumbs.
 */
const MODE_LABELS: Record<VisualizerMode, string> = {
  sorting: "Sorting Algorithms",
  pathfinding: "Pathfinding Algorithms",
  tree: "Data Structures",
  graph: "Graph Algorithms",
};

/**
 * Map algorithm complexity to proficiency level.
 * Used for TechArticle proficiencyLevel.
 */
function getProfiencyLevel(complexity: string): string {
  if (complexity.includes("log n") && !complexity.includes("n log n")) {
    return "Advanced";
  }
  if (complexity.includes("n²") || complexity.includes("n^2")) {
    return "Beginner";
  }
  if (complexity.includes("n log n")) {
    return "Intermediate";
  }
  return "Intermediate";
}

interface TechArticleParams {
  title: string;
  description: string;
  mode: VisualizerMode;
  slug: string;
  complexity: string;
  datePublished?: string;
  dateModified?: string;
}

/**
 * Generates TechArticle JSON-LD for algorithm detail pages.
 */
export function generateTechArticleJsonLd({
  title,
  description,
  mode,
  slug,
  complexity,
  datePublished = "2025-01-01",
  dateModified = new Date().toISOString().split("T")[0],
}: TechArticleParams): string {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: title,
    description,
    proficiencyLevel: getProfiencyLevel(complexity),
    url: `${BASE_URL}/learn/${mode}/${slug}`,
    datePublished,
    dateModified,
    author: {
      "@type": "Organization",
      name: "Yield",
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Yield",
      url: BASE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/logo/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/learn/${mode}/${slug}`,
    },
    keywords: [title, "algorithm", "visualization", "computer science", mode],
    articleSection: MODE_LABELS[mode],
    inLanguage: "en-US",
  };

  return JSON.stringify(jsonLd);
}

interface BreadcrumbParams {
  mode: VisualizerMode;
  algorithmTitle: string;
  slug: string;
}

/**
 * Generates BreadcrumbList JSON-LD for navigation context.
 */
export function generateBreadcrumbJsonLd({ mode, algorithmTitle, slug }: BreadcrumbParams): string {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: BASE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Learn",
        item: `${BASE_URL}/learn`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: MODE_LABELS[mode],
        item: `${BASE_URL}/learn/${mode}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: algorithmTitle,
        item: `${BASE_URL}/learn/${mode}/${slug}`,
      },
    ],
  };

  return JSON.stringify(jsonLd);
}

interface WebSiteParams {
  name?: string;
  description?: string;
}

/**
 * Generates WebSite JSON-LD for the root layout.
 * Includes SearchAction for potential sitelinks search box.
 */
export function generateWebSiteJsonLd({
  name = "Yield — Algorithm Visualizer",
  description = "Interactive algorithm visualization for sorting, pathfinding, trees, and graphs.",
}: WebSiteParams = {}): string {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    description,
    url: BASE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/learn?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return JSON.stringify(jsonLd);
}

/**
 * Generates CollectionPage JSON-LD for category hub pages.
 */
export function generateCollectionPageJsonLd(mode: VisualizerMode, algorithmCount: number): string {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: MODE_LABELS[mode],
    description: `Compare ${algorithmCount} ${mode === "tree" ? "data structures" : "algorithms"} side-by-side with interactive visualizations.`,
    url: `${BASE_URL}/learn/${mode}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: algorithmCount,
    },
  };

  return JSON.stringify(jsonLd);
}
