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
