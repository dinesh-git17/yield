"use client";

import type { TargetAndTransition } from "framer-motion";
import { motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useMemo } from "react";
import { SPRING_PRESETS, useReducedMotion } from "@/lib/motion";
import { useSorting } from "../context";

const LOGO_ANIMATION = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1 },
  transition: {
    opacity: { duration: 0.3, ease: "easeOut" },
    scale: SPRING_PRESETS.entrance,
  },
} as const;

const HOVER_BRIGHTNESS = 1.08;
const CLICK_SCALE = 0.96;

export interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  const { reset, pause } = useSorting();
  const prefersReducedMotion = useReducedMotion();

  const handleClick = useCallback(() => {
    pause();
    reset();
  }, [pause, reset]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleClick();
      }
    },
    [handleClick]
  );

  const hoverAnimation: TargetAndTransition = useMemo(
    () => (prefersReducedMotion ? {} : { filter: `brightness(${HOVER_BRIGHTNESS})` }),
    [prefersReducedMotion]
  );

  const tapAnimation: TargetAndTransition = useMemo(
    () => (prefersReducedMotion ? {} : { scale: CLICK_SCALE }),
    [prefersReducedMotion]
  );

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      initial={prefersReducedMotion ? false : LOGO_ANIMATION.initial}
      animate={LOGO_ANIMATION.animate}
      transition={prefersReducedMotion ? { duration: 0 } : LOGO_ANIMATION.transition}
      whileHover={hoverAnimation}
      whileTap={tapAnimation}
      className={className}
      aria-label="Yield — Reset visualization and return to home"
      style={{ cursor: "pointer" }}
    >
      <Image
        src="/logo/logo.png"
        alt="Yield"
        width={100}
        height={40}
        priority
        className="h-7 w-auto object-contain"
      />
    </motion.button>
  );
}
