"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { cn } from "@/lib/utils";
import {
  AlertCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  UploadIcon,
} from "lucide-react";
import { ReactNode, useRef, useState } from "react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { aiAnalyzeSchema } from "@/services/ai/resumes/schemas";
import { toast } from "sonner";
import { DeepPartial } from "ai";
import z from "zod";
import { Skeleton } from "@/components/Skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

export function ResumePageClient({ jobInfoId }: { jobInfoId: string }) {
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const fileRef = useRef<File | null>(null);

  const {
    object: aiAnalysis,
    isLoading,
    submit: generateAiAnalysis,
  } = useObject({
    api: "/api/ai/resumes/analyze",
    schema: aiAnalyzeSchema,
    fetch: (url, options) => {
      const headers = new Headers(options?.headers);
      headers.delete("Content-Type");

      const formData = new FormData();
      if (fileRef.current) {
        formData.append("resumeFile", fileRef.current);
      }
      formData.append("jobInfoId", jobInfoId);

      return fetch(url, {
        ...options,
        headers,
        body: formData,
      });
    },
  });

  function handleFileUpload(file: File | null) {
    fileRef.current = file;
    if (file == null) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File exceeds 10MB limit");
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("File type not supported");
      return;
    }

    generateAiAnalysis(null);
  }

  return (
    <div className="space-y-8 w-full">
      {/* Upload area */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">
            {isLoading ? "Analyzing your resume..." : "Upload your resume"}
          </CardTitle>
          <CardDescription className="font-sans">
            {isLoading
              ? "This may take a couple minutes"
              : "Get personalized feedback on your resume based on the job"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoadingSwap isLoading={isLoading}>
            <div
              className={cn(
                "mt-2 border-2 border-dashed p-10 transition-colors relative",
                isDragOver
                  ? "border-copper bg-copper/5"
                  : "border-muted-foreground/30 bg-muted/10"
              )}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setIsDragOver(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                handleFileUpload(e.dataTransfer.files[0] ?? null);
              }}
            >
              <label htmlFor="resume-upload" className="sr-only">
                Upload your resume
              </label>
              <input
                id="resume-upload"
                type="file"
                className="opacity-0 absolute inset-0 cursor-pointer"
                accept=".pdf,.doc,.docx,.txt"
                onChange={(e) => handleFileUpload(e.target.files?.[0] ?? null)}
              />

              <div className="flex flex-col items-center justify-center gap-4 text-center">
                <UploadIcon className="size-8 text-copper" />
                <div className="space-y-2">
                  <p className="font-serif text-lg text-foreground">
                    Drop your resume here
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                    PDF &middot; Word &middot; Text &middot; Max 10MB
                  </p>
                </div>
              </div>
            </div>
          </LoadingSwap>
        </CardContent>
      </Card>

      <AnalyzeResults aiAnalysis={aiAnalysis} isLoading={isLoading} />
    </div>
  );
}

type Keys = Exclude<keyof z.infer<typeof aiAnalyzeSchema>, "overallScore">;

function AnalyzeResults({
  aiAnalysis,
  isLoading,
}: {
  aiAnalysis: DeepPartial<z.infer<typeof aiAnalyzeSchema>> | undefined;
  isLoading: boolean;
}) {
  if (!isLoading && aiAnalysis == null) return null;

  const sections: Record<Keys, string> = {
    ats: "ATS Compatibility",
    jobMatch: "Job Match",
    writingAndFormatting: "Writing & Formatting",
    keywordCoverage: "Keyword Coverage",
    other: "Additional Insights",
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-baseline justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-copper mb-2">
              Analysis Report
            </p>
            <CardTitle className="font-serif text-2xl">Results</CardTitle>
          </div>
          <div>
            {aiAnalysis?.overallScore == null ? (
              <Skeleton className="w-20 h-10" />
            ) : (
              <div className="text-right">
                <span className="font-mono text-4xl font-bold text-copper">
                  {aiAnalysis.overallScore}
                </span>
                <span className="font-mono text-sm text-muted-foreground">
                  /10
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="w-12 h-0.5 bg-copper mt-2" />
      </CardHeader>
      <CardContent>
        <Accordion type="multiple">
          {Object.entries(sections).map(([key, title]) => {
            const category = aiAnalysis?.[key as Keys];

            return (
              <AccordionItem key={key} value={title}>
                <AccordionTrigger>
                  <CategoryAccordionHeader
                    title={title}
                    score={category?.score ?? 0}
                  />
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div className="text-muted-foreground font-sans text-sm leading-relaxed">
                      {category?.summary == null ? (
                        <span className="space-y-2 block">
                          <Skeleton />
                          <Skeleton className="w-3/4" />
                        </span>
                      ) : (
                        category.summary
                      )}
                    </div>

                    <div className="space-y-3">
                      {category?.feedback == null ? (
                        <>
                          <Skeleton className="h-16" />
                          <Skeleton className="h-16" />
                          <Skeleton className="h-16" />
                        </>
                      ) : (
                        category.feedback.map((item, index) => {
                          if (item == null) return null;

                          return <FeedbackItem key={index} {...item} />;
                        })
                      )}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </CardContent>
    </Card>
  );
}

function CategoryAccordionHeader({
  title,
  score,
}: {
  title: string;
  score: number | undefined | null;
}) {
  let badge: ReactNode;
  if (score == null) {
    badge = <Skeleton className="w-16" />;
  } else if (score >= 8) {
    badge = (
      <Badge className="font-mono text-[9px] uppercase tracking-wider bg-copper/10 text-copper border-copper/30 border">
        Excellent
      </Badge>
    );
  } else if (score >= 6) {
    badge = (
      <Badge
        variant="secondary"
        className="font-mono text-[9px] uppercase tracking-wider"
      >
        OK
      </Badge>
    );
  } else {
    badge = (
      <Badge
        variant="destructive"
        className="font-mono text-[9px] uppercase tracking-wider"
      >
        Needs Work
      </Badge>
    );
  }

  return (
    <div className="flex items-start justify-between w-full">
      <div className="flex flex-col items-start gap-1.5">
        <span className="font-serif text-base">{title}</span>
        <div className="no-underline">{badge}</div>
      </div>
      <span className="font-mono text-sm text-muted-foreground">
        {score == null ? <Skeleton className="w-12" /> : `${score}/10`}
      </span>
    </div>
  );
}

function FeedbackItem({
  message,
  name,
  type,
}: Partial<z.infer<typeof aiAnalyzeSchema>["ats"]["feedback"][number]>) {
  if (name == null || message == null || type == null) return null;

  const getBorderColor = () => {
    switch (type) {
      case "strength":
        return "border-l-copper";
      case "major-improvement":
        return "border-l-destructive";
      case "minor-improvement":
        return "border-l-warning";
      default:
        throw new Error(`Unknown feedback type: ${type satisfies never} `);
    }
  };

  const getIcon = () => {
    switch (type) {
      case "strength":
        return <CheckCircleIcon className="text-copper size-4" />;
      case "minor-improvement":
        return <AlertCircleIcon className="text-warning size-4" />;
      case "major-improvement":
        return <XCircleIcon className="size-4 text-destructive" />;
      default:
        throw new Error(`Unknown feedback type: ${type satisfies never} `);
    }
  };

  return (
    <div
      className={cn(
        "flex items-baseline gap-3 pl-4 pr-5 py-4 border-l-4 bg-muted/20",
        getBorderColor()
      )}
    >
      <div className="shrink-0 mt-0.5">{getIcon()}</div>
      <div className="flex flex-col gap-1">
        <div className="font-serif text-sm font-medium text-foreground">
          {name}
        </div>
        <div className="font-sans text-sm text-muted-foreground leading-relaxed">
          {message}
        </div>
      </div>
    </div>
  );
}
