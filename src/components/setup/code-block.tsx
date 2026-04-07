"use client";

import { useState, useCallback } from "react";
import { Copy, Check } from "lucide-react";

interface CodeBlockProps {
  code: string;
  filename?: string;
}

export function CodeBlock({ code, filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  return (
    <div className="group relative rounded-lg border border-[var(--s-code-border)] bg-[var(--s-code-bg)]">
      {filename && (
        <div className="border-b border-[var(--s-code-border)] px-4 py-2 text-[11px] text-[var(--s-text-dim)]">
          {filename}
        </div>
      )}
      <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed">
        <code className="text-[var(--s-code-text)]">{code}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-md border border-[var(--s-copy-border)] bg-[var(--s-copy-bg)] text-[var(--s-copy-text)] transition-colors hover:text-[var(--s-text-muted)]"
        aria-label="Copy to clipboard"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-[var(--s-accent-green)]" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </button>
    </div>
  );
}
