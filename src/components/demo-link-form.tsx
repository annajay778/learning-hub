"use client";

import { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createDemoLink } from "@/lib/actions";
import { Plus, Sparkles, Loader2, Video, Globe, BookOpen } from "lucide-react";

export function DemoLinkForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [linkType, setLinkType] = useState("demo");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setSubmitting(true);
    formData.set("description", description);
    formData.set("linkType", linkType);
    await createDemoLink(formData);
    formRef.current?.reset();
    setUrl("");
    setDescription("");
    setLinkType("demo");
    setError(null);
    setSubmitting(false);
    setOpen(false);
  }

  async function handleGenerate() {
    if (!url.trim()) return;
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/describe-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (data.description) {
        setDescription(data.description);
      } else {
        setError(data.error || "Could not generate a description");
      }
    } catch {
      setError("Failed to generate description — try adding one manually");
    } finally {
      setGenerating(false);
    }
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

  const showGenerateButton = url.trim().length > 0;

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
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError(null);
            }}
          />

          {/* Type selector — Radix Select */}
          <Select value={linkType} onValueChange={setLinkType}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="demo">
                <Video className="h-3.5 w-3.5 text-blue-600" />
                Demo
              </SelectItem>
              <SelectItem value="prototype">
                <Globe className="h-3.5 w-3.5 text-purple-600" />
                Prototype
              </SelectItem>
              <SelectItem value="resource">
                <BookOpen className="h-3.5 w-3.5 text-amber-600" />
                Shared Resource
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Description with auto-generate */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm text-muted-foreground">
                Description
              </label>
              {showGenerateButton && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleGenerate}
                  disabled={generating}
                  className="h-7 gap-1.5 text-xs text-primary hover:text-primary"
                >
                  {generating ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3 w-3" />
                      Auto-generate from link
                    </>
                  )}
                </Button>
              )}
            </div>
            <Textarea
              name="description"
              placeholder="Brief description — what does it do, who is it for?"
              rows={2}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setError(null);
              }}
            />
            {error && (
              <p className="text-xs text-destructive">{error}</p>
            )}
          </div>

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
                onClick={() => {
                  setOpen(false);
                  setUrl("");
                  setDescription("");
                  setLinkType("demo");
                  setError(null);
                }}
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
