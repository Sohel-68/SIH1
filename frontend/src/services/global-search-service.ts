export interface SearchResultItem {
  id: string;
  category:
    | "ULPIN"
    | "OWNER"
    | "SURVEY_NUMBER"
    | "VILLAGE"
    | "BUILDING"
    | "UNIT"
    | "CASE_FILE"
    | "MISSION"
    | "OFFICER"
    | "COORDINATES";
  title: string;
  subtitle: string;
  badgeText: string;
  targetHref: string;
  associatedUlpin?: string;
  coordinates?: [number, number];
}

export const GLOBAL_SEARCH_INDEX: SearchResultItem[] = [
  // 1. 3D Strata Unit
  {
    id: "sr-01",
    category: "UNIT",
    title: "Unit 502 (Floor 5, Tower A)",
    subtitle: "Palm Heights Complex &bull; 88.5 m² &bull; Rajiv & Sunita Mehra",
    badgeText: "3D Strata Unit",
    targetHref: "/viewer-3d",
    associatedUlpin: "27518001004201-B01-TA-F05-U502",
    coordinates: [72.8285, 19.1382],
  },
  // 2. Base Ground Cadastre
  {
    id: "sr-02",
    category: "ULPIN",
    title: "27518001004201 (CTS-142/1)",
    subtitle: "Versova, Mumbai Suburban &bull; 1,420 m² Ground Parcel",
    badgeText: "Bhu-Aadhaar ULPIN",
    targetHref: "/properties",
    associatedUlpin: "27518001004201",
    coordinates: [72.8285, 19.1382],
  },
  // 3. Registered Owner
  {
    id: "sr-03",
    category: "OWNER",
    title: "Rajiv M. Mehra & Sunita R. Mehra",
    subtitle: "Owner of CTS-142/1 &amp; Strata Unit 502 (Palm Heights)",
    badgeText: "Khatedar Owner",
    targetHref: "/properties",
    associatedUlpin: "27518001004201-B01-TA-F05-U502",
  },
  // 4. Building Tower
  {
    id: "sr-04",
    category: "BUILDING",
    title: "Palm Heights Complex (Tower A & Tower B)",
    subtitle: "18-Storey High-Rise &bull; 72 Strata Units Extruded",
    badgeText: "3D Digital Twin",
    targetHref: "/viewer-3d",
    associatedUlpin: "27518001004201",
    coordinates: [72.8285, 19.1382],
  },
  // 5. Cadastral Survey Number
  {
    id: "sr-05",
    category: "SURVEY_NUMBER",
    title: "CTS-144/A (Versova Link Road)",
    subtitle: "Active Encroachment &amp; Easement Contestation",
    badgeText: "CTS Survey No",
    targetHref: "/gis",
    associatedUlpin: "27518001004204",
    coordinates: [72.8278, 19.1378],
  },
  // 6. E-Office Revenue Case File
  {
    id: "sr-06",
    category: "CASE_FILE",
    title: "CASE-2024-MH-REV-0482",
    subtitle: "Form 6 Mutation Application &bull; Sub-Registrar Desk",
    badgeText: "Revenue Case",
    targetHref: "/admin",
    associatedUlpin: "27518001004201-B01-TA-F05-U502",
  },
  // 7. Field Survey Mission
  {
    id: "sr-07",
    category: "MISSION",
    title: "Mission SM-2024-MH-401",
    subtitle: "Cadastral Demarcation &bull; Vikram Deshmukh (Trimble R12i)",
    badgeText: "DGPS Mission",
    targetHref: "/survey",
    associatedUlpin: "27518001004201",
  },
  // 8. Survey Officer
  {
    id: "sr-08",
    category: "OFFICER",
    title: "Vikram Deshmukh (Cadastral Surveyor)",
    subtitle: "Mumbai Suburban District &bull; 142 Missions (1.4cm Avg Precision)",
    badgeText: "Survey Officer",
    targetHref: "/survey",
  },
  // 9. Revenue Village
  {
    id: "sr-09",
    category: "VILLAGE",
    title: "Versova (Village LGD Code: 518001)",
    subtitle: "Taluka: Andheri &bull; District: Mumbai Suburban (27)",
    badgeText: "Revenue Village",
    targetHref: "/gis",
  },
  // 10. Direct Geographic Coordinates
  {
    id: "sr-10",
    category: "COORDINATES",
    title: "19.1382° N, 72.8285° E",
    subtitle: "WGS84 Centroid &bull; Versova CTS-142/1 Location",
    badgeText: "Coordinates",
    targetHref: "/gis",
    coordinates: [72.8285, 19.1382],
  },
];

export const globalSearchService = {
  search(query: string): SearchResultItem[] {
    if (!query || !query.trim()) return [];
    const q = query.toLowerCase().trim();

    return GLOBAL_SEARCH_INDEX.filter((item) => {
      return (
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.badgeText.toLowerCase().includes(q) ||
        (item.associatedUlpin && item.associatedUlpin.toLowerCase().includes(q))
      );
    });
  },
};
