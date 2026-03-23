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
  const lastSync = await getLastSync();

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
