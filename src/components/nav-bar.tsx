"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SyncButton } from "@/components/sync-button";

const links = [
  { href: "/", label: "Home" },
  { href: "/pulse", label: "Pulse" },
  { href: "/demos", label: "Demos" },
  { href: "/clients", label: "Clients" },
  { href: "/coach", label: "Coach" },
  { href: "/framework", label: "Framework" },
  { href: "/braindump", label: "Braindump" },
];

export function NavBar({ lastSyncedAt }: { lastSyncedAt: string | null }) {
  const pathname = usePathname();
  if (pathname === "/setup") return null;
  const isHome = pathname === "/";
  const isTransparent = isHome || pathname === "/braindump";

  return (
    <nav
      className={cn(
        "sticky top-0 z-50",
        isTransparent
          ? "absolute inset-x-0 top-0 bg-transparent"
          : "border-b border-border/40 bg-background/80 backdrop-blur-sm"
      )}
    >
      <div className="mx-auto flex h-12 max-w-5xl items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className={cn(
              "text-sm font-semibold tracking-tight",
              isTransparent && pathname === "/braindump"
                ? "text-white/90"
                : "text-foreground"
            )}
          >
            Build to Learn
          </Link>
          <div className="flex items-center gap-0.5">
            {links.map(({ href, label }) => {
              const isActive =
                href === "/" ? pathname === "/" : pathname.startsWith(href);
              const isBraindump = pathname === "/braindump";
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider transition-colors",
                    isBraindump
                      ? isActive
                        ? "text-white"
                        : "text-white/50 hover:text-white/80"
                      : isActive
                      ? "text-foreground"
                      : "text-foreground/50 hover:text-foreground"
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
