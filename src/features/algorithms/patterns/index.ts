// Types

// Config & Metadata
export type { PatternProblemMetadata } from "./config";
export {
  DEFAULT_SLIDING_WINDOW_INPUT,
  getPatternProblemMetadata,
  getPatternStepInsight,
  getPatternStepLabel,
  PATTERN_INSIGHTS,
  PATTERN_METADATA,
  PATTERN_STEP_LABELS,
  PATTERNS_CONFIG,
  SLIDING_WINDOW_PRESETS,
} from "./config";

// Algorithms
export { computeLongestSubstring, slidingWindow } from "./slidingWindow";
export type {
  PatternContext,
  PatternGenerator,
  PatternProblemType,
  PatternStep,
  SlidingWindowState,
  WindowStatus,
} from "./types";
export { createInitialSlidingWindowState } from "./types";
