"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { getManualInputs, upsertManualInputs } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import type { Listing, ManualInputs, ManualInputsInput } from "@/types/immo";

type ManualInputsSheetProps = {
  listing: Listing | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: (saved: ManualInputs) => void;
};

type FormState = {
  hausgeld_monthly_eur: string;
  expected_rent_cold_monthly_eur: string;
  vacancy_rate: string;
  maintenance_reserve_monthly_eur: string;
  is_estimated: boolean;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const emptyState: FormState = {
  hausgeld_monthly_eur: "",
  expected_rent_cold_monthly_eur: "",
  vacancy_rate: "",
  maintenance_reserve_monthly_eur: "",
  is_estimated: true,
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

function formatSqm(value: number | null | undefined): string {
  if (value === null || value === undefined) return "-";
  return `${value.toLocaleString("de-DE")} m²`;
}

export function ManualInputsSheet({
  listing,
  open,
  onOpenChange,
  onSaved,
}: ManualInputsSheetProps) {
  const [form, setForm] = useState<FormState>(emptyState);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const title = listing?.title || "Ohne Titel";

  const loadListingInputs = async (listingId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getManualInputs(listingId);
      if (!data) {
        setForm(emptyState);
        return;
      }
      setForm({
        hausgeld_monthly_eur: data.hausgeld_monthly_eur?.toString() ?? "",
        expected_rent_cold_monthly_eur:
          data.expected_rent_cold_monthly_eur?.toString() ?? "",
        vacancy_rate: data.vacancy_rate?.toString() ?? "",
        maintenance_reserve_monthly_eur:
          data.maintenance_reserve_monthly_eur?.toString() ?? "",
        is_estimated: data.is_estimated ?? true,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load manual inputs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open || !listing) return;
    setErrors({});
    loadListingInputs(listing.id);
  }, [open, listing?.id]);

  const handleChange = (key: keyof FormState, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    const nextErrors: FormErrors = {};
    const hausgeld = numberFromInput(form.hausgeld_monthly_eur);
    const expectedRent = numberFromInput(form.expected_rent_cold_monthly_eur);
    const reserve = numberFromInput(form.maintenance_reserve_monthly_eur);
    const vacancy = vacancyFromInput(form.vacancy_rate);

    if (
      form.hausgeld_monthly_eur.trim() !== "" &&
      (hausgeld === null || hausgeld < 0)
    ) {
      nextErrors.hausgeld_monthly_eur =
        "Hausgeld muss eine nicht-negative Zahl sein.";
    }

    if (
      form.expected_rent_cold_monthly_eur.trim() !== "" &&
      expectedRent === null
    ) {
      nextErrors.expected_rent_cold_monthly_eur = "Bitte eine Zahl eingeben.";
    } else if (expectedRent !== null && expectedRent < 0) {
      nextErrors.expected_rent_cold_monthly_eur =
        "Erwartete Kaltmiete darf nicht negativ sein.";
    }

    if (
      form.maintenance_reserve_monthly_eur.trim() !== "" &&
      reserve === null
    ) {
      nextErrors.maintenance_reserve_monthly_eur = "Bitte eine Zahl eingeben.";
    } else if (reserve !== null && reserve < 0) {
      nextErrors.maintenance_reserve_monthly_eur =
        "Ruecklage darf nicht negativ sein.";
    }

    if (form.vacancy_rate.trim() !== "" && vacancy === null) {
      nextErrors.vacancy_rate = "Bitte eine Zahl eingeben.";
    } else if (vacancy !== null && (vacancy < 0 || vacancy > 1)) {
      nextErrors.vacancy_rate = "Leerstandsquote muss zwischen 0 und 1 liegen.";
    }

    return {
      nextErrors,
      parsed: {
        hausgeld,
        expectedRent,
        reserve,
        vacancy,
      },
    };
  };

  const canSave = useMemo(() => !saving && !loading, [saving, loading]);

  const handleSave = async () => {
    if (!listing) return;
    const { nextErrors, parsed } = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const payload: ManualInputsInput = {
      hausgeld_monthly_eur: parsed.hausgeld,
      expected_rent_cold_monthly_eur: parsed.expectedRent,
      vacancy_rate: parsed.vacancy,
      maintenance_reserve_monthly_eur: parsed.reserve,
      is_estimated: form.is_estimated,
    };

    setSaving(true);
    setError(null);
    try {
      const saved = await upsertManualInputs(listing.id, payload);
      onSaved(saved);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save manual inputs.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Manual Inputs</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="text-sm font-medium text-foreground">{title}</div>
            <div className="text-xs text-muted-foreground">
              {listing?.price_eur ? formatCurrency(listing.price_eur) : "-"} ·{" "}
              {formatSqm(listing?.living_space_sqm)} · {listing?.rooms ?? "-"} Zimmer
            </div>
            {listing?.url ? (
              <a
                href={listing.url}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-muted-foreground underline-offset-4 hover:underline"
              >
                Listing oeffnen
              </a>
            ) : null}
          </div>

          {loading ? (
            <div className="text-sm text-muted-foreground">Lade Daten...</div>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-3">
                <Label htmlFor="hausgeld_monthly_eur">Hausgeld monatlich (EUR)</Label>
                <Input
                  id="hausgeld_monthly_eur"
                  inputMode="decimal"
                  value={form.hausgeld_monthly_eur}
                  onChange={(e) => handleChange("hausgeld_monthly_eur", e.target.value)}
                  placeholder="Optional"
                />
                {errors.hausgeld_monthly_eur ? (
                  <p className="text-xs text-destructive">{errors.hausgeld_monthly_eur}</p>
                ) : null}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="expected_rent_cold_monthly_eur">
                  Erwartete Kaltmiete monatlich (EUR)
                </Label>
                <Input
                  id="expected_rent_cold_monthly_eur"
                  inputMode="decimal"
                  value={form.expected_rent_cold_monthly_eur}
                  onChange={(e) =>
                    handleChange("expected_rent_cold_monthly_eur", e.target.value)
                  }
                  placeholder="Optional"
                />
                {errors.expected_rent_cold_monthly_eur ? (
                  <p className="text-xs text-destructive">
                    {errors.expected_rent_cold_monthly_eur}
                  </p>
                ) : null}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="vacancy_rate">Leerstandsquote (0-1 oder %)</Label>
                <Input
                  id="vacancy_rate"
                  inputMode="decimal"
                  value={form.vacancy_rate}
                  onChange={(e) => handleChange("vacancy_rate", e.target.value)}
                  placeholder="z.B. 0.05 oder 5%"
                />
                {errors.vacancy_rate ? (
                  <p className="text-xs text-destructive">{errors.vacancy_rate}</p>
                ) : null}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="maintenance_reserve_monthly_eur">
                  Instandhaltungsruecklage monatlich (EUR)
                </Label>
                <Input
                  id="maintenance_reserve_monthly_eur"
                  inputMode="decimal"
                  value={form.maintenance_reserve_monthly_eur}
                  onChange={(e) =>
                    handleChange("maintenance_reserve_monthly_eur", e.target.value)
                  }
                  placeholder="Optional"
                />
                {errors.maintenance_reserve_monthly_eur ? (
                  <p className="text-xs text-destructive">
                    {errors.maintenance_reserve_monthly_eur}
                  </p>
                ) : null}
              </div>

              <div className="flex items-center gap-3">
                <Checkbox
                  id="is_estimated"
                  checked={form.is_estimated}
                  onCheckedChange={(value) => handleChange("is_estimated", value === true)}
                />
                <Label htmlFor="is_estimated">Geschaetzte Werte</Label>
              </div>
            </div>
          )}

          {error ? <div className="text-sm text-destructive">{error}</div> : null}
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Abbrechen
          </Button>
          <Button onClick={handleSave} disabled={!canSave}>
            {saving ? "Speichern..." : "Speichern"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
