"use server";

import { db } from "@/lib/db";
import { lhPages, lhCategories } from "@/lib/schema";
import { eq, desc, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// ── Queries ─────────────────────────────────────────────────────

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

// ── Mutations ───────────────────────────────────────────────────

export async function createPage(formData: FormData) {
  const title = formData.get("title") as string;
  const body = formData.get("body") as string;
  const type = formData.get("type") as "playbook" | "learning";
  const author = formData.get("author") as string;
  const categoryId = formData.get("categoryId") as string | null;

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
    })
    .returning();

  revalidatePath("/");
  revalidatePath("/playbooks");
  revalidatePath("/learnings");

  return { page };
}

export async function updatePage(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const body = formData.get("body") as string;
  const categoryId = formData.get("categoryId") as string | null;

  if (!title?.trim()) return { error: "Title is required" };

  const [page] = await db
    .update(lhPages)
    .set({
      title: title.trim(),
      body: body?.trim() || "",
      categoryId: categoryId || null,
      updatedAt: new Date(),
    })
    .where(eq(lhPages.id, id))
    .returning();

  revalidatePath("/");
  revalidatePath("/playbooks");
  revalidatePath("/learnings");
  revalidatePath(`/pages/${id}`);

  return { page };
}

export async function deletePage(id: string) {
  await db.delete(lhPages).where(eq(lhPages.id, id));

  revalidatePath("/");
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
