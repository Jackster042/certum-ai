import { JobInfoBackLink } from "@/features/jobInfos/components/JobInfoBackLink";
import { canRunResumeAnalysis } from "@/features/resumeAnalyses/permissions";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ResumePageClient } from "./_client";

export default async function ResumePage({
  params,
}: {
  params: Promise<{ jobInfoId: string }>;
}) {
  const { jobInfoId } = await params;

  return (
    <div className="flex flex-col items-start container py-8 space-y-6">
      <JobInfoBackLink jobInfoId={jobInfoId} />

      <div className="w-full">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-copper mb-2">
          Analysis
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
          Resume Review
        </h1>
        <div className="w-12 h-0.5 bg-copper mt-4 mb-8" />
      </div>

      <Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center w-full py-16">
            <div className="dot-loader">
              <span />
              <span />
              <span />
            </div>
          </div>
        }
      >
        <SuspendedComponent jobInfoId={jobInfoId} />
      </Suspense>
    </div>
  );
}

async function SuspendedComponent({ jobInfoId }: { jobInfoId: string }) {
  if (!(await canRunResumeAnalysis())) return redirect("/app/upgrade");
  return <ResumePageClient jobInfoId={jobInfoId} />;
}
