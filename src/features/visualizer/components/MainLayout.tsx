"use client";

import { ChevronsRight } from "lucide-react";
import { cloneElement, isValidElement, type ReactElement, type ReactNode, useState } from "react";
import { cn } from "@/lib/utils";
import type { SidebarProps } from "./Sidebar";

export interface MainLayoutProps {
  sidebar: ReactElement<SidebarProps>;
  canvas: ReactNode;
  codePanel: ReactNode;
}

export function MainLayout({ sidebar, canvas, codePanel }: MainLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const sidebarWithProps = isValidElement(sidebar)
    ? cloneElement(sidebar, { onCollapse: () => setSidebarCollapsed(true) })
    : sidebar;

  return (
    <div
      className={cn(
        "grid h-screen w-screen grid-rows-[1fr] max-md:grid-cols-[1fr] max-md:grid-rows-[auto_1fr_auto]",
        sidebarCollapsed
          ? "grid-cols-[48px_1fr_420px] md:grid-cols-[48px_1fr_420px]"
          : "grid-cols-[180px_1fr_420px] md:grid-cols-[180px_1fr_420px]"
      )}
    >
      {/* Sidebar - Hidden on mobile, shown on desktop */}
      <aside
        className={cn(
          "border-border-subtle bg-surface max-md:hidden flex flex-col border-r transition-all duration-200",
          sidebarCollapsed && "items-center"
        )}
      >
        {sidebarCollapsed ? (
          <button
            type="button"
            onClick={() => setSidebarCollapsed(false)}
            className="text-muted hover:text-primary hover:bg-border/50 m-2 rounded-md p-2 transition-colors"
            aria-label="Expand sidebar"
          >
            <ChevronsRight className="h-4 w-4" />
          </button>
        ) : (
          sidebarWithProps
        )}
      </aside>

      {/* Canvas - Main visualization area */}
      <main className="bg-background relative flex flex-col overflow-hidden">{canvas}</main>

      {/* Code Panel - Hidden on mobile, shown on desktop */}
      <aside className="border-border-subtle bg-surface max-md:hidden flex flex-col border-l">
        {codePanel}
      </aside>
    </div>
  );
}
