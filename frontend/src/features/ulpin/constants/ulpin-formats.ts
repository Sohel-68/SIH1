/**
 * National ULPIN Format Standards
 * Department of Land Resources (DoLR), Ministry of Rural Development, Government of India.
 */

export const ULPIN_FORMATS = {
  // 14-digit standard Bhu-Aadhaar key format
  BASE_14_DIGIT: {
    name: "Standard 14-Digit Bhu-Aadhaar (DoLR)",
    length: 14,
    pattern: "^[0-9]{14}$",
    description: "State (2) + District (3) + Village (5) + Parcel Serial (4)",
  },

  // 3D Strata volumetric syntax
  STRATA_3D: {
    name: "Volumetric 3D Strata ULPIN (GeoStrata Standard)",
    pattern: "^[0-9]{14}-B[0-9]{2}-T[A-Z0-9]{2}-F[0-9]{2}-U[A-Z0-9]{3,4}$",
    description: "Base ULPIN (14) + Building (B01) + Tower (TA) + Floor (F05) + Unit (U502)",
  },

  // State Code registry sample
  STATE_CODES: {
    MAHARASHTRA: "27",
    DELHI: "07",
    KARNATAKA: "29",
    GUJARAT: "24",
    TELANGANA: "36",
    TAMIL_NADU: "33",
  },
};
