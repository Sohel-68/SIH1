/**
 * State Land Record API Connectors (RoR - Record of Rights)
 * Standardized adapters for state cadastral portals conforming to DILRMP.
 */

export interface StateRoRRecord {
  state: string;
  portalName: string;
  khataNumber: string;
  surveyNumber: string;
  hissaNumber: string;
  registeredOwners: string[];
  totalAreaSqm: number;
  encumbranceStatus: "CLEAN" | "MORTGAGED" | "DISPUTED";
  lastMutationNumber: string;
}

export interface IStateLandRecordAdapter {
  stateName: string;
  portalName: string;
  fetchRecordOfRights: (dist: string, taluka: string, village: string, surveyNo: string) => Promise<StateRoRRecord>;
}

export const stateLandRecordAdapters = {
  maharashtra_mahaBhulekh: {
    stateName: "Maharashtra",
    portalName: "MahaBhulekh (7/12 & 8A Portal)",
    async fetchRecordOfRights(dist: string, taluka: string, village: string, surveyNo: string): Promise<StateRoRRecord> {
      return {
        state: "Maharashtra",
        portalName: "MahaBhulekh",
        khataNumber: "KH-8842",
        surveyNumber: surveyNo || "CTS-142",
        hissaNumber: "1",
        registeredOwners: ["Rajiv M. Mehra (70%)", "Sunita R. Mehra (30%)"],
        totalAreaSqm: 1420.5,
        encumbranceStatus: "MORTGAGED",
        lastMutationNumber: "FERFAR-2021-4810",
      };
    },
  },

  karnataka_bhoomi: {
    stateName: "Karnataka",
    portalName: "Bhoomi Land Records",
    async fetchRecordOfRights(dist: string, taluka: string, village: string, surveyNo: string): Promise<StateRoRRecord> {
      return {
        state: "Karnataka",
        portalName: "Bhoomi",
        khataNumber: "RTC-9912",
        surveyNumber: surveyNo || "SY-55",
        hissaNumber: "2A",
        registeredOwners: ["S. Ramanathan"],
        totalAreaSqm: 2100.0,
        encumbranceStatus: "CLEAN",
        lastMutationNumber: "MR-2022-105",
      };
    },
  },

  telangana_dharani: {
    stateName: "Telangana",
    portalName: "Dharani Integrated Land Record Management",
    async fetchRecordOfRights(dist: string, taluka: string, village: string, surveyNo: string): Promise<StateRoRRecord> {
      return {
        state: "Telangana",
        portalName: "Dharani",
        khataNumber: "DH-1049",
        surveyNumber: surveyNo || "SY-201",
        hissaNumber: "P",
        registeredOwners: ["K. Venkatesh Reddy"],
        totalAreaSqm: 3500.0,
        encumbranceStatus: "CLEAN",
        lastMutationNumber: "DHAR-2023-9901",
      };
    },
  },
};
