import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { lhLearnings } from "@/lib/schema";
import { desc } from "drizzle-orm";

// GET /api/learnings — public, returns all entries reverse-chrono
export async function GET() {
  const entries = await db
    .select()
    .from(lhLearnings)
    .orderBy(desc(lhLearnings.date), desc(lhLearnings.createdAt))
    .limit(100);

  return NextResponse.json(entries);
}

// POST /api/learnings — requires LEARNING_HUB_API_KEY
export async function POST(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key");
  const expectedKey = process.env.LEARNING_HUB_API_KEY;

  if (!expectedKey || apiKey !== expectedKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const { date, title, bullets, tags, author, expandedContent } = body;

  if (!date || typeof date !== "string") {
    return NextResponse.json({ error: "date is required (YYYY-MM-DD)" }, { status: 400 });
  }
  if (!title || typeof title !== "string") {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }
  if (!Array.isArray(bullets) || bullets.length === 0) {
    return NextResponse.json({ error: "bullets must be a non-empty array of strings" }, { status: 400 });
  }
  if (!Array.isArray(tags)) {
    return NextResponse.json({ error: "tags must be an array of strings" }, { status: 400 });
  }

  const [learning] = await db
    .insert(lhLearnings)
    .values({
      date,
      title: title.trim(),
      bullets,
      tags,
      author: author || "AI-generated from daily notes",
      expandedContent: expandedContent || "",
    })
    .returning();

  return NextResponse.json(learning, { status: 201 });
}
