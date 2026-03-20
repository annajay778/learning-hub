"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MarkdownViewer } from "@/components/markdown-viewer";
import { Eye, Pencil } from "lucide-react";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minRows?: number;
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Write in markdown...",
  minRows = 8,
}: MarkdownEditorProps) {
  const [preview, setPreview] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex justify-end">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setPreview(!preview)}
          className="text-xs"
        >
          {preview ? (
            <>
              <Pencil className="mr-1 h-3 w-3" /> Edit
            </>
          ) : (
            <>
              <Eye className="mr-1 h-3 w-3" /> Preview
            </>
          )}
        </Button>
      </div>
      {preview ? (
        <div className="min-h-[200px] rounded-md border border-border bg-card p-4">
          <MarkdownViewer content={value} />
        </div>
      ) : (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={minRows}
          className="min-h-[200px] font-mono text-sm"
        />
      )}
    </div>
  );
}
