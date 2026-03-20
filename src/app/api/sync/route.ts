import { syncFromNotion } from "@/lib/sync";
import { NextResponse } from "next/server";

export async function POST() {
  if (!process.env.NOTION_API_KEY) {
    return NextResponse.json(
      { error: "NOTION_API_KEY is not configured" },
      { status: 500 }
    );
  }

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
