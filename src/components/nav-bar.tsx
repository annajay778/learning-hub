"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SyncButton } from "@/components/sync-button";

const links = [
  { href: "/", label: "Home" },
  { href: "/demos", label: "Demos" },
  { href: "/coach", label: "Coach" },
];

export function NavBar({ lastSyncedAt }: { lastSyncedAt: string | null }) {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-10 max-w-3xl items-center justify-between px-4">
        <div className="flex items-center gap-5">
          <Link
            href="/"
            className="font-serif text-sm font-medium tracking-tight text-foreground"
          >
            AI Lab
          </Link>
          <div className="flex items-center gap-0.5">
            {links.map(({ href, label }) => {
              const isActive =
                href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "rounded-md px-2 py-1 text-[11px] font-medium uppercase tracking-wider transition-colors",
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground/70 hover:text-foreground"
                  )}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
        <SyncButton lastSyncedAt={lastSyncedAt} />
      </div>
    </nav>
  );
}
