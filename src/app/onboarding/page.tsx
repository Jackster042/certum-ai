import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser";
import { redirect } from "next/navigation";
import { OnboardingClient } from "./_client";

export default async function OnboardingPage() {
  const { userId, user } = await getCurrentUser({ allData: true });

  if (userId == null) return redirect("/");
  if (user != null) return redirect("/app");

  return (
    <div className="container flex flex-col items-center justify-center h-screen gap-6">
      <h1 className="font-serif text-4xl font-bold text-foreground">
        Setting things up.
      </h1>
      <div className="dot-loader">
        <span />
        <span />
        <span />
      </div>
      <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
        Creating your account
      </p>
      <OnboardingClient userId={userId} />
    </div>
  );
}
