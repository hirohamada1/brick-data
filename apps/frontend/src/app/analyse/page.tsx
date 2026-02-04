import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, Calculator, PieChart } from "lucide-react"

export default function AnalysePage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Analyse
        </h1>
        <p className="mt-2 text-muted-foreground">
          Detaillierte Renditeanalyse und Vergleiche Ihrer Immobilien
        </p>
      </div>

      {/* Placeholder Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border bg-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-card-foreground">Renditeübersicht</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Vergleichen Sie die Bruttorendite und Nettorendite Ihrer Watchlists.
            </p>
            <div className="mt-4 flex h-32 items-center justify-center rounded-lg border border-dashed border-border">
              <span className="text-sm text-muted-foreground">Chart wird geladen...</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <PieChart className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-card-foreground">Kostenverteilung</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Aufschlüsselung der Kaufnebenkosten und laufenden Kosten.
            </p>
            <div className="mt-4 flex h-32 items-center justify-center rounded-lg border border-dashed border-border">
              <span className="text-sm text-muted-foreground">Chart wird geladen...</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Calculator className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-card-foreground">Finanzierungsrechner</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Berechnen Sie verschiedene Finanzierungsszenarien für Ihre Objekte.
            </p>
            <div className="mt-4 flex h-32 items-center justify-center rounded-lg border border-dashed border-border">
              <span className="text-sm text-muted-foreground">Rechner wird geladen...</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-card-foreground">Marktvergleich</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Vergleichen Sie Ihre Parameter mit aktuellen Marktdaten.
            </p>
            <div className="mt-4 flex h-32 items-center justify-center rounded-lg border border-dashed border-border">
              <span className="text-sm text-muted-foreground">Daten werden geladen...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
