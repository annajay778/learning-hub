import { getPages, getPinnedPlaybooks } from "@/lib/actions";
import { PageCard } from "@/components/page-card";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Lightbulb } from "lucide-react";
import Link from "next/link";

export default async function HomePage() {
  const [recentLearnings, pinnedPlaybooks] = await Promise.all([
    getPages("learning").then((pages) => pages.slice(0, 10)),
    getPinnedPlaybooks(),
  ]);

  return (
    <div className="space-y-8">
      {/* Recent Learnings */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Lightbulb className="h-5 w-5 text-primary" />
            Recent Learnings
          </h2>
          <Link
            href="/learnings"
            className="text-sm text-primary hover:underline"
          >
            View all
          </Link>
        </div>
        {recentLearnings.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No learnings yet. Head to{" "}
            <Link href="/learnings" className="text-primary hover:underline">
              Daily Learnings
            </Link>{" "}
            to add your first entry.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {recentLearnings.map((page) => (
              <PageCard key={page.id} {...page} />
            ))}
          </div>
        )}
      </section>

      <Separator />

      {/* Pinned Playbooks */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <BookOpen className="h-5 w-5 text-primary" />
            Pinned Playbooks
          </h2>
          <Link
            href="/playbooks"
            className="text-sm text-primary hover:underline"
          >
            All playbooks
          </Link>
        </div>
        {pinnedPlaybooks.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No pinned playbooks yet. Pin a playbook to see it here.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {pinnedPlaybooks.map((page) => (
              <PageCard key={page.id} {...page} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
