/**
 * Analytics Event Type Definitions
 *
 * Strict TypeScript interfaces for all trackable events.
 * Vendor-agnostic design allows swapping GA4/Mixpanel/etc without code changes.
 */

// =============================================================================
// Consent Types
// =============================================================================

export type ConsentCategory = "essential" | "analytics" | "marketing";

export interface ConsentState {
  essential: true; // Always true, cannot be disabled
  analytics: boolean;
  marketing: boolean;
  timestamp: number | null; // When consent was given/updated
}

export const DEFAULT_CONSENT_STATE: ConsentState = {
  essential: true,
  analytics: false,
  marketing: false,
  timestamp: null,
};

// =============================================================================
// Event Payload Types
// =============================================================================

/** Algorithm selection event */
export interface AlgorithmSelectedPayload {
  algorithm_name: string;
  mode: "sorting" | "pathfinding" | "tree" | "graph" | "interview" | "patterns";
  previous_algorithm?: string | undefined;
}

/** Simulation lifecycle events */
export interface SimulationStartPayload {
  algorithm_name: string;
  mode: "sorting" | "pathfinding" | "tree" | "graph" | "interview" | "patterns";
  array_size?: number | undefined;
  grid_size?: { rows: number; cols: number } | undefined;
  tree_node_count?: number | undefined;
  graph_node_count?: number | undefined;
}

export interface SimulationCompletePayload {
  algorithm_name: string;
  mode: "sorting" | "pathfinding" | "tree" | "graph" | "interview" | "patterns";
  duration_ms: number;
  step_count: number;
  array_size?: number | undefined;
  grid_size?: { rows: number; cols: number } | undefined;
}

/** Playback control events */
export interface SpeedChangePayload {
  speed: number;
  mode: "sorting" | "pathfinding" | "tree" | "graph" | "interview" | "patterns";
}

export interface ArraySizeChangePayload {
  size: number;
  previous_size: number;
}

/** Grid interaction (pathfinding) */
export interface GridInteractionPayload {
  interaction_type: "wall_toggle" | "start_move" | "end_move" | "clear";
  grid_size: { rows: number; cols: number };
}

/** Maze generation */
export interface MazeGeneratedPayload {
  algorithm: string;
  grid_size: { rows: number; cols: number };
}

/** Learning engagement events */
export interface CodePanelPayload {
  action: "open" | "close";
  algorithm_name: string;
  mode: "sorting" | "pathfinding" | "tree" | "graph" | "interview" | "patterns";
}

export interface ComplexityModalPayload {
  action: "open" | "close";
  algorithm_name: string;
  mode: "sorting" | "pathfinding" | "tree" | "graph" | "interview" | "patterns";
}

/** Tree-specific operations */
export interface TreeOperationPayload {
  operation: "insert" | "search" | "delete" | "traversal";
  data_structure: "bst" | "avl" | "max-heap";
  traversal_type?: "inorder" | "preorder" | "postorder" | "levelorder" | undefined;
  value?: number | undefined;
  found?: boolean | undefined;
}

/** Graph-specific operations */
export interface GraphOperationPayload {
  algorithm: string;
  node_count: number;
  edge_count: number;
}

/** Page view for SPA navigation */
export interface PageViewPayload {
  path: string;
  title?: string | undefined;
  referrer?: string | undefined;
}

/** UTM attribution */
export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

/** Consent banner interaction */
export interface ConsentInteractionPayload {
  action: "accept_all" | "reject_all" | "save_preferences";
  analytics_enabled: boolean;
  marketing_enabled: boolean;
}

/** Sponsorship support events */
export interface SupportModalPayload {
  source: "sidebar" | "banner";
}

export interface SupportLinkClickPayload {
  platform: "kofi" | "bmc" | "github";
  source: "sidebar" | "banner";
}

export interface SupportBannerPayload {
  completion_count: number;
}

// =============================================================================
// Event Name Constants
// =============================================================================

export const ANALYTICS_EVENTS = {
  // Algorithm & Mode
  ALGORITHM_SELECTED: "select_algorithm",
  MODE_CHANGED: "change_mode",

  // Simulation
  SIMULATION_START: "simulation_start",
  SIMULATION_COMPLETE: "simulation_complete",
  SIMULATION_RESET: "simulation_reset",

  // Controls
  SPEED_CHANGE: "speed_change",
  ARRAY_SIZE_CHANGE: "array_size_change",

  // Pathfinding specific
  GRID_INTERACTION: "grid_interaction",
  MAZE_GENERATED: "maze_generated",
  HEURISTIC_CHANGE: "heuristic_change",

  // Tree specific
  TREE_OPERATION: "tree_operation",
  DATA_STRUCTURE_CHANGE: "data_structure_change",

  // Graph specific
  GRAPH_OPERATION: "graph_operation",

  // Learning engagement
  CODE_PANEL: "code_panel",
  COMPLEXITY_MODAL: "complexity_modal",

  // Navigation
  PAGE_VIEW: "page_view",

  // Consent
  CONSENT_INTERACTION: "consent_interaction",

  // Sponsorship
  SUPPORT_MODAL_OPEN: "support_modal_open",
  SUPPORT_LINK_CLICK: "support_link_click",
  SUPPORT_BANNER_IMPRESSION: "support_banner_impression",
  SUPPORT_BANNER_DISMISS: "support_banner_dismiss",
} as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

// =============================================================================
// Unified Event Type (Discriminated Union)
// =============================================================================

export type AnalyticsEvent =
  | { name: typeof ANALYTICS_EVENTS.ALGORITHM_SELECTED; payload: AlgorithmSelectedPayload }
  | { name: typeof ANALYTICS_EVENTS.MODE_CHANGED; payload: { mode: string; previous_mode: string } }
  | { name: typeof ANALYTICS_EVENTS.SIMULATION_START; payload: SimulationStartPayload }
  | { name: typeof ANALYTICS_EVENTS.SIMULATION_COMPLETE; payload: SimulationCompletePayload }
  | { name: typeof ANALYTICS_EVENTS.SIMULATION_RESET; payload: { mode: string } }
  | { name: typeof ANALYTICS_EVENTS.SPEED_CHANGE; payload: SpeedChangePayload }
  | { name: typeof ANALYTICS_EVENTS.ARRAY_SIZE_CHANGE; payload: ArraySizeChangePayload }
  | { name: typeof ANALYTICS_EVENTS.GRID_INTERACTION; payload: GridInteractionPayload }
  | { name: typeof ANALYTICS_EVENTS.MAZE_GENERATED; payload: MazeGeneratedPayload }
  | { name: typeof ANALYTICS_EVENTS.HEURISTIC_CHANGE; payload: { heuristic: string } }
  | { name: typeof ANALYTICS_EVENTS.TREE_OPERATION; payload: TreeOperationPayload }
  | {
      name: typeof ANALYTICS_EVENTS.DATA_STRUCTURE_CHANGE;
      payload: { data_structure: string; previous: string };
    }
  | { name: typeof ANALYTICS_EVENTS.GRAPH_OPERATION; payload: GraphOperationPayload }
  | { name: typeof ANALYTICS_EVENTS.CODE_PANEL; payload: CodePanelPayload }
  | { name: typeof ANALYTICS_EVENTS.COMPLEXITY_MODAL; payload: ComplexityModalPayload }
  | { name: typeof ANALYTICS_EVENTS.PAGE_VIEW; payload: PageViewPayload }
  | { name: typeof ANALYTICS_EVENTS.CONSENT_INTERACTION; payload: ConsentInteractionPayload }
  | { name: typeof ANALYTICS_EVENTS.SUPPORT_MODAL_OPEN; payload: SupportModalPayload }
  | { name: typeof ANALYTICS_EVENTS.SUPPORT_LINK_CLICK; payload: SupportLinkClickPayload }
  | { name: typeof ANALYTICS_EVENTS.SUPPORT_BANNER_IMPRESSION; payload: SupportBannerPayload }
  | { name: typeof ANALYTICS_EVENTS.SUPPORT_BANNER_DISMISS; payload: SupportBannerPayload };

// =============================================================================
// Provider Interface (Vendor Abstraction)
// =============================================================================

/**
 * Interface that any analytics provider must implement.
 * This allows swapping GA4 for Mixpanel, Amplitude, etc.
 */
export interface AnalyticsProvider {
  /** Initialize the provider (called once on app start) */
  init(): void;

  /** Track a custom event */
  trackEvent(event: AnalyticsEvent): void;

  /** Track a page view */
  trackPageView(payload: PageViewPayload): void;

  /** Update user properties (optional) */
  setUserProperties?(properties: Record<string, unknown>): void;

  /** Identify user (optional, for authenticated users) */
  identify?(userId: string, traits?: Record<string, unknown>): void;
}
