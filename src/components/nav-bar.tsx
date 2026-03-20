"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Lightbulb, Home, GitCommit } from "lucide-react";
import { cn } from "@/lib/utils";
import { SyncButton } from "@/components/sync-button";

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/playbooks", label: "Playbooks", icon: BookOpen },
  { href: "/learnings", label: "Learnings", icon: Lightbulb },
  { href: "/journey", label: "Journey", icon: GitCommit },
];

export function NavBar({ lastSyncedAt }: { lastSyncedAt: string | null }) {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
        <div className="flex items-center gap-1">
          <Link
            href="/"
            className="mr-4 text-lg font-semibold tracking-tight text-foreground"
          >
            Learning Hub
          </Link>
          <div className="flex items-center gap-1">
            {links.map(({ href, label, icon: Icon }) => {
              const isActive =
                href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium transition-colors sm:px-3",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{label}</span>
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
