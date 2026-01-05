import { TREE_CONFIG } from "@/lib/store";

/**
 * Generates an array of values that, when inserted in order into a BST,
 * will create a balanced tree structure.
 *
 * Uses the "median-first" approach: insert the middle element first,
 * then recursively insert the middle of left and right halves.
 * This ensures the tree is as balanced as possible.
 *
 * @param count - Number of nodes to generate (default: 15 for a nice 4-level tree)
 * @returns Array of values in the order they should be inserted
 */
export function generateBalancedInsertionOrder(count: number = 15): number[] {
  // Clamp to valid range
  const nodeCount = Math.max(1, Math.min(count, TREE_CONFIG.MAX_NODES));

  // Generate a sorted array of unique values
  const sortedValues = generateUniqueValues(nodeCount);

  // Reorder for balanced insertion
  const insertionOrder: number[] = [];
  buildBalancedOrder(sortedValues, 0, sortedValues.length - 1, insertionOrder);

  return insertionOrder;
}

/**
 * Generates unique random values within the configured range.
 */
function generateUniqueValues(count: number): number[] {
  const range = TREE_CONFIG.VALUE_MAX - TREE_CONFIG.VALUE_MIN + 1;
  const actualCount = Math.min(count, range);

  // Use a Set to ensure uniqueness
  const values = new Set<number>();

  // For small counts relative to range, random sampling works well
  if (actualCount <= range / 2) {
    while (values.size < actualCount) {
      const value = Math.floor(Math.random() * range) + TREE_CONFIG.VALUE_MIN;
      values.add(value);
    }
  } else {
    // For larger counts, shuffle all possible values and take first N
    const allValues = Array.from({ length: range }, (_, i) => i + TREE_CONFIG.VALUE_MIN);
    shuffleArray(allValues);
    for (let i = 0; i < actualCount; i++) {
      // Safe: i is always within bounds of allValues since actualCount <= range = allValues.length
      values.add(allValues[i] as number);
    }
  }

  // Sort for balanced insertion
  return Array.from(values).sort((a, b) => a - b);
}

/**
 * Fisher-Yates shuffle for random ordering.
 */
function shuffleArray<T>(arr: T[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // Safe: i and j are always within bounds
    const temp = arr[i] as T;
    arr[i] = arr[j] as T;
    arr[j] = temp;
  }
}

/**
 * Recursively builds the insertion order by picking midpoints.
 * This creates a balanced BST when values are inserted in this order.
 */
function buildBalancedOrder(sorted: number[], left: number, right: number, result: number[]): void {
  if (left > right) return;

  // Pick the middle element
  const mid = Math.floor((left + right) / 2);
  // Safe: mid is always within bounds since left <= mid <= right and bounds are valid indices
  const midValue = sorted[mid] as number;
  result.push(midValue);

  // Recursively process left and right halves
  buildBalancedOrder(sorted, left, mid - 1, result);
  buildBalancedOrder(sorted, mid + 1, right, result);
}

/**
 * Generates a balanced tree by returning values in the proper insertion order.
 * This is a convenience wrapper that returns a generator for animated insertion.
 *
 * @param count - Number of nodes to generate
 * @returns Generator yielding values to insert one at a time
 */
export function* generateBalancedTreeSequence(
  count: number = 15
): Generator<number, void, unknown> {
  const values = generateBalancedInsertionOrder(count);
  for (const value of values) {
    yield value;
  }
}
