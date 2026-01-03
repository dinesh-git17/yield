import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yield — Algorithm Visualizer",
  description: "Interactive algorithm visualization powered by Generator functions",
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
