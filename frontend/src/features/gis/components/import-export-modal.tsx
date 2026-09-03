"use client";

import * as React from "react";
import bbox from "@turf/bbox";
import { useGISStore } from "../stores/use-gis-store";
import { useSelectionStore } from "../stores/use-selection-store";
import { useDrawingStore } from "../stores/use-drawing-store";
import { formatConverter } from "../services/format-converter";
import { Dialog } from "@/components/ui/dialog";
import { Tabs } from "@/components/ui/tabs";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Download, Upload, FileCode, Table, Archive, Code2, Check, Navigation } from "lucide-react";

export function ImportExportModal() {
  const { isImportExportModalOpen, setImportExportModalOpen, setCenter, setZoom } = useGISStore();
  const { parcels } = useSelectionStore();
  const { drawnFeatures, addFeature } = useDrawingStore();

  const [activeTab, setActiveTab] = React.useState("export");
  const [importStatus, setImportStatus] = React.useState<{ success?: boolean; message?: string } | null>(null);
  const [copiedWKT, setCopiedWKT] = React.useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const getCombinedFeatureCollection = () => ({
    type: "FeatureCollection" as const,
    features: [...parcels.map((p) => p.geometry as any), ...drawnFeatures],
  });

  // Export handlers
  const handleExportGeoJSON = () => {
    const data = getCombinedFeatureCollection();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/geo+json" });
    downloadBlob(blob, `geostrata_cadastre_export_${Date.now()}.geojson`);
  };

  const handleExportKML = () => {
    const data = getCombinedFeatureCollection();
    const kml = formatConverter.exportToKML(data);
    const blob = new Blob([kml], { type: "application/vnd.google-earth.kml+xml" });
    downloadBlob(blob, `geostrata_cadastre_export_${Date.now()}.kml`);
  };

  const handleExportCSV = () => {
    const data = getCombinedFeatureCollection();
    const csv = formatConverter.exportToCSV(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    downloadBlob(blob, `geostrata_cadastral_coordinates_${Date.now()}.csv`);
  };

  const handleExportWKT = () => {
    const data = getCombinedFeatureCollection();
    const wkt = formatConverter.exportToWKT(data);
    navigator.clipboard.writeText(wkt);
    setCopiedWKT(true);
    setTimeout(() => setCopiedWKT(false), 2000);
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import handler supporting GeoJSON, KML, GPX, and Shapefile ZIP
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      let parsedGeoJSON: any = null;

      if (file.name.endsWith(".zip")) {
        // Shapefile ZIP parsing via shpjs
        const arrayBuffer = await file.arrayBuffer();
        parsedGeoJSON = await formatConverter.parseShapefileZip(arrayBuffer);
      } else {
        const text = await file.text();
        let format: "GEOJSON" | "KML" | "GPX" = "GEOJSON";
        if (file.name.endsWith(".kml")) format = "KML";
        else if (file.name.endsWith(".gpx")) format = "GPX";

        parsedGeoJSON = formatConverter.parseInputToGeoJSON(text, format);
      }

      if (parsedGeoJSON && parsedGeoJSON.features && parsedGeoJSON.features.length > 0) {
        // Ingest into drawing layer
        parsedGeoJSON.features.forEach((feat: any) => {
          if (feat.geometry) addFeature(feat);
        });

        // Compute BBox and zoom to imported geometry
        const [minX, minY, maxX, maxY] = bbox(parsedGeoJSON);
        const centerLng = (minX + maxX) / 2;
        const centerLat = (minY + maxY) / 2;

        setCenter([centerLng, centerLat]);
        setZoom(16);

        setImportStatus({
          success: true,
          message: `Successfully ingested ${parsedGeoJSON.features.length} vector features from ${file.name}. Auto-zoomed map to extent.`,
        });
      } else {
        setImportStatus({ success: false, message: `No valid vector geometries found in ${file.name}.` });
      }
    } catch (err: any) {
      setImportStatus({ success: false, message: err.message || "Failed to parse spatial file." });
    }
  };

  return (
    <Dialog
      isOpen={isImportExportModalOpen}
      onClose={() => {
        setImportExportModalOpen(false);
        setImportStatus(null);
      }}
      maxWidth="md"
      title="Spatial Data Interchange"
      description="Export active cadastre layers or ingest external spatial survey datasets (GeoJSON, KML, GPX, Shapefile ZIP)."
    >
      <div className="space-y-4 pt-2 select-none">
        <Tabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          variant="pills"
          tabs={[
            { id: "export", label: "Export Geometries", icon: <Download className="h-3.5 w-3.5" /> },
            { id: "import", label: "Import Spatial File", icon: <Upload className="h-3.5 w-3.5" /> },
          ]}
        />

        {/* EXPORT TAB */}
        {activeTab === "export" && (
          <div className="space-y-4">
            <div className="p-3 rounded-lg border border-border bg-muted/20 text-xs">
              <span className="font-bold text-foreground block">Available Features for Export:</span>
              <p className="text-muted-foreground text-[11px]">
                Total: <strong>{parcels.length}</strong> official cadastral parcels +{" "}
                <strong>{drawnFeatures.length}</strong> user survey features.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                type="button"
                onClick={handleExportGeoJSON}
                className="p-3 rounded-xl border border-border bg-card hover:border-primary/50 hover:bg-muted/30 transition-all text-left space-y-1.5 group"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gov-primary/10 text-gov-primary group-hover:bg-gov-primary group-hover:text-white transition-colors">
                  <FileCode className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">GeoJSON</h4>
                  <p className="text-[10px] text-muted-foreground">RFC 7946 PostGIS</p>
                </div>
              </button>

              <button
                type="button"
                onClick={handleExportKML}
                className="p-3 rounded-xl border border-border bg-card hover:border-primary/50 hover:bg-muted/30 transition-all text-left space-y-1.5 group"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gov-accent/10 text-gov-accent group-hover:bg-gov-accent group-hover:text-slate-950 transition-colors">
                  <FileCode className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">KML 2.2</h4>
                  <p className="text-[10px] text-muted-foreground">Google Earth / QGIS</p>
                </div>
              </button>

              <button
                type="button"
                onClick={handleExportCSV}
                className="p-3 rounded-xl border border-border bg-card hover:border-primary/50 hover:bg-muted/30 transition-all text-left space-y-1.5 group"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                  <Table className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">CSV Coords</h4>
                  <p className="text-[10px] text-muted-foreground">Tabular Points</p>
                </div>
              </button>

              <button
                type="button"
                onClick={handleExportWKT}
                className="p-3 rounded-xl border border-border bg-card hover:border-primary/50 hover:bg-muted/30 transition-all text-left space-y-1.5 group"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                  {copiedWKT ? <Check className="h-4 w-4 text-gov-success" /> : <Code2 className="h-4 w-4" />}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">{copiedWKT ? "Copied!" : "OGC WKT"}</h4>
                  <p className="text-[10px] text-muted-foreground">Copy Geometry Text</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* IMPORT TAB */}
        {activeTab === "import" && (
          <div className="space-y-4 text-xs">
            {importStatus && (
              <Alert variant={importStatus.success ? "success" : "error"}>
                {importStatus.message}
              </Alert>
            )}

            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex min-h-[160px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-border hover:border-primary/60 bg-muted/10 p-6 text-center cursor-pointer transition-colors"
            >
              <div className="flex items-center space-x-2 text-gov-primary mb-2">
                <Upload className="h-6 w-6" />
                <Archive className="h-6 w-6 text-gov-accent" />
              </div>
              <h4 className="font-bold text-foreground">Select Spatial Dataset or Shapefile ZIP</h4>
              <p className="text-[11px] text-muted-foreground mt-1 max-w-sm">
                Click to browse or drop <strong>.geojson</strong>, <strong>.kml</strong>,{" "}
                <strong>.gpx</strong>, or ESRI <strong>Shapefile (.zip)</strong> archives.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".geojson,.json,.kml,.gpx,.zip"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
}
