import type { Feature, FeatureCollection } from "geojson";

export const importExportService = {
  /**
   * Export GeoJSON FeatureCollection as a downloadable file
   */
  downloadGeoJSON(features: Feature[], filename = "geostrata_cadastre.geojson"): void {
    const featureCollection: FeatureCollection = {
      type: "FeatureCollection",
      features,
    };

    const blob = new Blob([JSON.stringify(featureCollection, null, 2)], {
      type: "application/geo+json",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  /**
   * Export GeoJSON FeatureCollection as OGC KML file (Google Earth / QGIS compatible)
   */
  downloadKML(features: Feature[], filename = "geostrata_cadastre.kml"): void {
    let kmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>GeoStrata Cadastral Export</name>
    <description>National 3D ULPIN Cadastral Layers</description>
`;

    features.forEach((feature, idx) => {
      const name = (feature.properties?.ulpin || feature.properties?.name || `Feature_${idx + 1}`) as string;
      const desc = feature.properties ? JSON.stringify(feature.properties) : "";

      if (feature.geometry.type === "Polygon") {
        const ring = feature.geometry.coordinates[0];
        const coordString = ring.map((c) => `${c[0]},${c[1]},0`).join(" ");

        kmlContent += `    <Placemark>
      <name>${name}</name>
      <description><![CDATA[${desc}]]></description>
      <Polygon>
        <outerBoundaryIs>
          <LinearRing>
            <coordinates>${coordString}</coordinates>
          </LinearRing>
        </outerBoundaryIs>
      </Polygon>
    </Placemark>\n`;
      } else if (feature.geometry.type === "Point") {
        const coord = feature.geometry.coordinates;
        kmlContent += `    <Placemark>
      <name>${name}</name>
      <Point>
        <coordinates>${coord[0]},${coord[1]},0</coordinates>
      </Point>
    </Placemark>\n`;
      } else if (feature.geometry.type === "LineString") {
        const coordString = feature.geometry.coordinates.map((c) => `${c[0]},${c[1]},0`).join(" ");
        kmlContent += `    <Placemark>
      <name>${name}</name>
      <LineString>
        <coordinates>${coordString}</coordinates>
      </LineString>
    </Placemark>\n`;
      }
    });

    kmlContent += `  </Document>
</kml>`;

    const blob = new Blob([kmlContent], { type: "application/vnd.google-earth.kml+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  /**
   * Parse and validate imported GeoJSON text
   */
  parseGeoJSON(content: string): { success: boolean; features: Feature[]; error?: string } {
    try {
      const parsed = JSON.parse(content);
      if (parsed.type === "FeatureCollection" && Array.isArray(parsed.features)) {
        return { success: true, features: parsed.features };
      }
      if (parsed.type === "Feature") {
        return { success: true, features: [parsed] };
      }
      if (parsed.type === "Polygon" || parsed.type === "LineString" || parsed.type === "Point") {
        return {
          success: true,
          features: [{ type: "Feature", properties: {}, geometry: parsed }],
        };
      }
      return { success: false, features: [], error: "Invalid GeoJSON structure." };
    } catch (err: any) {
      return { success: false, features: [], error: err.message || "Invalid JSON syntax." };
    }
  },

  /**
   * Parse basic KML coordinates to GeoJSON Features
   */
  parseKML(content: string): { success: boolean; features: Feature[]; error?: string } {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(content, "text/xml");
      const placemarks = xmlDoc.getElementsByTagName("Placemark");
      const features: Feature[] = [];

      for (let i = 0; i < placemarks.length; i++) {
        const placemark = placemarks[i];
        const name = placemark.getElementsByTagName("name")[0]?.textContent || `KML_Feature_${i + 1}`;
        const polygonNode = placemark.getElementsByTagName("Polygon")[0];
        const lineNode = placemark.getElementsByTagName("LineString")[0];
        const pointNode = placemark.getElementsByTagName("Point")[0];

        if (polygonNode) {
          const coordText = polygonNode.getElementsByTagName("coordinates")[0]?.textContent?.trim();
          if (coordText) {
            const rawPoints = coordText.split(/\s+/);
            const coords = rawPoints.map((p) => {
              const parts = p.split(",").map(Number);
              return [parts[0], parts[1]];
            });
            features.push({
              type: "Feature",
              properties: { name, imported: true },
              geometry: { type: "Polygon", coordinates: [coords] },
            });
          }
        } else if (pointNode) {
          const coordText = pointNode.getElementsByTagName("coordinates")[0]?.textContent?.trim();
          if (coordText) {
            const parts = coordText.split(",").map(Number);
            features.push({
              type: "Feature",
              properties: { name, imported: true },
              geometry: { type: "Point", coordinates: [parts[0], parts[1]] },
            });
          }
        }
      }

      if (features.length === 0) {
        return { success: false, features: [], error: "No Placemarks or coordinate nodes found in KML." };
      }

      return { success: true, features };
    } catch (err: any) {
      return { success: false, features: [], error: err.message || "Failed to parse KML document." };
    }
  },
};
