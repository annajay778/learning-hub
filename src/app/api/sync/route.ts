import { NextResponse } from "next/server";

export const maxDuration = 60; // Allow up to 60s on Vercel Pro

export async function POST() {
  if (!process.env.NOTION_API_KEY) {
    return NextResponse.json(
      { error: "Notion API key not configured." },
      { status: 501 }
    );
  }

  try {
    const { syncFromNotion } = await import("@/lib/sync");
    const result = await syncFromNotion();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Sync failed:", error);
    const message =
      error instanceof Error ? error.message : "Sync failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
