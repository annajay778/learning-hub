export const dynamic = "force-dynamic";

import { getLearnings, getDemoLinks, getCoachNotes } from "@/lib/actions";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CoachNoteCard } from "@/components/coach-note-card";
import { DemoLinkForm } from "@/components/demo-link-form";
import {
  ExternalLink,
  Video,
  Globe,
  BookOpen,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

const demoTypeConfig: Record<
  string,
  {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    badgeClass: string;
    iconClass: string;
  }
> = {
  demo: {
    icon: Video,
    label: "Demo",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
    iconClass: "bg-blue-50 text-blue-600",
  },
  prototype: {
    icon: Globe,
    label: "Prototype",
    badgeClass: "bg-purple-50 text-purple-700 border-purple-200",
    iconClass: "bg-purple-50 text-purple-600",
  },
  resource: {
    icon: BookOpen,
    label: "Resource",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
    iconClass: "bg-amber-50 text-amber-600",
  },
};

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return "";
  }
}

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
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-foreground/8 px-2.5 py-0.5 text-[9px] uppercase tracking-widest text-foreground/60">
              <Sparkles className="h-2 w-2" />
              Updated daily
            </div>
            <h1 className="font-serif text-base font-semibold tracking-tight text-foreground">
              AI Build to Learn<br />Experiment Hub
            </h1>
            <p className="mt-1.5 text-[11px] leading-relaxed text-foreground/50">
              Building AI-powered tools for summer camp operations.
              <br />
              Anna Jay + Spencer Mroczek · March&ndash;April 2026
            </p>
          </div>

          {/* Blurb callout */}
          <div className="max-w-[190px] rounded-lg border border-foreground/8 bg-white/60 p-3 backdrop-blur-sm">
            <p className="text-[10px] leading-relaxed text-foreground/60">
              Practicing using Radix and Mobbin to guide designs quickly
            </p>
          </div>
        </div>

        {/* Main content — centered single column */}
        <div className="mx-auto max-w-2xl space-y-8">
            {/* Latest Learnings */}
            <section>
              <h2 className="mb-3 text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                Latest Learnings
              </h2>
              {learnings.length === 0 ? (
                <Card>
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground">
                      No learnings posted yet. The first batch will appear
                      after the daily sync runs.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-2.5">
                  {learnings.map((entry) => (
                    <Card key={entry.id}>
                      <CardContent className="p-4">
                        <div className="mb-1 text-[10px] text-muted-foreground/70">
                          {new Date(
                            entry.date + "T12:00:00"
                          ).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                        <h3 className="mb-2 font-serif text-sm font-medium">
                          {entry.title}
                        </h3>
                        <ul className="mb-2.5 space-y-1">
                          {(entry.bullets as string[]).map((bullet, i) => (
                            <li
                              key={i}
                              className="flex gap-2 text-xs leading-relaxed text-muted-foreground"
                            >
                              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary/30" />
                              {bullet}
                            </li>
                          ))}
                        </ul>
                        <div className="flex flex-wrap gap-1">
                          {(entry.tags as string[]).map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className={`px-1.5 py-0 text-[9px] font-normal ${TAG_COLORS[tag] || "bg-gray-100 text-gray-600"}`}
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

            {/* Prototypes & Demos */}
            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                  Prototypes &amp; Demos
                </h2>
                <Link
                  href="/demos"
                  className="text-[10px] uppercase tracking-wider text-primary hover:underline"
                >
                  View all
                </Link>
              </div>
              <DemoLinkForm />
              {demoLinks.length > 0 && (
                <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
                  {demoLinks.slice(0, 4).map((link) => {
                    const domain = extractDomain(link.url);
                    const config =
                      demoTypeConfig[link.linkType] || demoTypeConfig.demo;
                    const TypeIcon = config.icon;
                    return (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group"
                      >
                        <Card className="h-full border-border/50 transition-all hover:border-primary/20 hover:shadow-sm">
                          <CardContent className="flex h-full flex-col p-3">
                            <div className="flex items-start gap-2">
                              <div
                                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${config.iconClass}`}
                              >
                                <TypeIcon className="h-3 w-3" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-medium leading-snug text-foreground group-hover:text-primary">
                                  {link.title}
                                </p>
                                <div className="mt-0.5 flex items-center gap-1 text-[9px] text-muted-foreground/60">
                                  <Badge
                                    variant="outline"
                                    className={`px-1 py-0 text-[8px] font-normal ${config.badgeClass}`}
                                  >
                                    {config.label}
                                  </Badge>
                                  {domain && (
                                    <span className="flex items-center gap-0.5">
                                      {domain}
                                      <ExternalLink className="h-1.5 w-1.5" />
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </a>
                    );
                  })}
                </div>
              )}
            </section>
            {/* Coach's Corner */}
            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                  Coach&apos;s Corner
                </h2>
                <Link
                  href="/coach"
                  className="text-[10px] uppercase tracking-wider text-primary hover:underline"
                >
                  View all
                </Link>
              </div>
              {coachNotes.length === 0 ? (
                <Card>
                  <CardContent className="p-3">
                    <p className="text-[11px] text-muted-foreground">
                      No coaching notes yet.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-2">
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
              <h2 className="mb-3 text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                Explore
              </h2>
              <div className="space-y-1.5">
                <a
                  href="https://claude.ai/project/5b5daa22-tried-and-tested-product-management-f"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-lg border border-border/50 bg-card px-3 py-2 text-[11px] font-medium transition-colors hover:bg-accent"
                >
                  PM Playbook
                  <ExternalLink className="h-2.5 w-2.5 text-muted-foreground" />
                </a>
                <a
                  href="https://claude.ai/project/b23de29e-campminder-ai-prototype-knowledge-ba"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-lg border border-border/50 bg-card px-3 py-2 text-[11px] font-medium transition-colors hover:bg-accent"
                >
                  Technical Knowledge Base
                  <ExternalLink className="h-2.5 w-2.5 text-muted-foreground" />
                </a>
              </div>
            </section>
        </div>
      </div>
    </div>
  );
}
