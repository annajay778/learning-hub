import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CategoryBadge } from "@/components/category-badge";
import { Pin } from "lucide-react";

interface PageCardProps {
  id: string;
  title: string;
  body: string;
  author: string;
  type: string;
  pinned: boolean;
  createdAt: Date;
  updatedAt: Date;
  categoryName: string | null;
  categoryColor: string | null;
}

export function PageCard({
  id,
  title,
  body,
  author,
  pinned,
  createdAt,
  categoryName,
  categoryColor,
}: PageCardProps) {
  const excerpt = body.length > 120 ? body.slice(0, 120) + "..." : body;
  const date = new Date(createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <Link href={`/pages/${id}`}>
      <Card className="transition-shadow hover:shadow-md">
        <CardHeader className="space-y-2 p-4">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base font-semibold leading-snug">
              {title}
            </CardTitle>
            {pinned && (
              <Pin className="h-3.5 w-3.5 shrink-0 text-primary" />
            )}
          </div>
          {excerpt && (
            <CardDescription className="line-clamp-2 text-sm">
              {excerpt}
            </CardDescription>
          )}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{author}</span>
            <span>·</span>
            <span>{date}</span>
            {categoryName && (
              <>
                <span>·</span>
                <CategoryBadge name={categoryName} color={categoryColor} />
              </>
            )}
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
