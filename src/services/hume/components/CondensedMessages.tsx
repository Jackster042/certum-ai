import { UserAvatar } from "@/features/users/components/UserAvatar";
import { cn } from "@/lib/utils";
import React from "react";

export function CondensedMessages({
  messages,
  user,
  className,
  maxFft = 0,
}: {
  messages: { isUser: boolean; content: string[] }[];
  user: { name: string; imageUrl: string };
  className?: string;
  maxFft?: number;
}) {
  return (
    <div className={cn("flex flex-col gap-5 w-full", className)}>
      {messages.map((message, index) => {
        const shouldAnimate =
          index === messages.length - 1 && !message.isUser && maxFft > 0;

        return (
          <div
            key={index}
            className={cn(
              "flex items-start gap-4 max-w-[80%]",
              message.isUser ? "self-end flex-row-reverse" : "self-start"
            )}
          >
            {/* Avatar / Brand mark */}
            {message.isUser ? (
              <UserAvatar user={user} className="size-6 shrink-0 mt-1" />
            ) : (
              <div className="relative mt-1">
                <div
                  className={cn(
                    "absolute inset-0 border-copper/30 border-2 rounded-full",
                    shouldAnimate ? "animate-ping" : "hidden"
                  )}
                />
                <div
                  className="size-6 shrink-0 border border-border flex items-center justify-center font-serif text-[10px] font-bold text-copper relative"
                  style={
                    shouldAnimate ? { scale: maxFft / 8 + 1 } : undefined
                  }
                >
                  C
                </div>
              </div>
            )}

            {/* Message content */}
            <div
              className={cn(
                "py-3 px-5",
                message.isUser
                  ? "bg-foreground text-background"
                  : "border-l-2 border-copper/30 bg-muted/40"
              )}
            >
              {/* Speaker label */}
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-copper mb-1.5">
                {message.isUser ? "You" : "Interviewer"}
              </p>
              <div
                className={cn(
                  "flex flex-col gap-1",
                  message.isUser ? "font-sans text-sm" : "font-serif text-sm italic"
                )}
              >
                {message.content.map((text, i) => (
                  <span key={i}>{text}</span>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
