import type {
  Listing,
  ManualInputs,
  ManualInputsInput,
  RunStatus,
  WatchlistDefaults,
} from "@/types/immo";

type RequestOptions = RequestInit & {
  baseUrl?: string;
};

function getDefaultBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
}

function buildUrl(path: string, baseUrl?: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const prefix = baseUrl ?? getDefaultBaseUrl();
  return `${prefix}${path}`;
}

async function request<T>(path: string, init: RequestOptions = {}): Promise<T> {
  const { baseUrl, headers, ...rest } = init;
  const res = await fetch(buildUrl(path, baseUrl), {
    headers: { "Content-Type": "application/json", ...(headers ?? {}) },
    ...rest,
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(text || `Request failed with ${res.status}`);
  }
  if (!text) return null as T;
  return JSON.parse(text) as T;
}

export async function getWatchlists(userId?: string): Promise<any[]> {
  const url = userId ? `/api/watchlists?user_id=${userId}` : "/api/watchlists";
  return request<any[]>(url);
}

export async function createWatchlist(payload: {
  name: string;
  search_url: string;
  defaults: WatchlistDefaults;
  user_id?: string | null;
  location_label?: string | null;
  location_path?: string | null;
  price_min?: number | null;
  price_max?: number | null;
  area_min?: number | null;
  area_max?: number | null;
  rooms_min?: number | null;
  rooms_max?: number | null;
}): Promise<{ id: string }> {
  return request<{ id: string }>("/api/watchlists", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function triggerWatchlistRun(
  watchlistId: string,
  mode: "full_refresh" | string = "full_refresh"
): Promise<RunStatus> {
  return request<RunStatus>(`/api/watchlists/${watchlistId}/runs`, {
    method: "POST",
    body: JSON.stringify({ mode }),
  });
}

export async function getLatestRun(watchlistId: string): Promise<RunStatus> {
  return request<RunStatus>(`/api/watchlists/${watchlistId}/runs/latest`);
}

export async function getWatchlistListings(
  watchlistId: string
): Promise<Listing[]> {
  return request<Listing[]>(`/api/watchlists/${watchlistId}/listings`);
}

export async function getListings(): Promise<Listing[]> {
  return request<Listing[]>("/api/listings");
}

export async function getManualInputs(
  listingId: string
): Promise<ManualInputs | null> {
  return request<ManualInputs | null>(`/api/listings/${listingId}/manual-inputs`);
}

export async function upsertManualInputs(
  listingId: string,
  payload: ManualInputsInput
): Promise<ManualInputs> {
  return request<ManualInputs>(`/api/listings/${listingId}/manual-inputs`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
