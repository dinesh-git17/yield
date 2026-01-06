"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { ChevronsLeft, Menu, X } from "lucide-react";
import {
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useCallback,
  useState,
} from "react";
import {
  buttonInteraction,
  panelVariants,
  SPRING_PRESETS,
  staggerContainerVariants,
  useReducedMotion,
} from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import type { SidebarProps } from "./Sidebar";

const SIDEBAR_EXPANDED_WIDTH = 180;
const SIDEBAR_COLLAPSED_WIDTH = 48;

export interface MainLayoutProps {
  sidebar: ReactElement<SidebarProps>;
  canvas: ReactNode;
  codePanel: ReactNode;
}

export function MainLayout({ sidebar, canvas, codePanel }: MainLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const sidebarWithProps = isValidElement(sidebar)
    ? cloneElement(sidebar, { onCollapse: () => setSidebarCollapsed(true) })
    : sidebar;

  const mobileSidebarWithProps = isValidElement(sidebar)
    ? cloneElement(sidebar, { hideHeader: true })
    : sidebar;

  const sidebarWidth = sidebarCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH;

  const closeMobileDrawer = useCallback(() => setMobileDrawerOpen(false), []);
  const openMobileDrawer = useCallback(() => setMobileDrawerOpen(true), []);

  return (
    <LayoutGroup>
      <motion.div
        variants={staggerContainerVariants}
        initial={prefersReducedMotion ? false : "hidden"}
        animate="visible"
        className="grid h-dvh w-screen grid-cols-[auto_1fr_420px] grid-rows-[1fr] max-md:grid-cols-[1fr] max-md:grid-rows-[1fr]"
      >
        {/* Sidebar - Hidden on mobile, shown on desktop */}
        <motion.aside
          layout
          variants={panelVariants.slideFromLeft}
          animate={{ width: sidebarWidth }}
          transition={SPRING_PRESETS.entrance}
          className="border-border-subtle bg-surface hidden flex-col overflow-hidden border-r md:flex"
        >
          {/* Collapsed state: just the toggle button */}
          <AnimatePresence mode="wait">
            {sidebarCollapsed ? (
              <motion.div
                key="collapsed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex h-full flex-col items-center pt-2"
              >
                <SidebarToggleButton
                  isCollapsed={sidebarCollapsed}
                  onClick={() => setSidebarCollapsed(false)}
                />
              </motion.div>
            ) : (
              <motion.div
                key="expanded"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, delay: sidebarCollapsed ? 0 : 0.1 }}
                className="flex h-full flex-col"
              >
                {sidebarWithProps}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.aside>

        {/* Canvas - Main visualization area */}
        <motion.main
          layout
          variants={panelVariants.fadeScale}
          className="bg-background relative flex min-h-0 flex-col overflow-hidden"
        >
          {canvas}
        </motion.main>

        {/* Code Panel - Hidden on mobile, shown on desktop */}
        <motion.aside
          layout
          variants={panelVariants.slideFromRight}
          className="border-border-subtle bg-surface hidden flex-col overflow-hidden border-l md:flex"
        >
          {codePanel}
        </motion.aside>
      </motion.div>

      {/* Mobile Hamburger Button - Fixed in top-left corner */}
      <motion.button
        type="button"
        onClick={openMobileDrawer}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={SPRING_PRESETS.entrance}
        className={cn(
          "fixed top-3 left-3 z-40 flex h-10 w-10 items-center justify-center rounded-lg md:hidden",
          "bg-surface-elevated/95 border-border border shadow-lg backdrop-blur-sm",
          "text-primary hover:bg-surface-elevated transition-colors"
        )}
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5" />
      </motion.button>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-background/80 fixed inset-0 z-50 backdrop-blur-sm md:hidden"
              onClick={closeMobileDrawer}
              aria-hidden="true"
            />

            {/* Drawer Panel */}
            <motion.div
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={SPRING_PRESETS.entrance}
              className={cn(
                "bg-surface border-border-subtle fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r md:hidden"
              )}
            >
              {/* Drawer Header */}
              <div className="border-border-subtle flex h-14 items-center justify-between border-b px-4">
                <Logo />
                <motion.button
                  type="button"
                  onClick={closeMobileDrawer}
                  whileHover={buttonInteraction.hover}
                  whileTap={buttonInteraction.tap}
                  className="text-muted hover:text-primary hover:bg-border/50 rounded-md p-1.5 transition-colors"
                  aria-label="Close navigation menu"
                >
                  <X className="h-5 w-5" />
                </motion.button>
              </div>

              {/* Drawer Content - Sidebar without header */}
              <div className="flex-1 overflow-y-auto">{mobileSidebarWithProps}</div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}

interface SidebarToggleButtonProps {
  isCollapsed: boolean;
  onClick: () => void;
}

function SidebarToggleButton({ isCollapsed, onClick }: SidebarToggleButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={buttonInteraction.hover}
      whileTap={buttonInteraction.tap}
      className="text-muted hover:text-primary hover:bg-border/50 rounded-md p-2 transition-colors"
      aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
    >
      <motion.span
        className="block"
        animate={{ rotate: isCollapsed ? 180 : 0 }}
        transition={SPRING_PRESETS.snappy}
      >
        <ChevronsLeft className="h-4 w-4" />
      </motion.span>
    </motion.button>
  );
}
