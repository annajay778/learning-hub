import { db } from "@/lib/db";
import { lhPages, lhSyncLog, lhPageSnapshots } from "@/lib/schema";
import { eq } from "drizzle-orm";
import {
  fetchPageAsMarkdown,
  fetchDatabasePages,
} from "@/lib/notion";
import { Client } from "@notionhq/client";
import type { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";

// The two parent pages we sync
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

// Check if a page needs syncing (new or updated) WITHOUT fetching content
async function needsSync(notionPageId: string, lastEdited: string): Promise<boolean> {
  const existing = await db
    .select({ notionLastEdited: lhPages.notionLastEdited })
    .from(lhPages)
    .where(eq(lhPages.notionPageId, notionPageId))
    .limit(1);

  if (existing.length === 0) return true;
  const row = existing[0];
  if (!row.notionLastEdited) return true;
  return new Date(lastEdited) > row.notionLastEdited;
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

  const notion = new Client({ auth: process.env.NOTION_API_KEY });

  for (const rootId of SYNC_ROOTS) {
    console.log(`Syncing root ${rootId}...`);

    // Sync the root page
    const rootResult = await syncPage(rootId, details);
    totalAdded += rootResult.added;
    totalUpdated += rootResult.updated;

    // Get all blocks to find child pages AND child databases
    let blocks: BlockObjectResponse[] = [];
    try {
      const response = await notion.blocks.children.list({
        block_id: rootId,
        page_size: 100,
      });
      blocks = response.results.filter(
        (b): b is BlockObjectResponse => "type" in b
      );
    } catch (err) {
      console.log(`  Failed to list children: ${(err as Error).message}`);
      continue;
    }

    // Sync child pages
    const childPages = blocks.filter((b) => b.type === "child_page");
    console.log(`  ${childPages.length} child pages`);
    for (const block of childPages) {
      const result = await syncPage(block.id, details);
      totalAdded += result.added;
      totalUpdated += result.updated;
    }

    // Sync child databases — query each for pages, only fetch content if changed
    const childDbs = blocks.filter((b) => b.type === "child_database");
    console.log(`  ${childDbs.length} child databases`);
    for (const dbBlock of childDbs) {
      try {
        const dbPages = await fetchDatabasePages(dbBlock.id);
        console.log(`    DB ${dbBlock.id}: ${dbPages.length} pages`);

        // Only fetch full content for pages that are new or updated
        for (const dbPage of dbPages) {
          const needs = await needsSync(dbPage.id, dbPage.lastEdited);
          if (!needs) {
            details.push({
              title: dbPage.title,
              action: "skipped",
              notionPageId: dbPage.id,
            });
            continue;
          }

          const result = await syncPage(dbPage.id, details);
          totalAdded += result.added;
          totalUpdated += result.updated;
        }
      } catch (err) {
        console.log(`    DB ${dbBlock.id} failed: ${(err as Error).message}`);
      }
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
