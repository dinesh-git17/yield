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
    targetId: "tour-info-icon",
    title: "Compare Algorithms",
    description:
      "Click this icon to see a side-by-side comparison of all algorithms in this category.",
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
    targetId: "tour-complexity",
    title: "Check Complexity",
    description:
      "View Big-O notation and performance characteristics of the current algorithm at a glance.",
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
  {
    targetId: "tour-code",
    title: "Follow the Code",
    description:
      "Watch the algorithm's code execute line-by-line. The highlighted line shows exactly what's happening.",
    position: "left",
  },
];
