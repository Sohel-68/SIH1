/**
 * Mapbox GL Initializer and configuration helper.
 */
export const MAPBOX_ACCESS_TOKEN =
  process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "pk.mock_token_for_development";

export const DEFAULT_MAP_CENTER: [number, number] = [78.9629, 20.5937]; // Geographic Center of India
export const DEFAULT_MAP_ZOOM = 4.8;
export const DEFAULT_MAP_PITCH = 45; // 3D perspective pitch
