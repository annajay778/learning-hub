export const dynamic = "force-dynamic";

import { getPage, getCategories } from "@/lib/actions";
import { notFound } from "next/navigation";
import { PageView } from "./page-view";

export default async function ViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [page, categories] = await Promise.all([
    getPage(id),
    getCategories(),
  ]);

  if (!page) notFound();

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8">
      <PageView page={page} categories={categories} />
    </main>
  );
}
