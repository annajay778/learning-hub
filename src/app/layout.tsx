import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/nav-bar";
import { getLastSync } from "@/lib/actions";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Learning Hub",
  description: "Playbooks and daily learnings for the Smart Nudges experiment",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <NavBar
          lastSyncedAt={lastSync?.syncedAt?.toISOString() ?? null}
        />
        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
