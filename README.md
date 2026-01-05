# Yield

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React_19-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=flat&logo=vitest&logoColor=white)](https://vitest.dev/)
[![License: FSL-1.1](https://img.shields.io/badge/License-FSL--1.1-blue.svg?style=flat)](LICENSE)

**An interactive algorithm visualizer that makes data structures and algorithms intuitive, beautiful, and slightly less terrifying than a whiteboard interview.**

> `yield` is a JavaScript keyword that pauses generator execution. This project does the opposite: it accelerates your understanding.

<br />

## Overview

Yield began as a personal learning tool born from the realization that reading about "rotating an AVL tree" in CLRS is roughly as exciting as reading a terms of service agreement.

The goal was simple: build something that shows what actually happens inside these algorithms. What started as a study aid turned into something genuinely mesmerizing to watch. Bubble Sort struggling through a reverse-sorted array has never looked so good.

This project is now open source for anyone who wants to learn, teach, or just watch algorithms do their thing.

<br />

## Features

Yield is not just moving bars. It is a complete visualization suite across four algorithm domains.

### Sorting

The classic visualization, done right.

| Algorithm | Time Complexity | Notes |
|-----------|-----------------|-------|
| Quick Sort | O(n log n) avg | Lomuto partition scheme |
| Merge Sort | O(n log n) | Divide and conquer |
| Heap Sort | O(n log n) | In-place, not stable |
| Insertion Sort | O(n^2) | Good for nearly sorted |
| Selection Sort | O(n^2) | Minimal swaps |
| Bubble Sort | O(n^2) | For educational shaming purposes |
| Gnome Sort | O(n^2) | The zipper pattern |

Adjustable array size (5 to 50 elements) and playback speed (0.5x to 4x). Step through one operation at a time or let it run.

### Pathfinding

Watch algorithms navigate, get stuck, and find their way through a 2D grid.

| Algorithm | Optimal Path | Pattern |
|-----------|--------------|---------|
| A* | Yes | Directed expansion with heuristic |
| Dijkstra | Yes | Radial expansion |
| BFS | Yes (unweighted) | Flood fill |
| DFS | No | Deep snake exploration |
| Greedy Best-First | No | Heuristic-only, fast but blind |
| Bidirectional A* | Yes | Dual frontier meeting in the middle |
| Flood Fill | N/A | Complete coverage |
| Random Walk | No | Chaos mode |

Includes maze generation algorithms: Recursive Division (chamber-style) and Recursive Backtracker (perfect mazes with long corridors).

### Trees

Interactive hierarchical data structures with full operation visualization.

| Structure | Operations | Special Features |
|-----------|------------|------------------|
| Binary Search Tree | Insert, Search, Delete | Standard BST rules |
| AVL Tree | Insert, Search, Delete | Auto-balancing rotations (LL, RR, LR, RL) |
| Max Heap | Insert, Extract Max | Bubble up and sink down |
| Splay Tree | Insert, Search, Delete | Move-to-root via zig, zig-zig, zig-zag |

All four traversal orders (in-order, pre-order, post-order, level-order) are available with step-by-step execution.

### Graphs

Node-based algorithms for connectivity, spanning trees, and ordering.

| Algorithm | Category | Use Case |
|-----------|----------|----------|
| Prim's | Minimum Spanning Tree | Greedy edge selection from growing tree |
| Kruskal's | Minimum Spanning Tree | Union-Find with sorted edges |
| Kahn's | Topological Sort | Dependency resolution, cycle detection |

<br />

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Framework | Next.js 16 | App Router, server components |
| Language | TypeScript (strict) | Type safety, zero `any` tolerance |
| Styling | Tailwind CSS v4 | Utility-first, CSS variables for theming |
| State | Zustand | Lightweight global state |
| Animation | Framer Motion | GPU-accelerated transforms |
| Testing | Vitest | Fast unit tests for all algorithms |
| Linting | Biome | Formatting and linting in one |

<br />

## Getting Started

Prerequisites: Node.js 18 or higher and pnpm (or npm).

```bash
# Clone the repository
git clone https://github.com/dinesh-git17/yield.git
cd yield

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run tests
pnpm test

# Type check
npx tsc

# Lint
pnpm lint:check
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

<br />

## Project Structure

Feature-Sliced Design keeps concerns separated. Algorithms know nothing about React. Visualizers know nothing about algorithm internals. State flows through Zustand.

```
src/
├── app/                      # Next.js routing layer
├── features/
│   ├── algorithms/           # Pure TypeScript generators
│   │   ├── sorting/          # Bubble, Quick, Merge, Heap, etc.
│   │   ├── pathfinding/      # BFS, DFS, A*, Dijkstra, etc.
│   │   ├── tree/             # BST, AVL, Heap, Splay
│   │   ├── graph/            # Prim, Kruskal, Kahn
│   │   ├── maze/             # Recursive Division, Backtracker
│   │   └── hooks/            # Controller hooks for each domain
│   ├── visualizer/           # React components for rendering
│   │   ├── components/       # Stage components per domain
│   │   └── context/          # React contexts for state sharing
│   ├── controls/             # Playback UI, algorithm selectors
│   └── learning/             # Educational content and tooltips
├── lib/                      # Zustand store, utilities
└── ui/                       # Generic Radix-based components
```

Every algorithm is a generator function. Every step is a yielded object describing the operation. The controller consumes steps and updates visual state. No side effects in algorithm code.

<br />

## Design Philosophy

**Generators are the engine.** Every algorithm yields discrete steps (compare, swap, visit, rotate). This enables pause, step, rewind, and speed control without reimplementing logic.

**Separation of concerns.** Algorithm code is framework-agnostic. You could run it in Node, in a worker, or in the browser. The visualizer subscribes to state and renders.

**Type everything.** Every generator has explicit `Yield`, `Return`, and `Next` types. Every step type is a discriminated union. TypeScript catches mismatches at compile time.

**Performance matters.** Visualizers render at 60fps during sorting. Memoization is mandatory. Layout thrashing is forbidden. Framer Motion uses transform properties for GPU acceleration.

**Ship less code.** No abstractions for hypothetical future requirements. No feature flags for code you can just change. Three similar lines of code is better than a premature abstraction.

<br />

## Contributing

Contributions are welcome. This was built solo, so there are certainly rough edges.

**Found a bug?** Open an issue with reproduction steps.

**Adding an algorithm?** Fork the repo, implement as a generator, add tests, submit a PR.

**Fixed a typo?** You are the real MVP.

### Development Guidelines

1. **No `any`.** Use `unknown` and narrow with type guards.
2. **Performance first.** If the visualizer lags at 50 elements, something is wrong.
3. **Test edge cases.** Empty arrays, single elements, already sorted, reverse sorted.
4. **Biome is the authority.** Run `pnpm lint` before committing.

<br />

## Complexity Analysis

The time complexity of building this project was roughly O(n!) relative to my sleep schedule.

The space complexity is O(1) because it lives rent-free in my head.

<br />

## License

Functional Source License 1.1 (FSL-1.1-Apache-2.0).

You can view, fork, and contribute to this project. You cannot use it to create a competing commercial product or service. On January 1, 2029, the license converts to Apache 2.0.

See [LICENSE](LICENSE) for full terms.

<br />

---

Built with unreasonable attention to detail.
