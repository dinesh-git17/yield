"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Check, Loader2, Mail, MessageSquare, Send } from "lucide-react";
import Link from "next/link";
import { type FormEvent, useCallback, useState } from "react";
import { buttonInteraction, panelVariants } from "@/lib/motion";
import { cn } from "@/lib/utils";

const CONTACT_EMAIL = "info@dineshd.dev";

type FormStatus = "idle" | "loading" | "success" | "error";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setStatus("loading");
      setErrorMessage("");

      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, subject, message }),
        });

        if (!response.ok) {
          const data: unknown = await response.json();
          const error = data as { error?: string };
          throw new Error(error.error ?? "Failed to send message");
        }

        setStatus("success");
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      } catch (err) {
        setStatus("error");
        setErrorMessage(err instanceof Error ? err.message : "Something went wrong");
      }
    },
    [name, email, subject, message]
  );

  const resetForm = useCallback(() => {
    setStatus("idle");
    setErrorMessage("");
  }, []);

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
            <Mail className="h-4 w-4" />
            <span className="text-sm font-medium">Contact</span>
          </div>
        </nav>
      </motion.header>

      {/* Main Content Area */}
      <main className="px-6 py-12">
        <motion.article
          variants={panelVariants.fadeScale}
          initial="hidden"
          animate="visible"
          className="prose-container mx-auto max-w-xl space-y-8"
        >
          {/* Hero Section */}
          <header className="space-y-4 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2">
              <MessageSquare className="h-4 w-4 text-cyan-500" />
              <span className="text-sm font-medium text-cyan-500">Get in Touch</span>
            </div>
            <h1 className="text-primary text-4xl font-bold tracking-tight sm:text-5xl">Contact</h1>
            <p className="text-muted text-lg">
              Questions, feedback, or just want to say hi? Send a message.
            </p>
          </header>

          {/* Success State */}
          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={cn(
                "rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-8",
                "text-center space-y-4"
              )}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20">
                <Check className="h-8 w-8 text-emerald-500" />
              </div>
              <h2 className="text-primary text-xl font-semibold">Message Sent!</h2>
              <p className="text-muted">
                Thanks for reaching out. I&apos;ll get back to you as soon as possible.
              </p>
              <button
                type="button"
                onClick={resetForm}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg px-4 py-2",
                  "text-accent hover:bg-accent/10 transition-colors"
                )}
              >
                Send another message
              </button>
            </motion.div>
          ) : (
            <>
              {/* Error Message */}
              {status === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "rounded-lg border border-rose-500/30 bg-rose-500/10 p-4",
                    "text-rose-500 text-sm"
                  )}
                >
                  {errorMessage || "Something went wrong. Please try again."}
                </motion.div>
              )}

              {/* Contact Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div className="space-y-2">
                  <label htmlFor="name" className="text-primary text-sm font-medium">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required
                    disabled={status === "loading"}
                    maxLength={100}
                    className={cn(
                      "w-full rounded-lg border border-border bg-surface px-4 py-3",
                      "text-primary placeholder:text-muted/50",
                      "focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent",
                      "transition-colors",
                      "disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-primary text-sm font-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    disabled={status === "loading"}
                    maxLength={254}
                    className={cn(
                      "w-full rounded-lg border border-border bg-surface px-4 py-3",
                      "text-primary placeholder:text-muted/50",
                      "focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent",
                      "transition-colors",
                      "disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                  />
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-primary text-sm font-medium">
                    Subject <span className="text-muted font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="What's this about?"
                    disabled={status === "loading"}
                    maxLength={200}
                    className={cn(
                      "w-full rounded-lg border border-border bg-surface px-4 py-3",
                      "text-primary placeholder:text-muted/50",
                      "focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent",
                      "transition-colors",
                      "disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                  />
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label htmlFor="message" className="text-primary text-sm font-medium">
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Your message..."
                    required
                    disabled={status === "loading"}
                    rows={5}
                    maxLength={5000}
                    className={cn(
                      "w-full rounded-lg border border-border bg-surface px-4 py-3",
                      "text-primary placeholder:text-muted/50",
                      "focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent",
                      "transition-colors resize-none",
                      "disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={status === "loading"}
                  {...(status !== "loading" && {
                    whileHover: buttonInteraction.hover,
                    whileTap: buttonInteraction.tap,
                  })}
                  className={cn(
                    "w-full flex items-center justify-center gap-2 rounded-lg px-6 py-3",
                    "bg-accent text-white font-medium",
                    "hover:bg-accent/90 transition-colors",
                    "focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Message
                    </>
                  )}
                </motion.button>
              </form>

              {/* Alternative Contact */}
              <div className="pt-4 text-center">
                <p className="text-muted text-sm">
                  Or email directly at{" "}
                  <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent hover:underline">
                    {CONTACT_EMAIL}
                  </a>
                </p>
              </div>
            </>
          )}
        </motion.article>
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-muted text-sm italic">
            Part of{" "}
            <Link href="/" className="text-accent hover:underline">
              Yield
            </Link>
            . Always happy to hear from you.
          </p>
        </div>
      </footer>
    </div>
  );
}
