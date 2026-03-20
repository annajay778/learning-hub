"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
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

interface TimelineCalendarProps {
  snapshots: Snapshot[];
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const changeTypeDots: Record<string, string> = {
  created: "bg-green-500",
  updated: "bg-blue-500",
  manual_edit: "bg-amber-500",
};

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function dateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function TimelineCalendar({ snapshots }: TimelineCalendarProps) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  // Group snapshots by date key
  const byDate = new Map<string, Snapshot[]>();
  for (const snap of snapshots) {
    const key = dateKey(new Date(snap.snapshotAt));
    if (!byDate.has(key)) byDate.set(key, []);
    byDate.get(key)!.push(snap);
  }

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfWeek(currentYear, currentMonth);
  const todayKey = dateKey(today);

  const monthLabel = new Date(currentYear, currentMonth).toLocaleDateString(
    "en-US",
    { month: "long", year: "numeric" }
  );

  function prevMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  }

  function nextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  }

  // Build the grid cells
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  // Pad to complete the last row
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="space-y-4">
      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={prevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold">{monthLabel}</h2>
        <Button variant="ghost" size="sm" onClick={nextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-px text-center text-xs font-medium text-muted-foreground">
        {WEEKDAYS.map((day) => (
          <div key={day} className="py-1.5">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-px rounded-lg border border-border bg-border overflow-hidden">
        {cells.map((day, i) => {
          if (day === null) {
            return (
              <div
                key={`empty-${i}`}
                className="min-h-24 bg-muted/30 p-1.5 sm:min-h-28"
              />
            );
          }

          const key = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const daySnapshots = byDate.get(key) || [];
          const isToday = key === todayKey;
          const isPast =
            new Date(currentYear, currentMonth, day) <
            new Date(today.getFullYear(), today.getMonth(), today.getDate());

          return (
            <div
              key={key}
              className={`min-h-24 p-1.5 sm:min-h-28 ${
                isToday
                  ? "bg-primary/5 ring-1 ring-inset ring-primary/30"
                  : "bg-card"
              }`}
            >
              {/* Day number */}
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                    isToday
                      ? "bg-primary text-primary-foreground"
                      : isPast
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {day}
                </span>
                {/* Activity dots */}
                {daySnapshots.length > 0 && (
                  <div className="flex gap-0.5">
                    {Array.from(
                      new Set(daySnapshots.map((s) => s.changeType))
                    ).map((ct) => (
                      <div
                        key={ct}
                        className={`h-1.5 w-1.5 rounded-full ${changeTypeDots[ct] || "bg-gray-400"}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Day content */}
              {daySnapshots.length > 0 && (
                <div className="mt-1 space-y-0.5">
                  {daySnapshots.slice(0, 2).map((snap) => (
                    <Link
                      key={snap.id}
                      href={`/pages/${snap.pageId}`}
                      className="block truncate rounded px-1 py-0.5 text-[10px] leading-tight text-foreground/80 transition-colors hover:bg-accent sm:text-xs"
                    >
                      {snap.title.length > 30
                        ? snap.title.slice(0, 30) + "..."
                        : snap.title}
                    </Link>
                  ))}
                  {daySnapshots.length > 2 && (
                    <p className="px-1 text-[10px] text-muted-foreground">
                      +{daySnapshots.length - 2} more
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          New
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-blue-500" />
          Updated
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-amber-500" />
          Edited
        </div>
      </div>
    </div>
  );
}
