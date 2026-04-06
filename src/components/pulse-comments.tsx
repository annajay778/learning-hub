"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createPulseComment, deletePulseComment } from "@/lib/actions";
import { MessageSquare, Plus, X, ChevronDown, ChevronUp, Trash2 } from "lucide-react";

interface Comment {
  id: string;
  dayKey: string;
  weekStart: string | null;
  body: string;
  author: string;
  createdAt: Date;
}

export function PulseComments({
  dayKey,
  weekStart,
  comments,
}: {
  dayKey: string;
  weekStart: string;
  comments: Comment[];
}) {
  const [expanded, setExpanded] = useState(comments.length > 0);
  const [adding, setAdding] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setSubmitting(true);
    formData.set("dayKey", dayKey);
    formData.set("weekStart", weekStart);
    await createPulseComment(formData);
    formRef.current?.reset();
    setSubmitting(false);
    setAdding(false);
  }

  async function handleDelete(id: string) {
    await deletePulseComment(id);
  }

  return (
    <div className="mt-3 border-t border-border/40 pt-3">
      {/* Toggle + add button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 text-[10px] text-muted-foreground/60 hover:text-muted-foreground"
        >
          <MessageSquare className="h-3 w-3" />
          {comments.length} comment{comments.length !== 1 ? "s" : ""}
          {expanded ? (
            <ChevronUp className="h-2.5 w-2.5" />
          ) : (
            <ChevronDown className="h-2.5 w-2.5" />
          )}
        </button>
        {!adding && (
          <button
            onClick={() => {
              setAdding(true);
              setExpanded(true);
            }}
            className="flex items-center gap-1 text-[10px] text-primary hover:underline"
          >
            <Plus className="h-2.5 w-2.5" />
            Add
          </button>
        )}
      </div>

      {/* Comments list + form */}
      {expanded && (
        <div className="mt-2 space-y-2">
          {comments.map((c) => (
            <div
              key={c.id}
              className="group flex items-start gap-2 rounded-md bg-muted/40 px-3 py-2"
            >
              <div className="min-w-0 flex-1">
                <p className="text-xs leading-relaxed text-foreground">
                  {c.body}
                </p>
                <p className="mt-1 text-[10px] text-muted-foreground/50">
                  {c.author} ·{" "}
                  {new Date(c.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <button
                onClick={() => handleDelete(c.id)}
                className="shrink-0 rounded p-1 text-muted-foreground/30 opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                title="Delete comment"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}

          {adding && (
            <form
              ref={formRef}
              action={handleSubmit}
              className="space-y-1.5 rounded-md border border-dashed border-primary/20 p-2.5"
            >
              <Textarea
                name="body"
                placeholder="Add a comment..."
                rows={2}
                required
                autoFocus
                className="text-xs"
              />
              <div className="flex items-center justify-between">
                <Input
                  name="author"
                  placeholder="Your name"
                  required
                  className="h-7 w-28 text-xs"
                />
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => setAdding(false)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    className="h-6 text-[10px]"
                    disabled={submitting}
                  >
                    {submitting ? "..." : "Post"}
                  </Button>
                </div>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
