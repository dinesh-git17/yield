import {
  Canvas,
  CodePanel,
  MainLayout,
  PathfindingProvider,
  Sidebar,
  SortingProvider,
} from "@/features/visualizer/components";

export default function Home() {
  return (
    <SortingProvider>
      <PathfindingProvider>
        <MainLayout sidebar={<Sidebar />} canvas={<Canvas />} codePanel={<CodePanel />} />
      </PathfindingProvider>
    </SortingProvider>
  );
}
