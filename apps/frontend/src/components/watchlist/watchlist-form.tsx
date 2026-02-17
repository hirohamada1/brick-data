"use client"

import React from "react"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  FileText,
  Calculator,
  Euro,
  Info,
  AlertCircle,
  Target,
  Percent,
  Banknote,
  Wrench,
  TrendingUp
} from "lucide-react"
import { DEFAULT_VALUES, type WatchlistFormData, type ZielmodusType as Zielmodus } from "@/types/watchlist"
import { cn } from "@/lib/utils"
import { createWatchlist, triggerWatchlistRun } from "@/lib/api"
import { SearchParamsSection, buildSearchUrl } from "@/components/watchlist/search-params-section"

interface FormSectionProps {
  icon: React.ReactNode
  title: string
  subtitle: string
  children: React.ReactNode
}

function FormSection({ icon, title, subtitle, children }: FormSectionProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  )
}

interface InputWithSuffixProps {
  label: string
  value: number | string
  onChange: (value: string) => void
  suffix: string
  placeholder?: string
  helperText?: string
}

function InputWithSuffix({
  label,
  value,
  onChange,
  suffix,
  placeholder,
  helperText
}: InputWithSuffixProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-card-foreground">{label}</label>
      <div className="relative">
        <Input
          type="number"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-12 border-border bg-input pr-12 text-card-foreground placeholder:text-muted-foreground"
        />
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          {suffix}
        </span>
      </div>
      {helperText && (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      )}
    </div>
  )
}

function SummaryRow({
  label,
  value,
  highlight = false
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={cn(
        "text-sm font-medium",
        highlight ? "text-primary" : "text-card-foreground"
      )}>
        {value}
      </span>
    </div>
  )
}

export function WatchlistForm() {
  const [formData, setFormData] = useState<WatchlistFormData>(DEFAULT_VALUES)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateField = <K extends keyof WatchlistFormData>(
    field: K,
    value: WatchlistFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const updateHausgeld = (field: "umlagefaehig" | "nichtUmlagefaehig", value: string) => {
    setFormData((prev) => ({
      ...prev,
      hausgeld: {
        ...prev.hausgeld,
        [field]: parseFloat(value) || 0,
      },
    }))
  }

  // Computed summary values
  const summary = useMemo(() => {
    const kaufnebenkosten = formData.notarkosten + formData.grunderwerbssteuer + formData.grundbuchkosten
    const hausgeldGesamt = formData.hausgeld.umlagefaehig + formData.hausgeld.nichtUmlagefaehig
    const annuitaet = formData.zinssatz + formData.tilgungssatz
    return {
      kaufnebenkosten,
      hausgeldGesamt,
      mietausfall: formData.mietausfall,
      kaltmiete: formData.kaltmieteProQm,
      name: formData.name,
      zielmodus: formData.zielmodus,
      annuitaet,
      zielDscr: formData.zielDscr,
      instandhaltung: formData.instandhaltungProQmMonat,
    }
  }, [formData])

  const updateZielmodus = (type: Zielmodus) => {
    if (type === 'nettorendite') {
      setFormData((prev) => ({
        ...prev,
        zielmodus: {
          type: 'nettorendite',
          zielNettorendite: 5,
          erlaubteAbweichung: 0.5,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        zielmodus: {
          type: 'cashflow',
          zielCashflow: 200,
          erlaubteAbweichung: 50,
        },
      }))
    }
  }

  const updateZielmodusField = (field: string, value: number) => {
    setFormData((prev) => ({
      ...prev,
      zielmodus: {
        ...prev.zielmodus,
        [field]: value,
      },
    }))
  }

  const isFormValid = formData.name.trim() !== "" && formData.locationPath !== ""

  const handleSubmit = async () => {
    if (!isFormValid) return

    setIsSubmitting(true)
    try {
      let specificDefaults;
      if (formData.zielmodus.type === "nettorendite") {
        specificDefaults = {
          zielmodus: "nettorendite" as const,
          zielNettorendite: formData.zielmodus.zielNettorendite,
          erlaubteAbweichungNettorendite: formData.zielmodus.erlaubteAbweichung,
        };
      } else {
        specificDefaults = {
          zielmodus: "cashflow" as const,
          zielCashflow: formData.zielmodus.zielCashflow,
          erlaubteAbweichungCashflow: formData.zielmodus.erlaubteAbweichung,
        };
      }

      const defaults = {
        hausgeld: {
          umlagefaehig: formData.hausgeld.umlagefaehig,
          nichtUmlagefaehig: formData.hausgeld.nichtUmlagefaehig,
        },
        notarkosten: formData.notarkosten,
        grunderwerbssteuer: formData.grunderwerbssteuer,
        grundbuchkosten: formData.grundbuchkosten,
        mietausfall: formData.mietausfall,
        kaltmieteProQm: formData.kaltmieteProQm,
        zinssatz: formData.zinssatz,
        tilgungssatz: formData.tilgungssatz,
        instandhaltungProQmMonat: formData.instandhaltungProQmMonat,
        zielDscr: formData.zielDscr,
        ...specificDefaults,
      }
      const generatedUrl = buildSearchUrl(formData)
      const payload = {
        name: formData.name.trim(),
        search_url: generatedUrl,
        defaults,
        location_label: formData.locationLabel || null,
        location_path: formData.locationPath || null,
        price_min: formData.priceMin,
        price_max: formData.priceMax,
        area_min: formData.areaMin,
        area_max: formData.areaMax,
        rooms_min: formData.roomsMin,
        rooms_max: formData.roomsMax,
      }
      const created = await createWatchlist(payload)
      await triggerWatchlistRun(created.id, "full_refresh")
      window.location.assign(`/watchlists/${created.id}/listings`)
    } catch (error) {
      console.error("Error creating watchlist:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr,380px]">
      {/* Left Column - Form */}
      <div className="space-y-6">
        {/* Grundinformationen */}
        <FormSection
          icon={<FileText className="h-6 w-6 text-primary" />}
          title="Grundinformationen"
          subtitle="Name der Watchlist"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium text-card-foreground">
              Watchlist Name
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="z.B. München Zentrum 2-Zimmer"
              className="h-12 border-border bg-input text-card-foreground placeholder:text-muted-foreground"
            />
          </div>
        </FormSection>

        {/* Suchkriterien */}
        <SearchParamsSection
          formData={formData}
          onUpdate={updateField}
        />

        {/* Zielmodus */}
        <FormSection
          icon={<Target className="h-6 w-6 text-primary" />}
          title="Zielmodus"
          subtitle="Wählen Sie Ihr Anlageziel"
        >
          <div className="space-y-6">
            {/* Toggle Buttons */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => updateZielmodus('nettorendite')}
                className={cn(
                  "flex-1 rounded-lg px-4 py-3 text-sm font-medium transition-all",
                  formData.zielmodus.type === 'nettorendite'
                    ? "bg-primary text-primary-foreground"
                    : "bg-input text-muted-foreground hover:bg-input/80"
                )}
              >
                <div className="flex items-center justify-center gap-2">
                  <Percent className="h-4 w-4" />
                  Nettorendite
                </div>
              </button>
              <button
                type="button"
                onClick={() => updateZielmodus('cashflow')}
                className={cn(
                  "flex-1 rounded-lg px-4 py-3 text-sm font-medium transition-all",
                  formData.zielmodus.type === 'cashflow'
                    ? "bg-primary text-primary-foreground"
                    : "bg-input text-muted-foreground hover:bg-input/80"
                )}
              >
                <div className="flex items-center justify-center gap-2">
                  <Banknote className="h-4 w-4" />
                  Cashflow
                </div>
              </button>
            </div>

            {/* Conditional Fields */}
            {formData.zielmodus.type === 'nettorendite' ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <InputWithSuffix
                  label="Ziel Nettorendite"
                  value={formData.zielmodus.zielNettorendite}
                  onChange={(v) => updateZielmodusField("zielNettorendite", parseFloat(v) || 0)}
                  suffix="%"
                  placeholder="5"
                  helperText="Gewünschte jährliche Nettorendite"
                />
                <InputWithSuffix
                  label="Erlaubte Abweichung"
                  value={formData.zielmodus.erlaubteAbweichung}
                  onChange={(v) => updateZielmodusField("erlaubteAbweichung", parseFloat(v) || 0)}
                  suffix="%"
                  placeholder="0.5"
                  helperText="Toleranz nach unten"
                />
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                <InputWithSuffix
                  label="Ziel Cashflow"
                  value={formData.zielmodus.zielCashflow}
                  onChange={(v) => updateZielmodusField("zielCashflow", parseFloat(v) || 0)}
                  suffix="€"
                  placeholder="200"
                  helperText="Gewünschter monatlicher Cashflow"
                />
                <InputWithSuffix
                  label="Erlaubte Abweichung"
                  value={formData.zielmodus.erlaubteAbweichung}
                  onChange={(v) => updateZielmodusField("erlaubteAbweichung", parseFloat(v) || 0)}
                  suffix="€"
                  placeholder="50"
                  helperText="Toleranz nach unten"
                />
              </div>
            )}
          </div>
        </FormSection>

        {/* Hausgeld */}
        <FormSection
          icon={<FileText className="h-6 w-6 text-primary" />}
          title="Hausgeld"
          subtitle="Monatliche Nebenkosten der Eigentümergemeinschaft"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <InputWithSuffix
              label="Umlagefähig"
              value={formData.hausgeld.umlagefaehig}
              onChange={(v) => updateHausgeld("umlagefaehig", v)}
              suffix="€"
              placeholder="0.00"
            />
            <InputWithSuffix
              label="Nicht umlagefähig"
              value={formData.hausgeld.nichtUmlagefaehig}
              onChange={(v) => updateHausgeld("nichtUmlagefaehig", v)}
              suffix="€"
              placeholder="0.00"
            />
          </div>
        </FormSection>

        {/* Kaufnebenkosten */}
        <FormSection
          icon={<Calculator className="h-6 w-6 text-primary" />}
          title="Kaufnebenkosten"
          subtitle="Prozentuale Zusatzkosten beim Immobilienkauf"
        >
          <div className="grid gap-4 sm:grid-cols-3">
            <InputWithSuffix
              label="Notarkosten"
              value={formData.notarkosten}
              onChange={(v) => updateField("notarkosten", parseFloat(v) || 0)}
              suffix="%"
              placeholder="1,5"
              helperText="Standard: 1,5%"
            />
            <InputWithSuffix
              label="Grunderwerbssteuer"
              value={formData.grunderwerbssteuer}
              onChange={(v) => updateField("grunderwerbssteuer", parseFloat(v) || 0)}
              suffix="%"
              placeholder="3,5"
              helperText="Standard: 3,5%"
            />
            <InputWithSuffix
              label="Grundbuchkosten"
              value={formData.grundbuchkosten}
              onChange={(v) => updateField("grundbuchkosten", parseFloat(v) || 0)}
              suffix="%"
              placeholder="0,5"
              helperText="Standard: 0,5%"
            />
          </div>
        </FormSection>

        {/* Mietannahmen */}
        <FormSection
          icon={<Euro className="h-6 w-6 text-primary" />}
          title="Mietannahmen"
          subtitle="Schätzungen für die Renditeberechnung"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <InputWithSuffix
              label="Mietausfall"
              value={formData.mietausfall}
              onChange={(v) => updateField("mietausfall", parseFloat(v) || 0)}
              suffix="%"
              placeholder="3"
              helperText="Jährliche Mietausfallwahrscheinlichkeit"
            />
            <div className="space-y-2">
              <label className="text-sm font-medium text-card-foreground">
                Geschätzte Kaltmiete/m²
              </label>
              <div className="relative">
                <Input
                  type="number"
                  value={formData.kaltmieteProQm ?? ""}
                  onChange={(e) => updateField("kaltmieteProQm", e.target.value === "" ? 0 : parseFloat(e.target.value))}
                  placeholder="0.00"
                  className="h-12 border-border bg-input pr-16 text-card-foreground placeholder:text-muted-foreground"
                />
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  €/m²
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Marktübliche Kaltmiete pro Quadratmeter
              </p>
            </div>
          </div>
        </FormSection>

        {/* Finanzierung */}
        <FormSection
          icon={<TrendingUp className="h-6 w-6 text-primary" />}
          title="Finanzierung"
          subtitle="Zins- und Tilgungsparameter"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <InputWithSuffix
              label="Zinssatz"
              value={formData.zinssatz}
              onChange={(v) => updateField("zinssatz", parseFloat(v) || 0)}
              suffix="%"
              placeholder="4"
              helperText="Standard: 4%"
            />
            <InputWithSuffix
              label="Tilgungssatz"
              value={formData.tilgungssatz}
              onChange={(v) => updateField("tilgungssatz", parseFloat(v) || 0)}
              suffix="%"
              placeholder="2"
              helperText="Standard: 2%"
            />
          </div>
        </FormSection>

        {/* Instandhaltung & DSCR */}
        <FormSection
          icon={<Wrench className="h-6 w-6 text-primary" />}
          title="Instandhaltung & Kennzahlen"
          subtitle="Rücklagen und Sicherheitskennzahlen"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <InputWithSuffix
              label="Instandhaltung pro qm/Monat"
              value={formData.instandhaltungProQmMonat}
              onChange={(v) => updateField("instandhaltungProQmMonat", parseFloat(v) || 0)}
              suffix="€"
              placeholder="0.50"
              helperText="Monatliche Rücklage pro Quadratmeter"
            />
            <InputWithSuffix
              label="Ziel DSCR"
              value={formData.zielDscr}
              onChange={(v) => updateField("zielDscr", parseFloat(v) || 0)}
              suffix=""
              placeholder="1.2"
              helperText="Debt Service Coverage Ratio (Standard: 1.2)"
            />
          </div>
        </FormSection>

        {/* Submit Button */}
        <div className="flex justify-center border-t border-border pt-6">
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            className="h-12 min-w-[240px] bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isSubmitting ? "Wird erstellt..." : "Watchlist erstellen"}
          </Button>
        </div>
      </div>

      {/* Right Column - Summary & Info */}
      <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
        {/* Zusammenfassung */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold text-card-foreground">Zusammenfassung</h3>
          </div>
          <div className="space-y-3">
            <SummaryRow label="Watchlist Name" value={summary.name || "—"} />
            <div className="my-3 border-t border-border" />
            <SummaryRow
              label="Standort"
              value={formData.locationLabel || "—"}
              highlight
            />
            <SummaryRow
              label="Kaufpreis"
              value={
                formData.priceMin != null || formData.priceMax != null
                  ? `${formData.priceMin?.toLocaleString("de-DE") ?? "—"} – ${formData.priceMax?.toLocaleString("de-DE") ?? "—"} €`
                  : "—"
              }
            />
            <SummaryRow
              label="Wohnfläche"
              value={
                formData.areaMin != null || formData.areaMax != null
                  ? `${formData.areaMin ?? "—"} – ${formData.areaMax ?? "—"} m²`
                  : "—"
              }
            />
            <SummaryRow
              label="Zimmer"
              value={
                formData.roomsMin != null || formData.roomsMax != null
                  ? `${formData.roomsMin ?? "—"} – ${formData.roomsMax ?? "—"}`
                  : "—"
              }
            />
            <div className="my-3 border-t border-border" />
            <SummaryRow
              label="Kaufnebenkosten gesamt"
              value={`${summary.kaufnebenkosten.toFixed(1)}%`}
              highlight
            />
            <SummaryRow
              label="Hausgeld gesamt"
              value={`${summary.hausgeldGesamt.toFixed(2)} €/Monat`}
            />
            <SummaryRow
              label="Mietausfall"
              value={`${summary.mietausfall}%`}
            />
            <SummaryRow
              label="Kaltmiete/m²"
              value={summary.kaltmiete != null ? `${summary.kaltmiete.toFixed(2)} €/m²` : "—"}
            />
            <div className="my-3 border-t border-border" />
            <SummaryRow
              label="Zielmodus"
              value={summary.zielmodus.type === 'nettorendite' ? 'Nettorendite' : 'Cashflow'}
              highlight
            />
            {summary.zielmodus.type === 'nettorendite' ? (
              <SummaryRow
                label="Ziel"
                value={`${summary.zielmodus.zielNettorendite}% (±${summary.zielmodus.erlaubteAbweichung}%)`}
              />
            ) : (
              <SummaryRow
                label="Ziel"
                value={`${summary.zielmodus.zielCashflow}€ (±${summary.zielmodus.erlaubteAbweichung}€)`}
              />
            )}
            <div className="my-3 border-t border-border" />
            <SummaryRow
              label="Annuität (Zins + Tilgung)"
              value={summary.annuitaet != null ? `${summary.annuitaet.toFixed(1)}%` : "—"}
            />
            <SummaryRow
              label="Ziel DSCR"
              value={summary.zielDscr != null ? summary.zielDscr.toFixed(2) : "—"}
            />
            <SummaryRow
              label="Instandhaltung/m²"
              value={summary.instandhaltung != null ? `${summary.instandhaltung.toFixed(2)} €` : "—"}
            />
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Standort ist ein Pflichtfeld. Die Such-URL wird automatisch generiert.
          </p>
        </div>

        {/* Info Box */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <Info className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold text-card-foreground">Info</h3>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Kaufnebenkosten variieren je nach Bundesland</li>
            <li>Hausgeld beeinflusst die Nettorendite</li>
            <li>Mietausfall als Sicherheitspuffer einplanen</li>
            <li>DSCR {">"} 1.0 bedeutet positiver Cashflow</li>
            <li>Instandhaltungsrücklage ca. 0.50-1.00 €/m²</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
