# Yield

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)

**Yield** is an interactive, modern algorithm visualizer built to make Computer Science concepts intuitive, beautiful, and slightly less terrifying than a whiteboard interview.

> **Note:** `yield` is a keyword in JavaScript generators. It pauses execution. This project does the exact opposite—it speeds up your understanding.

---

## The Story

This project started as a personal portfolio piece. I was grinding LeetCode and reading *Introduction to Algorithms* (CLRS), and I realized that reading about "rotating an AVL tree" is roughly as exciting as reading a terms of service agreement.

I built **Yield** to visualize what was happening inside the CPU. It started as a way to help me learn, but I realized the visualizations were actually... kind of mesmerizing.

I’ve decided to **open source** it for the community. Whether you're a student trying to pass CS101, a bootcamp grad prepping for interviews, or a senior engineer who just likes watching Bubble Sort struggle, this is for you.

---

## Features

Yield isn't just a bunch of moving bars. It's a full educational suite.

### Pathfinding
Visualizations on a 2D grid. Watch algorithms navigate mazes, get stuck in corners, and find the optimal route.
* **Algorithms:** A*, Dijkstra, Breadth-First Search (BFS), Depth-First Search (DFS), Greedy Best-First, Bidirectional A*.
* **Features:** Maze generation (Recursive Division), wall drawing, and weight painting.

### Sorting
The classic "satisfying bars" visualization, but with detailed explanations.
* **Algorithms:** Quick Sort, Merge Sort, Heap Sort, Bubble Sort (for shaming purposes), Insertion Sort, Selection Sort, Gnome Sort.
* **Features:** Adjustable speed and array size. Watch the time complexity unfold in real-time.

### Trees
Interactive hierarchical data structures.
* **Structures:** Binary Search Trees (BST), AVL Trees (Self-balancing), Max Heaps, Splay Trees.
* **Features:** Insert, Delete, and Search operations visualized with proper node animations. Watch an AVL tree perform a rotation to save its dignity.

### Graphs
Node-based visualizations for connectivity and dependencies.
* **Algorithms:** Prim's (MST), Kruskal's (MST with Union-Find), Kahn's (Topological Sort).
* **Features:** Cycle detection and dependency resolution.

---

## Tech Stack

Built with a focus on performance, type safety, and smooth animations.

<p align="left">
  <a href="https://nextjs.org/" target="_blank">
    <img src="https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  </a>
  <a href="https://www.typescriptlang.org/" target="_blank">
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  </a>
  <a href="https://tailwindcss.com/" target="_blank">
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS" />
  </a>
  <a href="https://www.framer.com/motion/" target="_blank">
    <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
  </a>
  <a href="https://github.com/pmndrs/zustand" target="_blank">
    <img src="https://img.shields.io/badge/Zustand-orange?style=for-the-badge&logo=react&logoColor=white" alt="Zustand" />
  </a>
</p>

* **Framework:** Next.js 14 (App Router)
* **Language:** TypeScript (Strict mode)
* **Styling:** Tailwind CSS
* **State Management:** Zustand
* **Animations:** Framer Motion

---

## Getting Started

Prerequisites: You need Node.js installed.

1.  **Clone the repo**
    ```bash
    git clone [https://github.com/your-username/yield.git](https://github.com/your-username/yield.git)
    cd yield
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

4.  **Open your browser**
    Navigate to `http://localhost:3000`.

---

## Project Structure

A quick map of the territory so you don't get lost in the `src` folder.

```text
src/
├── app/                  # Next.js App Router pages
├── features/             # The meat of the application
│   ├── algorithms/       # The actual math. Pure TS logic.
│   │   ├── sorting/      # Sorting implementations
│   │   ├── pathfinding/  # Pathfinding logic & grids
│   │   ├── tree/         # Tree data structures
│   │   └── graph/        # Graph algorithms
│   ├── visualizer/       # React components for the canvas/stage
│   ├── controls/         # The UI buttons (Speed, Play/Pause)
│   └── learning/         # The educational text content
└── lib/                  # Shared utilities and global store
```

---

## Contributing

Contributions are welcome! I developed this solo, so there are undoubtedly bugs.

* **Found a bug?** Open an issue.
* **Want to add an algorithm?** Fork the repo and submit a PR.
* **Fixed a typo?** You are the real MVP.

**Development Philosophy:**
1.  **Type Safety:** `any` is forbidden.
2.  **Performance:** If the visualizer lags at 100 array items, it needs optimization.
3.  **Fun:** Keep the variable names professional, but the comments can have personality.

---

## Complexity

For those keeping score, the time complexity of building this project was roughly `O(n!)` relative to my sleep schedule.

However, the space complexity is `O(1)` because it lives rent-free in my head.

---

## License

Distributed under the MIT License. See `LICENSE` for more information.

---

*Built by [Your Name]*
