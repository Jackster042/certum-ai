import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { createdAt, updatedAt } from "../schemaHelpers";
import { relations } from "drizzle-orm/relations";
import { JobInfoTable } from "./jobInfo";

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

export const userRelations = relations(UserTable, ({ many }) => ({
  jobInfos: many(JobInfoTable),
}));
