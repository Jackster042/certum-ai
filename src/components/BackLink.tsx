import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function BackLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground hover:text-copper transition-colors group",
        className
      )}
    >
      <ArrowLeftIcon className="size-3 group-hover:-translate-x-0.5 transition-transform" />
      {children}
    </Link>
  );
}
