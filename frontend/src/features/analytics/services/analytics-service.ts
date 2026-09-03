import type { JurisdictionScope, KPICardItem } from "../types/analytics-types";
import { NATIONAL_KPIS } from "../constants/national-kpis";
import { STATE_CADASTRAL_DATA } from "../constants/state-cadastral-stats";

export const analyticsService = {
  getKPIsForScope(scope: JurisdictionScope): KPICardItem[] {
    return NATIONAL_KPIS[scope] || NATIONAL_KPIS.NATIONAL;
  },

  getStateRecords() {
    return STATE_CADASTRAL_DATA;
  },
};
