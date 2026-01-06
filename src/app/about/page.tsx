"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Coffee, Heart, Info, Lightbulb, Sparkles, Target, XCircle } from "lucide-react";
import Link from "next/link";
import { buttonInteraction, panelVariants } from "@/lib/motion";
import { cn } from "@/lib/utils";

export default function AboutPage() {
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
            <Info className="h-4 w-4" />
            <span className="text-sm font-medium">About</span>
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
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2">
              <Sparkles className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-accent">The Story</span>
            </div>
            <h1 className="text-primary text-4xl font-bold tracking-tight sm:text-5xl">
              About Yield
            </h1>
            <p className="text-muted text-lg leading-relaxed">
              Yield started the same way most algorithm journeys do: late nights, too much coffee,
              and one LeetCode problem turning into five.
            </p>
          </header>

          {/* Intro */}
          <section className="space-y-4">
            <p className="text-primary/80 leading-relaxed">
              I was grinding data structures and algorithms for interviews and kept running into the
              same problem. I could <em>understand</em> an algorithm when reading it, but a few days
              later, the details blurred. Time complexity faded. Edge cases disappeared. Everything
              collapsed into &ldquo;yeah, I&apos;ve seen this before… probably.&rdquo;
            </p>
            <p className="text-primary/80 leading-relaxed">
              So I did what most developers do when something doesn&apos;t quite exist yet. I tried
              to build a better cheatsheet.
            </p>
          </section>

          <hr className="border-border" />

          {/* How It Began */}
          <Section title="How It Began" icon={<Coffee className="h-5 w-5" />}>
            <p className="text-primary/80 leading-relaxed">
              Yield was never meant to be a product.
            </p>
            <p className="text-primary/80 leading-relaxed">
              It started as a personal tool. A way to <em>see</em> algorithms instead of memorizing
              them. I wanted something I could come back to mid-prep and instantly answer questions
              like:
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li className="text-primary/80">What is actually happening at each step?</li>
              <li className="text-primary/80">
                Why does this algorithm feel slower, even when Big-O says otherwise?
              </li>
              <li className="text-primary/80">
                What changes between best, average, and worst case — visually?
              </li>
            </ul>
            <p className="text-primary/80 leading-relaxed">
              Somewhere between visualizing Bubble Sort at 1:47 AM and shipping &ldquo;just one more
              algorithm,&rdquo; the cheatsheet quietly turned into a side project.
            </p>
            <p className="text-primary/80 leading-relaxed">And then into a real one.</p>
          </Section>

          <hr className="border-border" />

          {/* The Philosophy */}
          <Section title="The Philosophy" icon={<Lightbulb className="h-5 w-5" />}>
            <p className="text-primary/80 leading-relaxed">Yield is built around a simple idea:</p>
            <blockquote
              className={cn(
                "border-l-4 border-accent pl-4 py-2 my-4",
                "bg-accent/5 rounded-r-lg pr-4"
              )}
            >
              <p className="text-primary font-medium italic">
                If you can see it, you can reason about it.
              </p>
            </blockquote>
            <p className="text-primary/80 leading-relaxed">
              This isn&apos;t about replacing theory. It&apos;s about reinforcing it.
            </p>
            <p className="text-primary/80 leading-relaxed">
              Visual speed is not time complexity. Fewer swaps don&apos;t always mean fewer
              comparisons. And &ldquo;O(1) extra space&rdquo; feels very different once you actually
              watch memory usage stay flat.
            </p>
            <p className="text-primary/80 leading-relaxed">Yield exists to bridge that gap.</p>
          </Section>

          <hr className="border-border" />

          {/* What Yield Is (and Isn't) */}
          <section className="space-y-6">
            <h2 className="text-primary flex items-center gap-3 text-2xl font-semibold">
              <span className="text-accent">
                <Target className="h-5 w-5" />
              </span>
              What Yield Is (and Isn&apos;t)
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div
                className={cn(
                  "rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5",
                  "space-y-3"
                )}
              >
                <h3 className="flex items-center gap-2 font-semibold text-emerald-500">
                  <Target className="h-4 w-4" />
                  Yield is:
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="text-primary/80">A visual learning companion for algorithms</li>
                  <li className="text-primary/80">
                    A way to build intuition instead of memorization
                  </li>
                  <li className="text-primary/80">
                    A tool for interview prep, teaching, and curiosity-driven learning
                  </li>
                </ul>
              </div>

              <div
                className={cn(
                  "rounded-xl border border-rose-500/30 bg-rose-500/10 p-5",
                  "space-y-3"
                )}
              >
                <h3 className="flex items-center gap-2 font-semibold text-rose-500">
                  <XCircle className="h-4 w-4" />
                  Yield is not:
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="text-primary/80">A silver bullet for interviews</li>
                  <li className="text-primary/80">
                    A replacement for reading, writing, or reasoning about code
                  </li>
                  <li className="text-primary/80">A promise that Bubble Sort will ever be fast</li>
                </ul>
              </div>
            </div>

            <p className="text-muted text-sm italic">
              (There are limits. Some algorithms are slow on purpose.)
            </p>
          </section>

          <hr className="border-border" />

          {/* Built While Learning */}
          <Section title="Built While Learning" icon={<Heart className="h-5 w-5" />}>
            <p className="text-primary/80 leading-relaxed">
              Every part of Yield was built while actively learning and preparing for interviews.
            </p>
            <p className="text-primary/80 leading-relaxed">That means:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li className="text-primary/80">
                Algorithms were added when I personally needed them
              </li>
              <li className="text-primary/80">
                Visualizations were refined when something didn&apos;t &ldquo;click&rdquo; yet
              </li>
              <li className="text-primary/80">
                Explanations were rewritten when they felt hand-wavy
              </li>
            </ul>
            <p className="text-primary/80 leading-relaxed">
              Most features were shipped late at night, often after telling myself I&apos;d stop
              &ldquo;after this one last change.&rdquo;
            </p>
            <p className="text-primary/80 leading-relaxed">That change was never the last one.</p>
          </Section>

          <hr className="border-border" />

          {/* Why "Yield"? */}
          <section className="space-y-6">
            <h2 className="text-primary flex items-center gap-3 text-2xl font-semibold">
              <span className="text-accent">
                <Sparkles className="h-5 w-5" />
              </span>
              Why &ldquo;Yield&rdquo;?
            </h2>
            <p className="text-primary/80 leading-relaxed">
              Because algorithms don&apos;t just run — they <strong>yield state</strong>.
            </p>
            <p className="text-primary/80 leading-relaxed">
              They yield comparisons. They yield swaps. They yield structure, patterns, and
              tradeoffs.
            </p>
            <p className="text-primary/80 leading-relaxed">
              Yield is about slowing that process down until each step makes sense.
            </p>
          </section>

          <hr className="border-border" />

          {/* The Goal */}
          <section className="space-y-6">
            <h2 className="text-primary flex items-center gap-3 text-2xl font-semibold">
              <span className="text-accent">
                <Target className="h-5 w-5" />
              </span>
              The Goal
            </h2>
            <p className="text-primary/80 leading-relaxed">
              The goal isn&apos;t to impress with complexity. It&apos;s to make complexity
              understandable.
            </p>
            <p className="text-primary/80 leading-relaxed">If Yield helps you:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li className="text-primary/80">
                Finally <em>get</em> why an algorithm behaves the way it does
              </li>
              <li className="text-primary/80">Explain a concept out loud without hand-waving</li>
              <li className="text-primary/80">
                Or feel a little more confident walking into an interview
              </li>
            </ul>
            <p className="text-primary/80 leading-relaxed">Then it&apos;s doing its job.</p>
            <p className="text-primary/80 leading-relaxed">
              Everything else is just implementation details.
            </p>
          </section>
        </motion.article>
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-muted text-sm italic">
            Part of{" "}
            <Link href="/" className="text-accent hover:underline">
              Yield
            </Link>{" "}
            — an algorithm visualizer built one late night at a time.
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
