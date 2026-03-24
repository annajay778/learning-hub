import { db } from "@/lib/db";
import { lhPages, lhSyncLog, lhPageSnapshots } from "@/lib/schema";
import { eq } from "drizzle-orm";
import {
  fetchPageAsMarkdown,
  fetchChildPages,
} from "@/lib/notion";
import { Client } from "@notionhq/client";

// Pages the integration CAN access
const ACCESSIBLE_PAGES = [
  // Initiative page (parent of everything)
  "304d23fa124b80e2a7e9ea2a2de48047",
  // Experiment brief
  "322d23fa124b80c3b45af2c9754f8374",
];

// Pages we WANT but may not have access to yet (in linked Tasks DB)
const DESIRED_PAGES = [
  "327d23fa124b8081b436d810b509b69b", // PM Learnings
  "325d23fa124b8035b85af4c457b976a4", // Playbook Template
  "327d23fa124b8124b83ddcf302358760", // AI PM Playbook
];

interface SyncDetail {
  title: string;
  action: "created" | "updated" | "skipped" | "error";
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

async function tryFetchPage(
  pageId: string,
  details: SyncDetail[]
): Promise<{ added: number; updated: number }> {
  let added = 0;
  let updated = 0;

  try {
    const page = await fetchPageAsMarkdown(pageId);
    if (!page.body.trim()) return { added, updated };

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

    // Try to fetch children
    try {
      const children = await fetchChildPages(pageId);
      for (const child of children) {
        try {
          const childPage = await fetchPageAsMarkdown(child.id);
          if (!childPage.body.trim()) continue;
          const childAction = await upsertPage({
            notionPageId: child.id,
            title: childPage.title,
            body: childPage.body,
            type: "playbook",
            author: "Anna",
            notionLastEdited: new Date(child.lastEdited),
          });
          if (childAction === "created") added++;
          if (childAction === "updated") updated++;
          details.push({ title: childPage.title, action: childAction, notionPageId: child.id });
        } catch {
          // Skip inaccessible children silently
        }
      }
    } catch {
      // Children not accessible — that's OK
    }
  } catch {
    // Page not accessible — skip silently
    console.log(`Page ${pageId} not accessible, skipping`);
  }

  return { added, updated };
}

export async function syncFromNotion(): Promise<SyncResult> {
  const details: SyncDetail[] = [];
  let totalAdded = 0;
  let totalUpdated = 0;

  // Also try search-based discovery for pages we can find
  const notion = new Client({ auth: process.env.NOTION_API_KEY });
  try {
    const searchResults = await notion.search({
      query: "AI",
      filter: { value: "page", property: "object" },
      page_size: 25,
    });

    const pageIds = new Set([
      ...ACCESSIBLE_PAGES,
      ...DESIRED_PAGES,
      ...searchResults.results.map((r) => r.id),
    ]);

    console.log(`Syncing ${pageIds.size} pages...`);

    for (const pageId of pageIds) {
      const result = await tryFetchPage(pageId, details);
      totalAdded += result.added;
      totalUpdated += result.updated;
    }
  } catch (err) {
    console.error("Search failed, falling back to known pages:", err);

    // Fallback: just try known pages
    for (const pageId of [...ACCESSIBLE_PAGES, ...DESIRED_PAGES]) {
      const result = await tryFetchPage(pageId, details);
      totalAdded += result.added;
      totalUpdated += result.updated;
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
