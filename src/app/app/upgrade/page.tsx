import { BackLink } from "@/components/BackLink";
import { PricingTable } from "@/services/clerk/components/PricingTable";
import { AlertTriangle } from "lucide-react";

export default function UpgradePage() {
  return (
    <div className="container max-w-5xl py-8">
      <div className="mb-8">
        <BackLink href="/app">Dashboard</BackLink>
      </div>

      <div className="space-y-12">
        {/* Alert - editorial style with left border */}
        <div className="border-l-4 border-l-destructive bg-destructive/5 p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="size-4 text-destructive mt-0.5 shrink-0" />
            <div>
              <h2 className="font-serif text-lg font-semibold text-foreground mb-1">
                Plan Limit Reached
              </h2>
              <p className="font-sans text-sm text-muted-foreground">
                You have reached the limit of your current plan. Please upgrade
                to continue using all features.
              </p>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-copper mb-2">
            Upgrade
          </p>
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
            Choose your plan
          </h1>
          <div className="w-12 h-0.5 bg-copper mt-4 mb-8" />

          <div className="border border-border p-8 bg-card">
            <PricingTable />
          </div>
        </div>
      </div>
    </div>
  );
}
