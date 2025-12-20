import { db } from "@/drizzle/db";
import { UserTable } from "@/drizzle/schema";
import { eq, sql } from "drizzle-orm";
import { revalidateUserCache } from "./dbCache";

export async function upsertUser(user: typeof UserTable.$inferInsert) {
  await db
    .insert(UserTable)
    .values(user)
    .onConflictDoUpdate({
      target: [UserTable.id], // conflict key
      set: {
        email: user.email,
        name: user.name,
        imageUrl: user.imageUrl,
        updatedAt: user.updatedAt,
      },
    });

  revalidateUserCache(user.id);
}

export async function deleteUser(id: string) {
  await db.delete(UserTable).where(eq(UserTable.id, id));
  revalidateUserCache(id);
}

/**
 * Demo Mode Usage Tracking Functions
 */

export async function getDemoUsage(userId: string) {
  const user = await db.query.UserTable.findFirst({
    where: eq(UserTable.id, userId),
    columns: {
      demoInterviewsUsed: true,
      demoQuestionsUsed: true,
      demoResumesUsed: true,
    },
  });
  
  return user ?? {
    demoInterviewsUsed: 0,
    demoQuestionsUsed: 0,
    demoResumesUsed: 0,
  };
}

export async function incrementDemoInterviews(userId: string) {
  await db
    .update(UserTable)
    .set({ 
      demoInterviewsUsed: sql`${UserTable.demoInterviewsUsed} + 1`,
      updatedAt: new Date(),
    })
    .where(eq(UserTable.id, userId));
  
  revalidateUserCache(userId);
}

export async function incrementDemoQuestions(userId: string) {
  await db
    .update(UserTable)
    .set({ 
      demoQuestionsUsed: sql`${UserTable.demoQuestionsUsed} + 1`,
      updatedAt: new Date(),
    })
    .where(eq(UserTable.id, userId));
  
  revalidateUserCache(userId);
}

export async function incrementDemoResumes(userId: string) {
  await db
    .update(UserTable)
    .set({ 
      demoResumesUsed: sql`${UserTable.demoResumesUsed} + 1`,
      updatedAt: new Date(),
    })
    .where(eq(UserTable.id, userId));
  
  revalidateUserCache(userId);
}

/**
 * Reset demo usage for a user (useful for testing)
 */
export async function resetDemoUsage(userId: string) {
  await db
    .update(UserTable)
    .set({
      demoInterviewsUsed: 0,
      demoQuestionsUsed: 0,
      demoResumesUsed: 0,
      updatedAt: new Date(),
    })
    .where(eq(UserTable.id, userId));
  
  revalidateUserCache(userId);
}
