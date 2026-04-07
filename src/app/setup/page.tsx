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
  const tips = await getHotTips();
  return <SetupGuide tips={tips} />;
}
