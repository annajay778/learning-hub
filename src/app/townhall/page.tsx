"use client";

import dynamic from "next/dynamic";

const Deck = dynamic(() => import("@/townhall/Deck"), { ssr: false });

export default function TownhallPage() {
  return <Deck />;
}
