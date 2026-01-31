import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useApp } from "@/context/AppContext";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Search,
  Download,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  FileDown,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { ListingStatus, ListingSource } from "@/data/mock";

const STATUS_OPTIONS: { value: ListingStatus; label: string }[] = [
  { value: "new", label: "Neu" },
  { value: "watching", label: "Watching" },
  { value: "offer", label: "Offer" },
  { value: "missed", label: "Verpasst" },
];

const SOURCE_OPTIONS: { value: ListingSource; label: string }[] = [
  { value: "immoscout", label: "Immoscout" },
  { value: "kleinanzeigen", label: "Kleinanzeigen" },
  { value: "immowelt", label: "Immowelt" },
];

export function Listings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const openId = searchParams.get("open");
  const {
    listings,
    watchlists,
    updateListing,
    addListingToWatchlist,
  } = useApp();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<"price" | "createdAt" | "sqm">("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filteredListings = useMemo(() => {
    let list = [...listings];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.city.toLowerCase().includes(q) ||
          l.zip.includes(q)
      );
    }
    if (statusFilter !== "all") {
      list = list.filter((l) => l.status === statusFilter);
    }
    if (sourceFilter !== "all") {
      list = list.filter((l) => l.source === sourceFilter);
    }
    list.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "price") cmp = a.price - b.price;
      else if (sortKey === "createdAt")
        cmp =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      else if (sortKey === "sqm") cmp = (a.sqm || 0) - (b.sqm || 0);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [listings, search, statusFilter, sourceFilter, sortKey, sortDir]);

  const selectedListing = useMemo(
    () => listings.find((l) => l.id === openId),
    [listings, openId]
  );

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredListings.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filteredListings.map((l) => l.id)));
  };

  const handleSort = (key: "price" | "createdAt" | "sqm") => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else setSortKey(key);
  };

  const exportCSV = () => {
    const headers = [
      "Titel",
      "Ort",
      "PLZ",
      "Preis",
      "€/m²",
      "m²",
      "Zimmer",
      "Status",
      "Quelle",
    ];
    const rows = filteredListings.map((l) => [
      l.title,
      l.city,
      l.zip,
      l.price,
      l.sqm ? Math.round(l.price / l.sqm) : "",
      l.sqm,
      l.rooms,
      l.status,
      l.source,
    ]);
    const csv = [headers.join(";"), ...rows.map((r) => r.join(";"))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `brickdata-listings-${formatDate(new Date())}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const StatusBadge = ({ status }: { status: ListingStatus }) => {
    const v =
      status === "new"
        ? "default"
        : status === "watching"
        ? "success"
        : status === "offer"
        ? "warning"
        : "secondary";
    const label =
      STATUS_OPTIONS.find((s) => s.value === status)?.label ?? status;
    return <Badge variant={v}>{label}</Badge>;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Angebote</h1>
          <p className="text-muted-foreground mt-1">
            Listings verwalten und watchlists pflegen
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex gap-2 flex-wrap">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Suchen..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9 w-64"
                    />
                  </div>
                  <Select
                    value={statusFilter}
                    onValueChange={setStatusFilter}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle Status</SelectItem>
                      {STATUS_OPTIONS.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={sourceFilter}
                    onValueChange={setSourceFilter}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Quelle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle Quellen</SelectItem>
                      {SOURCE_OPTIONS.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline" size="sm" onClick={exportCSV}>
                  <FileDown className="h-4 w-4 mr-2" />
                  Export (CSV)
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-2xl border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="px-4 py-3 w-10">
                        <input
                          type="checkbox"
                          checked={
                            filteredListings.length > 0 &&
                            selectedIds.size === filteredListings.length
                          }
                          onChange={toggleSelectAll}
                          className="rounded"
                        />
                      </th>
                      <th className="px-4 py-3 text-left font-medium">Titel</th>
                      <th className="px-4 py-3 text-left font-medium">Ort/PLZ</th>
                      <th className="px-4 py-3 text-left font-medium">
                        <button
                          className="flex items-center gap-1 hover:text-foreground"
                          onClick={() => handleSort("price")}
                        >
                          Preis
                          {sortKey === "price" &&
                            (sortDir === "asc" ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            ))}
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left font-medium">
                        <button
                          className="flex items-center gap-1 hover:text-foreground"
                          onClick={() => handleSort("sqm")}
                        >
                          €/m²
                          {sortKey === "sqm" &&
                            (sortDir === "asc" ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            ))}
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left font-medium">Status</th>
                      <th className="px-4 py-3 text-left font-medium">Quelle</th>
                      <th className="px-4 py-3 text-left font-medium">
                        <button
                          className="flex items-center gap-1 hover:text-foreground"
                          onClick={() => handleSort("createdAt")}
                        >
                          Erstellt
                          {sortKey === "createdAt" &&
                            (sortDir === "asc" ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            ))}
                        </button>
                      </th>
                      <th className="px-4 py-3 w-10" />
                    </tr>
                  </thead>
                  <tbody>
                    {filteredListings.length === 0 ? (
                      <tr>
                        <td
                          colSpan={9}
                          className="px-4 py-12 text-center text-muted-foreground"
                        >
                          Keine Listings gefunden.
                        </td>
                      </tr>
                    ) : (
                      filteredListings.map((listing) => (
                        <tr
                          key={listing.id}
                          className="border-b border-border last:border-0 hover:bg-muted/30"
                        >
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={selectedIds.has(listing.id)}
                              onChange={() => toggleSelect(listing.id)}
                              className="rounded"
                            />
                          </td>
                          <td className="px-4 py-3 font-medium max-w-[200px] truncate">
                            {listing.title}
                          </td>
                          <td className="px-4 py-3">
                            {listing.city} {listing.zip}
                          </td>
                          <td className="px-4 py-3">
                            {formatCurrency(listing.price)}
                          </td>
                          <td className="px-4 py-3">
                            {listing.sqm
                              ? Math.round(listing.price / listing.sqm)
                              : "–"}
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={listing.status} />
                          </td>
                          <td className="px-4 py-3 capitalize">
                            {listing.source}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {formatDate(listing.createdAt)}
                          </td>
                          <td className="px-4 py-3">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                setSearchParams({ open: listing.id })
                              }
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Watchlists</CardTitle>
            </CardHeader>
            <CardContent>
              {watchlists.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4">
                  Keine Watchlists. Erstelle eine im Dashboard.
                </p>
              ) : (
                <div className="space-y-2">
                  {watchlists.map((w) => (
                    <div
                      key={w.id}
                      className="rounded-2xl border border-border p-3"
                    >
                      <p className="font-medium text-sm">{w.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {w.listingIds.length} Listings
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog
        open={!!openId}
        onOpenChange={(open) => {
          if (!open) setSearchParams({});
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" showClose>
          {selectedListing && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedListing.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Adresse</p>
                    <p className="font-medium">
                      {selectedListing.address}, {selectedListing.zip}{" "}
                      {selectedListing.city}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Preis</p>
                    <p className="font-medium text-lg">
                      {formatCurrency(selectedListing.price)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">m²</p>
                    <p className="font-medium">{selectedListing.sqm}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Zimmer</p>
                    <p className="font-medium">{selectedListing.rooms}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Baujahr</p>
                    <p className="font-medium">
                      {selectedListing.yearBuilt ?? "–"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Energieklasse</p>
                    <p className="font-medium">
                      {selectedListing.energyClass ?? "–"}
                    </p>
                  </div>
                </div>

                {selectedListing.priceHistory.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Preisverlauf</h4>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={selectedListing.priceHistory}
                          margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            className="stroke-muted"
                          />
                          <XAxis
                            dataKey="date"
                            tick={{ fontSize: 10 }}
                            tickFormatter={(v) =>
                              new Date(v).toLocaleDateString("de-DE", {
                                day: "2-digit",
                                month: "2-digit",
                              })
                            }
                          />
                          <YAxis
                            tick={{ fontSize: 10 }}
                            tickFormatter={(v) =>
                              `${(v / 1000).toFixed(0)}k`
                            }
                          />
                          <Tooltip
                            formatter={(v: number | undefined) => formatCurrency(v ?? 0)}
                            labelFormatter={(l) => formatDate(l)}
                          />
                          <Line
                            type="monotone"
                            dataKey="price"
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            dot={{ r: 3 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold mb-2">Timeline</h4>
                  <div className="space-y-2">
                    {selectedListing.signals.map((s, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-sm py-1"
                      >
                        <span className="text-muted-foreground capitalize">
                          {s.type === "price_drop"
                            ? "Preissenkung"
                            : s.type === "relist"
                            ? "Relisting"
                            : "Erstellt"}
                        </span>
                        <span>{formatDate(s.date)}</span>
                        {s.oldPrice && s.newPrice && (
                          <span className="text-muted-foreground">
                            {formatCurrency(s.oldPrice)} →{" "}
                            {formatCurrency(s.newPrice)}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="flex gap-2 flex-wrap">
                  <Select
                    onValueChange={(watchlistId) => {
                      addListingToWatchlist(watchlistId, selectedListing.id);
                    }}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Zu Watchlist hinzufügen" />
                    </SelectTrigger>
                    <SelectContent>
                      {watchlists.map((w) => (
                        <SelectItem key={w.id} value={w.id}>
                          {w.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" onClick={exportCSV}>
                    <Download className="h-4 w-4 mr-2" />
                    Export (CSV)
                  </Button>
                  <Select
                    value={selectedListing.status}
                    onValueChange={(v) =>
                      updateListing(selectedListing.id, {
                        status: v as ListingStatus,
                      })
                    }
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
