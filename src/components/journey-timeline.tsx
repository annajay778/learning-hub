import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface Snapshot {
  id: string;
  pageId: string;
  title: string;
  snapshotAt: Date;
  changeType: string;
  pageTitle: string | null;
  pageType: string | null;
  source: string | null;
}

function groupByDate(snapshots: Snapshot[]) {
  const groups = new Map<string, Snapshot[]>();
  for (const snap of snapshots) {
    const date = new Date(snap.snapshotAt).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    if (!groups.has(date)) groups.set(date, []);
    groups.get(date)!.push(snap);
  }
  return groups;
}

const changeTypeColors: Record<string, string> = {
  created: "bg-green-100 text-green-700 border-green-200",
  updated: "bg-blue-100 text-blue-700 border-blue-200",
  manual_edit: "bg-amber-100 text-amber-700 border-amber-200",
};

const changeTypeLabels: Record<string, string> = {
  created: "New",
  updated: "Synced",
  manual_edit: "Edited",
};

export function JourneyTimeline({ snapshots }: { snapshots: Snapshot[] }) {
  if (snapshots.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No history yet. Sync from Notion or edit a page to start tracking your
        journey.
      </p>
    );
  }

  const grouped = groupByDate(snapshots);

  return (
    <div className="space-y-8">
      {Array.from(grouped.entries()).map(([date, entries]) => (
        <div key={date}>
          <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
            {date}
          </h3>
          <div className="space-y-2">
            {entries.map((snap) => (
              <Link key={snap.id} href={`/pages/${snap.pageId}`}>
                <Card className="transition-shadow hover:shadow-md">
                  <CardContent className="flex items-center gap-3 p-3">
                    <div
                      className={`h-2 w-2 shrink-0 rounded-full ${
                        snap.changeType === "created"
                          ? "bg-green-500"
                          : snap.changeType === "updated"
                          ? "bg-blue-500"
                          : "bg-amber-500"
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {snap.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(snap.snapshotAt).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                        {snap.source === "notion" && " via Notion"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {snap.pageType && (
                        <Badge variant="secondary" className="text-[10px]">
                          {snap.pageType}
                        </Badge>
                      )}
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${
                          changeTypeColors[snap.changeType] || ""
                        }`}
                      >
                        {changeTypeLabels[snap.changeType] || snap.changeType}
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
  );
}
