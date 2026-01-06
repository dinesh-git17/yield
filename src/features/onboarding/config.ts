export interface TourStep {
  targetId: string;
  title: string;
  description: string;
  position: "right" | "bottom" | "top" | "left";
}

export const TOUR_STEPS: TourStep[] = [
  {
    targetId: "tour-modes",
    title: "Choose Your Mode",
    description:
      "Start by selecting a category. We support Sorting, Pathfinding, Trees, and Graph algorithms.",
    position: "right",
  },
  {
    targetId: "tour-algo-list",
    title: "Pick an Algorithm",
    description:
      "Select a specific algorithm to visualize. You can compare different approaches here.",
    position: "right",
  },
  {
    targetId: "tour-theory",
    title: "Understand the Theory",
    description:
      "Dive deep into the computer science concepts, time complexity, and real-world use cases.",
    position: "right",
  },
  {
    targetId: "tour-learn",
    title: "Interactive Guide",
    description:
      "Switch to 'Learn' mode for a step-by-step interactive tutorial on the selected algorithm.",
    position: "right",
  },
];
