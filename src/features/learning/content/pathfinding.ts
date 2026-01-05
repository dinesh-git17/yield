import type { PathfindingAlgorithmType } from "@/lib/store";

/**
 * Educational article content for pathfinding algorithms.
 * This registry contains all the textbook-style content for the Learn pages.
 * Theme: "Maps, Mazes, and Math."
 */
export interface PathfindingArticle {
  /** Display name of the algorithm */
  title: string;
  /** A catchy one-liner describing the essence */
  tagline: string;
  /** Historical background and origin story */
  history: string;
  /** Step-by-step explanation of how the algorithm works */
  mechanics: string;
  /** Time complexity with explanation */
  timeComplexity: {
    complexity: string;
    explanation: string;
  };
  /** Space complexity */
  spaceComplexity: {
    complexity: string;
    explanation: string;
  };
  /** Whether this algorithm guarantees shortest path */
  guaranteesShortestPath: boolean;
  /** Real-world applications and use cases */
  useCases: string[];
  /** Key insights and takeaways */
  keyInsights: string[];
  /** When to use this algorithm */
  whenToUse: string;
  /** When NOT to use this algorithm */
  whenNotToUse: string;
  /** The key data structure powering this algorithm */
  dataStructure: string;
  /** Visual pattern description for the visualization */
  visualPattern: string;
}

/**
 * Complete content registry for all pathfinding algorithms.
 */
export const PATHFINDING_ARTICLES: Record<PathfindingAlgorithmType, PathfindingArticle> = {
  bfs: {
    title: "Breadth-First Search",
    tagline: "The Ripple Effect",
    history: `Breadth-First Search (BFS) was first described by Konrad Zuse in his Ph.D. thesis in 1945, though it wasn't published until 1972. The algorithm was later rediscovered by Edward F. Moore in 1959 while working on the shortest path problem for maze navigation at Bell Labs.

BFS represents one of the fundamental building blocks of graph theory and computer science. Its elegant simplicity — exploring all neighbors before moving deeper — mirrors how ripples spread across water when you drop a stone. This natural metaphor makes it one of the most intuitive graph traversal algorithms.

The algorithm gained widespread adoption in early AI research for game tree exploration and has since become essential in network routing protocols (OSPF), social network analysis (finding degrees of separation), and web crawlers exploring hyperlink structures.`,

    mechanics: `BFS explores a graph layer by layer, visiting all nodes at distance d before visiting any node at distance d+1. This level-order traversal is achieved using a Queue data structure — First In, First Out (FIFO).

**The Algorithm Step-by-Step:**

1. **Initialize** — add the start node to a queue and mark it visited
2. **Dequeue** — remove the front node from the queue
3. **Check goal** — if this is the destination, reconstruct the path
4. **Explore neighbors** — for each unvisited neighbor:
   - Mark it as visited
   - Record its parent (for path reconstruction)
   - Add it to the back of the queue
5. **Repeat** until the queue is empty or goal is found

**Why It Guarantees Shortest Path:**
Because BFS explores nodes in order of their distance from the start, the first time we reach any node is guaranteed to be via the shortest path. When we find the goal, we've found the shortest route.

**The Queue's Role:**
The queue acts as a "frontier" — the boundary between explored and unexplored territory. By always expanding the oldest frontier nodes first, we ensure uniform expansion in all directions.

**Path Reconstruction:**
Each visited node stores its parent. When the goal is found, we trace back from goal to start through parents, then reverse the path.`,

    timeComplexity: {
      complexity: "O(V + E)",
      explanation:
        "BFS visits each vertex once and examines each edge once. V is the number of vertices (nodes) and E is the number of edges. In a grid, V = rows × cols and E ≈ 4V (each cell has up to 4 neighbors).",
    },
    spaceComplexity: {
      complexity: "O(V)",
      explanation:
        "The queue can hold at most O(V) nodes (in the worst case, the entire frontier). The visited set also stores O(V) entries. For a grid, this is O(rows × cols).",
    },
    guaranteesShortestPath: true,
    dataStructure: "Queue (FIFO)",
    visualPattern: "Flood expansion — concentric waves rippling outward from the start",

    useCases: [
      "GPS and navigation — finding shortest route in unweighted road networks",
      "Social networks — finding degrees of separation between users",
      "Web crawlers — exploring pages level by level",
      "Peer-to-peer networks — broadcasting messages to all nodes",
      "Garbage collection — finding all reachable objects from roots",
      "Puzzle solving — finding minimum moves in sliding puzzles",
    ],

    keyInsights: [
      "Guarantees shortest path in unweighted graphs — the first path found is optimal",
      "Level-order exploration — all nodes at distance d visited before distance d+1",
      "Complete algorithm — will find a path if one exists",
      "Memory-intensive — stores the entire frontier, which can be large",
      "Uniform cost — treats all edges as having equal weight",
      "Foundation for Dijkstra — BFS is Dijkstra with all weights = 1",
    ],

    whenToUse:
      "Use BFS when you need the shortest path in an unweighted graph, when all moves have equal cost, or when you want to explore all nodes within a certain distance. It's the go-to algorithm for maze solving and network traversal.",

    whenNotToUse:
      "Avoid BFS when edges have different weights (use Dijkstra or A* instead), when memory is severely constrained (consider DFS or iterative deepening), or when you have a good heuristic to guide the search (A* will be faster).",
  },

  dfs: {
    title: "Depth-First Search",
    tagline: "The Maze Solver",
    history: `Depth-First Search dates back to the 19th century, with Charles Pierre Trémaux documenting the first known DFS-like maze-solving algorithm around 1882. He described marking passages to avoid revisiting dead ends — essentially a physical implementation of DFS with backtracking.

The formal algorithmic description emerged in the 20th century, with the algorithm becoming a cornerstone of graph theory. DFS gained prominence in computer science through its use in topological sorting, cycle detection, and strongly connected component algorithms.

The algorithm's recursive nature mirrors how humans often solve mazes — pick a direction, follow it until you hit a wall, then backtrack and try another path. This "dive deep first" strategy gives DFS its distinctive snake-like exploration pattern.`,

    mechanics: `DFS explores as far as possible along each branch before backtracking. Unlike BFS's orderly expansion, DFS aggressively pursues a single path until it reaches a dead end or the goal.

**The Algorithm Step-by-Step:**

1. **Initialize** — push the start node onto a stack (or use recursion)
2. **Pop** — remove the top node from the stack
3. **Skip if visited** — continue to next iteration if already seen
4. **Mark visited** — add this node to the visited set
5. **Check goal** — if this is the destination, reconstruct the path
6. **Push neighbors** — add all unvisited neighbors to the stack
7. **Repeat** until the stack is empty or goal is found

**Stack vs. Recursion:**
DFS can be implemented iteratively with an explicit stack or recursively (using the call stack). The recursive version is more elegant but risks stack overflow on large graphs.

**Why It Doesn't Guarantee Shortest Path:**
DFS commits to the first path it finds, regardless of length. It might explore a 100-step path before discovering a 3-step alternative existed.

**Memory Advantage:**
DFS only stores nodes along the current path, not the entire frontier. For a tree with depth d and branching factor b, DFS uses O(d) space while BFS uses O(b^d).

**Backtracking:**
When DFS hits a dead end, it backtracks to the most recent node with unexplored neighbors. This is handled automatically by the stack/recursion.`,

    timeComplexity: {
      complexity: "O(V + E)",
      explanation:
        "Like BFS, DFS visits each vertex once and examines each edge once. The order of visitation differs, but the total work is the same.",
    },
    spaceComplexity: {
      complexity: "O(V)",
      explanation:
        "Worst case is O(V) for a linear graph. However, for balanced trees or typical grids, DFS often uses O(depth) space, which is much less than BFS's O(width).",
    },
    guaranteesShortestPath: false,
    dataStructure: "Stack (LIFO) or Recursion",
    visualPattern: "Snake exploration — diving deep along paths before backtracking",

    useCases: [
      "Topological sorting — ordering dependencies in build systems",
      "Cycle detection — finding circular references or deadlocks",
      "Maze generation — creating random mazes via recursive backtracking",
      "Strongly connected components — Tarjan's and Kosaraju's algorithms",
      "Game tree exploration — analyzing possible moves in chess/go (with pruning)",
      "Solving puzzles — Sudoku, N-Queens using backtracking",
    ],

    keyInsights: [
      "Does NOT guarantee shortest path — finds any path, not the optimal one",
      "Memory-efficient — stores only the current path, not the frontier",
      "Naturally recursive — mirrors how humans solve mazes mentally",
      "Complete in finite graphs — will find a path if one exists",
      "Can get trapped — may explore very long paths when short ones exist",
      "Foundation for backtracking — essential for constraint satisfaction problems",
    ],

    whenToUse:
      "Use DFS when you only need to find any path (not necessarily shortest), when memory is constrained, when the graph is deep but narrow, or when implementing backtracking algorithms. It excels at exhaustive search problems like puzzle solving.",

    whenNotToUse:
      "Avoid DFS when you need the shortest path (use BFS or A*), when the graph might have very deep branches (can waste time exploring), or when cycles could cause infinite loops (ensure proper visited tracking).",
  },

  dijkstra: {
    title: "Dijkstra's Algorithm",
    tagline: "The Gold Standard",
    history: `Dijkstra's Algorithm was conceived by Dutch computer scientist Edsger W. Dijkstra in 1956 while working at the Mathematical Center in Amsterdam. The story goes that he designed the algorithm in about 20 minutes while sitting at a café with his fiancée, working without pencil and paper.

The algorithm was published in 1959 and quickly became the standard solution for shortest path problems. Dijkstra later became one of computing's most influential figures, winning the Turing Award in 1972 and contributing foundational work on structured programming and operating systems.

Dijkstra famously said of his algorithm: "The question of whether computers can think is like the question of whether submarines can swim." His algorithm continues to power navigation systems, network routing protocols, and countless other applications worldwide.`,

    mechanics: `Dijkstra's Algorithm finds the shortest path in graphs with weighted edges. The key insight is "relaxation" — continuously updating distance estimates as shorter paths are discovered.

**The Algorithm Step-by-Step:**

1. **Initialize** — set distance to start = 0, all others = ∞
2. **Priority queue** — add start node with priority 0
3. **Extract minimum** — remove the node with smallest distance
4. **Skip if processed** — continue if already in closed set
5. **Mark processed** — add to closed set
6. **Check goal** — if this is the destination, we're done
7. **Relax edges** — for each neighbor:
   - Calculate new_distance = current_distance + edge_weight
   - If new_distance < known_distance, update it and add to queue
8. **Repeat** until queue is empty or goal is found

**The "Relaxation" Concept:**
When we find a shorter path to a node, we "relax" its distance estimate. The name comes from the metaphor of a stretched rubber band relaxing to a shorter length.

**Why It Works:**
Dijkstra always processes nodes in order of their distance from the start. Once a node is processed, its shortest path is finalized — no shorter path can be found later (assuming non-negative weights).

**Priority Queue's Role:**
The priority queue ensures we always expand the closest unprocessed node. This greedy choice is what makes the algorithm correct and efficient.

**Non-Negative Weights Requirement:**
Dijkstra assumes all edge weights are ≥ 0. Negative weights can cause incorrect results because a "processed" node might later be reached via a shorter path.`,

    timeComplexity: {
      complexity: "O((V + E) log V)",
      explanation:
        "With a binary heap, each extract-min takes O(log V) and we do at most V extractions. Each edge can trigger a decrease-key operation, also O(log V). Using Fibonacci heaps reduces this to O(E + V log V).",
    },
    spaceComplexity: {
      complexity: "O(V)",
      explanation:
        "Storage for the priority queue (up to V nodes), the distance array (V entries), and the visited set (V entries).",
    },
    guaranteesShortestPath: true,
    dataStructure: "Priority Queue (Min-Heap)",
    visualPattern: "Radial expansion — circles growing from start, weighted by cost",

    useCases: [
      "GPS navigation — finding fastest route considering traffic/distance",
      "Network routing — OSPF protocol for internet packet routing",
      "Robotics — path planning with terrain cost consideration",
      "Airline route planning — minimizing flight time or cost",
      "Video games — NPC pathfinding with movement costs",
      "Telecommunications — routing calls with varying link costs",
    ],

    keyInsights: [
      "Guarantees shortest path — provably optimal for non-negative weights",
      "Requires non-negative weights — negative edges break the algorithm",
      "More general than BFS — handles weighted graphs",
      "Foundation for A* — Dijkstra is A* with heuristic h(n) = 0",
      "Greedy algorithm — always expands the closest unvisited node",
      "Single-source — finds shortest paths from start to ALL nodes",
    ],

    whenToUse:
      "Use Dijkstra when edges have varying weights (like road distances or costs), when you need guaranteed shortest path, or when you need distances to all nodes from a single source. It's the standard choice for weighted graph pathfinding.",

    whenNotToUse:
      "Avoid Dijkstra when all edges have equal weight (BFS is simpler and faster), when you have a good heuristic to the goal (A* will be faster), or when edges can have negative weights (use Bellman-Ford instead).",
  },

  astar: {
    title: "A* Search",
    tagline: "The Crown Jewel",
    history: `A* (pronounced "A-star") was created in 1968 by Peter Hart, Nils Nilsson, and Bertram Raphael at Stanford Research Institute. They were working on Shakey the Robot, one of the first mobile robots capable of reasoning about its actions.

The breakthrough of A* was combining Dijkstra's guarantee of finding the shortest path with heuristic guidance toward the goal. The algorithm is named after its evaluation function f(n) = g(n) + h(n), where the asterisk denotes the optimal path.

A* became the algorithm that launched a thousand video games. From early classics like Warcraft to modern titles, A* and its variants power virtually all real-time strategy and simulation games. It remains the most important algorithm in game AI and robotic path planning.`,

    mechanics: `A* combines the best of both worlds: Dijkstra's optimality guarantee and greedy best-first's speed. The secret is the evaluation function f(n) = g(n) + h(n).

**Understanding f(n) = g(n) + h(n):**

- **g(n)** = actual cost from start to node n (known, exact)
- **h(n)** = estimated cost from n to goal (heuristic, estimated)
- **f(n)** = estimated total path cost through n

**The Algorithm Step-by-Step:**

1. **Initialize** — create open set (priority queue) and closed set
2. **Add start** — with g=0, f=h(start)
3. **Extract minimum f** — get node with lowest f(n) from open set
4. **Add to closed** — mark as fully processed
5. **Check goal** — if this is the destination, reconstruct path
6. **Expand neighbors** — for each neighbor not in closed set:
   - Calculate tentative_g = current_g + edge_cost
   - If neighbor not in open OR tentative_g < existing g:
     - Update parent, g-score, and f-score
     - Add to open set (or update priority)
7. **Repeat** until open set is empty (no path) or goal is found

**Heuristic Requirements:**
For A* to guarantee the shortest path, h(n) must be **admissible** — it must never overestimate the true cost. An optimistic estimate is safe; a pessimistic one is not.

**Common Heuristics for Grids:**

- **Manhattan distance** = |x1-x2| + |y1-y2| (4-directional movement)
- **Euclidean distance** = √[(x1-x2)² + (y1-y2)²] (any direction)
- **Chebyshev distance** = max(|x1-x2|, |y1-y2|) (8-directional movement)

**Why A* is Faster Than Dijkstra:**
The heuristic guides search toward the goal. While Dijkstra explores in all directions equally, A* prioritizes nodes that appear closer to the goal, often reaching it with far fewer node expansions.`,

    timeComplexity: {
      complexity: "O((V + E) log V)",
      explanation:
        "Worst case matches Dijkstra. However, with a good heuristic, A* typically examines far fewer nodes. The quality of the heuristic determines practical performance.",
    },
    spaceComplexity: {
      complexity: "O(V)",
      explanation:
        "Open and closed sets together can hold all nodes. Memory is often the limiting factor for A* on large maps, leading to variants like IDA* and SMA*.",
    },
    guaranteesShortestPath: true,
    dataStructure: "Priority Queue ordered by f(n) = g(n) + h(n)",
    visualPattern: "Directed expansion — stretched toward goal while maintaining optimality",

    useCases: [
      "Video game pathfinding — the industry standard for NPC movement",
      "Robotics — navigating physical spaces with known maps",
      "Route planning — GPS with distance heuristics",
      "Puzzle solving — sliding puzzles, Rubik's cube with admissible heuristics",
      "Natural language processing — finding optimal parse trees",
      "Logistics — warehouse robot routing, delivery optimization",
    ],

    keyInsights: [
      "Guarantees shortest path — when heuristic is admissible",
      "f(n) = g(n) + h(n) — balances actual cost and estimated remaining cost",
      "Heuristic quality matters — better h means fewer nodes expanded",
      "Reduces to Dijkstra when h(n) = 0 — no guidance, explore everywhere",
      "Reduces to Greedy when g(n) = 0 — all guidance, no guarantee",
      "Optimally efficient — no algorithm expands fewer nodes with same info",
    ],

    whenToUse:
      "Use A* when you have a good heuristic estimate to the goal, when you need guaranteed shortest path, and when the search space is large enough that Dijkstra would be too slow. It's the best choice for most point-to-point pathfinding problems.",

    whenNotToUse:
      "Avoid A* when you don't have a meaningful heuristic (Dijkstra is simpler), when searching to all destinations (A* is for single-target), or when memory is severely limited (consider IDA* or hierarchical pathfinding).",
  },

  greedy: {
    title: "Greedy Best-First Search",
    tagline: "The Speed Demon",
    history: `Greedy Best-First Search emerged from early artificial intelligence research in the 1960s as researchers sought faster alternatives to uninformed search. The idea was simple: instead of exploring systematically, always move toward the goal.

The algorithm represents pure heuristic search — using only the estimated cost to goal h(n) with no consideration of the path taken so far. While this "greedy" approach often works brilliantly, it sacrifices optimality for speed.

Greedy Best-First became an important stepping stone in the development of A*. By understanding where greedy search fails (not finding shortest paths), Hart, Nilsson, and Raphael designed A* to retain the speed benefits while guaranteeing optimality.`,

    mechanics: `Greedy Best-First Search is like A* with amnesia — it only considers how far the goal appears to be, ignoring how far it has already traveled.

**The Evaluation Function:**

- f(n) = h(n) (heuristic only)
- Unlike A*: g(n) is not considered
- Always expands the node that appears closest to the goal

**The Algorithm Step-by-Step:**

1. **Initialize** — create priority queue with start node
2. **Extract minimum h** — get node with lowest h(n)
3. **Skip if visited** — continue if already processed
4. **Mark visited** — add to closed set
5. **Check goal** — if destination reached, reconstruct path
6. **Add neighbors** — for each unvisited neighbor:
   - Calculate h(neighbor)
   - Add to priority queue with priority h
7. **Repeat** until queue is empty or goal is found

**Why It's Fast:**
Without tracking g(n), the algorithm makes quick decisions. It beelines toward the goal, often finding a path much faster than Dijkstra or even A*.

**Why It Can Fail:**
Consider a U-shaped obstacle. Greedy search races toward the goal, hits the obstacle, then must backtrack extensively. The final path may be far longer than optimal.

**The "Trap" Problem:**
Greedy search can get stuck in concave obstacles or local minima — situations where moving toward the goal actually moves you further from an achievable path.`,

    timeComplexity: {
      complexity: "O((V + E) log V)",
      explanation:
        "Same worst-case as A* and Dijkstra. However, greedy often terminates much faster by ignoring non-promising areas. Best case can be nearly linear if the heuristic is very accurate.",
    },
    spaceComplexity: {
      complexity: "O(V)",
      explanation:
        "Similar to A* — stores nodes in open and closed sets. May store fewer nodes in practice due to faster termination.",
    },
    guaranteesShortestPath: false,
    dataStructure: "Priority Queue ordered by h(n) only",
    visualPattern: "Laser beam — shoots directly at goal, bouncing off obstacles",

    useCases: [
      "Real-time applications — when any path is better than no path",
      "Preliminary search — finding approximate paths quickly",
      "Heuristic testing — evaluating heuristic quality before A*",
      "Games with deadlines — when frame time limits prevent full A*",
      "Exploratory pathfinding — when optimality doesn't matter",
      "Memory-constrained systems — simpler than A*",
    ],

    keyInsights: [
      "Does NOT guarantee shortest path — often finds suboptimal routes",
      "Very fast on open terrain — reaches goal with minimal exploration",
      "Vulnerable to traps — concave obstacles cause poor performance",
      "Uses only h(n) — ignores actual path cost entirely",
      "A* without memory — doesn't track how far we've come",
      "Good heuristic critical — poor h makes greedy nearly random",
    ],

    whenToUse:
      "Use Greedy Best-First when speed matters more than path quality, when obstacles are convex or sparse, when you need a quick approximate solution, or when real-time constraints prevent thorough search.",

    whenNotToUse:
      "Avoid Greedy when path optimality matters, when obstacles are concave or maze-like, when the heuristic isn't highly accurate, or when you need guaranteed correctness for critical applications.",
  },

  bidirectional: {
    title: "Bidirectional A*",
    tagline: "The Tunnel Bore",
    history: `Bidirectional search was first proposed by Ira Pohl in 1971 as a way to reduce the exponential explosion of search space. The insight was elegant: instead of searching from start to goal, search from both ends simultaneously and meet in the middle.

The mathematical beauty is compelling: if a search tree has branching factor b and depth d, unidirectional search explores O(b^d) nodes. Bidirectional search explores O(2 × b^(d/2)) = O(b^(d/2)) nodes — exponentially fewer.

Combining bidirectional search with A* creates a powerful algorithm for point-to-point pathfinding. The challenge lies in detecting when the frontiers meet and ensuring the combined path is optimal — problems that researchers have refined solutions for over decades.`,

    mechanics: `Bidirectional A* runs two simultaneous A* searches — one from start toward goal, and one from goal toward start. When the frontiers meet, we've found a path.

**The "Tunnel Bore" Metaphor:**
Imagine digging a tunnel through a mountain. Instead of drilling from one side, two teams drill from opposite sides and meet in the middle — cutting the work roughly in half (or more, due to the exponential nature of search).

**The Algorithm Step-by-Step:**

1. **Initialize two frontiers:**
   - Forward: open_start with start node, heuristic toward goal
   - Backward: open_end with goal node, heuristic toward start
2. **Alternate expansion:**
   - Expand one node from forward frontier
   - Expand one node from backward frontier
3. **Check for intersection:**
   - After each expansion, check if the node is in the other closed set
   - If intersection found, we have a candidate path
4. **Verify optimality:**
   - The first intersection may not be optimal
   - Continue until we can prove no better path exists
5. **Stitch the path:**
   - Combine forward path (start → meeting point)
   - With backward path (meeting point → goal)

**Why It's Faster:**

With branching factor b and path length d:

- Unidirectional: explores ~b^d nodes
- Bidirectional: explores ~2 × b^(d/2) nodes
- For b=4, d=20: 1 trillion vs. 2 million nodes!

**The Meeting Point Challenge:**
Finding where the frontiers meet is tricky. The first intersection isn't always optimal — we need to ensure no better path exists through other meeting points.`,

    timeComplexity: {
      complexity: "O((V + E) log V)",
      explanation:
        "Worst case same as unidirectional A*. However, practical performance is often O(b^(d/2)) instead of O(b^d) — exponentially better for long paths.",
    },
    spaceComplexity: {
      complexity: "O(V)",
      explanation:
        "Maintains two open sets and two closed sets. Total space is similar to unidirectional A*, but often less in practice due to smaller frontiers.",
    },
    guaranteesShortestPath: true,
    dataStructure: "Two Priority Queues (one for each direction)",
    visualPattern: "Dual expanding bubbles — two searches meeting in the middle",

    useCases: [
      "Long-distance routing — cross-country or intercontinental paths",
      "Large game maps — MMO worlds with vast distances",
      "Social network analysis — finding connections between distant users",
      "Transportation networks — flight routes, railroad paths",
      "Puzzle solving — when start and goal configurations are known",
      "Protein folding — searching from known configurations",
    ],

    keyInsights: [
      "Guarantees shortest path — with proper termination conditions",
      "Exponentially faster — O(b^(d/2)) vs O(b^d) in practice",
      "Requires reversible graph — must be able to traverse edges backward",
      "More complex implementation — managing two frontiers and stitching",
      "Best for long paths — overhead not worth it for short distances",
      "Memory efficient — each frontier is smaller than unidirectional",
    ],

    whenToUse:
      "Use Bidirectional A* for long-distance pathfinding where unidirectional A* is too slow, when the graph is undirected or edges are reversible, and when both start and goal are known upfront.",

    whenNotToUse:
      "Avoid Bidirectional when paths are short (overhead outweighs benefit), when edges aren't reversible (one-way streets), when the goal is a region rather than a point, or when the graph structure makes backward search impractical.",
  },

  flood: {
    title: "Flood Fill",
    tagline: "The Complete Cartographer",
    history: `Flood Fill has its origins in early computer graphics and image processing. The algorithm is commonly associated with the "paint bucket" tool found in graphics programs since the 1970s — select a pixel, and the color spreads to fill all connected pixels of the same color.

In the context of pathfinding, Flood Fill represents a complete exploration algorithm. Rather than stopping when the goal is found, it maps the entire reachable space — like water flooding a basin to reveal its complete topology.

The algorithm is closely related to BFS but serves a different purpose. While BFS seeks a single path, Flood Fill reveals the complete "basin of attraction" from a starting point — every node that can be reached and the distance to each.`,

    mechanics: `Flood Fill explores every reachable node from the start, creating a complete distance map of the accessible region. It's BFS that doesn't stop at the goal.

**The Algorithm Step-by-Step:**

1. **Initialize** — add start to queue with distance 0
2. **Mark visited** — add start to visited set
3. **Dequeue** — remove front node from queue
4. **Note goal** — if this is the destination, record it (but keep going!)
5. **Expand all** — for each unvisited neighbor:
   - Mark as visited
   - Record parent and distance
   - Add to queue
6. **Repeat** until queue is empty (entire region explored)
7. **Reconstruct** — if goal was found, trace back the path

**Why Explore Everything?**

Flood Fill creates a complete distance map. Once complete, you can:

- Find paths to any destination instantly (trace parents)
- Identify all nodes within a certain radius
- Analyze connectivity and bottlenecks
- Visualize the complete reachable region

**Visualization Purpose:**
In Yield, Flood Fill demonstrates what BFS would explore if it didn't terminate early. This helps visualize the full scope of the search space and understand the heat map pattern.

**Comparison to BFS:**

- BFS: "Find the shortest path to the goal"
- Flood Fill: "Map distances to every reachable node"`,

    timeComplexity: {
      complexity: "O(V + E)",
      explanation:
        "Visits every vertex once and examines every edge once. Since we're exploring everything anyway, there's no early termination benefit.",
    },
    spaceComplexity: {
      complexity: "O(V)",
      explanation:
        "Stores visited set, distance map, and parent pointers for all reachable nodes. The queue can hold up to O(V) nodes.",
    },
    guaranteesShortestPath: true,
    dataStructure: "Queue (same as BFS)",
    visualPattern: "Complete flood — fills entire reachable region before finishing",

    useCases: [
      "Graphics — paint bucket tool, region filling",
      "Image processing — connected component labeling",
      "Game maps — fog of war reveal, territory control",
      "Network analysis — finding all nodes within k hops",
      "Pre-computation — building distance tables for frequent queries",
      "Influence mapping — showing range of effect for game units",
    ],

    keyInsights: [
      "Complete exploration — visits every reachable node",
      "Guarantees shortest path — same as BFS",
      "Provides distance map — distances to all nodes, not just goal",
      "Useful for visualization — shows full extent of search space",
      "Basis for influence maps — common in game AI",
      "No early termination — always explores entire region",
    ],

    whenToUse:
      "Use Flood Fill when you need distances to all reachable nodes, when visualizing search space extent, when building pre-computed distance tables, or when implementing region-based operations like image fills.",

    whenNotToUse:
      "Avoid Flood Fill when you only need a single path (BFS is faster), when the region is very large and you don't need complete exploration, or when real-time performance matters and early termination would help.",
  },

  random: {
    title: "Random Walk",
    tagline: "The Chaos Agent",
    history: `Random walks have fascinated mathematicians since Karl Pearson coined the term in 1905, describing a walk where each step is in a random direction. The concept appears throughout science: Brownian motion in physics, stock price modeling in finance, and random sampling in statistics.

In pathfinding, Random Walk serves as a pedagogical tool — a demonstration of what happens when search algorithms have no intelligence. By randomly choosing the next step, it represents the baseline against which we measure sophisticated algorithms.

The algorithm is also known as a "drunkard's walk," imagining someone so disoriented they move randomly. It demonstrates why heuristics matter: without guidance, finding a path becomes a matter of luck rather than logic.`,

    mechanics: `Random Walk is anti-algorithmic — it has no strategy, no memory, no guidance. At each step, it picks a random valid neighbor and moves there.

**The Algorithm Step-by-Step:**

1. **Start** at the initial position
2. **Get neighbors** — find all valid adjacent cells
3. **Pick randomly** — select one neighbor at random
4. **Move** — update current position
5. **Check goal** — if at destination, success!
6. **Track visited** — record first-time visits for path reconstruction
7. **Repeat** until goal found or max steps exceeded

**Why Include It?**

Random Walk demonstrates:

- The value of intelligent search strategies
- What happens without heuristic guidance
- The baseline that other algorithms improve upon
- That even random movement can eventually find a path

**Expected Behavior:**

- In open space: eventually finds the goal (but slowly)
- In mazes: may take extremely long or hit step limit
- Time complexity: unbounded (could theoretically run forever)

**The Step Limit:**
Without a maximum step count, Random Walk could run forever on some graphs. The visualizer uses a limit to ensure termination.

**Monte Carlo Connection:**
Random Walk is related to Monte Carlo methods — using randomness to explore solution spaces. While not efficient for pathfinding, similar techniques are powerful in optimization and simulation.`,

    timeComplexity: {
      complexity: "O(∞) / O(max_steps)",
      explanation:
        "Unbounded in theory — could wander forever without finding the goal. Implementations use a step limit. Expected time depends heavily on graph structure and goal placement.",
    },
    spaceComplexity: {
      complexity: "O(V)",
      explanation:
        "Tracks visited nodes for path reconstruction. Could theoretically visit all nodes before finding the path.",
    },
    guaranteesShortestPath: false,
    dataStructure: "None (stateless random choice)",
    visualPattern: "Chaotic wandering — erratic, purposeless movement",

    useCases: [
      "Educational — demonstrating why heuristics matter",
      "Baseline comparison — measuring algorithm improvements",
      "Stress testing — random exploration of large spaces",
      "Emergent behavior — simple rules creating complex patterns",
      "Games — creating 'confused' or 'wandering' NPC behavior",
      "Monte Carlo sampling — exploring solution spaces randomly",
    ],

    keyInsights: [
      "No guarantee of finding path — may exceed step limit",
      "No guarantee of shortest path — path length is essentially random",
      "Demonstrates need for intelligence — shows value of BFS/A*",
      "Can work on simple maps — eventually finds goal in open spaces",
      "Fails on complex mazes — likely to wander indefinitely",
      "Pedagogical value — the 'what not to do' example",
    ],

    whenToUse:
      "Use Random Walk for educational demonstrations, as a baseline comparison, when implementing wandering behavior in games, or when exploring spaces where any coverage pattern is acceptable.",

    whenNotToUse:
      "Avoid Random Walk for any serious pathfinding task. It's never the right choice when you need reliable paths, predictable performance, or any form of optimality. It exists to show why we need real algorithms.",
  },
};

/**
 * Get article content for a specific pathfinding algorithm.
 */
export function getPathfindingArticle(algorithm: PathfindingAlgorithmType): PathfindingArticle {
  return PATHFINDING_ARTICLES[algorithm];
}
