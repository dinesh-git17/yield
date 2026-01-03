import {
  Canvas,
  CodePanel,
  MainLayout,
  Sidebar,
  SortingProvider,
} from "@/features/visualizer/components";

export default function Home() {
  return (
    <SortingProvider>
      <MainLayout sidebar={<Sidebar />} canvas={<Canvas />} codePanel={<CodePanel />} />
    </SortingProvider>
  );
}
