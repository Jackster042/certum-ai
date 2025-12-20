"use client";

import { Badge } from "@/components/ui/badge";
import { isDemoMode } from "@/app/data/demoConfig";

interface UsageBadgeProps {
  used: number;
  limit: number;
  label: string;
}

export function UsageBadge({ used, limit, label }: UsageBadgeProps) {
  // Only show badge in demo mode
  if (!isDemoMode()) return null;

  const remaining = limit - used;
  const isNearLimit = remaining <= 1;
  const isAtLimit = remaining === 0;

  return (
    <Badge
      variant={isAtLimit ? "destructive" : isNearLimit ? "default" : "secondary"}
      className="font-normal"
    >
      {label}: {remaining}/{limit} remaining
    </Badge>
  );
}
