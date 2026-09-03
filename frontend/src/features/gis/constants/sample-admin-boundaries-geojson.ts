import type { FeatureCollection, Polygon } from "geojson";

export interface AdministrativeUnit {
  id: string;
  name: string;
  level: "STATE" | "DISTRICT" | "TALUKA" | "VILLAGE" | "WARD";
  code: string;
  parentName?: string;
  centroid: [number, number];
  zoom: number;
}

export const ADMIN_HIERARCHY_TREE: AdministrativeUnit[] = [
  {
    id: "admin-state-mh",
    name: "Maharashtra",
    level: "STATE",
    code: "27",
    centroid: [75.7139, 19.7515],
    zoom: 7,
  },
  {
    id: "admin-dist-mumbai-sub",
    name: "Mumbai Suburban",
    level: "DISTRICT",
    code: "27518",
    parentName: "Maharashtra",
    centroid: [72.8500, 19.1200],
    zoom: 11,
  },
  {
    id: "admin-tal-andheri",
    name: "Andheri Taluka",
    level: "TALUKA",
    code: "27518001",
    parentName: "Mumbai Suburban",
    centroid: [72.8400, 19.1250],
    zoom: 13,
  },
  {
    id: "admin-vil-versova",
    name: "Versova Revenue Village",
    level: "VILLAGE",
    code: "275180010042",
    parentName: "Andheri Taluka",
    centroid: [72.8285, 19.1382],
    zoom: 16,
  },
  {
    id: "admin-ward-k-west",
    name: "K-West Municipal Ward",
    level: "WARD",
    code: "KW-01",
    parentName: "MCGM",
    centroid: [72.8350, 19.1320],
    zoom: 14.5,
  },
];

export const ADMIN_BOUNDARIES_GEOJSON: FeatureCollection<Polygon> = {
  type: "FeatureCollection",
  features: [
    // 1. Versova Revenue Village Boundary
    {
      type: "Feature",
      id: "admin-vil-versova",
      properties: {
        id: "admin-vil-versova",
        name: "Versova Revenue Village",
        level: "VILLAGE",
        code: "275180010042",
        areaSqKm: 4.82,
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [72.8220, 19.1330],
            [72.8350, 19.1330],
            [72.8350, 19.1440],
            [72.8220, 19.1440],
            [72.8220, 19.1330],
          ],
        ],
      },
    },

    // 2. K-West Ward Boundary
    {
      type: "Feature",
      id: "admin-ward-k-west",
      properties: {
        id: "admin-ward-k-west",
        name: "K-West Municipal Ward",
        level: "WARD",
        code: "KW-01",
        areaSqKm: 23.4,
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [72.8150, 19.1150],
            [72.8550, 19.1150],
            [72.8550, 19.1550],
            [72.8150, 19.1550],
            [72.8150, 19.1150],
          ],
        ],
      },
    },
  ],
};
