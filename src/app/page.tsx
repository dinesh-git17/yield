import type { Metadata } from "next";
import { Suspense } from "react";
import {
  Canvas,
  CodePanel,
  GraphProvider,
  InterviewProvider,
  MainLayout,
  PathfindingProvider,
  PatternProvider,
  Sidebar,
  SortingProvider,
  TreeProvider,
  UrlStateSync,
} from "@/features/visualizer/components";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <SortingProvider>
      <PathfindingProvider>
        <TreeProvider>
          <GraphProvider>
            <InterviewProvider>
              <PatternProvider>
                {/* Sync URL params to store (enables deep linking) */}
                <Suspense fallback={null}>
                  <UrlStateSync />
                </Suspense>
                <MainLayout sidebar={<Sidebar />} canvas={<Canvas />} codePanel={<CodePanel />} />
              </PatternProvider>
            </InterviewProvider>
          </GraphProvider>
        </TreeProvider>
      </PathfindingProvider>
    </SortingProvider>
  );
}
