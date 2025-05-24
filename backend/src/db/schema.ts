import { sql } from "drizzle-orm"
import {
  boolean,
  integer,
  json,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  uniqueIndex, // Attempting to import uniqueIndex directly
} from "drizzle-orm/pg-core"
import { Theme, Language } from "../users/dto/update-preferences.dto"

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull().default("user"),
  isActive: boolean("is_active").notNull().default(true),
  lastActivityAt: timestamp("last_activity_at").default(sql`CURRENT_TIMESTAMP`),
  preferences: json("preferences")
    .$type<{
      notifications: boolean
      theme: Theme
      language: Language
    }>()
    .default({
      notifications: true,
      theme: Theme.SYSTEM,
      language: Language.PT_BR,
    }),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
})

export const habits = pgTable("habits", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  frequency: varchar("frequency", { length: 50 }).notNull(),
  isArchived: boolean("is_archived").notNull().default(false),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
})

export const habitCompletions = pgTable("habit_completions", {
  id: serial("id").primaryKey(),
  habitId: integer("habit_id")
    .notNull()
    .references(() => habits.id),
  completedAt: timestamp("completed_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
})

export const knowledgeAreas = pgTable("knowledge_areas", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
})

export const userKnowledgeAreas = pgTable(
  "user_knowledge_areas",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    knowledgeAreaId: integer("knowledge_area_id")
      .notNull()
      .references(() => knowledgeAreas.id),
    level: integer("level").notNull(),
    vulnerabilityScore: integer("vulnerability_score"),
    isOwner: boolean("is_owner").notNull().default(false),
    lastUpdated: timestamp("last_updated")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    createdAt: timestamp("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => {
    return {
      userKnowledgeAreaIndex: uniqueIndex("user_knowledge_area_idx").on( // Using the directly imported uniqueIndex
        table.userId,
        table.knowledgeAreaId,
      ),
    }
  },
)

export const careerMilestones = pgTable("career_milestones", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  status: varchar("status", { length: 50 }).notNull(),
  date: timestamp("date"),
  plannedDate: timestamp("planned_date"),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Habit = typeof habits.$inferSelect
export type NewHabit = typeof habits.$inferInsert
export type HabitCompletion = typeof habitCompletions.$inferSelect
export type NewHabitCompletion = typeof habitCompletions.$inferInsert

export type KnowledgeArea = typeof knowledgeAreas.$inferSelect
export type NewKnowledgeArea = typeof knowledgeAreas.$inferInsert
export type UserKnowledgeArea = typeof userKnowledgeAreas.$inferSelect
export type NewUserKnowledgeArea = typeof userKnowledgeAreas.$inferInsert
export type CareerMilestone = typeof careerMilestones.$inferSelect
export type NewCareerMilestone = typeof careerMilestones.$inferInsert
