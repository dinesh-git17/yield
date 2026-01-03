import type { AlgorithmType } from "@/lib/store";
import type { SortStep } from "./sorting";

/**
 * Step type labels for display in the UI.
 */
export const STEP_TYPE_LABELS: Record<SortStep["type"], string> = {
  compare: "Comparing elements",
  swap: "Swapping elements",
  scanning: "Current minimum",
  sorted: "Marking as sorted",
  pivot: "Selecting pivot",
  overwrite: "Writing value",
  partition: "Partitioning range",
};

/**
 * Metadata for each algorithm including code display and line mappings.
 */
export interface AlgorithmMetadata {
  /** Display name for the algorithm */
  label: string;
  /** Time complexity notation */
  complexity: string;
  /** Space complexity notation */
  spaceComplexity: string;
  /** Brief description of how the algorithm works */
  description: string;
  /** Source code lines for display */
  code: string[];
  /** Maps step types to their corresponding line indices (0-based) */
  lineMapping: Partial<Record<SortStep["type"], number>>;
}

/**
 * Algorithm metadata registry.
 * Each algorithm has its code representation and line mappings for sync.
 */
export const ALGO_METADATA: Record<AlgorithmType, AlgorithmMetadata> = {
  bubble: {
    label: "Bubble Sort",
    complexity: "O(n²)",
    spaceComplexity: "O(1)",
    description: "Repeatedly swaps adjacent elements if they are in the wrong order.",
    code: [
      "function* bubbleSort(arr) {",
      "  const n = arr.length;",
      "",
      "  for (let i = 0; i < n - 1; i++) {",
      "    for (let j = 0; j < n - i - 1; j++) {",
      "      // Compare adjacent elements",
      "      yield { type: 'compare', indices: [j, j + 1] };",
      "",
      "      if (arr[j] > arr[j + 1]) {",
      "        // Swap elements",
      "        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];",
      "        yield { type: 'swap', indices: [j, j + 1] };",
      "      }",
      "    }",
      "    // Mark element as sorted",
      "    yield { type: 'sorted', index: n - i - 1 };",
      "  }",
      "",
      "  yield { type: 'sorted', index: 0 };",
      "}",
    ],
    lineMapping: {
      compare: 6,
      swap: 11,
      sorted: 15,
    },
  },

  selection: {
    label: "Selection Sort",
    complexity: "O(n²)",
    spaceComplexity: "O(1)",
    description: "Finds the minimum element and places it at the sorted position.",
    code: [
      "function* selectionSort(arr) {",
      "  const n = arr.length;",
      "",
      "  for (let i = 0; i < n - 1; i++) {",
      "    let minIdx = i;",
      "    // Mark current minimum",
      "    yield { type: 'scanning', index: minIdx };",
      "",
      "    for (let j = i + 1; j < n; j++) {",
      "      // Compare to find minimum",
      "      yield { type: 'compare', indices: [minIdx, j] };",
      "",
      "      if (arr[j] < arr[minIdx]) {",
      "        minIdx = j;",
      "        // Mark new minimum",
      "        yield { type: 'scanning', index: minIdx };",
      "      }",
      "    }",
      "",
      "    if (minIdx !== i) {",
      "      // Swap minimum to sorted position",
      "      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];",
      "      yield { type: 'swap', indices: [i, minIdx] };",
      "    }",
      "",
      "    // Mark element as sorted",
      "    yield { type: 'sorted', index: i };",
      "  }",
      "",
      "  yield { type: 'sorted', index: n - 1 };",
      "}",
    ],
    lineMapping: {
      compare: 10,
      swap: 22,
      scanning: 6,
      sorted: 26,
    },
  },

  quick: {
    label: "Quick Sort",
    complexity: "O(n log n)",
    spaceComplexity: "O(log n)",
    description: "Partitions around a pivot, recursively sorting subarrays.",
    code: [
      "function* quickSort(arr, lo = 0, hi = arr.length - 1) {",
      "  if (lo >= hi) return;",
      "",
      "  // Select pivot (last element)",
      "  yield { type: 'pivot', index: hi };",
      "  const pivot = arr[hi];",
      "  let i = lo - 1;",
      "",
      "  for (let j = lo; j < hi; j++) {",
      "    // Compare element with pivot",
      "    yield { type: 'compare', indices: [j, hi] };",
      "",
      "    if (arr[j] <= pivot) {",
      "      i++;",
      "      [arr[i], arr[j]] = [arr[j], arr[i]];",
      "      yield { type: 'swap', indices: [i, j] };",
      "    }",
      "  }",
      "",
      "  // Place pivot in sorted position",
      "  [arr[i + 1], arr[hi]] = [arr[hi], arr[i + 1]];",
      "  yield { type: 'swap', indices: [i + 1, hi] };",
      "  yield { type: 'sorted', index: i + 1 };",
      "",
      "  // Recursively sort partitions",
      "  yield* quickSort(arr, lo, i);",
      "  yield* quickSort(arr, i + 2, hi);",
      "}",
    ],
    lineMapping: {
      pivot: 4,
      compare: 10,
      swap: 15,
      sorted: 22,
    },
  },

  merge: {
    label: "Merge Sort",
    complexity: "O(n log n)",
    spaceComplexity: "O(n)",
    description: "Divides array in half, sorts each, then merges them back.",
    code: [
      "function* mergeSort(arr, lo = 0, hi = arr.length - 1) {",
      "  if (lo >= hi) return;",
      "",
      "  const mid = Math.floor((lo + hi) / 2);",
      "",
      "  // Recursively sort halves",
      "  yield* mergeSort(arr, lo, mid);",
      "  yield* mergeSort(arr, mid + 1, hi);",
      "",
      "  // Merge sorted halves",
      "  const merged = [];",
      "  let i = lo, j = mid + 1;",
      "",
      "  while (i <= mid && j <= hi) {",
      "    // Compare elements from each half",
      "    yield { type: 'compare', indices: [i, j] };",
      "",
      "    if (arr[i] <= arr[j]) {",
      "      merged.push(arr[i++]);",
      "    } else {",
      "      merged.push(arr[j++]);",
      "    }",
      "  }",
      "",
      "  // Copy remaining and write back",
      "  while (i <= mid) merged.push(arr[i++]);",
      "  while (j <= hi) merged.push(arr[j++]);",
      "",
      "  for (let k = 0; k < merged.length; k++) {",
      "    arr[lo + k] = merged[k];",
      "    yield { type: 'overwrite', index: lo + k };",
      "  }",
      "}",
    ],
    lineMapping: {
      compare: 15,
      overwrite: 30,
    },
  },
};

/**
 * Get metadata for a specific algorithm.
 * Falls back to bubble sort if algorithm not found.
 */
export function getAlgorithmMetadata(algorithm: AlgorithmType): AlgorithmMetadata {
  return ALGO_METADATA[algorithm] ?? ALGO_METADATA.bubble;
}
