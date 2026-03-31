import type { Metadata } from "next";
import { SetupGuide } from "@/components/setup/setup-guide";

export const metadata: Metadata = {
  title: "Setup Guide — Build to Learn",
  description:
    "13-step setup guide for Claude Code and the AI development workflow at Campminder.",
};

export default function SetupPage() {
  return <SetupGuide />;
}
