export type RealBasemapId =
  | "osm"
  | "satellite"
  | "light"
  | "dark"
  | "topo"
  | "hybrid";

export interface BasemapProvider {
  id: RealBasemapId;
  name: string;
  description: string;
  thumbnail: string;
  tiles: string[];
  maxZoom: number;
  attribution: string;
  overlayTiles?: string[]; // for hybrid labels overlay
}

export const BASEMAP_PROVIDERS: Record<RealBasemapId, BasemapProvider> = {
  osm: {
    id: "osm",
    name: "OpenStreetMap",
    description: "Standard sovereign street and cadastral basemap",
    thumbnail: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=200&auto=format&fit=crop&q=60",
    tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
    maxZoom: 19,
    attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors",
  },
  satellite: {
    id: "satellite",
    name: "Esri Satellite",
    description: "High-resolution global orthomosaic satellite imagery",
    thumbnail: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=200&auto=format&fit=crop&q=60",
    tiles: [
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    ],
    maxZoom: 19,
    attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
  },
  light: {
    id: "light",
    name: "Carto Light",
    description: "High-contrast clean light theme for cadastral survey maps",
    thumbnail: "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=200&auto=format&fit=crop&q=60",
    tiles: ["https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png"],
    maxZoom: 20,
    attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a>, &copy; <a href='https://carto.com/attributions'>CARTO</a>",
  },
  dark: {
    id: "dark",
    name: "Carto Dark",
    description: "Low-light dark mode for nighttime GIS operations",
    thumbnail: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=200&auto=format&fit=crop&q=60",
    tiles: ["https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png"],
    maxZoom: 20,
    attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a>, &copy; <a href='https://carto.com/attributions'>CARTO</a>",
  },
  topo: {
    id: "topo",
    name: "OpenTopoMap",
    description: "Topographic contours, hillshading, and elevation lines",
    thumbnail: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=200&auto=format&fit=crop&q=60",
    tiles: ["https://a.tile.opentopomap.org/{z}/{x}/{y}.png"],
    maxZoom: 17,
    attribution: "Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap (CC-BY-SA)",
  },
  hybrid: {
    id: "hybrid",
    name: "Hybrid Satellite",
    description: "Satellite imagery with administrative street & village labels overlay",
    thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=200&auto=format&fit=crop&q=60",
    tiles: [
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    ],
    overlayTiles: [
      "https://basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}@2x.png",
    ],
    maxZoom: 19,
    attribution: "Esri Satellite with CARTO Street Labels",
  },
};
