import React from "react";

export function Footer() {
  return (
    <footer className="border-t bg-background/50 py-6 text-center text-xs text-muted-foreground">
      <div className="container px-4">
        <p>
          GeoStrata — National 3D ULPIN & Vertical Property Mapping Platform.
        </p>
        <p className="mt-1 text-[11px]">
          Conforming to ISO 19152 LADM 3D Cadastre Standards & Survey of India Geodetic Datum.
        </p>
      </div>
    </footer>
  );
}
