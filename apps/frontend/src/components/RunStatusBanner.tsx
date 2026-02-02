"use client";

import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { getLatestRun } from "@/lib/api";
import { formatDateTime } from "@/lib/utils";
import type { RunStatus } from "@/types/immo";

type RunStatusBannerProps = {
  watchlistId: string;
};

const STATUS_LABELS: Record<string, string> = {
  queued: "Wartet",
  running: "Laeuft",
  done: "Fertig",
  failed: "Fehlgeschlagen",
};

const STATUS_BADGES: Record<string, "secondary" | "warning" | "success" | "destructive"> = {
  queued: "secondary",
  running: "warning",
  done: "success",
  failed: "destructive",
};

export function RunStatusBanner({ watchlistId }: RunStatusBannerProps) {
  const [status, setStatus] = useState<RunStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const data = await getLatestRun(watchlistId);
        if (!mounted) return;
        setStatus(data);
        setError(null);
        if (data.status === "done" || data.status === "failed") {
          if (intervalRef.current) {
            window.clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Status konnte nicht geladen werden.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    intervalRef.current = window.setInterval(load, 2000);

    return () => {
      mounted = false;
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [watchlistId]);

  if (loading && !status && !error) {
    return (
      <div className="rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
        Run-Status wird geladen...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
        {error}
      </div>
    );
  }

  if (!status) return null;

  const label = STATUS_LABELS[status.status] ?? status.status;
  const badge = STATUS_BADGES[status.status] ?? "secondary";

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-muted/20 px-4 py-3 text-sm">
      <Badge variant={badge}>Run: {label}</Badge>
      {status.started_at ? (
        <span className="text-muted-foreground">
          Gestartet: {formatDateTime(status.started_at)}
        </span>
      ) : null}
      {status.finished_at ? (
        <span className="text-muted-foreground">
          Fertig: {formatDateTime(status.finished_at)}
        </span>
      ) : null}
      {status.error ? (
        <span className="text-destructive">{status.error}</span>
      ) : null}
    </div>
  );
}
