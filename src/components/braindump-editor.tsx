"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createBraindumpEntry, deleteBraindumpEntry } from "@/lib/actions";
import { Save, Loader2, Trash2, Check } from "lucide-react";

interface Entry {
  id: string;
  body: string;
  author: string;
  createdAt: Date;
}

export function BraindumpEditor({ entries }: { entries: Entry[] }) {
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);


  async function handleSave() {
    if (!value.trim()) return;
    setSaving(true);
    setSaved(false);

    // Save to DB via server action
    const formData = new FormData();
    formData.set("body", value);
    formData.set("author", "Anna");
    await createBraindumpEntry(formData);

    // Also save to Notion via API
    try {
      await fetch("/api/braindump", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: value, author: "Anna" }),
      });
    } catch {
      // Notion save is best-effort
    }

    setValue("");
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleDelete(id: string) {
    await deleteBraindumpEntry(id);
  }

  return (
    <div className="space-y-6">
      {/* Input area */}
      <div className="space-y-3">
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Drop thoughts, links, quotes, ideas — anything. Hit save and it goes to Notion too."
          rows={6}
          className="border-white/30 bg-white/70 text-sm backdrop-blur-sm placeholder:text-foreground/30 focus:bg-white/90"
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
              e.preventDefault();
              handleSave();
            }
          }}
        />
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-foreground/40">
            Cmd+Enter to save
          </p>
          <Button
            onClick={handleSave}
            disabled={saving || !value.trim()}
            size="sm"
            className="gap-1.5"
          >
            {saving ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                Saving...
              </>
            ) : saved ? (
              <>
                <Check className="h-3 w-3" />
                Saved
              </>
            ) : (
              <>
                <Save className="h-3 w-3" />
                Save
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Entries */}
      {entries.length > 0 && (
        <div className="space-y-2">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="group rounded-lg border border-white/20 bg-white/60 p-3.5 backdrop-blur-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                  {entry.body}
                </p>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="shrink-0 rounded p-1 text-foreground/20 opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
              <p className="mt-2 text-[10px] text-foreground/40">
                {entry.author} ·{" "}
                {new Date(entry.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
