import { NextResponse } from "next/server";

export async function POST() {
  // Notion API sync requires NOTION_API_KEY (internal integration token).
  // Until that's set up, syncs are done manually via Claude MCP:
  //   npx tsx scripts/sync-from-notion.ts
  if (!process.env.NOTION_API_KEY) {
    return NextResponse.json(
      {
        error:
          "Notion API key not configured yet. Ask Claude to run the sync script instead.",
      },
      { status: 501 }
    );
  }

  // When NOTION_API_KEY is available, this will use the live sync engine
  const { syncFromNotion } = await import("@/lib/sync");
  try {
    const result = await syncFromNotion();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Sync failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Sync failed" },
      { status: 500 }
    );
  }
}
