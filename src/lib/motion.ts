"use client";

import type { Transition, Variants } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Spring physics presets for Framer Motion animations.
 * - layout: Snappy springs for bar/layout animations (500 stiffness)
 * - entrance: Gentler springs for shell entrance (400 stiffness per Epic spec)
 */
export const SPRING_PRESETS = {
  layout: {
    type: "spring",
    stiffness: 500,
    damping: 30,
    mass: 1,
  } as const satisfies Transition,
  entrance: {
    type: "spring",
    stiffness: 400,
    damping: 30,
  } as const satisfies Transition,
  snappy: {
    type: "spring",
    stiffness: 500,
    damping: 25,
  } as const satisfies Transition,
} as const;

/**
 * Tactile button interaction states.
 * Use with whileHover and whileTap props on motion.button.
 */
export const buttonInteraction = {
  hover: { scale: 1.05, y: -1 },
  tap: { scale: 0.95 },
} as const;

/**
 * Hook to detect user's reduced motion preference (WCAG AA compliance).
 * Returns true if the user prefers reduced motion.
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return prefersReducedMotion;
}

/**
 * Stagger container variant for orchestrating child animations.
 * Use with `variants` prop on parent motion element.
 */
export const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

/**
 * Panel entrance variants for app shell components.
 * Each variant animates from hidden to visible with spring physics.
 */
export const panelVariants = {
  slideFromLeft: {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: SPRING_PRESETS.entrance,
    },
  } satisfies Variants,

  slideFromRight: {
    hidden: { x: 20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: SPRING_PRESETS.entrance,
    },
  } satisfies Variants,

  fadeScale: {
    hidden: { scale: 0.98, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: SPRING_PRESETS.entrance,
    },
  } satisfies Variants,
} as const;

/**
 * Badge pop-in animation for complexity indicators.
 * Use with initial/animate props on motion elements.
 */
export const badgeVariants: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 25,
      delay: 0.3,
    },
  },
};
