import type { TreeDataStructureType } from "@/lib/store";
import type { Language } from "./sorting";

// ─────────────────────────────────────────────────────────────────────────────
// Binary Search Tree (BST) Implementations
// ─────────────────────────────────────────────────────────────────────────────

const BST_PYTHON = `class TreeNode:
    """Node for Binary Search Tree."""
    def __init__(self, val: int):
        self.val = val
        self.left: TreeNode | None = None
        self.right: TreeNode | None = None


class BST:
    """Binary Search Tree with insert, search, and delete operations."""
    def __init__(self):
        self.root: TreeNode | None = None

    def insert(self, val: int) -> None:
        """Insert a value into the BST."""
        if not self.root:
            self.root = TreeNode(val)
            return

        curr = self.root
        while True:
            if val < curr.val:
                if curr.left is None:
                    curr.left = TreeNode(val)
                    return
                curr = curr.left
            else:
                if curr.right is None:
                    curr.right = TreeNode(val)
                    return
                curr = curr.right

    def search(self, val: int) -> TreeNode | None:
        """Search for a value in the BST."""
        curr = self.root
        while curr:
            if val == curr.val:
                return curr
            elif val < curr.val:
                curr = curr.left
            else:
                curr = curr.right
        return None

    def delete(self, val: int) -> None:
        """Delete a value from the BST."""
        self.root = self._delete_recursive(self.root, val)

    def _delete_recursive(self, node: TreeNode | None, val: int) -> TreeNode | None:
        if not node:
            return None

        if val < node.val:
            node.left = self._delete_recursive(node.left, val)
        elif val > node.val:
            node.right = self._delete_recursive(node.right, val)
        else:
            # Node found - handle three cases
            if not node.left:
                return node.right
            if not node.right:
                return node.left

            # Two children: find in-order successor
            successor = self._find_min(node.right)
            node.val = successor.val
            node.right = self._delete_recursive(node.right, successor.val)

        return node

    def _find_min(self, node: TreeNode) -> TreeNode:
        """Find the minimum value node in a subtree."""
        while node.left:
            node = node.left
        return node`;

const BST_CPP = `struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;

    TreeNode(int v) : val(v), left(nullptr), right(nullptr) {}
};

class BST {
private:
    TreeNode* root = nullptr;

    TreeNode* findMin(TreeNode* node) {
        while (node->left) {
            node = node->left;
        }
        return node;
    }

    TreeNode* deleteRecursive(TreeNode* node, int val) {
        if (!node) return nullptr;

        if (val < node->val) {
            node->left = deleteRecursive(node->left, val);
        } else if (val > node->val) {
            node->right = deleteRecursive(node->right, val);
        } else {
            // Node found - handle three cases
            if (!node->left) {
                TreeNode* temp = node->right;
                delete node;
                return temp;
            }
            if (!node->right) {
                TreeNode* temp = node->left;
                delete node;
                return temp;
            }

            // Two children: find in-order successor
            TreeNode* successor = findMin(node->right);
            node->val = successor->val;
            node->right = deleteRecursive(node->right, successor->val);
        }
        return node;
    }

public:
    void insert(int val) {
        if (!root) {
            root = new TreeNode(val);
            return;
        }

        TreeNode* curr = root;
        while (true) {
            if (val < curr->val) {
                if (!curr->left) {
                    curr->left = new TreeNode(val);
                    return;
                }
                curr = curr->left;
            } else {
                if (!curr->right) {
                    curr->right = new TreeNode(val);
                    return;
                }
                curr = curr->right;
            }
        }
    }

    TreeNode* search(int val) {
        TreeNode* curr = root;
        while (curr) {
            if (val == curr->val) return curr;
            curr = (val < curr->val) ? curr->left : curr->right;
        }
        return nullptr;
    }

    void remove(int val) {
        root = deleteRecursive(root, val);
    }
};`;

const BST_JAVA = `class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;

    TreeNode(int val) {
        this.val = val;
        this.left = null;
        this.right = null;
    }
}

public class BST {
    private TreeNode root;

    public void insert(int val) {
        if (root == null) {
            root = new TreeNode(val);
            return;
        }

        TreeNode curr = root;
        while (true) {
            if (val < curr.val) {
                if (curr.left == null) {
                    curr.left = new TreeNode(val);
                    return;
                }
                curr = curr.left;
            } else {
                if (curr.right == null) {
                    curr.right = new TreeNode(val);
                    return;
                }
                curr = curr.right;
            }
        }
    }

    public TreeNode search(int val) {
        TreeNode curr = root;
        while (curr != null) {
            if (val == curr.val) return curr;
            curr = (val < curr.val) ? curr.left : curr.right;
        }
        return null;
    }

    public void delete(int val) {
        root = deleteRecursive(root, val);
    }

    private TreeNode deleteRecursive(TreeNode node, int val) {
        if (node == null) return null;

        if (val < node.val) {
            node.left = deleteRecursive(node.left, val);
        } else if (val > node.val) {
            node.right = deleteRecursive(node.right, val);
        } else {
            // Node found - handle three cases
            if (node.left == null) return node.right;
            if (node.right == null) return node.left;

            // Two children: find in-order successor
            TreeNode successor = findMin(node.right);
            node.val = successor.val;
            node.right = deleteRecursive(node.right, successor.val);
        }
        return node;
    }

    private TreeNode findMin(TreeNode node) {
        while (node.left != null) {
            node = node.left;
        }
        return node;
    }
}`;

const BST_JS = `class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

class BST {
  constructor() {
    this.root = null;
  }

  insert(val) {
    if (!this.root) {
      this.root = new TreeNode(val);
      return;
    }

    let curr = this.root;
    while (true) {
      if (val < curr.val) {
        if (!curr.left) {
          curr.left = new TreeNode(val);
          return;
        }
        curr = curr.left;
      } else {
        if (!curr.right) {
          curr.right = new TreeNode(val);
          return;
        }
        curr = curr.right;
      }
    }
  }

  search(val) {
    let curr = this.root;
    while (curr) {
      if (val === curr.val) return curr;
      curr = val < curr.val ? curr.left : curr.right;
    }
    return null;
  }

  delete(val) {
    this.root = this.#deleteRecursive(this.root, val);
  }

  #deleteRecursive(node, val) {
    if (!node) return null;

    if (val < node.val) {
      node.left = this.#deleteRecursive(node.left, val);
    } else if (val > node.val) {
      node.right = this.#deleteRecursive(node.right, val);
    } else {
      // Node found - handle three cases
      if (!node.left) return node.right;
      if (!node.right) return node.left;

      // Two children: find in-order successor
      const successor = this.#findMin(node.right);
      node.val = successor.val;
      node.right = this.#deleteRecursive(node.right, successor.val);
    }
    return node;
  }

  #findMin(node) {
    while (node.left) {
      node = node.left;
    }
    return node;
  }
}`;

const BST_GO = `type TreeNode struct {
    Val   int
    Left  *TreeNode
    Right *TreeNode
}

type BST struct {
    Root *TreeNode
}

func (bst *BST) Insert(val int) {
    newNode := &TreeNode{Val: val}

    if bst.Root == nil {
        bst.Root = newNode
        return
    }

    curr := bst.Root
    for {
        if val < curr.Val {
            if curr.Left == nil {
                curr.Left = newNode
                return
            }
            curr = curr.Left
        } else {
            if curr.Right == nil {
                curr.Right = newNode
                return
            }
            curr = curr.Right
        }
    }
}

func (bst *BST) Search(val int) *TreeNode {
    curr := bst.Root
    for curr != nil {
        if val == curr.Val {
            return curr
        } else if val < curr.Val {
            curr = curr.Left
        } else {
            curr = curr.Right
        }
    }
    return nil
}

func (bst *BST) Delete(val int) {
    bst.Root = deleteRecursive(bst.Root, val)
}

func deleteRecursive(node *TreeNode, val int) *TreeNode {
    if node == nil {
        return nil
    }

    if val < node.Val {
        node.Left = deleteRecursive(node.Left, val)
    } else if val > node.Val {
        node.Right = deleteRecursive(node.Right, val)
    } else {
        // Node found - handle three cases
        if node.Left == nil {
            return node.Right
        }
        if node.Right == nil {
            return node.Left
        }

        // Two children: find in-order successor
        successor := findMin(node.Right)
        node.Val = successor.Val
        node.Right = deleteRecursive(node.Right, successor.Val)
    }
    return node
}

func findMin(node *TreeNode) *TreeNode {
    for node.Left != nil {
        node = node.Left
    }
    return node
}`;

const BST_RUST = `use std::cmp::Ordering;

struct TreeNode {
    val: i32,
    left: Option<Box<TreeNode>>,
    right: Option<Box<TreeNode>>,
}

impl TreeNode {
    fn new(val: i32) -> Self {
        TreeNode { val, left: None, right: None }
    }
}

struct BST {
    root: Option<Box<TreeNode>>,
}

impl BST {
    fn new() -> Self {
        BST { root: None }
    }

    fn insert(&mut self, val: i32) {
        Self::insert_recursive(&mut self.root, val);
    }

    fn insert_recursive(node: &mut Option<Box<TreeNode>>, val: i32) {
        match node {
            None => *node = Some(Box::new(TreeNode::new(val))),
            Some(n) => match val.cmp(&n.val) {
                Ordering::Less => Self::insert_recursive(&mut n.left, val),
                _ => Self::insert_recursive(&mut n.right, val),
            },
        }
    }

    fn search(&self, val: i32) -> bool {
        Self::search_recursive(&self.root, val)
    }

    fn search_recursive(node: &Option<Box<TreeNode>>, val: i32) -> bool {
        match node {
            None => false,
            Some(n) => match val.cmp(&n.val) {
                Ordering::Equal => true,
                Ordering::Less => Self::search_recursive(&n.left, val),
                Ordering::Greater => Self::search_recursive(&n.right, val),
            },
        }
    }

    fn delete(&mut self, val: i32) {
        self.root = Self::delete_recursive(self.root.take(), val);
    }

    fn delete_recursive(node: Option<Box<TreeNode>>, val: i32) -> Option<Box<TreeNode>> {
        let mut node = node?;

        match val.cmp(&node.val) {
            Ordering::Less => {
                node.left = Self::delete_recursive(node.left.take(), val);
                Some(node)
            }
            Ordering::Greater => {
                node.right = Self::delete_recursive(node.right.take(), val);
                Some(node)
            }
            Ordering::Equal => {
                // Node found - handle three cases
                if node.left.is_none() {
                    return node.right;
                }
                if node.right.is_none() {
                    return node.left;
                }

                // Two children: find in-order successor
                let min_val = Self::find_min(&node.right);
                node.val = min_val;
                node.right = Self::delete_recursive(node.right.take(), min_val);
                Some(node)
            }
        }
    }

    fn find_min(node: &Option<Box<TreeNode>>) -> i32 {
        let n = node.as_ref().unwrap();
        match &n.left {
            None => n.val,
            Some(_) => Self::find_min(&n.left),
        }
    }
}`;

// ─────────────────────────────────────────────────────────────────────────────
// AVL Tree Implementations
// ─────────────────────────────────────────────────────────────────────────────

const AVL_PYTHON = `class AVLNode:
    """Node for AVL Tree with height tracking."""
    def __init__(self, val: int):
        self.val = val
        self.left: AVLNode | None = None
        self.right: AVLNode | None = None
        self.height = 1


class AVLTree:
    """Self-balancing AVL Tree with rotations."""
    def __init__(self):
        self.root: AVLNode | None = None

    def _height(self, node: AVLNode | None) -> int:
        return node.height if node else 0

    def _balance_factor(self, node: AVLNode | None) -> int:
        return self._height(node.left) - self._height(node.right) if node else 0

    def _update_height(self, node: AVLNode) -> None:
        node.height = 1 + max(self._height(node.left), self._height(node.right))

    def _rotate_right(self, y: AVLNode) -> AVLNode:
        """Right rotation for LL case."""
        x = y.left
        t2 = x.right

        x.right = y
        y.left = t2

        self._update_height(y)
        self._update_height(x)
        return x

    def _rotate_left(self, x: AVLNode) -> AVLNode:
        """Left rotation for RR case."""
        y = x.right
        t2 = y.left

        y.left = x
        x.right = t2

        self._update_height(x)
        self._update_height(y)
        return y

    def _rebalance(self, node: AVLNode) -> AVLNode:
        """Rebalance node if needed."""
        self._update_height(node)
        balance = self._balance_factor(node)

        # Left-heavy
        if balance > 1:
            if self._balance_factor(node.left) < 0:
                node.left = self._rotate_left(node.left)  # LR case
            return self._rotate_right(node)  # LL case

        # Right-heavy
        if balance < -1:
            if self._balance_factor(node.right) > 0:
                node.right = self._rotate_right(node.right)  # RL case
            return self._rotate_left(node)  # RR case

        return node

    def insert(self, val: int) -> None:
        self.root = self._insert_recursive(self.root, val)

    def _insert_recursive(self, node: AVLNode | None, val: int) -> AVLNode:
        if not node:
            return AVLNode(val)

        if val < node.val:
            node.left = self._insert_recursive(node.left, val)
        else:
            node.right = self._insert_recursive(node.right, val)

        return self._rebalance(node)

    def delete(self, val: int) -> None:
        self.root = self._delete_recursive(self.root, val)

    def _delete_recursive(self, node: AVLNode | None, val: int) -> AVLNode | None:
        if not node:
            return None

        if val < node.val:
            node.left = self._delete_recursive(node.left, val)
        elif val > node.val:
            node.right = self._delete_recursive(node.right, val)
        else:
            if not node.left:
                return node.right
            if not node.right:
                return node.left

            successor = node.right
            while successor.left:
                successor = successor.left
            node.val = successor.val
            node.right = self._delete_recursive(node.right, successor.val)

        return self._rebalance(node)`;

const AVL_CPP = `struct AVLNode {
    int val;
    AVLNode* left;
    AVLNode* right;
    int height;

    AVLNode(int v) : val(v), left(nullptr), right(nullptr), height(1) {}
};

class AVLTree {
private:
    AVLNode* root = nullptr;

    int height(AVLNode* node) {
        return node ? node->height : 0;
    }

    int balanceFactor(AVLNode* node) {
        return node ? height(node->left) - height(node->right) : 0;
    }

    void updateHeight(AVLNode* node) {
        node->height = 1 + std::max(height(node->left), height(node->right));
    }

    AVLNode* rotateRight(AVLNode* y) {
        AVLNode* x = y->left;
        AVLNode* t2 = x->right;

        x->right = y;
        y->left = t2;

        updateHeight(y);
        updateHeight(x);
        return x;
    }

    AVLNode* rotateLeft(AVLNode* x) {
        AVLNode* y = x->right;
        AVLNode* t2 = y->left;

        y->left = x;
        x->right = t2;

        updateHeight(x);
        updateHeight(y);
        return y;
    }

    AVLNode* rebalance(AVLNode* node) {
        updateHeight(node);
        int balance = balanceFactor(node);

        // Left-heavy
        if (balance > 1) {
            if (balanceFactor(node->left) < 0)
                node->left = rotateLeft(node->left);  // LR case
            return rotateRight(node);  // LL case
        }

        // Right-heavy
        if (balance < -1) {
            if (balanceFactor(node->right) > 0)
                node->right = rotateRight(node->right);  // RL case
            return rotateLeft(node);  // RR case
        }

        return node;
    }

    AVLNode* insertRecursive(AVLNode* node, int val) {
        if (!node) return new AVLNode(val);

        if (val < node->val)
            node->left = insertRecursive(node->left, val);
        else
            node->right = insertRecursive(node->right, val);

        return rebalance(node);
    }

    AVLNode* findMin(AVLNode* node) {
        while (node->left) node = node->left;
        return node;
    }

    AVLNode* deleteRecursive(AVLNode* node, int val) {
        if (!node) return nullptr;

        if (val < node->val) {
            node->left = deleteRecursive(node->left, val);
        } else if (val > node->val) {
            node->right = deleteRecursive(node->right, val);
        } else {
            if (!node->left) return node->right;
            if (!node->right) return node->left;

            AVLNode* successor = findMin(node->right);
            node->val = successor->val;
            node->right = deleteRecursive(node->right, successor->val);
        }

        return rebalance(node);
    }

public:
    void insert(int val) {
        root = insertRecursive(root, val);
    }

    void remove(int val) {
        root = deleteRecursive(root, val);
    }
};`;

const AVL_JAVA = `class AVLNode {
    int val;
    AVLNode left;
    AVLNode right;
    int height;

    AVLNode(int val) {
        this.val = val;
        this.height = 1;
    }
}

public class AVLTree {
    private AVLNode root;

    private int height(AVLNode node) {
        return node == null ? 0 : node.height;
    }

    private int balanceFactor(AVLNode node) {
        return node == null ? 0 : height(node.left) - height(node.right);
    }

    private void updateHeight(AVLNode node) {
        node.height = 1 + Math.max(height(node.left), height(node.right));
    }

    private AVLNode rotateRight(AVLNode y) {
        AVLNode x = y.left;
        AVLNode t2 = x.right;

        x.right = y;
        y.left = t2;

        updateHeight(y);
        updateHeight(x);
        return x;
    }

    private AVLNode rotateLeft(AVLNode x) {
        AVLNode y = x.right;
        AVLNode t2 = y.left;

        y.left = x;
        x.right = t2;

        updateHeight(x);
        updateHeight(y);
        return y;
    }

    private AVLNode rebalance(AVLNode node) {
        updateHeight(node);
        int balance = balanceFactor(node);

        // Left-heavy
        if (balance > 1) {
            if (balanceFactor(node.left) < 0)
                node.left = rotateLeft(node.left);  // LR case
            return rotateRight(node);  // LL case
        }

        // Right-heavy
        if (balance < -1) {
            if (balanceFactor(node.right) > 0)
                node.right = rotateRight(node.right);  // RL case
            return rotateLeft(node);  // RR case
        }

        return node;
    }

    public void insert(int val) {
        root = insertRecursive(root, val);
    }

    private AVLNode insertRecursive(AVLNode node, int val) {
        if (node == null) return new AVLNode(val);

        if (val < node.val)
            node.left = insertRecursive(node.left, val);
        else
            node.right = insertRecursive(node.right, val);

        return rebalance(node);
    }

    public void delete(int val) {
        root = deleteRecursive(root, val);
    }

    private AVLNode deleteRecursive(AVLNode node, int val) {
        if (node == null) return null;

        if (val < node.val) {
            node.left = deleteRecursive(node.left, val);
        } else if (val > node.val) {
            node.right = deleteRecursive(node.right, val);
        } else {
            if (node.left == null) return node.right;
            if (node.right == null) return node.left;

            AVLNode successor = findMin(node.right);
            node.val = successor.val;
            node.right = deleteRecursive(node.right, successor.val);
        }

        return rebalance(node);
    }

    private AVLNode findMin(AVLNode node) {
        while (node.left != null) node = node.left;
        return node;
    }
}`;

const AVL_JS = `class AVLNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
    this.height = 1;
  }
}

class AVLTree {
  constructor() {
    this.root = null;
  }

  #height(node) {
    return node ? node.height : 0;
  }

  #balanceFactor(node) {
    return node ? this.#height(node.left) - this.#height(node.right) : 0;
  }

  #updateHeight(node) {
    node.height = 1 + Math.max(this.#height(node.left), this.#height(node.right));
  }

  #rotateRight(y) {
    const x = y.left;
    const t2 = x.right;

    x.right = y;
    y.left = t2;

    this.#updateHeight(y);
    this.#updateHeight(x);
    return x;
  }

  #rotateLeft(x) {
    const y = x.right;
    const t2 = y.left;

    y.left = x;
    x.right = t2;

    this.#updateHeight(x);
    this.#updateHeight(y);
    return y;
  }

  #rebalance(node) {
    this.#updateHeight(node);
    const balance = this.#balanceFactor(node);

    // Left-heavy
    if (balance > 1) {
      if (this.#balanceFactor(node.left) < 0)
        node.left = this.#rotateLeft(node.left);  // LR case
      return this.#rotateRight(node);  // LL case
    }

    // Right-heavy
    if (balance < -1) {
      if (this.#balanceFactor(node.right) > 0)
        node.right = this.#rotateRight(node.right);  // RL case
      return this.#rotateLeft(node);  // RR case
    }

    return node;
  }

  insert(val) {
    this.root = this.#insertRecursive(this.root, val);
  }

  #insertRecursive(node, val) {
    if (!node) return new AVLNode(val);

    if (val < node.val)
      node.left = this.#insertRecursive(node.left, val);
    else
      node.right = this.#insertRecursive(node.right, val);

    return this.#rebalance(node);
  }

  delete(val) {
    this.root = this.#deleteRecursive(this.root, val);
  }

  #deleteRecursive(node, val) {
    if (!node) return null;

    if (val < node.val) {
      node.left = this.#deleteRecursive(node.left, val);
    } else if (val > node.val) {
      node.right = this.#deleteRecursive(node.right, val);
    } else {
      if (!node.left) return node.right;
      if (!node.right) return node.left;

      let successor = node.right;
      while (successor.left) successor = successor.left;
      node.val = successor.val;
      node.right = this.#deleteRecursive(node.right, successor.val);
    }

    return this.#rebalance(node);
  }
}`;

const AVL_GO = `type AVLNode struct {
    Val    int
    Left   *AVLNode
    Right  *AVLNode
    Height int
}

type AVLTree struct {
    Root *AVLNode
}

func (t *AVLTree) height(node *AVLNode) int {
    if node == nil {
        return 0
    }
    return node.Height
}

func (t *AVLTree) balanceFactor(node *AVLNode) int {
    if node == nil {
        return 0
    }
    return t.height(node.Left) - t.height(node.Right)
}

func (t *AVLTree) updateHeight(node *AVLNode) {
    node.Height = 1 + max(t.height(node.Left), t.height(node.Right))
}

func (t *AVLTree) rotateRight(y *AVLNode) *AVLNode {
    x := y.Left
    t2 := x.Right

    x.Right = y
    y.Left = t2

    t.updateHeight(y)
    t.updateHeight(x)
    return x
}

func (t *AVLTree) rotateLeft(x *AVLNode) *AVLNode {
    y := x.Right
    t2 := y.Left

    y.Left = x
    x.Right = t2

    t.updateHeight(x)
    t.updateHeight(y)
    return y
}

func (t *AVLTree) rebalance(node *AVLNode) *AVLNode {
    t.updateHeight(node)
    balance := t.balanceFactor(node)

    // Left-heavy
    if balance > 1 {
        if t.balanceFactor(node.Left) < 0 {
            node.Left = t.rotateLeft(node.Left) // LR case
        }
        return t.rotateRight(node) // LL case
    }

    // Right-heavy
    if balance < -1 {
        if t.balanceFactor(node.Right) > 0 {
            node.Right = t.rotateRight(node.Right) // RL case
        }
        return t.rotateLeft(node) // RR case
    }

    return node
}

func (t *AVLTree) Insert(val int) {
    t.Root = t.insertRecursive(t.Root, val)
}

func (t *AVLTree) insertRecursive(node *AVLNode, val int) *AVLNode {
    if node == nil {
        return &AVLNode{Val: val, Height: 1}
    }

    if val < node.Val {
        node.Left = t.insertRecursive(node.Left, val)
    } else {
        node.Right = t.insertRecursive(node.Right, val)
    }

    return t.rebalance(node)
}

func (t *AVLTree) Delete(val int) {
    t.Root = t.deleteRecursive(t.Root, val)
}

func (t *AVLTree) deleteRecursive(node *AVLNode, val int) *AVLNode {
    if node == nil {
        return nil
    }

    if val < node.Val {
        node.Left = t.deleteRecursive(node.Left, val)
    } else if val > node.Val {
        node.Right = t.deleteRecursive(node.Right, val)
    } else {
        if node.Left == nil {
            return node.Right
        }
        if node.Right == nil {
            return node.Left
        }

        successor := node.Right
        for successor.Left != nil {
            successor = successor.Left
        }
        node.Val = successor.Val
        node.Right = t.deleteRecursive(node.Right, successor.Val)
    }

    return t.rebalance(node)
}`;

const AVL_RUST = `use std::cmp::{max, Ordering};

struct AVLNode {
    val: i32,
    left: Option<Box<AVLNode>>,
    right: Option<Box<AVLNode>>,
    height: i32,
}

impl AVLNode {
    fn new(val: i32) -> Self {
        AVLNode { val, left: None, right: None, height: 1 }
    }
}

struct AVLTree {
    root: Option<Box<AVLNode>>,
}

impl AVLTree {
    fn new() -> Self {
        AVLTree { root: None }
    }

    fn height(node: &Option<Box<AVLNode>>) -> i32 {
        node.as_ref().map_or(0, |n| n.height)
    }

    fn balance_factor(node: &Option<Box<AVLNode>>) -> i32 {
        node.as_ref().map_or(0, |n| {
            Self::height(&n.left) - Self::height(&n.right)
        })
    }

    fn update_height(node: &mut AVLNode) {
        node.height = 1 + max(Self::height(&node.left), Self::height(&node.right));
    }

    fn rotate_right(mut y: Box<AVLNode>) -> Box<AVLNode> {
        let mut x = y.left.take().unwrap();
        y.left = x.right.take();

        Self::update_height(&mut y);
        x.right = Some(y);
        Self::update_height(&mut x);
        x
    }

    fn rotate_left(mut x: Box<AVLNode>) -> Box<AVLNode> {
        let mut y = x.right.take().unwrap();
        x.right = y.left.take();

        Self::update_height(&mut x);
        y.left = Some(x);
        Self::update_height(&mut y);
        y
    }

    fn rebalance(mut node: Box<AVLNode>) -> Box<AVLNode> {
        Self::update_height(&mut node);
        let balance = Self::balance_factor(&Some(node.clone()));

        // Left-heavy
        if balance > 1 {
            if Self::balance_factor(&node.left) < 0 {
                node.left = Some(Self::rotate_left(node.left.take().unwrap()));
            }
            return Self::rotate_right(node);
        }

        // Right-heavy
        if balance < -1 {
            if Self::balance_factor(&node.right) > 0 {
                node.right = Some(Self::rotate_right(node.right.take().unwrap()));
            }
            return Self::rotate_left(node);
        }

        node
    }

    fn insert(&mut self, val: i32) {
        self.root = Self::insert_recursive(self.root.take(), val);
    }

    fn insert_recursive(node: Option<Box<AVLNode>>, val: i32) -> Option<Box<AVLNode>> {
        match node {
            None => Some(Box::new(AVLNode::new(val))),
            Some(mut n) => {
                if val < n.val {
                    n.left = Self::insert_recursive(n.left.take(), val);
                } else {
                    n.right = Self::insert_recursive(n.right.take(), val);
                }
                Some(Self::rebalance(n))
            }
        }
    }
}`;

// ─────────────────────────────────────────────────────────────────────────────
// Max Heap Implementations (Array-based)
// ─────────────────────────────────────────────────────────────────────────────

const HEAP_PYTHON = `class MaxHeap:
    """Array-based Max Heap implementation.

    Parent index:      (i - 1) // 2
    Left child index:  2 * i + 1
    Right child index: 2 * i + 2
    """
    def __init__(self):
        self.heap: list[int] = []

    def _parent(self, i: int) -> int:
        return (i - 1) // 2

    def _left_child(self, i: int) -> int:
        return 2 * i + 1

    def _right_child(self, i: int) -> int:
        return 2 * i + 2

    def _swap(self, i: int, j: int) -> None:
        self.heap[i], self.heap[j] = self.heap[j], self.heap[i]

    def insert(self, val: int) -> None:
        """Insert value and bubble up to maintain heap property."""
        self.heap.append(val)
        self._bubble_up(len(self.heap) - 1)

    def _bubble_up(self, i: int) -> None:
        """Move element up until heap property is satisfied."""
        while i > 0:
            parent = self._parent(i)
            if self.heap[i] <= self.heap[parent]:
                break
            self._swap(i, parent)
            i = parent

    def extract_max(self) -> int | None:
        """Remove and return the maximum element."""
        if not self.heap:
            return None

        max_val = self.heap[0]
        last = self.heap.pop()

        if self.heap:
            self.heap[0] = last
            self._sink_down(0)

        return max_val

    def _sink_down(self, i: int) -> None:
        """Move element down until heap property is satisfied."""
        n = len(self.heap)
        while True:
            largest = i
            left = self._left_child(i)
            right = self._right_child(i)

            if left < n and self.heap[left] > self.heap[largest]:
                largest = left
            if right < n and self.heap[right] > self.heap[largest]:
                largest = right

            if largest == i:
                break

            self._swap(i, largest)
            i = largest

    def peek(self) -> int | None:
        """Return the maximum element without removing it."""
        return self.heap[0] if self.heap else None`;

const HEAP_CPP = `#include <vector>
#include <stdexcept>

class MaxHeap {
private:
    std::vector<int> heap;

    int parent(int i) { return (i - 1) / 2; }
    int leftChild(int i) { return 2 * i + 1; }
    int rightChild(int i) { return 2 * i + 2; }

    void swap(int i, int j) {
        std::swap(heap[i], heap[j]);
    }

    void bubbleUp(int i) {
        while (i > 0 && heap[i] > heap[parent(i)]) {
            swap(i, parent(i));
            i = parent(i);
        }
    }

    void sinkDown(int i) {
        int n = heap.size();
        while (true) {
            int largest = i;
            int left = leftChild(i);
            int right = rightChild(i);

            if (left < n && heap[left] > heap[largest])
                largest = left;
            if (right < n && heap[right] > heap[largest])
                largest = right;

            if (largest == i) break;

            swap(i, largest);
            i = largest;
        }
    }

public:
    void insert(int val) {
        heap.push_back(val);
        bubbleUp(heap.size() - 1);
    }

    int extractMax() {
        if (heap.empty())
            throw std::runtime_error("Heap is empty");

        int maxVal = heap[0];
        heap[0] = heap.back();
        heap.pop_back();

        if (!heap.empty())
            sinkDown(0);

        return maxVal;
    }

    int peek() const {
        if (heap.empty())
            throw std::runtime_error("Heap is empty");
        return heap[0];
    }

    bool isEmpty() const {
        return heap.empty();
    }
};`;

const HEAP_JAVA = `import java.util.ArrayList;
import java.util.List;

public class MaxHeap {
    private List<Integer> heap = new ArrayList<>();

    private int parent(int i) { return (i - 1) / 2; }
    private int leftChild(int i) { return 2 * i + 1; }
    private int rightChild(int i) { return 2 * i + 2; }

    private void swap(int i, int j) {
        int temp = heap.get(i);
        heap.set(i, heap.get(j));
        heap.set(j, temp);
    }

    public void insert(int val) {
        heap.add(val);
        bubbleUp(heap.size() - 1);
    }

    private void bubbleUp(int i) {
        while (i > 0 && heap.get(i) > heap.get(parent(i))) {
            swap(i, parent(i));
            i = parent(i);
        }
    }

    public Integer extractMax() {
        if (heap.isEmpty()) return null;

        int maxVal = heap.get(0);
        int last = heap.remove(heap.size() - 1);

        if (!heap.isEmpty()) {
            heap.set(0, last);
            sinkDown(0);
        }

        return maxVal;
    }

    private void sinkDown(int i) {
        int n = heap.size();
        while (true) {
            int largest = i;
            int left = leftChild(i);
            int right = rightChild(i);

            if (left < n && heap.get(left) > heap.get(largest))
                largest = left;
            if (right < n && heap.get(right) > heap.get(largest))
                largest = right;

            if (largest == i) break;

            swap(i, largest);
            i = largest;
        }
    }

    public Integer peek() {
        return heap.isEmpty() ? null : heap.get(0);
    }
}`;

const HEAP_JS = `class MaxHeap {
  #heap = [];

  #parent(i) { return Math.floor((i - 1) / 2); }
  #leftChild(i) { return 2 * i + 1; }
  #rightChild(i) { return 2 * i + 2; }

  #swap(i, j) {
    [this.#heap[i], this.#heap[j]] = [this.#heap[j], this.#heap[i]];
  }

  insert(val) {
    this.#heap.push(val);
    this.#bubbleUp(this.#heap.length - 1);
  }

  #bubbleUp(i) {
    while (i > 0 && this.#heap[i] > this.#heap[this.#parent(i)]) {
      this.#swap(i, this.#parent(i));
      i = this.#parent(i);
    }
  }

  extractMax() {
    if (this.#heap.length === 0) return null;

    const maxVal = this.#heap[0];
    const last = this.#heap.pop();

    if (this.#heap.length > 0) {
      this.#heap[0] = last;
      this.#sinkDown(0);
    }

    return maxVal;
  }

  #sinkDown(i) {
    const n = this.#heap.length;
    while (true) {
      let largest = i;
      const left = this.#leftChild(i);
      const right = this.#rightChild(i);

      if (left < n && this.#heap[left] > this.#heap[largest])
        largest = left;
      if (right < n && this.#heap[right] > this.#heap[largest])
        largest = right;

      if (largest === i) break;

      this.#swap(i, largest);
      i = largest;
    }
  }

  peek() {
    return this.#heap.length === 0 ? null : this.#heap[0];
  }
}`;

const HEAP_GO = `type MaxHeap struct {
    heap []int
}

func (h *MaxHeap) parent(i int) int      { return (i - 1) / 2 }
func (h *MaxHeap) leftChild(i int) int   { return 2*i + 1 }
func (h *MaxHeap) rightChild(i int) int  { return 2*i + 2 }

func (h *MaxHeap) swap(i, j int) {
    h.heap[i], h.heap[j] = h.heap[j], h.heap[i]
}

func (h *MaxHeap) Insert(val int) {
    h.heap = append(h.heap, val)
    h.bubbleUp(len(h.heap) - 1)
}

func (h *MaxHeap) bubbleUp(i int) {
    for i > 0 && h.heap[i] > h.heap[h.parent(i)] {
        h.swap(i, h.parent(i))
        i = h.parent(i)
    }
}

func (h *MaxHeap) ExtractMax() (int, bool) {
    if len(h.heap) == 0 {
        return 0, false
    }

    maxVal := h.heap[0]
    last := h.heap[len(h.heap)-1]
    h.heap = h.heap[:len(h.heap)-1]

    if len(h.heap) > 0 {
        h.heap[0] = last
        h.sinkDown(0)
    }

    return maxVal, true
}

func (h *MaxHeap) sinkDown(i int) {
    n := len(h.heap)
    for {
        largest := i
        left := h.leftChild(i)
        right := h.rightChild(i)

        if left < n && h.heap[left] > h.heap[largest] {
            largest = left
        }
        if right < n && h.heap[right] > h.heap[largest] {
            largest = right
        }

        if largest == i {
            break
        }

        h.swap(i, largest)
        i = largest
    }
}

func (h *MaxHeap) Peek() (int, bool) {
    if len(h.heap) == 0 {
        return 0, false
    }
    return h.heap[0], true
}`;

const HEAP_RUST = `struct MaxHeap {
    heap: Vec<i32>,
}

impl MaxHeap {
    fn new() -> Self {
        MaxHeap { heap: Vec::new() }
    }

    fn parent(i: usize) -> usize { (i - 1) / 2 }
    fn left_child(i: usize) -> usize { 2 * i + 1 }
    fn right_child(i: usize) -> usize { 2 * i + 2 }

    fn insert(&mut self, val: i32) {
        self.heap.push(val);
        self.bubble_up(self.heap.len() - 1);
    }

    fn bubble_up(&mut self, mut i: usize) {
        while i > 0 && self.heap[i] > self.heap[Self::parent(i)] {
            self.heap.swap(i, Self::parent(i));
            i = Self::parent(i);
        }
    }

    fn extract_max(&mut self) -> Option<i32> {
        if self.heap.is_empty() {
            return None;
        }

        let max_val = self.heap[0];
        let last = self.heap.pop().unwrap();

        if !self.heap.is_empty() {
            self.heap[0] = last;
            self.sink_down(0);
        }

        Some(max_val)
    }

    fn sink_down(&mut self, mut i: usize) {
        let n = self.heap.len();
        loop {
            let mut largest = i;
            let left = Self::left_child(i);
            let right = Self::right_child(i);

            if left < n && self.heap[left] > self.heap[largest] {
                largest = left;
            }
            if right < n && self.heap[right] > self.heap[largest] {
                largest = right;
            }

            if largest == i {
                break;
            }

            self.heap.swap(i, largest);
            i = largest;
        }
    }

    fn peek(&self) -> Option<i32> {
        self.heap.first().copied()
    }
}`;

// ─────────────────────────────────────────────────────────────────────────────
// Splay Tree Implementations
// ─────────────────────────────────────────────────────────────────────────────

const SPLAY_PYTHON = `class SplayNode:
    """Node for Splay Tree."""
    def __init__(self, val: int):
        self.val = val
        self.left: SplayNode | None = None
        self.right: SplayNode | None = None


class SplayTree:
    """Self-adjusting Splay Tree using move-to-root heuristic."""
    def __init__(self):
        self.root: SplayNode | None = None

    def _rotate_right(self, node: SplayNode) -> SplayNode:
        """Zig rotation (right)."""
        left = node.left
        node.left = left.right
        left.right = node
        return left

    def _rotate_left(self, node: SplayNode) -> SplayNode:
        """Zag rotation (left)."""
        right = node.right
        node.right = right.left
        right.left = node
        return right

    def _splay(self, node: SplayNode | None, val: int) -> SplayNode | None:
        """Splay the node with given value to the root."""
        if not node or node.val == val:
            return node

        # Value is in left subtree
        if val < node.val:
            if not node.left:
                return node

            # Zig-Zig (left-left)
            if val < node.left.val:
                node.left.left = self._splay(node.left.left, val)
                node = self._rotate_right(node)

            # Zig-Zag (left-right)
            elif val > node.left.val:
                node.left.right = self._splay(node.left.right, val)
                if node.left.right:
                    node.left = self._rotate_left(node.left)

            return self._rotate_right(node) if node.left else node

        # Value is in right subtree
        else:
            if not node.right:
                return node

            # Zag-Zag (right-right)
            if val > node.right.val:
                node.right.right = self._splay(node.right.right, val)
                node = self._rotate_left(node)

            # Zag-Zig (right-left)
            elif val < node.right.val:
                node.right.left = self._splay(node.right.left, val)
                if node.right.left:
                    node.right = self._rotate_right(node.right)

            return self._rotate_left(node) if node.right else node

    def insert(self, val: int) -> None:
        """Insert value and splay it to root."""
        if not self.root:
            self.root = SplayNode(val)
            return

        self.root = self._splay(self.root, val)

        if self.root.val == val:
            return  # Value already exists

        new_node = SplayNode(val)
        if val < self.root.val:
            new_node.right = self.root
            new_node.left = self.root.left
            self.root.left = None
        else:
            new_node.left = self.root
            new_node.right = self.root.right
            self.root.right = None

        self.root = new_node

    def search(self, val: int) -> SplayNode | None:
        """Search for value, splaying accessed node to root."""
        self.root = self._splay(self.root, val)
        return self.root if self.root and self.root.val == val else None

    def delete(self, val: int) -> None:
        """Delete value from tree."""
        if not self.root:
            return

        self.root = self._splay(self.root, val)

        if self.root.val != val:
            return  # Value not found

        if not self.root.left:
            self.root = self.root.right
        else:
            right = self.root.right
            self.root = self._splay(self.root.left, val)
            self.root.right = right`;

const SPLAY_CPP = `struct SplayNode {
    int val;
    SplayNode* left;
    SplayNode* right;

    SplayNode(int v) : val(v), left(nullptr), right(nullptr) {}
};

class SplayTree {
private:
    SplayNode* root = nullptr;

    SplayNode* rotateRight(SplayNode* node) {
        SplayNode* left = node->left;
        node->left = left->right;
        left->right = node;
        return left;
    }

    SplayNode* rotateLeft(SplayNode* node) {
        SplayNode* right = node->right;
        node->right = right->left;
        right->left = node;
        return right;
    }

    SplayNode* splay(SplayNode* node, int val) {
        if (!node || node->val == val)
            return node;

        // Value in left subtree
        if (val < node->val) {
            if (!node->left) return node;

            // Zig-Zig
            if (val < node->left->val) {
                node->left->left = splay(node->left->left, val);
                node = rotateRight(node);
            }
            // Zig-Zag
            else if (val > node->left->val) {
                node->left->right = splay(node->left->right, val);
                if (node->left->right)
                    node->left = rotateLeft(node->left);
            }

            return node->left ? rotateRight(node) : node;
        }
        // Value in right subtree
        else {
            if (!node->right) return node;

            // Zag-Zag
            if (val > node->right->val) {
                node->right->right = splay(node->right->right, val);
                node = rotateLeft(node);
            }
            // Zag-Zig
            else if (val < node->right->val) {
                node->right->left = splay(node->right->left, val);
                if (node->right->left)
                    node->right = rotateRight(node->right);
            }

            return node->right ? rotateLeft(node) : node;
        }
    }

public:
    void insert(int val) {
        if (!root) {
            root = new SplayNode(val);
            return;
        }

        root = splay(root, val);
        if (root->val == val) return;

        SplayNode* newNode = new SplayNode(val);
        if (val < root->val) {
            newNode->right = root;
            newNode->left = root->left;
            root->left = nullptr;
        } else {
            newNode->left = root;
            newNode->right = root->right;
            root->right = nullptr;
        }
        root = newNode;
    }

    SplayNode* search(int val) {
        root = splay(root, val);
        return (root && root->val == val) ? root : nullptr;
    }

    void remove(int val) {
        if (!root) return;

        root = splay(root, val);
        if (root->val != val) return;

        if (!root->left) {
            root = root->right;
        } else {
            SplayNode* right = root->right;
            root = splay(root->left, val);
            root->right = right;
        }
    }
};`;

const SPLAY_JAVA = `class SplayNode {
    int val;
    SplayNode left;
    SplayNode right;

    SplayNode(int val) {
        this.val = val;
    }
}

public class SplayTree {
    private SplayNode root;

    private SplayNode rotateRight(SplayNode node) {
        SplayNode left = node.left;
        node.left = left.right;
        left.right = node;
        return left;
    }

    private SplayNode rotateLeft(SplayNode node) {
        SplayNode right = node.right;
        node.right = right.left;
        right.left = node;
        return right;
    }

    private SplayNode splay(SplayNode node, int val) {
        if (node == null || node.val == val)
            return node;

        // Value in left subtree
        if (val < node.val) {
            if (node.left == null) return node;

            // Zig-Zig
            if (val < node.left.val) {
                node.left.left = splay(node.left.left, val);
                node = rotateRight(node);
            }
            // Zig-Zag
            else if (val > node.left.val) {
                node.left.right = splay(node.left.right, val);
                if (node.left.right != null)
                    node.left = rotateLeft(node.left);
            }

            return node.left != null ? rotateRight(node) : node;
        }
        // Value in right subtree
        else {
            if (node.right == null) return node;

            // Zag-Zag
            if (val > node.right.val) {
                node.right.right = splay(node.right.right, val);
                node = rotateLeft(node);
            }
            // Zag-Zig
            else if (val < node.right.val) {
                node.right.left = splay(node.right.left, val);
                if (node.right.left != null)
                    node.right = rotateRight(node.right);
            }

            return node.right != null ? rotateLeft(node) : node;
        }
    }

    public void insert(int val) {
        if (root == null) {
            root = new SplayNode(val);
            return;
        }

        root = splay(root, val);
        if (root.val == val) return;

        SplayNode newNode = new SplayNode(val);
        if (val < root.val) {
            newNode.right = root;
            newNode.left = root.left;
            root.left = null;
        } else {
            newNode.left = root;
            newNode.right = root.right;
            root.right = null;
        }
        root = newNode;
    }

    public SplayNode search(int val) {
        root = splay(root, val);
        return (root != null && root.val == val) ? root : null;
    }

    public void delete(int val) {
        if (root == null) return;

        root = splay(root, val);
        if (root.val != val) return;

        if (root.left == null) {
            root = root.right;
        } else {
            SplayNode right = root.right;
            root = splay(root.left, val);
            root.right = right;
        }
    }
}`;

const SPLAY_JS = `class SplayNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

class SplayTree {
  constructor() {
    this.root = null;
  }

  #rotateRight(node) {
    const left = node.left;
    node.left = left.right;
    left.right = node;
    return left;
  }

  #rotateLeft(node) {
    const right = node.right;
    node.right = right.left;
    right.left = node;
    return right;
  }

  #splay(node, val) {
    if (!node || node.val === val) return node;

    // Value in left subtree
    if (val < node.val) {
      if (!node.left) return node;

      // Zig-Zig
      if (val < node.left.val) {
        node.left.left = this.#splay(node.left.left, val);
        node = this.#rotateRight(node);
      }
      // Zig-Zag
      else if (val > node.left.val) {
        node.left.right = this.#splay(node.left.right, val);
        if (node.left.right)
          node.left = this.#rotateLeft(node.left);
      }

      return node.left ? this.#rotateRight(node) : node;
    }
    // Value in right subtree
    else {
      if (!node.right) return node;

      // Zag-Zag
      if (val > node.right.val) {
        node.right.right = this.#splay(node.right.right, val);
        node = this.#rotateLeft(node);
      }
      // Zag-Zig
      else if (val < node.right.val) {
        node.right.left = this.#splay(node.right.left, val);
        if (node.right.left)
          node.right = this.#rotateRight(node.right);
      }

      return node.right ? this.#rotateLeft(node) : node;
    }
  }

  insert(val) {
    if (!this.root) {
      this.root = new SplayNode(val);
      return;
    }

    this.root = this.#splay(this.root, val);
    if (this.root.val === val) return;

    const newNode = new SplayNode(val);
    if (val < this.root.val) {
      newNode.right = this.root;
      newNode.left = this.root.left;
      this.root.left = null;
    } else {
      newNode.left = this.root;
      newNode.right = this.root.right;
      this.root.right = null;
    }
    this.root = newNode;
  }

  search(val) {
    this.root = this.#splay(this.root, val);
    return (this.root && this.root.val === val) ? this.root : null;
  }

  delete(val) {
    if (!this.root) return;

    this.root = this.#splay(this.root, val);
    if (this.root.val !== val) return;

    if (!this.root.left) {
      this.root = this.root.right;
    } else {
      const right = this.root.right;
      this.root = this.#splay(this.root.left, val);
      this.root.right = right;
    }
  }
}`;

const SPLAY_GO = `type SplayNode struct {
    Val   int
    Left  *SplayNode
    Right *SplayNode
}

type SplayTree struct {
    Root *SplayNode
}

func (t *SplayTree) rotateRight(node *SplayNode) *SplayNode {
    left := node.Left
    node.Left = left.Right
    left.Right = node
    return left
}

func (t *SplayTree) rotateLeft(node *SplayNode) *SplayNode {
    right := node.Right
    node.Right = right.Left
    right.Left = node
    return right
}

func (t *SplayTree) splay(node *SplayNode, val int) *SplayNode {
    if node == nil || node.Val == val {
        return node
    }

    // Value in left subtree
    if val < node.Val {
        if node.Left == nil {
            return node
        }

        // Zig-Zig
        if val < node.Left.Val {
            node.Left.Left = t.splay(node.Left.Left, val)
            node = t.rotateRight(node)
        } else if val > node.Left.Val {
            // Zig-Zag
            node.Left.Right = t.splay(node.Left.Right, val)
            if node.Left.Right != nil {
                node.Left = t.rotateLeft(node.Left)
            }
        }

        if node.Left != nil {
            return t.rotateRight(node)
        }
        return node
    }

    // Value in right subtree
    if node.Right == nil {
        return node
    }

    // Zag-Zag
    if val > node.Right.Val {
        node.Right.Right = t.splay(node.Right.Right, val)
        node = t.rotateLeft(node)
    } else if val < node.Right.Val {
        // Zag-Zig
        node.Right.Left = t.splay(node.Right.Left, val)
        if node.Right.Left != nil {
            node.Right = t.rotateRight(node.Right)
        }
    }

    if node.Right != nil {
        return t.rotateLeft(node)
    }
    return node
}

func (t *SplayTree) Insert(val int) {
    if t.Root == nil {
        t.Root = &SplayNode{Val: val}
        return
    }

    t.Root = t.splay(t.Root, val)
    if t.Root.Val == val {
        return
    }

    newNode := &SplayNode{Val: val}
    if val < t.Root.Val {
        newNode.Right = t.Root
        newNode.Left = t.Root.Left
        t.Root.Left = nil
    } else {
        newNode.Left = t.Root
        newNode.Right = t.Root.Right
        t.Root.Right = nil
    }
    t.Root = newNode
}

func (t *SplayTree) Search(val int) *SplayNode {
    t.Root = t.splay(t.Root, val)
    if t.Root != nil && t.Root.Val == val {
        return t.Root
    }
    return nil
}

func (t *SplayTree) Delete(val int) {
    if t.Root == nil {
        return
    }

    t.Root = t.splay(t.Root, val)
    if t.Root.Val != val {
        return
    }

    if t.Root.Left == nil {
        t.Root = t.Root.Right
    } else {
        right := t.Root.Right
        t.Root = t.splay(t.Root.Left, val)
        t.Root.Right = right
    }
}`;

const SPLAY_RUST = `struct SplayNode {
    val: i32,
    left: Option<Box<SplayNode>>,
    right: Option<Box<SplayNode>>,
}

impl SplayNode {
    fn new(val: i32) -> Self {
        SplayNode { val, left: None, right: None }
    }
}

struct SplayTree {
    root: Option<Box<SplayNode>>,
}

impl SplayTree {
    fn new() -> Self {
        SplayTree { root: None }
    }

    fn rotate_right(mut node: Box<SplayNode>) -> Box<SplayNode> {
        let mut left = node.left.take().unwrap();
        node.left = left.right.take();
        left.right = Some(node);
        left
    }

    fn rotate_left(mut node: Box<SplayNode>) -> Box<SplayNode> {
        let mut right = node.right.take().unwrap();
        node.right = right.left.take();
        right.left = Some(node);
        right
    }

    fn splay(node: Option<Box<SplayNode>>, val: i32) -> Option<Box<SplayNode>> {
        let mut node = node?;

        if node.val == val {
            return Some(node);
        }

        if val < node.val {
            if node.left.is_none() {
                return Some(node);
            }

            let left_val = node.left.as_ref().unwrap().val;

            // Zig-Zig
            if val < left_val {
                let mut left = node.left.take().unwrap();
                left.left = Self::splay(left.left.take(), val);
                node.left = Some(left);
                node = Self::rotate_right(node);
            }
            // Zig-Zag
            else if val > left_val {
                let mut left = node.left.take().unwrap();
                left.right = Self::splay(left.right.take(), val);
                if left.right.is_some() {
                    node.left = Some(Self::rotate_left(left));
                } else {
                    node.left = Some(left);
                }
            }

            if node.left.is_some() {
                Some(Self::rotate_right(node))
            } else {
                Some(node)
            }
        } else {
            if node.right.is_none() {
                return Some(node);
            }

            let right_val = node.right.as_ref().unwrap().val;

            // Zag-Zag
            if val > right_val {
                let mut right = node.right.take().unwrap();
                right.right = Self::splay(right.right.take(), val);
                node.right = Some(right);
                node = Self::rotate_left(node);
            }
            // Zag-Zig
            else if val < right_val {
                let mut right = node.right.take().unwrap();
                right.left = Self::splay(right.left.take(), val);
                if right.left.is_some() {
                    node.right = Some(Self::rotate_right(right));
                } else {
                    node.right = Some(right);
                }
            }

            if node.right.is_some() {
                Some(Self::rotate_left(node))
            } else {
                Some(node)
            }
        }
    }

    fn insert(&mut self, val: i32) {
        if self.root.is_none() {
            self.root = Some(Box::new(SplayNode::new(val)));
            return;
        }

        self.root = Self::splay(self.root.take(), val);

        if self.root.as_ref().unwrap().val == val {
            return;
        }

        let mut new_node = Box::new(SplayNode::new(val));
        let root = self.root.take().unwrap();

        if val < root.val {
            new_node.left = root.left.clone();
            new_node.right = Some(Box::new(SplayNode {
                val: root.val,
                left: None,
                right: root.right,
            }));
        } else {
            new_node.right = root.right.clone();
            new_node.left = Some(Box::new(SplayNode {
                val: root.val,
                left: root.left,
                right: None,
            }));
        }

        self.root = Some(new_node);
    }

    fn search(&mut self, val: i32) -> bool {
        self.root = Self::splay(self.root.take(), val);
        self.root.as_ref().map_or(false, |n| n.val == val)
    }
}`;

// ─────────────────────────────────────────────────────────────────────────────
// Complete Registry
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Reference implementations of all tree data structures in multiple languages.
 * BST, AVL, and Splay use class-based node implementations.
 * Max Heap uses array-based implementation (parent = (i-1)/2).
 */
export const TREE_IMPLEMENTATIONS: Record<TreeDataStructureType, Record<Language, string>> = {
  bst: {
    python: BST_PYTHON,
    cpp: BST_CPP,
    java: BST_JAVA,
    javascript: BST_JS,
    go: BST_GO,
    rust: BST_RUST,
  },
  avl: {
    python: AVL_PYTHON,
    cpp: AVL_CPP,
    java: AVL_JAVA,
    javascript: AVL_JS,
    go: AVL_GO,
    rust: AVL_RUST,
  },
  "max-heap": {
    python: HEAP_PYTHON,
    cpp: HEAP_CPP,
    java: HEAP_JAVA,
    javascript: HEAP_JS,
    go: HEAP_GO,
    rust: HEAP_RUST,
  },
  splay: {
    python: SPLAY_PYTHON,
    cpp: SPLAY_CPP,
    java: SPLAY_JAVA,
    javascript: SPLAY_JS,
    go: SPLAY_GO,
    rust: SPLAY_RUST,
  },
};

/**
 * Get the implementation of a tree data structure in a specific language.
 */
export function getTreeImplementation(
  structure: TreeDataStructureType,
  language: Language
): string {
  return TREE_IMPLEMENTATIONS[structure][language];
}

/**
 * Get all implementations for a specific tree data structure.
 */
export function getAllTreeImplementations(
  structure: TreeDataStructureType
): Record<Language, string> {
  return TREE_IMPLEMENTATIONS[structure];
}
