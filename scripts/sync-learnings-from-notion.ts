import postgres from "postgres";
import dotenv from "dotenv";
import { Client } from "@notionhq/client";

dotenv.config({ path: ".env.local" });

const connectionString = process.env.POSTGRES_URL;
const notionKey = process.env.NOTION_API_KEY;

if (!connectionString) { console.error("POSTGRES_URL not set"); process.exit(1); }
if (!notionKey) { console.error("NOTION_API_KEY not set"); process.exit(1); }

const sql = postgres(connectionString, { max: 1 });
const notion = new Client({ auth: notionKey });

// Daily Learning Log page ID
const LEARNING_LOG_PAGE_ID = "327d23fa-124b-816d-acfd-c8f7fe86952b";

interface Block {
  id: string;
  type: string;
  [key: string]: unknown;
}

async function getBlocks(pageId: string): Promise<Block[]> {
  const blocks: Block[] = [];
  let cursor: string | undefined;
  do {
    const resp = await notion.blocks.children.list({
      block_id: pageId,
      page_size: 100,
      start_cursor: cursor,
    });
    blocks.push(...(resp.results as Block[]));
    cursor = resp.has_more ? resp.next_cursor ?? undefined : undefined;
  } while (cursor);
  return blocks;
}

function extractRichText(richText: Array<{ plain_text: string }>): string {
  return richText.map((t) => t.plain_text).join("");
}

interface LearningEntry {
  date: string;
  title: string;
  bullets: string[];
  tags: string[];
}

async function parseEntries(): Promise<LearningEntry[]> {
  const blocks = await getBlocks(LEARNING_LOG_PAGE_ID);
  const entries: LearningEntry[] = [];

  let currentDate = "";
  let currentDayName = "";
  let currentCategory = "";
  let currentBullets: string[] = [];
  let currentTags: string[] = [];

  function flushEntry() {
    if (currentDate && currentBullets.length > 0) {
      // Create title from first bullet's bold part or the date
      const firstBullet = currentBullets[0];
      const boldMatch = firstBullet.match(/^(.+?)\s*[—–-]\s*/);
      const title = boldMatch ? boldMatch[1] : `Learnings for ${currentDate}`;

      entries.push({
        date: currentDate,
        title,
        bullets: [...currentBullets],
        tags: [...currentTags],
      });
    }
    currentBullets = [];
    currentTags = [];
    currentCategory = "";
  }

  for (const block of blocks) {
    const type = block.type;

    if (type === "heading_2") {
      // Date header: "2026-04-07 — Tuesday"
      const text = extractRichText((block as any).heading_2.rich_text);
      const dateMatch = text.match(/^(\d{4}-\d{2}-\d{2})\s*[—–-]\s*(\w+)/);
      if (dateMatch) {
        flushEntry();
        currentDate = dateMatch[1];
        currentDayName = dateMatch[2];
      }
    } else if (type === "heading_3") {
      // Category header
      const text = extractRichText((block as any).heading_3.rich_text);
      currentCategory = text.trim();
      const tag = currentCategory.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      if (tag && !currentTags.includes(tag)) {
        currentTags.push(tag);
      }
    } else if (type === "bulleted_list_item") {
      const text = extractRichText((block as any).bulleted_list_item.rich_text);
      if (text.trim()) {
        currentBullets.push(text.trim());
      }
    }
  }
  // Flush last entry
  flushEntry();

  return entries;
}

async function main() {
  console.log("Fetching Daily Learning Log from Notion...");
  const entries = await parseEntries();
  console.log(`Found ${entries.length} entries in Notion.`);

  // Get existing dates in DB
  const existing = await sql`SELECT DISTINCT date FROM lh_learnings`;
  const existingDates = new Set(existing.map((r) => r.date));

  let added = 0;
  let skipped = 0;

  for (const entry of entries) {
    if (existingDates.has(entry.date)) {
      skipped++;
      continue;
    }

    await sql`
      INSERT INTO lh_learnings (date, title, bullets, tags, author, expanded_content)
      VALUES (
        ${entry.date},
        ${entry.title},
        ${JSON.stringify(entry.bullets)}::jsonb,
        ${JSON.stringify(entry.tags)}::jsonb,
        ${"AI-generated from daily notes"},
        ${""}
      )
    `;
    console.log(`  + ${entry.date}: ${entry.title}`);
    added++;
  }

  console.log(`\nDone! ${added} added, ${skipped} already existed.`);
  await sql.end();
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
