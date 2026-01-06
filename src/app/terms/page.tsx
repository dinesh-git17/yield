"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  Ban,
  BookOpen,
  Code2,
  FileText,
  Gavel,
  Globe,
  GraduationCap,
  Mail,
  RefreshCw,
  Scale,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { buttonInteraction, panelVariants } from "@/lib/motion";
import { cn } from "@/lib/utils";

export default function TermsPage() {
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
            <FileText className="h-4 w-4" />
            <span className="text-sm font-medium">Terms</span>
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
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-2">
              <Scale className="h-4 w-4 text-sky-500" />
              <span className="text-sm font-medium text-sky-500">Fair Use</span>
            </div>
            <h1 className="text-primary text-4xl font-bold tracking-tight sm:text-5xl">
              Terms of Service
            </h1>
            <p className="text-muted text-sm">
              <strong>Last updated:</strong> January 2026
            </p>
          </header>

          {/* Intro */}
          <section className="space-y-4">
            <p className="text-primary/80 leading-relaxed">
              Welcome to Yield. By accessing or using this website, you agree to the terms described
              below. If you do not agree with these terms, you should not use the site.
            </p>
            <p className="text-primary/80 leading-relaxed">
              These terms exist to set clear expectations and to keep things fair for everyone.
            </p>
          </section>

          <hr className="border-border" />

          {/* Use of Yield */}
          <Section title="Use of Yield" icon={<BookOpen className="h-5 w-5" />}>
            <p className="text-primary/80 leading-relaxed">
              Yield is provided as an educational and informational tool.
            </p>
            <p className="text-primary/80 leading-relaxed">You may use Yield for:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li className="text-primary/80">Learning algorithms and data structures</li>
              <li className="text-primary/80">Interview preparation</li>
              <li className="text-primary/80">Teaching and demonstrations</li>
              <li className="text-primary/80">Personal and non-commercial experimentation</li>
            </ul>
            <p className="text-primary/80 leading-relaxed">
              You agree not to use Yield for unlawful purposes or in ways that could harm the site,
              its users, or its infrastructure.
            </p>
          </Section>

          <hr className="border-border" />

          {/* No Guarantees */}
          <Section title="No Guarantees" icon={<AlertTriangle className="h-5 w-5" />}>
            <p className="text-primary/80 leading-relaxed">Yield is provided on an as-is basis.</p>
            <p className="text-primary/80 leading-relaxed">
              While care is taken to ensure accuracy, Yield does not guarantee that:
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li className="text-primary/80">Visualizations are free of errors</li>
              <li className="text-primary/80">
                Explanations are complete or suitable for every learning style
              </li>
              <li className="text-primary/80">
                Content will always be up to date or uninterrupted
              </li>
            </ul>
            <p className="text-primary/80 leading-relaxed">
              Algorithms are complex, and simplifications are sometimes necessary for visualization.
            </p>
          </Section>

          <hr className="border-border" />

          {/* Educational Disclaimer */}
          <Section title="Educational Disclaimer" icon={<GraduationCap className="h-5 w-5" />}>
            <p className="text-primary/80 leading-relaxed">
              Yield is not a substitute for formal education, professional training, or interview
              preparation services.
            </p>
            <p className="text-primary/80 leading-relaxed">
              Using Yield does not guarantee interview success, academic results, or performance
              outcomes. Learning outcomes depend on many factors beyond any single tool.
            </p>
          </Section>

          <hr className="border-border" />

          {/* Intellectual Property */}
          <Section title="Intellectual Property" icon={<Shield className="h-5 w-5" />}>
            <p className="text-primary/80 leading-relaxed">
              All content on Yield, including but not limited to:
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li className="text-primary/80">Visualizations</li>
              <li className="text-primary/80">Explanations and written content</li>
              <li className="text-primary/80">User interface design</li>
              <li className="text-primary/80">Branding and logos</li>
            </ul>
            <p className="text-primary/80 leading-relaxed">
              is the property of Yield unless otherwise stated.
            </p>
            <p className="text-primary/80 leading-relaxed">
              You may not copy, reproduce, or redistribute Yield content for commercial purposes
              without permission.
            </p>
          </Section>

          <hr className="border-border" />

          {/* Open Source and Attribution */}
          <Section title="Open Source and Attribution" icon={<Code2 className="h-5 w-5" />}>
            <p className="text-primary/80 leading-relaxed">
              Some components of Yield may be inspired by or built using open source software.
            </p>
            <p className="text-primary/80 leading-relaxed">
              Where applicable, proper attribution is provided. Open source licenses apply only to
              the components covered by those licenses.
            </p>
          </Section>

          <hr className="border-border" />

          {/* Limitation of Liability */}
          <Section title="Limitation of Liability" icon={<Scale className="h-5 w-5" />}>
            <p className="text-primary/80 leading-relaxed">
              To the maximum extent permitted by law, Yield and its creator are not liable for any
              damages arising from the use or inability to use the site.
            </p>
            <p className="text-primary/80 leading-relaxed">This includes but is not limited to:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li className="text-primary/80">Data loss</li>
              <li className="text-primary/80">Missed opportunities</li>
              <li className="text-primary/80">Interview outcomes</li>
              <li className="text-primary/80">Misinterpretation of educational content</li>
            </ul>
            <p className="text-primary/80 leading-relaxed">Use Yield at your own discretion.</p>
          </Section>

          <hr className="border-border" />

          {/* Availability and Changes */}
          <Section title="Availability and Changes" icon={<RefreshCw className="h-5 w-5" />}>
            <p className="text-primary/80 leading-relaxed">
              Yield may change, pause, or discontinue features at any time.
            </p>
            <p className="text-primary/80 leading-relaxed">
              There is no obligation to maintain backward compatibility or continued availability of
              specific algorithms or features.
            </p>
          </Section>

          <hr className="border-border" />

          {/* Termination */}
          <Section title="Termination" icon={<Ban className="h-5 w-5" />}>
            <p className="text-primary/80 leading-relaxed">
              Access to Yield may be restricted or terminated if these terms are violated or if
              usage poses a risk to the site or other users.
            </p>
            <p className="text-primary/80 leading-relaxed">
              Because Yield does not require accounts, termination may involve blocking access by
              technical means.
            </p>
          </Section>

          <hr className="border-border" />

          {/* Governing Law */}
          <Section title="Governing Law" icon={<Gavel className="h-5 w-5" />}>
            <p className="text-primary/80 leading-relaxed">
              These terms are governed by the laws applicable in the jurisdiction where Yield is
              operated, without regard to conflict of law principles.
            </p>
          </Section>

          <hr className="border-border" />

          {/* Changes to These Terms */}
          <Section title="Changes to These Terms" icon={<Globe className="h-5 w-5" />}>
            <p className="text-primary/80 leading-relaxed">
              These Terms of Service may be updated over time.
            </p>
            <p className="text-primary/80 leading-relaxed">
              Updates will be posted on this page with a revised date. Continued use of Yield after
              updates means you accept the new terms.
            </p>
          </Section>

          <hr className="border-border" />

          {/* Contact */}
          <Section title="Contact" icon={<Mail className="h-5 w-5" />}>
            <p className="text-primary/80 leading-relaxed">
              If you have questions about these terms, you can contact:
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
            . Built for learning, used responsibly.
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
