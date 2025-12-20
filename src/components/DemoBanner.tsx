"use client";

import { Info, X } from "lucide-react";
import { useState } from "react";
import { isDemoMode } from "@/app/data/demoConfig";

export function DemoBanner() {
  const [isVisible, setIsVisible] = useState(true);

  // Only show banner if demo mode is enabled
  if (!isDemoMode() || !isVisible) return null;

  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-3 py-3 text-sm sm:text-base">
          <Info className="w-5 h-5 flex-shrink-0" />
          <p className="text-center font-medium">
            <span className="font-bold">Portfolio Demo Mode:</span> Try all
            features with limited usage. This is a showcase project — no real
            billing or data storage.
          </p>
          <button
            onClick={() => setIsVisible(false)}
            className="flex-shrink-0 p-1 hover:bg-white/20 rounded transition-colors ml-2"
            aria-label="Close banner"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
