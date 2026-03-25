import { db } from "@/lib/db";
import { lhPages, lhSyncLog, lhPageSnapshots } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { fetchPageAsMarkdown, fetchChildPages } from "@/lib/notion";

// The two parent pages we sync — and their children recursively
const SYNC_ROOTS = [
  "327d23fa124b8081b436d810b509b69b", // PM Learnings along the way
  "325d23fa124b8035b85af4c457b976a4", // Create Template for AI Build to Learn Playbook
];

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

async function upsertPage(params: {
  notionPageId: string;
  title: string;
  body: string;
  type: "playbook" | "learning";
  author: string;
  notionLastEdited: Date;
}): Promise<"created" | "updated" | "skipped"> {
  const existing = await db
    .select({ id: lhPages.id, notionLastEdited: lhPages.notionLastEdited })
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
  if (row.notionLastEdited && params.notionLastEdited <= row.notionLastEdited) {
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

async function syncPage(
  pageId: string,
  details: SyncDetail[]
): Promise<{ added: number; updated: number }> {
  let added = 0;
  let updated = 0;

  try {
    const page = await fetchPageAsMarkdown(pageId);
    if (page.body.trim()) {
      const action = await upsertPage({
        notionPageId: pageId,
        title: page.title,
        body: page.body,
        type: "playbook",
        author: "Anna",
        notionLastEdited: new Date(page.lastEdited),
      });
      if (action === "created") added++;
      if (action === "updated") updated++;
      details.push({ title: page.title, action, notionPageId: pageId });
    }
  } catch (err) {
    console.log(`Skipping page ${pageId}: ${(err as Error).message}`);
  }

  return { added, updated };
}

export async function syncFromNotion(): Promise<SyncResult> {
  const details: SyncDetail[] = [];
  let totalAdded = 0;
  let totalUpdated = 0;

  for (const rootId of SYNC_ROOTS) {
    // Sync the root page itself
    console.log(`Syncing root ${rootId}...`);
    const rootResult = await syncPage(rootId, details);
    totalAdded += rootResult.added;
    totalUpdated += rootResult.updated;

    // Sync its direct children only (not recursive — too slow for serverless)
    try {
      const children = await fetchChildPages(rootId);
      // Limit to 10 children per root to stay within timeout
      const batch = children.slice(0, 10);
      console.log(`  Found ${children.length} children, syncing ${batch.length}`);
      for (const child of batch) {
        const childResult = await syncPage(child.id, details);
        totalAdded += childResult.added;
        totalUpdated += childResult.updated;
      }
    } catch (err) {
      console.log(`  Children fetch failed: ${(err as Error).message}`);
    }
  }

  // Write sync log
  await db.insert(lhSyncLog).values({
    pagesAdded: totalAdded,
    pagesUpdated: totalUpdated,
    details: details.filter((d) => d.action !== "skipped"),
  });

  console.log(`Sync complete: ${totalAdded} added, ${totalUpdated} updated`);
  return { added: totalAdded, updated: totalUpdated, details };
}
