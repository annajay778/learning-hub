import { NextRequest, NextResponse } from "next/server";
import { Client } from "@notionhq/client";
import type { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";

const NOTION_BRAINDUMP_PAGE_ID = "32ed23fa124b809382fef56b7d9dff38";

export async function POST(req: NextRequest) {
  const { body, author } = await req.json();

  if (!body?.trim()) {
    return NextResponse.json({ error: "Content is required" }, { status: 400 });
  }

  const notionKey = process.env.NOTION_API_KEY;
  if (notionKey) {
    try {
      const notion = new Client({ auth: notionKey });
      const now = new Date().toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });

      // Get the first child block so we can insert after it (near the top)
      const children = await notion.blocks.children.list({
        block_id: NOTION_BRAINDUMP_PAGE_ID,
        page_size: 1,
      });

      const firstBlockId =
        children.results.length > 0
          ? (children.results[0] as BlockObjectResponse).id
          : undefined;

      const newBlocks = [
        {
          object: "block" as const,
          type: "callout" as const,
          callout: {
            rich_text: [
              {
                type: "text" as const,
                text: { content: body.trim() },
              },
            ],
            icon: { type: "emoji" as const, emoji: "💭" as const },
            color: "gray_background" as const,
          },
        },
        {
          object: "block" as const,
          type: "paragraph" as const,
          paragraph: {
            rich_text: [
              {
                type: "text" as const,
                text: { content: `— ${author || "Anna"}, ${now}` },
                annotations: {
                  bold: false,
                  italic: true,
                  strikethrough: false,
                  underline: false,
                  code: false,
                  color: "gray" as const,
                },
              },
            ],
          },
        },
        {
          object: "block" as const,
          type: "divider" as const,
          divider: {},
        },
      ];

      if (firstBlockId) {
        // Insert after the first block (position 2, near the top)
        await notion.blocks.children.append({
          block_id: NOTION_BRAINDUMP_PAGE_ID,
          after: firstBlockId,
          children: newBlocks,
        });
      } else {
        // Empty page — just append
        await notion.blocks.children.append({
          block_id: NOTION_BRAINDUMP_PAGE_ID,
          children: newBlocks,
        });
      }
    } catch (err) {
      console.error("Notion save failed:", (err as Error).message);
    }
  }

  return NextResponse.json({ success: true });
}
