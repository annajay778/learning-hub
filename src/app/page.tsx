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
  prototyping: "bg-blue-50 text-blue-700",
  demo: "bg-indigo-50 text-indigo-700",
  "customer-engagement": "bg-green-50 text-green-700",
  infrastructure: "bg-slate-100 text-slate-700",
  setup: "bg-teal-50 text-teal-700",
  workflow: "bg-violet-50 text-violet-700",
  tips: "bg-amber-50 text-amber-700",
  strategy: "bg-rose-50 text-rose-700",
  decision: "bg-orange-50 text-orange-700",
  validation: "bg-emerald-50 text-emerald-700",
  architecture: "bg-cyan-50 text-cyan-700",
  kickoff: "bg-pink-50 text-pink-700",
  timeline: "bg-gray-100 text-gray-700",
  principles: "bg-purple-50 text-purple-700",
};

export default async function HomePage() {
  const [learnings, demoLinks, coachNotes] = await Promise.all([
    getLearnings(20),
    getDemoLinks(),
    getCoachNotes(),
  ]);

  return (
    <div className="space-y-12">
      {/* Banner */}
      <div className="-mx-4 -mt-8 mb-2 border-b border-primary/10 bg-primary/5 px-4 py-2 text-center text-xs text-muted-foreground">
        <Sparkles className="mr-1 inline h-3 w-3 text-primary/60" />
        Updated daily by AI — learnings are extracted from the team&apos;s work each evening
      </div>

      {/* Hero */}
      <section className="space-y-4 py-4">
        <h1 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
          AI Lab: Follow Along
        </h1>
        <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
          Everything we&apos;re learning building AI-powered tools at
          Campminder. Updated daily.
        </p>
        <p className="text-sm text-muted-foreground/70">
          Anna Jay (PM) + Spencer Mroczek (Engineer) · March&ndash;April 2026
        </p>
      </section>

      {/* ── Latest Learnings ────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 font-serif text-2xl font-semibold">Latest Learnings</h2>
        {learnings.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No learnings posted yet. The first batch will appear after the
            daily sync runs.
          </p>
        ) : (
          <div className="space-y-4">
            {learnings.map((entry) => (
              <Card key={entry.id}>
                <CardContent className="p-5">
                  <div className="mb-1 text-xs font-medium text-muted-foreground">
                    {new Date(entry.date + "T12:00:00").toLocaleDateString(
                      "en-US",
                      { weekday: "long", month: "long", day: "numeric" }
                    )}
                  </div>
                  <h3 className="mb-3 text-base font-semibold">
                    {entry.title}
                  </h3>
                  <ul className="mb-3 space-y-1.5">
                    {(entry.bullets as string[]).map((bullet, i) => (
                      <li
                        key={i}
                        className="flex gap-2 text-sm text-muted-foreground"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/40" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-1.5">
                    {(entry.tags as string[]).map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className={`text-[10px] font-medium ${TAG_COLORS[tag] || "bg-gray-100 text-gray-600"}`}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  {entry.author && (
                    <p className="mt-2 text-[11px] text-muted-foreground/60">
                      {entry.author}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* ── Prototypes & Demos ──────────────────────────────────── */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-2xl font-semibold">Prototypes &amp; Demos</h2>
          <Link
            href="/demos"
            className="text-sm text-primary hover:underline"
          >
            View all
          </Link>
        </div>
        <DemoLinkForm />
        {demoLinks.length > 0 && (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
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
                  <Card className="h-full border-border/60 transition-all hover:border-primary/30 hover:shadow-md">
                    <CardContent className="flex h-full flex-col p-4">
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${config.iconClass}`}
                        >
                          <TypeIcon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-semibold leading-snug text-foreground group-hover:text-primary">
                              {link.title}
                            </p>
                            <Badge
                              variant="outline"
                              className={`shrink-0 text-[10px] ${config.badgeClass}`}
                            >
                              {config.label}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      {link.description && (
                        <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                          {link.description}
                        </p>
                      )}
                      <div className="mt-auto flex items-center gap-2 pt-3 text-xs text-muted-foreground">
                        <span>{link.author}</span>
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
        )}
      </section>

      {/* ── Coach's Corner ──────────────────────────────────────── */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-2xl font-semibold">
            Coach&apos;s Corner
          </h2>
          <Link
            href="/coach"
            className="text-sm text-primary hover:underline"
          >
            View all
          </Link>
        </div>
        {coachNotes.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No coaching notes yet.
          </p>
        ) : (
          <div className="space-y-3">
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

      {/* ── Claude Projects ─────────────────────────────────────── */}
      <section>
        <Card>
          <CardContent className="p-5">
            <h3 className="mb-2 font-serif text-lg font-semibold">
              Explore with Claude Projects
            </h3>
            <p className="mb-3 text-sm text-muted-foreground">
              These Claude Projects have all the context loaded — start a
              conversation to ask questions at your own pace.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://claude.ai/project/5b5daa22-tried-and-tested-product-management-f"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent"
              >
                PM Playbook Project
                <ExternalLink className="h-3 w-3" />
              </a>
              <a
                href="https://claude.ai/project/b23de29e-campminder-ai-prototype-knowledge-ba"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent"
              >
                Technical Knowledge Base
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
