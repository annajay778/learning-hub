export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { getHotTips } from "@/lib/actions";
import { SetupGuideWindows } from "@/components/setup/setup-guide-windows";

export const metadata: Metadata = {
  title: "Setup Guide (Windows) — Build to Learn",
  description: "13-step setup guide for Claude Code on Windows.",
};

export default async function SetupWindowsPage() {
  const tips = await getHotTips();
  return <SetupGuideWindows tips={tips} />;
}
