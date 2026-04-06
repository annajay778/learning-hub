export const dynamic = "force-dynamic";

import { getAllWeekPlans, getPulseComments } from "@/lib/actions";
import { MarkdownViewer } from "@/components/markdown-viewer";
import { PulseComments } from "@/components/pulse-comments";
import { PreviousWeeks } from "@/components/previous-weeks";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, ArrowRight } from "lucide-react";

function parseDayPlan(body: string) {
  // Extract day-by-day sections
  const dayRegex = /### (Monday|Tuesday|Wednesday|Thursday|Friday),\s+((?:March|April|May|June|July) \d+)/g;
  const days: { name: string; date: string; fullDate: Date; content: string }[] = [];
  let match;
  const matches: { index: number; name: string; date: string }[] = [];

  while ((match = dayRegex.exec(body)) !== null) {
    matches.push({ index: match.index, name: match[1], date: match[2] });
  }

  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index;
    const end = i + 1 < matches.length ? matches[i + 1].index : body.length;
    const content = body.slice(start, end).replace(/^###.+\n/, "").trim();
    const dayNum = parseInt(matches[i].date.match(/\d+/)?.[0] || "1");
    const monthMap: Record<string, number> = { March: 2, April: 3, May: 4, June: 5, July: 6 };
    const monthName = matches[i].date.split(" ")[0];
    const monthIdx = monthMap[monthName] ?? 2;
    days.push({
      name: matches[i].name,
      date: matches[i].date,
      fullDate: new Date(2026, monthIdx, dayNum),
      content,
    });
  }

  return days;
}

function parseSuccessCriteria(body: string): string[] {
  const section = body.match(
    /## What success looks like by Friday\n\n([\s\S]*?)(?=\n---|\n## )/
  );
  if (!section) return [];
  return section[1]
    .split("\n")
    .filter((l) => l.match(/^\d+\./))
    .map((l) => l.replace(/^\d+\.\s*/, "").replace(/\*\*/g, "").trim());
}

function parseBetaStatus(body: string) {
  const section = body.match(/## Beta Camp Status\n\n([\s\S]*?)(?=\n---|\n## )/);
  if (!section) return [];
  return section[1]
    .split("\n")
    .filter((l) => l.startsWith("**"))
    .map((l) => {
      const statusMatch = l.match(/\*\*(.+?):\*\*\s*(.+)/);
      if (!statusMatch) return null;
      return { status: statusMatch[1], camps: statusMatch[2] };
    })
    .filter(Boolean) as { status: string; camps: string }[];
}

function parseProductionPath(body: string) {
  const section = body.match(
    /## Path to Production[\s\S]*?\n\|[\s-|]+\n([\s\S]*?)(?=\n---|\n## |\n```)/
  );
  if (!section) return [];
  return section[1]
    .split("\n")
    .filter((l) => l.startsWith("|"))
    .map((l) => {
      const cells = l
        .split("|")
        .map((c) => c.trim())
        .filter(Boolean);
      if (cells.length < 4) return null;
      return {
        component: cells[0].replace(/\*\*/g, ""),
        scope: cells[1],
        when: cells[2],
        blocker: cells[3],
      };
    })
    .filter(Boolean) as {
    component: string;
    scope: string;
    when: string;
    blocker: string;
  }[];
}

const STATUS_COLORS: Record<string, string> = {
  confirmed: "bg-emerald-100 text-emerald-800",
  pending: "bg-amber-100 text-amber-800",
  "pricing concern": "bg-red-100 text-red-800",
};

export default async function PulsePage() {
  const [allPlans, allComments] = await Promise.all([
    getAllWeekPlans(),
    getPulseComments(),
  ]);

  const plan = allPlans[0] ?? null;
  const previousPlans = allPlans.slice(1);

  if (!plan) {
    return (
      <main className="mx-auto w-full max-w-3xl space-y-6 px-4 py-8">
        <div>
          <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground/60">
            Build to Learn
          </p>
          <h1 className="text-base font-semibold">Pulse</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            No weekly plan loaded yet. Run{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">
              npm run sync:week
            </code>{" "}
            to sync.
          </p>
        </div>
      </main>
    );
  }

  const today = new Date();
  const successCriteria = parseSuccessCriteria(plan.body);
  const betaStatus = parseBetaStatus(plan.body);
  const days = parseDayPlan(plan.body);
  const productionPath = parseProductionPath(plan.body);

  return (
    <main className="mx-auto w-full max-w-5xl space-y-8 px-4 py-8 sm:px-6">
      {/* Header */}
      <div>
        <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground/60">
          Build to Learn
        </p>
        <h1 className="text-lg font-semibold">{plan.title}</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Updated{" "}
          {new Date(plan.updatedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
          })}
        </p>
      </div>

      {/* Success Criteria */}
      {successCriteria.length > 0 && (
        <section>
          <h2 className="mb-3 text-xs uppercase tracking-[0.15em] text-muted-foreground">
            What Success Looks Like by Friday
          </h2>
          <Card>
            <CardContent className="p-4">
              <ul className="space-y-2">
                {successCriteria.map((item, i) => (
                  <li key={i} className="flex gap-2.5 text-sm leading-relaxed">
                    <Circle className="mt-1 h-3.5 w-3.5 shrink-0 text-muted-foreground/40" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Beta Camp Status */}
      {betaStatus.length > 0 && (
        <section>
          <h2 className="mb-3 text-xs uppercase tracking-[0.15em] text-muted-foreground">
            Beta Camps
          </h2>
          <div className="flex flex-wrap gap-2">
            {betaStatus.map((s, i) => (
              <Card key={i} className="flex-1 min-w-[200px]">
                <CardContent className="p-3.5">
                  <Badge
                    variant="secondary"
                    className={`mb-2 text-[10px] font-medium ${STATUS_COLORS[s.status.toLowerCase()] || "bg-gray-100 text-gray-700"}`}
                  >
                    {s.status}
                  </Badge>
                  <p className="text-sm text-foreground">{s.camps}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Day-by-Day Plan */}
      {days.length > 0 && (
        <section>
          <h2 className="mb-3 text-xs uppercase tracking-[0.15em] text-muted-foreground">
            Day by Day
          </h2>
          <div className="space-y-2.5">
            {days.map((day) => {
              const isPast = day.fullDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
              const isToday =
                day.fullDate.toDateString() === today.toDateString();

              return (
                <Card
                  key={day.name}
                  className={
                    isToday
                      ? "ring-2 ring-primary/30"
                      : isPast
                      ? "opacity-60"
                      : ""
                  }
                >
                  <CardContent className="p-4">
                    <div className="mb-2 flex items-center gap-2">
                      {isPast ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      ) : isToday ? (
                        <ArrowRight className="h-4 w-4 text-primary" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground/30" />
                      )}
                      <h3 className="text-sm font-semibold">
                        {day.name}
                        <span className="ml-1.5 font-normal text-muted-foreground">
                          {day.date}
                        </span>
                      </h3>
                      {isToday && (
                        <Badge className="ml-auto text-[10px]">Today</Badge>
                      )}
                    </div>
                    <div className="pl-6 text-sm [&_strong]:font-semibold [&_p]:mb-1.5 [&_p]:leading-relaxed [&_p]:text-muted-foreground [&_ul]:mb-2 [&_ul]:space-y-0.5 [&_li]:text-muted-foreground">
                      <MarkdownViewer content={day.content} />
                    </div>
                    <PulseComments
                      dayKey={day.name.toLowerCase()}
                      weekStart={plan.weekStart}
                      comments={allComments.filter(
                        (c) => c.dayKey === day.name.toLowerCase() && c.weekStart === plan.weekStart
                      )}
                    />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {/* Path to Production */}
      {productionPath.length > 0 && (
        <section>
          <h2 className="mb-3 text-xs uppercase tracking-[0.15em] text-muted-foreground">
            Path to Production
          </h2>
          <Card>
            <CardContent className="overflow-x-auto p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-xs text-muted-foreground">
                    <th className="px-4 py-2.5 text-left font-medium">Component</th>
                    <th className="px-4 py-2.5 text-left font-medium">Scope</th>
                    <th className="px-4 py-2.5 text-left font-medium">When</th>
                    <th className="px-4 py-2.5 text-left font-medium">Blocker</th>
                  </tr>
                </thead>
                <tbody>
                  {productionPath.map((row, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="px-4 py-2 font-medium">{row.component}</td>
                      <td className="px-4 py-2 text-muted-foreground">
                        {row.scope}
                      </td>
                      <td className="px-4 py-2 text-muted-foreground">
                        {row.when}
                      </td>
                      <td className="px-4 py-2">
                        {row.blocker.toLowerCase().includes("yes") ? (
                          <Badge
                            variant="secondary"
                            className="bg-red-100 text-[10px] text-red-800"
                          >
                            Blocker
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">
                            {row.blocker}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Previous Weeks */}
      <PreviousWeeks
        weeks={previousPlans.map((p) => ({
          id: p.id,
          weekStart: p.weekStart,
          title: p.title,
          body: p.body,
          days: parseDayPlan(p.body),
        }))}
        comments={allComments}
      />
    </main>
  );
}
