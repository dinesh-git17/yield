import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  createEmptyTreeState,
  resetNodeIdCounter,
  type TreeNode,
  type TreeState,
  useYieldStore,
} from "./store";

describe("Tree Store Actions", () => {
  beforeEach(() => {
    resetNodeIdCounter();
    useYieldStore.getState().resetTree();
  });

  afterEach(() => {
    useYieldStore.getState().resetTree();
  });

  describe("insertNode", () => {
    it("inserts first node as root", () => {
      const id = useYieldStore.getState().insertNode(50);
      const { treeState } = useYieldStore.getState();

      expect(id).toBe("node-1");
      expect(treeState.rootId).toBe("node-1");
      expect(treeState.nodes["node-1"]).toEqual({
        id: "node-1",
        value: 50,
        leftId: null,
        rightId: null,
        parentId: null,
      });
    });

    it("inserts smaller value as left child", () => {
      useYieldStore.getState().insertNode(50);
      const id = useYieldStore.getState().insertNode(25);
      const { treeState } = useYieldStore.getState();

      expect(id).toBe("node-2");
      expect(treeState.nodes["node-1"]?.leftId).toBe("node-2");
      expect(treeState.nodes["node-2"]).toEqual({
        id: "node-2",
        value: 25,
        leftId: null,
        rightId: null,
        parentId: "node-1",
      });
    });

    it("inserts larger value as right child", () => {
      useYieldStore.getState().insertNode(50);
      const id = useYieldStore.getState().insertNode(75);
      const { treeState } = useYieldStore.getState();

      expect(id).toBe("node-2");
      expect(treeState.nodes["node-1"]?.rightId).toBe("node-2");
      expect(treeState.nodes["node-2"]?.parentId).toBe("node-1");
    });

    it("rejects duplicate values", () => {
      useYieldStore.getState().insertNode(50);
      const id = useYieldStore.getState().insertNode(50);
      const { treeState } = useYieldStore.getState();

      expect(id).toBeNull();
      expect(Object.keys(treeState.nodes)).toHaveLength(1);
    });

    it("builds correct BST structure", () => {
      //       50
      //      /  \
      //    25    75
      //   /  \
      //  10   30
      useYieldStore.getState().insertNode(50);
      useYieldStore.getState().insertNode(25);
      useYieldStore.getState().insertNode(75);
      useYieldStore.getState().insertNode(10);
      useYieldStore.getState().insertNode(30);

      const { treeState } = useYieldStore.getState();

      expect(Object.keys(treeState.nodes)).toHaveLength(5);
      expect(treeState.nodes["node-1"]?.leftId).toBe("node-2");
      expect(treeState.nodes["node-1"]?.rightId).toBe("node-3");
      expect(treeState.nodes["node-2"]?.leftId).toBe("node-4");
      expect(treeState.nodes["node-2"]?.rightId).toBe("node-5");
    });
  });

  describe("deleteNode", () => {
    it("returns false when deleting from empty tree", () => {
      const result = useYieldStore.getState().deleteNode(50);
      expect(result).toBe(false);
    });

    it("returns false when value not found", () => {
      useYieldStore.getState().insertNode(50);
      const result = useYieldStore.getState().deleteNode(100);
      expect(result).toBe(false);
    });

    it("deletes leaf node (root)", () => {
      useYieldStore.getState().insertNode(50);
      const result = useYieldStore.getState().deleteNode(50);
      const { treeState } = useYieldStore.getState();

      expect(result).toBe(true);
      expect(treeState.rootId).toBeNull();
      expect(Object.keys(treeState.nodes)).toHaveLength(0);
    });

    it("deletes leaf node (non-root)", () => {
      useYieldStore.getState().insertNode(50);
      useYieldStore.getState().insertNode(25);
      useYieldStore.getState().insertNode(75);

      const result = useYieldStore.getState().deleteNode(25);
      const { treeState } = useYieldStore.getState();

      expect(result).toBe(true);
      expect(treeState.nodes["node-1"]?.leftId).toBeNull();
      expect(Object.keys(treeState.nodes)).toHaveLength(2);
    });

    it("deletes node with one left child", () => {
      useYieldStore.getState().insertNode(50);
      useYieldStore.getState().insertNode(25);
      useYieldStore.getState().insertNode(10);

      const result = useYieldStore.getState().deleteNode(25);
      const { treeState } = useYieldStore.getState();

      expect(result).toBe(true);
      expect(treeState.nodes["node-1"]?.leftId).toBe("node-3");
      expect(treeState.nodes["node-3"]?.parentId).toBe("node-1");
    });

    it("deletes node with one right child", () => {
      useYieldStore.getState().insertNode(50);
      useYieldStore.getState().insertNode(75);
      useYieldStore.getState().insertNode(100);

      const result = useYieldStore.getState().deleteNode(75);
      const { treeState } = useYieldStore.getState();

      expect(result).toBe(true);
      expect(treeState.nodes["node-1"]?.rightId).toBe("node-3");
      expect(treeState.nodes["node-3"]?.parentId).toBe("node-1");
    });

    it("deletes root with one child", () => {
      useYieldStore.getState().insertNode(50);
      useYieldStore.getState().insertNode(25);

      const result = useYieldStore.getState().deleteNode(50);
      const { treeState } = useYieldStore.getState();

      expect(result).toBe(true);
      expect(treeState.rootId).toBe("node-2");
      expect(treeState.nodes["node-2"]?.parentId).toBeNull();
    });

    it("deletes node with two children (uses in-order successor)", () => {
      //       50
      //      /  \
      //    25    75
      //         /
      //        60
      useYieldStore.getState().insertNode(50);
      useYieldStore.getState().insertNode(25);
      useYieldStore.getState().insertNode(75);
      useYieldStore.getState().insertNode(60);

      const result = useYieldStore.getState().deleteNode(50);
      const { treeState } = useYieldStore.getState();

      expect(result).toBe(true);
      // 60 becomes the new root value (in-order successor)
      expect(treeState.nodes["node-1"]?.value).toBe(60);
      // 75's left child should now be null
      expect(treeState.nodes["node-3"]?.leftId).toBeNull();
    });

    it("deletes node with two children (complex case)", () => {
      //       50
      //      /  \
      //    25    75
      //   / \    / \
      //  10 30  60  90
      useYieldStore.getState().insertNode(50);
      useYieldStore.getState().insertNode(25);
      useYieldStore.getState().insertNode(75);
      useYieldStore.getState().insertNode(10);
      useYieldStore.getState().insertNode(30);
      useYieldStore.getState().insertNode(60);
      useYieldStore.getState().insertNode(90);

      const result = useYieldStore.getState().deleteNode(50);
      const { treeState } = useYieldStore.getState();

      expect(result).toBe(true);
      // In-order successor of 50 is 60
      expect(treeState.nodes["node-1"]?.value).toBe(60);
      expect(Object.keys(treeState.nodes)).toHaveLength(6);
    });
  });

  describe("resetTree", () => {
    it("clears all nodes", () => {
      useYieldStore.getState().insertNode(50);
      useYieldStore.getState().insertNode(25);
      useYieldStore.getState().insertNode(75);

      useYieldStore.getState().resetTree();
      const { treeState } = useYieldStore.getState();

      expect(treeState.rootId).toBeNull();
      expect(Object.keys(treeState.nodes)).toHaveLength(0);
    });
  });

  describe("setTreeState", () => {
    it("sets entire tree state", () => {
      const customState: TreeState = {
        rootId: "custom-1",
        nodes: {
          "custom-1": {
            id: "custom-1",
            value: 42,
            leftId: null,
            rightId: null,
            parentId: null,
          },
        },
      };

      useYieldStore.getState().setTreeState(customState);
      const { treeState } = useYieldStore.getState();

      expect(treeState.rootId).toBe("custom-1");
      expect(treeState.nodes["custom-1"]?.value).toBe(42);
    });
  });

  describe("setTreeAlgorithm", () => {
    it("changes tree algorithm", () => {
      useYieldStore.getState().setTreeAlgorithm("inorder");
      expect(useYieldStore.getState().treeAlgorithm).toBe("inorder");

      useYieldStore.getState().setTreeAlgorithm("search");
      expect(useYieldStore.getState().treeAlgorithm).toBe("search");
    });
  });

  describe("mode switching", () => {
    it("preserves tree state when switching modes", () => {
      useYieldStore.getState().insertNode(50);
      useYieldStore.getState().insertNode(25);

      useYieldStore.getState().setMode("sorting");
      useYieldStore.getState().setMode("pathfinding");
      useYieldStore.getState().setMode("tree");

      const { treeState } = useYieldStore.getState();
      expect(Object.keys(treeState.nodes)).toHaveLength(2);
    });
  });
});

describe("createEmptyTreeState", () => {
  it("creates empty tree state", () => {
    const state = createEmptyTreeState();
    expect(state.rootId).toBeNull();
    expect(state.nodes).toEqual({});
  });
});
