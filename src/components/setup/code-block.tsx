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
    <div className="group relative rounded-lg border border-white/[0.06] bg-[#0d1117]">
      {filename && (
        <div className="border-b border-white/[0.06] px-4 py-2 text-[11px] text-white/30">
          {filename}
        </div>
      )}
      <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed">
        <code className="text-green-400">{code}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.04] text-white/40 transition-colors hover:bg-white/[0.08] hover:text-white/70"
        aria-label="Copy to clipboard"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-green-400" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </button>
    </div>
  );
}
