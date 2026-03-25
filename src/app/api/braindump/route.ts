import { NextRequest, NextResponse } from "next/server";
import { Client } from "@notionhq/client";

const NOTION_BRAINDUMP_PAGE_ID = "32ed23fa124b809382fef56b7d9dff38";

export async function POST(req: NextRequest) {
  const { body, author } = await req.json();

  if (!body?.trim()) {
    return NextResponse.json({ error: "Content is required" }, { status: 400 });
  }

  // Save to Notion
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

      await notion.blocks.children.append({
        block_id: NOTION_BRAINDUMP_PAGE_ID,
        children: [
          {
            object: "block",
            type: "callout",
            callout: {
              rich_text: [
                {
                  type: "text",
                  text: { content: body.trim() },
                },
              ],
              icon: { type: "emoji", emoji: "💭" },
              color: "gray_background",
            },
          },
          {
            object: "block",
            type: "paragraph",
            paragraph: {
              rich_text: [
                {
                  type: "text",
                  text: { content: `— ${author || "Anna"}, ${now}` },
                  annotations: { italic: true, color: "gray" },
                },
              ],
            },
          },
          {
            object: "block",
            type: "divider",
            divider: {},
          },
        ],
      });
    } catch (err) {
      console.error("Notion save failed:", (err as Error).message);
      // Don't block — still save to DB
    }
  }

  return NextResponse.json({ success: true });
}
