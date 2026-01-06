# Yield

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React_19-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=flat&logo=vitest&logoColor=white)](https://vitest.dev/)
[![License: FSL-1.1](https://img.shields.io/badge/License-FSL--1.1-blue.svg?style=flat)](LICENSE)

**An interactive algorithm visualizer that turns data structures and algorithms into something you can actually see, step through, and understand.**

> `yield` is a JavaScript keyword that pauses execution.  
> This project does the opposite.

---

## Overview

Yield is a desktop-first algorithm visualization platform built for developers, students, and educators who want to understand *how algorithms behave*, not just memorize their complexity.

Most visualizers replay pre-recorded animations. Yield executes **real algorithm implementations** using JavaScript generators. Every comparison, swap, rotation, visit, and traversal is produced by actual code and rendered step by step. If the algorithm does something unexpected, the visualization does too.

The goal is simple: remove the mystery between pseudocode and reality. The side effect is that some algorithms are exposed for who they really are.

---

## Why Yield Exists

Reading about algorithms is one thing. Watching them fail, recover, rebalance, and occasionally embarrass themselves is another.

Yield was built to:
- Make algorithm behavior explicit
- Eliminate hand-wavy animations
- Encourage stepping, pausing, and questioning
- Let the code speak for itself

Bubble Sort, in particular, has never looked more honest.

---

## Core Features

### Real Algorithm Execution

- All algorithms are implemented as **JavaScript generators**
- Each `yield` represents a real operation
- No animation scripts or fake states
- Visualization stays perfectly synchronized with logic

### Step-Driven Playback

- Play, pause, step, reset
- Adjustable playback speed (0.5x → 4x)
- Clear completion states
- Deterministic execution for reproducible demos

### Live Code Synchronization

- Syntax-highlighted code panel
- Current line highlighted during execution
- Step labels explain what just happened
- Copy-to-clipboard support for reference

### Desktop-First UX

- Designed for mouse and keyboard
- Sidebar-driven navigation
- Hover states, focus rings, and keyboard accessibility
- Optimized for wide viewports and long sessions

### Deep Linking

- Share exact visualization states via URL
- Includes selected mode, algorithm, and inputs
- Useful for teaching, demos, and debugging conversations

---

## Algorithm Coverage

### Sorting Algorithms

| Algorithm | Notes |
|---------|------|
| Bubble Sort | For educational purposes and personal reflection |
| Selection Sort | Minimal swaps, maximal patience |
| Insertion Sort | Surprisingly effective on nearly sorted input |
| Gnome Sort | Walks forward, walks back, eventually succeeds |
| Merge Sort | Divide and conquer |
| Quick Sort | Lomuto partition scheme with visible pivots |
| Heap Sort | In-place and unapologetically unstable |

Array size and playback speed are fully adjustable.

---

### Pathfinding Algorithms

| Algorithm | Behavior |
|---------|----------|
| BFS | Uniform flood expansion |
| DFS | Deep, winding exploration |
| Dijkstra | Weighted shortest paths |
| A* | Heuristic-guided search |
| Greedy Best-First | Fast, optimistic, occasionally wrong |
| Bidirectional A* | Two frontiers, one meeting |
| Flood Fill | Complete coverage |
| Random Walk | Chaos, visualized |

Includes interactive wall drawing, draggable start/end nodes, and distance heat maps.

---

### Trees

**Data Structures**
- Binary Search Tree
- AVL Tree
- Max Heap
- Splay Tree

**Operations**
- Insert, search, delete
- In-order, pre-order, post-order, level-order traversals
- Explicit rotations and restructuring

AVL rotations and Splay operations are rendered step by step so nothing happens silently.

---

### Graph Algorithms

| Algorithm | Purpose |
|---------|--------|
| Prim’s | Minimum spanning tree |
| Kruskal’s | Union-Find driven MST |
| Kahn’s | Topological sorting and cycle detection |

Graphs support interactive node placement and edge editing.

---

## How It Works

### Generator-Driven Engine

Every algorithm is written as a generator function. Each `yield` emits a structured step describing what just occurred. The visualization engine consumes these steps and updates the UI incrementally.

This design enables:
- Pause and resume without re-execution
- Precise step inspection
- Deterministic playback
- Clean separation of logic and rendering

### State Management

- Centralized state powered by Zustand
- Domain-specific slices for sorting, pathfinding, trees, and graphs
- Fine-grained selectors to avoid unnecessary re-renders

### Rendering and Performance

- Memoized leaf components
- GPU-accelerated animations via Framer Motion
- No layout thrashing
- Designed to stay responsive even during dense visualizations

---

## Learning System

Each algorithm includes:
- A dedicated learning page
- Complexity analysis rendered with math notation
- Multi-language code examples
- Preset demos that can be launched directly

Yield is intended to be explored, not rushed.

---

## Accessibility

- Keyboard-navigable controls
- Visible focus indicators
- ARIA labels with state context
- Reduced-motion support via system preferences
- Color is never the sole signal of state

---

## Tech Stack

| Layer | Technology |
|-----|-----------|
| Framework | Next.js 16 (App Router) |
| UI | React 19 |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 |
| State | Zustand |
| Animation | Framer Motion |
| Testing | Vitest |
| Linting | Biome |
| Analytics | GA4 via GTM (consent-gated) |
| Monitoring | Sentry |

---

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm

### Setup

```bash
git clone https://github.com/dinesh-git17/yield.git
cd yield

pnpm install
pnpm dev
```

Open `http://localhost:3000` in your browser.

### Useful Scripts

```bash
pnpm dev          # Start development server
pnpm test         # Run tests
pnpm lint:check   # Lint and format check
pnpm build        # Production build
```

---

## Project Philosophy

- Algorithms should explain themselves
- Visuals should never lie
- Performance matters
- Type safety is not optional
- Fewer abstractions beat clever ones
- If something looks slow, it probably is

The time complexity of building this project was approximately O(n!) relative to sleep.

---

## Contributing

Contributions are welcome.

- Found a bug? Open an issue with reproduction steps.
- Adding an algorithm? Implement it as a generator and include tests.
- Fixing a typo? You are already improving the project.

---

## License

Functional Source License 1.1 (FSL-1.1-Apache-2.0).

On January 1, 2029, this license automatically converts to Apache 2.0.

---

Built with unreasonable attention to detail.
