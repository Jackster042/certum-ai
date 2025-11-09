"use client";

import { Button } from "@/components/ui/button";
import { SignInButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import dynamic from "next/dynamic";

function AuthenticatedNavButton() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded || !isSignedIn) {
    return (
      <SignInButton forceRedirectUrl="/app">
        <Button variant="outline">Sign in</Button>
      </SignInButton>
    );
  }

  return (
    <Button asChild>
      <Link href="/app">Dashboard</Link>
    </Button>
  );
}

const NavButtonClient = dynamic(() => Promise.resolve(AuthenticatedNavButton), {
  loading: () => (
    <SignInButton forceRedirectUrl="/app">
      <Button variant="outline">Sign in</Button>
    </SignInButton>
  ),
  ssr: false
});

export default NavButtonClient;