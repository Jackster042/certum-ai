# Demo Mode Implementation Documentation

**Date:** December 20, 2025  
**Status:** ✅ Implemented & Deployed  
**Purpose:** Enable portfolio visitors to test all features without Clerk billing activation

---

## Table of Contents

1. [Overview](#overview)
2. [Problem Statement](#problem-statement)
3. [Solution Architecture](#solution-architecture)
4. [Implementation Details](#implementation-details)
5. [Configuration](#configuration)
6. [Usage & Testing](#usage--testing)
7. [File Changes](#file-changes)
8. [Future Enhancements](#future-enhancements)

---

## Overview

This document details the implementation of a **demo mode system** that allows new users to test interview preparation features (interviews, questions, and resume analysis) without requiring Clerk billing/subscription activation. This is essential for a portfolio project where you want employers and visitors to experience the full application without payment barriers.

### Key Features

- ✅ **Configurable Usage Limits** - Set limits per feature type
- ✅ **Database Usage Tracking** - Track usage per user in PostgreSQL
- ✅ **Smart Fallback System** - Try Clerk permissions first, fall back to demo limits
- ✅ **Zero-Config for Users** - Works automatically when demo mode is enabled
- ✅ **Production-Ready Toggle** - Easy switch between demo and production billing
- ✅ **Visual Indicators** - Clear demo mode banner and usage badges

---

## Problem Statement

### Initial Situation

In production, the application uses Clerk's billing feature to control access:

**Subscription Tiers:**
- **Free:** 1 interview, 5 questions, no resume analysis
- **Pro:** Unlimited interviews, unlimited questions, unlimited resume analysis
- **Premium:** All Pro features + additional benefits

**The Problem:**
- Clerk billing requires real payment information
- For a portfolio/demo project, this creates a barrier
- New users couldn't test premium features like:
  - Voice interviews
  - AI question generation
  - Resume analysis
- Only job description creation was accessible (no permission checks)

### Business Requirements

1. Allow portfolio visitors to test all features
2. Maintain realistic usage limits (prevent abuse)
3. Keep existing Clerk billing system for potential future use
4. Clear communication that this is a demo/portfolio project
5. Easy toggle between demo and production modes

---

## Solution Architecture

### High-Level Design

```
┌─────────────────────────────────────────────────────────────┐
│                    User Attempts Action                      │
│              (Create Interview/Question/Resume)              │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
         ┌────────────────────────────┐
         │  Permission Check Function  │
         │   (canCreateInterview,     │
         │    canCreateQuestion, etc.) │
         └────────────┬───────────────┘
                      │
                      ▼
         ┌────────────────────────────┐
         │ 1. Check Clerk Permissions │◄─── Production Billing
         │    (unlimited_* or tier_*)  │
         └────────────┬───────────────┘
                      │
                 Has Clerk  ┌─────► ALLOW
                Permission? │
                      │     │
                      NO    │
                      │     │
                      ▼     │
         ┌────────────────────────────┐
         │   2. Is Demo Mode ON?      │
         └────────────┬───────────────┘
                      │
                     NO ────────► DENY
                      │
                     YES
                      │
                      ▼
         ┌────────────────────────────┐
         │ 3. Check Usage in Database │
         │  (demoInterviewsUsed, etc.) │
         └────────────┬───────────────┘
                      │
              Under Limit? ─────► ALLOW & Increment Usage
                      │
                     NO
                      │
                      ▼
                    DENY
```

### Key Design Principles

1. **Non-Intrusive:** Minimal changes to existing code
2. **Backward Compatible:** Clerk billing still works when demo mode is off
3. **Database-Driven:** Usage counts stored in PostgreSQL for persistence
4. **Environment-Based:** Single toggle to enable/disable demo mode
5. **User-Scoped:** Each user gets their own usage limits

---

## Implementation Details

### 1. Database Schema Changes

**File:** `src/drizzle/schema/user.ts`

Added three new columns to the `users` table:

```typescript
export const UserTable = pgTable("users", {
  id: varchar().primaryKey(),
  name: varchar().notNull(),
  email: varchar().notNull().unique(),
  imageUrl: varchar().notNull(),
  
  // Demo mode usage tracking
  demoInterviewsUsed: integer().notNull().default(0),
  demoQuestionsUsed: integer().notNull().default(0),
  demoResumesUsed: integer().notNull().default(0),
  
  createdAt,
  updatedAt,
});
```

**Migration:**
- Generated via: `npm run db:generate`
- Applied via: `npm run db:push` (avoided migration conflicts)

---

### 2. Configuration System

**File:** `src/app/data/demoConfig.ts` (new)

Centralized demo mode configuration:

```typescript
export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

export const DEMO_LIMITS = {
  interviews: parseInt(process.env.DEMO_INTERVIEW_LIMIT || "2", 10),
  questions: parseInt(process.env.DEMO_QUESTION_LIMIT || "5", 10),
  resumes: parseInt(process.env.DEMO_RESUME_LIMIT || "1", 10),
} as const;

export function isDemoMode(): boolean {
  return DEMO_MODE;
}

export function getDemoLimit(feature: "interviews" | "questions" | "resumes"): number {
  return DEMO_LIMITS[feature];
}
```

**Why This Approach:**
- Environment-based toggle (no code changes to switch modes)
- Type-safe with TypeScript
- Easy to adjust limits per feature
- Client and server can both access configuration

---

### 3. Usage Tracking Functions

**File:** `src/features/users/db.ts`

Added functions to manage demo usage:

```typescript
// Get current usage for a user
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

// Increment usage counters (called after successful operations)
export async function incrementDemoInterviews(userId: string) {
  await db.update(UserTable)
    .set({ 
      demoInterviewsUsed: sql`${UserTable.demoInterviewsUsed} + 1`,
      updatedAt: new Date(),
    })
    .where(eq(UserTable.id, userId));
  
  revalidateUserCache(userId);
}

// Similar functions: incrementDemoQuestions(), incrementDemoResumes()

// Reset demo usage (useful for testing)
export async function resetDemoUsage(userId: string) {
  await db.update(UserTable)
    .set({
      demoInterviewsUsed: 0,
      demoQuestionsUsed: 0,
      demoResumesUsed: 0,
      updatedAt: new Date(),
    })
    .where(eq(UserTable.id, userId));
  
  revalidateUserCache(userId);
}
```

---

### 4. Permission Check Updates

#### Interviews Permissions

**File:** `src/features/interviews/permissions.ts`

**Before:**
```typescript
export async function canCreateInterview() {
  return (Promise.any([
    hasPermission("unlimited_interviews").then(
      (bool) => bool || Promise.reject()
    ),
  ]),
  Promise.all([hasPermission("1_interview"), getUserInterviewCount()]).then(
    ([has, c]) => {
      if (has && c < 1) return true;
      return Promise.reject();
    }
  )).catch(() => false);
}
```

**After:**
```typescript
export async function canCreateInterview() {
  // First, try Clerk permissions (for production billing)
  const hasClerkPermission = await Promise.any([
    hasPermission("unlimited_interviews").then(
      (bool) => bool || Promise.reject()
    ),
    Promise.all([hasPermission("1_interview"), getUserInterviewCount()]).then(
      ([has, c]) => {
        if (has && c < 1) return true;
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
  return demoUsage.demoInterviewsUsed < DEMO_LIMITS.interviews;
}
```

**Similar changes applied to:**
- `src/features/questions/permissions.ts` (canCreateQuestion)
- `src/features/resumeAnalyses/permissions.ts` (canRunResumeAnalysis)

---

### 5. Usage Increment Tracking

#### Interview Creation

**File:** `src/features/interviews/actions.ts`

```typescript
export async function createInterview({ jobInfoId }: { jobInfoId: string }) {
  // ... existing permission and validation checks ...
  
  const interview = await insertInterview({ jobInfoId, duration: "00:00:00" });

  // Increment demo usage if in demo mode
  if (DEMO_MODE) {
    await incrementDemoInterviews(userId);
  }

  return { error: false, id: interview.id };
}
```

#### Question Generation

**File:** `src/app/api/ai/questions/generate-question/route.ts`

```typescript
const stream = await generateAiQuestions({
  previousQuestions,
  jobInfo,
  difficulty,
  onFinish: async (question) => {
    const { id } = await insertQuestion({
      text: question,
      jobInfoId,
      difficulty,
    });

    // Increment demo usage if in demo mode
    if (DEMO_MODE) {
      await incrementDemoQuestions(userId);
    }
  },
});
```

#### Resume Analysis

**File:** `src/app/api/ai/resumes/analyze/route.ts`

```typescript
const res = await analyzeResumesForJob({
  resumeFile,
  jobInfo,
});

// Increment demo usage if in demo mode
if (DEMO_MODE) {
  await incrementDemoResumes(userId);
}

return res.toTextStreamResponse();
```

---

### 6. UI Components

#### Demo Banner

**File:** `src/components/DemoBanner.tsx` (updated existing)

```typescript
"use client";

import { Info, X } from "lucide-react";
import { useState } from "react";
import { isDemoMode } from "@/app/data/demoConfig";

export function DemoBanner() {
  const [isVisible, setIsVisible] = useState(true);

  // Only show banner if demo mode is enabled
  if (!isDemoMode() || !isVisible) return null;

  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-3 py-3 text-sm sm:text-base">
          <Info className="w-5 h-5 flex-shrink-0" />
          <p className="text-center font-medium">
            <span className="font-bold">Portfolio Demo Mode:</span> Try all
            features with limited usage. This is a showcase project — no real
            billing or data storage.
          </p>
          <button
            onClick={() => setIsVisible(false)}
            className="flex-shrink-0 p-1 hover:bg-white/20 rounded transition-colors ml-2"
            aria-label="Close banner"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
```

#### Usage Badge Component

**File:** `src/components/UsageBadge.tsx` (new)

```typescript
"use client";

import { Badge } from "@/components/ui/badge";
import { isDemoMode } from "@/app/data/demoConfig";

interface UsageBadgeProps {
  used: number;
  limit: number;
  label: string;
}

export function UsageBadge({ used, limit, label }: UsageBadgeProps) {
  if (!isDemoMode()) return null;

  const remaining = limit - used;
  const isNearLimit = remaining <= 1;
  const isAtLimit = remaining === 0;

  return (
    <Badge
      variant={isAtLimit ? "destructive" : isNearLimit ? "default" : "secondary"}
      className="font-normal"
    >
      {label}: {remaining}/{limit} remaining
    </Badge>
  );
}
```

**Usage Example:**
```tsx
import { UsageBadge } from "@/components/UsageBadge";
import { getDemoUsage } from "@/features/users/db";
import { DEMO_LIMITS } from "@/app/data/demoConfig";

const usage = await getDemoUsage(userId);

<UsageBadge 
  used={usage.demoInterviewsUsed} 
  limit={DEMO_LIMITS.interviews}
  label="Interviews"
/>
```

#### Layout Integration

**File:** `src/app/app/layout.tsx`

```typescript
import { DemoBanner } from "@/components/DemoBanner";

export default async function OnboardingPage({ children }) {
  // ... auth checks ...
  
  return (
    <>
      <DemoBanner />  {/* Added at top of app */}
      <Navbar user={user} />
      {children}
    </>
  );
}
```

---

## Configuration

### Environment Variables

**Local Development:** `.env.local`

```bash
# Demo Mode Configuration
NEXT_PUBLIC_DEMO_MODE=true
DEMO_INTERVIEW_LIMIT=2
DEMO_QUESTION_LIMIT=5
DEMO_RESUME_LIMIT=1
```

**Vercel Production:**

Add in **Project Settings → Environment Variables:**

| Variable | Value | Environments |
|----------|-------|--------------|
| `NEXT_PUBLIC_DEMO_MODE` | `true` | Production, Preview, Development |
| `DEMO_INTERVIEW_LIMIT` | `2` | Production, Preview, Development |
| `DEMO_QUESTION_LIMIT` | `5` | Production, Preview, Development |
| `DEMO_RESUME_LIMIT` | `1` | Production, Preview, Development |

**Important Notes:**
- `NEXT_PUBLIC_*` prefix makes it available to client-side code
- Server-side only vars (`DEMO_*_LIMIT`) are private
- Set for all environments to ensure consistency

### Switching Between Demo and Production Mode

**Enable Demo Mode:**
```bash
NEXT_PUBLIC_DEMO_MODE=true
```

**Disable Demo Mode (use Clerk billing):**
```bash
NEXT_PUBLIC_DEMO_MODE=false
# or simply remove/comment out the variable
```

No code changes required - just update environment variable and redeploy.

---

## Usage & Testing

### Testing Demo Mode Locally

1. **Start the application:**
   ```bash
   npm run dev
   ```

2. **Create a test account or sign in**

3. **Verify demo banner appears** at the top of the app

4. **Test feature limits:**

   **Interviews:**
   - Create 1st interview ✅ (should work)
   - Create 2nd interview ✅ (should work)
   - Create 3rd interview ❌ (should show limit error)

   **Questions:**
   - Generate 5 questions ✅ (should work)
   - Generate 6th question ❌ (should show limit error)

   **Resume Analysis:**
   - Analyze 1 resume ✅ (should work)
   - Analyze 2nd resume ❌ (should show limit error)

5. **Check database:**
   ```bash
   npm run db:studio
   ```
   - Navigate to `users` table
   - Verify your user has usage counts incremented

### Resetting Demo Usage (for testing)

Create an API route or use Drizzle Studio:

```typescript
// Option 1: Via code
import { resetDemoUsage } from "@/features/users/db";
await resetDemoUsage(userId);

// Option 2: Via Drizzle Studio
// Open db:studio, go to users table, manually set counts to 0
```

### Production Testing

1. Deploy to Vercel with demo mode enabled
2. Create a new account (or use existing)
3. Test all features with limits
4. Monitor Vercel logs for any errors
5. Verify banner displays correctly

---

## File Changes

### New Files Created

```
src/
├── app/
│   └── data/
│       └── demoConfig.ts              # Demo configuration
└── components/
    └── UsageBadge.tsx                 # Usage badge component
```

### Modified Files

```
src/
├── app/
│   ├── api/
│   │   └── ai/
│   │       ├── questions/generate-question/route.ts  # +usage tracking
│   │       └── resumes/analyze/route.ts              # +usage tracking
│   └── app/
│       └── layout.tsx                                # +DemoBanner
├── components/
│   └── DemoBanner.tsx                                # Updated
├── drizzle/
│   ├── schema/
│   │   └── user.ts                                   # +3 columns
│   └── migrations/
│       └── 0002_unusual_the_santerians.sql          # Migration
├── features/
│   ├── interviews/
│   │   ├── actions.ts                                # +usage tracking
│   │   └── permissions.ts                            # +demo fallback
│   ├── questions/
│   │   └── permissions.ts                            # +demo fallback
│   ├── resumeAnalyses/
│   │   └── permissions.ts                            # +demo fallback
│   └── users/
│       └── db.ts                                     # +demo functions
```

### Lines of Code Added

- **New files:** ~80 lines
- **Modified files:** ~100 lines
- **Total:** ~180 lines of code

---

## Future Enhancements

### Potential Improvements

1. **Usage Dashboard**
   - Show usage stats on user dashboard
   - Progress bars for each feature
   - Reset button for demo accounts

2. **Usage Badges on Pages**
   - Display `UsageBadge` on interview creation page
   - Show on questions page
   - Show on resume analysis page

3. **Better Error Messages**
   - Custom modal when limit reached
   - Explain demo mode limits
   - Link to contact/portfolio

4. **Analytics**
   - Track which features get tested most
   - Monitor conversion from demo to interest
   - A/B test different demo limits

5. **Admin Tools**
   - Admin dashboard to view all demo usage
   - Bulk reset demo accounts
   - Adjust limits per user (VIP demo accounts)

6. **Email Notifications**
   - Send email when user hits limit
   - Include portfolio/contact info
   - Offer to discuss production deployment

7. **Time-Based Limits**
   - Reset usage after X days
   - Daily/weekly limits instead of lifetime
   - More realistic for ongoing demos

8. **Feature Flags**
   - Use feature flag service (LaunchDarkly, etc.)
   - Remote control of demo limits
   - A/B testing different configurations

### Suggested Next Steps

**Immediate (Low Effort):**
- Add `UsageBadge` to feature pages
- Improve error messages with demo context
- Add usage summary to user profile page

**Short Term (Medium Effort):**
- Create admin dashboard for usage stats
- Implement reset demo usage endpoint
- Add analytics tracking

**Long Term (High Effort):**
- Implement time-based limit resets
- Build feature flag system
- Email notification system

---

## Troubleshooting

### Common Issues

**Issue:** Demo banner doesn't appear
- **Check:** `NEXT_PUBLIC_DEMO_MODE` is set to `"true"` (string)
- **Check:** Environment variable is set in Vercel for all environments
- **Fix:** Redeploy after adding env vars

**Issue:** Still getting permission errors
- **Check:** Demo mode is enabled
- **Check:** Database migration ran successfully
- **Check:** User table has new columns
- **Fix:** Run `npm run db:push`

**Issue:** Usage count not incrementing
- **Check:** `DEMO_MODE` constant is `true`
- **Check:** Increment functions are being called
- **Check:** Database connection is working
- **Debug:** Add console.logs in increment functions

**Issue:** Migration fails with enum error
- **Error:** `type "questions_question_difficulty" already exists`
- **Fix:** Use `npm run db:push` instead of `npm run db:migrate`

### Debugging Tips

1. **Check environment variables:**
   ```bash
   console.log('DEMO_MODE:', process.env.NEXT_PUBLIC_DEMO_MODE);
   ```

2. **Check permission flow:**
   ```typescript
   console.log('Clerk permission:', hasClerkPermission);
   console.log('Demo mode:', DEMO_MODE);
   console.log('Usage:', demoUsage);
   ```

3. **Check database state:**
   ```bash
   npm run db:studio
   # Navigate to users table and check usage columns
   ```

4. **Check Vercel logs:**
   - Vercel Dashboard → Project → Logs
   - Look for permission/demo mode related errors

---

## Summary

This demo mode implementation provides a **professional, scalable solution** for showcasing your SaaS application to potential employers and users without requiring payment setup. The system:

- ✅ Maintains code quality with minimal changes
- ✅ Uses existing infrastructure (database, auth)
- ✅ Easy to toggle on/off via environment variable
- ✅ Provides realistic usage limits
- ✅ Tracks usage persistently in database
- ✅ Clear visual indicators for users
- ✅ Production-ready and deployed

**Implementation Time:** ~4-6 hours  
**Complexity:** Medium  
**Maintenance:** Low  
**Impact:** High (enables full demo experience)

---

## Additional Resources

- [Implementation Plan](../WARP_PLAN.md) (if exists)
- [Database Schema](../src/drizzle/schema/)
- [Permission System](../src/features/*/permissions.ts)
- [Clerk Documentation](https://clerk.com/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)

---

**Last Updated:** December 20, 2025  
**Author:** AI Assistant (Warp)  
**Reviewed By:** Project Owner

For questions or issues, refer to this document or create an issue in the repository.
