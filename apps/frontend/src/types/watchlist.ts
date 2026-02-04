// Types for the Real Estate Watchlist Tool

export interface Hausgeld {
    umlagefaehig: number // Recoverable from tenant
    nichtUmlagefaehig: number // Non-recoverable
}

export interface ListingManualInputs {
    id?: string
    name: string // Watchlist name
    searchUrl: string // Search URL / Filter
    hausgeld: Hausgeld
    notarkosten: number // Default 1.5%
    grunderwerbssteuer: number // Default 3.5%
    grundbuchkosten: number // Default 0.5%
    mietausfall: number // Default 3%
    kaltmieteProQm: number // Estimated cold rent per sqm
    createdAt?: string
    updatedAt?: string
}

export interface WatchlistFormData extends Omit<ListingManualInputs, 'id' | 'createdAt' | 'updatedAt'> { }

export const DEFAULT_VALUES: WatchlistFormData = {
    name: '',
    searchUrl: '',
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
