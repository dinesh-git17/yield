import type { GraphAlgorithmType } from "@/lib/store";

/**
 * Educational article content for graph algorithms.
 * This registry contains all the textbook-style content for the Learn pages.
 * Theme: "Spanning Trees & Dependencies."
 */
export interface GraphArticle {
  /** Display name of the algorithm */
  title: string;
  /** A catchy one-liner describing the essence */
  tagline: string;
  /** Historical background and origin story */
  history: string;
  /** Step-by-step explanation of how the algorithm works */
  mechanics: string;
  /** Time complexity with explanation (uses V for vertices, E for edges) */
  timeComplexity: {
    complexity: string;
    explanation: string;
  };
  /** Space complexity */
  spaceComplexity: {
    complexity: string;
    explanation: string;
  };
  /** What the algorithm produces (MST, Topological Order, etc.) */
  output: string;
  /** The key data structure powering this algorithm */
  dataStructure: string;
  /** Real-world applications and use cases */
  useCases: string[];
  /** Key insights and takeaways */
  keyInsights: string[];
  /** When to use this algorithm */
  whenToUse: string;
  /** When NOT to use this algorithm */
  whenNotToUse: string;
  /** Common interview focus or pitfall */
  interviewTip: string;
  /** Visual pattern description for the visualization */
  visualPattern: string;
}

/**
 * Complete content registry for all graph algorithms.
 */
export const GRAPH_ARTICLES: Record<GraphAlgorithmType, GraphArticle> = {
  prim: {
    title: "Prim's Algorithm",
    tagline: "The Greedy Architect",
    history: `This algorithm is a classic case of "scientific rediscovery." It was originally developed by Czech mathematician Vojtěch Jarník in 1930, then rediscovered by Robert Prim in 1957, and then *again* by Dijkstra in 1959.

It solves the "Minimum Spanning Tree" (MST) problem: how do you connect every city in a country with the least amount of road, without creating any loops?`,

    mechanics: `Prim's Algorithm grows a single tree from a starting seed. It feels very similar to Dijkstra's Algorithm, but with a different goal.

**The Algorithm Step-by-Step:**

1. **Start**: Pick an arbitrary node to be the "seed" of the tree.
2. **Inspect**: Look at all edges connecting the *inside* of the tree to the *outside* world.
3. **Select**: Pick the edge with the smallest weight.
4. **Grow**: Add that edge and the new node to the tree.
5. **Repeat**: Keep adding the cheapest connection until all nodes are included.

**The Difference from Dijkstra:**
Dijkstra picks the next node based on the *total distance from the start*. Prim picks the next node based on the *shortest single jump* from the current tree.`,

    timeComplexity: {
      complexity: "O(E log V)",
      explanation:
        "We process every edge ($E$) and push/pop from a Priority Queue ($log V$). With a Fibonacci Heap, you can optimize this further.",
    },
    spaceComplexity: {
      complexity: "O(V + E)",
      explanation: "We need to store the graph and the priority queue.",
    },
    output: "Minimum Spanning Tree (MST)",
    dataStructure: "Priority Queue (Min-Heap)",
    visualPattern:
      "A mold growing outward. It starts at one spot and slowly consumes the graph via the cheapest available path.",

    useCases: [
      "Network Cabling (connecting servers with minimal wire)",
      "Road Network Design",
      "Cluster Analysis in Machine Learning",
      "Maze Generation (randomized Prim's)",
      "Circuit Board routing",
    ],

    keyInsights: [
      "It is a Greedy Algorithm (local optimum = global optimum).",
      "It always maintains a single, connected component.",
      "It works best on **Dense Graphs** (lots of edges).",
      "It fails on graphs with disconnected parts (it can only span one island).",
    ],

    whenToUse:
      "Use Prim's when the graph is dense (lots of edges per node) or when you need to grow a network outward from a specific central point.",

    whenNotToUse:
      "Avoid Prim's if the graph is sparse (Kruskal's is usually cleaner) or if you need to find the MST of a disconnected graph (a Minimum Spanning Forest).",

    interviewTip:
      "Remember that Prim's is essentially Dijkstra's algorithm, just with a slightly different sorting key in the Priority Queue. If you know one, you know the other.",
  },

  kruskal: {
    title: "Kruskal's Algorithm",
    tagline: "The Forest Merger",
    history: `Published by Joseph Kruskal in 1956. While Prim's algorithm focuses on growing a single tree, Kruskal took a different approach: what if we just picked the best edges everywhere and worried about connecting them later?

It is an elegant example of how simple local rules can build a complex global structure.`,

    mechanics: `Kruskal's is edge-centric, not node-centric. It doesn't "grow" a tree; it merges disjoint sets (islands) until they become one continent.

**The Algorithm Step-by-Step:**

1. **Sort**: List every single edge in the graph, sorted from smallest weight to largest.
2. **Iterate**: Walk through the sorted list.
3. **Check**: Does this edge connect two nodes that are *already* connected (part of the same cluster)?
   - **Yes?** Throw it away (it would create a cycle).
   - **No?** Add it to the MST.
4. **Union**: Merge the two clusters together.
5. **Repeat**: Until you have $V-1$ edges.



**The Secret Weapon: Union-Find**
The algorithm relies heavily on a data structure called "Union-Find" (or Disjoint Set). This structure allows us to check if two nodes are in the same group in near-constant time ($O(alpha(n))$).`,

    timeComplexity: {
      complexity: "O(E log E)",
      explanation:
        "The bottleneck is sorting the edges. The Union-Find operations are nearly instantaneous (inverse Ackermann function).",
    },
    spaceComplexity: {
      complexity: "O(V + E)",
      explanation: "Storing the edge list and the Union-Find parent array.",
    },
    output: "Minimum Spanning Tree (MST)",
    dataStructure: "Union-Find (Disjoint Set Union)",
    visualPattern:
      "Random lines appearing all over the map, slowly linking up into larger clusters until they snap into a single web.",

    useCases: [
      "Landing Cables (connecting cities efficiently)",
      "Image Segmentation (grouping pixels)",
      "Approximating the Traveling Salesperson Problem",
      "Network reliability analysis",
    ],

    keyInsights: [
      "It builds a 'Forest' of trees that eventually merge.",
      "It is excellent for **Sparse Graphs** (fewer edges).",
      "It handles disconnected graphs naturally (produces a Spanning Forest).",
      "It relies entirely on the sorting step.",
    ],

    whenToUse:
      "Use Kruskal's on sparse graphs, or when you already have a list of edges sorted by weight. It is also easier to implement if you have a Union-Find class ready.",

    whenNotToUse:
      "Avoid on dense graphs. Sorting $E$ edges takes longer than Prim's approach when $E$ is large ($E approx V^2$).",

    interviewTip:
      "The interview question is almost never 'Implement Kruskal.' It is 'Implement Union-Find.' Make sure you understand Path Compression and Union by Rank.",
  },

  kahn: {
    title: "Kahn's Algorithm",
    tagline: "The Dependency Resolver",
    history: `If you have ever been stuck in "Dependency Hell" while trying to install a node module, you have Arthur Kahn (1962) to thank for the solution.

This is the standard algorithm for **Topological Sorting**. It takes a graph of tasks where some tasks must finish before others can start (a Directed Acyclic Graph, or DAG) and flattens it into a linear to-do list.`,

    mechanics: `Kahn's algorithm simulates a production line. It keeps track of "Indegrees" -- the number of prerequisites a task has left.



**The Algorithm Step-by-Step:**

1. **Calculate Indegrees**: Count how many incoming edges each node has.
2. **Queue Zeroes**: Find all nodes with 0 incoming edges (tasks with no prerequisites). Put them in a Queue.
3. **Process**:
   - Dequeue a node and add it to the final sorted list.
   - "Delete" the node from the graph (virtually).
   - Decrement the indegree of all its neighbors.
   - If a neighbor's indegree hits 0, add it to the Queue.
4. **Repeat**: Until the queue is empty.

**Cycle Detection:**
If the queue empties but you haven't processed all nodes, it means there is a cycle (a deadlock). For example, A waits for B, and B waits for A.`,

    timeComplexity: {
      complexity: "O(V + E)",
      explanation: "We visit every node and every edge exactly once. It is extremely efficient.",
    },
    spaceComplexity: {
      complexity: "O(V)",
      explanation: "We need an array to store indegrees and a queue for the zero-degree nodes.",
    },
    output: "Topological Ordering (Linear Sequence)",
    dataStructure: "Queue + Indegree Array",
    visualPattern:
      "Peeling an onion. The outer layer (nodes with no dependencies) is stripped away, revealing new available nodes underneath.",

    useCases: [
      "Build Systems (Make, Webpack, determining compilation order)",
      "Package Managers (resolving npm/pip dependencies)",
      "Task Scheduling (Project management software)",
      "Excel Formula Evaluation (calculating cell dependencies)",
      "University Course Prerequisites",
    ],

    keyInsights: [
      "It ONLY works on DAGs (Directed Acyclic Graphs).",
      "It provides built-in Cycle Detection.",
      "The result is not unique (multiple valid sort orders can exist).",
      "It is a BFS-based approach to topological sort.",
    ],

    whenToUse:
      "Whenever you have a set of tasks with dependencies and need to find a valid order to execute them. Also useful for detecting circular dependencies.",

    whenNotToUse:
      "Do not use on undirected graphs. Do not use if the graph contains cycles (unless your goal is specifically to detect them).",

    interviewTip:
      "This is the go-to algorithm for the 'Course Schedule' problem on LeetCode. Remember: if the output length != number of nodes, you have a cycle.",
  },
};

/**
 * Get article content for a specific graph algorithm.
 */
export function getGraphArticle(algorithm: GraphAlgorithmType): GraphArticle {
  return GRAPH_ARTICLES[algorithm];
}
