// Types for the Real Estate Watchlist Tool

export interface Hausgeld {
    umlagefaehig: number // Recoverable from tenant
    nichtUmlagefaehig: number // Non-recoverable
}

export type ZielmodusType = "nettorendite" | "cashflow"

export type ZielmodusConfig =
    | {
        type: "nettorendite"
        zielNettorendite: number
        erlaubteAbweichung: number
    }
    | {
        type: "cashflow"
        zielCashflow: number
        erlaubteAbweichung: number
    }

export interface ListingManualInputs {
    id?: string
    name: string // Watchlist name
    searchUrl: string // Auto-generated ImmobilienScout24 URL
    // Structured search parameters
    locationLabel: string // Display name, e.g. "Magdeburg"
    locationPath: string // IS24 URL path, e.g. "sachsen-anhalt/magdeburg"
    priceMin: number | null
    priceMax: number | null
    areaMin: number | null
    areaMax: number | null
    roomsMin: number | null
    roomsMax: number | null
    // Investment parameters
    zielmodus: ZielmodusConfig
    zinssatz: number
    tilgungssatz: number
    instandhaltungProQmMonat: number
    zielDscr: number
    hausgeld: Hausgeld
    notarkosten: number // Default 1.5%
    grunderwerbssteuer: number // Default 3.5%
    grundbuchkosten: number // Default 0.5%
    mietausfall: number // Default 3%
    kaltmieteProQm: number // Estimated cold rent per sqm
    createdAt?: string
    updatedAt?: string
}

export type Watchlist = ListingManualInputs

export interface WatchlistFormData extends Omit<ListingManualInputs, 'id' | 'createdAt' | 'updatedAt'> { }

export const DEFAULT_VALUES: WatchlistFormData = {
    name: '',
    searchUrl: '',
    locationLabel: '',
    locationPath: '',
    priceMin: null,
    priceMax: null,
    areaMin: null,
    areaMax: null,
    roomsMin: null,
    roomsMax: null,
    zielmodus: {
        type: "nettorendite",
        zielNettorendite: 5,
        erlaubteAbweichung: 0.5
    },
    zinssatz: 4,
    tilgungssatz: 2,
    instandhaltungProQmMonat: 0,
    zielDscr: 1.2,
    hausgeld: {
        umlagefaehig: 0,
        nichtUmlagefaehig: 0,
    },
    notarkosten: 1.5,
    grunderwerbssteuer: 3.5,
    grundbuchkosten: 0.5,
    mietausfall: 3,
    kaltmieteProQm: 0,
}
