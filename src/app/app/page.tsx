import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/drizzle/db";
import { JobInfoTable } from "@/drizzle/schema";
import { JobInfoForm } from "@/features/jobInfos/components/JobInfoForm";
import { getJobInfoUserTag } from "@/features/jobInfos/dbCache";
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser";
import { desc, eq } from "drizzle-orm";
import { ArrowRightIcon } from "lucide-react";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Suspense } from "react";
import { formatExperienceLevel } from "@/features/jobInfos/lib/formatters";

export default function AppPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen-header flex items-center justify-center">
          <div className="dot-loader">
            <span />
            <span />
            <span />
          </div>
        </div>
      }
    >
      <JobInfos />
    </Suspense>
  );
}

async function JobInfos() {
  const { userId, redirectToSignIn } = await getCurrentUser();
  if (userId == null) return redirectToSignIn();

  const jobInfos = await getJobInfos(userId);

  if (jobInfos.length === 0) return <NoJobInfos />;

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-copper mb-2">
            Your Briefs
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
            Job Descriptions
          </h1>
          {/* Rule line */}
          <div className="w-12 h-0.5 bg-copper mt-4" />
        </div>
        <Button asChild>
          <Link href="/app/job-infos/new">New Brief</Link>
        </Button>
      </div>

      {/* Job cards grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 has-hover:*:not-hover:opacity-70">
        {jobInfos?.map((jobInfo) => (
          <Link
            className="group hover-copper-border transition-all duration-200"
            href={`/app/job-infos/${jobInfo.id}`}
            key={jobInfo.id}
          >
            <Card className="w-full h-full">
              <div className="flex items-center justify-between h-full">
                <div className="space-y-3 h-full flex-1">
                  <CardHeader>
                    <CardTitle className="font-serif text-lg">
                      {jobInfo.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground text-sm font-sans line-clamp-2 leading-relaxed">
                    {jobInfo.description}
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Badge
                      variant="outline"
                      className="font-mono text-[10px] uppercase tracking-wider"
                    >
                      {formatExperienceLevel(jobInfo.experienceLevel)}
                    </Badge>
                    {jobInfo.title && (
                      <Badge
                        variant="outline"
                        className="font-mono text-[10px] uppercase tracking-wider"
                      >
                        {jobInfo.title}
                      </Badge>
                    )}
                  </CardFooter>
                </div>

                <CardContent className="shrink-0">
                  <ArrowRightIcon className="size-4 text-muted-foreground group-hover:text-copper transition-colors" />
                </CardContent>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

function NoJobInfos() {
  return (
    <div className="container py-8 max-w-5xl">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-copper mb-2">
        Welcome
      </p>
      <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-2">
        Begin.
      </h1>
      <div className="w-12 h-0.5 bg-copper mt-4 mb-8" />
      <p className="text-muted-foreground font-sans leading-relaxed mb-8 max-w-2xl">
        Enter information about the type of job you are pursuing. This can be
        specific details copied directly from a listing, or general information
        like the tech stack you want to work with. The more precise your
        description, the closer your practice interviews will be to the real
        thing.
      </p>
      <Card>
        <CardContent>
          <JobInfoForm />
        </CardContent>
      </Card>
    </div>
  );
}

async function getJobInfos(userId: string) {
  "use cache";
  cacheTag(getJobInfoUserTag(userId));

  return db.query.JobInfoTable.findMany({
    where: eq(JobInfoTable.userId, userId),
    orderBy: desc(JobInfoTable.updatedAt),
  });
}
