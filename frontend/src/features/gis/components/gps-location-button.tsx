"use client";

import * as React from "react";
import { useGISStore } from "../stores/use-gis-store";
import { Crosshair, Loader2 } from "lucide-react";

export function GPSLocationButton() {
  const { setCenter, setZoom, setUserLocation } = useGISStore();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLoading(false);
        const lng = pos.coords.longitude;
        const lat = pos.coords.latitude;
        const accuracy = pos.coords.accuracy;

        setUserLocation([lng, lat], accuracy);
        setCenter([lng, lat]);
        setZoom(17);
      },
      (err) => {
        setIsLoading(false);
        console.warn("Geolocation warning:", err.message);
        // Fallback to Mumbai Versova
        setCenter([72.8285, 19.1382]);
        setZoom(16.5);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <button
      onClick={handleGetLocation}
      disabled={isLoading}
      className="p-2 rounded-xl border border-border/80 bg-card/90 hover:bg-muted text-foreground shadow-lg backdrop-blur-md transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
      title="Zoom to My Current GPS Location"
      aria-label="Zoom to My Current GPS Location"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin text-gov-primary" />
      ) : (
        <Crosshair className="h-4 w-4 text-gov-primary" />
      )}
    </button>
  );
}
