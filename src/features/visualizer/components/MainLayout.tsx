"use client";

import type { ReactNode } from "react";

export interface MainLayoutProps {
  sidebar: ReactNode;
  canvas: ReactNode;
  codePanel: ReactNode;
}

export function MainLayout({ sidebar, canvas, codePanel }: MainLayoutProps) {
  return (
    <div className="grid h-screen w-screen grid-cols-[260px_1fr_300px] grid-rows-[1fr] md:grid-cols-[260px_1fr_300px] max-md:grid-cols-[1fr] max-md:grid-rows-[auto_1fr_auto]">
      {/* Sidebar - Hidden on mobile, shown on desktop */}
      <aside className="border-border-subtle bg-surface max-md:hidden flex flex-col border-r">
        {sidebar}
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
