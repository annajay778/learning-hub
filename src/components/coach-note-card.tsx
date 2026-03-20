"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarkdownViewer } from "@/components/markdown-viewer";
import { toggleCoachNoteReviewed } from "@/lib/actions";
import { Check, Circle } from "lucide-react";

interface CoachNoteCardProps {
  id: string;
  author: string;
  body: string;
  reviewed: boolean;
  createdAt: Date;
}

export function CoachNoteCard({
  id,
  author,
  body,
  reviewed,
  createdAt,
}: CoachNoteCardProps) {
  const date = new Date(createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <Card className={reviewed ? "opacity-70" : ""}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">{author}</span>
              <span>·</span>
              <span>{date}</span>
              {reviewed && (
                <Badge
                  variant="outline"
                  className="bg-green-50 text-[10px] text-green-700"
                >
                  Reviewed
                </Badge>
              )}
            </div>
            <div className="text-sm">
              <MarkdownViewer content={body} />
            </div>
          </div>
          <button
            onClick={() => toggleCoachNoteReviewed(id)}
            className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            title={reviewed ? "Mark as unreviewed" : "Mark as reviewed"}
          >
            {reviewed ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Circle className="h-4 w-4" />
            )}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
