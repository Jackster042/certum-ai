import { db } from "@/drizzle/db";
import { JobInfoTable, QuestionTable } from "@/drizzle/schema";
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser";
import { hasPermission } from "@/services/clerk/lib/hasPermission";
import { count, eq } from "drizzle-orm";
import { DEMO_MODE, DEMO_LIMITS } from "@/app/data/demoConfig";
import { getDemoUsage } from "../users/db";

export async function canCreateQuestion() {
  // First, try Clerk permissions (for production billing)
  const hasClerkPermission = await Promise.any([
    hasPermission("unlimited_questions").then(
      (bool) => bool || Promise.reject()
    ),
    Promise.all([hasPermission("5_questions"), getUserQuestionCount()]).then(
      ([has, c]) => {
        if (has && c < 5) return true;
        return Promise.reject();
      }
    ),
  ]).catch(() => false);

  if (hasClerkPermission) return true;

  // Fallback to demo mode if enabled
  if (!DEMO_MODE) return false;

  const { userId } = await getCurrentUser();
  if (userId == null) return false;

  const demoUsage = await getDemoUsage(userId);
  return demoUsage.demoQuestionsUsed < DEMO_LIMITS.questions;
}

async function getUserQuestionCount() {
  const { userId } = await getCurrentUser();
  if (userId == null) return 0;

  return getQuestionCount(userId);
}

async function getQuestionCount(userId: string) {
  const [{ count: c }] = await db
    .select({ count: count() })
    .from(QuestionTable)
    .innerJoin(JobInfoTable, eq(QuestionTable.jobInfoId, JobInfoTable.id))
    .where(eq(JobInfoTable.userId, userId));

  return c;
}
