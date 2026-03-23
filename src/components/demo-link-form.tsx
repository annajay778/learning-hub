"use client";

import { useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
        size="sm"
        className="w-full text-xs"
      >
        <Plus className="mr-1 h-3 w-3" /> Add a Demo or Prototype
      </Button>
    );
  }

  const showGenerateButton = url.trim().length > 0;

  return (
    <Card>
      <CardContent className="p-3.5">
        <form ref={formRef} action={handleSubmit} className="space-y-2.5">
          <Input
            name="title"
            placeholder="Title"
            required
            className="h-8 text-xs"
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
            className="h-8 text-xs"
          />

          <Select value={linkType} onValueChange={setLinkType}>
            <SelectTrigger className="h-8 w-full text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="demo">
                <Video className="h-3 w-3 text-blue-600" />
                Demo
              </SelectItem>
              <SelectItem value="prototype">
                <Globe className="h-3 w-3 text-purple-600" />
                Prototype
              </SelectItem>
              <SelectItem value="resource">
                <BookOpen className="h-3 w-3 text-amber-600" />
                Shared Resource
              </SelectItem>
            </SelectContent>
          </Select>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[10px] text-muted-foreground">
                Description
              </label>
              {showGenerateButton && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleGenerate}
                  disabled={generating}
                  className="h-6 gap-1 px-1.5 text-[10px] text-primary hover:text-primary"
                >
                  {generating ? (
                    <>
                      <Loader2 className="h-2.5 w-2.5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-2.5 w-2.5" />
                      Auto-generate
                    </>
                  )}
                </Button>
              )}
            </div>
            <Textarea
              name="description"
              placeholder="What does it do, who is it for?"
              rows={2}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setError(null);
              }}
              className="text-xs"
            />
            {error && (
              <p className="text-[10px] text-destructive">{error}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <Input
              name="author"
              placeholder="Your name"
              required
              className="h-8 w-32 text-xs"
            />
            <div className="flex gap-1.5">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 text-[11px] text-muted-foreground"
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
              <Button type="submit" size="sm" className="h-7 text-[11px]" disabled={submitting}>
                {submitting ? "Saving..." : "Add"}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
