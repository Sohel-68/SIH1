"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

const routeTitleMap: Record<string, string> = {
  gis: "GIS Mapping",
  "viewer-3d": "3D Digital Twin",
  properties: "Properties",
  survey: "Field Survey",
  ulpin: "3D ULPIN Engine",
  documents: "Documents",
  analytics: "Volumetric Analytics",
  reports: "Reports",
  notifications: "Notifications",
  settings: "Settings",
  admin: "Administration",
};

export function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-1.5 text-xs text-muted-foreground">
      <Link
        href="/"
        className="flex items-center hover:text-foreground transition-colors p-1 rounded hover:bg-muted/50"
      >
        <Home className="h-3.5 w-3.5" />
      </Link>

      {segments.map((segment, index) => {
        const href = `/${segments.slice(0, index + 1).join("/")}`;
        const isLast = index === segments.length - 1;
        const title = routeTitleMap[segment] || segment.replace(/-/g, " ");

        return (
          <React.Fragment key={href}>
            <ChevronRight className="h-3 w-3 text-muted-foreground/60 shrink-0" />
            {isLast ? (
              <span className="font-semibold text-foreground capitalize truncate max-w-[140px] sm:max-w-none">
                {title}
              </span>
            ) : (
              <Link
                href={href}
                className="hover:text-foreground transition-colors capitalize truncate max-w-[100px] sm:max-w-none"
              >
                {title}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
