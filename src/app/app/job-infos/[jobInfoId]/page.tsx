import { BackLink } from "@/components/BackLink";
import { SuspendedItem } from "@/components/SuspendedItem";
import { db } from "@/drizzle/db";
import { JobInfoTable } from "@/drizzle/schema";
import { getJobInfoIdTag } from "@/features/jobInfos/dbCache";
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser";
import { and, eq } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { notFound } from "next/navigation";
import { formatExperienceLevel } from "@/features/jobInfos/lib/formatters";
import Link from "next/link";
import { Skeleton } from "@/components/Skeleton";

const options = [
  {
    num: "01",
    label: "Answer Technical Questions",
    description:
      "Challenge yourself with practice questions tailored to your job description.",
    href: "questions",
  },
  {
    num: "02",
    label: "Practice Interviewing",
    description: "Simulate a real interview with AI-powered mock interviews.",
    href: "interviews",
  },
  {
    num: "03",
    label: "Refine Your Resume",
    description:
      "Get expert feedback on your resume and improve your chances of landing an interview.",
    href: "resume",
  },
  {
    num: "04",
    label: "Update Job Description",
    description: "This should only be used for minor updates.",
    href: "edit",
  },
];

export default async function JobInfoPage({
  params,
}: {
  params: Promise<{ jobInfoId: string }>;
}) {
  const { jobInfoId } = await params;

  const jobInfo = await getCurrentUser().then(
    async ({ userId, redirectToSignIn }) => {
      if (userId == null) return redirectToSignIn();

      const jobInfo = await getJobInfo(jobInfoId, userId);
      if (jobInfo == null) return notFound();

      return jobInfo;
    }
  );

  return (
    <div className="container py-8 space-y-6">
      <BackLink href="/app">Dashboard</BackLink>

      <div className="space-y-8">
        {/* Header */}
        <header className="space-y-4">
          <div className="space-y-3">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
              <SuspendedItem
                item={Promise.resolve(jobInfo)}
                fallback={<Skeleton className="w-48" />}
                result={(j) => j.name}
              />
            </h1>

            <div className="flex gap-2">
              <SuspendedItem
                item={Promise.resolve(jobInfo)}
                fallback={<Skeleton className="w-12" />}
                result={(j) => (
                  <Badge
                    variant="outline"
                    className="font-mono text-[10px] uppercase tracking-wider"
                  >
                    {formatExperienceLevel(j.experienceLevel)}
                  </Badge>
                )}
              />

              <SuspendedItem
                item={Promise.resolve(jobInfo)}
                fallback={null}
                result={(j) =>
                  j.title && (
                    <Badge
                      variant="outline"
                      className="font-mono text-[10px] uppercase tracking-wider"
                    >
                      {j.title}
                    </Badge>
                  )
                }
              />
            </div>
          </div>

          {/* Copper rule */}
          <div className="w-12 h-0.5 bg-copper" />

          <p className="text-muted-foreground font-sans text-sm leading-relaxed line-clamp-3 max-w-3xl">
            <SuspendedItem
              item={Promise.resolve(jobInfo)}
              fallback="Loading..."
              result={(j) => j.description}
            />
          </p>
        </header>

        {/* Options grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-border has-hover:*:not-hover:opacity-60">
          {options.map((option) => (
            <Link
              className="group transition-all duration-200 relative"
              href={`/app/job-infos/${jobInfoId}/${option.href}`}
              key={option.href}
            >
              <div className="p-8 border border-border/50 h-full relative overflow-hidden">
                {/* Copper hover border */}
                <div className="absolute left-0 top-0 bottom-0 w-0 bg-copper group-hover:w-1 transition-all duration-300" />

                <span className="font-mono text-3xl font-bold text-border group-hover:text-copper transition-colors duration-300">
                  {option.num}
                </span>
                <h3 className="font-serif text-lg font-semibold text-foreground mt-3 mb-2 group-hover:translate-x-1 transition-transform duration-200">
                  {option.label}
                </h3>
                <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                  {option.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

async function getJobInfo(id: string, userId: string) {
  "use cache";
  cacheTag(getJobInfoIdTag(id));

  return db.query.JobInfoTable.findFirst({
    where: and(eq(JobInfoTable.id, id), eq(JobInfoTable.userId, userId)),
  });
}
