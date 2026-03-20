"use client";

import { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createPage } from "@/lib/actions";
import { Plus } from "lucide-react";

export function LearningForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setSubmitting(true);
    formData.set("type", "learning");
    await createPage(formData);
    formRef.current?.reset();
    setSubmitting(false);
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">
          <Plus className="mr-1.5 inline h-4 w-4" />
          Add Today&apos;s Learning
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={handleSubmit} className="space-y-3">
          <Input
            name="title"
            placeholder='e.g., "Tried cold outreach via CSM intro"'
            required
          />
          <Textarea
            name="body"
            placeholder="What happened? What did you learn? What would you do differently?"
            rows={3}
          />
          <div className="flex items-center justify-between">
            <select
              name="author"
              className="rounded-md border border-border bg-card px-3 py-1.5 text-sm"
              defaultValue="Anna"
            >
              <option value="Anna">Anna</option>
              <option value="Spencer">Spencer</option>
            </select>
            <Button type="submit" size="sm" disabled={submitting}>
              {submitting ? "Saving..." : "Add Entry"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
