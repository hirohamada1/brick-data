import Link from "next/link";
import { Footer } from "@/components/layout/Footer";

export function Datenschutz() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-background">
        <div className="container mx-auto px-4 md:px-8 py-4">
          <Link
            href="/"
            className="text-xl font-bold text-foreground hover:opacity-80 transition-opacity"
          >
            Brick<span style={{ color: "#10b77f" }}>Data</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 md:px-8 py-12 md:py-16 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-10 text-foreground">
          Datenschutzerklärung
        </h1>

        <div className="space-y-8 text-muted-foreground text-sm md:text-base leading-relaxed">
          <p className="font-medium text-foreground">
            Der Schutz Ihrer personenbezogenen Daten ist uns wichtig. Nachfolgend informieren wir Sie über die Verarbeitung von Daten beim Besuch unserer Webseite und bei der Nutzung unseres Angebots BrickData.
          </p>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">1. Verantwortlicher</h2>
            <p>
              Verantwortlich für die Datenverarbeitung ist:<br />
              solucon technologies GmbH<br />
              Schönebecker Straße 7<br />
              39104 Magdeburg<br />
              Deutschland<br />
              E-Mail: contact@solucontech.com<br />
              Telefon: 01739046101
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">2. Erhebung und Verarbeitung von Daten</h2>
            <p>
              <strong>Kontaktformular:</strong> Wenn Sie uns über das Kontaktformular ansprechen, erheben wir die von Ihnen angegebenen Daten (z. B. Name, E-Mail-Adresse, Nachricht). Diese Daten verarbeiten wir ausschließlich zur Bearbeitung Ihrer Anfrage. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Vertragsanbahnung bzw. Durchführung) sowie Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Kommunikation).
            </p>
            <p className="mt-4">
              <strong>Zugriffsdaten:</strong> Beim Aufruf unserer Webseite werden automatisch technische Zugriffsdaten erfasst (z. B. IP-Adresse, Datum und Uhrzeit, Browsertyp). Diese Daten sind für den technischen Betrieb der Webseite erforderlich. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Bereitstellung und Sicherheit der Webseite).
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">3. Speicherdauer</h2>
            <p>
              Kontaktanfragen werden nach Abschluss der Bearbeitung gelöscht, sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen. Technische Zugriffsdaten werden nur so lange gespeichert, wie es für den Betrieb und die Sicherheit der Webseite erforderlich ist.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">4. Weitergabe von Daten</h2>
            <p>
              Eine Weitergabe Ihrer personenbezogenen Daten an Dritte erfolgt nicht, außer wir sind gesetzlich dazu verpflichtet oder die Verarbeitung erfolgt durch Dienstleister im Auftrag (z. B. Hosting). Mit solchen Auftragsverarbeitern bestehen Vereinbarungen gemäß Art. 28 DSGVO; die Verarbeitung erfolgt in der EU bzw. im EWR, soweit möglich.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">5. Cookies und lokale Speicherung</h2>
            <p>
              Unsere Webseite setzt nur technisch notwendige Speicherungen ein (z. B. für die Funktionsfähigkeit der Anwendung oder Ihre Präferenzen wie die Anzeige von Licht- oder Dunkelmodus). Es werden keine Analyse- oder Marketing-Cookies ohne Ihre Einwilligung verwendet.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">6. Ihre Rechte</h2>
            <p>
              Sie haben gegenüber uns das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16 DSGVO), Löschung (Art. 17 DSGVO), Einschränkung der Verarbeitung (Art. 18 DSGVO) und Datenübertragbarkeit (Art. 20 DSGVO). Sofern die Verarbeitung auf berechtigtem Interesse beruht, können Sie Widerspruch einlegen (Art. 21 DSGVO). Sie haben zudem das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">7. Änderungen</h2>
            <p>
              Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf anzupassen, um sie an geänderte Rechtslage oder unser Angebot anzupassen. Die jeweils aktuelle Fassung finden Sie auf dieser Seite.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <Link
            href="/"
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
