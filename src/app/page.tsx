export const dynamic = "force-dynamic";

import { getLearnings, getDemoLinks, getCoachNotes } from "@/lib/actions";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CoachNoteCard } from "@/components/coach-note-card";
import { LinkRow } from "@/components/link-row";
import {
  ArrowRight,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

const TAG_COLORS: Record<string, string> = {
  prototyping: "bg-blue-100 text-blue-800",
  demo: "bg-indigo-100 text-indigo-800",
  "customer-engagement": "bg-emerald-100 text-emerald-800",
  infrastructure: "bg-slate-200 text-slate-800",
  setup: "bg-cyan-100 text-cyan-800",
  workflow: "bg-violet-100 text-violet-800",
  tips: "bg-sky-100 text-sky-800",
  strategy: "bg-blue-100 text-blue-800",
  decision: "bg-amber-100 text-amber-800",
  validation: "bg-emerald-100 text-emerald-800",
  architecture: "bg-slate-200 text-slate-800",
  kickoff: "bg-indigo-100 text-indigo-800",
  timeline: "bg-gray-200 text-gray-800",
  principles: "bg-violet-100 text-violet-800",
};

export default async function HomePage() {
  const [learnings, demoLinks, coachNotes] = await Promise.all([
    getLearnings(20),
    getDemoLinks(),
    getCoachNotes(),
  ]);

  return (
    <div className="relative min-h-svh">
      {/* ═══════ SKY BACKGROUND ═══════ */}
      <div className="fixed inset-x-0 top-0 -z-10 h-[50vh]">
        {/* Cool blue-gray sky */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#6B8DB5] via-[#94B0CA] via-45% to-[#C8D5DF]" />
        {/* Cloud texture */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_55%_20%,rgba(255,255,255,0.35),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_30%_at_20%_35%,rgba(255,255,255,0.2),transparent)]" />
        {/* Fade to page */}
        <div className="absolute inset-x-0 bottom-0 h-[50%] bg-gradient-to-t from-[#F8F9FA] to-transparent" />
      </div>

      {/* ═══════ CONTENT OVERLAY ═══════ */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 pt-16 sm:px-6">
        {/* Top area: blurb left + title right */}
        <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          {/* Title + subtitle */}
          <div className="max-w-lg">
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-foreground/8 px-3 py-1 text-[11px] uppercase tracking-widest text-foreground/60">
              <Sparkles className="h-2.5 w-2.5" />
              Updated daily
            </div>
            <h1 className="text-lg font-semibold tracking-tight text-foreground">
              AI Build to Learn<br />Experiment Hub
            </h1>
          </div>

        </div>

        {/* Week-by-week timeline */}
        <div className="mb-10 space-y-2.5">
          <h2 className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
            The Journey So Far
          </h2>

          <div className="space-y-2">
            {/* Week 1 */}
            <div className="rounded-lg border border-border/50 bg-card p-3.5">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700">
                  1
                </span>
                <div>
                  <p className="text-sm font-medium">March 16 &ndash; 20</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                    Kicked off. Honed in on the problem and the job to be done.
                    Demoed the first working prototype with hacky methods and fake data.
                  </p>
                </div>
              </div>
            </div>

            {/* Week 2 */}
            <div className="rounded-lg border border-border/50 bg-card p-3.5">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700">
                  2
                </span>
                <div>
                  <p className="text-sm font-medium">March 23 &ndash; 28</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                    Demoed with real data. Put it in front of clients.
                    Iterated based on feedback in the current prototype.
                  </p>
                </div>
              </div>
            </div>

            {/* Week 3 */}
            <div className="rounded-lg border border-border/50 bg-card p-3.5">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700">
                  3
                </span>
                <div>
                  <p className="text-sm font-medium">March 30 &ndash; April 3</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                    Rebuilt both prototypes from the ground up based on client
                    feedback. 3x client touchpoints. Reframed features as
                    agents and iterated on live guardrails.
                  </p>
                </div>
              </div>
            </div>

            {/* Week 4 */}
            <div className="rounded-lg border border-border/50 bg-card p-3.5">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700">
                  4
                </span>
                <div>
                  <p className="text-sm font-medium">April 6 &ndash; 10</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                    Onboarded the product team to Claude Code. Cloned the pairing
                    model across workstreams. Built async-capable prototypes so
                    camps can test without us in the room. Kicked off the Parent
                    Handbook build with Jeremy.
                  </p>
                </div>
              </div>
            </div>

            {/* Week 5 — current */}
            <div className="rounded-lg border border-primary/30 bg-card p-3.5 ring-1 ring-primary/10">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  5
                </span>
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <p className="text-sm font-medium">April 13 &ndash; 17</p>
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-primary">
                      This week
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Parent Handbook AI is live in CampMinder for select beta
                    clients. Jeremy shipped a ConfigCat skill that extends
                    Claude Code into our feature flag workflow &mdash; another
                    reusable capability for the team.
                  </p>
                  <p className="mt-1.5 text-[10px] italic text-muted-foreground/50">
                    More to come.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="space-y-10">
            {/* Three rows: Demos, Prototypes, Client Learnings */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                  Demos, Prototypes &amp; Projects
                </h2>
                <Link
                  href="/demos"
                  className="text-xs uppercase tracking-wider text-primary hover:underline"
                >
                  View all
                </Link>
              </div>

              <LinkRow
                title="Demos"
                linkType="demo"
                items={demoLinks.filter((l) => l.linkType === "demo")}
                badgeClass="bg-blue-100 text-blue-800 border-blue-200"
                iconClass="bg-blue-50 text-blue-600"
                iconName="video"
              />

              <LinkRow
                title="Prototypes"
                linkType="prototype"
                items={demoLinks.filter((l) => l.linkType === "prototype")}
                badgeClass="bg-purple-100 text-purple-800 border-purple-200"
                iconClass="bg-purple-50 text-purple-600"
                iconName="globe"
              />

              <LinkRow
                title="Client Learnings"
                linkType="cowork"
                items={demoLinks.filter((l) => l.linkType === "cowork")}
                badgeClass="bg-emerald-100 text-emerald-800 border-emerald-200"
                iconClass="bg-emerald-50 text-emerald-600"
                iconName="users"
              />
            </section>

            {/* Latest Learnings */}
            <section>
              <h2 className="mb-4 text-xs uppercase tracking-[0.15em] text-muted-foreground">
                Latest Learnings
              </h2>
              {learnings.length === 0 ? (
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">
                      No learnings posted yet. The first batch will appear
                      after the daily sync runs.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {(() => {
                    let lastWeekLabel = "";
                    const WEEK1_START = new Date("2026-03-16T00:00:00");
                    return learnings.map((entry) => {
                      const d = new Date(entry.date + "T12:00:00");
                      const weekNum = Math.floor((d.getTime() - WEEK1_START.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1;
                      const weekLabel = `Week ${weekNum}`;
                      const showHeader = weekLabel !== lastWeekLabel;
                      lastWeekLabel = weekLabel;

                      return (
                        <div key={entry.id}>
                          {showHeader && (
                            <div className="pb-1 pt-3 first:pt-0">
                              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-foreground/40">
                                {weekLabel}
                              </p>
                            </div>
                          )}
                          <Card>
                            <CardContent className="p-5">
                              <div className="mb-1 text-xs text-muted-foreground/70">
                                {d.toLocaleDateString("en-US", {
                                  weekday: "long",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </div>
                              <h3 className="mb-2 text-base font-medium">
                                {entry.title}
                              </h3>
                        <ul className="mb-3 space-y-1.5">
                          {(entry.bullets as string[]).map((bullet, i) => (
                            <li
                              key={i}
                              className="flex gap-2 text-sm leading-relaxed text-muted-foreground"
                            >
                              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary/30" />
                              {bullet}
                            </li>
                          ))}
                        </ul>
                        <div className="flex flex-wrap gap-1.5">
                          {(entry.tags as string[]).map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className={`px-2 py-0.5 text-[11px] font-normal ${TAG_COLORS[tag] || "bg-gray-100 text-gray-600"}`}
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                            </CardContent>
                          </Card>
                        </div>
                      );
                    });
                  })()}
                </div>
              )}
            </section>

            {/* Coach's Corner */}
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                  Coach&apos;s Corner
                </h2>
                <Link
                  href="/coach"
                  className="text-xs uppercase tracking-wider text-primary hover:underline"
                >
                  View all
                </Link>
              </div>
              {coachNotes.length === 0 ? (
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">
                      No coaching notes yet.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-2.5">
                  {coachNotes.slice(0, 3).map((note) => (
                    <CoachNoteCard
                      key={note.id}
                      id={note.id}
                      author={note.author}
                      body={note.body}
                      reviewed={note.reviewed}
                      createdAt={note.createdAt}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Claude Projects */}
            <section>
              <h2 className="mb-4 text-xs uppercase tracking-[0.15em] text-muted-foreground">
                Explore
              </h2>
              <div className="space-y-1.5">
                <Link
                  href="/setup"
                  className="flex items-center justify-between rounded-lg border border-border/50 bg-card px-3.5 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
                >
                  Setup Guide
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                </Link>
                <a
                  href="https://claude.ai/project/5b5daa22-tried-and-tested-product-management-f"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-lg border border-border/50 bg-card px-3.5 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
                >
                  PM Playbook
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </a>
                <a
                  href="https://claude.ai/project/b23de29e-campminder-ai-prototype-knowledge-ba"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-lg border border-border/50 bg-card px-3.5 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
                >
                  Technical Knowledge Base
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </a>
              </div>
            </section>
        </div>
      </div>
    </div>
  );
}
