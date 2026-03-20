export const dynamic = "force-dynamic";

import { getModulePageCounts } from "@/lib/actions";
import { MODULES } from "@/lib/modules";
import { ModuleCard } from "@/components/module-card";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Compass } from "lucide-react";
import Link from "next/link";

export default async function StartHerePage() {
  const pageCounts = await getModulePageCounts();

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Compass className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">
            Learning Hub
          </h1>
        </div>
        <p className="max-w-2xl text-muted-foreground">
          Everything Anna and Spencer learned building AI-powered prototypes at
          CampMinder — from setup to production. Start with Module 1, or jump to
          whatever&apos;s relevant.
        </p>
        <Link
          href="/learn/getting-set-up"
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Start with Module 1
        </Link>
      </section>

      {/* Module Grid */}
      <section>
        <h2 className="mb-4 text-lg font-semibold">Modules</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {MODULES.map((mod, i) => (
            <ModuleCard
              key={mod.slug}
              module={mod}
              pageCount={pageCounts[mod.slug] || 0}
              index={i}
            />
          ))}
        </div>
      </section>

      {/* Claude Projects Callout */}
      <section>
        <Card>
          <CardContent className="p-5">
            <h3 className="mb-2 text-base font-semibold">
              Learn with Claude Projects
            </h3>
            <p className="mb-3 text-sm text-muted-foreground">
              Want to ask questions and explore at your own pace? These Claude
              Projects have all the context loaded — just start a conversation.
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
