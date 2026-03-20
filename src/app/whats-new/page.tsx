export const dynamic = "force-dynamic";

import { getWhatsNew } from "@/lib/actions";
import { LearningForm } from "@/components/learning-form";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Newspaper } from "lucide-react";
import Link from "next/link";

const changeTypeColors: Record<string, string> = {
  created: "bg-green-100 text-green-700 border-green-200",
  updated: "bg-blue-100 text-blue-700 border-blue-200",
  manual_edit: "bg-amber-100 text-amber-700 border-amber-200",
};

const changeTypeLabels: Record<string, string> = {
  created: "New",
  updated: "Updated",
  manual_edit: "Edited",
};

function groupByDate(
  items: Awaited<ReturnType<typeof getWhatsNew>>
) {
  const groups = new Map<string, typeof items>();
  for (const item of items) {
    const date = new Date(item.snapshotAt).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
    if (!groups.has(date)) groups.set(date, []);
    groups.get(date)!.push(item);
  }
  return groups;
}

export default async function WhatsNewPage() {
  const activity = await getWhatsNew(30);
  const grouped = groupByDate(activity);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-xl font-semibold">
          <Newspaper className="h-5 w-5 text-primary" />
          What&apos;s New
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Recent activity and daily learnings
        </p>
      </div>

      <LearningForm />

      {/* Activity Feed */}
      {activity.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No activity yet. Add a learning or sync from Notion to get started.
        </p>
      ) : (
        <div className="space-y-8">
          {Array.from(grouped.entries()).map(([date, entries]) => (
            <div key={date}>
              <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
                {date}
              </h3>
              <div className="space-y-2">
                {entries.map((entry) => (
                  <Link key={entry.id} href={`/pages/${entry.pageId}`}>
                    <Card className="transition-shadow hover:shadow-md">
                      <CardContent className="flex items-center gap-3 p-3">
                        <div
                          className={`h-2 w-2 shrink-0 rounded-full ${
                            entry.changeType === "created"
                              ? "bg-green-500"
                              : entry.changeType === "updated"
                              ? "bg-blue-500"
                              : "bg-amber-500"
                          }`}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {entry.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(entry.snapshotAt).toLocaleTimeString(
                              "en-US",
                              { hour: "numeric", minute: "2-digit" }
                            )}
                            {entry.source === "notion" && " via Notion"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {entry.pageType && (
                            <Badge
                              variant="secondary"
                              className="text-[10px]"
                            >
                              {entry.pageType}
                            </Badge>
                          )}
                          <Badge
                            variant="outline"
                            className={`text-[10px] ${
                              changeTypeColors[entry.changeType] || ""
                            }`}
                          >
                            {changeTypeLabels[entry.changeType] ||
                              entry.changeType}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
