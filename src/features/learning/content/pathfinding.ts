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
    tagline: "The Cautious Explorer",
    history: `Breadth-First Search (BFS) has roots in the 1940s with Konrad Zuse, but it was formally published by Edward F. Moore in 1959 at Bell Labs. Moore was trying to find the shortest path out of a maze, proving that sometimes the best way to exit a labyrinth is to try every single direction simultaneously.

It is the "vanilla" ice cream of graph theory. Reliable, foundational, and widely liked, even if it lacks the exotic toppings of newer heuristics. Its behavior mirrors a ripple spreading across a pond or a rumor spreading through a slack channel.`,

    mechanics: `BFS is the definition of "slow and steady wins the race." It explores the graph layer by layer, visiting every neighbor at the current distance before moving one step further out.

**The Algorithm Step-by-Step:**

1. **Initialize**: Add the start node to a queue and mark it as visited.
2. **Dequeue**: Remove the node at the front of the line.
3. **Check Goal**: If this is the destination, you're done.
4. **Expand**: For every unvisited neighbor, mark it as visited, record its parent (so we can trace the path back later), and add it to the back of the queue.
5. **Repeat**: Keep going until the queue is empty or the goal is found.

**Why It Guarantees Shortest Path:**
Because BFS explores radially. You cannot physically reach a node at distance 5 before finishing all nodes at distance 4. Therefore, the moment you touch the goal, you have found the shortest route in an unweighted graph.

**The Queue's Role:**
The Queue (FIFO) ensures fair processing. It prevents the algorithm from getting distracted and diving down a rabbit hole.`,

    timeComplexity: {
      complexity: "O(V + E)",
      explanation:
        "We visit every Vertex once and check every Edge once. In a grid, this is proportional to the area searched. It's efficient, but it doesn't skip any work.",
    },
    spaceComplexity: {
      complexity: "O(V)",
      explanation:
        "The 'frontier' (the rim of the ripple) grows as the search expands. In a worst-case open grid, this can get memory-heavy quickly.",
    },
    guaranteesShortestPath: true,
    dataStructure: "Queue (FIFO)",
    visualPattern: "Concentric rings expanding uniformly from the center",

    useCases: [
      "GPS Navigation (in unweighted grids)",
      "Social Networks (finding 'degrees of separation')",
      "Web Crawlers (limiting search depth)",
      "Broadcasting in peer-to-peer networks",
      "Garbage Collection (identifying live objects)",
      "Solving Rubik's Cubes (minimum move solutions)",
    ],

    keyInsights: [
      "It is the gold standard for unweighted graphs.",
      "It explores equally in all directions, which is safe but can be slow.",
      "It requires more memory than DFS because it stores the entire frontier.",
      "It forms the basis for more complex algorithms like Dijkstra and A*.",
      "It will always find a solution if one exists.",
    ],

    whenToUse:
      "Use BFS when you need the shortest path in a graph where all edges have the same cost (or no cost). It is perfect for procedural generation and proximity checks.",

    whenNotToUse:
      "Avoid BFS if the graph is weighted (it ignores costs) or if the target is likely to be very far away, as the memory usage can explode.",
  },

  dfs: {
    title: "Depth-First Search",
    tagline: "The Maze Runner",
    history: `The concept of Depth-First Search dates back to the 19th century with Charles Pierre Trémaux, who created a manual method for solving mazes. It was formalized for computers alongside other fundamental graph algorithms in the mid-20th century.

If BFS is a cautious expanding circle, DFS is a lightning bolt. It commits to a decision and sticks with it until it hits a wall. It is the algorithmic equivalent of looking for your car keys by walking in a straight line until you hit a fence, then turning left.`,

    mechanics: `DFS is aggressive. It explores as far as possible along each branch before backtracking. It doesn't care about the "closest" nodes; it cares about the "deepest" nodes.

**The Algorithm Step-by-Step:**

1. **Initialize**: Push the start node onto a stack.
2. **Pop**: Take the top node off the stack.
3. **Explore**: If it hasn't been visited, mark it.
4. **Check Goal**: If we found it, celebrate.
5. **Push Neighbors**: Add all unvisited neighbors to the stack.
6. **Repeat**: Continue until the stack is empty.

**Stack vs. Recursion:**
DFS is naturally recursive. You can implement it with an explicit Stack data structure, or you can just let the system call stack handle it via recursion.

**Why It Does Not Guarantee Shortest Path:**
DFS might find a path that winds around the entire map before stumbling onto the goal, even if the goal was just one tile away from the start. It is lucky, not smart.`,

    timeComplexity: {
      complexity: "O(V + E)",
      explanation:
        "Mathematically, it does the same amount of work as BFS (visiting nodes and edges). It just does them in a drastically different order.",
    },
    spaceComplexity: {
      complexity: "O(V) (often O(depth))",
      explanation:
        "This is where DFS shines. It only needs to store the current path of nodes. On deep, branching trees, this is significantly more memory efficient than BFS.",
    },
    guaranteesShortestPath: false,
    dataStructure: "Stack (LIFO) or Recursion",
    visualPattern: "Snake-like tendrils probing deep into the maze",

    useCases: [
      "Maze Generation (creating long, winding corridors)",
      "Topological Sorting (build dependency resolution)",
      "Cycle Detection in graphs",
      "Sudoku and Puzzle Solvers",
      "Pathfinding where memory is extremely limited",
      "Game AI decision trees",
    ],

    keyInsights: [
      "It finds *a* path, not necessarily the *good* path.",
      "It is extremely memory efficient compared to BFS.",
      "It preserves the topology of the graph better than BFS.",
      "It can get stuck in infinite loops if you don't track visited nodes properly.",
      "It mirrors how humans naturally try to solve mazes.",
    ],

    whenToUse:
      "Use DFS when you need to visit every node (like in a simulation), when memory is tight, or when you are generating a maze rather than solving one.",

    whenNotToUse:
      "Never use DFS if you need the shortest path. Also avoid it on extremely deep graphs (like state-machines) without a depth limit, or you'll trigger a Stack Overflow.",
  },

  dijkstra: {
    title: "Dijkstra's Algorithm",
    tagline: "The Serious Professional",
    history: `Edsger W. Dijkstra invented this algorithm in 1956 over a cup of coffee. He wanted to demonstrate the power of the new ARMAC computer but needed a problem that non-mathematicians could understand. He chose "finding the shortest route between two cities in the Netherlands."

Dijkstra was a stickler for elegance and correctness. His algorithm reflects that personality. It doesn't guess, and it doesn't take shortcuts. It simply calculates the mathematically optimal path with ruthless efficiency.`,

    mechanics: `Dijkstra's Algorithm is essentially BFS with a brain for costs. It accounts for "weighted" edges (like traffic, terrain cost, or toll roads).

**The Algorithm Step-by-Step:**

1. **Initialize**: Set distance to start as 0 and all other nodes to Infinity.
2. **Priority Queue**: Put the start node in a min-priority queue.
3. **Extract Min**: Grab the node with the currently shortest known distance.
4. **Relaxation**: Check all neighbors. If the distance to the current node + the edge weight is less than the neighbor's known distance, update the neighbor's distance and parent.
5. **Repeat**: Keep going until the destination is finalized.

**The "Relaxation" Concept:**
It sounds like a spa treatment, but in graph theory, "relaxing" an edge means checking if we found a shortcut. If we found a faster way to get to Node B via Node A, we update our records.

**Greedy but Correct:**
It always processes the "closest" unprocessed node next. This ensures that once a node is visited, we have mathematically proven the shortest path to it.`,

    timeComplexity: {
      complexity: "O((V + E) log V)",
      explanation:
        "The log V comes from the Priority Queue operations. It's slower than BFS per step, but much more powerful because it handles weights.",
    },
    spaceComplexity: {
      complexity: "O(V)",
      explanation:
        "We need to store the distance estimates for every node and the priority queue itself.",
    },
    guaranteesShortestPath: true,
    dataStructure: "Priority Queue (Min-Heap)",
    visualPattern: "Organic expansion that flows faster through low-cost terrain",

    useCases: [
      "Google Maps / GPS Navigation",
      "Network Routing Protocols (OSPF)",
      "Logistics and Supply Chain optimization",
      "Airline flight planning",
      "Social Network modeling",
      "Telephone network routing",
    ],

    keyInsights: [
      "It handles weighted graphs (mud costs more movement than road).",
      "It guarantees the shortest path for non-negative weights.",
      "It is the grandfather of A*.",
      "It calculates the shortest path from the start to *all* other nodes.",
      "It fails if negative edge weights exist (you need Bellman-Ford for that).",
    ],

    whenToUse:
      "Use Dijkstra when movement costs vary (e.g., a game with swamps and roads) and you need the absolute optimal path. It is the industry standard for established routing.",

    whenNotToUse:
      "Avoid Dijkstra if all weights are equal (BFS is faster) or if you need to find the path very quickly in a massive map (use A*).",
  },

  astar: {
    title: "A* Search",
    tagline: "The Smart Navigator",
    history: `A* (A-Star) was developed in 1968 for Shakey the Robot at Stanford. The researchers wanted Shakey to navigate a room without bumping into things, but Dijkstra's algorithm was too slow for the hardware of the time.

They added a "heuristic" (a best guess) to guide the search. The result was an algorithm that combines the precision of Dijkstra with the speed of a greedy approach. It is widely considered the crown jewel of pathfinding in game development.`,

    mechanics: `A* is Dijkstra with a cheat sheet. It decides which node to explore next based on two numbers:
1. **g(n)**: The cost to get here (same as Dijkstra).
2. **h(n)**: The estimated cost to get to the goal (the heuristic).

**The Magic Formula:**
$f(n) = g(n) + h(n)$

**The Algorithm Step-by-Step:**

1. **Initialize**: Add start node to the open set with its f-score.
2. **Select Best**: Choose the node with the lowest f-score.
3. **Check Goal**: If we are there, trace the path.
4. **Evaluate**: For each neighbor, calculate the cost to get there. If it's a better path than we knew before, record it, calculate the heuristic, and add it to the open set.
5. **Repeat**: Until the goal is found.

**The Heuristic:**
This is the "educated guess." In a grid, we usually use the Manhattan Distance (counting tiles) or Euclidean Distance (straight line) to estimate how far the goal is. This acts as a magnet, pulling the search toward the finish line.`,

    timeComplexity: {
      complexity: "O((V + E) log V)",
      explanation:
        "The worst case is the same as Dijkstra, but in practice, A* visits significantly fewer nodes because it doesn't waste time exploring the wrong direction.",
    },
    spaceComplexity: {
      complexity: "O(V)",
      explanation:
        "It still needs to store the open and closed lists. Memory is usually the bottleneck for A* on massive maps.",
    },
    guaranteesShortestPath: true,
    dataStructure: "Priority Queue (ordered by f-score)",
    visualPattern: "Directed beam that expands specifically toward the target",

    useCases: [
      "Video Games (NPC movement)",
      "Robotics and Autonomous Vehicles",
      "Parsing Natural Language",
      "Route planning apps",
      "Puzzle solving (15-puzzle)",
      "Warehouse robot coordination",
    ],

    keyInsights: [
      "It is the best general-purpose pathfinding algorithm.",
      "The performance depends heavily on the Heuristic.",
      "If h(n) is 0, A* turns into Dijkstra.",
      "If h(n) is too high, it becomes Greedy Best-First Search.",
      "It balances optimality with speed.",
    ],

    whenToUse:
      "Always. Unless you have a very specific reason not to. If you know the start and the end point, A* is almost always the right choice.",

    whenNotToUse:
      "If you don't know where the goal is (exploration), or if the map is so small that the overhead of calculating heuristics isn't worth it.",
  },

  greedy: {
    title: "Greedy Best-First Search",
    tagline: "The Impatient Optimist",
    history: `Greedy Best-First Search comes from the early days of AI, where researchers experimented with pure heuristics. It operates on a simple philosophy: "That looks like the right direction, so I'm going that way."

It represents the extreme end of the heuristic spectrum. While A* balances the past (cost so far) and future (estimated cost), Greedy BFS ignores the past entirely and focuses solely on the destination.`,

    mechanics: `Greedy BFS is A* with amnesia. It drops the $g(n)$ component and makes decisions solely based on $h(n)$ (the estimated distance to the goal).

**The Algorithm Step-by-Step:**

1. **Initialize**: Put start node in the priority queue.
2. **Pick**: Choose the node that *looks* closest to the goal.
3. **Check**: Is it the goal?
4. **Push**: Add neighbors to the queue based on their heuristic distance.
5. **Repeat**.

**The Trap:**
Because it ignores the cost of the path taken so far, Greedy BFS can get fooled easily. If there is a U-shaped wall, it will run straight into the center of the U, hit the wall, and be forced to search effectively random neighbors until it finds a way around.`,

    timeComplexity: {
      complexity: "O((V + E) log V)",
      explanation:
        "It uses a Priority Queue like A*, but typically runs much faster because it beelines for the target. However, it can degenerate into a slow search in complex mazes.",
    },
    spaceComplexity: {
      complexity: "O(V)",
      explanation: "Stores the frontier of nodes. similar to A*.",
    },
    guaranteesShortestPath: false,
    dataStructure: "Priority Queue (ordered by h-score)",
    visualPattern: "A laser beam that shoots toward the goal but splinters on obstacles",

    useCases: [
      "Fast prototyping where optimality doesn't matter",
      "Games where 'good enough' movement is acceptable",
      "Scenarios with very few obstacles",
      "AI behaviors that simulate impulsiveness",
      "Web crawling with specific target topics",
      "Heuristic testing",
    ],

    keyInsights: [
      "It is incredibly fast in open spaces.",
      "It does NOT guarantee the shortest path.",
      "It can find drastically suboptimal paths (the 'long way around').",
      "It is susceptible to getting stuck in local optima.",
      "It demonstrates the danger of relying purely on heuristics.",
    ],

    whenToUse:
      "Use Greedy BFS when you need raw speed and don't care if the path is slightly inefficient. It's great for simple movement logic in games with open maps.",

    whenNotToUse:
      "Do not use this for navigation apps or logistics. Sending a user on a route that is 50% longer just because it looked good at the start is a bad user experience.",
  },

  bidirectional: {
    title: "Bidirectional A*",
    tagline: "The Diplomat",
    history: `Proposed in the late 1960s, Bidirectional Search addresses the problem of exponential growth in search trees. The logic is simple geometry: the area of two small circles is smaller than the area of one big circle.

It essentially digs a tunnel from both sides of the mountain, hoping to meet exactly in the middle. When implemented correctly, it can drastically cut down compute time.`,

    mechanics: `This algorithm runs two simultaneous searches: one Forward from the start, and one Backward from the goal.

**The Algorithm Step-by-Step:**

1. **Setup**: Initialize two Priority Queues (Start-to-Goal and Goal-to-Start).
2. **Alternate**: Advance the Forward search one step, then the Backward search one step.
3. **Check Intersection**: After every step, check if the current node has been visited by the *other* search.
4. **Meet**: Once the searches collide, we have a bridge.
5. **Reconstruct**: Stitch the path from Start-to-Meeting-Point and Meeting-Point-to-Goal.

**The Complexity:**
The hardest part isn't the search; it's the termination condition. Just because the searches met doesn't *automatically* mean that specific meeting point lies on the optimal path, though in unweighted graphs it usually does.`,

    timeComplexity: {
      complexity: "O(b^(d/2))",
      explanation:
        "This is the killer feature. Instead of searching depth d, we search depth d/2 twice. Because graph expansion is exponential, this is a massive performance win.",
    },
    spaceComplexity: {
      complexity: "O(V)",
      explanation: "We still need to store the frontiers for both searches.",
    },
    guaranteesShortestPath: true,
    dataStructure: "Two Priority Queues",
    visualPattern: "Two expanding bubbles that merge like cells fusing",

    useCases: [
      "Social Network Connection (finding path between two users)",
      "Rubik's Cube solvers (meet-in-the-middle attacks)",
      "Large-scale map routing",
      "Word ladder puzzles",
      "Database relationship mapping",
      "Flight routing (hub-to-hub)",
    ],

    keyInsights: [
      "It is significantly faster than standard A* for long paths.",
      "Implementation is more complex (managing two states).",
      "You must know the destination explicitly (can't search for 'nearest gas station').",
      "The graph must be traversable backwards (undirected or reversible edges).",
      "It visually demonstrates the power of divide-and-conquer.",
    ],

    whenToUse:
      "Use Bidirectional search for heavy-duty pathfinding on large graphs where you know the exact start and end points. It is the secret sauce for high-performance routing engines.",

    whenNotToUse:
      "Avoid it if the graph is directed and cannot be reversed (like one-way streets where you can't calculate the backward path) or if the implementation complexity isn't worth the speed gain.",
  },

  flood: {
    title: "Flood Fill",
    tagline: "The Completionist",
    history: `Flood Fill is a staple of computer graphics, famous for powering the "Paint Bucket" tool in MS Paint and Photoshop. While usually associated with image manipulation, in a graph context, it is simply a Breadth-First Search that has no brakes.

It doesn't stop when it sees the goal. It keeps going until it has visited every single reachable node. It is the cartographer of algorithms.`,

    mechanics: `Flood Fill performs a complete traversal of the connected component.

**The Algorithm Step-by-Step:**

1. **Start**: Pick a seed node.
2. **Spread**: Visit all valid neighbors.
3. **Recurse/Loop**: Repeat for those neighbors.
4. **Stop**: Only stop when there are no unvisited neighbors left.

In Yield, we use this to generate a "Heatmap" or "Dijkstra Map." Instead of finding a path, we assign every tile a number representing its distance from the start. This creates a flow field that can guide hundreds of agents simultaneously.`,

    timeComplexity: {
      complexity: "O(V + E)",
      explanation:
        "It touches every pixel or node exactly once. It is linear relative to the size of the reachable area.",
    },
    spaceComplexity: {
      complexity: "O(V)",
      explanation: "Recursion stack or queue size depends on the shape of the area to be filled.",
    },
    guaranteesShortestPath: true,
    dataStructure: "Queue or Stack",
    visualPattern: "A tidal wave filling every nook and cranny",

    useCases: [
      "Paint Bucket tools in graphics editors",
      "Procedural Cave Generation",
      "Determining reachable areas in games",
      "Flow Field pathfinding for swarm AI",
      "Minesweeper (clearing empty squares)",
      "Fluid simulation logic",
    ],

    keyInsights: [
      "It creates a map of the entire space, not just a single path.",
      "It is useful for pre-calculating movement data.",
      "It identifies isolated sub-graphs (islands).",
      "It is visually satisfying to watch.",
      "It is the brute-force approach to connectivity.",
    ],

    whenToUse:
      "Use Flood Fill when you need to analyze the entire map, fill a region, or create a flow field for swarm AI movement.",

    whenNotToUse:
      "Do not use this for single-agent pathfinding. It is overkill to map the entire world just to walk to the grocery store.",
  },

  random: {
    title: "Random Walk",
    tagline: "The Chaos Monkey",
    history: `The Random Walk (or "Drunkard's Walk") is a mathematical formalization of a path that consists of a succession of random steps. It dates back to Karl Pearson in 1905.

It is less of an algorithm and more of a cautionary tale. It represents entropy. In the context of Yield, it serves as the baseline control group: this is what happens when you have zero intelligence and zero strategy.`,

    mechanics: `It is exactly what it says on the tin. At every step, the algorithm rolls a die and picks a direction.

**The Algorithm Step-by-Step:**

1. **Pick**: Look at valid neighbors.
2. **Roll**: Choose one randomly.
3. **Move**: Go there.
4. **Repeat**: Until you accidentally stumble upon the goal or the universe ends.

**Why It's Here:**
To show you why we need A*. Watching a Random Walk try to solve a maze is a painful lesson in why heuristics matter. It has no memory of where it has been, so it frequently backtracks and walks in circles.`,

    timeComplexity: {
      complexity: "O(∞) / O(Luck)",
      explanation:
        "Theoretically, it can run forever. In practice, on a finite grid, it will eventually hit the goal, but the time taken is effectively random.",
    },
    spaceComplexity: {
      complexity: "O(1)",
      explanation: "It doesn't need to remember anything. It lives in the moment.",
    },
    guaranteesShortestPath: false,
    dataStructure: "None (RNG)",
    visualPattern: "Jittery, confused, and frustratingly inefficient",

    useCases: [
      "Procedural Generation (creating organic tunnels)",
      "Stock Market modeling (financial theory)",
      "Brownian Motion simulations in physics",
      "Stress testing other systems",
      "Screensavers",
      "Simulating confused NPCs",
    ],

    keyInsights: [
      "It has no strategy.",
      "It creates very organic, jagged shapes.",
      "It is statistically guaranteed to visit every node on a 2D infinite grid eventually (but don't wait up for it).",
      "It is the baseline for comparing 'intelligent' algorithms.",
      "It creates high-frequency noise in pathing.",
    ],

    whenToUse:
      "Use Random Walk for procedural generation (like digging worm tunnels) or for artistic visualizations. It can also be used for 'wandering' AI behavior when the NPC is idle.",

    whenNotToUse: "Never use this if you actually need to get somewhere.",
  },
};

/**
 * Get article content for a specific pathfinding algorithm.
 */
export function getPathfindingArticle(algorithm: PathfindingAlgorithmType): PathfindingArticle {
  return PATHFINDING_ARTICLES[algorithm];
}
