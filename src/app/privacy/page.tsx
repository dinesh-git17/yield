"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  Baby,
  Cookie,
  Database,
  LineChart,
  Lock,
  Mail,
  RefreshCw,
  Server,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { buttonInteraction, panelVariants } from "@/lib/motion";
import { cn } from "@/lib/utils";

export default function PrivacyPage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Navigation Header */}
      <motion.header
        variants={panelVariants.slideFromLeft}
        initial="hidden"
        animate="visible"
        className={cn(
          "sticky top-0 z-50",
          "border-b border-border bg-background/80 backdrop-blur-xl",
          "px-6 py-4"
        )}
      >
        <nav className="mx-auto flex max-w-3xl items-center justify-between">
          <motion.div whileHover={buttonInteraction.hover} whileTap={buttonInteraction.tap}>
            <Link
              href="/"
              className={cn(
                "inline-flex items-center gap-2 rounded-lg px-3 py-2",
                "text-muted hover:text-primary transition-colors",
                "hover:bg-surface"
              )}
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm font-medium">Back to Studio</span>
            </Link>
          </motion.div>

          <div className="flex items-center gap-2 text-muted">
            <Shield className="h-4 w-4" />
            <span className="text-sm font-medium">Privacy</span>
          </div>
        </nav>
      </motion.header>

      {/* Main Content Area */}
      <main className="px-6 py-12">
        <motion.article
          variants={panelVariants.fadeScale}
          initial="hidden"
          animate="visible"
          className="prose-container mx-auto max-w-3xl space-y-12"
        >
          {/* Hero Section */}
          <header className="space-y-4 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2">
              <Shield className="h-4 w-4 text-emerald-500" />
              <span className="text-sm font-medium text-emerald-500">Your Privacy Matters</span>
            </div>
            <h1 className="text-primary text-4xl font-bold tracking-tight sm:text-5xl">
              Privacy Policy
            </h1>
            <p className="text-muted text-sm">
              <strong>Last updated:</strong> January 2026
            </p>
          </header>

          {/* Intro */}
          <section className="space-y-4">
            <p className="text-primary/80 leading-relaxed">
              Yield respects your privacy. This page explains what information is collected, how it
              is used, and the choices you have when using the site.
            </p>
            <p className="text-primary/80 leading-relaxed">
              The short version is simple.{" "}
              <strong>Yield is designed to work without requiring personal data.</strong>
            </p>
          </section>

          <hr className="border-border" />

          {/* Information We Collect */}
          <Section title="Information We Collect" icon={<Database className="h-5 w-5" />}>
            <p className="text-primary/80 leading-relaxed">
              Yield does <strong>not</strong> require accounts, sign-ups, or personal information.
            </p>
            <p className="text-primary/80 leading-relaxed">We do not collect:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li className="text-primary/80">Names</li>
              <li className="text-primary/80">Email addresses</li>
              <li className="text-primary/80">Passwords</li>
              <li className="text-primary/80">Payment information</li>
              <li className="text-primary/80">Location data</li>
              <li className="text-primary/80">Uploaded content</li>
            </ul>
            <p className="text-primary/80 leading-relaxed">
              You can use Yield fully without identifying yourself.
            </p>
          </Section>

          <hr className="border-border" />

          {/* Automatically Collected Information */}
          <Section
            title="Automatically Collected Information"
            icon={<Server className="h-5 w-5" />}
          >
            <p className="text-primary/80 leading-relaxed">
              Like most modern websites, Yield may collect limited, non-identifying technical data
              to keep the site running and improve reliability.
            </p>
            <p className="text-primary/80 leading-relaxed">This may include:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li className="text-primary/80">Browser type and version</li>
              <li className="text-primary/80">Device type</li>
              <li className="text-primary/80">Operating system</li>
              <li className="text-primary/80">
                Anonymous usage statistics such as page views and feature usage
              </li>
            </ul>
            <p className="text-primary/80 leading-relaxed">
              This data is aggregated and cannot be used to identify you as an individual.
            </p>
          </Section>

          <hr className="border-border" />

          {/* Cookies and Local Storage */}
          <Section title="Cookies and Local Storage" icon={<Cookie className="h-5 w-5" />}>
            <p className="text-primary/80 leading-relaxed">
              Yield may use browser storage such as cookies or local storage for basic
              functionality.
            </p>
            <p className="text-primary/80 leading-relaxed">Examples include:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li className="text-primary/80">
                Remembering selected algorithms or visualization settings
              </li>
              <li className="text-primary/80">
                Preserving UI preferences like speed or array size
              </li>
            </ul>
            <p className="text-primary/80 leading-relaxed">
              These are strictly functional and are not used for tracking across sites.
            </p>
          </Section>

          <hr className="border-border" />

          {/* Analytics */}
          <Section title="Analytics" icon={<LineChart className="h-5 w-5" />}>
            <p className="text-primary/80 leading-relaxed">
              If analytics are enabled, they are used solely to understand how Yield is used at a
              high level.
            </p>
            <p className="text-primary/80 leading-relaxed">Analytics data is used to:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li className="text-primary/80">Improve performance and stability</li>
              <li className="text-primary/80">Identify popular algorithms or features</li>
              <li className="text-primary/80">Fix bugs and usability issues</li>
            </ul>
            <p className="text-primary/80 leading-relaxed">
              Analytics data is never sold or shared for advertising purposes.
            </p>
          </Section>

          <hr className="border-border" />

          {/* Third-Party Services */}
          <Section title="Third-Party Services" icon={<Server className="h-5 w-5" />}>
            <p className="text-primary/80 leading-relaxed">
              Yield may rely on third-party services for hosting, analytics, or infrastructure.
            </p>
            <p className="text-primary/80 leading-relaxed">
              These services may process limited technical data as part of normal operation. Each
              service operates under its own privacy policy.
            </p>
            <p className="text-primary/80 leading-relaxed">
              Yield does not share personal data with third parties because it does not collect
              personal data in the first place.
            </p>
          </Section>

          <hr className="border-border" />

          {/* Data Security */}
          <Section title="Data Security" icon={<Lock className="h-5 w-5" />}>
            <p className="text-primary/80 leading-relaxed">
              Yield is built with security best practices in mind.
            </p>
            <p className="text-primary/80 leading-relaxed">
              Because no personal data is stored, the risk surface is intentionally minimal.
              Infrastructure access is restricted, dependencies are kept up to date, and the site is
              served over secure connections.
            </p>
          </Section>

          <hr className="border-border" />

          {/* Children's Privacy */}
          <Section title="Children's Privacy" icon={<Baby className="h-5 w-5" />}>
            <p className="text-primary/80 leading-relaxed">
              Yield is an educational tool intended for general audiences.
            </p>
            <p className="text-primary/80 leading-relaxed">
              It does not knowingly collect personal information from children under 13. If you
              believe that personal data has been provided unintentionally, please contact us and it
              will be removed.
            </p>
          </Section>

          <hr className="border-border" />

          {/* Changes to This Policy */}
          <Section title="Changes to This Policy" icon={<RefreshCw className="h-5 w-5" />}>
            <p className="text-primary/80 leading-relaxed">
              This Privacy Policy may be updated as Yield evolves.
            </p>
            <p className="text-primary/80 leading-relaxed">
              Any changes will be reflected on this page with an updated revision date. Continued
              use of the site after changes means you accept the updated policy.
            </p>
          </Section>

          <hr className="border-border" />

          {/* Contact */}
          <Section title="Contact" icon={<Mail className="h-5 w-5" />}>
            <p className="text-primary/80 leading-relaxed">
              If you have questions or concerns about privacy, you can contact:
            </p>
            <div
              className={cn(
                "mt-4 rounded-xl border border-border bg-surface p-4",
                "flex items-center gap-3"
              )}
            >
              <Mail className="h-5 w-5 text-accent" />
              <a href="mailto:info@dineshd.dev" className="text-accent hover:underline font-medium">
                info@dineshd.dev
              </a>
            </div>
          </Section>
        </motion.article>
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-muted text-sm italic">
            Part of{" "}
            <Link href="/" className="text-accent hover:underline">
              Yield
            </Link>
            . Built for learning, not tracking.
          </p>
        </div>
      </footer>
    </div>
  );
}

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function Section({ title, icon, children }: SectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-primary flex items-center gap-3 text-2xl font-semibold">
        <span className="text-accent">{icon}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}
