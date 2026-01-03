import { create } from "zustand";

/**
 * Supported sorting algorithms.
 * Extensible as new algorithms are implemented.
 */
export type AlgorithmType = "bubble" | "selection" | "quick";

/**
 * Playback speed multipliers.
 * Maps to actual interval timing in the controller.
 */
export type PlaybackSpeedMultiplier = 0.5 | 1 | 2 | 4;

/**
 * Configuration constants for the visualizer.
 */
export const CONFIG = {
  ARRAY_SIZE_MIN: 5,
  ARRAY_SIZE_MAX: 50,
  ARRAY_SIZE_DEFAULT: 20,
  SPEED_DEFAULT: 1 as PlaybackSpeedMultiplier,
  ALGORITHM_DEFAULT: "bubble" as AlgorithmType,
} as const;

/**
 * Central configuration store for the Yield visualizer.
 * Manages algorithm selection, array size, and playback speed.
 */
export interface YieldStore {
  // Configuration state
  algorithm: AlgorithmType;
  arraySize: number;
  playbackSpeed: PlaybackSpeedMultiplier;

  // Actions
  setAlgorithm: (algo: AlgorithmType) => void;
  setArraySize: (size: number) => void;
  setPlaybackSpeed: (speed: PlaybackSpeedMultiplier) => void;
}

export const useYieldStore = create<YieldStore>((set) => ({
  // Initial state
  algorithm: CONFIG.ALGORITHM_DEFAULT,
  arraySize: CONFIG.ARRAY_SIZE_DEFAULT,
  playbackSpeed: CONFIG.SPEED_DEFAULT,

  // Actions
  setAlgorithm: (algo) => set({ algorithm: algo }),

  setArraySize: (size) =>
    set({
      arraySize: Math.max(CONFIG.ARRAY_SIZE_MIN, Math.min(CONFIG.ARRAY_SIZE_MAX, size)),
    }),

  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
}));
