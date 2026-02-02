"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ManualInputsSheet } from "@/components/ManualInputsSheet";
import { formatCurrency } from "@/lib/utils";
import type { Listing, ManualInputs } from "@/types/immo";

type ListingsTableProps = {
  listings: Listing[];
  loading: boolean;
  error: string | null;
  onReload: () => void;
  onListingUpdated: (listing: Listing) => void;
};

function formatSqm(value: number | null | undefined): string {
  if (value === null || value === undefined) return "-";
  return `${value.toLocaleString("de-DE")} m²`;
}

function formatLocation(listing: Listing): string {
  const cityLine = [listing.postcode, listing.city].filter(Boolean).join(" ");
  const full = [cityLine, listing.quarter].filter(Boolean).join(" · ");
  return full || "-";
}

export function ListingsTable({
  listings,
  loading,
  error,
  onReload,
  onListingUpdated,
}: ListingsTableProps) {
  const [selected, setSelected] = useState<Listing | null>(null);
  const [open, setOpen] = useState(false);

  const rows = useMemo(() => listings, [listings]);

  const handleOpen = (listing: Listing) => {
    setSelected(listing);
    setOpen(true);
  };

  const handleSaved = (saved: ManualInputs) => {
    if (!selected) return;
    onListingUpdated({
      ...selected,
      has_manual_inputs: saved !== null,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {loading ? "Lade Listings..." : `${rows.length} Listings`}
        </div>
        <Button variant="outline" size="sm" onClick={onReload} disabled={loading}>
          Neu laden
        </Button>
      </div>

      <div className="rounded-2xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titel</TableHead>
              <TableHead>Preis</TableHead>
              <TableHead>Qm</TableHead>
              <TableHead>Zimmer</TableHead>
              <TableHead>Ort</TableHead>
              <TableHead>Manual</TableHead>
              <TableHead className="text-right">Aktion</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-muted-foreground">
                  Lade Daten...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={7} className="text-destructive">
                  {error}
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-muted-foreground">
                  Keine Listings gefunden.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((listing) => (
                <TableRow key={listing.id}>
                  <TableCell className="font-medium">
                    {listing.title || "Ohne Titel"}
                  </TableCell>
                  <TableCell>
                    {listing.price_eur === null || listing.price_eur === undefined
                      ? "-"
                      : formatCurrency(listing.price_eur)}
                  </TableCell>
                  <TableCell>{formatSqm(listing.living_space_sqm)}</TableCell>
                  <TableCell>{listing.rooms ?? "-"}</TableCell>
                  <TableCell>{formatLocation(listing)}</TableCell>
                  <TableCell>
                    {listing.has_manual_inputs ? (
                      <Badge variant="success">Manual ✓</Badge>
                    ) : (
                      <Badge variant="secondary">Offen</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => handleOpen(listing)}>
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ManualInputsSheet
        listing={selected}
        open={open}
        onOpenChange={setOpen}
        onSaved={handleSaved}
      />
    </div>
  );
}
