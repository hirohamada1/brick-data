export type WatchlistDefaults = {
  hausgeld: {
    umlagefaehig: number;
    nichtUmlagefaehig: number;
  };
  notarkosten: number;
  grunderwerbssteuer: number;
  grundbuchkosten: number;
  mietausfall: number;
  kaltmieteProQm: number;
  zielmodus?: "nettorendite" | "cashflow";
  zielNettorendite?: number;
  erlaubteAbweichungNettorendite?: number;
  zielCashflow?: number;
  erlaubteAbweichungCashflow?: number;
  zinssatz?: number;
  tilgungssatz?: number;
  instandhaltungProQmMonat?: number;
  zielDscr?: number;
};

// Backwards-compatible shape (deprecated).
export type LegacyWatchlistDefaults = {
  hausgeld_monthly_eur: number | null;
  vacancy_rate: number | null;
  maintenance_reserve_monthly_eur: number | null;
  is_estimated: boolean;
};

export type Watchlist = {
  id: string;
  name: string;
  search_url: string;
  defaults?: WatchlistDefaults | null;
};

export type Listing = {
  id: string;
  source: string;
  external_id: string;
  url: string;
  title: string | null;
  price_eur: number | null;
  living_space_sqm: number | null;
  rooms: number | null;
  postcode: string | null;
  city: string | null;
  quarter: string | null;
  has_manual_inputs?: boolean;
};

export type ManualInputs = {
  listing_id: string;
  hausgeld_monthly_eur: number | null;
  expected_rent_cold_monthly_eur: number | null;
  vacancy_rate: number | null;
  maintenance_reserve_monthly_eur: number | null;
  is_estimated: boolean;
};

export type ManualInputsInput = Omit<ManualInputs, "listing_id">;

export type RunStatus = {
  run_id: string;
  status: "queued" | "running" | "done" | "failed" | string;
  started_at?: string;
  finished_at?: string;
  error?: string;
};
