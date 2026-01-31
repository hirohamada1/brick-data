import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/context/AppContext";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";
import { Plus } from "lucide-react";
import type { Alert, AlertFrequency, AlertChannel, ListingType } from "@/data/mock";

const REGIONS = [
  { type: "stadt" as const, value: "München", label: "München", radiusKm: undefined },
  { type: "stadt" as const, value: "Berlin", label: "Berlin", radiusKm: undefined },
  { type: "stadt" as const, value: "Hamburg", label: "Hamburg", radiusKm: undefined },
  { type: "plz" as const, value: "80331", label: "PLZ 80331", radiusKm: undefined },
  { type: "radius" as const, value: "München", label: "München 10km Radius", radiusKm: 10 },
];

const OBJECT_TYPES: { value: ListingType | "alle"; label: string }[] = [
  { value: "alle", label: "Alle" },
  { value: "wohnung", label: "Wohnung" },
  { value: "haus", label: "Haus" },
  { value: "grundstueck", label: "Grundstück" },
];

const FREQUENCIES: { value: AlertFrequency; label: string }[] = [
  { value: "instant", label: "Sofort" },
  { value: "daily_digest", label: "Täglich Digest" },
];

const CHANNELS: { value: AlertChannel; label: string }[] = [
  { value: "in_app", label: "In-App" },
  { value: "email", label: "E-Mail" },
  { value: "push", label: "Push" },
];

export function Alerts() {
  const { alerts, pings, listings, addAlert, dismissPing, addListingToWatchlist } =
    useApp();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    region: REGIONS[0],
    type: "alle" as ListingType | "alle",
    maxBidPrice: 500000,
    minSqm: "",
    minRooms: "",
    newListing: true,
    priceDrop: true,
    frequency: "instant" as AlertFrequency,
    channel: "in_app" as AlertChannel,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCreateAlert = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Name erforderlich";
    if (form.maxBidPrice <= 0) newErrors.maxBidPrice = "Ungültiger Max-Bietpreis";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const region = {
      type: form.region.type,
      value: form.region.value,
      radiusKm: form.region.radiusKm,
    };

    const newAlert: Alert = {
      id: `a${Date.now()}`,
      name: form.name,
      region,
      type: form.type,
      maxBidPrice: form.maxBidPrice,
      minSqm: form.minSqm ? parseInt(form.minSqm, 10) : undefined,
      minRooms: form.minRooms ? parseInt(form.minRooms, 10) : undefined,
      triggers: [
        ...(form.newListing ? (["new_listing"] as const) : []),
        ...(form.priceDrop ? (["price_drop"] as const) : []),
      ],
      frequency: form.frequency,
      channel: form.channel,
      enabled: true,
      createdAt: new Date().toISOString(),
    };

    addAlert(newAlert);
    setForm({
      name: "",
      region: REGIONS[0],
      type: "alle",
      maxBidPrice: 500000,
      minSqm: "",
      minRooms: "",
      newListing: true,
      priceDrop: true,
      frequency: "instant",
      channel: "in_app",
    });
    setDialogOpen(false);
  };

  const activePings = pings.filter((p) => !p.dismissed);

  const getMatchBadge = (matchLevel: string) => {
    switch (matchLevel) {
      case "match":
        return <Badge variant="success">Match</Badge>;
      case "near":
        return <Badge variant="warning">Near</Badge>;
      default:
        return <Badge variant="secondary">Over</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alerts & Pings</h1>
          <p className="text-muted-foreground mt-1">
            Max-Bietpreis-Regeln und Ping-Inbox
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Alert erstellen
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Alert Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-2xl border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="px-4 py-3 text-left font-medium">Name</th>
                      <th className="px-4 py-3 text-left font-medium">Region/Filter</th>
                      <th className="px-4 py-3 text-left font-medium">Max-Bietpreis</th>
                      <th className="px-4 py-3 text-left font-medium">Kanal</th>
                      <th className="px-4 py-3 text-left font-medium">Status</th>
                      <th className="px-4 py-3 text-left font-medium">Letzte Auslösung</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alerts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                          Keine Alerts. Erstelle einen Alert.
                        </td>
                      </tr>
                    ) : (
                      alerts.map((alert) => (
                        <tr key={alert.id} className="border-b border-border last:border-0">
                          <td className="px-4 py-3 font-medium">{alert.name}</td>
                          <td className="px-4 py-3">{alert.region.value}</td>
                          <td className="px-4 py-3">{formatCurrency(alert.maxBidPrice)}</td>
                          <td className="px-4 py-3 capitalize">{alert.channel.replace("_", " ")}</td>
                          <td className="px-4 py-3">
                            <Badge variant={alert.enabled ? "success" : "secondary"}>
                              {alert.enabled ? "Aktiv" : "Inaktiv"}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {alert.lastTriggeredAt
                              ? formatRelativeTime(alert.lastTriggeredAt)
                              : "–"}
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
              <CardTitle>Ping Inbox</CardTitle>
            </CardHeader>
            <CardContent>
              {activePings.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground text-sm">
                  Keine neuen Pings.
                </div>
              ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {activePings.map((ping) => {
                    const listing = listings.find((l) => l.id === ping.listingId);
                    return (
                      <div
                        key={ping.id}
                        className="rounded-2xl border border-border p-4 space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-medium">{ping.message}</p>
                            <p className="text-xs text-muted-foreground">
                              {listing?.address ?? "–"}, {listing?.city ?? "–"}
                            </p>
                          </div>
                          {getMatchBadge(ping.matchLevel)}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap text-xs">
                          <span className="font-semibold">{formatCurrency(ping.price)}</span>
                          <span className="text-muted-foreground">
                            {listing?.sqm ? `${Math.round(ping.price / listing.sqm)} €/m²` : ""}
                          </span>
                          {ping.delta !== 0 && (
                            <span
                              className={
                                ping.delta < 0
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : "text-muted-foreground"
                              }
                            >
                              {ping.delta < 0 ? "" : "+"}
                              {formatCurrency(Math.abs(ping.delta))}{" "}
                              {ping.delta < 0 ? "unter" : "über"} Max-Bietpreis
                            </span>
                          )}
                          <span className="text-muted-foreground">
                            {formatRelativeTime(ping.createdAt)}
                          </span>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => addListingToWatchlist("w1", ping.listingId)}
                          >
                            Zur Watchlist
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => dismissPing(ping.id)}
                          >
                            Ablehnen
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg" showClose>
          <DialogHeader>
            <DialogTitle>Alert erstellen</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="z.B. München 3-Zimmer unter 500k"
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label>Region</Label>
              <Select
                value={`${form.region.type}-${form.region.value}-${form.region.radiusKm ?? ""}`}
                onValueChange={(v) => {
                  const r = REGIONS.find((x) => `${x.type}-${x.value}-${x.radiusKm ?? ""}` === v) ?? REGIONS[0];
                  setForm((f) => ({ ...f, region: r }));
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {REGIONS.map((r) => (
                    <SelectItem key={`${r.type}-${r.value}-${r.radiusKm ?? ""}`} value={`${r.type}-${r.value}-${r.radiusKm ?? ""}`}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Objektart</Label>
              <Select
                value={form.type}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, type: v as ListingType | "alle" }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {OBJECT_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="maxBidPrice">Budget / Max-Bietpreis (€)</Label>
              <Input
                id="maxBidPrice"
                type="number"
                value={form.maxBidPrice || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, maxBidPrice: parseInt(e.target.value, 10) || 0 }))
                }
              />
              {errors.maxBidPrice && (
                <p className="text-sm text-destructive">{errors.maxBidPrice}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="minSqm">min m² (optional)</Label>
                <Input
                  id="minSqm"
                  type="number"
                  value={form.minSqm}
                  onChange={(e) => setForm((f) => ({ ...f, minSqm: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="minRooms">Zimmer (optional)</Label>
                <Input
                  id="minRooms"
                  type="number"
                  value={form.minRooms}
                  onChange={(e) => setForm((f) => ({ ...f, minRooms: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Trigger</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={form.newListing}
                    onCheckedChange={(c) =>
                      setForm((f) => ({ ...f, newListing: !!c }))
                    }
                  />
                  <span className="text-sm">Neues Listing</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={form.priceDrop}
                    onCheckedChange={(c) =>
                      setForm((f) => ({ ...f, priceDrop: !!c }))
                    }
                  />
                  <span className="text-sm">Preissenkung</span>
                </label>
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Ping-Frequenz</Label>
              <Select
                value={form.frequency}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, frequency: v as AlertFrequency }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FREQUENCIES.map((f) => (
                    <SelectItem key={f.value} value={f.value}>
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Kanal</Label>
              <Select
                value={form.channel}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, channel: v as AlertChannel }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CHANNELS.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleCreateAlert}>Erstellen</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
