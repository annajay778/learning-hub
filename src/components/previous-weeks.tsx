"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MarkdownViewer } from "@/components/markdown-viewer";
import { PulseComments } from "@/components/pulse-comments";
import { CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";

interface DayPlan {
  name: string;
  date: string;
  fullDate: Date;
  content: string;
}

interface WeekPlan {
  id: string;
  weekStart: string;
  title: string;
  body: string;
  days: DayPlan[];
}

interface Comment {
  id: string;
  dayKey: string;
  weekStart: string | null;
  body: string;
  author: string;
  createdAt: Date;
}

export function PreviousWeeks({
  weeks,
  comments,
}: {
  weeks: WeekPlan[];
  comments: Comment[];
}) {
  const [expanded, setExpanded] = useState(false);

  if (weeks.length === 0) return null;

  return (
    <section className="border-t border-border/40 pt-6">
      <button
        onClick={() => setExpanded(!expanded)}
        className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground"
      >
        Previous Weeks ({weeks.length})
        {expanded ? (
          <ChevronUp className="h-3 w-3" />
        ) : (
          <ChevronDown className="h-3 w-3" />
        )}
      </button>

      {expanded &&
        weeks.map((week) => (
          <div key={week.id} className="mb-8">
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
              {week.title}
            </h3>
            <div className="space-y-2.5">
              {week.days.map((day) => (
                <Card key={`${week.weekStart}-${day.name}`} className="opacity-70">
                  <CardContent className="p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <h4 className="text-sm font-semibold">
                        {day.name}
                        <span className="ml-1.5 font-normal text-muted-foreground">
                          {day.date}
                        </span>
                      </h4>
                    </div>
                    <div className="pl-6 text-sm [&_strong]:font-semibold [&_p]:mb-1.5 [&_p]:leading-relaxed [&_p]:text-muted-foreground [&_ul]:mb-2 [&_ul]:space-y-0.5 [&_li]:text-muted-foreground">
                      <MarkdownViewer content={day.content} />
                    </div>
                    <PulseComments
                      dayKey={day.name.toLowerCase()}
                      weekStart={week.weekStart}
                      comments={comments.filter(
                        (c) => c.dayKey === day.name.toLowerCase() && c.weekStart === week.weekStart
                      )}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
    </section>
  );
}
