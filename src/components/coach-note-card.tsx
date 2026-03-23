"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  });

  return (
    <Card className={reviewed ? "opacity-60" : ""}>
      <CardContent className="p-3.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <span className="font-medium text-foreground">{author}</span>
              <span>·</span>
              <span>{date}</span>
              {reviewed && (
                <Badge
                  variant="outline"
                  className="px-1 py-0 text-[8px] text-green-700 border-green-200 bg-green-50"
                >
                  Reviewed
                </Badge>
              )}
            </div>
            <div className="text-xs [&_p]:text-xs [&_li]:text-xs">
              <MarkdownViewer content={body} />
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 shrink-0 p-0"
            onClick={() => toggleCoachNoteReviewed(id)}
            title={reviewed ? "Mark as unreviewed" : "Mark as reviewed"}
          >
            {reviewed ? (
              <Check className="h-3 w-3 text-green-600" />
            ) : (
              <Circle className="h-3 w-3 text-muted-foreground" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
