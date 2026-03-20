"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MarkdownViewer } from "@/components/markdown-viewer";
import { MarkdownEditor } from "@/components/markdown-editor";
import { CategoryBadge } from "@/components/category-badge";
import { CategoryPicker } from "@/components/category-picker";
import { updatePage, deletePage, togglePin } from "@/lib/actions";
import { Pencil, Trash2, Pin, PinOff, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PageData {
  id: string;
  title: string;
  body: string;
  categoryId: string | null;
  type: string;
  author: string;
  pinned: boolean;
  createdAt: Date;
  updatedAt: Date;
  categoryName: string | null;
  categoryColor: string | null;
}

interface Category {
  id: string;
  name: string;
  color: string;
  createdAt: Date;
}

export function PageView({
  page,
  categories,
}: {
  page: PageData;
  categories: Category[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(page.title);
  const [body, setBody] = useState(page.body);
  const [categoryId, setCategoryId] = useState<string | null>(
    page.categoryId
  );
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    const formData = new FormData();
    formData.set("title", title);
    formData.set("body", body);
    if (categoryId) formData.set("categoryId", categoryId);
    await updatePage(page.id, formData);
    setEditing(false);
    setSaving(false);
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm("Delete this page?")) return;
    await deletePage(page.id);
    router.push(page.type === "playbook" ? "/playbooks" : "/learnings");
  }

  async function handleTogglePin() {
    await togglePin(page.id);
    router.refresh();
  }

  const updatedDate = new Date(page.updatedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Link
          href={page.type === "playbook" ? "/playbooks" : "/learnings"}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </div>

      <Card>
        <CardHeader className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            {editing ? (
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-xl font-semibold"
              />
            ) : (
              <h1 className="text-xl font-semibold">{page.title}</h1>
            )}
            <div className="flex shrink-0 gap-1">
              {page.type === "playbook" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleTogglePin}
                  title={page.pinned ? "Unpin" : "Pin to home"}
                >
                  {page.pinned ? (
                    <PinOff className="h-4 w-4" />
                  ) : (
                    <Pin className="h-4 w-4" />
                  )}
                </Button>
              )}
              {!editing && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditing(true)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{page.author}</span>
            <span>·</span>
            <span>Updated {updatedDate}</span>
            {!editing && page.categoryName && (
              <>
                <span>·</span>
                <CategoryBadge
                  name={page.categoryName}
                  color={page.categoryColor}
                />
              </>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {editing ? (
            <div className="space-y-4">
              {page.type === "playbook" && (
                <CategoryPicker
                  categories={categories}
                  value={categoryId}
                  onChange={setCategoryId}
                />
              )}
              <MarkdownEditor value={body} onChange={setBody} />
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setTitle(page.title);
                    setBody(page.body);
                    setCategoryId(page.categoryId);
                    setEditing(false);
                  }}
                >
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          ) : (
            <MarkdownViewer content={page.body} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
