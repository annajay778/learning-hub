"use client";

import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createDemoLink } from "@/lib/actions";
import { Plus, ExternalLink, X } from "lucide-react";

interface LinkItem {
  id: string;
  title: string;
  url: string;
  description: string;
  linkType: string;
  author: string;
  createdAt: Date;
}

interface LinkRowProps {
  title: string;
  linkType: "demo" | "prototype" | "cowork";
  items: LinkItem[];
  badgeClass: string;
  iconClass: string;
  icon: React.ComponentType<{ className?: string }>;
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return "";
  }
}

export function LinkRow({
  title,
  linkType,
  items,
  badgeClass,
  iconClass,
  icon: Icon,
}: LinkRowProps) {
  const [adding, setAdding] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setSubmitting(true);
    formData.set("linkType", linkType);
    formData.set("description", "");
    await createDemoLink(formData);
    formRef.current?.reset();
    setSubmitting(false);
    setAdding(false);
  }

  return (
    <div>
      <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {title}
      </h3>
      <div className="flex gap-2.5 overflow-x-auto pb-2">
        {/* Add button / inline form */}
        {adding ? (
          <Card className="w-56 shrink-0 border-dashed border-primary/30">
            <CardContent className="p-3">
              <form ref={formRef} action={handleSubmit} className="space-y-2">
                <Input
                  name="title"
                  placeholder="Title"
                  required
                  className="h-7 text-xs"
                  autoFocus
                />
                <Input
                  name="url"
                  type="url"
                  placeholder="https://..."
                  required
                  className="h-7 text-xs"
                />
                <Input
                  name="author"
                  placeholder="Your name"
                  required
                  className="h-7 text-xs"
                />
                <div className="flex gap-1.5">
                  <Button
                    type="submit"
                    size="sm"
                    className="h-6 flex-1 text-[10px]"
                    disabled={submitting}
                  >
                    {submitting ? "..." : "Add"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => setAdding(false)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="flex h-[72px] w-14 shrink-0 items-center justify-center rounded-xl border border-dashed border-border/60 text-muted-foreground/50 transition-colors hover:border-primary/30 hover:text-primary"
          >
            <Plus className="h-4 w-4" />
          </button>
        )}

        {/* Cards */}
        {items.map((link) => {
          const domain = extractDomain(link.url);
          return (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group shrink-0"
            >
              <Card className="h-[72px] w-60 border-border/50 transition-all hover:border-primary/20 hover:shadow-sm">
                <CardContent className="flex h-full items-center gap-2.5 p-3">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${iconClass}`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium leading-snug text-foreground group-hover:text-primary">
                      {link.title}
                    </p>
                    <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-muted-foreground/60">
                      <Badge
                        variant="outline"
                        className={`px-1.5 py-0 text-[9px] font-normal ${badgeClass}`}
                      >
                        {linkType}
                      </Badge>
                      {domain && (
                        <span className="flex items-center gap-0.5 truncate">
                          {domain}
                          <ExternalLink className="h-1.5 w-1.5 shrink-0" />
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </a>
          );
        })}

        {items.length === 0 && !adding && (
          <p className="flex h-[72px] items-center text-xs text-muted-foreground/40">
            None yet
          </p>
        )}
      </div>
    </div>
  );
}
