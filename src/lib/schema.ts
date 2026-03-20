import {
  pgTable,
  text,
  timestamp,
  uuid,
  boolean,
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
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
