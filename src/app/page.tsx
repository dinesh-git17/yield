import {
  Canvas,
  CodePanel,
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
          <MainLayout sidebar={<Sidebar />} canvas={<Canvas />} codePanel={<CodePanel />} />
        </TreeProvider>
      </PathfindingProvider>
    </SortingProvider>
  );
}
