import type { TreeDataStructureType } from "@/lib/store";

/**
 * Educational article content for tree data structures.
 * This registry contains all the textbook-style content for the Learn pages.
 * Theme: "Roots, Leaves, and Recursion."
 */
export interface TreeArticle {
  /** Display name of the data structure */
  title: string;
  /** A catchy one-liner describing the essence */
  tagline: string;
  /** Historical background and origin story */
  history: string;
  /** Core property that defines this structure (e.g., BST property, heap property) */
  coreProperty: string;
  /** Step-by-step explanation of how the structure works */
  mechanics: string;
  /** Search/Access time complexity */
  searchComplexity: {
    complexity: string;
    explanation: string;
  };
  /** Insert time complexity */
  insertComplexity: {
    complexity: string;
    explanation: string;
  };
  /** Delete time complexity */
  deleteComplexity: {
    complexity: string;
    explanation: string;
  };
  /** Space complexity */
  spaceComplexity: {
    complexity: string;
    explanation: string;
  };
  /** Whether the tree self-balances */
  selfBalancing: boolean;
  /** Real-world applications and use cases */
  useCases: string[];
  /** Key insights and takeaways */
  keyInsights: string[];
  /** When to use this data structure */
  whenToUse: string;
  /** When NOT to use this data structure */
  whenNotToUse: string;
  /** The danger or pitfall of this structure */
  pitfall: string;
  /** Visual pattern description for the visualization */
  visualPattern: string;
}

/**
 * Complete content registry for all tree data structures.
 */
export const TREE_ARTICLES: Record<TreeDataStructureType, TreeArticle> = {
  bst: {
    title: "Binary Search Tree",
    tagline: "The Unbalanced Ancestor",
    history: `The Binary Search Tree (BST) is the grandfather of modern hierarchical data structures. While the concept of binary search on arrays existed earlier, the dynamic pointer-based tree structure emerged in the 1960s as a way to handle changing datasets.

It is the simplest form of a "sorted" tree. It represents the ideal of $O(\\log n)$ performance, but without any safety rails to guarantee it.`,

    coreProperty: `**The Binary Search Property:**
For every node, all nodes in its **Left Subtree** are smaller, and all nodes in its **Right Subtree** are larger. This simple rule allows us to cut the search space in half with every step down the tree.`,

    mechanics: `A BST relies on simple comparisons to navigate.

**The Mechanics:**

1. **Search**: Start at the root. If the value is what you want, stop. If smaller, go left. If larger, go right. Repeat.
2. **Insert**: Perform a search until you hit a "null" spot (a dead end). Plant the new node there.
3. **Delete**: This is the tricky part.

- Leaf node: Just snip it off.
- One child: Replace the node with its child.
- Two children: Find the "In-Order Successor" (smallest node in the right subtree), swap values, and delete that successor.`,

    searchComplexity: {
      complexity: "O(h)",
      explanation:
        "Time depends on height ($h$). In a balanced tree, $h = log n$. In a line, $h = n$.",
    },
    insertComplexity: {
      complexity: "O(h)",
      explanation: "We have to traverse from root to leaf to find the insertion spot.",
    },
    deleteComplexity: {
      complexity: "O(h)",
      explanation:
        "Finding the node and its successor takes time proportional to the tree's depth.",
    },
    spaceComplexity: {
      complexity: "O(n)",
      explanation: "We need to store every element. No extra overhead for balancing metadata.",
    },
    selfBalancing: false,
    visualPattern:
      "Organic and unpredictable. Can look like a perfect triangle or a spindly stick.",

    useCases: [
      "Educational introduction to tree algorithms",
      "Simple lookups where data arrives in random order",
      "Implementing Sets and Maps (conceptually)",
      "Sorting streams of data",
    ],

    keyInsights: [
      "It provides ordered traversal ($O(n)$) for free.",
      "It is sensitive to input order.",
      "It has no overhead for maintaining balance.",
      "All operations depend on the height of the tree.",
    ],

    whenToUse:
      "Use a vanilla BST for simple tasks, educational purposes, or when you know your input data is randomized enough that the tree won't become a line.",

    whenNotToUse:
      "Do not use in production if the data might be pre-sorted. Inserting sorted data into a BST turns it into a Linked List with extra steps.",

    pitfall:
      "The Degenerate Case: If you insert 1, 2, 3, 4, 5 in order, you don't get a tree. You get a line. Complexity degrades to $O(n)$.",
  },

  avl: {
    title: "AVL Tree",
    tagline: "The Strict Disciplinarian",
    history: `Invented in 1962 by Georgy Adelson-Velsky and Evgenii Landis, the AVL tree was the first data structure to solve the BST's "degenerate line" problem.

It acts like a strict building inspector. Every time you modify the structure, it pulls out a measuring tape. If one side of the tree is more than one level deeper than the other, it forces a "rotation" to fix the symmetry immediately.`,

    coreProperty: `**The Balance Factor:**
For every node, the height difference between the left and right subtrees must be $-1$, $0$, or $+1$. If it hits $\\pm 2$, the tree is invalid and must be fixed.`,

    mechanics: `The AVL tree maintains balance via **Rotations**. A rotation is a local rearrangement of nodes that fixes height without breaking the sort order.

**The Four Cases:**

1. **LL Case**: Left-left heavy. Fixed by a single Right Rotation.
2. **RR Case**: Right-right heavy. Fixed by a single Left Rotation.
3. **LR Case**: Left-right heavy. Fixed by Left then Right rotation.
4. **RL Case**: Right-left heavy. Fixed by Right then Left rotation.

Every insert or delete triggers a trace back up to the root to update heights and rotate if needed.`,

    searchComplexity: {
      complexity: "O(log n)",
      explanation: "Guaranteed. The strict balancing ensures the height is always logarithmic.",
    },
    insertComplexity: {
      complexity: "O(log n)",
      explanation: "Finding the spot is fast, but we might have to rotate our way back up.",
    },
    deleteComplexity: {
      complexity: "O(log n)",
      explanation:
        "Similar to insert, but a deletion might trigger multiple rotations up the tree.",
    },
    spaceComplexity: {
      complexity: "O(n)",
      explanation:
        "Stores $n$ nodes, plus a tiny integer for 'Height' or 'Balance Factor' on each node.",
    },
    selfBalancing: true,
    visualPattern: "A perfectly manicured, triangular structure. It refuses to look messy.",

    useCases: [
      "Databases where read speed is critical",
      "In-memory sets and dictionaries",
      "Symbol tables in compilers",
      "Systems with heavy search loads and infrequent writes",
    ],

    keyInsights: [
      "It is rigidly balanced.",
      "Lookups are faster than Red-Black trees because the tree is shallower.",
      "Insertions are slower than Red-Black trees because of the strict rotation rules.",
      "It guarantees $O(log n)$ worst-case for everything.",
    ],

    whenToUse:
      "Use AVL trees when your application is **Read-Heavy**. If you search 1000 times for every 1 insert, the stricter balance pays off.",

    whenNotToUse:
      "Avoid if you have a **Write-Heavy** workload. The constant re-balancing and rotations will slow down the insertion pipeline.",

    pitfall:
      "Rotation Overhead. Maintaining perfect balance is expensive. Each update requires traversing back up the tree.",
  },

  "max-heap": {
    title: "Max Heap",
    tagline: "The VIP Club",
    history: `The Heap was introduced by J.W.J. Williams in 1964 as a data structure specifically designed for the Heapsort algorithm.

It is a "Priority Queue" implementation. It doesn't care about sorting everything perfectly; it only cares that the most important element (the max) is accessible instantly. It's the bouncer at the club who only lets the biggest celebrity stand at the front.`,

    coreProperty: `**The Heap Property:**
For any given node $I$, the value of $I$ is greater than or equal to the values of its children. This means the largest element is always at the Root.`,

    mechanics: `Heaps are usually implemented as **Arrays**, not node objects. We use math to simulate the tree structure.

- Parent index: $\\lfloor (i-1)/2 \\rfloor$
- Left Child: $2i + 1$
- Right Child: $2i + 2$

**The Operations:**

1. **Insert (Bubble Up)**: Add to the end of the array, then swap with parent until the property is restored.
2. **Extract Max (Bubble Down)**: Take the root (max), move the last element to the root, then swap it down with the larger child until it settles.`,

    searchComplexity: {
      complexity: "O(n)",
      explanation:
        "Heaps are not for searching. Finding an arbitrary element requires scanning the array.",
    },
    insertComplexity: {
      complexity: "O(log n)",
      explanation: "We add to the bottom and swim up. The height is always $log n$.",
    },
    deleteComplexity: {
      complexity: "O(log n)",
      explanation:
        "Specifically for deleting the Root (Extract Max). Deleting an arbitrary node is harder.",
    },
    spaceComplexity: {
      complexity: "O(n)",
      explanation: "Extremely efficient. It's just a raw array with zero pointer overhead.",
    },
    selfBalancing: false,
    visualPattern: [
      "A 'Complete' Binary Tree.",
      "",
      "Always filled top-to-bottom, left-to-right. No gaps.",
    ].join(" "),

    useCases: [
      "Priority Queues (Job scheduling, Bandwidth management)",
      "Heapsort algorithm",
      "Graph algorithms (Dijkstra, Prim's)",
      "Finding the 'K' largest elements in a stream",
    ],

    keyInsights: [
      "O(1) access to the maximum element.",
      "It is NOT a sorted structure. It is a 'partially ordered' structure.",
      "Array implementation gives it amazing cache locality.",
      "It is a Complete Binary Tree (perfectly balanced except the bottom row).",
    ],

    whenToUse:
      "Use a Max Heap when you need constant-time access to the 'highest priority' item, or when implementing a Priority Queue.",

    whenNotToUse:
      "Do not use a Heap if you need to search for arbitrary values or if you need to traverse the data in sorted order.",

    pitfall:
      "Confusing it with a BST. In a Heap, the Left child could be larger than the Right child. The only rule is Parent > Children.",
  },

  splay: {
    title: "Splay Tree",
    tagline: "The People Pleaser",
    history: `Invented by Daniel Sleator and Robert Tarjan in 1985. They realized that in the real world, access patterns aren't random. If you ask for a data record once, you're likely to ask for it again very soon (the "locality of reference" principle).

The Splay Tree is designed to be lazy but accommodating. It adjusts itself based on *usage*, not just structure.`,

    coreProperty: `**Move-to-Root Heuristic:**
Whenever you access a node (search, insert, or update), that node is physically rotated all the way to the top of the tree to become the new root. Ideally, frequently accessed nodes stay near the top.`,

    mechanics: `The Splay Tree doesn't enforce height balance. Instead, it uses complex rotations to bring the target node to the root.

**The Rotations (Splaying):**

1. **Zig**: Single rotation (like AVL).
2. **Zig-Zig**: Two rotations in the same direction.
3. **Zig-Zag**: Two rotations in opposite directions.

By applying these repeatedly, the accessed node surfs to the top, and the tree roughly halves its depth along the access path.`,

    searchComplexity: {
      complexity: "O(log n) Amortized",
      explanation:
        "Individual operations can be slow ($O(n)$), but over a long sequence of operations, the average is logarithmic.",
    },
    insertComplexity: {
      complexity: "O(log n) Amortized",
      explanation: "We insert like a BST, then splay the new node to the root.",
    },
    deleteComplexity: {
      complexity: "O(log n) Amortized",
      explanation: "Splay the node to be deleted, then join the two resulting subtrees.",
    },
    spaceComplexity: {
      complexity: "O(n)",
      explanation: "Standard pointer-based tree storage.",
    },
    selfBalancing: true,
    visualPattern: "A morphing blob. The tree drastically changes shape with every single click.",

    useCases: [
      "Implementing Caches (LRU-like behavior)",
      "Network routers (frequent IP lookups)",
      "Text editors (cursor operations)",
      "Garbage collection algorithms",
      "Data compression (Huffman coding variants)",
    ],

    keyInsights: [
      "It optimizes for 'Locality of Reference'.",
      "Recently accessed elements are $O(1)$ to find again.",
      "It does not store any balance metadata (lighter on memory than AVL).",
      "It self-corrects: accessing a deep node fixes the tree along the path.",
    ],

    whenToUse:
      "Use Splay Trees when your access pattern is non-uniform (some items are popular, others are rare) or when implementing caching logic.",

    whenNotToUse:
      "Avoid in real-time systems. Because a single search can trigger a massive tree reorganization ($O(n)$ worst case), latency is unpredictable.",

    pitfall:
      "The Linear Worst Case. If you access elements in strict increasing order, a Splay Tree can momentarily turn into a stick before fixing itself. It offers 'amortized' guarantees, not strict ones.",
  },
};

/**
 * Get article content for a specific tree data structure.
 */
export function getTreeArticle(structure: TreeDataStructureType): TreeArticle {
  return TREE_ARTICLES[structure];
}
