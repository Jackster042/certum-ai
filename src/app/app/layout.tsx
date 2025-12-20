import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser";
import { redirect } from "next/navigation";
import { Navbar } from "./_Navbar";
import { DemoBanner } from "@/components/DemoBanner";

export default async function OnboardingPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, user } = await getCurrentUser({ allData: true });

  if (userId == null) return redirect("/");
  if (user == null) return redirect("/onboarding");

  return (
    <>
      <DemoBanner />
      <Navbar user={user} />
      {children}
    </>
  );
}
