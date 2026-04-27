import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/nav-bar";
import { SessionProvider } from "@/components/session-provider";
import { getLastSync } from "@/lib/actions";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans",
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
  // DB read intentionally non-fatal: if Postgres is unreachable, render the
  // shell so users still see the nav and can navigate, instead of a blank 500.
  let lastSync: Awaited<ReturnType<typeof getLastSync>> | null = null;
  try {
    lastSync = await getLastSync();
  } catch (err) {
    console.error("[layout] getLastSync failed:", err instanceof Error ? err.message : err);
  }

  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SessionProvider>
          <NavBar lastSyncedAt={lastSync?.syncedAt?.toISOString() ?? null} />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
