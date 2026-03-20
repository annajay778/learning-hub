export const dynamic = "force-dynamic";

import { getModulePageCounts } from "@/lib/actions";
import { MODULES } from "@/lib/modules";
import { ModuleCard } from "@/components/module-card";
import { GraduationCap } from "lucide-react";

export default async function LearnPage() {
  const pageCounts = await getModulePageCounts();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-xl font-semibold">
          <GraduationCap className="h-5 w-5 text-primary" />
          Learning Path
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Work through these modules in order, or jump to what you need.
        </p>
      </div>

      <div className="grid gap-3">
        {MODULES.map((mod, i) => (
          <ModuleCard
            key={mod.slug}
            module={mod}
            pageCount={pageCounts[mod.slug] || 0}
            index={i}
          />
        ))}
      </div>
    </div>
  );
}
