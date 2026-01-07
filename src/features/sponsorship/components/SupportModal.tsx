"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CircleX, Coffee, Github, Heart } from "lucide-react";
import { memo, useCallback, useEffect } from "react";

import { trackSupportLinkClick, trackSupportModalOpen } from "@/lib/analytics/hooks";
import { SPONSOR_PLATFORMS } from "@/lib/constants/sponsors";
import { buttonInteraction } from "@/lib/motion";
import { cn } from "@/lib/utils";

import { useSponsorship } from "../context/SponsorshipContext";

const BACKDROP_VARIANTS = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
} as const;

const MODAL_VARIANTS = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 30,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: {
      duration: 0.15,
    },
  },
} as const;

const PLATFORM_ICONS = {
  kofi: Coffee,
  bmc: Coffee,
  github: Github,
} as const;

const PLATFORM_COLORS = {
  kofi: "hover:bg-rose-500/20 hover:border-rose-500/30 hover:text-rose-400",
  bmc: "hover:bg-amber-500/20 hover:border-amber-500/30 hover:text-amber-400",
  github: "hover:bg-violet-500/20 hover:border-violet-500/30 hover:text-violet-400",
} as const;

function SupportModalComponent() {
  const { isModalOpen, modalSource, closeModal } = useSponsorship();

  // Track modal open
  useEffect(() => {
    if (isModalOpen && modalSource) {
      trackSupportModalOpen(modalSource);
    }
  }, [isModalOpen, modalSource]);

  // Close on escape key
  useEffect(() => {
    if (!isModalOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isModalOpen, closeModal]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        closeModal();
      }
    },
    [closeModal]
  );

  const handleLinkClick = useCallback(
    (platformId: "kofi" | "bmc" | "github") => {
      if (modalSource) {
        trackSupportLinkClick(platformId, modalSource);
      }
    },
    [modalSource]
  );

  return (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          variants={BACKDROP_VARIANTS}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={handleBackdropClick}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            variants={MODAL_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              "relative w-full max-w-sm overflow-hidden rounded-2xl",
              "border border-white/10 bg-white/10 backdrop-blur-xl",
              "dark:border-white/5 dark:bg-black/40",
              "shadow-2xl shadow-black/20"
            )}
            role="dialog"
            aria-modal="true"
            aria-labelledby="support-modal-title"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <div className="flex items-center gap-2">
                <Heart className="text-rose-400 h-5 w-5" />
                <h2 id="support-modal-title" className="text-primary text-lg font-semibold">
                  Support Yield
                </h2>
              </div>

              <motion.button
                type="button"
                onClick={closeModal}
                whileHover={buttonInteraction.hover}
                whileTap={buttonInteraction.tap}
                className="text-muted hover:text-primary rounded-full p-1 transition-colors"
                aria-label="Close modal"
              >
                <CircleX className="h-5 w-5" />
              </motion.button>
            </div>

            {/* Content */}
            <div className="space-y-5 p-6">
              {/* Message */}
              <p className="text-primary/80 text-sm leading-relaxed">
                Yield is free and ad-free. Your support keeps it that way and helps fund new
                features and algorithms.
              </p>

              {/* Sponsor Links */}
              <div className="space-y-3">
                {SPONSOR_PLATFORMS.map((platform) => {
                  const Icon = PLATFORM_ICONS[platform.id];
                  return (
                    <motion.a
                      key={platform.id}
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleLinkClick(platform.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        "flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4",
                        "text-primary transition-colors",
                        PLATFORM_COLORS[platform.id]
                      )}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      <div className="min-w-0">
                        <div className="font-medium">{platform.name}</div>
                        <div className="text-muted text-xs">{platform.description}</div>
                      </div>
                    </motion.a>
                  );
                })}
              </div>

              {/* Footer note */}
              <p className="text-muted text-center text-xs">
                Every contribution makes a difference.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export const SupportModal = memo(SupportModalComponent);
