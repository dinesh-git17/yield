"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { ChevronsLeft } from "lucide-react";
import { cloneElement, isValidElement, type ReactElement, type ReactNode, useState } from "react";
import {
  buttonInteraction,
  panelVariants,
  SPRING_PRESETS,
  staggerContainerVariants,
  useReducedMotion,
} from "@/lib/motion";
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
  const prefersReducedMotion = useReducedMotion();

  const sidebarWithProps = isValidElement(sidebar)
    ? cloneElement(sidebar, { onCollapse: () => setSidebarCollapsed(true) })
    : sidebar;

  const sidebarWidth = sidebarCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH;

  return (
    <LayoutGroup>
      <motion.div
        variants={staggerContainerVariants}
        initial={prefersReducedMotion ? false : "hidden"}
        animate="visible"
        className="grid h-screen w-screen grid-cols-[auto_1fr_420px] grid-rows-[1fr] max-md:grid-cols-[1fr] max-md:grid-rows-[auto_1fr_auto]"
      >
        {/* Sidebar - Hidden on mobile, shown on desktop */}
        <motion.aside
          layout
          variants={panelVariants.slideFromLeft}
          animate={{ width: sidebarWidth }}
          transition={SPRING_PRESETS.entrance}
          className="border-border-subtle bg-surface max-md:hidden flex flex-col overflow-hidden border-r"
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
          className="bg-background relative flex flex-col overflow-hidden"
        >
          {canvas}
        </motion.main>

        {/* Code Panel - Hidden on mobile, shown on desktop */}
        <motion.aside
          layout
          variants={panelVariants.slideFromRight}
          className="border-border-subtle bg-surface max-md:hidden flex flex-col border-l"
        >
          {codePanel}
        </motion.aside>
      </motion.div>
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
