import {
  Canvas,
  CodePanel,
  GraphProvider,
  MainLayout,
  PathfindingProvider,
  Sidebar,
  SortingProvider,
  TreeProvider,
} from "@/features/visualizer/components";

export default function Home() {
  return (
    <SortingProvider>
      <PathfindingProvider>
        <TreeProvider>
          <GraphProvider>
            <MainLayout sidebar={<Sidebar />} canvas={<Canvas />} codePanel={<CodePanel />} />
          </GraphProvider>
        </TreeProvider>
      </PathfindingProvider>
    </SortingProvider>
  );
}
