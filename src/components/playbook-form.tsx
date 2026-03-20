"use client";

import { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MarkdownEditor } from "@/components/markdown-editor";
import { CategoryPicker } from "@/components/category-picker";
import { createPage } from "@/lib/actions";
import { Plus } from "lucide-react";

interface Category {
  id: string;
  name: string;
  color: string;
}

export function PlaybookForm({ categories }: { categories: Category[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [body, setBody] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  async function handleSubmit(formData: FormData) {
    setSubmitting(true);
    formData.set("type", "playbook");
    formData.set("body", body);
    if (categoryId) formData.set("categoryId", categoryId);
    await createPage(formData);
    formRef.current?.reset();
    setBody("");
    setCategoryId(null);
    setSubmitting(false);
    setOpen(false);
  }

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} variant="outline" className="w-full">
        <Plus className="mr-1.5 h-4 w-4" /> New Playbook
      </Button>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">
          New Playbook
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={handleSubmit} className="space-y-4">
          <Input name="title" placeholder="Playbook title" required />
          <CategoryPicker
            categories={categories}
            value={categoryId}
            onChange={setCategoryId}
          />
          <MarkdownEditor
            value={body}
            onChange={setBody}
            placeholder="Write your playbook in markdown..."
            minRows={6}
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
                {submitting ? "Saving..." : "Create Playbook"}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
