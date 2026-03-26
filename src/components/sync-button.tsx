"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Check } from "lucide-react";
import { useRouter } from "next/navigation";

interface SyncButtonProps {
  lastSyncedAt: string | null;
}

export function SyncButton({ lastSyncedAt }: SyncButtonProps) {
  const router = useRouter();
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  async function handleSync() {
    setSyncing(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/sync", { method: "POST" });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Sync failed");
        return;
      }
      const data = await res.json();
      const added = data.added || 0;
      const updated = data.updated || 0;
      if (added > 0 || updated > 0) {
        setResult(`+${added} new, ${updated} updated`);
      } else {
        setResult("Up to date");
      }
      router.refresh();
      setTimeout(() => setResult(null), 4000);
    } catch {
      setError("Sync failed");
    } finally {
      setSyncing(false);
    }
  }

  const lastSyncLabel = lastSyncedAt
    ? new Date(lastSyncedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : null;

  return (
    <div className="flex items-center gap-2">
      {error && (
        <span className="text-[10px] text-destructive">{error}</span>
      )}
      {result && (
        <span className="flex items-center gap-1 text-[10px] text-emerald-600">
          <Check className="h-2.5 w-2.5" />
          {result}
        </span>
      )}
      {lastSyncLabel && !result && (
        <span className="text-[10px] text-muted-foreground/50">
          {lastSyncLabel}
        </span>
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleSync}
        disabled={syncing}
        className="h-7 gap-1 px-2 text-[10px]"
      >
        <RefreshCw
          className={`h-2.5 w-2.5 ${syncing ? "animate-spin" : ""}`}
        />
        {syncing ? "Syncing" : "Sync"}
      </Button>
    </div>
  );
}
