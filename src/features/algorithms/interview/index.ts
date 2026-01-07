// Types

// Configuration
export type { InterviewProblemMetadata } from "./config";
export {
  DEFAULT_RAIN_WATER_HEIGHTS,
  generateRandomHeights,
  getInterviewProblemMetadata,
  getStepInsight,
  INTERVIEW_CONFIG,
  INTERVIEW_INSIGHTS,
  INTERVIEW_METADATA,
  INTERVIEW_STEP_LABELS,
  RAIN_WATER_PRESETS,
} from "./config";

// Algorithms
export { computeTrappedWater, trappingRainWater } from "./trappingRainWater";
export type {
  InterviewContext,
  InterviewGenerator,
  InterviewProblemType,
  InterviewStep,
  RainWaterState,
} from "./types";
export { createInitialRainWaterState } from "./types";
