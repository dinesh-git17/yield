import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SplashScreen } from "@/components/SplashScreen";
import { AnalyticsWrapper } from "@/features/analytics";
import { env } from "@/lib/env";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Base URL for canonical URLs, OpenGraph, and sitemap generation.
 * Validated at startup via lib/env.ts.
 */
const BASE_URL = env.baseUrl;

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Yield — Algorithm Visualizer",
    template: "%s | Yield",
  },
  description:
    "Interactive algorithm visualization for sorting, pathfinding, trees, and graphs. Learn computer science concepts through step-by-step animations powered by Generator functions.",
  keywords: [
    "algorithm visualizer",
    "sorting algorithms",
    "pathfinding algorithms",
    "data structures",
    "bubble sort",
    "quick sort",
    "merge sort",
    "dijkstra",
    "A* search",
    "binary search tree",
    "computer science",
    "interview prep",
    "learn algorithms",
  ],
  authors: [{ name: "DinBuilds" }],
  creator: "DinBuilds",
  publisher: "DinBuilds",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Yield",
    title: "Yield — Algorithm Visualizer",
    description:
      "Interactive algorithm visualization for sorting, pathfinding, trees, and graphs. Learn computer science concepts through step-by-step animations.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Yield — Algorithm Visualizer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yield — Algorithm Visualizer",
    description:
      "Interactive algorithm visualization for sorting, pathfinding, trees, and graphs. Learn computer science concepts through step-by-step animations.",
    images: ["/og-image.jpg"],
    creator: "@DinBuilds",
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/web-assets/favicon.ico", sizes: "any" },
      { url: "/web-assets/favicon.svg", type: "image/svg+xml" },
      {
        url: "/web-assets/favicon-96x96.png",
        type: "image/png",
        sizes: "96x96",
      },
    ],
    apple: [
      {
        url: "/web-assets/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/web-assets/favicon.svg",
        color: "#5e6ad2",
      },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Yield",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0b" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AnalyticsWrapper>
          <SplashScreen>{children}</SplashScreen>
        </AnalyticsWrapper>
      </body>
    </html>
  );
}
