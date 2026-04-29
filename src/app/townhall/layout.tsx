import { Fraunces, JetBrains_Mono, Source_Serif_4 } from "next/font/google";

export const metadata = {
  title: "Tech Town Hall — Six weeks of building AI in production",
  description: "Spencer Mroczek + Anna · CampCo · 2026-04-29",
};

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  weight: ["400", "500", "600"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400", "500"],
  display: "swap",
});

// Host Grotesk — Campminder brand body/display font. Not in next/font/google
// typings yet, so load via stylesheet link.
export default function TownhallLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Host Grotesk via Google Fonts. Inject a global stylesheet so :root gets
  // --font-host-grotesk; React style objects strip CSS variables in some Next
  // versions, so dangerouslySetInnerHTML on a <style> is more reliable.
  const brandFontStyles = `
    :root {
      --font-host-grotesk: 'Host Grotesk', 'Inter', system-ui, sans-serif;
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: brandFontStyles }} />
      {/* App Router: link in layout is fine. */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Host+Grotesk:wght@300;400;500;600;700&display=swap"
      />
      <div
        className={`${fraunces.variable} ${sourceSerif.variable} ${jetbrains.variable}`}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1000,
        }}
      >
        {children}
      </div>
    </>
  );
}
