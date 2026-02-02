import { Link } from "react-router-dom";
import { Footer } from "@/components/layout/Footer";

export function Impressum() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-background">
        <div className="container mx-auto px-4 md:px-8 py-4">
          <Link
            to="/"
            className="text-xl font-bold text-foreground hover:opacity-80 transition-opacity"
          >
            Brick<span style={{ color: "#10b77f" }}>Data</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 md:px-8 py-12 md:py-16 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-10 text-foreground">
          Impressum
        </h1>

        <div className="space-y-8 text-muted-foreground text-sm md:text-base leading-relaxed">
          <p className="font-medium text-foreground">Angaben gemäß § 5 TMG</p>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">Name des Dienstanbieters:</h2>
            <p>solucon technologies GmbH</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">Rechtsform:</h2>
            <p>GmbH</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">Vertretungsberechtigter Geschäftsführer:</h2>
            <p>Lucas Beneke</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">Anschrift:</h2>
            <p className="whitespace-pre-line">
              solucon technologies GmbH
              Schönebecker Straße 7
              39104 Magdeburg
              Deutschland
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">Kontakt:</h2>
            <p>
              E-Mail: contact@solucontech.com<br />
              Telefon: 01739046101
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">Registereintrag:</h2>
            <p>
              Registergericht: Amtsgericht Stendal<br />
              Handelsregister-Nummer: HRB 31838
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG:</h2>
            <p>DE355792000</p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <Link
            to="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Zurück zur Startseite
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
