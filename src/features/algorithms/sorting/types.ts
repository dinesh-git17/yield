/**
 * Represents a single step in a sorting algorithm execution.
 * Used by generator functions to yield operations for visualization.
 */
export type SortStep =
  | { type: "compare"; indices: [number, number] }
  | { type: "swap"; indices: [number, number]; newValues: [number, number] }
  | { type: "scanning"; index: number }
  | { type: "sorted"; index: number }
  | { type: "pivot"; index: number }
  | { type: "overwrite"; index: number; value: number }
  | { type: "partition"; range: [number, number] };
