"use client";

import { useCallback, useEffect, useState } from "react";
import { ListingsTable } from "@/components/ListingsTable";
import { getListings } from "@/lib/api";
import type { Listing } from "@/types/immo";

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadListings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getListings();
      setListings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load listings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadListings();
  }, [loadListings]);

  const handleListingUpdated = (updated: Listing) => {
    setListings((prev) =>
      prev.map((item) => (item.id === updated.id ? { ...item, ...updated } : item))
    );
  };

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Manual Inputs</h1>
        <p className="text-sm text-muted-foreground">
          Listings laden und manuelle Kennzahlen pflegen.
        </p>
      </div>
      <ListingsTable
        listings={listings}
        loading={loading}
        error={error}
        onReload={loadListings}
        onListingUpdated={handleListingUpdated}
      />
    </div>
  );
}
