import { db } from "@/lib/db";
import { lhPages, lhSyncLog, lhPageSnapshots } from "@/lib/schema";
import { eq } from "drizzle-orm";
import {
  NOTION_SOURCES,
  fetchPageAsMarkdown,
  fetchChildPages,
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

async function upsertPage(params: {
  notionPageId: string;
  title: string;
  body: string;
  type: "playbook" | "learning";
  author: string;
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
    const [page] = await db
      .insert(lhPages)
      .values({
        title: params.title,
        body: params.body,
        type: params.type,
        author: params.author,
        categoryId: null,
        notionPageId: params.notionPageId,
        notionLastEdited: params.notionLastEdited,
        source: "notion",
      })
      .returning({ id: lhPages.id });

    await db.insert(lhPageSnapshots).values({
      pageId: page.id,
      title: params.title,
      body: params.body,
      changeType: "created",
    });

    return "created";
  }

  const row = existing[0];
  if (
    row.notionLastEdited &&
    params.notionLastEdited <= row.notionLastEdited
  ) {
    return "skipped";
  }

  await db
    .update(lhPages)
    .set({
      title: params.title,
      body: params.body,
      notionLastEdited: params.notionLastEdited,
      updatedAt: new Date(),
    })
    .where(eq(lhPages.id, row.id));

  await db.insert(lhPageSnapshots).values({
    pageId: row.id,
    title: params.title,
    body: params.body,
    changeType: "updated",
  });

  return "updated";
}

// ── Sync a parent page + all nested children ────────────────────

async function syncPageTree(
  parentId: string,
  parentLabel: string,
  type: "playbook" | "learning",
  details: SyncDetail[]
): Promise<{ added: number; updated: number }> {
  let added = 0;
  let updated = 0;

  // Sync the parent page itself
  console.log(`Syncing ${parentLabel} (parent)...`);
  try {
    const parentPage = await fetchPageAsMarkdown(parentId);
    if (parentPage.body.trim()) {
      const action = await upsertPage({
        notionPageId: parentId,
        title: parentPage.title,
        body: parentPage.body,
        type,
        author: "Anna",
        notionLastEdited: new Date(parentPage.lastEdited),
      });
      if (action === "created") added++;
      if (action === "updated") updated++;
      details.push({
        title: parentPage.title,
        action,
        notionPageId: parentId,
      });
    }
  } catch (err) {
    console.error(`Failed to sync parent ${parentLabel}:`, err);
  }

  // Fetch and sync all nested child pages
  console.log(`Fetching child pages of ${parentLabel}...`);
  try {
    const children = await fetchChildPages(parentId);
    console.log(`Found ${children.length} child pages`);

    for (const child of children) {
      try {
        const page = await fetchPageAsMarkdown(child.id);
        const action = await upsertPage({
          notionPageId: child.id,
          title: page.title,
          body: page.body,
          type,
          author: "Anna",
          notionLastEdited: new Date(child.lastEdited),
        });
        if (action === "created") added++;
        if (action === "updated") updated++;
        details.push({
          title: page.title,
          action,
          notionPageId: child.id,
        });
      } catch (err) {
        console.error(`Failed to sync child page "${child.title}":`, err);
        details.push({
          title: child.title,
          action: "skipped",
          notionPageId: child.id,
        });
      }
    }
  } catch (err) {
    console.error(`Failed to fetch children of ${parentLabel}:`, err);
  }

  return { added, updated };
}

// ── Sync orchestrator ───────────────────────────────────────────

export async function syncFromNotion(): Promise<SyncResult> {
  const details: SyncDetail[] = [];
  let totalAdded = 0;
  let totalUpdated = 0;

  // 1. Sync playbook parent + all nested pages
  const playbook = await syncPageTree(
    NOTION_SOURCES.playbookParent,
    "AI PM Playbook",
    "playbook",
    details
  );
  totalAdded += playbook.added;
  totalUpdated += playbook.updated;

  // 2. Sync prototype parent + all nested pages
  const prototype = await syncPageTree(
    NOTION_SOURCES.prototypeParent,
    "Prototype Hub",
    "playbook",
    details
  );
  totalAdded += prototype.added;
  totalUpdated += prototype.updated;

  // Write sync log
  await db.insert(lhSyncLog).values({
    pagesAdded: totalAdded,
    pagesUpdated: totalUpdated,
    details: details.filter((d) => d.action !== "skipped"),
  });

  console.log(
    `Sync complete: ${totalAdded} added, ${totalUpdated} updated`
  );
  return { added: totalAdded, updated: totalUpdated, details };
}
