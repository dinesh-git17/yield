/**
 * Sponsor Platform Configuration
 *
 * Centralized links for all sponsorship platforms.
 * Easy to swap platforms later if needed.
 */

export const SPONSOR_LINKS = {
  KOFI: "https://ko-fi.com/dinbuilds",
  BMC: "https://buymeacoffee.com/dinesh_d",
  GITHUB: "https://github.com/sponsors/dinesh-git17",
} as const;

export type SponsorPlatform = "kofi" | "bmc" | "github";

export const SPONSOR_PLATFORMS: Array<{
  id: SponsorPlatform;
  name: string;
  url: string;
  description: string;
}> = [
  {
    id: "kofi",
    name: "Ko-fi",
    url: SPONSOR_LINKS.KOFI,
    description: "Buy me a coffee",
  },
  {
    id: "bmc",
    name: "Buy Me a Coffee",
    url: SPONSOR_LINKS.BMC,
    description: "Support with a coffee",
  },
  {
    id: "github",
    name: "GitHub Sponsors",
    url: SPONSOR_LINKS.GITHUB,
    description: "Sponsor on GitHub",
  },
];
