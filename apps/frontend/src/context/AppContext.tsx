import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type {
  Listing,
  Alert,
  Ping,
  Watchlist,
} from "@/data/mock";
import {
  mockListings,
  mockAlerts,
  mockPings,
  mockWatchlists,
} from "@/data/mock";
import type { MatchLevel } from "@/data/mock";

interface AppContextType {
  listings: Listing[];
  alerts: Alert[];
  pings: Ping[];
  watchlists: Watchlist[];
  addListing: (listing: Listing) => void;
  updateListing: (id: string, updates: Partial<Listing>) => void;
  addAlert: (alert: Alert) => void;
  updateAlert: (id: string, updates: Partial<Alert>) => void;
  addPing: (ping: Ping) => void;
  dismissPing: (id: string) => void;
  addWatchlist: (watchlist: Watchlist) => void;
  addListingToWatchlist: (watchlistId: string, listingId: string) => void;
  removeListingFromWatchlist: (watchlistId: string, listingId: string) => void;
  simulateNewListing: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [listings, setListings] = useState<Listing[]>(mockListings);
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [pings, setPings] = useState<Ping[]>(mockPings);
  const [watchlists, setWatchlists] = useState<Watchlist[]>(mockWatchlists);

  const addListing = useCallback((listing: Listing) => {
    setListings((prev) => [...prev, listing]);
  }, []);

  const updateListing = useCallback(
    (id: string, updates: Partial<Listing>) => {
      setListings((prev) =>
        prev.map((l) => (l.id === id ? { ...l, ...updates } : l))
      );
    },
    []
  );

  const addAlert = useCallback((alert: Alert) => {
    setAlerts((prev) => [...prev, alert]);
  }, []);

  const updateAlert = useCallback(
    (id: string, updates: Partial<Alert>) => {
      setAlerts((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
      );
    },
    []
  );

  const addPing = useCallback((ping: Ping) => {
    setPings((prev) => [ping, ...prev]);
  }, []);

  const dismissPing = useCallback((id: string) => {
    setPings((prev) =>
      prev.map((p) => (p.id === id ? { ...p, dismissed: true } : p))
    );
  }, []);

  const addWatchlist = useCallback((watchlist: Watchlist) => {
    setWatchlists((prev) => [...prev, watchlist]);
  }, []);

  const addListingToWatchlist = useCallback(
    (watchlistId: string, listingId: string) => {
      setWatchlists((prev) =>
        prev.map((w) =>
          w.id === watchlistId
            ? { ...w, listingIds: [...w.listingIds, listingId] }
            : w
        )
      );
    },
    []
  );

  const removeListingFromWatchlist = useCallback(
    (watchlistId: string, listingId: string) => {
      setWatchlists((prev) =>
        prev.map((w) =>
          w.id === watchlistId
            ? { ...w, listingIds: w.listingIds.filter((id) => id !== listingId) }
            : w
        )
      );
    },
    []
  );

  const simulateNewListing = useCallback(() => {
    const cities = ["München", "Berlin", "Hamburg", "Köln", "Frankfurt"];
    const sources = ["immoscout", "kleinanzeigen", "immowelt"] as const;
    const types = ["wohnung", "haus"] as const;
    const city = cities[Math.floor(Math.random() * cities.length)];
    const price = Math.floor(250000 + Math.random() * 400000);
    const sqm = Math.floor(50 + Math.random() * 100);
    const rooms = Math.floor(2 + Math.random() * 3);
    const now = new Date().toISOString();

    const newListing: Listing = {
      id: `l${Date.now()}`,
      title: `Neue ${types[Math.floor(Math.random() * types.length)] === "wohnung" ? "Wohnung" : "Immobilie"} in ${city}`,
      address: `Teststraße ${Math.floor(Math.random() * 100)}`,
      city,
      zip: String(80000 + Math.floor(Math.random() * 9999)),
      price,
      sqm,
      rooms,
      type: types[Math.floor(Math.random() * types.length)],
      source: sources[Math.floor(Math.random() * sources.length)],
      createdAt: now,
      updatedAt: now,
      status: "new",
      priceHistory: [{ date: now.split("T")[0], price }],
      signals: [{ type: "created", date: now }],
    };

    const alert = alerts.find((a) => a.enabled && a.type === (newListing.type === "wohnung" ? "wohnung" : "alle"));
    const maxBidPrice = alert?.maxBidPrice ?? 500000;
    const delta = price - maxBidPrice;
    let matchLevel: MatchLevel = "over";
    if (delta <= 0) matchLevel = "match";
    else if (delta <= maxBidPrice * 0.05) matchLevel = "near";

    const newPing: Ping = {
      id: `p${Date.now()}`,
      alertId: alert?.id ?? "a1",
      listingId: newListing.id,
      createdAt: now,
      kind: "new",
      message: `Neues Inserat: ${newListing.title}`,
      price,
      maxBidPrice,
      delta,
      matchLevel,
    };

    addListing(newListing);
    addPing(newPing);
  }, [alerts, addListing, addPing]);

  return (
    <AppContext.Provider
      value={{
        listings,
        alerts,
        pings,
        watchlists,
        addListing,
        updateListing,
        addAlert,
        updateAlert,
        addPing,
        dismissPing,
        addWatchlist,
        addListingToWatchlist,
        removeListingFromWatchlist,
        simulateNewListing,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
