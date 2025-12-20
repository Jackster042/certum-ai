import { hasPermission } from "@/services/clerk/lib/hasPermission";
import { DEMO_MODE, DEMO_LIMITS } from "@/app/data/demoConfig";
import { getDemoUsage } from "../users/db";
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser";

export async function canRunResumeAnalysis() {
  // First, try Clerk permissions (for production billing)
  const hasClerkPermission = await hasPermission("unlimited_resume_analysis");
  
  if (hasClerkPermission) return true;

  // Fallback to demo mode if enabled
  if (!DEMO_MODE) return false;

  const { userId } = await getCurrentUser();
  if (userId == null) return false;

  const demoUsage = await getDemoUsage(userId);
  return demoUsage.demoResumesUsed < DEMO_LIMITS.resumes;
}
