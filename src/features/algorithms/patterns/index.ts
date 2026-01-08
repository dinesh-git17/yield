// Types

// Config & Metadata
export type { MinWindowPreset, PatternProblemMetadata, PresetOption } from "./config";
export {
  DEFAULT_SLIDING_WINDOW_INPUT,
  getDynamicPatternInsight,
  getPatternProblemMetadata,
  getPatternStepInsight,
  getPatternStepLabel,
  getPresetOptionsForProblem,
  LONGEST_SUBSTRING_PRESET_OPTIONS,
  MIN_WINDOW_PRESET_OPTIONS,
  MIN_WINDOW_PRESETS,
  PATTERN_INSIGHTS,
  PATTERN_METADATA,
  PATTERN_STEP_LABELS,
  PATTERNS_CONFIG,
  SLIDING_WINDOW_PRESETS,
} from "./config";
export { computeMinWindow, minWindowSubstring } from "./minWindow";
// Algorithms
export { computeLongestSubstring, slidingWindow } from "./slidingWindow";
export type {
  CreateSlidingWindowStateOptions,
  OptimizationObjective,
  PatternContext,
  PatternGenerator,
  PatternProblemType,
  PatternStep,
  SlidingWindowState,
  ValidityReason,
  WindowStatus,
} from "./types";
export { createInitialSlidingWindowState } from "./types";
