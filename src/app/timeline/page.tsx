export const dynamic = "force-dynamic";

import { getSnapshots, getSyncLogs } from "@/lib/actions";
import { JourneyTimeline } from "@/components/journey-timeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, GitCommit } from "lucide-react";

export default async function TimelinePage() {
  const [snapshots, syncLogs] = await Promise.all([
    getSnapshots(),
    getSyncLogs(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-xl font-semibold">
          <GitCommit className="h-5 w-5 text-primary" />
          Timeline
        </h1>
        <p className="text-sm text-muted-foreground">
          How your knowledge base evolved over time
        </p>
      </div>

      {/* Sync history summary */}
      {syncLogs.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Clock className="h-4 w-4 text-primary" />
              Sync History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1.5">
              {syncLogs.slice(0, 5).map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="text-muted-foreground">
                    {new Date(log.syncedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </span>
                  <div className="flex gap-2">
                    {log.pagesAdded > 0 && (
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-[10px] text-green-700"
                      >
                        +{log.pagesAdded} new
                      </Badge>
                    )}
                    {log.pagesUpdated > 0 && (
                      <Badge
                        variant="outline"
                        className="bg-blue-50 text-[10px] text-blue-700"
                      >
                        {log.pagesUpdated} updated
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Full timeline */}
      <div>
        <h2 className="mb-3 flex items-center gap-2 text-base font-semibold">
          <GitCommit className="h-4 w-4 text-primary" />
          Content Timeline
        </h2>
        <JourneyTimeline snapshots={snapshots} />
      </div>
    </div>
  );
}
