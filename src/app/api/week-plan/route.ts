import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { lhWeeklyPlans } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";

// GET — public, returns the latest week plan
export async function GET() {
  const rows = await db
    .select()
    .from(lhWeeklyPlans)
    .orderBy(desc(lhWeeklyPlans.weekStart))
    .limit(1);

  return NextResponse.json(rows[0] ?? null);
}

// POST — secured, upserts a week plan
export async function POST(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key");
  const expectedKey = process.env.LEARNING_HUB_API_KEY;

  if (!expectedKey || apiKey !== expectedKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { weekStart, title, body } = await req.json();

  if (!weekStart || !title || !body) {
    return NextResponse.json(
      { error: "weekStart, title, and body are required" },
      { status: 400 }
    );
  }

  const existing = await db
    .select({ id: lhWeeklyPlans.id })
    .from(lhWeeklyPlans)
    .where(eq(lhWeeklyPlans.weekStart, weekStart))
    .limit(1);

  if (existing.length > 0) {
    const [plan] = await db
      .update(lhWeeklyPlans)
      .set({ title, body, updatedAt: new Date() })
      .where(eq(lhWeeklyPlans.weekStart, weekStart))
      .returning();
    return NextResponse.json(plan);
  }

  const [plan] = await db
    .insert(lhWeeklyPlans)
    .values({ weekStart, title, body })
    .returning();

  return NextResponse.json(plan, { status: 201 });
}
