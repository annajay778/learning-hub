"use client";

import { useState, useRef } from "react";
import { createHotTip } from "@/lib/actions";
import { Flame, Plus, X } from "lucide-react";

interface Tip {
  id: string;
  body: string;
  author: string;
  createdAt: Date;
}

export function HotTips({ tips }: { tips: Tip[] }) {
  const [adding, setAdding] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setSubmitting(true);
    await createHotTip(formData);
    formRef.current?.reset();
    setSubmitting(false);
    setAdding(false);
  }

  return (
    <div className="space-y-4">
      {/* Seed tips */}
      <div className="space-y-2.5">
        <div className="rounded-xl border border-[var(--s-card-border)] bg-[var(--s-card-bg)] p-4">
          <div className="mb-2 flex items-center gap-2">
            <Flame className="h-4 w-4 text-orange-500" />
            <code className="text-sm font-semibold text-[var(--s-accent)]">/loop</code>
          </div>
          <p className="text-sm text-[var(--s-text-body)]">
            Runs a prompt on a recurring interval. Great for monitoring — e.g.,{" "}
            <code className="text-[var(--s-accent)] text-xs">/loop 5m &quot;check
            the build status&quot;</code> polls every 5 minutes so you don&apos;t
            have to. It runs indefinitely until you stop it (Ctrl+C, /exit, or
            close the tab) — and uses tokens the whole time, so don&apos;t
            forget about it.
          </p>
        </div>

        <div className="rounded-xl border border-[var(--s-card-border)] bg-[var(--s-card-bg)] p-4">
          <div className="mb-2 flex items-center gap-2">
            <Flame className="h-4 w-4 text-orange-500" />
            <code className="text-sm font-semibold text-[var(--s-accent)]">/insights</code>
          </div>
          <p className="text-sm text-[var(--s-text-body)]">
            Surfaces patterns Claude has noticed across your sessions —
            recurring mistakes, things you always ask for, workflow habits.
            Useful for improving your CLAUDE.md and leveling up how you work
            with the AI.
          </p>
        </div>

        <div className="rounded-xl border border-[var(--s-card-border)] bg-[var(--s-card-bg)] p-4">
          <div className="mb-2 flex items-center gap-2">
            <Flame className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-semibold text-[var(--s-accent)]">
              Claude is lazy
            </span>
          </div>
          <p className="text-sm text-[var(--s-text-body)]">
            If Claude tells you to do something, tell Claude to do it for you
            and report back when it&apos;s done. It will default to handing
            you tasks it could easily handle itself — running commands, copying
            files, checking state. Push back and let it do the work.
          </p>
        </div>
      </div>

      {/* Community tips */}
      {tips.length > 0 && (
        <div className="space-y-2.5">
          {tips.map((tip) => (
            <div
              key={tip.id}
              className="rounded-xl border border-[var(--s-card-border)] bg-[var(--s-card-bg)] p-4"
            >
              <p className="text-sm text-[var(--s-text-body)]">{tip.body}</p>
              <p className="mt-2 text-[10px] text-[var(--s-text-dim)]">
                {tip.author} &middot;{" "}
                {new Date(tip.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Add tip form */}
      {adding ? (
        <form
          ref={formRef}
          action={handleSubmit}
          className="space-y-2 rounded-xl border border-dashed border-[var(--s-accent)]/30 p-4"
        >
          <textarea
            name="body"
            placeholder="Share a tip..."
            rows={2}
            required
            autoFocus
            className="w-full rounded-lg border border-[var(--s-card-border)] bg-[var(--s-code-bg)] px-3 py-2 text-sm text-[var(--s-text)] placeholder:text-[var(--s-text-dim)] focus:outline-none focus:ring-1 focus:ring-[var(--s-accent)]"
          />
          <div className="flex items-center justify-between">
            <input
              name="author"
              placeholder="Your name"
              required
              className="h-8 w-32 rounded-lg border border-[var(--s-card-border)] bg-[var(--s-code-bg)] px-3 text-xs text-[var(--s-text)] placeholder:text-[var(--s-text-dim)] focus:outline-none focus:ring-1 focus:ring-[var(--s-accent)]"
            />
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setAdding(false)}
                className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--s-text-dim)] hover:text-[var(--s-text)]"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-md bg-gradient-to-r from-purple-500 to-orange-500 px-3 py-1 text-xs font-medium text-white"
              >
                {submitting ? "..." : "Post"}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-[var(--s-card-border)] py-3 text-xs text-[var(--s-text-muted)] transition-colors hover:border-[var(--s-accent)]/40 hover:text-[var(--s-accent)]"
        >
          <Plus className="h-3.5 w-3.5" />
          Add a tip
        </button>
      )}
    </div>
  );
}
