export const dynamic = "force-dynamic";

import { getDemoLinks } from "@/lib/actions";
import { DemoLinkForm } from "@/components/demo-link-form";
import { Card, CardContent } from "@/components/ui/card";
import { Rocket, Play, ExternalLink } from "lucide-react";

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

function groupByDate(
  links: Awaited<ReturnType<typeof getDemoLinks>>
) {
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
                          {/* Play icon + title */}
                          <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                              <Play className="h-4 w-4 fill-current" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold leading-snug text-foreground group-hover:text-primary">
                                {link.title}
                              </p>
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
