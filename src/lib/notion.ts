import { Client } from "@notionhq/client";
import type {
  BlockObjectResponse,
  RichTextItemResponse,
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

// The two parent pages we sync from
export const NOTION_SOURCES = {
  // "AI PM Playbook" parent page and its nested children
  playbookParent: "327d23fa124b8081b436d810b509b69b",
  // "Prototype Hub" parent page and its nested children
  prototypeParent: "325d23fa124b8035b85af4c457b976a4",
};

// ── Rich text → plain markdown ─────────────────────────────────

function richTextToMarkdown(richTexts: RichTextItemResponse[]): string {
  return richTexts
    .map((rt) => {
      let text = rt.plain_text;
      if (rt.annotations.bold) text = `**${text}**`;
      if (rt.annotations.italic) text = `*${text}*`;
      if (rt.annotations.code) text = `\`${text}\``;
      if (rt.annotations.strikethrough) text = `~~${text}~~`;
      if (rt.href) text = `[${text}](${rt.href})`;
      return text;
    })
    .join("");
}

// ── Block tree → Markdown ──────────────────────────────────────

async function fetchAllBlocks(blockId: string): Promise<BlockObjectResponse[]> {
  const blocks: BlockObjectResponse[] = [];
  let cursor: string | undefined;

  try {
    do {
      const response = await notion.blocks.children.list({
        block_id: blockId,
        start_cursor: cursor,
        page_size: 100,
      });
      blocks.push(
        ...response.results.filter(
          (b): b is BlockObjectResponse => "type" in b
        )
      );
      cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
    } while (cursor);
  } catch (err) {
    // Some blocks (ai_block, etc.) aren't supported by the API — return what we got
    console.log(`Warning: couldn't fetch all blocks for ${blockId}:`, (err as Error).message);
  }

  return blocks;
}

async function blockToMarkdown(
  block: BlockObjectResponse,
  indent = ""
): Promise<string> {
  const lines: string[] = [];

  switch (block.type) {
    case "paragraph":
      lines.push(indent + richTextToMarkdown(block.paragraph.rich_text));
      break;
    case "heading_1":
      lines.push(`# ${richTextToMarkdown(block.heading_1.rich_text)}`);
      break;
    case "heading_2":
      lines.push(`## ${richTextToMarkdown(block.heading_2.rich_text)}`);
      break;
    case "heading_3":
      lines.push(`### ${richTextToMarkdown(block.heading_3.rich_text)}`);
      break;
    case "bulleted_list_item":
      lines.push(
        `${indent}- ${richTextToMarkdown(block.bulleted_list_item.rich_text)}`
      );
      break;
    case "numbered_list_item":
      lines.push(
        `${indent}1. ${richTextToMarkdown(block.numbered_list_item.rich_text)}`
      );
      break;
    case "to_do": {
      const checked = block.to_do.checked ? "x" : " ";
      lines.push(
        `${indent}- [${checked}] ${richTextToMarkdown(block.to_do.rich_text)}`
      );
      break;
    }
    case "toggle":
      lines.push(
        `${indent}**${richTextToMarkdown(block.toggle.rich_text)}**`
      );
      break;
    case "quote":
      lines.push(
        `> ${richTextToMarkdown(block.quote.rich_text)}`
      );
      break;
    case "callout":
      lines.push(
        `> ${richTextToMarkdown(block.callout.rich_text)}`
      );
      break;
    case "code": {
      const lang = block.code.language || "";
      lines.push(
        `\`\`\`${lang}\n${richTextToMarkdown(block.code.rich_text)}\n\`\`\``
      );
      break;
    }
    case "divider":
      lines.push("---");
      break;
    case "image": {
      const url =
        block.image.type === "external"
          ? block.image.external.url
          : block.image.file.url;
      lines.push(`![image](${url})`);
      break;
    }
    case "child_page":
      // Child pages are fetched separately — just note them
      lines.push(`**[Subpage: ${block.child_page.title}]**`);
      break;
    case "child_database":
      // Skip child databases in markdown output
      break;
    default:
      break;
  }

  // Process children if any (except child_page which we handle separately)
  if (block.has_children && block.type !== "child_page") {
    const children = await fetchAllBlocks(block.id);
    for (const child of children) {
      lines.push(await blockToMarkdown(child, indent + "  "));
    }
  }

  return lines.join("\n");
}

export async function blocksToMarkdown(
  blocks: BlockObjectResponse[]
): Promise<string> {
  const parts: string[] = [];
  for (const block of blocks) {
    const md = await blockToMarkdown(block);
    if (md) parts.push(md);
  }
  return parts.join("\n\n").trim();
}

// ── Fetch a single page as markdown ────────────────────────────

export async function fetchPageAsMarkdown(pageId: string): Promise<{
  title: string;
  body: string;
  lastEdited: string;
}> {
  const page = (await notion.pages.retrieve({
    page_id: pageId,
  })) as PageObjectResponse;
  const lastEdited = page.last_edited_time;

  let title = "Untitled";
  for (const prop of Object.values(page.properties)) {
    if (prop.type === "title") {
      title = prop.title.map((t) => t.plain_text).join("");
      break;
    }
  }

  const blocks = await fetchAllBlocks(pageId);
  const body = await blocksToMarkdown(blocks);

  return { title, body, lastEdited };
}

// ── Fetch child pages from a parent page (recursive) ───────────

export async function fetchChildPages(
  parentPageId: string
): Promise<
  Array<{
    id: string;
    title: string;
    lastEdited: string;
  }>
> {
  const results: Array<{
    id: string;
    title: string;
    lastEdited: string;
  }> = [];

  const blocks = await fetchAllBlocks(parentPageId);

  for (const block of blocks) {
    if (block.type === "child_page") {
      try {
        const page = (await notion.pages.retrieve({
          page_id: block.id,
        })) as PageObjectResponse;

        results.push({
          id: block.id,
          title: block.child_page.title,
          lastEdited: page.last_edited_time,
        });
      } catch {
        // Skip inaccessible child pages
      }
    }
    // Skip child_database — too many API calls for serverless
  }

  return results;
}

// ── Fetch all pages from a Notion database ─────────────────────

export async function fetchDatabasePages(databaseId: string): Promise<
  Array<{
    id: string;
    title: string;
    lastEdited: string;
    categories: string[];
  }>
> {
  const pages: Array<{
    id: string;
    title: string;
    lastEdited: string;
    categories: string[];
  }> = [];

  let cursor: string | undefined;

  do {
    const response = await notion.databases.query({
      database_id: databaseId,
      start_cursor: cursor,
      page_size: 100,
    });

    for (const page of response.results) {
      if (!("properties" in page)) continue;
      const pageObj = page as PageObjectResponse;

      let title = "Untitled";
      const categories: string[] = [];

      for (const prop of Object.values(pageObj.properties)) {
        if (prop.type === "title") {
          title = prop.title.map((t) => t.plain_text).join("");
        }
        if (prop.type === "multi_select") {
          for (const opt of prop.multi_select) {
            categories.push(opt.name);
          }
        }
      }

      pages.push({
        id: pageObj.id,
        title,
        lastEdited: pageObj.last_edited_time,
        categories,
      });
    }

    cursor = response.has_more
      ? response.next_cursor ?? undefined
      : undefined;
  } while (cursor);

  return pages;
}
