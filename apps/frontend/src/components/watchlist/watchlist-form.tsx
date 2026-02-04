"use client"

import React from "react"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  FileText, 
  Link as LinkIcon, 
  Calculator,
  Euro,
  Info,
  AlertCircle
} from "lucide-react"
import { DEFAULT_VALUES, type WatchlistFormData } from "@/types/watchlist"
import { cn } from "@/lib/utils"

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
          value={value || ""}
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
    return {
      kaufnebenkosten,
      hausgeldGesamt,
      mietausfall: formData.mietausfall,
      kaltmiete: formData.kaltmieteProQm,
      name: formData.name,
    }
  }, [formData])

  const isFormValid = formData.name.trim() !== ""

  const handleSubmit = async () => {
    if (!isFormValid) return
    
    setIsSubmitting(true)
    try {
      // TODO: Connect to backend API
      console.log("Submitting watchlist:", formData)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      alert("Watchlist erstellt!")
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
          subtitle="Name und Suchkriterien der Watchlist"
        >
          <div className="space-y-4">
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
            <div className="space-y-2">
              <label className="text-sm font-medium text-card-foreground">
                Such-URL / Filter
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <LinkIcon className="h-4 w-4" />
                </div>
                <Input
                  type="text"
                  value={formData.searchUrl}
                  onChange={(e) => updateField("searchUrl", e.target.value)}
                  placeholder="https://www.immobilienscout24.de/Suche/..."
                  className="h-12 border-border bg-input pl-10 text-card-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>
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
                  value={formData.kaltmieteProQm || ""}
                  onChange={(e) => updateField("kaltmieteProQm", parseFloat(e.target.value) || 0)}
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
              value={summary.kaltmiete ? `${summary.kaltmiete.toFixed(2)} €/m²` : "—"} 
            />
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Bitte füllen Sie alle Pflichtfelder aus, um die Watchlist zu erstellen.
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
          </ul>
        </div>
      </div>
    </div>
  )
}
