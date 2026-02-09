import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/drizzle/db";
import { JobInfoTable } from "@/drizzle/schema";
import { JobInfoBackLink } from "@/features/jobInfos/components/JobInfoBackLink";
import { JobInfoForm } from "@/features/jobInfos/components/JobInfoForm";
import { getJobInfoIdTag } from "@/features/jobInfos/dbCache";
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser";
import { and, eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function JobInfoEditPage({
  params,
}: {
  params: Promise<{ jobInfoId: string }>;
}) {
  const { jobInfoId } = await params;
  return (
    <div className="container py-8 space-y-6 max-w-4xl">
      <JobInfoBackLink jobInfoId={jobInfoId} />

      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-copper mb-2">
          Edit
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
          Update job description
        </h1>
        <div className="w-12 h-0.5 bg-copper mt-4" />
      </div>

      <Card>
        <CardContent>
          <Suspense
            fallback={
              <div className="py-12 flex justify-center">
                <div className="dot-loader">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            }
          >
            <SuspendedForm jobInfoId={jobInfoId} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

async function SuspendedForm({ jobInfoId }: { jobInfoId: string }) {
  const { userId, redirectToSignIn } = await getCurrentUser();
  if (userId == null) return redirectToSignIn();

  const jobInfo = await getJobInfo(jobInfoId, userId);
  if (jobInfo == null) return notFound();

  return <JobInfoForm jobInfo={jobInfo} />;
}

async function getJobInfo(id: string, userId: string) {
  "use cache";
  cacheTag(getJobInfoIdTag(id));

  return db.query.JobInfoTable.findFirst({
    where: and(eq(JobInfoTable.id, id), eq(JobInfoTable.userId, userId)),
  });
}
