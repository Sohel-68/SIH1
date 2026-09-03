import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { PROPERTY_LIFECYCLE } from "../constants/lifecycle";
import type { PropertyLifecycleState } from "../types/intelligence-types";

export interface LifecycleBadgeProps {
  state: PropertyLifecycleState;
  className?: string;
}

export function LifecycleBadge({ state, className }: LifecycleBadgeProps) {
  const meta = PROPERTY_LIFECYCLE[state] || PROPERTY_LIFECYCLE.VACANT_LAND;

  return (
    <Badge variant={meta.badgeVariant} size="sm" dot className={className}>
      <span>{meta.title}</span>
    </Badge>
  );
}
