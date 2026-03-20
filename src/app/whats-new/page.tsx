export const dynamic = "force-dynamic";

import { getDemoLinks } from "@/lib/actions";
import { DemoLinkForm } from "@/components/demo-link-form";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Rocket,
  Play,
  AppWindow,
  FileText,
  ExternalLink,
} from "lucide-react";

const typeConfig: Record<
  string,
  {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    badgeClass: string;
  }
> = {
  demo: {
    icon: Play,
    label: "Demo",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
  },
  prototype: {
    icon: AppWindow,
    label: "Prototype",
    badgeClass: "bg-purple-50 text-purple-700 border-purple-200",
  },
  resource: {
    icon: FileText,
    label: "Resource",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
  },
};

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return "";
  }
}

function relativeDate(date: Date): string {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;

  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function groupByDate(links: Awaited<ReturnType<typeof getDemoLinks>>) {
  const groups = new Map<string, typeof links>();
  for (const link of links) {
    const d = new Date(link.createdAt);
    const label = d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
    if (!groups.has(label)) groups.set(label, []);
    groups.get(label)!.push(link);
  }
  return groups;
}

export default async function DemosPage() {
  const links = await getDemoLinks();
  const grouped = groupByDate(links);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-xl font-semibold">
          <Rocket className="h-5 w-5 text-primary" />
          Demos &amp; Prototypes
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Live demos, prototypes, and recordings from the team
        </p>
      </div>

      <DemoLinkForm />

      {links.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No demos yet. Add your first link above.
        </p>
      ) : (
        <div className="space-y-8">
          {Array.from(grouped.entries()).map(([dateLabel, items]) => (
            <div key={dateLabel}>
              <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
                {dateLabel}
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {items.map((link) => {
                  const domain = extractDomain(link.url);
                  const config = typeConfig[link.linkType] || typeConfig.demo;
                  const TypeIcon = config.icon;

                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group"
                    >
                      <Card className="h-full border-border/60 transition-all hover:border-primary/30 hover:shadow-md">
                        <CardContent className="flex h-full flex-col p-4">
                          {/* Icon + title + type badge */}
                          <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                              <TypeIcon className="h-4 w-4 fill-current" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <p className="font-semibold leading-snug text-foreground group-hover:text-primary">
                                  {link.title}
                                </p>
                                <Badge
                                  variant="outline"
                                  className={`shrink-0 text-[10px] ${config.badgeClass}`}
                                >
                                  {config.label}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          {/* Description */}
                          {link.description && (
                            <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
                              {link.description}
                            </p>
                          )}

                          {/* Footer */}
                          <div className="mt-auto flex items-center gap-2 pt-3 text-xs text-muted-foreground">
                            <span>{link.author}</span>
                            <span>·</span>
                            <span>{relativeDate(link.createdAt)}</span>
                            {domain && (
                              <>
                                <span>·</span>
                                <span className="flex items-center gap-1">
                                  {domain}
                                  <ExternalLink className="h-2.5 w-2.5" />
                                </span>
                              </>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </a>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
