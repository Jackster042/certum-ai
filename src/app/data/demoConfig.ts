/**
 * Demo Mode Configuration
 * 
 * Controls whether the application runs in demo mode (for portfolio showcasing)
 * or production mode (with real Clerk billing/subscriptions).
 */

export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

export const DEMO_LIMITS = {
  interviews: parseInt(process.env.DEMO_INTERVIEW_LIMIT || "2", 10),
  questions: parseInt(process.env.DEMO_QUESTION_LIMIT || "5", 10),
  resumes: parseInt(process.env.DEMO_RESUME_LIMIT || "1", 10),
} as const;

/**
 * Helper to check if demo mode is active
 */
export function isDemoMode(): boolean {
  return DEMO_MODE;
}

/**
 * Get demo limits for a specific feature
 */
export function getDemoLimit(feature: "interviews" | "questions" | "resumes"): number {
  return DEMO_LIMITS[feature];
}
