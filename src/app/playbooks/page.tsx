export const dynamic = "force-dynamic";

import { getPages, getCategories } from "@/lib/actions";
import { PlaybookForm } from "@/components/playbook-form";
import { PageCard } from "@/components/page-card";
import { CategoryBadge } from "@/components/category-badge";

export default async function PlaybooksPage() {
  const [playbooks, categories] = await Promise.all([
    getPages("playbook"),
    getCategories(),
  ]);

  // Group by category
  const grouped = new Map<string | null, typeof playbooks>();
  for (const pb of playbooks) {
    const key = pb.categoryName || "Uncategorized";
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(pb);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Playbooks</h1>
      </div>

      <PlaybookForm categories={categories} />

      {playbooks.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No playbooks yet. Create your first one above.
        </p>
      ) : (
        <div className="space-y-8">
          {Array.from(grouped.entries()).map(([categoryName, pages]) => {
            const cat = pages[0];
            return (
              <section key={categoryName}>
                <div className="mb-3 flex items-center gap-2">
                  <h2 className="text-base font-semibold">{categoryName}</h2>
                  {categoryName !== "Uncategorized" && (
                    <CategoryBadge
                      name={cat.categoryName}
                      color={cat.categoryColor}
                    />
                  )}
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {pages.map((page) => (
                    <PageCard key={page.id} {...page} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
