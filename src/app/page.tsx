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
  ChevronDown,
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
    <>
      {/* ═══════════════════ FULL-BLEED HERO ═══════════════════ */}
      <section className="relative flex min-h-svh flex-col">
        {/* Sky — rich layered gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#5B82A8] via-[#8FAEC8] via-40% to-[#D4B896]" />

        {/* Atmosphere — warm sunset glow near horizon */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_50%_at_50%_70%,rgba(218,170,120,0.5),transparent)]" />

        {/* Clouds — high wisps */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_25%_at_60%_15%,rgba(255,255,255,0.3),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_20%_at_25%_25%,rgba(255,255,255,0.2),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_15%_at_75%_20%,rgba(255,255,255,0.25),transparent)]" />

        {/* Warm cloud bank at horizon */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_30%_at_50%_55%,rgba(230,190,150,0.35),transparent)]" />

        {/* Mountains — layered ranges */}
        {/* Far range — misty blue */}
        <div className="absolute inset-x-0 bottom-[28%] h-[20%]">
          <div className="absolute inset-0" style={{
            background: "linear-gradient(170deg, transparent 30%, #7A9BAA 30%, #7A9BAA 35%, transparent 35%), linear-gradient(190deg, transparent 25%, #7A9BAA 25%, #7A9BAA 32%, transparent 32%), linear-gradient(175deg, transparent 35%, #7A9BAA 35%, #7A9BAA 40%, transparent 40%)",
            opacity: 0.4,
          }} />
        </div>

        {/* Mid range — sage green */}
        <div className="absolute inset-x-0 bottom-[22%] h-[18%]">
          <div className="absolute inset-0" style={{
            background: "linear-gradient(168deg, transparent 35%, #6B8E6B 35%, #6B8E6B 45%, transparent 45%), linear-gradient(192deg, transparent 28%, #6B8E6B 28%, #6B8E6B 40%, transparent 40%), linear-gradient(178deg, transparent 40%, #5C7A5E 40%, #5C7A5E 48%, transparent 48%)",
            opacity: 0.35,
          }} />
        </div>

        {/* Near range — warm pine */}
        <div className="absolute inset-x-0 bottom-[16%] h-[16%]">
          <div className="absolute inset-0" style={{
            background: "linear-gradient(165deg, transparent 40%, #4D6B4D 40%, #4D6B4D 55%, transparent 55%), linear-gradient(195deg, transparent 35%, #4D6B4D 35%, #4D6B4D 50%, transparent 50%)",
            opacity: 0.3,
          }} />
        </div>

        {/* Treeline / meadow at bottom */}
        <div className="absolute inset-x-0 bottom-[12%] h-[10%] bg-gradient-to-t from-[#6B8E5E]/20 to-transparent" />

        {/* Lake reflection */}
        <div className="absolute inset-x-0 bottom-[8%] h-[8%] bg-gradient-to-b from-[#8FAEC8]/15 to-transparent" />

        {/* Fade to page background at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-[35%] bg-gradient-to-t from-[#FBF9F6] via-[#FBF9F6]/80 to-transparent" />

        {/* Content — positioned in the lower third */}
        <div className="relative z-10 mt-auto pb-16 text-center">
          <div className="mx-auto max-w-xl px-4">
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] uppercase tracking-widest text-white/80 backdrop-blur-sm">
              <Sparkles className="h-2.5 w-2.5" />
              Updated daily by AI
            </div>
            <h1 className="font-serif text-base font-medium tracking-tight text-foreground sm:text-lg">
              AI Build to Learn Experiment Hub
            </h1>
            <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-muted-foreground">
              Building AI-powered tools for summer camp operations.
              <br />
              Anna Jay + Spencer Mroczek · March&ndash;April 2026
            </p>
            <ChevronDown className="mx-auto mt-6 h-4 w-4 animate-bounce text-muted-foreground/40" />
          </div>
        </div>
      </section>

      {/* ═══════════════════ CONTENT ═══════════════════ */}
      <main className="mx-auto w-full max-w-3xl space-y-10 px-4 py-10">

        {/* ── Latest Learnings ────────────────────────────────── */}
        <section>
          <h2 className="mb-4 text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
            Latest Learnings
          </h2>
          {learnings.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              No learnings posted yet. The first batch will appear after the
              daily sync runs.
            </p>
          ) : (
            <div className="space-y-3">
              {learnings.map((entry) => (
                <Card key={entry.id}>
                  <CardContent className="p-4">
                    <div className="mb-1 text-[10px] text-muted-foreground/70">
                      {new Date(entry.date + "T12:00:00").toLocaleDateString(
                        "en-US",
                        { weekday: "long", month: "long", day: "numeric" }
                      )}
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

        {/* ── Prototypes & Demos ──────────────────────────────── */}
        <section>
          <div className="mb-4 flex items-center justify-between">
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
            <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
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
                      <CardContent className="flex h-full flex-col p-3.5">
                        <div className="flex items-start gap-2.5">
                          <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${config.iconClass}`}
                          >
                            <TypeIcon className="h-3.5 w-3.5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-xs font-medium leading-snug text-foreground group-hover:text-primary">
                                {link.title}
                              </p>
                              <Badge
                                variant="outline"
                                className={`shrink-0 px-1.5 py-0 text-[9px] font-normal ${config.badgeClass}`}
                              >
                                {config.label}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        {link.description && (
                          <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
                            {link.description}
                          </p>
                        )}
                        <div className="mt-auto flex items-center gap-1.5 pt-2.5 text-[10px] text-muted-foreground/60">
                          <span>{link.author}</span>
                          {domain && (
                            <>
                              <span>·</span>
                              <span className="flex items-center gap-0.5">
                                {domain}
                                <ExternalLink className="h-2 w-2" />
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

        {/* ── Coach's Corner ──────────────────────────────────── */}
        <section>
          <div className="mb-4 flex items-center justify-between">
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
            <p className="text-xs text-muted-foreground">
              No coaching notes yet.
            </p>
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

        {/* ── Claude Projects ─────────────────────────────────── */}
        <section>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <h3 className="mb-1.5 font-serif text-xs font-medium">
                Explore with Claude Projects
              </h3>
              <p className="mb-3 text-[11px] text-muted-foreground">
                All the context loaded — start a conversation at your own pace.
              </p>
              <div className="flex flex-wrap gap-2">
                <a
                  href="https://claude.ai/project/5b5daa22-tried-and-tested-product-management-f"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-md border border-border/60 px-2.5 py-1 text-[11px] font-medium transition-colors hover:bg-accent"
                >
                  PM Playbook
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
                <a
                  href="https://claude.ai/project/b23de29e-campminder-ai-prototype-knowledge-ba"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-md border border-border/60 px-2.5 py-1 text-[11px] font-medium transition-colors hover:bg-accent"
                >
                  Technical Knowledge Base
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </>
  );
}
