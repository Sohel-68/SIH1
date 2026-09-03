export type SupportedLanguage = "en" | "hi" | "mr";
export type MeasurementUnit = "METRIC" | "IMPERIAL" | "TRADITIONAL_INDIAN";

export interface I18nDictionary {
  appName: string;
  commandCenter: string;
  gisMap: string;
  digitalTwin: string;
  properties: string;
  surveys: string;
  ulpin: string;
  aiIntelligence: string;
  administration: string;
  settings: string;
  searchPlaceholder: string;
  activeContext: string;
  language: string;
  theme: string;
  measurementUnits: string;
}

export const I18N_TRANSLATIONS: Record<SupportedLanguage, I18nDictionary> = {
  en: {
    appName: "GeoStrata National 3D ULPIN Platform",
    commandCenter: "Command Center",
    gisMap: "2D GIS Engine",
    digitalTwin: "3D Digital Twin",
    properties: "Property Registry",
    surveys: "Survey Operations",
    ulpin: "ULPIN Engine",
    aiIntelligence: "AI Intelligence",
    administration: "Administration",
    settings: "System Settings",
    searchPlaceholder: "Search ULPIN, parcels, deeds, coordinates...",
    activeContext: "Active Cadastral Context",
    language: "Language",
    theme: "Appearance Theme",
    measurementUnits: "Measurement Units",
  },
  hi: {
    appName: "जियोस्ट्रेटा राष्ट्रीय 3D यूएलपीआईएन प्लेटफॉर्म",
    commandCenter: "कमांड सेंटर",
    gisMap: "2D जीआईएस मानचित्र",
    digitalTwin: "3D डिजिटल ट्विन",
    properties: "संपत्ति रजिस्ट्री",
    surveys: "सर्वेक्षण संचालन",
    ulpin: "भू-आधार यूएलपीआईएन",
    aiIntelligence: "एआई इंटेलिजेंस",
    administration: "ई-ऑफिस प्रशासन",
    settings: "सिस्टम सेटिंग्स",
    searchPlaceholder: "यूएलपीआईएन, भूखंड, विलेख खोजें...",
    activeContext: "सक्रिय भूकर संदर्भ",
    language: "भाषा",
    theme: "थीम",
    measurementUnits: "माप इकाइयाँ",
  },
  mr: {
    appName: "जिओस्ट्रॅटा राष्ट्रीय 3D युएलपीआयएन व्यासपीठ",
    commandCenter: "कमांड केंद्र",
    gisMap: "2D जीआयएस नकाशा",
    digitalTwin: "3D डिजिटल ट्विन",
    properties: "जमीन महसूल नोंदवही",
    surveys: "भूकर सर्वेक्षण",
    ulpin: "भू-आधार युएलपीआयएन",
    aiIntelligence: "एआय बुद्धिमत्ता",
    administration: "प्रशासकीय ई-ऑफिस",
    settings: "प्रणाली सेटिंग्ज",
    searchPlaceholder: "युएलपीआयएन, भूखंड, फेरफार शोधा...",
    activeContext: "सक्रिय भूकर संदर्भ",
    language: "भाषा",
    theme: "थीम",
    measurementUnits: "मोजमाप एकके",
  },
};
