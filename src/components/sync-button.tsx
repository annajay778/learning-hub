"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

interface SyncButtonProps {
  lastSyncedAt: string | null;
}

export function SyncButton({ lastSyncedAt }: SyncButtonProps) {
  const router = useRouter();
  const [syncing, setSyncing] = useState(false);
  const [result, setResult] = useState<{
    added: number;
    updated: number;
  } | null>(null);

  async function handleSync() {
    setSyncing(true);
    setResult(null);

    try {
      const res = await fetch("/api/sync", { method: "POST" });
      if (!res.ok) {
        const data = await res.json();
        alert(`Sync failed: ${data.error}`);
        return;
      }
      const data = await res.json();
      setResult({ added: data.added, updated: data.updated });
      router.refresh();
    } catch {
      alert("Sync failed — check console");
    } finally {
      setSyncing(false);
    }
  }

  const lastSyncLabel = lastSyncedAt
    ? `Last synced: ${new Date(lastSyncedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })}`
    : "Never synced";

  return (
    <div className="flex items-center gap-2">
      {result && (
        <span className="text-xs text-muted-foreground">
          +{result.added} new, {result.updated} updated
        </span>
      )}
      <div className="flex flex-col items-end">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSync}
          disabled={syncing}
          className="gap-1.5 text-xs"
        >
          <RefreshCw
            className={`h-3 w-3 ${syncing ? "animate-spin" : ""}`}
          />
          {syncing ? "Syncing..." : "Refresh"}
        </Button>
        <span className="mt-0.5 text-[10px] text-muted-foreground">
          {lastSyncLabel}
        </span>
      </div>
    </div>
  );
}
