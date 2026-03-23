import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/nav-bar";
import { getLastSync } from "@/lib/actions";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Build to Learn Experiment Hub",
  description:
    "Everything we're learning building AI-powered tools at Campminder. Updated daily.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lastSync = await getLastSync();

  return (
    <html
      lang="en"
      className={`${inter.variable} ${lora.variable} h-full antialiased`}
      style={{ ["--font-heading" as string]: "var(--font-serif)" }}
    >
      <body className="flex min-h-full flex-col">
        <NavBar lastSyncedAt={lastSync?.syncedAt?.toISOString() ?? null} />
        {children}
      </body>
    </html>
  );
}
