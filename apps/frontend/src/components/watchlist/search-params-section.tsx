"use client"

import React, { useState, useMemo, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { MapPin, Euro, Maximize2, DoorOpen, ChevronDown, Search, X } from "lucide-react"
import { LOCATIONS, type ImmoscoutLocation } from "@/data/immoscout-locations"
import type { WatchlistFormData } from "@/types/watchlist"

// ─── URL Builder ────────────────────────────────────────────────

export function buildSearchUrl(data: WatchlistFormData): string {
    if (!data.locationPath) return ""

    const base = `https://www.immobilienscout24.de/Suche/de/${data.locationPath}/wohnung-kaufen`
    const params = new URLSearchParams()

    if (data.roomsMin != null || data.roomsMax != null) {
        const min = data.roomsMin ?? 1.0
        const max = data.roomsMax ?? ""
        params.set("numberofrooms", `${min}-${max}`)
    }

    if (data.priceMin != null || data.priceMax != null) {
        const min = data.priceMin ?? ""
        const max = data.priceMax ?? ""
        params.set("price", `${min}-${max}`)
    }

    if (data.areaMin != null || data.areaMax != null) {
        const min = data.areaMin ?? ""
        const max = data.areaMax ?? ""
        params.set("livingspace", `${min}-${max}`)
    }

    params.set("enteredFrom", "result_list")

    const qs = params.toString()
    return qs ? `${base}?${qs}` : base
}

// ─── Location Combobox ──────────────────────────────────────────

interface LocationComboboxProps {
    value: string
    onSelect: (location: ImmoscoutLocation) => void
    onClear: () => void
}

function LocationCombobox({ value, onSelect, onClear }: LocationComboboxProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const containerRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const filtered = useMemo(() => {
        if (!searchQuery.trim()) return LOCATIONS.slice(0, 50)
        const q = searchQuery.toLowerCase()
        return LOCATIONS.filter((loc) => loc.label.toLowerCase().includes(q)).slice(0, 50)
    }, [searchQuery])

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false)
                setSearchQuery("")
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleSelect = (loc: ImmoscoutLocation) => {
        onSelect(loc)
        setIsOpen(false)
        setSearchQuery("")
    }

    return (
        <div ref={containerRef} className="relative">
            {value ? (
                <div className="flex h-12 items-center justify-between rounded-md border border-border bg-input px-4">
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="text-sm text-card-foreground">{value}</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            onClear()
                            setTimeout(() => inputRef.current?.focus(), 0)
                        }}
                        className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-card-foreground"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            ) : (
                <div className="relative">
                    <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <Search className="h-4 w-4" />
                    </div>
                    <Input
                        ref={inputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value)
                            setIsOpen(true)
                        }}
                        onFocus={() => setIsOpen(true)}
                        placeholder="Stadt oder Landkreis suchen…"
                        className="h-12 border-border bg-input pl-10 pr-10 text-card-foreground placeholder:text-muted-foreground"
                    />
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <ChevronDown className="h-4 w-4" />
                    </div>
                </div>
            )}

            {isOpen && !value && (
                <div className="absolute z-50 mt-1 max-h-64 w-full overflow-auto rounded-lg border border-border bg-popover shadow-lg">
                    {filtered.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-muted-foreground">
                            Kein Ergebnis gefunden
                        </div>
                    ) : (
                        filtered.map((loc) => (
                            <button
                                key={loc.path}
                                type="button"
                                onClick={() => handleSelect(loc)}
                                className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-card-foreground hover:bg-accent transition-colors"
                            >
                                <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                                {loc.label}
                            </button>
                        ))
                    )}
                </div>
            )}
        </div>
    )
}

// ─── Range Input ────────────────────────────────────────────────

interface RangeInputProps {
    label: string
    minValue: number | null
    maxValue: number | null
    onMinChange: (v: number | null) => void
    onMaxChange: (v: number | null) => void
    suffix: string
    minPlaceholder?: string
    maxPlaceholder?: string
}

function RangeInput({
    label,
    minValue,
    maxValue,
    onMinChange,
    onMaxChange,
    suffix,
    minPlaceholder = "von",
    maxPlaceholder = "bis",
}: RangeInputProps) {
    const parseValue = (v: string): number | null => {
        if (v === "") return null
        const n = parseFloat(v)
        return isNaN(n) ? null : n
    }

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-card-foreground">{label}</label>
            <div className="flex items-center gap-2">
                <div className="relative flex-1">
                    <Input
                        type="number"
                        value={minValue ?? ""}
                        onChange={(e) => onMinChange(parseValue(e.target.value))}
                        placeholder={minPlaceholder}
                        className="h-12 border-border bg-input pr-12 text-card-foreground placeholder:text-muted-foreground"
                    />
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        {suffix}
                    </span>
                </div>
                <span className="text-sm text-muted-foreground">–</span>
                <div className="relative flex-1">
                    <Input
                        type="number"
                        value={maxValue ?? ""}
                        onChange={(e) => onMaxChange(parseValue(e.target.value))}
                        placeholder={maxPlaceholder}
                        className="h-12 border-border bg-input pr-12 text-card-foreground placeholder:text-muted-foreground"
                    />
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        {suffix}
                    </span>
                </div>
            </div>
        </div>
    )
}

// ─── Main Section Component ─────────────────────────────────────

interface SearchParamsSectionProps {
    formData: WatchlistFormData
    onUpdate: <K extends keyof WatchlistFormData>(field: K, value: WatchlistFormData[K]) => void
}

export function SearchParamsSection({ formData, onUpdate }: SearchParamsSectionProps) {
    return (
        <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-6 flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-card-foreground">Suchkriterien</h3>
                    <p className="text-sm text-muted-foreground">
                        Definiere die ImmobilienScout24-Suchparameter
                    </p>
                </div>
            </div>

            <div className="space-y-5">
                {/* Location */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-card-foreground">Standort</label>
                    <LocationCombobox
                        value={formData.locationLabel}
                        onSelect={(loc) => {
                            onUpdate("locationLabel", loc.label)
                            onUpdate("locationPath", loc.path)
                        }}
                        onClear={() => {
                            onUpdate("locationLabel", "")
                            onUpdate("locationPath", "")
                        }}
                    />
                </div>

                {/* Price Range */}
                <RangeInput
                    label="Kaufpreis"
                    minValue={formData.priceMin}
                    maxValue={formData.priceMax}
                    onMinChange={(v) => onUpdate("priceMin", v)}
                    onMaxChange={(v) => onUpdate("priceMax", v)}
                    suffix="€"
                    minPlaceholder="min. Preis"
                    maxPlaceholder="max. Preis"
                />

                {/* Living Space */}
                <RangeInput
                    label="Wohnfläche"
                    minValue={formData.areaMin}
                    maxValue={formData.areaMax}
                    onMinChange={(v) => onUpdate("areaMin", v)}
                    onMaxChange={(v) => onUpdate("areaMax", v)}
                    suffix="m²"
                    minPlaceholder="min. m²"
                    maxPlaceholder="max. m²"
                />

                {/* Rooms */}
                <RangeInput
                    label="Zimmer"
                    minValue={formData.roomsMin}
                    maxValue={formData.roomsMax}
                    onMinChange={(v) => onUpdate("roomsMin", v)}
                    onMaxChange={(v) => onUpdate("roomsMax", v)}
                    suffix=""
                    minPlaceholder="min."
                    maxPlaceholder="max."
                />

                {/* Generated URL Preview */}
                {formData.locationPath && (
                    <div className="rounded-lg border border-border bg-muted/50 p-3">
                        <p className="mb-1 text-xs font-medium text-muted-foreground">Generierte Such-URL</p>
                        <p className="break-all text-xs text-primary">
                            {buildSearchUrl(formData)}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
