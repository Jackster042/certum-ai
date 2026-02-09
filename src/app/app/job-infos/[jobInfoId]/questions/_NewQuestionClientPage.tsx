"use client";

import { BackLink } from "@/components/BackLink";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  JobInfoTable,
  questionDifficulties,
  QuestionDifficulty,
} from "@/drizzle/schema";
import { formatQuestionDifficulty } from "@/features/questions/formatters";
import { useState } from "react";
import { useCompletion } from "@ai-sdk/react";
import { errorToast } from "@/lib/errorToast";

type Status = "awaiting-answer" | "awaiting-difficulty" | "init";

export function NewQuestionClientPage({
  jobInfo,
}: {
  jobInfo: Pick<typeof JobInfoTable.$inferSelect, "id" | "name" | "title">;
}) {
  const [status, setStatus] = useState<Status>("init");
  const [answer, setAnswer] = useState<string | null>(null);
  const [questionId, setQuestionId] = useState<string | null>(null);

  const {
    complete: generateQuestion,
    completion: question,
    setCompletion: setQuestion,
    isLoading: isGeneratingQuestion,
  } = useCompletion({
    api: "/api/ai/questions/generate-question",
    onFinish: () => {
      setStatus("awaiting-answer");

      setTimeout(async () => {
        try {
          const response = await fetch("/api/ai/questions/get-latest-id", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              jobInfoId: jobInfo.id,
            }),
          });

          if (response.ok) {
            const { questionId: id } = await response.json();
            setQuestionId(id);
          }
        } catch (error) {
          console.error("Failed to get question ID:", error);
        }
      }, 200);
    },
    onError: (error) => {
      errorToast(error.message);
    },
  });

  const {
    complete: generateFeedback,
    completion: feedback,
    setCompletion: setFeedback,
    isLoading: isGeneratingFeedback,
  } = useCompletion({
    api: "/api/ai/questions/generate-feedback",
    onFinish: () => {
      setStatus("awaiting-difficulty");
    },
    onError: (error) => {
      errorToast(error.message);
    },
  });

  return (
    <div className="flex flex-col items-center w-full mx-auto flex-grow h-screen-header">
      {/* Controls bar */}
      <div className="w-full border-b border-border/60">
        <div className="container flex gap-4 py-3 items-center justify-between">
          <div className="flex-grow basis-0">
            <BackLink href={`/app/job-infos/${jobInfo.id}`}>
              {jobInfo.name}
            </BackLink>
          </div>
          <Controls
            reset={() => {
              setStatus("init");
              setQuestion("");
              setFeedback("");
              setAnswer(null);
            }}
            status={status}
            isLoading={isGeneratingQuestion || isGeneratingFeedback}
            disableAnswerButton={
              answer == null || answer.trim() === "" || questionId == null
            }
            generateQuestion={(difficulty) => {
              setQuestion("");
              setFeedback("");
              setAnswer(null);
              generateQuestion(difficulty, { body: { jobInfoId: jobInfo.id } });
            }}
            generateFeedback={() => {
              if (answer == null || answer.trim() === "" || questionId == null)
                return;

              generateFeedback(answer?.trim(), { body: { questionId } });
            }}
          />
          <div className="flex-grow hidden md:block" />
        </div>
      </div>

      {/* Content panels */}
      <QuestionContainer
        question={question}
        feedback={feedback}
        answer={answer}
        status={status}
        setAnswer={setAnswer}
      />
    </div>
  );
}

function QuestionContainer({
  question,
  feedback,
  answer,
  status,
  setAnswer,
}: {
  question: string | null;
  feedback: string | null;
  answer: string | null;
  status: Status;
  setAnswer: (value: string) => void;
}) {
  return (
    <ResizablePanelGroup direction="horizontal" className="flex-grow border-t border-border/40">
      {/* Left: Question + Feedback */}
      <ResizablePanel id="question-and-feedback" defaultSize={50} minSize={5}>
        <ResizablePanelGroup direction="vertical" className="flex-grow">
          <ResizablePanel id="question" defaultSize={25} minSize={5}>
            <ScrollArea className="h-full min-w-48 *:h-full">
              {question ? (
                <div className="p-8">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-copper mb-4">
                    Question
                  </p>
                  <div className="font-serif text-lg leading-relaxed text-foreground">
                    <MarkdownRenderer>{question}</MarkdownRenderer>
                  </div>
                </div>
              ) : status === "init" ? (
                <div className="flex items-center justify-center h-full p-8">
                  <div className="text-center">
                    <p className="font-serif text-xl text-muted-foreground italic mb-2">
                      Select a difficulty to begin.
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground/50">
                      Easy &middot; Medium &middot; Hard
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full p-8">
                  <div className="dot-loader">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              )}
            </ScrollArea>
          </ResizablePanel>
          {feedback && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel id="feedback" defaultSize={75} minSize={5}>
                <ScrollArea className="h-full min-w-48 *:h-full">
                  <div className="p-8 bg-muted/30">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-copper mb-4">
                      Feedback
                    </p>
                    <div className="border-l-2 border-copper/30 pl-6">
                      <MarkdownRenderer>
                        {feedback}
                      </MarkdownRenderer>
                    </div>
                  </div>
                </ScrollArea>
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </ResizablePanel>

      <ResizableHandle withHandle />

      {/* Right: Answer area */}
      <ResizablePanel id="answer" defaultSize={50} minSize={5}>
        <ScrollArea className="h-full min-w-48 *:h-full">
          <div className="h-full relative">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-copper absolute top-4 left-8 z-10 pointer-events-none">
              Your Answer
            </p>
            <Textarea
              disabled={status !== "awaiting-answer"}
              onChange={(e) => setAnswer(e.target.value)}
              value={answer ?? ""}
              placeholder={
                status === "awaiting-answer"
                  ? "Type your answer here..."
                  : "Waiting for question..."
              }
              className="w-full h-full resize-none border-none rounded-none focus-visible:ring-0 !text-base font-sans p-8 pt-10 bg-transparent leading-relaxed"
            />
          </div>
        </ScrollArea>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

function Controls({
  status,
  isLoading,
  disableAnswerButton,
  generateQuestion,
  generateFeedback,
  reset,
}: {
  status: Status;
  isLoading: boolean;
  disableAnswerButton: boolean;
  generateQuestion: (difficulty: QuestionDifficulty) => void;
  generateFeedback: () => void;
  reset: () => void;
}) {
  return (
    <div className="flex gap-2">
      {status === "awaiting-answer" ? (
        <>
          <Button
            onClick={reset}
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            <LoadingSwap isLoading={isLoading}>Skip</LoadingSwap>
          </Button>
          <Button
            onClick={generateFeedback}
            disabled={disableAnswerButton}
            size="sm"
          >
            <LoadingSwap isLoading={isLoading}>Submit Answer</LoadingSwap>
          </Button>
        </>
      ) : (
        questionDifficulties.map((difficulty) => (
          <Button
            key={difficulty}
            disabled={isLoading}
            onClick={() => generateQuestion(difficulty)}
            variant="outline"
            size="sm"
            className="cursor-pointer hover:border-copper hover:text-copper"
          >
            <LoadingSwap isLoading={isLoading}>
              {formatQuestionDifficulty(difficulty)}
            </LoadingSwap>
          </Button>
        ))
      )}
    </div>
  );
}
