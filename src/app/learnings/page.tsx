export const dynamic = "force-dynamic";

import { getPages } from "@/lib/actions";
import { LearningForm } from "@/components/learning-form";
import { PageCard } from "@/components/page-card";

export default async function LearningsPage() {
  const learnings = await getPages("learning");

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Daily Learnings</h1>

      <LearningForm />

      {learnings.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No entries yet. Add your first learning above.
        </p>
      ) : (
        <div className="space-y-3">
          {learnings.map((page) => (
            <PageCard key={page.id} {...page} />
          ))}
        </div>
      )}
    </div>
  );
}
