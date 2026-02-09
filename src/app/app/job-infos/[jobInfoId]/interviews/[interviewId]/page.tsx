import { BackLink } from "@/components/BackLink";
import { Skeleton, SkeletonButton } from "@/components/Skeleton";
import { SuspendedItem } from "@/components/SuspendedItem";
import { ActionButton } from "@/components/ui/action-button";
import { db } from "@/drizzle/db";
import { InterviewTable } from "@/drizzle/schema";
import { getInterviewIdTag } from "@/features/interviews/dbCache";
import { getJobInfoIdTag } from "@/features/jobInfos/dbCache";
import { formatDateTime } from "@/lib/formatDateTime";
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser";
import { eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { notFound } from "next/navigation";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { Button } from "@/components/ui/button";
import { generateInterviewFeedback } from "@/features/interviews/actions";
import { Suspense } from "react";
import { condenseChatMessages } from "@/services/hume/lib/condenseChatMessages";
import { fetchChatMessages } from "@/services/hume/lib/api";
import { CondensedMessages } from "@/services/hume/components/CondensedMessages";

export default async function InterviewPage({
  params,
}: {
  params: Promise<{ jobInfoId: string; interviewId: string }>;
}) {
  const { jobInfoId, interviewId } = await params;

  const currentUserData = await getCurrentUser();
  if (currentUserData.userId == null) return currentUserData.redirectToSignIn();
  const userId = currentUserData.userId!;

  const interviewPromise = getInterview(interviewId, userId).then(
    (interviewData) => {
      if (interviewData == null) return notFound();
      return interviewData;
    }
  );

  type InterviewType = {
    duration: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    jobInfoId: string;
    humeChatId: string | null;
    feedback: string | null;
    jobInfo: { id: string; userId: string };
  };

  return (
    <div className="container py-8 space-y-6">
      <BackLink href={`/app/job-infos/${jobInfoId}/interviews`}>
        All Interviews
      </BackLink>

      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-copper mb-2">
              Session Transcript
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
              <SuspendedItem<InterviewType>
                item={interviewPromise as Promise<InterviewType>}
                fallback={<Skeleton className="w-48" />}
                result={(i) => formatDateTime(i.createdAt)}
              />
            </h1>
            <div className="w-12 h-0.5 bg-copper mt-4 mb-2" />
            <p className="font-mono text-xs text-muted-foreground">
              <SuspendedItem
                item={interviewPromise as Promise<InterviewType>}
                fallback={<Skeleton className="w-24" />}
                result={(i) => <>Duration: {i.duration}</>}
              />
            </p>
          </div>

          {/* Feedback button */}
          <SuspendedItem
            item={interviewPromise as Promise<InterviewType>}
            fallback={<SkeletonButton className="w-32" />}
            result={(i) =>
              i.feedback == null ? (
                <ActionButton
                  action={generateInterviewFeedback.bind(null, i.id)}
                >
                  Generate Feedback
                </ActionButton>
              ) : (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>View Feedback</Button>
                  </DialogTrigger>
                  <DialogContent className="md:max-w-3xl lg:max-w-4xl max-h-[calc(100%-2rem)] overflow-y-auto flex flex-col">
                    <DialogTitle className="font-serif text-2xl">
                      Session Feedback
                    </DialogTitle>
                    <div className="w-12 h-0.5 bg-copper mb-4" />
                    <MarkdownRenderer>{i.feedback}</MarkdownRenderer>
                  </DialogContent>
                </Dialog>
              )
            }
          />
        </div>

        {/* Messages */}
        <Suspense
          fallback={
            <div className="flex justify-center py-16">
              <div className="dot-loader">
                <span />
                <span />
                <span />
              </div>
            </div>
          }
        >
          <Messages interview={interviewPromise} />
        </Suspense>
      </div>
    </div>
  );
}

async function Messages({
  interview,
}: {
  interview: Promise<{ humeChatId: string | null }>;
}) {
  const { user, redirectToSignIn } = await getCurrentUser({ allData: true });
  if (user == null) return redirectToSignIn();

  const { humeChatId } = await interview;
  if (humeChatId == null) return notFound();

  const condensedMessages = condenseChatMessages(
    await fetchChatMessages(humeChatId)
  );

  return (
    <CondensedMessages
      messages={condensedMessages}
      user={user}
      className="mx-auto max-w-5xl"
    />
  );
}

async function getInterview(id: string, userId: string) {
  "use cache";
  cacheTag(getInterviewIdTag(id));

  const interview = await db.query.InterviewTable.findFirst({
    where: eq(InterviewTable.id, id),
    with: {
      jobInfo: {
        columns: {
          id: true,
          userId: true,
        },
      },
    },
  });

  if (interview == null) return null;

  cacheTag(getJobInfoIdTag(interview.jobInfo.id));
  if (interview.jobInfo.userId !== userId) return null;

  return interview;
}
