"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createBraindumpEntry, deleteBraindumpEntry } from "@/lib/actions";
import { Save, Loader2, Trash2, Check, Image, ScanText } from "lucide-react";

interface Entry {
  id: string;
  body: string;
  author: string;
  createdAt: Date;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Strip the data:image/...;base64, prefix
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function BraindumpEditor({ entries }: { entries: Entry[] }) {
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [pendingImage, setPendingImage] = useState<{
    base64: string;
    mimeType: string;
  } | null>(null);

  const processImage = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) return;

    // Show preview
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    // Store for extraction
    const base64 = await fileToBase64(file);
    setPendingImage({ base64, mimeType: file.type });
  }, []);

  async function extractText() {
    if (!pendingImage) return;
    setExtracting(true);

    try {
      const res = await fetch("/api/braindump/ocr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pendingImage),
      });
      const data = await res.json();
      if (data.text) {
        setValue((prev) => (prev ? prev + "\n\n" + data.text : data.text));
      }
    } catch {
      // Silent fail
    } finally {
      setExtracting(false);
      setImagePreview(null);
      setPendingImage(null);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) processImage(file);
  }

  function handlePaste(e: React.ClipboardEvent) {
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) processImage(file);
        return;
      }
    }
  }

  async function handleSave() {
    // If there's a pending image but no text yet, extract first
    if (pendingImage && !value.trim()) {
      await extractText();
      return;
    }

    if (!value.trim()) return;
    setSaving(true);
    setSaved(false);

    const formData = new FormData();
    formData.set("body", value);
    formData.set("author", "Anna");
    await createBraindumpEntry(formData);

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
    setImagePreview(null);
    setPendingImage(null);
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
      <div
        className="space-y-3"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <div className="relative">
          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onPaste={handlePaste}
            placeholder="Type, paste text, or drop an image. AI will extract the text from images automatically."
            rows={6}
            className="border-white/30 bg-white/70 text-sm backdrop-blur-sm placeholder:text-foreground/30 focus:bg-white/90"
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                e.preventDefault();
                handleSave();
              }
            }}
          />
        </div>

        {/* Image preview + extract button */}
        {imagePreview && (
          <div className="flex items-start gap-3 rounded-lg border border-white/30 bg-white/60 p-3 backdrop-blur-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagePreview}
              alt="Dropped image"
              className="h-20 w-auto rounded border border-white/40 object-cover"
            />
            <div className="flex-1 space-y-1.5">
              <p className="text-xs text-foreground/60">
                Image ready — extract the text or save with your notes
              </p>
              <Button
                onClick={extractText}
                disabled={extracting}
                variant="outline"
                size="sm"
                className="h-7 gap-1.5 border-white/40 bg-white/50 text-xs"
              >
                {extracting ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Extracting...
                  </>
                ) : (
                  <>
                    <ScanText className="h-3 w-3" />
                    Extract text from image
                  </>
                )}
              </Button>
            </div>
            <button
              onClick={() => {
                setImagePreview(null);
                setPendingImage(null);
              }}
              className="text-foreground/30 hover:text-foreground/60"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <p className="text-[10px] text-white/40">
              Cmd+Enter to save
            </p>
            <label className="flex cursor-pointer items-center gap-1 text-[10px] text-white/40 hover:text-white/60">
              <Image className="h-3 w-3" aria-hidden />
              Upload image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) processImage(file);
                  e.target.value = "";
                }}
              />
            </label>
          </div>
          <Button
            onClick={handleSave}
            disabled={saving || (!value.trim() && !pendingImage)}
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
