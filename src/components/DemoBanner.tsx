"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { isDemoMode } from "@/app/data/demoConfig";

export function DemoBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isDemoMode() || !isVisible) return null;

  return (
    <div className="relative bg-foreground text-background border-b border-copper/20">
      <div className="container mx-auto">
        <div className="flex items-center justify-center gap-4 py-2.5">
          <div className="w-1.5 h-1.5 rounded-full bg-copper animate-copper-pulse shrink-0" />
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-center">
            <span className="text-copper font-medium">Portfolio Demo</span>
            <span className="text-background/50 mx-2">&middot;</span>
            <span className="text-background/60">
              All features available with limited usage. No billing or permanent storage.
            </span>
          </p>
          <button
            onClick={() => setIsVisible(false)}
            className="shrink-0 p-1 hover:text-copper transition-colors"
            aria-label="Close banner"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
