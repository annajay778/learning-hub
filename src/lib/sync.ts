import { db } from "@/lib/db";
import { lhPages, lhCategories, lhSyncLog, lhPageSnapshots } from "@/lib/schema";
import { eq } from "drizzle-orm";
import {
  NOTION_SOURCES,
  PLAYBOOK_SECTION_CATEGORIES,
  fetchPageAsMarkdown,
  splitByH1,
  fetchDatabasePages,
} from "@/lib/notion";

interface SyncDetail {
  title: string;
  action: "created" | "updated" | "skipped";
  notionPageId: string;
}

interface SyncResult {
  added: number;
  updated: number;
  details: SyncDetail[];
}

// ── Helpers ─────────────────────────────────────────────────────

async function getCategoryId(name: string): Promise<string | null> {
  const rows = await db
    .select({ id: lhCategories.id })
    .from(lhCategories)
    .where(eq(lhCategories.name, name))
    .limit(1);
  return rows[0]?.id ?? null;
}

async function upsertPage(params: {
  notionPageId: string;
  title: string;
  body: string;
  type: "playbook" | "learning";
  author: string;
  categoryId: string | null;
  notionLastEdited: Date;
}): Promise<"created" | "updated" | "skipped"> {
  const existing = await db
    .select({
      id: lhPages.id,
      notionLastEdited: lhPages.notionLastEdited,
    })
    .from(lhPages)
    .where(eq(lhPages.notionPageId, params.notionPageId))
    .limit(1);

  if (existing.length === 0) {
    // INSERT
    const [page] = await db
      .insert(lhPages)
      .values({
        title: params.title,
        body: params.body,
        type: params.type,
        author: params.author,
        categoryId: params.categoryId,
        notionPageId: params.notionPageId,
        notionLastEdited: params.notionLastEdited,
        source: "notion",
      })
      .returning({ id: lhPages.id });

    // Create snapshot
    await db.insert(lhPageSnapshots).values({
      pageId: page.id,
      title: params.title,
      body: params.body,
      changeType: "created",
    });

    return "created";
  }

  // Check if newer
  const row = existing[0];
  if (
    row.notionLastEdited &&
    params.notionLastEdited <= row.notionLastEdited
  ) {
    return "skipped";
  }

  // UPDATE
  await db
    .update(lhPages)
    .set({
      title: params.title,
      body: params.body,
      categoryId: params.categoryId,
      notionLastEdited: params.notionLastEdited,
      updatedAt: new Date(),
    })
    .where(eq(lhPages.id, row.id));

  // Create snapshot
  await db.insert(lhPageSnapshots).values({
    pageId: row.id,
    title: params.title,
    body: params.body,
    changeType: "updated",
  });

  return "updated";
}

// ── Sync orchestrator ───────────────────────────────────────────

export async function syncFromNotion(): Promise<SyncResult> {
  const details: SyncDetail[] = [];
  let added = 0;
  let updated = 0;

  // 1. AI PM Playbook — split by H1 sections
  console.log("Syncing AI PM Playbook...");
  const playbook = await fetchPageAsMarkdown(NOTION_SOURCES.aiPmPlaybook);
  const sections = splitByH1(playbook.body);

  for (const section of sections) {
    const categoryName =
      PLAYBOOK_SECTION_CATEGORIES[section.title.toLowerCase()] ||
      PLAYBOOK_SECTION_CATEGORIES[
        Object.keys(PLAYBOOK_SECTION_CATEGORIES).find((k) =>
          section.title.toLowerCase().includes(k.split(":")[0].toLowerCase())
        ) ?? ""
      ] ||
      "Internal Process";
    const categoryId = await getCategoryId(categoryName);

    // Use a synthetic notion_page_id for sections: playbook_id + section_title_hash
    const sectionId = `${NOTION_SOURCES.aiPmPlaybook}__${section.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")}`;

    const action = await upsertPage({
      notionPageId: sectionId,
      title: section.title,
      body: section.body,
      type: "playbook",
      author: "Anna",
      categoryId,
      notionLastEdited: new Date(playbook.lastEdited),
    });

    if (action === "created") added++;
    if (action === "updated") updated++;
    details.push({ title: section.title, action, notionPageId: sectionId });
  }

  // 2. Extra Playbook Content — single playbook
  console.log("Syncing Extra Playbook Content...");
  const extra = await fetchPageAsMarkdown(NOTION_SOURCES.extraPlaybookContent);
  const contentCategoryId = await getCategoryId("Content");
  const extraAction = await upsertPage({
    notionPageId: NOTION_SOURCES.extraPlaybookContent,
    title: extra.title,
    body: extra.body,
    type: "playbook",
    author: "Anna",
    categoryId: contentCategoryId,
    notionLastEdited: new Date(extra.lastEdited),
  });
  if (extraAction === "created") added++;
  if (extraAction === "updated") updated++;
  details.push({
    title: extra.title,
    action: extraAction,
    notionPageId: NOTION_SOURCES.extraPlaybookContent,
  });

  // 3. Prototype Hub — individual playbooks
  console.log("Syncing Prototype Hub...");
  const protoDocs = await fetchDatabasePages(NOTION_SOURCES.prototypeHub);
  for (const doc of protoDocs) {
    const page = await fetchPageAsMarkdown(doc.id);

    // Map Notion category to our categories
    let categoryName = "Prototype";
    if (doc.categories.includes("Strategy doc")) categoryName = "Strategy";
    else if (doc.categories.includes("Planning")) categoryName = "Planning";
    else if (doc.categories.includes("Customer research"))
      categoryName = "Data";
    const categoryId = await getCategoryId(categoryName);

    const action = await upsertPage({
      notionPageId: doc.id,
      title: page.title,
      body: page.body,
      type: "playbook",
      author: "Spencer",
      categoryId,
      notionLastEdited: new Date(doc.lastEdited),
    });
    if (action === "created") added++;
    if (action === "updated") updated++;
    details.push({ title: page.title, action, notionPageId: doc.id });
  }

  // 4. Chat Hub — daily learnings
  console.log("Syncing Chat Hub...");
  const chatDocs = await fetchDatabasePages(NOTION_SOURCES.chatHub);
  for (const doc of chatDocs) {
    const page = await fetchPageAsMarkdown(doc.id);
    const action = await upsertPage({
      notionPageId: doc.id,
      title: page.title,
      body: page.body,
      type: "learning",
      author: "Spencer",
      categoryId: null,
      notionLastEdited: new Date(doc.lastEdited),
    });
    if (action === "created") added++;
    if (action === "updated") updated++;
    details.push({ title: page.title, action, notionPageId: doc.id });
  }

  // 5. Transcript Hub — daily learnings
  console.log("Syncing Transcript Hub...");
  const transcriptDocs = await fetchDatabasePages(
    NOTION_SOURCES.transcriptHub
  );
  for (const doc of transcriptDocs) {
    const page = await fetchPageAsMarkdown(doc.id);
    const action = await upsertPage({
      notionPageId: doc.id,
      title: page.title,
      body: page.body,
      type: "learning",
      author: "Anna",
      categoryId: null,
      notionLastEdited: new Date(doc.lastEdited),
    });
    if (action === "created") added++;
    if (action === "updated") updated++;
    details.push({ title: page.title, action, notionPageId: doc.id });
  }

  // Write sync log
  await db.insert(lhSyncLog).values({
    pagesAdded: added,
    pagesUpdated: updated,
    details: details.filter((d) => d.action !== "skipped"),
  });

  console.log(`Sync complete: ${added} added, ${updated} updated`);
  return { added, updated, details };
}
