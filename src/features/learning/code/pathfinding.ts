import type { PathfindingAlgorithmType } from "@/lib/store";
import type { Language } from "./sorting";

// ─────────────────────────────────────────────────────────────────────────────
// BFS (Breadth-First Search) Implementations
// ─────────────────────────────────────────────────────────────────────────────

const BFS_PYTHON = `from collections import deque

def bfs(grid: list[list[int]], start: tuple[int, int], end: tuple[int, int]) -> list[tuple[int, int]] | None:
    """Find shortest path in grid using BFS. 0 = passable, 1 = wall."""
    rows, cols = len(grid), len(grid[0])
    queue = deque([(start, [start])])
    visited = {start}
    directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]

    while queue:
        (row, col), path = queue.popleft()

        if (row, col) == end:
            return path

        for dr, dc in directions:
            new_row, new_col = row + dr, col + dc

            if (0 <= new_row < rows and 0 <= new_col < cols
                    and grid[new_row][new_col] == 0
                    and (new_row, new_col) not in visited):
                visited.add((new_row, new_col))
                queue.append(((new_row, new_col), path + [(new_row, new_col)]))

    return None`;

const BFS_CPP = `#include <vector>
#include <queue>
#include <unordered_set>

struct Point { int row, col; };

std::vector<Point> bfs(
    const std::vector<std::vector<int>>& grid,
    Point start, Point end
) {
    int rows = grid.size(), cols = grid[0].size();
    std::queue<std::pair<Point, std::vector<Point>>> q;
    std::set<std::pair<int,int>> visited;

    q.push({start, {start}});
    visited.insert({start.row, start.col});

    int dirs[4][2] = {{0,1}, {1,0}, {0,-1}, {-1,0}};

    while (!q.empty()) {
        auto [curr, path] = q.front();
        q.pop();

        if (curr.row == end.row && curr.col == end.col)
            return path;

        for (auto& d : dirs) {
            int nr = curr.row + d[0];
            int nc = curr.col + d[1];

            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols
                && grid[nr][nc] == 0
                && visited.find({nr, nc}) == visited.end()) {
                visited.insert({nr, nc});
                auto newPath = path;
                newPath.push_back({nr, nc});
                q.push({{nr, nc}, newPath});
            }
        }
    }
    return {};
}`;

const BFS_JAVA = `import java.util.*;

public List<int[]> bfs(int[][] grid, int[] start, int[] end) {
    int rows = grid.length, cols = grid[0].length;
    Queue<List<int[]>> queue = new LinkedList<>();
    Set<String> visited = new HashSet<>();

    List<int[]> startPath = new ArrayList<>();
    startPath.add(start);
    queue.offer(startPath);
    visited.add(start[0] + "," + start[1]);

    int[][] dirs = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};

    while (!queue.isEmpty()) {
        List<int[]> path = queue.poll();
        int[] curr = path.get(path.size() - 1);

        if (curr[0] == end[0] && curr[1] == end[1])
            return path;

        for (int[] d : dirs) {
            int nr = curr[0] + d[0];
            int nc = curr[1] + d[1];
            String key = nr + "," + nc;

            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols
                && grid[nr][nc] == 0 && !visited.contains(key)) {
                visited.add(key);
                List<int[]> newPath = new ArrayList<>(path);
                newPath.add(new int[]{nr, nc});
                queue.offer(newPath);
            }
        }
    }
    return null;
}`;

const BFS_JS = `function bfs(grid, start, end) {
  const rows = grid.length;
  const cols = grid[0].length;
  const queue = [[start, [start]]];
  const visited = new Set([\`\${start[0]},\${start[1]}\`]);
  const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];

  while (queue.length > 0) {
    const [[row, col], path] = queue.shift();

    if (row === end[0] && col === end[1]) {
      return path;
    }

    for (const [dr, dc] of dirs) {
      const nr = row + dr;
      const nc = col + dc;
      const key = \`\${nr},\${nc}\`;

      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols
          && grid[nr][nc] === 0 && !visited.has(key)) {
        visited.add(key);
        queue.push([[nr, nc], [...path, [nr, nc]]]);
      }
    }
  }
  return null;
}`;

const BFS_GO = `type Point struct{ Row, Col int }

func bfs(grid [][]int, start, end Point) []Point {
    rows, cols := len(grid), len(grid[0])
    type state struct {
        pos  Point
        path []Point
    }

    queue := []state{{start, []Point{start}}}
    visited := map[Point]bool{start: true}
    dirs := []Point{{0, 1}, {1, 0}, {0, -1}, {-1, 0}}

    for len(queue) > 0 {
        curr := queue[0]
        queue = queue[1:]

        if curr.pos == end {
            return curr.path
        }

        for _, d := range dirs {
            nr, nc := curr.pos.Row+d.Row, curr.pos.Col+d.Col
            next := Point{nr, nc}

            if nr >= 0 && nr < rows && nc >= 0 && nc < cols &&
                grid[nr][nc] == 0 && !visited[next] {
                visited[next] = true
                newPath := make([]Point, len(curr.path)+1)
                copy(newPath, curr.path)
                newPath[len(curr.path)] = next
                queue = append(queue, state{next, newPath})
            }
        }
    }
    return nil
}`;

const BFS_RUST = `use std::collections::{HashSet, VecDeque};

fn bfs(grid: &[Vec<i32>], start: (usize, usize), end: (usize, usize)) -> Option<Vec<(usize, usize)>> {
    let (rows, cols) = (grid.len(), grid[0].len());
    let mut queue: VecDeque<((usize, usize), Vec<(usize, usize)>)> = VecDeque::new();
    let mut visited: HashSet<(usize, usize)> = HashSet::new();

    queue.push_back((start, vec![start]));
    visited.insert(start);

    let dirs: [(i32, i32); 4] = [(0, 1), (1, 0), (0, -1), (-1, 0)];

    while let Some(((row, col), path)) = queue.pop_front() {
        if (row, col) == end {
            return Some(path);
        }

        for (dr, dc) in dirs {
            let nr = row as i32 + dr;
            let nc = col as i32 + dc;

            if nr >= 0 && nr < rows as i32 && nc >= 0 && nc < cols as i32 {
                let (nr, nc) = (nr as usize, nc as usize);
                if grid[nr][nc] == 0 && !visited.contains(&(nr, nc)) {
                    visited.insert((nr, nc));
                    let mut new_path = path.clone();
                    new_path.push((nr, nc));
                    queue.push_back(((nr, nc), new_path));
                }
            }
        }
    }
    None
}`;

// ─────────────────────────────────────────────────────────────────────────────
// DFS (Depth-First Search) Implementations
// ─────────────────────────────────────────────────────────────────────────────

const DFS_PYTHON = `def dfs(grid: list[list[int]], start: tuple[int, int], end: tuple[int, int]) -> list[tuple[int, int]] | None:
    """Find a path in grid using DFS. Does NOT guarantee shortest path."""
    rows, cols = len(grid), len(grid[0])
    stack = [(start, [start])]
    visited = set()
    directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]

    while stack:
        (row, col), path = stack.pop()

        if (row, col) in visited:
            continue
        visited.add((row, col))

        if (row, col) == end:
            return path

        for dr, dc in directions:
            new_row, new_col = row + dr, col + dc

            if (0 <= new_row < rows and 0 <= new_col < cols
                    and grid[new_row][new_col] == 0
                    and (new_row, new_col) not in visited):
                stack.append(((new_row, new_col), path + [(new_row, new_col)]))

    return None`;

const DFS_CPP = `std::vector<Point> dfs(
    const std::vector<std::vector<int>>& grid,
    Point start, Point end
) {
    int rows = grid.size(), cols = grid[0].size();
    std::stack<std::pair<Point, std::vector<Point>>> stk;
    std::set<std::pair<int,int>> visited;

    stk.push({start, {start}});
    int dirs[4][2] = {{0,1}, {1,0}, {0,-1}, {-1,0}};

    while (!stk.empty()) {
        auto [curr, path] = stk.top();
        stk.pop();

        if (visited.count({curr.row, curr.col}))
            continue;
        visited.insert({curr.row, curr.col});

        if (curr.row == end.row && curr.col == end.col)
            return path;

        for (auto& d : dirs) {
            int nr = curr.row + d[0];
            int nc = curr.col + d[1];

            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols
                && grid[nr][nc] == 0
                && !visited.count({nr, nc})) {
                auto newPath = path;
                newPath.push_back({nr, nc});
                stk.push({{nr, nc}, newPath});
            }
        }
    }
    return {};
}`;

const DFS_JAVA = `public List<int[]> dfs(int[][] grid, int[] start, int[] end) {
    int rows = grid.length, cols = grid[0].length;
    Deque<List<int[]>> stack = new ArrayDeque<>();
    Set<String> visited = new HashSet<>();

    List<int[]> startPath = new ArrayList<>();
    startPath.add(start);
    stack.push(startPath);

    int[][] dirs = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};

    while (!stack.isEmpty()) {
        List<int[]> path = stack.pop();
        int[] curr = path.get(path.size() - 1);
        String key = curr[0] + "," + curr[1];

        if (visited.contains(key))
            continue;
        visited.add(key);

        if (curr[0] == end[0] && curr[1] == end[1])
            return path;

        for (int[] d : dirs) {
            int nr = curr[0] + d[0];
            int nc = curr[1] + d[1];
            String nkey = nr + "," + nc;

            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols
                && grid[nr][nc] == 0 && !visited.contains(nkey)) {
                List<int[]> newPath = new ArrayList<>(path);
                newPath.add(new int[]{nr, nc});
                stack.push(newPath);
            }
        }
    }
    return null;
}`;

const DFS_JS = `function dfs(grid, start, end) {
  const rows = grid.length;
  const cols = grid[0].length;
  const stack = [[start, [start]]];
  const visited = new Set();
  const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];

  while (stack.length > 0) {
    const [[row, col], path] = stack.pop();
    const key = \`\${row},\${col}\`;

    if (visited.has(key)) continue;
    visited.add(key);

    if (row === end[0] && col === end[1]) {
      return path;
    }

    for (const [dr, dc] of dirs) {
      const nr = row + dr;
      const nc = col + dc;
      const nkey = \`\${nr},\${nc}\`;

      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols
          && grid[nr][nc] === 0 && !visited.has(nkey)) {
        stack.push([[nr, nc], [...path, [nr, nc]]]);
      }
    }
  }
  return null;
}`;

const DFS_GO = `func dfs(grid [][]int, start, end Point) []Point {
    rows, cols := len(grid), len(grid[0])
    type state struct {
        pos  Point
        path []Point
    }

    stack := []state{{start, []Point{start}}}
    visited := map[Point]bool{}
    dirs := []Point{{0, 1}, {1, 0}, {0, -1}, {-1, 0}}

    for len(stack) > 0 {
        curr := stack[len(stack)-1]
        stack = stack[:len(stack)-1]

        if visited[curr.pos] {
            continue
        }
        visited[curr.pos] = true

        if curr.pos == end {
            return curr.path
        }

        for _, d := range dirs {
            nr, nc := curr.pos.Row+d.Row, curr.pos.Col+d.Col
            next := Point{nr, nc}

            if nr >= 0 && nr < rows && nc >= 0 && nc < cols &&
                grid[nr][nc] == 0 && !visited[next] {
                newPath := make([]Point, len(curr.path)+1)
                copy(newPath, curr.path)
                newPath[len(curr.path)] = next
                stack = append(stack, state{next, newPath})
            }
        }
    }
    return nil
}`;

const DFS_RUST = `fn dfs(grid: &[Vec<i32>], start: (usize, usize), end: (usize, usize)) -> Option<Vec<(usize, usize)>> {
    let (rows, cols) = (grid.len(), grid[0].len());
    let mut stack: Vec<((usize, usize), Vec<(usize, usize)>)> = Vec::new();
    let mut visited: HashSet<(usize, usize)> = HashSet::new();

    stack.push((start, vec![start]));
    let dirs: [(i32, i32); 4] = [(0, 1), (1, 0), (0, -1), (-1, 0)];

    while let Some(((row, col), path)) = stack.pop() {
        if visited.contains(&(row, col)) {
            continue;
        }
        visited.insert((row, col));

        if (row, col) == end {
            return Some(path);
        }

        for (dr, dc) in dirs {
            let nr = row as i32 + dr;
            let nc = col as i32 + dc;

            if nr >= 0 && nr < rows as i32 && nc >= 0 && nc < cols as i32 {
                let (nr, nc) = (nr as usize, nc as usize);
                if grid[nr][nc] == 0 && !visited.contains(&(nr, nc)) {
                    let mut new_path = path.clone();
                    new_path.push((nr, nc));
                    stack.push(((nr, nc), new_path));
                }
            }
        }
    }
    None
}`;

// ─────────────────────────────────────────────────────────────────────────────
// Dijkstra's Algorithm Implementations
// ─────────────────────────────────────────────────────────────────────────────

const DIJKSTRA_PYTHON = `import heapq

def dijkstra(grid: list[list[int]], start: tuple[int, int], end: tuple[int, int]) -> list[tuple[int, int]] | None:
    """Find shortest path in weighted grid using Dijkstra's algorithm.
    Cell values represent movement cost (0 = blocked)."""
    rows, cols = len(grid), len(grid[0])
    distances = {start: 0}
    parents = {start: None}
    heap = [(0, start)]
    visited = set()
    directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]

    while heap:
        dist, (row, col) = heapq.heappop(heap)

        if (row, col) in visited:
            continue
        visited.add((row, col))

        if (row, col) == end:
            # Reconstruct path
            path = []
            curr = end
            while curr:
                path.append(curr)
                curr = parents[curr]
            return path[::-1]

        for dr, dc in directions:
            nr, nc = row + dr, col + dc

            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] > 0:
                new_dist = dist + grid[nr][nc]

                if (nr, nc) not in distances or new_dist < distances[(nr, nc)]:
                    distances[(nr, nc)] = new_dist
                    parents[(nr, nc)] = (row, col)
                    heapq.heappush(heap, (new_dist, (nr, nc)))

    return None`;

const DIJKSTRA_CPP = `#include <queue>
#include <unordered_map>

std::vector<Point> dijkstra(
    const std::vector<std::vector<int>>& grid,
    Point start, Point end
) {
    int rows = grid.size(), cols = grid[0].size();

    auto hash = [cols](Point p) { return p.row * cols + p.col; };
    std::unordered_map<int, int> dist;
    std::unordered_map<int, Point> parent;
    std::set<std::pair<int,int>> visited;

    using PQItem = std::pair<int, Point>;
    std::priority_queue<PQItem, std::vector<PQItem>, std::greater<>> pq;

    dist[hash(start)] = 0;
    pq.push({0, start});

    int dirs[4][2] = {{0,1}, {1,0}, {0,-1}, {-1,0}};

    while (!pq.empty()) {
        auto [d, curr] = pq.top();
        pq.pop();

        if (visited.count({curr.row, curr.col}))
            continue;
        visited.insert({curr.row, curr.col});

        if (curr.row == end.row && curr.col == end.col) {
            std::vector<Point> path;
            Point p = end;
            while (hash(p) != hash(start)) {
                path.push_back(p);
                p = parent[hash(p)];
            }
            path.push_back(start);
            std::reverse(path.begin(), path.end());
            return path;
        }

        for (auto& dir : dirs) {
            int nr = curr.row + dir[0];
            int nc = curr.col + dir[1];

            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols
                && grid[nr][nc] > 0) {
                int newDist = d + grid[nr][nc];
                int h = hash({nr, nc});

                if (!dist.count(h) || newDist < dist[h]) {
                    dist[h] = newDist;
                    parent[h] = curr;
                    pq.push({newDist, {nr, nc}});
                }
            }
        }
    }
    return {};
}`;

const DIJKSTRA_JAVA = `import java.util.*;

public List<int[]> dijkstra(int[][] grid, int[] start, int[] end) {
    int rows = grid.length, cols = grid[0].length;
    Map<String, Integer> dist = new HashMap<>();
    Map<String, int[]> parent = new HashMap<>();
    Set<String> visited = new HashSet<>();

    PriorityQueue<int[]> pq = new PriorityQueue<>(
        Comparator.comparingInt(a -> a[0])
    );

    String startKey = start[0] + "," + start[1];
    dist.put(startKey, 0);
    pq.offer(new int[]{0, start[0], start[1]});

    int[][] dirs = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};

    while (!pq.isEmpty()) {
        int[] curr = pq.poll();
        int d = curr[0], row = curr[1], col = curr[2];
        String key = row + "," + col;

        if (visited.contains(key)) continue;
        visited.add(key);

        if (row == end[0] && col == end[1]) {
            List<int[]> path = new ArrayList<>();
            int[] p = end;
            while (p != null) {
                path.add(0, p);
                p = parent.get(p[0] + "," + p[1]);
            }
            return path;
        }

        for (int[] dir : dirs) {
            int nr = row + dir[0], nc = col + dir[1];
            String nkey = nr + "," + nc;

            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols
                && grid[nr][nc] > 0) {
                int newDist = d + grid[nr][nc];

                if (!dist.containsKey(nkey) || newDist < dist.get(nkey)) {
                    dist.put(nkey, newDist);
                    parent.put(nkey, new int[]{row, col});
                    pq.offer(new int[]{newDist, nr, nc});
                }
            }
        }
    }
    return null;
}`;

const DIJKSTRA_JS = `function dijkstra(grid, start, end) {
  const rows = grid.length;
  const cols = grid[0].length;
  const dist = new Map();
  const parent = new Map();
  const visited = new Set();

  // Min-heap: [distance, row, col]
  const pq = [[0, start[0], start[1]]];
  dist.set(\`\${start[0]},\${start[1]}\`, 0);

  const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];

  while (pq.length > 0) {
    pq.sort((a, b) => a[0] - b[0]);
    const [d, row, col] = pq.shift();
    const key = \`\${row},\${col}\`;

    if (visited.has(key)) continue;
    visited.add(key);

    if (row === end[0] && col === end[1]) {
      const path = [];
      let curr = \`\${end[0]},\${end[1]}\`;
      while (curr) {
        const [r, c] = curr.split(',').map(Number);
        path.unshift([r, c]);
        curr = parent.get(curr);
      }
      return path;
    }

    for (const [dr, dc] of dirs) {
      const nr = row + dr;
      const nc = col + dc;
      const nkey = \`\${nr},\${nc}\`;

      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols
          && grid[nr][nc] > 0) {
        const newDist = d + grid[nr][nc];

        if (!dist.has(nkey) || newDist < dist.get(nkey)) {
          dist.set(nkey, newDist);
          parent.set(nkey, key);
          pq.push([newDist, nr, nc]);
        }
      }
    }
  }
  return null;
}`;

const DIJKSTRA_GO = `import "container/heap"

type Item struct {
    dist int
    pos  Point
}

type PriorityQueue []Item

func (pq PriorityQueue) Len() int           { return len(pq) }
func (pq PriorityQueue) Less(i, j int) bool { return pq[i].dist < pq[j].dist }
func (pq PriorityQueue) Swap(i, j int)      { pq[i], pq[j] = pq[j], pq[i] }
func (pq *PriorityQueue) Push(x any)        { *pq = append(*pq, x.(Item)) }
func (pq *PriorityQueue) Pop() any {
    old := *pq
    n := len(old)
    item := old[n-1]
    *pq = old[0 : n-1]
    return item
}

func dijkstra(grid [][]int, start, end Point) []Point {
    rows, cols := len(grid), len(grid[0])
    dist := map[Point]int{start: 0}
    parent := map[Point]Point{}
    visited := map[Point]bool{}

    pq := &PriorityQueue{{0, start}}
    heap.Init(pq)

    dirs := []Point{{0, 1}, {1, 0}, {0, -1}, {-1, 0}}

    for pq.Len() > 0 {
        curr := heap.Pop(pq).(Item)

        if visited[curr.pos] {
            continue
        }
        visited[curr.pos] = true

        if curr.pos == end {
            path := []Point{}
            for p := end; p != start; p = parent[p] {
                path = append([]Point{p}, path...)
            }
            return append([]Point{start}, path...)
        }

        for _, d := range dirs {
            next := Point{curr.pos.Row + d.Row, curr.pos.Col + d.Col}

            if next.Row >= 0 && next.Row < rows &&
                next.Col >= 0 && next.Col < cols &&
                grid[next.Row][next.Col] > 0 {
                newDist := curr.dist + grid[next.Row][next.Col]

                if old, ok := dist[next]; !ok || newDist < old {
                    dist[next] = newDist
                    parent[next] = curr.pos
                    heap.Push(pq, Item{newDist, next})
                }
            }
        }
    }
    return nil
}`;

const DIJKSTRA_RUST = `use std::collections::{BinaryHeap, HashMap, HashSet};
use std::cmp::Reverse;

fn dijkstra(
    grid: &[Vec<i32>],
    start: (usize, usize),
    end: (usize, usize),
) -> Option<Vec<(usize, usize)>> {
    let (rows, cols) = (grid.len(), grid[0].len());
    let mut dist: HashMap<(usize, usize), i32> = HashMap::new();
    let mut parent: HashMap<(usize, usize), (usize, usize)> = HashMap::new();
    let mut visited: HashSet<(usize, usize)> = HashSet::new();

    let mut heap: BinaryHeap<Reverse<(i32, (usize, usize))>> = BinaryHeap::new();
    dist.insert(start, 0);
    heap.push(Reverse((0, start)));

    let dirs: [(i32, i32); 4] = [(0, 1), (1, 0), (0, -1), (-1, 0)];

    while let Some(Reverse((d, (row, col)))) = heap.pop() {
        if visited.contains(&(row, col)) {
            continue;
        }
        visited.insert((row, col));

        if (row, col) == end {
            let mut path = vec![end];
            let mut curr = end;
            while let Some(&p) = parent.get(&curr) {
                path.push(p);
                curr = p;
            }
            path.reverse();
            return Some(path);
        }

        for (dr, dc) in dirs {
            let nr = row as i32 + dr;
            let nc = col as i32 + dc;

            if nr >= 0 && nr < rows as i32 && nc >= 0 && nc < cols as i32 {
                let (nr, nc) = (nr as usize, nc as usize);
                if grid[nr][nc] > 0 {
                    let new_dist = d + grid[nr][nc];

                    if dist.get(&(nr, nc)).map_or(true, |&old| new_dist < old) {
                        dist.insert((nr, nc), new_dist);
                        parent.insert((nr, nc), (row, col));
                        heap.push(Reverse((new_dist, (nr, nc))));
                    }
                }
            }
        }
    }
    None
}`;

// ─────────────────────────────────────────────────────────────────────────────
// A* Search Implementations
// ─────────────────────────────────────────────────────────────────────────────

const ASTAR_PYTHON = `import heapq

def heuristic(a: tuple[int, int], b: tuple[int, int]) -> int:
    """Manhattan distance heuristic."""
    return abs(a[0] - b[0]) + abs(a[1] - b[1])

def astar(grid: list[list[int]], start: tuple[int, int], end: tuple[int, int]) -> list[tuple[int, int]] | None:
    """Find shortest path using A* with Manhattan heuristic."""
    rows, cols = len(grid), len(grid[0])
    g_score = {start: 0}
    f_score = {start: heuristic(start, end)}
    parents = {start: None}
    open_set = [(f_score[start], start)]
    closed_set = set()
    directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]

    while open_set:
        _, current = heapq.heappop(open_set)

        if current in closed_set:
            continue
        closed_set.add(current)

        if current == end:
            path = []
            while current:
                path.append(current)
                current = parents[current]
            return path[::-1]

        row, col = current
        for dr, dc in directions:
            neighbor = (row + dr, col + dc)
            nr, nc = neighbor

            if (0 <= nr < rows and 0 <= nc < cols
                    and grid[nr][nc] == 0
                    and neighbor not in closed_set):
                tentative_g = g_score[current] + 1

                if neighbor not in g_score or tentative_g < g_score[neighbor]:
                    g_score[neighbor] = tentative_g
                    f = tentative_g + heuristic(neighbor, end)
                    f_score[neighbor] = f
                    parents[neighbor] = current
                    heapq.heappush(open_set, (f, neighbor))

    return None`;

const ASTAR_CPP = `int heuristic(Point a, Point b) {
    return std::abs(a.row - b.row) + std::abs(a.col - b.col);
}

std::vector<Point> astar(
    const std::vector<std::vector<int>>& grid,
    Point start, Point end
) {
    int rows = grid.size(), cols = grid[0].size();

    auto hash = [cols](Point p) { return p.row * cols + p.col; };
    std::unordered_map<int, int> gScore, fScore;
    std::unordered_map<int, Point> parent;
    std::set<std::pair<int,int>> closedSet;

    using PQItem = std::pair<int, Point>;
    std::priority_queue<PQItem, std::vector<PQItem>, std::greater<>> openSet;

    gScore[hash(start)] = 0;
    fScore[hash(start)] = heuristic(start, end);
    openSet.push({fScore[hash(start)], start});

    int dirs[4][2] = {{0,1}, {1,0}, {0,-1}, {-1,0}};

    while (!openSet.empty()) {
        auto [f, curr] = openSet.top();
        openSet.pop();

        if (closedSet.count({curr.row, curr.col}))
            continue;
        closedSet.insert({curr.row, curr.col});

        if (curr.row == end.row && curr.col == end.col) {
            std::vector<Point> path;
            Point p = end;
            while (hash(p) != hash(start)) {
                path.push_back(p);
                p = parent[hash(p)];
            }
            path.push_back(start);
            std::reverse(path.begin(), path.end());
            return path;
        }

        for (auto& d : dirs) {
            Point neighbor = {curr.row + d[0], curr.col + d[1]};

            if (neighbor.row >= 0 && neighbor.row < rows &&
                neighbor.col >= 0 && neighbor.col < cols &&
                grid[neighbor.row][neighbor.col] == 0 &&
                !closedSet.count({neighbor.row, neighbor.col})) {

                int tentativeG = gScore[hash(curr)] + 1;
                int h = hash(neighbor);

                if (!gScore.count(h) || tentativeG < gScore[h]) {
                    gScore[h] = tentativeG;
                    fScore[h] = tentativeG + heuristic(neighbor, end);
                    parent[h] = curr;
                    openSet.push({fScore[h], neighbor});
                }
            }
        }
    }
    return {};
}`;

const ASTAR_JAVA = `private int heuristic(int[] a, int[] b) {
    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

public List<int[]> astar(int[][] grid, int[] start, int[] end) {
    int rows = grid.length, cols = grid[0].length;
    Map<String, Integer> gScore = new HashMap<>();
    Map<String, int[]> parent = new HashMap<>();
    Set<String> closedSet = new HashSet<>();

    PriorityQueue<int[]> openSet = new PriorityQueue<>(
        Comparator.comparingInt(a -> a[0])
    );

    String startKey = start[0] + "," + start[1];
    gScore.put(startKey, 0);
    openSet.offer(new int[]{heuristic(start, end), start[0], start[1]});

    int[][] dirs = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};

    while (!openSet.isEmpty()) {
        int[] curr = openSet.poll();
        int row = curr[1], col = curr[2];
        String key = row + "," + col;

        if (closedSet.contains(key)) continue;
        closedSet.add(key);

        if (row == end[0] && col == end[1]) {
            List<int[]> path = new ArrayList<>();
            int[] p = end;
            while (p != null) {
                path.add(0, p);
                p = parent.get(p[0] + "," + p[1]);
            }
            return path;
        }

        for (int[] d : dirs) {
            int nr = row + d[0], nc = col + d[1];
            String nkey = nr + "," + nc;

            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols
                && grid[nr][nc] == 0 && !closedSet.contains(nkey)) {
                int tentativeG = gScore.get(key) + 1;

                if (!gScore.containsKey(nkey) || tentativeG < gScore.get(nkey)) {
                    gScore.put(nkey, tentativeG);
                    parent.put(nkey, new int[]{row, col});
                    int f = tentativeG + heuristic(new int[]{nr, nc}, end);
                    openSet.offer(new int[]{f, nr, nc});
                }
            }
        }
    }
    return null;
}`;

const ASTAR_JS = `function heuristic(a, b) {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

function astar(grid, start, end) {
  const rows = grid.length;
  const cols = grid[0].length;
  const gScore = new Map();
  const parent = new Map();
  const closedSet = new Set();

  const openSet = [[heuristic(start, end), start[0], start[1]]];
  gScore.set(\`\${start[0]},\${start[1]}\`, 0);

  const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];

  while (openSet.length > 0) {
    openSet.sort((a, b) => a[0] - b[0]);
    const [, row, col] = openSet.shift();
    const key = \`\${row},\${col}\`;

    if (closedSet.has(key)) continue;
    closedSet.add(key);

    if (row === end[0] && col === end[1]) {
      const path = [];
      let curr = \`\${end[0]},\${end[1]}\`;
      while (curr) {
        const [r, c] = curr.split(',').map(Number);
        path.unshift([r, c]);
        curr = parent.get(curr);
      }
      return path;
    }

    for (const [dr, dc] of dirs) {
      const nr = row + dr;
      const nc = col + dc;
      const nkey = \`\${nr},\${nc}\`;

      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols
          && grid[nr][nc] === 0 && !closedSet.has(nkey)) {
        const tentativeG = gScore.get(key) + 1;

        if (!gScore.has(nkey) || tentativeG < gScore.get(nkey)) {
          gScore.set(nkey, tentativeG);
          parent.set(nkey, key);
          const f = tentativeG + heuristic([nr, nc], end);
          openSet.push([f, nr, nc]);
        }
      }
    }
  }
  return null;
}`;

const ASTAR_GO = `func heuristic(a, b Point) int {
    dr := a.Row - b.Row
    dc := a.Col - b.Col
    if dr < 0 { dr = -dr }
    if dc < 0 { dc = -dc }
    return dr + dc
}

func astar(grid [][]int, start, end Point) []Point {
    rows, cols := len(grid), len(grid[0])
    gScore := map[Point]int{start: 0}
    parent := map[Point]Point{}
    closedSet := map[Point]bool{}

    pq := &PriorityQueue{{heuristic(start, end), start}}
    heap.Init(pq)

    dirs := []Point{{0, 1}, {1, 0}, {0, -1}, {-1, 0}}

    for pq.Len() > 0 {
        curr := heap.Pop(pq).(Item)

        if closedSet[curr.pos] {
            continue
        }
        closedSet[curr.pos] = true

        if curr.pos == end {
            path := []Point{}
            for p := end; p != start; p = parent[p] {
                path = append([]Point{p}, path...)
            }
            return append([]Point{start}, path...)
        }

        for _, d := range dirs {
            neighbor := Point{curr.pos.Row + d.Row, curr.pos.Col + d.Col}

            if neighbor.Row >= 0 && neighbor.Row < rows &&
                neighbor.Col >= 0 && neighbor.Col < cols &&
                grid[neighbor.Row][neighbor.Col] == 0 &&
                !closedSet[neighbor] {

                tentativeG := gScore[curr.pos] + 1

                if old, ok := gScore[neighbor]; !ok || tentativeG < old {
                    gScore[neighbor] = tentativeG
                    parent[neighbor] = curr.pos
                    f := tentativeG + heuristic(neighbor, end)
                    heap.Push(pq, Item{f, neighbor})
                }
            }
        }
    }
    return nil
}`;

const ASTAR_RUST = `fn heuristic(a: (usize, usize), b: (usize, usize)) -> i32 {
    (a.0 as i32 - b.0 as i32).abs() + (a.1 as i32 - b.1 as i32).abs()
}

fn astar(
    grid: &[Vec<i32>],
    start: (usize, usize),
    end: (usize, usize),
) -> Option<Vec<(usize, usize)>> {
    let (rows, cols) = (grid.len(), grid[0].len());
    let mut g_score: HashMap<(usize, usize), i32> = HashMap::new();
    let mut parent: HashMap<(usize, usize), (usize, usize)> = HashMap::new();
    let mut closed_set: HashSet<(usize, usize)> = HashSet::new();

    let mut open_set: BinaryHeap<Reverse<(i32, (usize, usize))>> = BinaryHeap::new();
    g_score.insert(start, 0);
    open_set.push(Reverse((heuristic(start, end), start)));

    let dirs: [(i32, i32); 4] = [(0, 1), (1, 0), (0, -1), (-1, 0)];

    while let Some(Reverse((_, (row, col)))) = open_set.pop() {
        if closed_set.contains(&(row, col)) {
            continue;
        }
        closed_set.insert((row, col));

        if (row, col) == end {
            let mut path = vec![end];
            let mut curr = end;
            while let Some(&p) = parent.get(&curr) {
                path.push(p);
                curr = p;
            }
            path.reverse();
            return Some(path);
        }

        for (dr, dc) in dirs {
            let nr = row as i32 + dr;
            let nc = col as i32 + dc;

            if nr >= 0 && nr < rows as i32 && nc >= 0 && nc < cols as i32 {
                let (nr, nc) = (nr as usize, nc as usize);
                if grid[nr][nc] == 0 && !closed_set.contains(&(nr, nc)) {
                    let tentative_g = g_score[&(row, col)] + 1;

                    if g_score.get(&(nr, nc)).map_or(true, |&old| tentative_g < old) {
                        g_score.insert((nr, nc), tentative_g);
                        parent.insert((nr, nc), (row, col));
                        let f = tentative_g + heuristic((nr, nc), end);
                        open_set.push(Reverse((f, (nr, nc))));
                    }
                }
            }
        }
    }
    None
}`;

// ─────────────────────────────────────────────────────────────────────────────
// Greedy Best-First Search Implementations
// ─────────────────────────────────────────────────────────────────────────────

const GREEDY_PYTHON = `import heapq

def heuristic(a: tuple[int, int], b: tuple[int, int]) -> int:
    """Manhattan distance heuristic."""
    return abs(a[0] - b[0]) + abs(a[1] - b[1])

def greedy_best_first(grid: list[list[int]], start: tuple[int, int], end: tuple[int, int]) -> list[tuple[int, int]] | None:
    """Greedy best-first search using only heuristic. Does NOT guarantee shortest path."""
    rows, cols = len(grid), len(grid[0])
    parents = {start: None}
    open_set = [(heuristic(start, end), start)]
    visited = set()
    directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]

    while open_set:
        _, current = heapq.heappop(open_set)

        if current in visited:
            continue
        visited.add(current)

        if current == end:
            path = []
            while current:
                path.append(current)
                current = parents[current]
            return path[::-1]

        row, col = current
        for dr, dc in directions:
            neighbor = (row + dr, col + dc)
            nr, nc = neighbor

            if (0 <= nr < rows and 0 <= nc < cols
                    and grid[nr][nc] == 0
                    and neighbor not in visited):
                if neighbor not in parents:
                    parents[neighbor] = current
                    h = heuristic(neighbor, end)
                    heapq.heappush(open_set, (h, neighbor))

    return None`;

const GREEDY_CPP = `std::vector<Point> greedyBestFirst(
    const std::vector<std::vector<int>>& grid,
    Point start, Point end
) {
    int rows = grid.size(), cols = grid[0].size();

    auto hash = [cols](Point p) { return p.row * cols + p.col; };
    std::unordered_map<int, Point> parent;
    std::set<std::pair<int,int>> visited;

    using PQItem = std::pair<int, Point>;
    std::priority_queue<PQItem, std::vector<PQItem>, std::greater<>> openSet;

    openSet.push({heuristic(start, end), start});
    int dirs[4][2] = {{0,1}, {1,0}, {0,-1}, {-1,0}};

    while (!openSet.empty()) {
        auto [h, curr] = openSet.top();
        openSet.pop();

        if (visited.count({curr.row, curr.col}))
            continue;
        visited.insert({curr.row, curr.col});

        if (curr.row == end.row && curr.col == end.col) {
            std::vector<Point> path;
            Point p = end;
            while (hash(p) != hash(start)) {
                path.push_back(p);
                p = parent[hash(p)];
            }
            path.push_back(start);
            std::reverse(path.begin(), path.end());
            return path;
        }

        for (auto& d : dirs) {
            Point neighbor = {curr.row + d[0], curr.col + d[1]};

            if (neighbor.row >= 0 && neighbor.row < rows &&
                neighbor.col >= 0 && neighbor.col < cols &&
                grid[neighbor.row][neighbor.col] == 0 &&
                !visited.count({neighbor.row, neighbor.col})) {

                int h = hash(neighbor);
                if (!parent.count(h)) {
                    parent[h] = curr;
                    openSet.push({heuristic(neighbor, end), neighbor});
                }
            }
        }
    }
    return {};
}`;

const GREEDY_JAVA = `public List<int[]> greedyBestFirst(int[][] grid, int[] start, int[] end) {
    int rows = grid.length, cols = grid[0].length;
    Map<String, int[]> parent = new HashMap<>();
    Set<String> visited = new HashSet<>();

    PriorityQueue<int[]> openSet = new PriorityQueue<>(
        Comparator.comparingInt(a -> a[0])
    );

    openSet.offer(new int[]{heuristic(start, end), start[0], start[1]});
    int[][] dirs = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};

    while (!openSet.isEmpty()) {
        int[] curr = openSet.poll();
        int row = curr[1], col = curr[2];
        String key = row + "," + col;

        if (visited.contains(key)) continue;
        visited.add(key);

        if (row == end[0] && col == end[1]) {
            List<int[]> path = new ArrayList<>();
            int[] p = end;
            while (p != null) {
                path.add(0, p);
                p = parent.get(p[0] + "," + p[1]);
            }
            return path;
        }

        for (int[] d : dirs) {
            int nr = row + d[0], nc = col + d[1];
            String nkey = nr + "," + nc;

            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols
                && grid[nr][nc] == 0 && !visited.contains(nkey)) {
                if (!parent.containsKey(nkey)) {
                    parent.put(nkey, new int[]{row, col});
                    int h = heuristic(new int[]{nr, nc}, end);
                    openSet.offer(new int[]{h, nr, nc});
                }
            }
        }
    }
    return null;
}`;

const GREEDY_JS = `function greedyBestFirst(grid, start, end) {
  const rows = grid.length;
  const cols = grid[0].length;
  const parent = new Map();
  const visited = new Set();

  const openSet = [[heuristic(start, end), start[0], start[1]]];
  const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];

  while (openSet.length > 0) {
    openSet.sort((a, b) => a[0] - b[0]);
    const [, row, col] = openSet.shift();
    const key = \`\${row},\${col}\`;

    if (visited.has(key)) continue;
    visited.add(key);

    if (row === end[0] && col === end[1]) {
      const path = [];
      let curr = \`\${end[0]},\${end[1]}\`;
      while (curr) {
        const [r, c] = curr.split(',').map(Number);
        path.unshift([r, c]);
        curr = parent.get(curr);
      }
      return path;
    }

    for (const [dr, dc] of dirs) {
      const nr = row + dr;
      const nc = col + dc;
      const nkey = \`\${nr},\${nc}\`;

      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols
          && grid[nr][nc] === 0 && !visited.has(nkey)) {
        if (!parent.has(nkey)) {
          parent.set(nkey, key);
          const h = heuristic([nr, nc], end);
          openSet.push([h, nr, nc]);
        }
      }
    }
  }
  return null;
}`;

const GREEDY_GO = `func greedyBestFirst(grid [][]int, start, end Point) []Point {
    rows, cols := len(grid), len(grid[0])
    parent := map[Point]Point{}
    visited := map[Point]bool{}

    pq := &PriorityQueue{{heuristic(start, end), start}}
    heap.Init(pq)

    dirs := []Point{{0, 1}, {1, 0}, {0, -1}, {-1, 0}}

    for pq.Len() > 0 {
        curr := heap.Pop(pq).(Item)

        if visited[curr.pos] {
            continue
        }
        visited[curr.pos] = true

        if curr.pos == end {
            path := []Point{}
            for p := end; p != start; p = parent[p] {
                path = append([]Point{p}, path...)
            }
            return append([]Point{start}, path...)
        }

        for _, d := range dirs {
            neighbor := Point{curr.pos.Row + d.Row, curr.pos.Col + d.Col}

            if neighbor.Row >= 0 && neighbor.Row < rows &&
                neighbor.Col >= 0 && neighbor.Col < cols &&
                grid[neighbor.Row][neighbor.Col] == 0 &&
                !visited[neighbor] {

                if _, exists := parent[neighbor]; !exists {
                    parent[neighbor] = curr.pos
                    h := heuristic(neighbor, end)
                    heap.Push(pq, Item{h, neighbor})
                }
            }
        }
    }
    return nil
}`;

const GREEDY_RUST = `fn greedy_best_first(
    grid: &[Vec<i32>],
    start: (usize, usize),
    end: (usize, usize),
) -> Option<Vec<(usize, usize)>> {
    let (rows, cols) = (grid.len(), grid[0].len());
    let mut parent: HashMap<(usize, usize), (usize, usize)> = HashMap::new();
    let mut visited: HashSet<(usize, usize)> = HashSet::new();

    let mut open_set: BinaryHeap<Reverse<(i32, (usize, usize))>> = BinaryHeap::new();
    open_set.push(Reverse((heuristic(start, end), start)));

    let dirs: [(i32, i32); 4] = [(0, 1), (1, 0), (0, -1), (-1, 0)];

    while let Some(Reverse((_, (row, col)))) = open_set.pop() {
        if visited.contains(&(row, col)) {
            continue;
        }
        visited.insert((row, col));

        if (row, col) == end {
            let mut path = vec![end];
            let mut curr = end;
            while let Some(&p) = parent.get(&curr) {
                path.push(p);
                curr = p;
            }
            path.reverse();
            return Some(path);
        }

        for (dr, dc) in dirs {
            let nr = row as i32 + dr;
            let nc = col as i32 + dc;

            if nr >= 0 && nr < rows as i32 && nc >= 0 && nc < cols as i32 {
                let (nr, nc) = (nr as usize, nc as usize);
                if grid[nr][nc] == 0 && !visited.contains(&(nr, nc)) {
                    if !parent.contains_key(&(nr, nc)) {
                        parent.insert((nr, nc), (row, col));
                        let h = heuristic((nr, nc), end);
                        open_set.push(Reverse((h, (nr, nc))));
                    }
                }
            }
        }
    }
    None
}`;

// ─────────────────────────────────────────────────────────────────────────────
// Bidirectional A* Implementations
// ─────────────────────────────────────────────────────────────────────────────

const BIDIRECTIONAL_PYTHON = `import heapq

def bidirectional_astar(grid: list[list[int]], start: tuple[int, int], end: tuple[int, int]) -> list[tuple[int, int]] | None:
    """Bidirectional A* search from both start and end."""
    rows, cols = len(grid), len(grid[0])
    directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]

    # Forward search state
    g_fwd = {start: 0}
    parent_fwd = {start: None}
    open_fwd = [(heuristic(start, end), start)]
    closed_fwd = set()

    # Backward search state
    g_bwd = {end: 0}
    parent_bwd = {end: None}
    open_bwd = [(heuristic(end, start), end)]
    closed_bwd = set()

    best_path = None
    best_cost = float('inf')

    while open_fwd and open_bwd:
        # Expand forward
        if open_fwd:
            _, curr = heapq.heappop(open_fwd)
            if curr not in closed_fwd:
                closed_fwd.add(curr)

                if curr in closed_bwd:
                    cost = g_fwd[curr] + g_bwd[curr]
                    if cost < best_cost:
                        best_cost = cost
                        best_path = _reconstruct(curr, parent_fwd, parent_bwd)

                for dr, dc in directions:
                    nr, nc = curr[0] + dr, curr[1] + dc
                    if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 0:
                        neighbor = (nr, nc)
                        tentative_g = g_fwd[curr] + 1
                        if neighbor not in g_fwd or tentative_g < g_fwd[neighbor]:
                            g_fwd[neighbor] = tentative_g
                            parent_fwd[neighbor] = curr
                            f = tentative_g + heuristic(neighbor, end)
                            heapq.heappush(open_fwd, (f, neighbor))

        # Expand backward (similar logic)
        if open_bwd:
            _, curr = heapq.heappop(open_bwd)
            if curr not in closed_bwd:
                closed_bwd.add(curr)

                if curr in closed_fwd:
                    cost = g_fwd[curr] + g_bwd[curr]
                    if cost < best_cost:
                        best_cost = cost
                        best_path = _reconstruct(curr, parent_fwd, parent_bwd)

                for dr, dc in directions:
                    nr, nc = curr[0] + dr, curr[1] + dc
                    if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 0:
                        neighbor = (nr, nc)
                        tentative_g = g_bwd[curr] + 1
                        if neighbor not in g_bwd or tentative_g < g_bwd[neighbor]:
                            g_bwd[neighbor] = tentative_g
                            parent_bwd[neighbor] = curr
                            f = tentative_g + heuristic(neighbor, start)
                            heapq.heappush(open_bwd, (f, neighbor))

    return best_path

def _reconstruct(meeting, parent_fwd, parent_bwd):
    path_fwd = []
    curr = meeting
    while curr:
        path_fwd.append(curr)
        curr = parent_fwd[curr]
    path_fwd.reverse()

    path_bwd = []
    curr = parent_bwd[meeting]
    while curr:
        path_bwd.append(curr)
        curr = parent_bwd[curr]

    return path_fwd + path_bwd`;

const BIDIRECTIONAL_CPP = `std::vector<Point> bidirectionalAstar(
    const std::vector<std::vector<int>>& grid,
    Point start, Point end
) {
    int rows = grid.size(), cols = grid[0].size();
    auto hash = [cols](Point p) { return p.row * cols + p.col; };

    // Forward search
    std::unordered_map<int, int> gFwd;
    std::unordered_map<int, Point> parentFwd;
    std::set<std::pair<int,int>> closedFwd;
    std::priority_queue<std::pair<int, Point>,
        std::vector<std::pair<int, Point>>, std::greater<>> openFwd;

    // Backward search
    std::unordered_map<int, int> gBwd;
    std::unordered_map<int, Point> parentBwd;
    std::set<std::pair<int,int>> closedBwd;
    std::priority_queue<std::pair<int, Point>,
        std::vector<std::pair<int, Point>>, std::greater<>> openBwd;

    gFwd[hash(start)] = 0;
    openFwd.push({heuristic(start, end), start});
    gBwd[hash(end)] = 0;
    openBwd.push({heuristic(end, start), end});

    int bestCost = INT_MAX;
    Point meetingPoint = {-1, -1};
    int dirs[4][2] = {{0,1}, {1,0}, {0,-1}, {-1,0}};

    while (!openFwd.empty() && !openBwd.empty()) {
        // Forward expansion
        auto [fF, currF] = openFwd.top();
        openFwd.pop();

        if (!closedFwd.count({currF.row, currF.col})) {
            closedFwd.insert({currF.row, currF.col});

            if (closedBwd.count({currF.row, currF.col})) {
                int cost = gFwd[hash(currF)] + gBwd[hash(currF)];
                if (cost < bestCost) {
                    bestCost = cost;
                    meetingPoint = currF;
                }
            }

            for (auto& d : dirs) {
                Point neighbor = {currF.row + d[0], currF.col + d[1]};
                if (neighbor.row >= 0 && neighbor.row < rows &&
                    neighbor.col >= 0 && neighbor.col < cols &&
                    grid[neighbor.row][neighbor.col] == 0) {
                    int h = hash(neighbor);
                    int tentativeG = gFwd[hash(currF)] + 1;
                    if (!gFwd.count(h) || tentativeG < gFwd[h]) {
                        gFwd[h] = tentativeG;
                        parentFwd[h] = currF;
                        openFwd.push({tentativeG + heuristic(neighbor, end), neighbor});
                    }
                }
            }
        }

        // Backward expansion (similar)
        // ... (abbreviated for readability)
    }

    if (meetingPoint.row == -1) return {};
    return reconstructPath(meetingPoint, parentFwd, parentBwd, start, end, hash);
}`;

const BIDIRECTIONAL_JAVA = `public List<int[]> bidirectionalAstar(int[][] grid, int[] start, int[] end) {
    int rows = grid.length, cols = grid[0].length;

    // Forward search state
    Map<String, Integer> gFwd = new HashMap<>();
    Map<String, int[]> parentFwd = new HashMap<>();
    Set<String> closedFwd = new HashSet<>();
    PriorityQueue<int[]> openFwd = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));

    // Backward search state
    Map<String, Integer> gBwd = new HashMap<>();
    Map<String, int[]> parentBwd = new HashMap<>();
    Set<String> closedBwd = new HashSet<>();
    PriorityQueue<int[]> openBwd = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));

    String startKey = start[0] + "," + start[1];
    String endKey = end[0] + "," + end[1];

    gFwd.put(startKey, 0);
    openFwd.offer(new int[]{heuristic(start, end), start[0], start[1]});
    gBwd.put(endKey, 0);
    openBwd.offer(new int[]{heuristic(end, start), end[0], end[1]});

    int[][] dirs = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};
    int[] meeting = null;
    int bestCost = Integer.MAX_VALUE;

    while (!openFwd.isEmpty() && !openBwd.isEmpty()) {
        // Expand forward
        int[] currF = openFwd.poll();
        String keyF = currF[1] + "," + currF[2];
        if (!closedFwd.contains(keyF)) {
            closedFwd.add(keyF);

            if (closedBwd.contains(keyF)) {
                int cost = gFwd.get(keyF) + gBwd.get(keyF);
                if (cost < bestCost) {
                    bestCost = cost;
                    meeting = new int[]{currF[1], currF[2]};
                }
            }

            // Expand neighbors...
        }

        // Expand backward (similar logic)
    }

    return meeting != null ? reconstructPath(meeting, parentFwd, parentBwd) : null;
}`;

const BIDIRECTIONAL_JS = `function bidirectionalAstar(grid, start, end) {
  const rows = grid.length;
  const cols = grid[0].length;
  const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];

  // Forward search state
  const gFwd = new Map([[key(start), 0]]);
  const parentFwd = new Map([[key(start), null]]);
  const closedFwd = new Set();
  const openFwd = [[heuristic(start, end), ...start]];

  // Backward search state
  const gBwd = new Map([[key(end), 0]]);
  const parentBwd = new Map([[key(end), null]]);
  const closedBwd = new Set();
  const openBwd = [[heuristic(end, start), ...end]];

  let bestPath = null;
  let bestCost = Infinity;

  function key(p) { return \`\${p[0]},\${p[1]}\`; }

  while (openFwd.length && openBwd.length) {
    // Expand forward
    openFwd.sort((a, b) => a[0] - b[0]);
    const [, rowF, colF] = openFwd.shift();
    const keyF = \`\${rowF},\${colF}\`;

    if (!closedFwd.has(keyF)) {
      closedFwd.add(keyF);

      if (closedBwd.has(keyF)) {
        const cost = gFwd.get(keyF) + gBwd.get(keyF);
        if (cost < bestCost) {
          bestCost = cost;
          bestPath = reconstruct([rowF, colF], parentFwd, parentBwd);
        }
      }

      for (const [dr, dc] of dirs) {
        const nr = rowF + dr, nc = colF + dc;
        const nkey = \`\${nr},\${nc}\`;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols &&
            grid[nr][nc] === 0) {
          const tentativeG = gFwd.get(keyF) + 1;
          if (!gFwd.has(nkey) || tentativeG < gFwd.get(nkey)) {
            gFwd.set(nkey, tentativeG);
            parentFwd.set(nkey, keyF);
            openFwd.push([tentativeG + heuristic([nr, nc], end), nr, nc]);
          }
        }
      }
    }

    // Expand backward (similar)
  }

  return bestPath;
}`;

const BIDIRECTIONAL_GO = `func bidirectionalAstar(grid [][]int, start, end Point) []Point {
    rows, cols := len(grid), len(grid[0])
    dirs := []Point{{0, 1}, {1, 0}, {0, -1}, {-1, 0}}

    // Forward search
    gFwd := map[Point]int{start: 0}
    parentFwd := map[Point]Point{}
    closedFwd := map[Point]bool{}
    openFwd := &PriorityQueue{{heuristic(start, end), start}}
    heap.Init(openFwd)

    // Backward search
    gBwd := map[Point]int{end: 0}
    parentBwd := map[Point]Point{}
    closedBwd := map[Point]bool{}
    openBwd := &PriorityQueue{{heuristic(end, start), end}}
    heap.Init(openBwd)

    var meeting *Point
    bestCost := math.MaxInt32

    for openFwd.Len() > 0 && openBwd.Len() > 0 {
        // Expand forward
        currF := heap.Pop(openFwd).(Item)
        if !closedFwd[currF.pos] {
            closedFwd[currF.pos] = true

            if closedBwd[currF.pos] {
                cost := gFwd[currF.pos] + gBwd[currF.pos]
                if cost < bestCost {
                    bestCost = cost
                    p := currF.pos
                    meeting = &p
                }
            }

            for _, d := range dirs {
                neighbor := Point{currF.pos.Row + d.Row, currF.pos.Col + d.Col}
                if neighbor.Row >= 0 && neighbor.Row < rows &&
                    neighbor.Col >= 0 && neighbor.Col < cols &&
                    grid[neighbor.Row][neighbor.Col] == 0 {
                    tentativeG := gFwd[currF.pos] + 1
                    if old, ok := gFwd[neighbor]; !ok || tentativeG < old {
                        gFwd[neighbor] = tentativeG
                        parentFwd[neighbor] = currF.pos
                        heap.Push(openFwd, Item{tentativeG + heuristic(neighbor, end), neighbor})
                    }
                }
            }
        }

        // Expand backward (similar)
    }

    if meeting == nil {
        return nil
    }
    return reconstructPath(*meeting, parentFwd, parentBwd, start, end)
}`;

const BIDIRECTIONAL_RUST = `fn bidirectional_astar(
    grid: &[Vec<i32>],
    start: (usize, usize),
    end: (usize, usize),
) -> Option<Vec<(usize, usize)>> {
    let (rows, cols) = (grid.len(), grid[0].len());
    let dirs: [(i32, i32); 4] = [(0, 1), (1, 0), (0, -1), (-1, 0)];

    // Forward search
    let mut g_fwd: HashMap<(usize, usize), i32> = HashMap::new();
    let mut parent_fwd: HashMap<(usize, usize), (usize, usize)> = HashMap::new();
    let mut closed_fwd: HashSet<(usize, usize)> = HashSet::new();
    let mut open_fwd: BinaryHeap<Reverse<(i32, (usize, usize))>> = BinaryHeap::new();

    // Backward search
    let mut g_bwd: HashMap<(usize, usize), i32> = HashMap::new();
    let mut parent_bwd: HashMap<(usize, usize), (usize, usize)> = HashMap::new();
    let mut closed_bwd: HashSet<(usize, usize)> = HashSet::new();
    let mut open_bwd: BinaryHeap<Reverse<(i32, (usize, usize))>> = BinaryHeap::new();

    g_fwd.insert(start, 0);
    open_fwd.push(Reverse((heuristic(start, end), start)));
    g_bwd.insert(end, 0);
    open_bwd.push(Reverse((heuristic(end, start), end)));

    let mut best_cost = i32::MAX;
    let mut meeting: Option<(usize, usize)> = None;

    while !open_fwd.is_empty() && !open_bwd.is_empty() {
        // Forward expansion
        if let Some(Reverse((_, curr))) = open_fwd.pop() {
            if !closed_fwd.contains(&curr) {
                closed_fwd.insert(curr);

                if closed_bwd.contains(&curr) {
                    let cost = g_fwd[&curr] + g_bwd[&curr];
                    if cost < best_cost {
                        best_cost = cost;
                        meeting = Some(curr);
                    }
                }

                for (dr, dc) in dirs {
                    let nr = curr.0 as i32 + dr;
                    let nc = curr.1 as i32 + dc;
                    if nr >= 0 && nr < rows as i32 && nc >= 0 && nc < cols as i32 {
                        let neighbor = (nr as usize, nc as usize);
                        if grid[neighbor.0][neighbor.1] == 0 {
                            let tentative_g = g_fwd[&curr] + 1;
                            if g_fwd.get(&neighbor).map_or(true, |&g| tentative_g < g) {
                                g_fwd.insert(neighbor, tentative_g);
                                parent_fwd.insert(neighbor, curr);
                                let f = tentative_g + heuristic(neighbor, end);
                                open_fwd.push(Reverse((f, neighbor)));
                            }
                        }
                    }
                }
            }
        }

        // Backward expansion (similar)
    }

    meeting.map(|m| reconstruct_path(m, &parent_fwd, &parent_bwd, start, end))
}`;

// ─────────────────────────────────────────────────────────────────────────────
// Flood Fill Implementations
// ─────────────────────────────────────────────────────────────────────────────

const FLOOD_PYTHON = `from collections import deque

def flood_fill(grid: list[list[int]], start: tuple[int, int]) -> dict[tuple[int, int], int]:
    """Flood fill from start, returning distances to all reachable cells."""
    rows, cols = len(grid), len(grid[0])
    distances = {start: 0}
    queue = deque([start])
    directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]

    while queue:
        row, col = queue.popleft()
        current_dist = distances[(row, col)]

        for dr, dc in directions:
            new_row, new_col = row + dr, col + dc
            neighbor = (new_row, new_col)

            if (0 <= new_row < rows and 0 <= new_col < cols
                    and grid[new_row][new_col] == 0
                    and neighbor not in distances):
                distances[neighbor] = current_dist + 1
                queue.append(neighbor)

    return distances`;

const FLOOD_CPP = `std::unordered_map<int, int> floodFill(
    const std::vector<std::vector<int>>& grid,
    Point start
) {
    int rows = grid.size(), cols = grid[0].size();
    auto hash = [cols](Point p) { return p.row * cols + p.col; };

    std::unordered_map<int, int> distances;
    std::queue<Point> queue;

    distances[hash(start)] = 0;
    queue.push(start);

    int dirs[4][2] = {{0,1}, {1,0}, {0,-1}, {-1,0}};

    while (!queue.empty()) {
        Point curr = queue.front();
        queue.pop();
        int currDist = distances[hash(curr)];

        for (auto& d : dirs) {
            Point neighbor = {curr.row + d[0], curr.col + d[1]};
            int h = hash(neighbor);

            if (neighbor.row >= 0 && neighbor.row < rows &&
                neighbor.col >= 0 && neighbor.col < cols &&
                grid[neighbor.row][neighbor.col] == 0 &&
                distances.find(h) == distances.end()) {
                distances[h] = currDist + 1;
                queue.push(neighbor);
            }
        }
    }

    return distances;
}`;

const FLOOD_JAVA = `public Map<String, Integer> floodFill(int[][] grid, int[] start) {
    int rows = grid.length, cols = grid[0].length;
    Map<String, Integer> distances = new HashMap<>();
    Queue<int[]> queue = new LinkedList<>();

    String startKey = start[0] + "," + start[1];
    distances.put(startKey, 0);
    queue.offer(start);

    int[][] dirs = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};

    while (!queue.isEmpty()) {
        int[] curr = queue.poll();
        String currKey = curr[0] + "," + curr[1];
        int currDist = distances.get(currKey);

        for (int[] d : dirs) {
            int nr = curr[0] + d[0];
            int nc = curr[1] + d[1];
            String nkey = nr + "," + nc;

            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols
                && grid[nr][nc] == 0 && !distances.containsKey(nkey)) {
                distances.put(nkey, currDist + 1);
                queue.offer(new int[]{nr, nc});
            }
        }
    }

    return distances;
}`;

const FLOOD_JS = `function floodFill(grid, start) {
  const rows = grid.length;
  const cols = grid[0].length;
  const distances = new Map();
  const queue = [start];

  distances.set(\`\${start[0]},\${start[1]}\`, 0);

  const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];

  while (queue.length > 0) {
    const [row, col] = queue.shift();
    const currDist = distances.get(\`\${row},\${col}\`);

    for (const [dr, dc] of dirs) {
      const nr = row + dr;
      const nc = col + dc;
      const key = \`\${nr},\${nc}\`;

      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols
          && grid[nr][nc] === 0 && !distances.has(key)) {
        distances.set(key, currDist + 1);
        queue.push([nr, nc]);
      }
    }
  }

  return distances;
}`;

const FLOOD_GO = `func floodFill(grid [][]int, start Point) map[Point]int {
    rows, cols := len(grid), len(grid[0])
    distances := map[Point]int{start: 0}
    queue := []Point{start}
    dirs := []Point{{0, 1}, {1, 0}, {0, -1}, {-1, 0}}

    for len(queue) > 0 {
        curr := queue[0]
        queue = queue[1:]
        currDist := distances[curr]

        for _, d := range dirs {
            neighbor := Point{curr.Row + d.Row, curr.Col + d.Col}

            if neighbor.Row >= 0 && neighbor.Row < rows &&
                neighbor.Col >= 0 && neighbor.Col < cols &&
                grid[neighbor.Row][neighbor.Col] == 0 {
                if _, exists := distances[neighbor]; !exists {
                    distances[neighbor] = currDist + 1
                    queue = append(queue, neighbor)
                }
            }
        }
    }

    return distances
}`;

const FLOOD_RUST = `fn flood_fill(
    grid: &[Vec<i32>],
    start: (usize, usize),
) -> HashMap<(usize, usize), i32> {
    let (rows, cols) = (grid.len(), grid[0].len());
    let mut distances: HashMap<(usize, usize), i32> = HashMap::new();
    let mut queue: VecDeque<(usize, usize)> = VecDeque::new();

    distances.insert(start, 0);
    queue.push_back(start);

    let dirs: [(i32, i32); 4] = [(0, 1), (1, 0), (0, -1), (-1, 0)];

    while let Some((row, col)) = queue.pop_front() {
        let curr_dist = distances[&(row, col)];

        for (dr, dc) in dirs {
            let nr = row as i32 + dr;
            let nc = col as i32 + dc;

            if nr >= 0 && nr < rows as i32 && nc >= 0 && nc < cols as i32 {
                let neighbor = (nr as usize, nc as usize);
                if grid[neighbor.0][neighbor.1] == 0 && !distances.contains_key(&neighbor) {
                    distances.insert(neighbor, curr_dist + 1);
                    queue.push_back(neighbor);
                }
            }
        }
    }

    distances
}`;

// ─────────────────────────────────────────────────────────────────────────────
// Random Walk Implementations
// ─────────────────────────────────────────────────────────────────────────────

const RANDOM_PYTHON = `import random

def random_walk(grid: list[list[int]], start: tuple[int, int], end: tuple[int, int], max_steps: int = 10000) -> list[tuple[int, int]] | None:
    """Random walk pathfinding. NO guarantee of finding or optimality."""
    rows, cols = len(grid), len(grid[0])
    directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
    path = [start]
    current = start
    visited_first = {start: 0}  # Track first visit index for path

    for step in range(max_steps):
        if current == end:
            # Reconstruct minimal path through visited_first
            return path

        row, col = current
        neighbors = []
        for dr, dc in directions:
            nr, nc = row + dr, col + dc
            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 0:
                neighbors.append((nr, nc))

        if not neighbors:
            return None  # Stuck

        # Pick random neighbor
        next_pos = random.choice(neighbors)
        path.append(next_pos)

        if next_pos not in visited_first:
            visited_first[next_pos] = len(path) - 1

        current = next_pos

    return None  # Exceeded max steps`;

const RANDOM_CPP = `#include <random>

std::vector<Point> randomWalk(
    const std::vector<std::vector<int>>& grid,
    Point start, Point end,
    int maxSteps = 10000
) {
    int rows = grid.size(), cols = grid[0].size();
    std::vector<Point> path = {start};
    Point current = start;

    std::random_device rd;
    std::mt19937 gen(rd());

    int dirs[4][2] = {{0,1}, {1,0}, {0,-1}, {-1,0}};

    for (int step = 0; step < maxSteps; step++) {
        if (current.row == end.row && current.col == end.col) {
            return path;
        }

        std::vector<Point> neighbors;
        for (auto& d : dirs) {
            int nr = current.row + d[0];
            int nc = current.col + d[1];
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols
                && grid[nr][nc] == 0) {
                neighbors.push_back({nr, nc});
            }
        }

        if (neighbors.empty()) return {};

        std::uniform_int_distribution<> dis(0, neighbors.size() - 1);
        current = neighbors[dis(gen)];
        path.push_back(current);
    }

    return {};  // Max steps exceeded
}`;

const RANDOM_JAVA = `public List<int[]> randomWalk(int[][] grid, int[] start, int[] end, int maxSteps) {
    int rows = grid.length, cols = grid[0].length;
    List<int[]> path = new ArrayList<>();
    path.add(start);
    int[] current = start;
    Random random = new Random();

    int[][] dirs = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};

    for (int step = 0; step < maxSteps; step++) {
        if (current[0] == end[0] && current[1] == end[1]) {
            return path;
        }

        List<int[]> neighbors = new ArrayList<>();
        for (int[] d : dirs) {
            int nr = current[0] + d[0];
            int nc = current[1] + d[1];
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols
                && grid[nr][nc] == 0) {
                neighbors.add(new int[]{nr, nc});
            }
        }

        if (neighbors.isEmpty()) return null;

        current = neighbors.get(random.nextInt(neighbors.size()));
        path.add(current);
    }

    return null;  // Max steps exceeded
}`;

const RANDOM_JS = `function randomWalk(grid, start, end, maxSteps = 10000) {
  const rows = grid.length;
  const cols = grid[0].length;
  const path = [start];
  let current = start;
  const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];

  for (let step = 0; step < maxSteps; step++) {
    if (current[0] === end[0] && current[1] === end[1]) {
      return path;
    }

    const neighbors = [];
    for (const [dr, dc] of dirs) {
      const nr = current[0] + dr;
      const nc = current[1] + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols
          && grid[nr][nc] === 0) {
        neighbors.push([nr, nc]);
      }
    }

    if (neighbors.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * neighbors.length);
    current = neighbors[randomIndex];
    path.push(current);
  }

  return null;  // Max steps exceeded
}`;

const RANDOM_GO = `import "math/rand"

func randomWalk(grid [][]int, start, end Point, maxSteps int) []Point {
    rows, cols := len(grid), len(grid[0])
    path := []Point{start}
    current := start
    dirs := []Point{{0, 1}, {1, 0}, {0, -1}, {-1, 0}}

    for step := 0; step < maxSteps; step++ {
        if current == end {
            return path
        }

        var neighbors []Point
        for _, d := range dirs {
            neighbor := Point{current.Row + d.Row, current.Col + d.Col}
            if neighbor.Row >= 0 && neighbor.Row < rows &&
                neighbor.Col >= 0 && neighbor.Col < cols &&
                grid[neighbor.Row][neighbor.Col] == 0 {
                neighbors = append(neighbors, neighbor)
            }
        }

        if len(neighbors) == 0 {
            return nil
        }

        current = neighbors[rand.Intn(len(neighbors))]
        path = append(path, current)
    }

    return nil  // Max steps exceeded
}`;

const RANDOM_RUST = `use rand::Rng;

fn random_walk(
    grid: &[Vec<i32>],
    start: (usize, usize),
    end: (usize, usize),
    max_steps: usize,
) -> Option<Vec<(usize, usize)>> {
    let (rows, cols) = (grid.len(), grid[0].len());
    let mut path = vec![start];
    let mut current = start;
    let mut rng = rand::thread_rng();
    let dirs: [(i32, i32); 4] = [(0, 1), (1, 0), (0, -1), (-1, 0)];

    for _ in 0..max_steps {
        if current == end {
            return Some(path);
        }

        let mut neighbors = Vec::new();
        for (dr, dc) in dirs {
            let nr = current.0 as i32 + dr;
            let nc = current.1 as i32 + dc;
            if nr >= 0 && nr < rows as i32 && nc >= 0 && nc < cols as i32 {
                let neighbor = (nr as usize, nc as usize);
                if grid[neighbor.0][neighbor.1] == 0 {
                    neighbors.push(neighbor);
                }
            }
        }

        if neighbors.is_empty() {
            return None;
        }

        current = neighbors[rng.gen_range(0..neighbors.len())];
        path.push(current);
    }

    None  // Max steps exceeded
}`;

// ─────────────────────────────────────────────────────────────────────────────
// Complete Registry
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Reference implementations of all pathfinding algorithms in multiple languages.
 * These use a grid-based approach (2D array) matching the visualizer.
 */
export const PATHFINDING_IMPLEMENTATIONS: Record<
  PathfindingAlgorithmType,
  Record<Language, string>
> = {
  bfs: {
    python: BFS_PYTHON,
    cpp: BFS_CPP,
    java: BFS_JAVA,
    javascript: BFS_JS,
    go: BFS_GO,
    rust: BFS_RUST,
  },
  dfs: {
    python: DFS_PYTHON,
    cpp: DFS_CPP,
    java: DFS_JAVA,
    javascript: DFS_JS,
    go: DFS_GO,
    rust: DFS_RUST,
  },
  dijkstra: {
    python: DIJKSTRA_PYTHON,
    cpp: DIJKSTRA_CPP,
    java: DIJKSTRA_JAVA,
    javascript: DIJKSTRA_JS,
    go: DIJKSTRA_GO,
    rust: DIJKSTRA_RUST,
  },
  astar: {
    python: ASTAR_PYTHON,
    cpp: ASTAR_CPP,
    java: ASTAR_JAVA,
    javascript: ASTAR_JS,
    go: ASTAR_GO,
    rust: ASTAR_RUST,
  },
  greedy: {
    python: GREEDY_PYTHON,
    cpp: GREEDY_CPP,
    java: GREEDY_JAVA,
    javascript: GREEDY_JS,
    go: GREEDY_GO,
    rust: GREEDY_RUST,
  },
  bidirectional: {
    python: BIDIRECTIONAL_PYTHON,
    cpp: BIDIRECTIONAL_CPP,
    java: BIDIRECTIONAL_JAVA,
    javascript: BIDIRECTIONAL_JS,
    go: BIDIRECTIONAL_GO,
    rust: BIDIRECTIONAL_RUST,
  },
  flood: {
    python: FLOOD_PYTHON,
    cpp: FLOOD_CPP,
    java: FLOOD_JAVA,
    javascript: FLOOD_JS,
    go: FLOOD_GO,
    rust: FLOOD_RUST,
  },
  random: {
    python: RANDOM_PYTHON,
    cpp: RANDOM_CPP,
    java: RANDOM_JAVA,
    javascript: RANDOM_JS,
    go: RANDOM_GO,
    rust: RANDOM_RUST,
  },
};

/**
 * Get the implementation of a pathfinding algorithm in a specific language.
 */
export function getPathfindingImplementation(
  algorithm: PathfindingAlgorithmType,
  language: Language
): string {
  return PATHFINDING_IMPLEMENTATIONS[algorithm][language];
}

/**
 * Get all implementations for a specific pathfinding algorithm.
 */
export function getAllPathfindingImplementations(
  algorithm: PathfindingAlgorithmType
): Record<Language, string> {
  return PATHFINDING_IMPLEMENTATIONS[algorithm];
}
