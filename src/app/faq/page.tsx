"use client";

import { motion } from "framer-motion";
import { ArrowLeft, HelpCircle, MessageCircle } from "lucide-react";
import Link from "next/link";
import { buttonInteraction, panelVariants } from "@/lib/motion";
import { cn } from "@/lib/utils";

const FAQ_ITEMS = [
  {
    question: "What is Yield?",
    answer: [
      "Yield is an algorithm visualizer built to help you understand how algorithms behave, not just memorize their steps.",
      "It focuses on showing what actually happens during execution so you can build intuition around comparisons, swaps, and performance tradeoffs.",
    ],
  },
  {
    question: "Is Yield free to use?",
    answer: [
      "Yes.",
      "Yield is fully usable without accounts, subscriptions, or paywalls. Open a browser and start visualizing.",
      "No credit card required. No surprise steps at the end.",
    ],
  },
  {
    question: "Do I need to create an account?",
    answer: [
      "No.",
      "Yield does not support accounts, logins, or profiles. There is nothing to sign up for and nothing to forget your password for.",
    ],
  },
  {
    question: "Is Yield open source?",
    answer: [
      "Not fully.",
      "Some parts may be inspired by or built with open source tools, but Yield itself is not currently an open source project.",
      "That may change in the future. Algorithms tend to evolve.",
    ],
  },
  {
    question: "Can I use Yield for interview preparation?",
    answer: [
      "Absolutely.",
      "Yield is designed to support interview prep by helping you reason about algorithms instead of memorizing them.",
      "That said, Yield will not magically solve whiteboard questions for you. It will help you explain why something works, which usually matters more.",
    ],
  },
  {
    question: "Are the visual speeds accurate representations of performance?",
    answer: [
      "No.",
      "Visual speed is not time complexity. Some algorithms are slowed down intentionally so you can see what is happening.",
      "Fast animations do not mean fast algorithms. Slow animations do not mean bad ones. Big O still wins.",
    ],
  },
  {
    question: "Why does Bubble Sort feel painfully slow?",
    answer: [
      "Because it is.",
      "Bubble Sort is slow by design. Yield does not hide that fact. If anything, it leans into it.",
      "If watching Bubble Sort hurts a little, that is the lesson working as intended.",
    ],
  },
  {
    question: "Are the algorithms implemented exactly like real code?",
    answer: [
      "They are implemented to be faithful to real algorithms while remaining visually understandable.",
      "In some cases, additional steps are added or slowed down to make behavior clear. The goal is learning, not micro-optimizations.",
    ],
  },
  {
    question: "Can I use Yield in classrooms or presentations?",
    answer: [
      "Yes.",
      "Yield is well suited for teaching, demos, and presentations. Visual explanations tend to stick longer than slides full of pseudocode.",
      "Just remember that your students may ask why Quick Sort looks chaotic. That is normal.",
    ],
  },
  {
    question: "Does Yield collect my data?",
    answer: [
      "No personal data.",
      "Yield does not collect names, emails, or accounts. Limited anonymous usage data may be used to improve the site, but nothing that identifies you.",
      "You can read the full details on the Privacy Policy page.",
    ],
  },
  {
    question: 'Why is it called "Yield"?',
    answer: [
      "Because algorithms do not just run. They yield state.",
      "They yield comparisons, swaps, structure, and insight. Slowing that process down makes it easier to understand.",
      "Also, it sounded better than AlgoVisualizerFinalFinalV3.",
    ],
  },
  {
    question: "Will more algorithms be added?",
    answer: [
      "Yes.",
      "Sorting is only the beginning. Pathfinding, trees, graphs, and more are planned.",
      "If an algorithm helped during a late night interview grind, it has a good chance of ending up here.",
    ],
  },
  {
    question: "Who is Yield for?",
    answer: [
      "Anyone learning algorithms.",
      "Students, self taught developers, interview preppers, teachers, and people who just like watching bars move around for educational reasons.",
    ],
  },
  {
    question: "I found a bug or something looks off. What should I do?",
    answer: [
      "That happens.",
      "You can reach out through the Contact page or email with details about what you saw. Screenshots help. Repro steps help more.",
      "Algorithms are deterministic. Bugs usually are not.",
    ],
  },
] as const;

export default function FAQPage() {
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
            <HelpCircle className="h-4 w-4" />
            <span className="text-sm font-medium">FAQ</span>
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
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2">
              <MessageCircle className="h-4 w-4 text-violet-500" />
              <span className="text-sm font-medium text-violet-500">Got Questions?</span>
            </div>
            <h1 className="text-primary text-4xl font-bold tracking-tight sm:text-5xl">
              Frequently Asked Questions
            </h1>
            <p className="text-muted text-lg">
              Everything you wanted to know but were too busy grinding LeetCode to ask.
            </p>
          </header>

          {/* FAQ Items */}
          <div className="space-y-6">
            {FAQ_ITEMS.map((item, index) => (
              <FAQItem
                key={item.question}
                question={item.question}
                answer={item.answer}
                index={index}
              />
            ))}
          </div>
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
            . Questions answered before you even had to ask them.
          </p>
        </div>
      </footer>
    </div>
  );
}

interface FAQItemProps {
  question: string;
  answer: readonly string[];
  index: number;
}

function FAQItem({ question, answer, index }: FAQItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        "rounded-xl border border-border bg-surface p-6",
        "hover:border-accent/30 transition-colors"
      )}
    >
      <h3 className="text-primary mb-3 flex items-start gap-3 text-lg font-semibold">
        <span className="text-accent mt-0.5 shrink-0">
          <HelpCircle className="h-5 w-5" />
        </span>
        {question}
      </h3>
      <div className="space-y-3 pl-8">
        {answer.map((paragraph, idx) => (
          <p
            // biome-ignore lint/suspicious/noArrayIndexKey: Static FAQ content never reorders
            key={idx}
            className={cn(
              "text-primary/80 leading-relaxed",
              paragraph.length < 20 && "font-medium"
            )}
          >
            {paragraph}
          </p>
        ))}
      </div>
    </motion.div>
  );
}
