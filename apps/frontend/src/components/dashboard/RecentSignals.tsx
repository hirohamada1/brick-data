import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { formatRelativeTime, formatCurrency } from "@/lib/utils";
import { ArrowRight, TrendingDown, Plus, RefreshCw } from "lucide-react";

export function RecentSignals() {
  const { listings, pings } = useApp();
  const recentPings = pings.filter((p) => !p.dismissed).slice(0, 10);

  const getSignalIcon = (kind: string) => {
    switch (kind) {
      case "price_drop":
        return <TrendingDown className="h-4 w-4" />;
      case "relist":
        return <RefreshCw className="h-4 w-4" />;
      default:
        return <Plus className="h-4 w-4" />;
    }
  };

  const getSignalLabel = (kind: string) => {
    switch (kind) {
      case "price_drop":
        return "Preissenkung";
      case "relist":
        return "Relisting";
      default:
        return "Neues Listing";
    }
  };

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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Letzte Signals</CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link href="/alerts">
            Alle anzeigen
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {recentPings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground text-sm">
              Noch keine Signals. Erstelle einen Alert oder simuliere ein neues Listing.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentPings.map((ping) => {
              const listing = listings.find((l) => l.id === ping.listingId);
              return (
                <Link
                  key={ping.id}
                  href={`/listings?open=${ping.listingId}`}
                  className="flex items-center justify-between p-3 rounded-2xl border border-border hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      {getSignalIcon(ping.kind)}
                    </div>
                    <div>
                      <p className="text-sm font-medium group-hover:text-primary transition-colors">
                        {getSignalLabel(ping.kind)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {listing?.title ?? ping.message}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">
                      {formatCurrency(ping.price)}
                    </span>
                    {getMatchBadge(ping.matchLevel)}
                    <span className="text-xs text-muted-foreground">
                      {formatRelativeTime(ping.createdAt)}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
