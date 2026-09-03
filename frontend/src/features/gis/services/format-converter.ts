import type { FeatureCollection, Feature, Geometry } from "geojson";
import shp from "shpjs";

export const formatConverter = {
  /**
   * Parses uploaded file contents (GeoJSON, KML, GPX) into standardized GeoJSON FeatureCollection
   */
  parseInputToGeoJSON(fileContent: string, format: "GEOJSON" | "KML" | "GPX"): FeatureCollection {
    if (format === "GEOJSON") {
      return JSON.parse(fileContent);
    }

    if (format === "KML") {
      return this.parseKML(fileContent);
    }

    if (format === "GPX") {
      return this.parseGPX(fileContent);
    }

    throw new Error(`Unsupported import format: ${format}`);
  },

  /**
   * Parses Shapefile ZIP archive using shpjs into GeoJSON FeatureCollection
   */
  async parseShapefileZip(zipBuffer: ArrayBuffer): Promise<FeatureCollection> {
    try {
      const parsed = await shp(zipBuffer);
      if (Array.isArray(parsed)) {
        // Multi-layer shapefile
        const allFeatures: Feature[] = [];
        parsed.forEach((fc) => {
          if (fc.features) allFeatures.push(...fc.features);
        });
        return { type: "FeatureCollection", features: allFeatures };
      }
      return parsed as FeatureCollection;
    } catch (err: any) {
      throw new Error(`Shapefile ZIP parsing failed: ${err?.message || "Invalid or corrupt shapefile archive"}`);
    }
  },

  /**
   * Lightweight pure-TS KML parser extracting Polygon, LineString, and Point coordinates
   */
  parseKML(kmlText: string): FeatureCollection {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(kmlText, "text/xml");
    const features: Feature[] = [];

    // Extract Polygons
    const polygons = xmlDoc.getElementsByTagName("Polygon");
    for (let i = 0; i < polygons.length; i++) {
      const coordEl = polygons[i].getElementsByTagName("coordinates")[0];
      if (coordEl && coordEl.textContent) {
        const rawCoords = coordEl.textContent.trim().split(/\s+/);
        const ring: [number, number][] = rawCoords
          .map((c) => {
            const parts = c.split(",").map(Number);
            return [parts[0], parts[1]] as [number, number];
          })
          .filter((pt) => !isNaN(pt[0]) && !isNaN(pt[1]));

        if (ring.length >= 3) {
          features.push({
            type: "Feature",
            id: `kml-poly-${i + 1}`,
            properties: { source: "KML Import", name: `KML Polygon #${i + 1}` },
            geometry: {
              type: "Polygon",
              coordinates: [ring],
            },
          });
        }
      }
    }

    // Extract LineStrings
    const lines = xmlDoc.getElementsByTagName("LineString");
    for (let i = 0; i < lines.length; i++) {
      const coordEl = lines[i].getElementsByTagName("coordinates")[0];
      if (coordEl && coordEl.textContent) {
        const rawCoords = coordEl.textContent.trim().split(/\s+/);
        const lineCoords: [number, number][] = rawCoords
          .map((c) => {
            const parts = c.split(",").map(Number);
            return [parts[0], parts[1]] as [number, number];
          })
          .filter((pt) => !isNaN(pt[0]) && !isNaN(pt[1]));

        if (lineCoords.length >= 2) {
          features.push({
            type: "Feature",
            id: `kml-line-${i + 1}`,
            properties: { source: "KML Import", name: `KML LineString #${i + 1}` },
            geometry: {
              type: "LineString",
              coordinates: lineCoords,
            },
          });
        }
      }
    }

    // Extract Points
    const points = xmlDoc.getElementsByTagName("Point");
    for (let i = 0; i < points.length; i++) {
      const coordEl = points[i].getElementsByTagName("coordinates")[0];
      if (coordEl && coordEl.textContent) {
        const parts = coordEl.textContent.trim().split(",").map(Number);
        if (!isNaN(parts[0]) && !isNaN(parts[1])) {
          features.push({
            type: "Feature",
            id: `kml-pt-${i + 1}`,
            properties: { source: "KML Import", name: `KML Point #${i + 1}` },
            geometry: {
              type: "Point",
              coordinates: [parts[0], parts[1]],
            },
          });
        }
      }
    }

    return { type: "FeatureCollection", features };
  },

  /**
   * Pure-TS GPX parser extracting track points and waypoints
   */
  parseGPX(gpxText: string): FeatureCollection {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(gpxText, "text/xml");
    const features: Feature[] = [];

    const waypoints = xmlDoc.getElementsByTagName("wpt");
    for (let i = 0; i < waypoints.length; i++) {
      const lat = parseFloat(waypoints[i].getAttribute("lat") || "");
      const lon = parseFloat(waypoints[i].getAttribute("lon") || "");
      if (!isNaN(lat) && !isNaN(lon)) {
        features.push({
          type: "Feature",
          id: `gpx-wpt-${i + 1}`,
          properties: { source: "GPX Import", name: `Waypoint #${i + 1}` },
          geometry: { type: "Point", coordinates: [lon, lat] },
        });
      }
    }

    return { type: "FeatureCollection", features };
  },

  /**
   * Converts GeoJSON to Well-Known Text (WKT)
   */
  exportToWKT(geojson: FeatureCollection | Feature | Geometry): string {
    if ("type" in geojson && geojson.type === "FeatureCollection") {
      const collection = geojson as FeatureCollection;
      if (collection.features.length === 0) return "GEOMETRYCOLLECTION EMPTY";
      const wktParts = collection.features
        .map((f) => this.exportToWKT(f.geometry))
        .filter(Boolean);
      return `GEOMETRYCOLLECTION(${wktParts.join(", ")})`;
    }

    if ("type" in geojson && geojson.type === "Feature") {
      return this.exportToWKT((geojson as Feature).geometry);
    }

    const geom = geojson as Geometry;
    if (geom.type === "Point") {
      return `POINT(${geom.coordinates[0].toFixed(6)} ${geom.coordinates[1].toFixed(6)})`;
    }

    if (geom.type === "LineString") {
      const pts = (geom.coordinates as [number, number][])
        .map((p) => `${p[0].toFixed(6)} ${p[1].toFixed(6)}`)
        .join(", ");
      return `LINESTRING(${pts})`;
    }

    if (geom.type === "Polygon") {
      const rings = (geom.coordinates as [number, number][][])
        .map(
          (ring) =>
            "(" +
            ring.map((p) => `${p[0].toFixed(6)} ${p[1].toFixed(6)}`).join(", ") +
            ")"
        )
        .join(", ");
      return `POLYGON(${rings})`;
    }

    if (geom.type === "MultiPolygon") {
      const polys = (geom.coordinates as [number, number][][][])
        .map((poly) => {
          const rings = poly
            .map(
              (ring) =>
                "(" +
                ring.map((p) => `${p[0].toFixed(6)} ${p[1].toFixed(6)}`).join(", ") +
                ")"
            )
            .join(", ");
          return `(${rings})`;
        })
        .join(", ");
      return `MULTIPOLYGON(${polys})`;
    }

    return "GEOMETRYCOLLECTION EMPTY";
  },

  /**
   * Exports GeoJSON to standard OGC KML format
   */
  exportToKML(geojson: FeatureCollection): string {
    const placemarks = geojson.features.map((f, i) => {
      const name = (f.properties?.name as string) || (f.properties?.surveyNumber as string) || `Cadastral Parcel #${i + 1}`;
      if (f.geometry.type === "Polygon") {
        const coords = (f.geometry.coordinates[0] as [number, number][])
          .map((pt) => `${pt[0]},${pt[1]},0`)
          .join(" ");
        return `    <Placemark>
      <name>${name}</name>
      <Polygon>
        <outerBoundaryIs>
          <LinearRing>
            <coordinates>${coords}</coordinates>
          </LinearRing>
        </outerBoundaryIs>
      </Polygon>
    </Placemark>`;
      }
      if (f.geometry.type === "Point") {
        const pt = f.geometry.coordinates as [number, number];
        return `    <Placemark>
      <name>${name}</name>
      <Point>
        <coordinates>${pt[0]},${pt[1]},0</coordinates>
      </Point>
    </Placemark>`;
      }
      return "";
    });

    return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>GeoStrata Cadastral Export</name>
${placemarks.filter(Boolean).join("\n")}
  </Document>
</kml>`;
  },

  /**
   * Exports coordinates to CSV format
   */
  exportToCSV(geojson: FeatureCollection): string {
    const rows = [
      `"FeatureID","FeatureName","VertexIndex","Longitude","Latitude"`,
    ];

    geojson.features.forEach((f, fi) => {
      const name = (f.properties?.name as string) || (f.properties?.surveyNumber as string) || `Feature #${fi + 1}`;
      if (f.geometry.type === "Polygon") {
        (f.geometry.coordinates[0] as [number, number][]).forEach((pt, vi) => {
          rows.push(`"${f.id || fi + 1}","${name}",${vi + 1},${pt[0]},${pt[1]}`);
        });
      } else if (f.geometry.type === "Point") {
        const pt = f.geometry.coordinates as [number, number];
        rows.push(`"${f.id || fi + 1}","${name}",1,${pt[0]},${pt[1]}`);
      }
    });

    return rows.join("\n");
  },
};
