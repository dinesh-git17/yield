import type { GraphAlgorithmType } from "@/lib/store";
import type { Language } from "./sorting";

/**
 * Graph algorithm code implementations across multiple languages.
 * Theme: "Spanning Trees & Dependencies."
 *
 * - Prim's: Grows MST from a single node using PriorityQueue
 * - Kruskal's: Merges forest using Union-Find (Disjoint Set)
 * - Kahn's: Topological sort via indegree tracking
 */

// ─────────────────────────────────────────────────────────────────────────────
// Prim's Algorithm (Minimum Spanning Tree)
// "Dijkstra for MST" - grows a single tree from a start node
// ─────────────────────────────────────────────────────────────────────────────

const PRIM_PYTHON = `import heapq
from collections import defaultdict

def prim(n: int, edges: list[tuple[int, int, int]]) -> list[tuple[int, int, int]]:
    """Find Minimum Spanning Tree using Prim's algorithm.

    Args:
        n: Number of vertices (0 to n-1)
        edges: List of (u, v, weight) tuples

    Returns:
        List of edges in the MST as (u, v, weight) tuples
    """
    # Build adjacency list: node -> [(neighbor, weight), ...]
    graph: dict[int, list[tuple[int, int]]] = defaultdict(list)
    for u, v, w in edges:
        graph[u].append((v, w))
        graph[v].append((u, w))

    mst: list[tuple[int, int, int]] = []
    visited: set[int] = set()

    # Min-heap: (weight, from_node, to_node)
    # Start from node 0
    heap: list[tuple[int, int, int]] = [(0, -1, 0)]

    while heap and len(visited) < n:
        weight, from_node, to_node = heapq.heappop(heap)

        if to_node in visited:
            continue

        visited.add(to_node)

        # Add edge to MST (skip the initial dummy edge)
        if from_node != -1:
            mst.append((from_node, to_node, weight))

        # Explore neighbors
        for neighbor, edge_weight in graph[to_node]:
            if neighbor not in visited:
                heapq.heappush(heap, (edge_weight, to_node, neighbor))

    return mst`;

const PRIM_CPP = `#include <vector>
#include <queue>
#include <utility>

using namespace std;

// Edge: {weight, {from, to}}
using Edge = pair<int, pair<int, int>>;

vector<tuple<int, int, int>> prim(int n, vector<tuple<int, int, int>>& edges) {
    // Build adjacency list: node -> [(neighbor, weight), ...]
    vector<vector<pair<int, int>>> graph(n);
    for (auto& [u, v, w] : edges) {
        graph[u].push_back({v, w});
        graph[v].push_back({u, w});
    }

    vector<tuple<int, int, int>> mst;
    vector<bool> visited(n, false);

    // Min-heap: (weight, from_node, to_node)
    priority_queue<Edge, vector<Edge>, greater<Edge>> pq;
    pq.push({0, {-1, 0}});  // Start from node 0

    while (!pq.empty() && mst.size() < n - 1) {
        auto [weight, nodes] = pq.top();
        auto [from_node, to_node] = nodes;
        pq.pop();

        if (visited[to_node]) continue;
        visited[to_node] = true;

        // Add edge to MST (skip the initial dummy edge)
        if (from_node != -1) {
            mst.push_back({from_node, to_node, weight});
        }

        // Explore neighbors
        for (auto& [neighbor, edge_weight] : graph[to_node]) {
            if (!visited[neighbor]) {
                pq.push({edge_weight, {to_node, neighbor}});
            }
        }
    }

    return mst;
}`;

const PRIM_JAVA = `import java.util.*;

public class Prim {
    public static List<int[]> prim(int n, int[][] edges) {
        // Build adjacency list: node -> [(neighbor, weight), ...]
        List<List<int[]>> graph = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            graph.add(new ArrayList<>());
        }
        for (int[] edge : edges) {
            int u = edge[0], v = edge[1], w = edge[2];
            graph.get(u).add(new int[]{v, w});
            graph.get(v).add(new int[]{u, w});
        }

        List<int[]> mst = new ArrayList<>();
        boolean[] visited = new boolean[n];

        // Min-heap: [weight, from_node, to_node]
        PriorityQueue<int[]> pq = new PriorityQueue<>(
            Comparator.comparingInt(a -> a[0])
        );
        pq.offer(new int[]{0, -1, 0});  // Start from node 0

        while (!pq.isEmpty() && mst.size() < n - 1) {
            int[] curr = pq.poll();
            int weight = curr[0], fromNode = curr[1], toNode = curr[2];

            if (visited[toNode]) continue;
            visited[toNode] = true;

            // Add edge to MST (skip the initial dummy edge)
            if (fromNode != -1) {
                mst.add(new int[]{fromNode, toNode, weight});
            }

            // Explore neighbors
            for (int[] neighbor : graph.get(toNode)) {
                int next = neighbor[0], edgeWeight = neighbor[1];
                if (!visited[next]) {
                    pq.offer(new int[]{edgeWeight, toNode, next});
                }
            }
        }

        return mst;
    }
}`;

const PRIM_JS = `/**
 * Find Minimum Spanning Tree using Prim's algorithm.
 * @param {number} n - Number of vertices (0 to n-1)
 * @param {number[][]} edges - Array of [u, v, weight] edges
 * @returns {number[][]} MST edges as [u, v, weight] arrays
 */
function prim(n, edges) {
  // Build adjacency list: node -> [[neighbor, weight], ...]
  const graph = Array.from({ length: n }, () => []);
  for (const [u, v, w] of edges) {
    graph[u].push([v, w]);
    graph[v].push([u, w]);
  }

  const mst = [];
  const visited = new Set();

  // Simple min-heap using sorted array (for clarity)
  // Production code should use a proper heap implementation
  const heap = [[0, -1, 0]]; // [weight, from, to]

  const popMin = () => {
    heap.sort((a, b) => a[0] - b[0]);
    return heap.shift();
  };

  while (heap.length > 0 && visited.size < n) {
    const [weight, fromNode, toNode] = popMin();

    if (visited.has(toNode)) continue;
    visited.add(toNode);

    // Add edge to MST (skip the initial dummy edge)
    if (fromNode !== -1) {
      mst.push([fromNode, toNode, weight]);
    }

    // Explore neighbors
    for (const [neighbor, edgeWeight] of graph[toNode]) {
      if (!visited.has(neighbor)) {
        heap.push([edgeWeight, toNode, neighbor]);
      }
    }
  }

  return mst;
}`;

const PRIM_GO = `package main

import (
    "container/heap"
)

// Edge represents a weighted edge in the MST
type Edge struct {
    From, To, Weight int
}

// PrimHeap implements heap.Interface for Prim's algorithm
type PrimHeap []Edge

func (h PrimHeap) Len() int           { return len(h) }
func (h PrimHeap) Less(i, j int) bool { return h[i].Weight < h[j].Weight }
func (h PrimHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }

func (h *PrimHeap) Push(x any) { *h = append(*h, x.(Edge)) }
func (h *PrimHeap) Pop() any {
    old := *h
    n := len(old)
    x := old[n-1]
    *h = old[0 : n-1]
    return x
}

// Prim finds the Minimum Spanning Tree using Prim's algorithm
func Prim(n int, edges []Edge) []Edge {
    // Build adjacency list
    graph := make([][]Edge, n)
    for i := range graph {
        graph[i] = []Edge{}
    }
    for _, e := range edges {
        graph[e.From] = append(graph[e.From], Edge{e.From, e.To, e.Weight})
        graph[e.To] = append(graph[e.To], Edge{e.To, e.From, e.Weight})
    }

    mst := []Edge{}
    visited := make([]bool, n)

    // Min-heap starting from node 0
    h := &PrimHeap{{-1, 0, 0}}
    heap.Init(h)

    for h.Len() > 0 && len(mst) < n-1 {
        e := heap.Pop(h).(Edge)
        fromNode, toNode, weight := e.From, e.To, e.Weight

        if visited[toNode] {
            continue
        }
        visited[toNode] = true

        // Add edge to MST (skip initial dummy edge)
        if fromNode != -1 {
            mst = append(mst, Edge{fromNode, toNode, weight})
        }

        // Explore neighbors
        for _, neighbor := range graph[toNode] {
            if !visited[neighbor.To] {
                heap.Push(h, Edge{toNode, neighbor.To, neighbor.Weight})
            }
        }
    }

    return mst
}`;

const PRIM_RUST = `use std::collections::{BinaryHeap, HashSet};
use std::cmp::Reverse;

/// Edge in the graph (from, to, weight)
type Edge = (usize, usize, i32);

/// Find Minimum Spanning Tree using Prim's algorithm
pub fn prim(n: usize, edges: &[Edge]) -> Vec<Edge> {
    // Build adjacency list: node -> [(neighbor, weight), ...]
    let mut graph: Vec<Vec<(usize, i32)>> = vec![vec![]; n];
    for &(u, v, w) in edges {
        graph[u].push((v, w));
        graph[v].push((u, w));
    }

    let mut mst: Vec<Edge> = Vec::new();
    let mut visited: HashSet<usize> = HashSet::new();

    // Min-heap: Reverse for min-heap behavior
    // (weight, from_node, to_node)
    let mut heap: BinaryHeap<Reverse<(i32, i32, usize)>> = BinaryHeap::new();
    heap.push(Reverse((0, -1, 0))); // Start from node 0

    while let Some(Reverse((weight, from_node, to_node))) = heap.pop() {
        if visited.contains(&to_node) {
            continue;
        }
        visited.insert(to_node);

        // Add edge to MST (skip the initial dummy edge)
        if from_node != -1 {
            mst.push((from_node as usize, to_node, weight));
        }

        // Explore neighbors
        for &(neighbor, edge_weight) in &graph[to_node] {
            if !visited.contains(&neighbor) {
                heap.push(Reverse((edge_weight, to_node as i32, neighbor)));
            }
        }

        if mst.len() == n - 1 {
            break;
        }
    }

    mst
}`;

// ─────────────────────────────────────────────────────────────────────────────
// Kruskal's Algorithm (Minimum Spanning Tree)
// "Forest Merging" - sorts edges and uses Union-Find to avoid cycles
// ─────────────────────────────────────────────────────────────────────────────

const KRUSKAL_PYTHON = `class UnionFind:
    """Disjoint Set Union (DSU) with path compression and union by rank."""

    def __init__(self, n: int):
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, x: int) -> int:
        """Find root with path compression."""
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x: int, y: int) -> bool:
        """Union by rank. Returns True if merged, False if already connected."""
        root_x, root_y = self.find(x), self.find(y)

        if root_x == root_y:
            return False  # Already in same set (would create cycle)

        # Union by rank: attach smaller tree under larger tree
        if self.rank[root_x] < self.rank[root_y]:
            self.parent[root_x] = root_y
        elif self.rank[root_x] > self.rank[root_y]:
            self.parent[root_y] = root_x
        else:
            self.parent[root_y] = root_x
            self.rank[root_x] += 1

        return True


def kruskal(n: int, edges: list[tuple[int, int, int]]) -> list[tuple[int, int, int]]:
    """Find Minimum Spanning Tree using Kruskal's algorithm.

    Args:
        n: Number of vertices (0 to n-1)
        edges: List of (u, v, weight) tuples

    Returns:
        List of edges in the MST as (u, v, weight) tuples
    """
    # Sort edges by weight (greedy approach)
    sorted_edges = sorted(edges, key=lambda e: e[2])

    uf = UnionFind(n)
    mst: list[tuple[int, int, int]] = []

    for u, v, weight in sorted_edges:
        # If u and v are in different components, add edge
        if uf.union(u, v):
            mst.append((u, v, weight))

            # MST complete when we have n-1 edges
            if len(mst) == n - 1:
                break

    return mst`;

const KRUSKAL_CPP = `#include <vector>
#include <algorithm>

using namespace std;

class UnionFind {
private:
    vector<int> parent, rank_;

public:
    UnionFind(int n) : parent(n), rank_(n, 0) {
        for (int i = 0; i < n; i++) {
            parent[i] = i;
        }
    }

    // Find root with path compression
    int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }

    // Union by rank. Returns true if merged, false if already connected
    bool unite(int x, int y) {
        int rootX = find(x), rootY = find(y);

        if (rootX == rootY) {
            return false;  // Already in same set (would create cycle)
        }

        // Union by rank: attach smaller tree under larger tree
        if (rank_[rootX] < rank_[rootY]) {
            parent[rootX] = rootY;
        } else if (rank_[rootX] > rank_[rootY]) {
            parent[rootY] = rootX;
        } else {
            parent[rootY] = rootX;
            rank_[rootX]++;
        }

        return true;
    }
};

vector<tuple<int, int, int>> kruskal(int n, vector<tuple<int, int, int>>& edges) {
    // Sort edges by weight (greedy approach)
    sort(edges.begin(), edges.end(), [](const auto& a, const auto& b) {
        return get<2>(a) < get<2>(b);
    });

    UnionFind uf(n);
    vector<tuple<int, int, int>> mst;

    for (auto& [u, v, weight] : edges) {
        // If u and v are in different components, add edge
        if (uf.unite(u, v)) {
            mst.push_back({u, v, weight});

            // MST complete when we have n-1 edges
            if (mst.size() == n - 1) break;
        }
    }

    return mst;
}`;

const KRUSKAL_JAVA = `import java.util.*;

public class Kruskal {

    static class UnionFind {
        private int[] parent, rank;

        public UnionFind(int n) {
            parent = new int[n];
            rank = new int[n];
            for (int i = 0; i < n; i++) {
                parent[i] = i;
            }
        }

        // Find root with path compression
        public int find(int x) {
            if (parent[x] != x) {
                parent[x] = find(parent[x]);
            }
            return parent[x];
        }

        // Union by rank. Returns true if merged
        public boolean union(int x, int y) {
            int rootX = find(x), rootY = find(y);

            if (rootX == rootY) {
                return false;  // Already in same set
            }

            // Union by rank
            if (rank[rootX] < rank[rootY]) {
                parent[rootX] = rootY;
            } else if (rank[rootX] > rank[rootY]) {
                parent[rootY] = rootX;
            } else {
                parent[rootY] = rootX;
                rank[rootX]++;
            }

            return true;
        }
    }

    public static List<int[]> kruskal(int n, int[][] edges) {
        // Sort edges by weight
        Arrays.sort(edges, Comparator.comparingInt(e -> e[2]));

        UnionFind uf = new UnionFind(n);
        List<int[]> mst = new ArrayList<>();

        for (int[] edge : edges) {
            int u = edge[0], v = edge[1], weight = edge[2];

            // If u and v are in different components, add edge
            if (uf.union(u, v)) {
                mst.add(new int[]{u, v, weight});

                // MST complete when we have n-1 edges
                if (mst.size() == n - 1) break;
            }
        }

        return mst;
    }
}`;

const KRUSKAL_JS = `/**
 * Disjoint Set Union (DSU) with path compression and union by rank.
 */
class UnionFind {
  #parent;
  #rank;

  constructor(n) {
    this.#parent = Array.from({ length: n }, (_, i) => i);
    this.#rank = new Array(n).fill(0);
  }

  /**
   * Find root with path compression.
   */
  find(x) {
    if (this.#parent[x] !== x) {
      this.#parent[x] = this.find(this.#parent[x]);
    }
    return this.#parent[x];
  }

  /**
   * Union by rank. Returns true if merged, false if already connected.
   */
  union(x, y) {
    const rootX = this.find(x);
    const rootY = this.find(y);

    if (rootX === rootY) {
      return false; // Already in same set (would create cycle)
    }

    // Union by rank: attach smaller tree under larger tree
    if (this.#rank[rootX] < this.#rank[rootY]) {
      this.#parent[rootX] = rootY;
    } else if (this.#rank[rootX] > this.#rank[rootY]) {
      this.#parent[rootY] = rootX;
    } else {
      this.#parent[rootY] = rootX;
      this.#rank[rootX]++;
    }

    return true;
  }
}

/**
 * Find Minimum Spanning Tree using Kruskal's algorithm.
 * @param {number} n - Number of vertices (0 to n-1)
 * @param {number[][]} edges - Array of [u, v, weight] edges
 * @returns {number[][]} MST edges as [u, v, weight] arrays
 */
function kruskal(n, edges) {
  // Sort edges by weight (greedy approach)
  const sortedEdges = [...edges].sort((a, b) => a[2] - b[2]);

  const uf = new UnionFind(n);
  const mst = [];

  for (const [u, v, weight] of sortedEdges) {
    // If u and v are in different components, add edge
    if (uf.union(u, v)) {
      mst.push([u, v, weight]);

      // MST complete when we have n-1 edges
      if (mst.length === n - 1) break;
    }
  }

  return mst;
}`;

const KRUSKAL_GO = `package main

import "sort"

// UnionFind implements Disjoint Set Union with path compression and union by rank
type UnionFind struct {
    parent []int
    rank   []int
}

// NewUnionFind creates a new UnionFind structure for n elements
func NewUnionFind(n int) *UnionFind {
    parent := make([]int, n)
    for i := range parent {
        parent[i] = i
    }
    return &UnionFind{
        parent: parent,
        rank:   make([]int, n),
    }
}

// Find returns the root of x with path compression
func (uf *UnionFind) Find(x int) int {
    if uf.parent[x] != x {
        uf.parent[x] = uf.Find(uf.parent[x])
    }
    return uf.parent[x]
}

// Union merges sets containing x and y. Returns true if merged
func (uf *UnionFind) Union(x, y int) bool {
    rootX, rootY := uf.Find(x), uf.Find(y)

    if rootX == rootY {
        return false // Already in same set
    }

    // Union by rank
    if uf.rank[rootX] < uf.rank[rootY] {
        uf.parent[rootX] = rootY
    } else if uf.rank[rootX] > uf.rank[rootY] {
        uf.parent[rootY] = rootX
    } else {
        uf.parent[rootY] = rootX
        uf.rank[rootX]++
    }

    return true
}

// Edge represents a weighted edge
type Edge struct {
    From, To, Weight int
}

// Kruskal finds the Minimum Spanning Tree using Kruskal's algorithm
func Kruskal(n int, edges []Edge) []Edge {
    // Sort edges by weight
    sort.Slice(edges, func(i, j int) bool {
        return edges[i].Weight < edges[j].Weight
    })

    uf := NewUnionFind(n)
    mst := []Edge{}

    for _, e := range edges {
        // If u and v are in different components, add edge
        if uf.Union(e.From, e.To) {
            mst = append(mst, e)

            // MST complete when we have n-1 edges
            if len(mst) == n-1 {
                break
            }
        }
    }

    return mst
}`;

const KRUSKAL_RUST = `/// Disjoint Set Union (DSU) with path compression and union by rank
struct UnionFind {
    parent: Vec<usize>,
    rank: Vec<usize>,
}

impl UnionFind {
    fn new(n: usize) -> Self {
        UnionFind {
            parent: (0..n).collect(),
            rank: vec![0; n],
        }
    }

    /// Find root with path compression
    fn find(&mut self, x: usize) -> usize {
        if self.parent[x] != x {
            self.parent[x] = self.find(self.parent[x]);
        }
        self.parent[x]
    }

    /// Union by rank. Returns true if merged, false if already connected
    fn union(&mut self, x: usize, y: usize) -> bool {
        let root_x = self.find(x);
        let root_y = self.find(y);

        if root_x == root_y {
            return false; // Already in same set
        }

        // Union by rank: attach smaller tree under larger tree
        if self.rank[root_x] < self.rank[root_y] {
            self.parent[root_x] = root_y;
        } else if self.rank[root_x] > self.rank[root_y] {
            self.parent[root_y] = root_x;
        } else {
            self.parent[root_y] = root_x;
            self.rank[root_x] += 1;
        }

        true
    }
}

/// Edge in the graph (from, to, weight)
type Edge = (usize, usize, i32);

/// Find Minimum Spanning Tree using Kruskal's algorithm
pub fn kruskal(n: usize, edges: &mut [Edge]) -> Vec<Edge> {
    // Sort edges by weight (greedy approach)
    edges.sort_by_key(|e| e.2);

    let mut uf = UnionFind::new(n);
    let mut mst: Vec<Edge> = Vec::new();

    for &(u, v, weight) in edges.iter() {
        // If u and v are in different components, add edge
        if uf.union(u, v) {
            mst.push((u, v, weight));

            // MST complete when we have n-1 edges
            if mst.len() == n - 1 {
                break;
            }
        }
    }

    mst
}`;

// ─────────────────────────────────────────────────────────────────────────────
// Kahn's Algorithm (Topological Sort)
// "Dependency Resolution" - like npm install or a Build System
// ─────────────────────────────────────────────────────────────────────────────

const KAHN_PYTHON = `from collections import deque

def kahn(n: int, edges: list[tuple[int, int]]) -> list[int] | None:
    """Topological sort using Kahn's algorithm (BFS-based).

    Args:
        n: Number of vertices (0 to n-1)
        edges: List of (u, v) tuples meaning u -> v (u must come before v)

    Returns:
        List of vertices in topological order, or None if cycle detected
    """
    # Build adjacency list and compute indegrees
    graph: list[list[int]] = [[] for _ in range(n)]
    indegree: list[int] = [0] * n

    for u, v in edges:
        graph[u].append(v)
        indegree[v] += 1

    # Initialize queue with all nodes having indegree 0
    # (nodes with no prerequisites)
    queue: deque[int] = deque()
    for node in range(n):
        if indegree[node] == 0:
            queue.append(node)

    result: list[int] = []

    while queue:
        # Process node with no remaining dependencies
        node = queue.popleft()
        result.append(node)

        # "Remove" this node by decrementing neighbor indegrees
        for neighbor in graph[node]:
            indegree[neighbor] -= 1

            # If neighbor now has no dependencies, add to queue
            if indegree[neighbor] == 0:
                queue.append(neighbor)

    # If we processed all nodes, we have a valid ordering
    # Otherwise, there's a cycle
    if len(result) == n:
        return result
    else:
        return None  # Cycle detected`;

const KAHN_CPP = `#include <vector>
#include <queue>
#include <optional>

using namespace std;

optional<vector<int>> kahn(int n, vector<pair<int, int>>& edges) {
    // Build adjacency list and compute indegrees
    vector<vector<int>> graph(n);
    vector<int> indegree(n, 0);

    for (auto& [u, v] : edges) {
        graph[u].push_back(v);
        indegree[v]++;
    }

    // Initialize queue with all nodes having indegree 0
    queue<int> q;
    for (int node = 0; node < n; node++) {
        if (indegree[node] == 0) {
            q.push(node);
        }
    }

    vector<int> result;

    while (!q.empty()) {
        // Process node with no remaining dependencies
        int node = q.front();
        q.pop();
        result.push_back(node);

        // "Remove" this node by decrementing neighbor indegrees
        for (int neighbor : graph[node]) {
            indegree[neighbor]--;

            // If neighbor now has no dependencies, add to queue
            if (indegree[neighbor] == 0) {
                q.push(neighbor);
            }
        }
    }

    // If we processed all nodes, we have a valid ordering
    if (result.size() == n) {
        return result;
    }
    return nullopt;  // Cycle detected
}`;

const KAHN_JAVA = `import java.util.*;

public class Kahn {
    /**
     * Topological sort using Kahn's algorithm (BFS-based).
     * @param n Number of vertices (0 to n-1)
     * @param edges Array of [u, v] meaning u -> v (u must come before v)
     * @return List of vertices in topological order, or null if cycle detected
     */
    public static List<Integer> kahn(int n, int[][] edges) {
        // Build adjacency list and compute indegrees
        List<List<Integer>> graph = new ArrayList<>();
        int[] indegree = new int[n];

        for (int i = 0; i < n; i++) {
            graph.add(new ArrayList<>());
        }

        for (int[] edge : edges) {
            int u = edge[0], v = edge[1];
            graph.get(u).add(v);
            indegree[v]++;
        }

        // Initialize queue with all nodes having indegree 0
        Queue<Integer> queue = new LinkedList<>();
        for (int node = 0; node < n; node++) {
            if (indegree[node] == 0) {
                queue.offer(node);
            }
        }

        List<Integer> result = new ArrayList<>();

        while (!queue.isEmpty()) {
            // Process node with no remaining dependencies
            int node = queue.poll();
            result.add(node);

            // "Remove" this node by decrementing neighbor indegrees
            for (int neighbor : graph.get(node)) {
                indegree[neighbor]--;

                // If neighbor now has no dependencies, add to queue
                if (indegree[neighbor] == 0) {
                    queue.offer(neighbor);
                }
            }
        }

        // If we processed all nodes, we have a valid ordering
        if (result.size() == n) {
            return result;
        }
        return null;  // Cycle detected
    }
}`;

const KAHN_JS = `/**
 * Topological sort using Kahn's algorithm (BFS-based).
 * Like npm install resolving package dependencies.
 *
 * @param {number} n - Number of vertices (0 to n-1)
 * @param {number[][]} edges - Array of [u, v] meaning u -> v (u must come before v)
 * @returns {number[] | null} Vertices in topological order, or null if cycle detected
 */
function kahn(n, edges) {
  // Build adjacency list and compute indegrees
  const graph = Array.from({ length: n }, () => []);
  const indegree = new Array(n).fill(0);

  for (const [u, v] of edges) {
    graph[u].push(v);
    indegree[v]++;
  }

  // Initialize queue with all nodes having indegree 0
  // (nodes with no prerequisites)
  const queue = [];
  for (let node = 0; node < n; node++) {
    if (indegree[node] === 0) {
      queue.push(node);
    }
  }

  const result = [];

  while (queue.length > 0) {
    // Process node with no remaining dependencies
    const node = queue.shift();
    result.push(node);

    // "Remove" this node by decrementing neighbor indegrees
    for (const neighbor of graph[node]) {
      indegree[neighbor]--;

      // If neighbor now has no dependencies, add to queue
      if (indegree[neighbor] === 0) {
        queue.push(neighbor);
      }
    }
  }

  // If we processed all nodes, we have a valid ordering
  // Otherwise, there's a cycle
  return result.length === n ? result : null;
}`;

const KAHN_GO = `package main

// Kahn performs topological sort using Kahn's algorithm (BFS-based).
// Returns nil if a cycle is detected.
func Kahn(n int, edges [][2]int) []int {
    // Build adjacency list and compute indegrees
    graph := make([][]int, n)
    for i := range graph {
        graph[i] = []int{}
    }
    indegree := make([]int, n)

    for _, edge := range edges {
        u, v := edge[0], edge[1]
        graph[u] = append(graph[u], v)
        indegree[v]++
    }

    // Initialize queue with all nodes having indegree 0
    queue := []int{}
    for node := 0; node < n; node++ {
        if indegree[node] == 0 {
            queue = append(queue, node)
        }
    }

    result := []int{}

    for len(queue) > 0 {
        // Process node with no remaining dependencies
        node := queue[0]
        queue = queue[1:]
        result = append(result, node)

        // "Remove" this node by decrementing neighbor indegrees
        for _, neighbor := range graph[node] {
            indegree[neighbor]--

            // If neighbor now has no dependencies, add to queue
            if indegree[neighbor] == 0 {
                queue = append(queue, neighbor)
            }
        }
    }

    // If we processed all nodes, we have a valid ordering
    if len(result) == n {
        return result
    }
    return nil // Cycle detected
}`;

const KAHN_RUST = `use std::collections::VecDeque;

/// Topological sort using Kahn's algorithm (BFS-based).
/// Returns None if a cycle is detected.
pub fn kahn(n: usize, edges: &[(usize, usize)]) -> Option<Vec<usize>> {
    // Build adjacency list and compute indegrees
    let mut graph: Vec<Vec<usize>> = vec![vec![]; n];
    let mut indegree: Vec<usize> = vec![0; n];

    for &(u, v) in edges {
        graph[u].push(v);
        indegree[v] += 1;
    }

    // Initialize queue with all nodes having indegree 0
    // (nodes with no prerequisites)
    let mut queue: VecDeque<usize> = VecDeque::new();
    for node in 0..n {
        if indegree[node] == 0 {
            queue.push_back(node);
        }
    }

    let mut result: Vec<usize> = Vec::new();

    while let Some(node) = queue.pop_front() {
        // Process node with no remaining dependencies
        result.push(node);

        // "Remove" this node by decrementing neighbor indegrees
        for &neighbor in &graph[node] {
            indegree[neighbor] -= 1;

            // If neighbor now has no dependencies, add to queue
            if indegree[neighbor] == 0 {
                queue.push_back(neighbor);
            }
        }
    }

    // If we processed all nodes, we have a valid ordering
    // Otherwise, there's a cycle
    if result.len() == n {
        Some(result)
    } else {
        None // Cycle detected
    }
}`;

// ─────────────────────────────────────────────────────────────────────────────
// Complete Registry
// ─────────────────────────────────────────────────────────────────────────────

type GraphImplementations = Record<GraphAlgorithmType, Record<Language, string>>;

/**
 * Reference implementations of all graph algorithms in multiple languages.
 * - Prim's: PriorityQueue-based MST (good for dense graphs)
 * - Kruskal's: Union-Find based MST (good for sparse graphs)
 * - Kahn's: BFS-based topological sort (dependency resolution)
 */
export const GRAPH_IMPLEMENTATIONS: GraphImplementations = {
  prim: {
    python: PRIM_PYTHON,
    cpp: PRIM_CPP,
    java: PRIM_JAVA,
    javascript: PRIM_JS,
    go: PRIM_GO,
    rust: PRIM_RUST,
  },
  kruskal: {
    python: KRUSKAL_PYTHON,
    cpp: KRUSKAL_CPP,
    java: KRUSKAL_JAVA,
    javascript: KRUSKAL_JS,
    go: KRUSKAL_GO,
    rust: KRUSKAL_RUST,
  },
  kahn: {
    python: KAHN_PYTHON,
    cpp: KAHN_CPP,
    java: KAHN_JAVA,
    javascript: KAHN_JS,
    go: KAHN_GO,
    rust: KAHN_RUST,
  },
};

/**
 * Get graph algorithm implementation for a specific language.
 */
export function getGraphImplementation(algorithm: GraphAlgorithmType, language: Language): string {
  return GRAPH_IMPLEMENTATIONS[algorithm]?.[language] ?? "// Implementation not found";
}

/**
 * Get all implementations for a specific graph algorithm.
 */
export function getAllGraphImplementations(
  algorithm: GraphAlgorithmType
): Record<Language, string> {
  return GRAPH_IMPLEMENTATIONS[algorithm];
}
