"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, List, Trash2, Edit, ExternalLink, Loader2 } from "lucide-react"
import { getWatchlists } from "@/lib/api"

export default function WatchlistPage() {
  const { user, isLoaded: isUserLoaded } = useUser()
  const [watchlists, setWatchlists] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadWatchlists() {
      if (!isUserLoaded) return

      try {
        const data = await getWatchlists(user?.id)
        setWatchlists(data)
      } catch (error) {
        console.error("Failed to load watchlists:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadWatchlists()
  }, [user, isUserLoaded])

  if (!isUserLoaded || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Lade Watchlists...</p>
      </div>
    )
  }

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
        <Link href="/watchlists/new">
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
                      {((watchlist.notarkosten || 0) + (watchlist.grunderwerbssteuer || 0) + (watchlist.grundbuchkosten || 0)).toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Hausgeld</p>
                    <p className="font-medium text-card-foreground">
                      {((watchlist.defaults?.hausgeld?.umlagefaehig || 0) + (watchlist.defaults?.hausgeld?.nichtUmlagefaehig || 0)).toFixed(0)} €
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Mietausfall</p>
                    <p className="font-medium text-card-foreground">{watchlist.mietausfall || 0}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Kaltmiete/m²</p>
                    <p className="font-medium text-card-foreground">{watchlist.kaltmieteProQm || 0} €</p>
                  </div>
                </div>
                {watchlist.search_url && (
                  <a
                    href={watchlist.search_url}
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
            <Link href="/watchlists/new" className="mt-4">
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
