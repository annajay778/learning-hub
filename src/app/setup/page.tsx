export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { getHotTips } from "@/lib/actions";
import { SetupGuide } from "@/components/setup/setup-guide";

export const metadata: Metadata = {
  title: "Setup Guide — Build to Learn",
  description:
    "11-step setup guide for Claude Code and the AI development workflow at Campminder.",
};

export default async function SetupPage() {
  // Hot tips is optional content; render the guide even if the DB read fails
  // (e.g., schema drift, table missing). Same defensive pattern as in layout/home.
  let tips: Awaited<ReturnType<typeof getHotTips>> = [];
  try {
    tips = await getHotTips();
  } catch (err) {
    console.error("[setup] getHotTips failed:", err instanceof Error ? err.message : err);
  }
  return <SetupGuide tips={tips} />;
}
