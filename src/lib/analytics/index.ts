/**
 * Analytics Module
 *
 * Public exports for the analytics system.
 */

// Context & Hook
export { AnalyticsProvider, useAnalytics } from "./context";
// Hooks for component-level tracking
export {
  trackCodePanel,
  trackComplexityModal,
  trackGraphOperation,
  trackGridInteraction,
  trackMazeGenerated,
  trackTreeOperation,
  useSimulationTracking,
} from "./hooks";
// Service (for direct access outside React components)
export { analytics } from "./service";

// Types
export {
  type AlgorithmSelectedPayload,
  ANALYTICS_EVENTS,
  type AnalyticsEvent,
  type AnalyticsEventName,
  type AnalyticsProvider as AnalyticsProviderInterface,
  type ArraySizeChangePayload,
  type CodePanelPayload,
  type ComplexityModalPayload,
  type ConsentCategory,
  type ConsentInteractionPayload,
  type ConsentState,
  DEFAULT_CONSENT_STATE,
  type GraphOperationPayload,
  type GridInteractionPayload,
  type MazeGeneratedPayload,
  type PageViewPayload,
  type SimulationCompletePayload,
  type SimulationStartPayload,
  type SpeedChangePayload,
  type TreeOperationPayload,
  type UTMParams,
} from "./types";
