import { Canvas, CodePanel, MainLayout, Sidebar } from "@/features/visualizer/components";

export default function Home() {
  return <MainLayout sidebar={<Sidebar />} canvas={<Canvas />} codePanel={<CodePanel />} />;
}
