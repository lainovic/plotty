/**
 * Z-index constants for managing component layering
 * Lower numbers = closer to the map
 * Higher numbers = closer to the user
 */
export const Z_INDEX = {
  // Base layers
  MAP: 0,
  MAP_CONTROLS: 100,
  TILE_PROVIDER: 999,

  // UI Components
  LAYER_PANEL: 1000,
  ZOOM_TEXT: 1001,
  RULER_PANEL: 1001,

  // Overlays
  OVERLAY: 1002,
  RULER_OVERLAY: 1002,

  // Modals and popups
  HELP_POPUP: 2000,

  // Toasts and notifications (highest)
  TOAST: 9999,
} as const;
