export const dynamic = "force-dynamic";

import { getLearnings, getDemoLinks, getCoachNotes } from "@/lib/actions";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CoachNoteCard } from "@/components/coach-note-card";
import { LinkRow } from "@/components/link-row";
import {
  ExternalLink,
  Video,
  Globe,
  Users,
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
            <p className="mt-1.5 text-sm leading-relaxed text-foreground/50">
              Building AI-powered tools for summer camp operations.
              <br />
              Anna Jay + Spencer Mroczek · March&ndash;April 2026
            </p>
          </div>

        </div>

        {/* Main content */}
        <div className="space-y-10">
            {/* Three rows: Demos, Prototypes, Cowork Projects */}
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
                icon={Video}
              />

              <LinkRow
                title="Prototypes"
                linkType="prototype"
                items={demoLinks.filter((l) => l.linkType === "prototype")}
                badgeClass="bg-purple-100 text-purple-800 border-purple-200"
                iconClass="bg-purple-50 text-purple-600"
                icon={Globe}
              />

              <LinkRow
                title="Cowork Projects"
                linkType="cowork"
                items={demoLinks.filter((l) => l.linkType === "cowork")}
                badgeClass="bg-emerald-100 text-emerald-800 border-emerald-200"
                iconClass="bg-emerald-50 text-emerald-600"
                icon={Users}
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
                  {learnings.map((entry) => (
                    <Card key={entry.id}>
                      <CardContent className="p-5">
                        <div className="mb-1 text-xs text-muted-foreground/70">
                          {new Date(
                            entry.date + "T12:00:00"
                          ).toLocaleDateString("en-US", {
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
                  ))}
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
