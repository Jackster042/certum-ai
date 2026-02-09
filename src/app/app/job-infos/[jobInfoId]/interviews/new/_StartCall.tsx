"use client";

import { env } from "@/app/data/env/client";
import { Button } from "@/components/ui/button";
import { JobInfoTable } from "@/drizzle/schema";
import { createInterview } from "@/features/interviews/actions";
import { updateInterview } from "@/features/interviews/actions";
import { errorToast } from "@/lib/errorToast";
import { CondensedMessages } from "@/services/hume/components/CondensedMessages";
import { condenseChatMessages } from "@/services/hume/lib/condenseChatMessages";
import { useVoice, VoiceReadyState } from "@humeai/voice-react";
import { MicIcon, MicOffIcon, PhoneOffIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

export function StartCall({
  jobInfo,
  accessToken,
  user,
}: {
  jobInfo: Pick<
    typeof JobInfoTable.$inferSelect,
    "id" | "title" | "description" | "experienceLevel"
  >;
  accessToken: string;
  user: {
    name: string;
    imageUrl: string;
  };
}) {
  const [interviewId, setInterviewId] = useState<string | null>(null);

  const {
    connect,
    readyState,
    chatMetadata,
    callDurationTimestamp,
  } = useVoice();
  const durationRef = useRef(callDurationTimestamp);
  durationRef.current = callDurationTimestamp;
  const router = useRouter();

  useEffect(() => {
    if (chatMetadata?.chatId == null || interviewId == null) {
      return;
    }
    updateInterview(interviewId, { humeChatId: chatMetadata.chatId });
  }, [chatMetadata?.chatId, interviewId]);

  useEffect(() => {
    if (interviewId == null) return;
    const intervalId = setInterval(() => {
      if (durationRef.current == null) return;

      updateInterview(interviewId, { duration: durationRef.current });
    }, 10000);

    return () => clearInterval(intervalId);
  }, [interviewId]);

  useEffect(() => {
    if (readyState !== VoiceReadyState.CLOSED) return;
    if (interviewId == null) {
      return router.push(`/app/job-infos/${jobInfo.id}/interviews`);
    }

    if (durationRef.current != null) {
      updateInterview(interviewId, { duration: durationRef.current });
    }
    router.push(`/app/job-infos/${jobInfo.id}/interviews/${interviewId}`);
  }, [interviewId, readyState, router, jobInfo.id]);

  // IDLE — dramatic start screen
  if (readyState === VoiceReadyState.IDLE) {
    return (
      <div className="flex flex-col justify-center items-center h-screen-header relative">
        {/* Copper gradient glow */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]">
          <div
            className="w-full h-full"
            style={{
              background:
                "radial-gradient(ellipse at 50% 40%, oklch(0.62 0.16 45) 0%, transparent 60%)",
            }}
          />
        </div>

        <div className="relative z-10 text-center">
          {/* Copper pulse dot */}
          <div className="w-3 h-3 rounded-full bg-copper animate-copper-pulse mx-auto mb-8" />

          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-3">
            Ready when you are.
          </h1>
          <p className="font-sans text-muted-foreground mb-10">
            Your AI interviewer is standing by.
          </p>

          <button
            className="group inline-flex items-center gap-3 bg-foreground text-background px-10 py-4 text-xs font-sans uppercase tracking-[0.15em] font-medium hover:bg-copper hover:text-copper-foreground transition-colors duration-300 cursor-pointer"
            onClick={async () => {
              const res = await createInterview({ jobInfoId: jobInfo.id });
              if (res.error) {
                return errorToast(res.message);
              }
              setInterviewId(res.id);
              connect({
                auth: { type: "accessToken", value: accessToken },
                configId: env.NEXT_PUBLIC_HUME_CONFIG_ID,
                sessionSettings: {
                  type: "session_settings",
                  variables: {
                    userName: user.name,
                    title: jobInfo.title || "Not specified",
                    description: jobInfo.description || "Not specified",
                    experienceLevel: jobInfo.experienceLevel,
                  },
                },
              });
            }}
          >
            Begin Interview
          </button>
        </div>
      </div>
    );
  }

  // CONNECTING / CLOSED — loading
  if (
    readyState === VoiceReadyState.CONNECTING ||
    readyState === VoiceReadyState.CLOSED
  ) {
    return (
      <div className="flex items-center justify-center h-screen-header">
        <div className="text-center">
          <div className="dot-loader mx-auto mb-4">
            <span />
            <span />
            <span />
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
            Connecting...
          </p>
        </div>
      </div>
    );
  }

  // OPEN — active call
  return (
    <div className="overflow-y-auto h-screen-header flex flex-col-reverse">
      <div className="container flex py-6 flex-col items-center justify-end gap-4">
        <Messages user={user} />
        <Controls />
      </div>
    </div>
  );
}

function Messages({ user }: { user: { name: string; imageUrl: string } }) {
  const { messages, fft } = useVoice();

  const condensedMessages = useMemo(() => {
    return condenseChatMessages(messages);
  }, [messages]);

  return (
    <CondensedMessages
      messages={condensedMessages}
      user={user}
      maxFft={Math.max(...fft)}
      className="max-w-5xl"
    />
  );
}

function Controls() {
  const { disconnect, isMuted, mute, unmute, micFft, callDurationTimestamp } =
    useVoice();

  return (
    <div className="flex gap-6 border border-border/60 px-6 py-3 w-fit sticky bottom-6 bg-background/95 backdrop-blur-sm items-center">
      <Button
        variant="ghost"
        size="icon"
        className="-mx-2"
        onClick={() => (isMuted ? unmute() : mute())}
      >
        {isMuted ? <MicOffIcon className="text-destructive" /> : <MicIcon />}
        <span className="sr-only">{isMuted ? "Unmute" : "Mute"}</span>
      </Button>
      <div className="self-stretch">
        <FftVisualizer fft={micFft} />
      </div>
      <div className="font-mono text-xs text-muted-foreground tabular-nums">
        {callDurationTimestamp}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="-mx-2"
        onClick={disconnect}
      >
        <PhoneOffIcon className="text-destructive" />
        <span className="sr-only">End Call</span>
      </Button>
    </div>
  );
}

function FftVisualizer({ fft }: { fft: number[] }) {
  return (
    <div className="flex gap-0.5 items-center h-full">
      {fft.map((value, index) => {
        const percent = (value / 4) * 100;
        return (
          <div
            key={index}
            className="min-h-0.5 bg-copper/75 w-0.5"
            style={{ height: `${percent < 10 ? 0 : percent}%` }}
          />
        );
      })}
    </div>
  );
}
