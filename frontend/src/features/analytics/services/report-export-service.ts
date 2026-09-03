import type { JurisdictionScope } from "../types/analytics-types";
import { NATIONAL_KPIS } from "../constants/national-kpis";
import { STATE_CADASTRAL_DATA } from "../constants/state-cadastral-stats";

export const reportExportService = {
  /**
   * Export National / State Executive KPI Report as CSV
   */
  exportKPIsToCSV(scope: JurisdictionScope): string {
    const kpis = NATIONAL_KPIS[scope];
    const lines = [
      `"GeoStrata National Cadastral Platform - Executive Briefing Report"`,
      `"Scope: ${scope} | Export Date: ${new Date().toLocaleDateString()}"`,
      `""`,
      `"Indicator ID","Metric Name","Value","Trend","Category"`,
      ...kpis.map((k) => `"${k.id}","${k.label}","${k.value}","${k.changeText || ""}","${k.category}"`),
      `""`,
      `"State Wise Cadastral Saturation"`,
      `"State Code","State Name","Total Parcels","Surveyed Parcels","ULPINs Generated","Coverage %","Active Disputes"`,
      ...STATE_CADASTRAL_DATA.map(
        (s) => `"${s.stateCode}","${s.stateName}",${s.totalParcels},${s.surveyedParcels},${s.ulpinGenerated},${s.coveragePercent}%,${s.activeDisputes}`
      ),
    ];

    return lines.join("\n");
  },
};
