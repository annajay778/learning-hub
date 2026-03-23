"use server";

import { db } from "@/lib/db";
import {
  lhPages,
  lhCategories,
  lhSyncLog,
  lhPageSnapshots,
  lhCoachNotes,
  lhDemoLinks,
  lhLearnings,
} from "@/lib/schema";
import { eq, desc, and, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// ── Page Queries ────────────────────────────────────────────────

export async function getPages(type?: "playbook" | "learning") {
  const conditions = type ? eq(lhPages.type, type) : undefined;
  return db
    .select({
      id: lhPages.id,
      title: lhPages.title,
      body: lhPages.body,
      categoryId: lhPages.categoryId,
      type: lhPages.type,
      author: lhPages.author,
      pinned: lhPages.pinned,
      moduleSlug: lhPages.moduleSlug,
      createdAt: lhPages.createdAt,
      updatedAt: lhPages.updatedAt,
      categoryName: lhCategories.name,
      categoryColor: lhCategories.color,
    })
    .from(lhPages)
    .leftJoin(lhCategories, eq(lhPages.categoryId, lhCategories.id))
    .where(conditions)
    .orderBy(desc(lhPages.createdAt));
}

export async function getPage(id: string) {
  const rows = await db
    .select({
      id: lhPages.id,
      title: lhPages.title,
      body: lhPages.body,
      categoryId: lhPages.categoryId,
      type: lhPages.type,
      author: lhPages.author,
      pinned: lhPages.pinned,
      moduleSlug: lhPages.moduleSlug,
      createdAt: lhPages.createdAt,
      updatedAt: lhPages.updatedAt,
      categoryName: lhCategories.name,
      categoryColor: lhCategories.color,
    })
    .from(lhPages)
    .leftJoin(lhCategories, eq(lhPages.categoryId, lhCategories.id))
    .where(eq(lhPages.id, id))
    .limit(1);

  return rows[0] ?? null;
}

export async function getPinnedPlaybooks() {
  return db
    .select({
      id: lhPages.id,
      title: lhPages.title,
      body: lhPages.body,
      categoryId: lhPages.categoryId,
      type: lhPages.type,
      author: lhPages.author,
      pinned: lhPages.pinned,
      moduleSlug: lhPages.moduleSlug,
      createdAt: lhPages.createdAt,
      updatedAt: lhPages.updatedAt,
      categoryName: lhCategories.name,
      categoryColor: lhCategories.color,
    })
    .from(lhPages)
    .leftJoin(lhCategories, eq(lhPages.categoryId, lhCategories.id))
    .where(and(eq(lhPages.type, "playbook"), eq(lhPages.pinned, true)))
    .orderBy(desc(lhPages.updatedAt));
}

export async function getCategories() {
  return db
    .select()
    .from(lhCategories)
    .orderBy(lhCategories.name);
}

export async function getModulePages(slug: string) {
  return db
    .select({
      id: lhPages.id,
      title: lhPages.title,
      body: lhPages.body,
      categoryId: lhPages.categoryId,
      type: lhPages.type,
      author: lhPages.author,
      pinned: lhPages.pinned,
      moduleSlug: lhPages.moduleSlug,
      createdAt: lhPages.createdAt,
      updatedAt: lhPages.updatedAt,
      categoryName: lhCategories.name,
      categoryColor: lhCategories.color,
    })
    .from(lhPages)
    .leftJoin(lhCategories, eq(lhPages.categoryId, lhCategories.id))
    .where(eq(lhPages.moduleSlug, slug))
    .orderBy(desc(lhPages.updatedAt));
}

export async function getModulePageCounts() {
  const rows = await db
    .select({
      moduleSlug: lhPages.moduleSlug,
      count: sql<number>`count(*)::int`,
    })
    .from(lhPages)
    .where(sql`${lhPages.moduleSlug} IS NOT NULL`)
    .groupBy(lhPages.moduleSlug);

  const counts: Record<string, number> = {};
  for (const row of rows) {
    if (row.moduleSlug) counts[row.moduleSlug] = row.count;
  }
  return counts;
}

// ── What's New ──────────────────────────────────────────────────

export async function getWhatsNew(limit = 30) {
  const snapshots = await db
    .select({
      id: lhPageSnapshots.id,
      pageId: lhPageSnapshots.pageId,
      title: lhPageSnapshots.title,
      snapshotAt: lhPageSnapshots.snapshotAt,
      changeType: lhPageSnapshots.changeType,
      pageTitle: lhPages.title,
      pageType: lhPages.type,
      source: lhPages.source,
    })
    .from(lhPageSnapshots)
    .leftJoin(lhPages, eq(lhPageSnapshots.pageId, lhPages.id))
    .orderBy(desc(lhPageSnapshots.snapshotAt))
    .limit(limit);

  return snapshots;
}

// ── Page Mutations ──────────────────────────────────────────────

export async function createPage(formData: FormData) {
  const title = formData.get("title") as string;
  const body = formData.get("body") as string;
  const type = formData.get("type") as "playbook" | "learning";
  const author = formData.get("author") as string;
  const categoryId = formData.get("categoryId") as string | null;
  const moduleSlug = formData.get("moduleSlug") as string | null;

  if (!title?.trim()) return { error: "Title is required" };
  if (!type) return { error: "Type is required" };

  const [page] = await db
    .insert(lhPages)
    .values({
      title: title.trim(),
      body: body?.trim() || "",
      type,
      author: author || "Anna",
      categoryId: categoryId || null,
      moduleSlug: moduleSlug || null,
    })
    .returning();

  revalidatePath("/");
  revalidatePath("/learn");
  revalidatePath("/whats-new");
  revalidatePath("/playbooks");
  revalidatePath("/learnings");

  return { page };
}

export async function updatePage(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const body = formData.get("body") as string;
  const categoryId = formData.get("categoryId") as string | null;
  const moduleSlug = formData.get("moduleSlug") as string | null;

  if (!title?.trim()) return { error: "Title is required" };

  const [page] = await db
    .update(lhPages)
    .set({
      title: title.trim(),
      body: body?.trim() || "",
      categoryId: categoryId || null,
      moduleSlug: moduleSlug || null,
      updatedAt: new Date(),
    })
    .where(eq(lhPages.id, id))
    .returning();

  // Save snapshot for journey tracking
  await db.insert(lhPageSnapshots).values({
    pageId: id,
    title: title.trim(),
    body: body?.trim() || "",
    changeType: "manual_edit",
  });

  revalidatePath("/");
  revalidatePath("/learn");
  revalidatePath("/whats-new");
  revalidatePath("/timeline");
  revalidatePath("/playbooks");
  revalidatePath("/learnings");
  revalidatePath(`/pages/${id}`);

  return { page };
}

export async function deletePage(id: string) {
  await db.delete(lhPages).where(eq(lhPages.id, id));

  revalidatePath("/");
  revalidatePath("/learn");
  revalidatePath("/whats-new");
  revalidatePath("/playbooks");
  revalidatePath("/learnings");
}

export async function togglePin(id: string) {
  const page = await db
    .select({ pinned: lhPages.pinned })
    .from(lhPages)
    .where(eq(lhPages.id, id))
    .limit(1);

  if (!page[0]) return;

  await db
    .update(lhPages)
    .set({ pinned: !page[0].pinned, updatedAt: new Date() })
    .where(eq(lhPages.id, id));

  revalidatePath("/");
  revalidatePath("/playbooks");
  revalidatePath(`/pages/${id}`);
}

export async function createCategory(formData: FormData) {
  const name = formData.get("name") as string;
  const color = (formData.get("color") as string) || "#6B7280";

  if (!name?.trim()) return { error: "Name is required" };

  const [category] = await db
    .insert(lhCategories)
    .values({ name: name.trim(), color })
    .returning();

  revalidatePath("/playbooks");

  return { category };
}

// ── Coach Notes ─────────────────────────────────────────────────

export async function getCoachNotes() {
  return db
    .select()
    .from(lhCoachNotes)
    .orderBy(desc(lhCoachNotes.createdAt));
}

export async function createCoachNote(formData: FormData) {
  const body = formData.get("body") as string;
  const author = (formData.get("author") as string) || "Stephanie";

  if (!body?.trim()) return { error: "Body is required" };

  const [note] = await db
    .insert(lhCoachNotes)
    .values({
      body: body.trim(),
      author,
    })
    .returning();

  revalidatePath("/coach");

  return { note };
}

export async function toggleCoachNoteReviewed(id: string) {
  const note = await db
    .select({ reviewed: lhCoachNotes.reviewed })
    .from(lhCoachNotes)
    .where(eq(lhCoachNotes.id, id))
    .limit(1);

  if (!note[0]) return;

  await db
    .update(lhCoachNotes)
    .set({ reviewed: !note[0].reviewed })
    .where(eq(lhCoachNotes.id, id));

  revalidatePath("/coach");
}

// ── Learnings ───────────────────────────────────────────────────

export async function getLearnings(limit = 50) {
  return db
    .select()
    .from(lhLearnings)
    .orderBy(desc(lhLearnings.date), desc(lhLearnings.createdAt))
    .limit(limit);
}

export async function createLearning(data: {
  date: string;
  title: string;
  bullets: string[];
  tags: string[];
  author?: string;
  expandedContent?: string;
}) {
  const [learning] = await db
    .insert(lhLearnings)
    .values({
      date: data.date,
      title: data.title,
      bullets: data.bullets,
      tags: data.tags,
      author: data.author || "AI-generated from daily notes",
      expandedContent: data.expandedContent || "",
    })
    .returning();

  revalidatePath("/");

  return { learning };
}

// ── Demo Links ──────────────────────────────────────────────────

export async function getDemoLinks() {
  return db
    .select()
    .from(lhDemoLinks)
    .orderBy(desc(lhDemoLinks.createdAt));
}

export async function createDemoLink(formData: FormData) {
  const title = formData.get("title") as string;
  const url = formData.get("url") as string;
  const description = (formData.get("description") as string) || "";
  const linkType =
    (formData.get("linkType") as "demo" | "prototype" | "resource") || "demo";
  const author = formData.get("author") as string;

  if (!title?.trim()) return { error: "Title is required" };
  if (!url?.trim()) return { error: "URL is required" };
  if (!author?.trim()) return { error: "Name is required" };

  const [link] = await db
    .insert(lhDemoLinks)
    .values({
      title: title.trim(),
      url: url.trim(),
      description: description.trim(),
      linkType,
      author: author.trim(),
    })
    .returning();

  revalidatePath("/whats-new");

  return { link };
}

export async function deleteDemoLink(id: string) {
  await db.delete(lhDemoLinks).where(eq(lhDemoLinks.id, id));
  revalidatePath("/whats-new");
}

// ── Sync & Journey Queries ──────────────────────────────────────

export async function getLastSync() {
  const rows = await db
    .select()
    .from(lhSyncLog)
    .orderBy(desc(lhSyncLog.syncedAt))
    .limit(1);
  return rows[0] ?? null;
}

export async function getSnapshots() {
  return db
    .select({
      id: lhPageSnapshots.id,
      pageId: lhPageSnapshots.pageId,
      title: lhPageSnapshots.title,
      snapshotAt: lhPageSnapshots.snapshotAt,
      changeType: lhPageSnapshots.changeType,
      pageTitle: lhPages.title,
      pageType: lhPages.type,
      source: lhPages.source,
    })
    .from(lhPageSnapshots)
    .leftJoin(lhPages, eq(lhPageSnapshots.pageId, lhPages.id))
    .orderBy(desc(lhPageSnapshots.snapshotAt));
}

export async function getSyncLogs() {
  return db
    .select()
    .from(lhSyncLog)
    .orderBy(desc(lhSyncLog.syncedAt));
}
