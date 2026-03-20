"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  GraduationCap,
  Rocket,
  MessageCircle,
  CalendarDays,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SyncButton } from "@/components/sync-button";

const links = [
  { href: "/", label: "Start Here", shortLabel: "Start", icon: Compass },
  { href: "/learn", label: "Learning Path", shortLabel: "Learn", icon: GraduationCap },
  { href: "/whats-new", label: "Demos", shortLabel: "Demos", icon: Rocket },
  { href: "/coach", label: "Coach", shortLabel: "Coach", icon: MessageCircle },
  { href: "/timeline", label: "Timeline", shortLabel: "Timeline", icon: CalendarDays },
];

export function NavBar({ lastSyncedAt }: { lastSyncedAt: string | null }) {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between gap-2 px-4">
        {/* Logo + Nav links */}
        <div className="flex min-w-0 items-center gap-1">
          <Link
            href="/"
            className="mr-2 shrink-0 text-lg font-semibold tracking-tight text-foreground sm:mr-4"
          >
            Learning Hub
          </Link>
          <div className="flex items-center gap-0.5">
            {links.map(({ href, label, shortLabel, icon: Icon }) => {
              const isActive =
                href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-1.5 py-1.5 text-sm font-medium transition-colors sm:px-2.5",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="hidden md:inline">{label}</span>
                  <span className="hidden sm:inline md:hidden">{shortLabel}</span>
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
