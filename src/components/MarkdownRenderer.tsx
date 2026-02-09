import { cn } from "@/lib/utils";
import { ComponentProps } from "react";
import Markdown from "react-markdown";

export function MarkdownRenderer({
  className,
  ...props
}: { className?: string } & ComponentProps<typeof Markdown>) {
  return (
    <div
      className={cn(
        "max-w-none prose prose-neutral dark:prose-invert font-sans prose-headings:font-serif prose-headings:tracking-tight prose-p:leading-relaxed prose-a:text-copper prose-a:no-underline hover:prose-a:underline prose-strong:font-semibold prose-blockquote:border-l-copper prose-blockquote:font-serif prose-blockquote:italic",
        className
      )}
    >
      <Markdown {...props} />
    </div>
  );
}
