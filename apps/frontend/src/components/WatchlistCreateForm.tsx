"use client";

import { type FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createWatchlist, triggerWatchlistRun } from "@/lib/api";
import type { WatchlistDefaults } from "@/types/immo";

type FormState = {
  name: string;
  search_url: string;
  default_hausgeld_monthly_eur: string;
  default_vacancy_rate: string;
  default_maintenance_reserve_monthly_eur: string;
  default_is_estimated: boolean;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const emptyState: FormState = {
  name: "",
  search_url: "",
  default_hausgeld_monthly_eur: "",
  default_vacancy_rate: "",
  default_maintenance_reserve_monthly_eur: "",
  default_is_estimated: true,
};

function numberFromInput(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const normalized = trimmed.replace(",", ".").replace("%", "");
  const n = Number(normalized);
  if (Number.isNaN(n)) return null;
  return n;
}

function vacancyFromInput(value: string): number | null {
  const base = numberFromInput(value);
  if (base === null) return null;
  if (base > 1 && base <= 100) return base / 100;
  return base;
}

export function WatchlistCreateForm() {
  const [form, setForm] = useState<FormState>(emptyState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (key: keyof FormState, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    const nextErrors: FormErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "Name ist erforderlich.";
    }

    if (!form.search_url.trim()) {
      nextErrors.search_url = "Search-URL ist erforderlich.";
    }

    const hausgeld = numberFromInput(form.default_hausgeld_monthly_eur);
    if (
      form.default_hausgeld_monthly_eur.trim() !== "" &&
      (hausgeld === null || hausgeld < 0)
    ) {
      nextErrors.default_hausgeld_monthly_eur =
        "Hausgeld muss eine nicht-negative Zahl sein.";
    }

    const vacancy = vacancyFromInput(form.default_vacancy_rate);
    if (form.default_vacancy_rate.trim() !== "" && vacancy === null) {
      nextErrors.default_vacancy_rate = "Bitte eine Zahl eingeben.";
    } else if (vacancy !== null && (vacancy < 0 || vacancy > 1)) {
      nextErrors.default_vacancy_rate =
        "Leerstandsquote muss zwischen 0 und 1 liegen.";
    }

    const reserve = numberFromInput(form.default_maintenance_reserve_monthly_eur);
    if (
      form.default_maintenance_reserve_monthly_eur.trim() !== "" &&
      (reserve === null || reserve < 0)
    ) {
      nextErrors.default_maintenance_reserve_monthly_eur =
        "Ruecklage muss eine nicht-negative Zahl sein.";
    }

    return { nextErrors, parsed: { hausgeld, vacancy, reserve } };
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { nextErrors, parsed } = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const defaults: WatchlistDefaults = {
      hausgeld_monthly_eur: parsed.hausgeld,
      vacancy_rate: parsed.vacancy,
      maintenance_reserve_monthly_eur: parsed.reserve,
      is_estimated: form.default_is_estimated,
    };

    setSubmitting(true);
    setSubmitError(null);
    try {
      const created = await createWatchlist({
        name: form.name.trim(),
        search_url: form.search_url.trim(),
        defaults,
      });
      await triggerWatchlistRun(created.id, "full_refresh");
      window.location.assign(`/watchlists/${created.id}/listings`);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Watchlist konnte nicht erstellt werden."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-3">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="z.B. Leipzig 2-Zimmer"
        />
        {errors.name ? <p className="text-xs text-destructive">{errors.name}</p> : null}
      </div>

      <div className="grid gap-3">
        <Label htmlFor="search_url">Search-URL</Label>
        <Input
          id="search_url"
          value={form.search_url}
          onChange={(e) => handleChange("search_url", e.target.value)}
          placeholder="https://www.immobilienscout24.de/Suche/..."
        />
        {errors.search_url ? (
          <p className="text-xs text-destructive">{errors.search_url}</p>
        ) : null}
      </div>

      <div className="grid gap-3">
        <Label htmlFor="default_hausgeld_monthly_eur">
          Standard-Hausgeld monatlich (EUR)
        </Label>
        <Input
          id="default_hausgeld_monthly_eur"
          inputMode="decimal"
          value={form.default_hausgeld_monthly_eur}
          onChange={(e) =>
            handleChange("default_hausgeld_monthly_eur", e.target.value)
          }
          placeholder="Optional"
        />
        {errors.default_hausgeld_monthly_eur ? (
          <p className="text-xs text-destructive">
            {errors.default_hausgeld_monthly_eur}
          </p>
        ) : null}
      </div>

      <div className="grid gap-3">
        <Label htmlFor="default_vacancy_rate">
          Standard-Leerstandsquote (0-1 oder %)
        </Label>
        <Input
          id="default_vacancy_rate"
          inputMode="decimal"
          value={form.default_vacancy_rate}
          onChange={(e) => handleChange("default_vacancy_rate", e.target.value)}
          placeholder="z.B. 0.05 oder 5%"
        />
        {errors.default_vacancy_rate ? (
          <p className="text-xs text-destructive">{errors.default_vacancy_rate}</p>
        ) : null}
      </div>

      <div className="grid gap-3">
        <Label htmlFor="default_maintenance_reserve_monthly_eur">
          Standard-Instandhaltungsruecklage monatlich (EUR)
        </Label>
        <Input
          id="default_maintenance_reserve_monthly_eur"
          inputMode="decimal"
          value={form.default_maintenance_reserve_monthly_eur}
          onChange={(e) =>
            handleChange("default_maintenance_reserve_monthly_eur", e.target.value)
          }
          placeholder="Optional"
        />
        {errors.default_maintenance_reserve_monthly_eur ? (
          <p className="text-xs text-destructive">
            {errors.default_maintenance_reserve_monthly_eur}
          </p>
        ) : null}
      </div>

      <div className="flex items-center gap-3">
        <Checkbox
          id="default_is_estimated"
          checked={form.default_is_estimated}
          onCheckedChange={(value) =>
            handleChange("default_is_estimated", value === true)
          }
        />
        <Label htmlFor="default_is_estimated">Geschaetzte Werte</Label>
      </div>

      {submitError ? (
        <div className="text-sm text-destructive">{submitError}</div>
      ) : null}

      <Button type="submit" disabled={submitting}>
        {submitting ? "Erstelle..." : "Watchlist erstellen"}
      </Button>
    </form>
  );
}
