"use client";

import { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createCoachNote } from "@/lib/actions";
import { MessageCircle } from "lucide-react";

export function CoachForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setSubmitting(true);
    await createCoachNote(formData);
    formRef.current?.reset();
    setSubmitting(false);
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">
          <MessageCircle className="mr-1.5 inline h-4 w-4" />
          Share a Thought
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={handleSubmit} className="space-y-3">
          <Textarea
            name="body"
            placeholder="What's on your mind? Observations, suggestions, questions..."
            rows={3}
            required
          />
          <div className="flex items-center justify-between">
            <select
              name="author"
              className="rounded-md border border-border bg-card px-3 py-1.5 text-sm"
              defaultValue="Stephanie"
            >
              <option value="Stephanie">Stephanie</option>
              <option value="Anna">Anna</option>
              <option value="Spencer">Spencer</option>
              <option value="Other">Other</option>
            </select>
            <Button type="submit" size="sm" disabled={submitting}>
              {submitting ? "Saving..." : "Post Note"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
