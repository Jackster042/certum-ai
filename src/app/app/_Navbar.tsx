"use client";

import {
  BookOpenIcon,
  FileSlidersIcon,
  LogOut,
  SpeechIcon,
  User,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignOutButton, useClerk } from "@clerk/nextjs";
import Link from "next/link";
import { UserAvatar } from "@/features/users/components/UserAvatar";
import { useParams, usePathname } from "next/navigation";

const navLinks = [
  { name: "Interviews", href: "interviews", Icon: SpeechIcon },
  { name: "Questions", href: "questions", Icon: BookOpenIcon },
  { name: "Resume", href: "resume", Icon: FileSlidersIcon },
];

export function Navbar({ user }: { user: { name: string; imageUrl: string } }) {
  const { openUserProfile } = useClerk();
  const { jobInfoId } = useParams();
  const pathName = usePathname();

  return (
    <nav className="h-header border-b border-border/60">
      <div className="container flex h-full items-center justify-between">
        {/* Typographic logo */}
        <Link href="/app" className="flex items-center gap-1">
          <span className="font-serif text-xl font-bold tracking-tight text-foreground">
            CERTUM
          </span>
          <span className="font-mono text-xs text-copper font-medium -translate-y-1.5">
            AI
          </span>
        </Link>

        <div className="flex items-center gap-6">
          {/* Contextual nav links */}
          {typeof jobInfoId === "string" &&
            navLinks.map(({ name, href, Icon }) => {
              const hrefPath = `/app/job-infos/${jobInfoId}/${href}`;
              const isActive = pathName === hrefPath;

              return (
                <Link
                  key={name}
                  href={hrefPath}
                  className={`hidden sm:flex items-center gap-2 text-xs uppercase tracking-[0.12em] font-sans transition-colors relative pb-0.5 ${
                    isActive
                      ? "text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-copper"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="size-3.5" />
                  {name}
                </Link>
              );
            })}

          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
              <UserAvatar user={user} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={() => openUserProfile()}
                className="text-xs uppercase tracking-wider font-sans"
              >
                <User className="mr-2 size-3.5" />
                Profile
              </DropdownMenuItem>
              <SignOutButton>
                <DropdownMenuItem className="text-xs uppercase tracking-wider font-sans">
                  <LogOut className="mr-2 size-3.5" />
                  Logout
                </DropdownMenuItem>
              </SignOutButton>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
