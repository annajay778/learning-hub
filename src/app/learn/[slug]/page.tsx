export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getModulePages, getCategories } from "@/lib/actions";
import { getModuleBySlug, MODULES } from "@/lib/modules";
import { PageCard } from "@/components/page-card";
import { PlaybookForm } from "@/components/playbook-form";
import {
  Terminal,
  Users,
  Zap,
  Search,
  Handshake,
  AlertTriangle,
  Layers,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  terminal: Terminal,
  users: Users,
  zap: Zap,
  search: Search,
  handshake: Handshake,
  "alert-triangle": AlertTriangle,
  layers: Layers,
};

export default async function ModuleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const mod = getModuleBySlug(slug);
  if (!mod) notFound();

  const [pages, categories] = await Promise.all([
    getModulePages(slug),
    getCategories(),
  ]);

  const Icon = iconMap[mod.icon] || Layers;
  const currentIndex = MODULES.findIndex((m) => m.slug === slug);
  const prevModule = currentIndex > 0 ? MODULES[currentIndex - 1] : null;
  const nextModule =
    currentIndex < MODULES.length - 1 ? MODULES[currentIndex + 1] : null;

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/learn"
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Learning Path
      </Link>

      {/* Module header */}
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-semibold">
            {currentIndex + 1}. {mod.title}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mod.description}
          </p>
        </div>
      </div>

      {/* Module overview (future AI-generated) */}
      {mod.overview && (
        <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm">
          {mod.overview}
        </div>
      )}

      {/* Pages in this module */}
      <section>
        <h2 className="mb-3 text-base font-semibold">
          Pages ({pages.length})
        </h2>
        {pages.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No pages assigned to this module yet.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {pages.map((page) => (
              <PageCard key={page.id} {...page} />
            ))}
          </div>
        )}
      </section>

      {/* Add page form */}
      <section>
        <PlaybookForm categories={categories} defaultModuleSlug={slug} />
      </section>

      {/* Prev / Next navigation */}
      <div className="flex items-center justify-between border-t border-border pt-4">
        {prevModule ? (
          <Link
            href={`/learn/${prevModule.slug}`}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {prevModule.title}
          </Link>
        ) : (
          <div />
        )}
        {nextModule ? (
          <Link
            href={`/learn/${nextModule.slug}`}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            {nextModule.title}
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
