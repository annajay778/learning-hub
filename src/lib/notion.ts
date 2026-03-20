import { Client } from "@notionhq/client";
import type {
  BlockObjectResponse,
  RichTextItemResponse,
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export const NOTION_SOURCES = {
  aiPmPlaybook: "327d23fa124b8124b83ddcf302358760",
  extraPlaybookContent: "328d23fa124b80e3bd1ecefd9ed3ecb4",
  prototypeHub: "327d23fa124b80fa9472c44cb7edf511",
  chatHub: "327d23fa124b8044b412d1839d8c5322",
  transcriptHub: "327d23fa124b80f0833ee420d57375a8",
};

// Category mapping for AI PM Playbook sections
export const PLAYBOOK_SECTION_CATEGORIES: Record<string, string> = {
  "Working with an AI engineer": "Internal Process",
  "Technical setup and environment": "Technical",
  "Process: how to move fast": "Internal Process",
  "Product discovery with AI tools": "Internal Process",
  "Mistakes and course corrections": "Internal Process",
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
    case "to_do":
      const checked = block.to_do.checked ? "x" : " ";
      lines.push(
        `${indent}- [${checked}] ${richTextToMarkdown(block.to_do.rich_text)}`
      );
      break;
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
    case "code":
      const lang = block.code.language || "";
      lines.push(
        `\`\`\`${lang}\n${richTextToMarkdown(block.code.rich_text)}\n\`\`\``
      );
      break;
    case "divider":
      lines.push("---");
      break;
    case "image":
      const url =
        block.image.type === "external"
          ? block.image.external.url
          : block.image.file.url;
      lines.push(`![image](${url})`);
      break;
    default:
      // Skip unsupported block types silently
      break;
  }

  // Process children if any
  if (block.has_children) {
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
  const page = await notion.pages.retrieve({ page_id: pageId }) as PageObjectResponse;
  const lastEdited = page.last_edited_time;

  // Extract title
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

// ── Split playbook by H1 sections ──────────────────────────────

export function splitByH1(markdown: string): Array<{ title: string; body: string }> {
  const lines = markdown.split("\n");
  const sections: Array<{ title: string; body: string }> = [];
  let currentTitle = "";
  let currentLines: string[] = [];

  for (const line of lines) {
    const h1Match = line.match(/^# (.+)/);
    if (h1Match) {
      // Save previous section if it exists
      if (currentTitle) {
        sections.push({
          title: currentTitle,
          body: currentLines.join("\n").trim(),
        });
      }
      currentTitle = h1Match[1].trim();
      currentLines = [];
    } else if (currentTitle) {
      currentLines.push(line);
    }
    // Lines before first H1 are intro — skip them
  }

  // Save last section
  if (currentTitle) {
    sections.push({
      title: currentTitle,
      body: currentLines.join("\n").trim(),
    });
  }

  return sections;
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
          title = prop.title
            .map((t) => t.plain_text)
            .join("");
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
