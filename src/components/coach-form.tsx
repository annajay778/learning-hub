"use client";

import { useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createCoachNote } from "@/lib/actions";
import { Plus } from "lucide-react";

export function CoachForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  async function handleSubmit(formData: FormData) {
    setSubmitting(true);
    await createCoachNote(formData);
    formRef.current?.reset();
    setSubmitting(false);
    setOpen(false);
  }

  if (!open) {
    return (
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        size="sm"
        className="w-full text-xs"
      >
        <Plus className="mr-1 h-3 w-3" /> Share a Thought
      </Button>
    );
  }

  return (
    <Card>
      <CardContent className="p-3.5">
        <form ref={formRef} action={handleSubmit} className="space-y-2.5">
          <Textarea
            name="body"
            placeholder="Observations, suggestions, questions..."
            rows={3}
            required
            className="text-xs"
          />
          <div className="flex items-center justify-between">
            <Input
              name="author"
              placeholder="Your name"
              required
              className="h-8 w-36 text-xs"
            />
            <div className="flex gap-1.5">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 text-[11px] text-muted-foreground"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" className="h-7 text-[11px]" disabled={submitting}>
                {submitting ? "Saving..." : "Post"}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
