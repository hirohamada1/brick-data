"use client";

import { WatchlistCreateForm } from "@/components/WatchlistCreateForm";

export default function WatchlistCreatePage() {
  return (
    <div className="space-y-6 p-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Watchlist erstellen</h1>
        <p className="text-sm text-muted-foreground">
          Lege eine neue Watchlist mit Standardwerten fuer manuelle Inputs an.
        </p>
      </div>
      <WatchlistCreateForm />
    </div>
  );
}
