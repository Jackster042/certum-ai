import { BackLink } from "@/components/BackLink";
import { Card, CardContent } from "@/components/ui/card";
import { JobInfoForm } from "@/features/jobInfos/components/JobInfoForm";

export default function JobInfoNewPage() {
  return (
    <div className="container py-8 space-y-6 max-w-4xl">
      <BackLink href="/app">Dashboard</BackLink>

      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-copper mb-2">
          New Brief
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
          Create a job description
        </h1>
        <div className="w-12 h-0.5 bg-copper mt-4" />
      </div>

      <Card>
        <CardContent>
          <JobInfoForm />
        </CardContent>
      </Card>
    </div>
  );
}
