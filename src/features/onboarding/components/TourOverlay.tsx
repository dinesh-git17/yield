"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { memo, useCallback, useEffect, useState } from "react";
import { buttonInteraction, SPRING_PRESETS } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { TOUR_STEPS, type TourStep } from "../config";
import { useOnboardingStore } from "../store";

const HIGHLIGHT_PADDING = 8;
const TOOLTIP_WIDTH = 320;
const TOOLTIP_HEIGHT_ESTIMATE = 260;
const VIEWPORT_PADDING = 24;

interface TooltipPosition {
  left: number;
  top: number;
}

function calculateTooltipPosition(
  targetRect: DOMRect,
  position: TourStep["position"],
  tooltipWidth: number
): TooltipPosition {
  const gap = 16;
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;

  let left: number;
  let top: number;

  switch (position) {
    case "right":
      left = targetRect.right + gap;
      top = targetRect.top;
      break;
    case "left":
      left = targetRect.left - tooltipWidth - gap;
      top = targetRect.top;
      break;
    case "bottom":
      left = targetRect.left;
      top = targetRect.bottom + gap;
      break;
    case "top":
      left = targetRect.left;
      top = targetRect.top - gap;
      break;
  }

  // Clamp top to prevent overflow at bottom of viewport
  const maxTop = viewportHeight - TOOLTIP_HEIGHT_ESTIMATE - VIEWPORT_PADDING;
  top = Math.min(top, maxTop);
  top = Math.max(top, VIEWPORT_PADDING);

  // Clamp left to prevent horizontal overflow
  const maxLeft = viewportWidth - tooltipWidth - VIEWPORT_PADDING;
  left = Math.min(left, maxLeft);
  left = Math.max(left, VIEWPORT_PADDING);

  return { left, top };
}

const MOBILE_BREAKPOINT = 768;

export const TourOverlay = memo(function TourOverlay() {
  const isActive = useOnboardingStore((state) => state.isActive);
  const currentStepIndex = useOnboardingStore((state) => state.currentStepIndex);
  const nextStep = useOnboardingStore((state) => state.nextStep);
  const prevStep = useOnboardingStore((state) => state.prevStep);
  const endTour = useOnboardingStore((state) => state.endTour);

  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile viewport - tour targets desktop sidebar elements
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const step = TOUR_STEPS[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === TOUR_STEPS.length - 1;

  const handleNext = useCallback(() => {
    if (isLastStep) {
      endTour();
    } else {
      nextStep();
    }
  }, [isLastStep, endTour, nextStep]);

  const handlePrev = useCallback(() => {
    prevStep();
  }, [prevStep]);

  const handleSkip = useCallback(() => {
    endTour();
  }, [endTour]);

  useEffect(() => {
    if (!isActive || !step) {
      setTargetRect(null);
      setTooltipPosition(null);
      return;
    }

    let isScrolling = false;

    const updateRect = () => {
      // Don't update while programmatic scroll is in progress
      if (isScrolling) return;

      const element = document.querySelector(`[data-tour-id="${step.targetId}"]`);
      if (element) {
        const rect = element.getBoundingClientRect();
        // Skip if element is hidden (zero dimensions)
        if (rect.width === 0 || rect.height === 0) {
          return;
        }

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Clamp the rect to viewport bounds before adding padding
        const clampedLeft = Math.max(0, rect.left);
        const clampedTop = Math.max(0, rect.top);
        const clampedRight = Math.min(viewportWidth, rect.right);
        const clampedBottom = Math.min(viewportHeight, rect.bottom);

        // Apply padding but keep within viewport
        const paddedLeft = Math.max(0, clampedLeft - HIGHLIGHT_PADDING);
        const paddedTop = Math.max(0, clampedTop - HIGHLIGHT_PADDING);
        const paddedRight = Math.min(viewportWidth, clampedRight + HIGHLIGHT_PADDING);
        const paddedBottom = Math.min(viewportHeight, clampedBottom + HIGHLIGHT_PADDING);

        const paddedRect = {
          left: paddedLeft,
          top: paddedTop,
          width: paddedRight - paddedLeft,
          height: paddedBottom - paddedTop,
          right: paddedRight,
          bottom: paddedBottom,
          x: paddedLeft,
          y: paddedTop,
          toJSON: rect.toJSON.bind(rect),
        } as DOMRect;

        setTargetRect(paddedRect);

        const pos = calculateTooltipPosition(paddedRect, step.position, TOOLTIP_WIDTH);
        setTooltipPosition(pos);
      }
    };

    // Scroll target into view first, then measure after scroll completes
    let scrollTimer: ReturnType<typeof setTimeout> | null = null;
    const scrollAndMeasure = () => {
      const element = document.querySelector(`[data-tour-id="${step.targetId}"]`);
      if (element) {
        isScrolling = true;
        element.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
        // Wait for smooth scroll to complete before measuring
        scrollTimer = setTimeout(() => {
          isScrolling = false;
          updateRect();
        }, 350);
      } else {
        updateRect();
      }
    };

    scrollAndMeasure();
    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, true);

    const timer = setTimeout(updateRect, 500);

    return () => {
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect, true);
      clearTimeout(timer);
      if (scrollTimer) clearTimeout(scrollTimer);
    };
  }, [isActive, step]);

  // Don't show tour on mobile - sidebar elements are hidden
  if (isMobile) {
    return null;
  }

  return (
    <AnimatePresence>
      {isActive && step && targetRect && tooltipPosition && (
        <div className="fixed inset-0 z-[100]">
          {/* Backdrop with cutout using clip-path */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
            style={{
              clipPath: `polygon(
                0% 0%,
                0% 100%,
                ${targetRect.left}px 100%,
                ${targetRect.left}px ${targetRect.top}px,
                ${targetRect.right}px ${targetRect.top}px,
                ${targetRect.right}px ${targetRect.bottom}px,
                ${targetRect.left}px ${targetRect.bottom}px,
                ${targetRect.left}px 100%,
                100% 100%,
                100% 0%
              )`,
            }}
            onClick={handleSkip}
            aria-hidden="true"
          />

          {/* Active Highlight Border */}
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={SPRING_PRESETS.snappy}
            className="pointer-events-none absolute rounded-lg border-2 border-accent shadow-[0_0_20px_rgba(94,106,210,0.4)]"
            style={{
              left: targetRect.left,
              top: targetRect.top,
              width: targetRect.width,
              height: targetRect.height,
            }}
          />

          {/* Tooltip Card */}
          <motion.div
            key={currentStepIndex}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={SPRING_PRESETS.entrance}
            className={cn(
              "absolute w-80 rounded-xl border p-4",
              "border-border bg-surface/95 shadow-2xl backdrop-blur-md"
            )}
            style={{
              left: tooltipPosition.left,
              top: tooltipPosition.top,
            }}
          >
            {/* Header */}
            <div className="mb-3 flex items-start justify-between">
              <span className="text-accent text-xs font-semibold uppercase tracking-wider">
                Step {currentStepIndex + 1} of {TOUR_STEPS.length}
              </span>
              <button
                type="button"
                onClick={handleSkip}
                className="text-muted hover:text-primary -mr-1 -mt-1 rounded p-1 transition-colors"
                aria-label="Skip tour"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            <h3 className="text-primary mb-2 text-lg font-bold">{step.title}</h3>
            <p className="text-muted mb-4 text-sm leading-relaxed">{step.description}</p>

            {/* Footer */}
            <div className="flex items-center justify-between">
              {/* Progress dots */}
              <div className="flex gap-1.5">
                {TOUR_STEPS.map((tourStep, idx) => (
                  <div
                    key={tourStep.targetId}
                    className={cn(
                      "h-1.5 w-1.5 rounded-full transition-colors",
                      idx === currentStepIndex ? "bg-accent" : "bg-border"
                    )}
                  />
                ))}
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center gap-2">
                {!isFirstStep && (
                  <motion.button
                    type="button"
                    whileHover={buttonInteraction.hover}
                    whileTap={buttonInteraction.tap}
                    onClick={handlePrev}
                    className={cn(
                      "flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium",
                      "border-border bg-surface-elevated text-primary hover:bg-surface border transition-colors"
                    )}
                    aria-label="Previous step"
                  >
                    <ChevronLeft className="h-3 w-3" />
                    Back
                  </motion.button>
                )}

                <motion.button
                  type="button"
                  whileHover={buttonInteraction.hover}
                  whileTap={buttonInteraction.tap}
                  onClick={handleNext}
                  className={cn(
                    "flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium",
                    "bg-accent text-white hover:bg-accent/90 transition-colors"
                  )}
                >
                  {isLastStep ? "Finish" : "Next"}
                  {!isLastStep && <ChevronRight className="h-3 w-3" />}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});
