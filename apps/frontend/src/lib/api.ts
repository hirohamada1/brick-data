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

function normalizeBaseUrl(value?: string): string {
  return (value ?? "").trim().replace(/\/$/, "");
}

function getDefaultBaseUrl(): string {
  const configured = normalizeBaseUrl(process.env.NEXT_PUBLIC_API_BASE_URL);
  if (configured) {
    return configured;
  }

  throw new Error(
    "Missing NEXT_PUBLIC_API_BASE_URL. Set it in the active frontend .env file."
  );
}

function buildUrl(path: string, baseUrl?: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const prefix = normalizeBaseUrl(baseUrl ?? getDefaultBaseUrl());
  if (!prefix) return normalizedPath;
  return `${prefix}${normalizedPath}`;
}

async function request<T>(path: string, init: RequestOptions = {}): Promise<T> {
  const { baseUrl, headers, ...rest } = init;
  const isAbsolutePath = path.startsWith("http://") || path.startsWith("https://");
  const candidate = isAbsolutePath
    ? path
    : buildUrl(path, normalizeBaseUrl(baseUrl) || getDefaultBaseUrl());

  const res = await fetch(candidate, {
    headers: { "Content-Type": "application/json", ...(headers ?? {}) },
    ...rest,
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(text || `Request failed with ${res.status} (${candidate})`);
  }
  if (!text) {
    return null as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(
      `Failed to parse JSON response from ${candidate}. Received: ${text.slice(0, 200)}`
    );
  }
}

export async function createWatchlist(payload: {
  name: string;
  search_url: string;
  defaults: WatchlistDefaults;
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
