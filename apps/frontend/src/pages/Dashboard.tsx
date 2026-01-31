import { Link } from "react-router-dom";
import {
  Home,
  Bell,
  Download,
  Plus,
  Sparkles,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { getKPIs } from "@/data/mock";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { KPICard } from "@/components/dashboard/KPICard";
import { PriceChart } from "@/components/dashboard/PriceChart";
import { ListingsChart } from "@/components/dashboard/ListingsChart";
import { RecentSignals } from "@/components/dashboard/RecentSignals";
import { OnboardingInfo } from "@/components/dashboard/OnboardingInfo";

export function Dashboard() {
  const { simulateNewListing, listings, watchlists } = useApp();
  const kpis = getKPIs(listings, watchlists);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Übersicht über Immobilien-Daten und Signals
        </p>
      </div>

      <OnboardingInfo />

      <div className="flex flex-wrap gap-4">
        <Button onClick={simulateNewListing} size="lg">
          <Sparkles className="h-4 w-4 mr-2" />
          Simuliere neues Listing
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link to="/alerts">
            <Plus className="h-4 w-4 mr-2" />
            Neue Watchlist
          </Link>
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link to="/alerts">
            <Bell className="h-4 w-4 mr-2" />
            Alert erstellen
          </Link>
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link to="/listings">
            <Download className="h-4 w-4 mr-2" />
            Listing importieren
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Neue Listings (24h)"
          value={kpis.newListings24h}
          icon={Home}
          trend={{ value: 0, label: "vs. Vortag" }}
          sparkline={[3, 5, 4, 6, 8, 7, 5]}
        />
        <KPICard
          title="Preisänderungen (7 Tage)"
          value={kpis.priceChanges7d}
          icon={Bell}
          trend={{ value: 0, label: "Preissenkungen" }}
          sparkline={[2, 1, 3, 2, 1, 4, 2]}
        />
        <KPICard
          title="Durchschnitt €/m² (Zielregion)"
          value={formatCurrency(kpis.avgPricePerSqm)}
          icon={Home}
          trend={{ value: 0, label: "Alle Quellen" }}
        />
        <KPICard
          title="Watchlists aktiv"
          value={kpis.activeWatchlists}
          icon={Bell}
          trend={{ value: 0, label: "Überwacht" }}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <PriceChart />
        <ListingsChart />
      </div>

      <RecentSignals />
    </div>
  );
}
