// BrickData Mock-Daten
// Architektur: Datenstrukturen sind so angelegt, dass ein Backend später leicht integrierbar ist.
// API-Layer würde hier eingefügt werden (z.B. fetch('/api/listings'), etc.)

export type ListingStatus = "new" | "watching" | "offer" | "missed";
export type ListingType = "wohnung" | "haus" | "grundstueck";
export type ListingSource = "immoscout" | "kleinanzeigen" | "immowelt";

export interface PricePoint {
  date: string;
  price: number;
}

export interface ListingSignal {
  type: "created" | "price_drop" | "relist";
  date: string;
  oldPrice?: number;
  newPrice?: number;
}

export interface Listing {
  id: string;
  title: string;
  address: string;
  city: string;
  zip: string;
  price: number;
  sqm: number;
  rooms: number;
  type: ListingType;
  source: ListingSource;
  createdAt: string;
  updatedAt: string;
  status: ListingStatus;
  priceHistory: PricePoint[];
  signals: ListingSignal[];
  energyClass?: string;
  yearBuilt?: number;
}

export type AlertTrigger = "new_listing" | "price_drop";
export type AlertFrequency = "instant" | "daily_digest";
export type AlertChannel = "in_app" | "email" | "push";

export interface Alert {
  id: string;
  name: string;
  region: { type: "stadt" | "plz" | "radius"; value: string; radiusKm?: number };
  type: ListingType | "alle";
  maxBidPrice: number;
  minSqm?: number;
  minRooms?: number;
  triggers: AlertTrigger[];
  frequency: AlertFrequency;
  channel: AlertChannel;
  enabled: boolean;
  lastTriggeredAt?: string;
  createdAt: string;
}

export type PingKind = "new" | "price_drop" | "relist";
export type MatchLevel = "match" | "near" | "over";

export interface Ping {
  id: string;
  alertId: string;
  listingId: string;
  createdAt: string;
  kind: PingKind;
  message: string;
  price: number;
  maxBidPrice: number;
  delta: number; // Differenz zu Max-Bietpreis (negativ = drunter)
  matchLevel: MatchLevel;
  dismissed?: boolean;
}

export interface Watchlist {
  id: string;
  name: string;
  listingIds: string[];
  createdAt: string;
}

// Preisbewegung für Charts (€/m² über Zeit)
export function getPriceMovementData(
  range: "7T" | "30T" | "12M"
): { date: string; pricePerSqm: number }[] {
  const days = range === "7T" ? 7 : range === "30T" ? 30 : 365;
  const base = 4500;
  const data: { date: string; pricePerSqm: number }[] = [];
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const variance = Math.sin(i / 3) * 200 + Math.random() * 100;
    data.push({
      date: d.toISOString().split("T")[0],
      pricePerSqm: Math.round(base + variance + (days - i) * 2),
    });
  }
  return data;
}

// Neue Inserate pro Tag (letzte 14 Tage)
export function getListingsPerDayData(): { date: string; count: number }[] {
  const data: { date: string; count: number }[] = [];
  const now = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    data.push({
      date: d.toISOString().split("T")[0],
      count: Math.floor(3 + Math.random() * 12),
    });
  }
  return data;
}

// Initiale Mock-Daten
const twoDaysAgo = new Date();
twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
const threeDaysAgo = new Date();
threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
const weekAgo = new Date();
weekAgo.setDate(weekAgo.getDate() - 7);

export const mockListings: Listing[] = [
  {
    id: "l1",
    title: "Moderne 3-Zimmer Wohnung mit Balkon",
    address: "Hauptstraße 42",
    city: "München",
    zip: "80331",
    price: 485000,
    sqm: 78,
    rooms: 3,
    type: "wohnung",
    source: "immoscout",
    createdAt: weekAgo.toISOString(),
    updatedAt: new Date().toISOString(),
    status: "watching",
    energyClass: "B",
    yearBuilt: 2015,
    priceHistory: [
      { date: weekAgo.toISOString().split("T")[0], price: 499000 },
      { date: threeDaysAgo.toISOString().split("T")[0], price: 485000 },
    ],
    signals: [
      { type: "created", date: weekAgo.toISOString() },
      { type: "price_drop", date: threeDaysAgo.toISOString(), oldPrice: 499000, newPrice: 485000 },
    ],
  },
  {
    id: "l2",
    title: "Einfamilienhaus mit Garten",
    address: "Parkweg 12",
    city: "Hamburg",
    zip: "20149",
    price: 620000,
    sqm: 145,
    rooms: 5,
    type: "haus",
    source: "immowelt",
    createdAt: twoDaysAgo.toISOString(),
    updatedAt: twoDaysAgo.toISOString(),
    status: "new",
    energyClass: "C",
    yearBuilt: 1998,
    priceHistory: [{ date: twoDaysAgo.toISOString().split("T")[0], price: 620000 }],
    signals: [{ type: "created", date: twoDaysAgo.toISOString() }],
  },
  {
    id: "l3",
    title: "2-Zimmer Altbau mit Stuck",
    address: "Friedrichstraße 88",
    city: "Berlin",
    zip: "10117",
    price: 320000,
    sqm: 52,
    rooms: 2,
    type: "wohnung",
    source: "kleinanzeigen",
    createdAt: threeDaysAgo.toISOString(),
    updatedAt: new Date().toISOString(),
    status: "new",
    energyClass: "D",
    yearBuilt: 1905,
    priceHistory: [
      { date: threeDaysAgo.toISOString().split("T")[0], price: 340000 },
      { date: new Date().toISOString().split("T")[0], price: 320000 },
    ],
    signals: [
      { type: "created", date: threeDaysAgo.toISOString() },
      { type: "price_drop", date: new Date().toISOString(), oldPrice: 340000, newPrice: 320000 },
    ],
  },
  {
    id: "l4",
    title: "Penthouse mit Dachterrasse",
    address: "Schwanthalerstraße 100",
    city: "München",
    zip: "80336",
    price: 890000,
    sqm: 120,
    rooms: 4,
    type: "wohnung",
    source: "immoscout",
    createdAt: weekAgo.toISOString(),
    updatedAt: weekAgo.toISOString(),
    status: "missed",
    energyClass: "A",
    yearBuilt: 2020,
    priceHistory: [{ date: weekAgo.toISOString().split("T")[0], price: 890000 }],
    signals: [{ type: "created", date: weekAgo.toISOString() }],
  },
  {
    id: "l5",
    title: "Grundstück für Eigenheim",
    address: "Gartenstraße 5",
    city: "Leipzig",
    zip: "04103",
    price: 185000,
    sqm: 450,
    rooms: 0,
    type: "grundstueck",
    source: "immowelt",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date().toISOString(),
    status: "watching",
    priceHistory: [
      { date: new Date(Date.now() - 86400000 * 5).toISOString().split("T")[0], price: 195000 },
      { date: new Date().toISOString().split("T")[0], price: 185000 },
    ],
    signals: [
      { type: "created", date: new Date(Date.now() - 86400000 * 5).toISOString() },
      {
        type: "price_drop",
        date: new Date().toISOString(),
        oldPrice: 195000,
        newPrice: 185000,
      },
    ],
  },
];

export const mockAlerts: Alert[] = [
  {
    id: "a1",
    name: "München 3-Zimmer unter 500k",
    region: { type: "stadt", value: "München" },
    type: "wohnung",
    maxBidPrice: 500000,
    minSqm: 60,
    minRooms: 3,
    triggers: ["new_listing", "price_drop"],
    frequency: "instant",
    channel: "in_app",
    enabled: true,
    lastTriggeredAt: threeDaysAgo.toISOString(),
    createdAt: weekAgo.toISOString(),
  },
  {
    id: "a2",
    name: "Berlin Friedrichshain",
    region: { type: "plz", value: "10243" },
    type: "wohnung",
    maxBidPrice: 350000,
    minSqm: 45,
    triggers: ["new_listing"],
    frequency: "daily_digest",
    channel: "email",
    enabled: true,
    lastTriggeredAt: threeDaysAgo.toISOString(),
    createdAt: weekAgo.toISOString(),
  },
];

export const mockPings: Ping[] = [
  {
    id: "p1",
    alertId: "a1",
    listingId: "l1",
    createdAt: threeDaysAgo.toISOString(),
    kind: "price_drop",
    message: "Preissenkung: Moderne 3-Zimmer Wohnung – jetzt unter Max-Bietpreis",
    price: 485000,
    maxBidPrice: 500000,
    delta: -15000,
    matchLevel: "match",
  },
  {
    id: "p2",
    alertId: "a1",
    listingId: "l3",
    createdAt: new Date().toISOString(),
    kind: "price_drop",
    message: "Preissenkung: 2-Zimmer Altbau Berlin – knapp unter Budget",
    price: 320000,
    maxBidPrice: 350000,
    delta: -30000,
    matchLevel: "match",
  },
  {
    id: "p3",
    alertId: "a1",
    listingId: "l2",
    createdAt: twoDaysAgo.toISOString(),
    kind: "new",
    message: "Neues Inserat: Einfamilienhaus Hamburg – über Budget",
    price: 620000,
    maxBidPrice: 500000,
    delta: 120000,
    matchLevel: "over",
  },
];

export const mockWatchlists: Watchlist[] = [
  {
    id: "w1",
    name: "München Favoriten",
    listingIds: ["l1", "l4"],
    createdAt: weekAgo.toISOString(),
  },
  {
    id: "w2",
    name: "Günstige Angebote",
    listingIds: ["l3", "l5"],
    createdAt: threeDaysAgo.toISOString(),
  },
];

// KPIs (berechnet aus Daten - kann Listen als Param erhalten für reaktive Updates)
export function getKPIs(
  listings: Listing[] = mockListings,
  watchlists: Watchlist[] = mockWatchlists
) {
  const last24h = new Date(Date.now() - 86400000);
  const last7d = new Date(Date.now() - 86400000 * 7);
  const newListings24h = listings.filter((l) => new Date(l.createdAt) >= last24h).length;
  const priceChanges7d = listings.filter((l) =>
    l.signals.some((s) => s.type === "price_drop" && new Date(s.date) >= last7d)
  ).length;
  const withSqm = listings.filter((l) => l.sqm > 0);
  const avgPricePerSqm =
    withSqm.length > 0
      ? withSqm.reduce((a, l) => a + l.price / l.sqm, 0) / withSqm.length
      : 0;
  const activeWatchlists = watchlists.length;

  return {
    newListings24h,
    priceChanges7d,
    avgPricePerSqm: Math.round(avgPricePerSqm),
    activeWatchlists,
  };
}
