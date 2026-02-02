import { beforeEach, describe, expect, it, vi } from "vitest";
import { getListings, getManualInputs, upsertManualInputs } from "@/lib/api";

const mockFetch = vi.fn();

beforeEach(() => {
  mockFetch.mockReset();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).fetch = mockFetch;
});

describe("api helpers", () => {
  it("getListings returns listings", async () => {
    const payload = [{ id: "1" }];
    mockFetch.mockResolvedValue({
      ok: true,
      text: async () => JSON.stringify(payload),
    });

    const result = await getListings();
    expect(result).toEqual(payload);
    expect(mockFetch).toHaveBeenCalledWith("/api/listings", {
      headers: { "Content-Type": "application/json" },
    });
  });

  it("getManualInputs returns null when backend returns null", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      text: async () => "null",
    });

    const result = await getManualInputs("listing-1");
    expect(result).toBeNull();
  });

  it("upsertManualInputs sends PUT payload", async () => {
    const payload = {
      hausgeld_monthly_eur: 120,
      expected_rent_cold_monthly_eur: 900,
      vacancy_rate: 0.05,
      maintenance_reserve_monthly_eur: 30,
      is_estimated: true,
    };
    const response = { listing_id: "listing-1", ...payload };
    mockFetch.mockResolvedValue({
      ok: true,
      text: async () => JSON.stringify(response),
    });

    const result = await upsertManualInputs("listing-1", payload);
    expect(result).toEqual(response);
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/listings/listing-1/manual-inputs",
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
  });

  it("throws a useful error on non-ok responses", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      text: async () => "Bad request",
    });

    await expect(getListings()).rejects.toThrow("Bad request");
  });
});
