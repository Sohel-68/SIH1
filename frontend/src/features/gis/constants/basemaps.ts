import type { BasemapStyle } from "../types/gis-types";

export interface BasemapPreset {
  id: BasemapStyle;
  label: string;
  description: string;
  thumbnailColor: string;
  styleUrl?: string;
  isDark: boolean;
}

export const BASEMAP_PRESETS: Record<BasemapStyle, BasemapPreset> = {
  dark: {
    id: "dark",
    label: "Dark Canvas",
    description: "High-contrast dark cartographic canvas optimized for cadastre parcel visualization.",
    thumbnailColor: "#0f172a",
    isDark: true,
  },
  light: {
    id: "light",
    label: "Light Canvas",
    description: "Crisp light neutral backdrop for official administrative printing and inspection.",
    thumbnailColor: "#f8fafc",
    isDark: false,
  },
  satellite: {
    id: "satellite",
    label: "Satellite Imagery",
    description: "High-resolution multispectral aerial orthophoto for land cover and boundary alignment.",
    thumbnailColor: "#1e3a29",
    isDark: true,
  },
  terrain: {
    id: "terrain",
    label: "Topographic Terrain",
    description: "Digital elevation model with shaded relief and topographic contour benchmarks.",
    thumbnailColor: "#78716c",
    isDark: false,
  },
  street: {
    id: "street",
    label: "Street Network",
    description: "Standard road hierarchy, transit lines, and urban landmarks.",
    thumbnailColor: "#3b82f6",
    isDark: false,
  },
  hybrid: {
    id: "hybrid",
    label: "Satellite Hybrid",
    description: "Orthophoto imagery with overlaid cadastral survey roads and administrative borders.",
    thumbnailColor: "#0369a1",
    isDark: true,
  },
};
