import {
  pgTable,
  text,
  timestamp,
  uuid,
  boolean,
  integer,
  jsonb,
} from "drizzle-orm/pg-core";

export const lhCategories = pgTable("lh_categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
  color: text("color").notNull().default("#6B7280"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const lhPages = pgTable("lh_pages", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  body: text("body").notNull().default(""),
  categoryId: uuid("category_id").references(() => lhCategories.id, {
    onDelete: "set null",
  }),
  type: text("type", { enum: ["playbook", "learning"] }).notNull(),
  author: text("author").notNull().default("Anna"),
  pinned: boolean("pinned").notNull().default(false),
  moduleSlug: text("module_slug"),
  notionPageId: text("notion_page_id").unique(),
  notionLastEdited: timestamp("notion_last_edited"),
  source: text("source", { enum: ["manual", "notion"] })
    .notNull()
    .default("manual"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const lhCoachNotes = pgTable("lh_coach_notes", {
  id: uuid("id").defaultRandom().primaryKey(),
  author: text("author").notNull().default("Stephanie"),
  body: text("body").notNull(),
  reviewed: boolean("reviewed").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const lhDemoLinks = pgTable("lh_demo_links", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  description: text("description").notNull().default(""),
  linkType: text("link_type", {
    enum: ["demo", "prototype", "resource", "cowork"],
  })
    .notNull()
    .default("demo"),
  author: text("author").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const lhLearnings = pgTable("lh_learnings", {
  id: uuid("id").defaultRandom().primaryKey(),
  date: text("date").notNull(),
  title: text("title").notNull(),
  bullets: jsonb("bullets").notNull().$type<string[]>(),
  tags: jsonb("tags").notNull().$type<string[]>(),
  author: text("author").notNull().default("AI-generated from daily notes"),
  expandedContent: text("expanded_content").notNull().default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const lhWeeklyPlans = pgTable("lh_weekly_plans", {
  id: uuid("id").defaultRandom().primaryKey(),
  weekStart: text("week_start").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const lhClients = pgTable("lh_clients", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull().default(""),
  campType: text("camp_type").notNull().default(""),
  stats: text("stats").notNull().default(""),
  description: text("description").notNull().default(""),
  contacts: jsonb("contacts").notNull().$type<{ name: string; email: string }[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const lhClientFeedback = pgTable("lh_client_feedback", {
  id: uuid("id").defaultRandom().primaryKey(),
  clientId: uuid("client_id")
    .references(() => lhClients.id, { onDelete: "cascade" })
    .notNull(),
  prototype: text("prototype", {
    enum: ["smart-nudge", "parent-handbook", "general"],
  }).notNull(),
  body: text("body").notNull(),
  author: text("author").notNull(),
  callDate: text("call_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const lhPulseComments = pgTable("lh_pulse_comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  dayKey: text("day_key").notNull(),
  body: text("body").notNull(),
  author: text("author").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const lhSyncLog = pgTable("lh_sync_log", {
  id: uuid("id").defaultRandom().primaryKey(),
  syncedAt: timestamp("synced_at").defaultNow().notNull(),
  pagesAdded: integer("pages_added").notNull().default(0),
  pagesUpdated: integer("pages_updated").notNull().default(0),
  details: jsonb("details"),
});

export const lhPageSnapshots = pgTable("lh_page_snapshots", {
  id: uuid("id").defaultRandom().primaryKey(),
  pageId: uuid("page_id")
    .references(() => lhPages.id, { onDelete: "cascade" })
    .notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  snapshotAt: timestamp("snapshot_at").defaultNow().notNull(),
  changeType: text("change_type", {
    enum: ["created", "updated", "manual_edit"],
  }).notNull(),
});
