import { JobInfoBackLink } from "@/features/jobInfos/components/JobInfoBackLink";
import { Suspense } from "react";
import { ArrowRightIcon, PlusIcon } from "lucide-react";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getJobInfoIdTag } from "@/features/jobInfos/dbCache";
import { getInterviewJobInfoTag } from "@/features/interviews/dbCache";
import { and, desc, eq, isNotNull } from "drizzle-orm";
import { db } from "@/drizzle/db";
import { InterviewTable } from "@/drizzle/schema";
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDateTime } from "@/lib/formatDateTime";

export default async function InterviewsPage({
  params,
}: {
  params: Promise<{ jobInfoId: string }>;
}) {
  const { jobInfoId } = await params;

  return (
    <div className="container py-8 gap-6 h-screen-header flex flex-col items-start">
      <JobInfoBackLink jobInfoId={jobInfoId} />

      <Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center w-full">
            <div className="dot-loader">
              <span />
              <span />
              <span />
            </div>
          </div>
        }
      >
        <SuspendedPage jobInfoId={jobInfoId} />
      </Suspense>
    </div>
  );
}

async function SuspendedPage({ jobInfoId }: { jobInfoId: string }) {
  const { userId, redirectToSignIn } = await getCurrentUser();
  if (userId == null) return redirectToSignIn();

  const interviews = await getInterviews(jobInfoId, userId);
  if (interviews.length === 0) {
    return redirect(`/app/job-infos/${jobInfoId}/interviews/new`);
  }

  return (
    <div className="space-y-8 w-full">
      <div className="flex items-end justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-copper mb-2">
            Session History
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
            Interviews
          </h1>
          <div className="w-12 h-0.5 bg-copper mt-4" />
        </div>
        <Button asChild>
          <Link href={`/app/job-infos/${jobInfoId}/interviews/new`}>
            <PlusIcon />
            New Session
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-border has-hover:*:not-hover:opacity-60">
        {/* New interview card */}
        <Link
          className="group transition-all duration-200"
          href={`/app/job-infos/${jobInfoId}/interviews/new`}
        >
          <div className="p-8 border border-dashed border-border/50 h-full flex items-center justify-center hover:border-copper/40 transition-colors">
            <div className="flex items-center gap-3 text-muted-foreground group-hover:text-copper transition-colors">
              <PlusIcon className="size-4" />
              <span className="font-mono text-xs uppercase tracking-[0.15em]">
                New Interview
              </span>
            </div>
          </div>
        </Link>

        {/* Interview cards */}
        {interviews.map((interview) => (
          <Link
            className="group transition-all duration-200 relative"
            href={`/app/job-infos/${jobInfoId}/interviews/${interview.id}`}
            key={interview.id}
          >
            <div className="p-8 border border-border/50 h-full relative overflow-hidden">
              {/* Copper hover border */}
              <div className="absolute left-0 top-0 bottom-0 w-0 bg-copper group-hover:w-1 transition-all duration-300" />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-serif text-base font-semibold text-foreground group-hover:translate-x-1 transition-transform duration-200">
                    {formatDateTime(interview.createdAt)}
                  </p>
                  <p className="font-mono text-xs text-muted-foreground mt-1">
                    {interview.duration}
                  </p>
                </div>
                <ArrowRightIcon className="size-4 text-muted-foreground group-hover:text-copper transition-colors" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

async function getInterviews(jobInfoId: string, userId: string) {
  "use cache";
  cacheTag(getInterviewJobInfoTag(jobInfoId));
  cacheTag(getJobInfoIdTag(jobInfoId));

  const data = await db.query.InterviewTable.findMany({
    where: and(
      eq(InterviewTable.jobInfoId, jobInfoId),
      isNotNull(InterviewTable.humeChatId)
    ),
    with: { jobInfo: { columns: { userId: true } } },
    orderBy: desc(InterviewTable.updatedAt),
  });

  return data.filter((interview) => interview.jobInfo.userId === userId);
}
