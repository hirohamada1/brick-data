"use client";

import Link from "next/link";
import { useAuth, useUser } from "@clerk/nextjs";

import { Home, Bell, Download, Plus, Sparkles } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { getKPIs } from "@/data/mock";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { KPICard } from "@/components/dashboard/KPICard";
import { PriceChart } from "@/components/dashboard/PriceChart";
import { ListingsChart } from "@/components/dashboard/ListingsChart";
import { RecentSignals } from "@/components/dashboard/RecentSignals";
import { OnboardingInfo } from "@/components/dashboard/OnboardingInfo";

export default function Dashboard() {
  const { simulateNewListing, listings, watchlists } = useApp();
  const kpis = getKPIs(listings, watchlists);
  const { user } = useUser();

  // Hier werden die Daten von Clerk geholt.
  const { isLoaded, isSignedIn, getToken } = useAuth();

  // FALLBACK: Manuelles Anlegen des Users über Backend-API.
  // Dieser Code wird nicht mehr benötigt, da Clerk Webhooks den User automatisch anlegen.
  // Kann reaktiviert werden wenn der Webhook Probleme macht.
  //
  // const ensureHasRunRef = useRef(false);
  // const [userData, setUserData] = useState<any>(null);
  //
  // useEffect(() => {
  //   if (!isLoaded || !isSignedIn) return;
  //   if (ensureHasRunRef.current) return;
  //   ensureHasRunRef.current = true;
  //
  //   const ensureUser = async () => {
  //     const backendUrl =
  //       process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") ||
  //       "http://127.0.0.1:3001";
  //     const token = await getToken();
  //     if (!token) {
  //       console.warn("[ensure_user] No Clerk token available");
  //       return;
  //     }
  //     const controller = new AbortController();
  //     const timeout = setTimeout(() => controller.abort(), 8000);
  //     try {
  //       const res = await fetch(`${backendUrl}/api/users/ensure`, {
  //         method: "POST",
  //         headers: { Authorization: `Bearer ${token}` },
  //         signal: controller.signal,
  //       });
  //       if (!res.ok) {
  //         const text = await res.text();
  //         console.error("[ensure_user] failed:", res.status, text);
  //         return;
  //       }
  //       const json = await res.json();
  //       console.log("[ensure_user] ok:", json);
  //       if (json.user?.db_row) {
  //         setUserData(json.user.db_row);
  //       }
  //     } catch (err) {
  //       if ((err as any)?.name === "AbortError") {
  //         console.error("[ensure_user] timed out");
  //       } else {
  //         console.error("[ensure_user] error:", err);
  //       }
  //     } finally {
  //       clearTimeout(timeout);
  //     }
  //   };
  //   void ensureUser();
  // }, [isLoaded, isSignedIn, getToken]);

  // ✅ WICHTIG: JSX Return -> sonst ist die Funktion "void"
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Herzlich Willkommen{user?.firstName ? `, ${user.firstName}` : ""}
        </h1>
        <p className="text-muted-foreground mt-1">
          Schön, dass du wieder da bist. Hier ist deine aktuelle Übersicht.
        </p>
      </div>

      {/* FALLBACK: Supabase-ID Anzeige (gehoert zum alten ensure-Ansatz oben) */}
      {/* {userData && (
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Online: Supabase ID</span>{" "}
            <code className="bg-muted px-2 py-0.5 rounded">{userData.id}</code>
          </div>
        </div>
      )} */}

      <OnboardingInfo />

      <div className="flex flex-wrap gap-4">
        <Button onClick={simulateNewListing} size="lg">
          <Sparkles className="h-4 w-4 mr-2" />
          Simuliere neues Listing
        </Button>

        <Button variant="outline" size="lg" asChild>
          <Link href="/alerts">
            <Plus className="h-4 w-4 mr-2" />
            Neue Watchlist
          </Link>
        </Button>

        <Button variant="outline" size="lg" asChild>
          <Link href="/alerts">
            <Bell className="h-4 w-4 mr-2" />
            Alert erstellen
          </Link>
        </Button>

        <Button variant="outline" size="lg" asChild>
          <Link href="/listings">
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