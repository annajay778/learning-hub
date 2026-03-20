"use client";

import { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createDemoLink } from "@/lib/actions";
import { Plus } from "lucide-react";

export function DemoLinkForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  async function handleSubmit(formData: FormData) {
    setSubmitting(true);
    await createDemoLink(formData);
    formRef.current?.reset();
    setSubmitting(false);
    setOpen(false);
  }

  if (!open) {
    return (
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        className="w-full"
      >
        <Plus className="mr-1.5 h-4 w-4" /> Add a Demo or Prototype
      </Button>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">
          Add a Demo or Prototype
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={handleSubmit} className="space-y-3">
          <Input
            name="title"
            placeholder='e.g., "Smart Nudge — Missing Forms SMS"'
            required
          />
          <Input
            name="url"
            type="url"
            placeholder="https://..."
            required
          />
          <Textarea
            name="description"
            placeholder="Brief description — what does it do, who is it for? (optional)"
            rows={2}
          />
          <div className="flex items-center justify-between">
            <Input
              name="author"
              placeholder="Your name"
              required
              className="w-40"
            />
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={submitting}>
                {submitting ? "Saving..." : "Add Link"}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
