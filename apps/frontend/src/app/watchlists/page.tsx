"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, List, Trash2, Edit, ExternalLink } from "lucide-react"
import type { ListingManualInputs } from "@/types/watchlist"

// Mock data for demonstration
const mockWatchlists: ListingManualInputs[] = [
  {
    id: "1",
    name: "München Zentrum 2-Zimmer",
    searchUrl: "https://www.immobilienscout24.de/Suche/...",
    hausgeld: { umlagefaehig: 150, nichtUmlagefaehig: 100 },
    notarkosten: 1.5,
    grunderwerbssteuer: 3.5,
    grundbuchkosten: 0.5,
    mietausfall: 3,
    kaltmieteProQm: 18.5,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Berlin Prenzlauer Berg",
    searchUrl: "https://www.immobilienscout24.de/Suche/...",
    hausgeld: { umlagefaehig: 120, nichtUmlagefaehig: 80 },
    notarkosten: 1.5,
    grunderwerbssteuer: 6.0,
    grundbuchkosten: 0.5,
    mietausfall: 2,
    kaltmieteProQm: 15.0,
    createdAt: "2024-01-10",
  },
]

export default function WatchlistPage() {
  const [watchlists] = useState<ListingManualInputs[]>(mockWatchlists)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Watchlists
          </h1>
          <p className="mt-2 text-muted-foreground">
            Verwalten Sie Ihre gespeicherten Suchkonfigurationen
          </p>
        </div>
        <Link href="/watchlist/new">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Neue Watchlist
          </Button>
        </Link>
      </div>

      {/* Watchlist Grid */}
      {watchlists.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {watchlists.map((watchlist) => (
            <Card key={watchlist.id} className="border-border bg-card">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg text-card-foreground">
                    {watchlist.name}
                  </CardTitle>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-card-foreground">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Kaufnebenkosten</p>
                    <p className="font-medium text-primary">
                      {(watchlist.notarkosten + watchlist.grunderwerbssteuer + watchlist.grundbuchkosten).toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Hausgeld</p>
                    <p className="font-medium text-card-foreground">
                      {(watchlist.hausgeld.umlagefaehig + watchlist.hausgeld.nichtUmlagefaehig).toFixed(0)} €
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Mietausfall</p>
                    <p className="font-medium text-card-foreground">{watchlist.mietausfall}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Kaltmiete/m²</p>
                    <p className="font-medium text-card-foreground">{watchlist.kaltmieteProQm} €</p>
                  </div>
                </div>
                {watchlist.searchUrl && (
                  <a 
                    href={watchlist.searchUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Zur Suche
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-border bg-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <List className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-card-foreground">
              Keine Watchlists vorhanden
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Erstellen Sie Ihre erste Watchlist, um Immobilienangebote zu tracken.
            </p>
            <Link href="/watchlist/new" className="mt-4">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                Watchlist erstellen
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
