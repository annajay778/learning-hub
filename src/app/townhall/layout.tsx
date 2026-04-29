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

export default function TownhallLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${fraunces.variable} ${sourceSerif.variable} ${jetbrains.variable}`}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
      }}
    >
      <style>{`
        :root {
          --font-fraunces-resolved: ${fraunces.style.fontFamily};
          --font-source-serif-resolved: ${sourceSerif.style.fontFamily};
          --font-jetbrains-resolved: ${jetbrains.style.fontFamily};
        }
      `}</style>
      {children}
    </div>
  );
}
