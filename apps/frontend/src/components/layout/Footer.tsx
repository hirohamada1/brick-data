import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 md:px-8 py-8 md:py-10">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between md:items-center">
          <p className="text-sm text-muted-foreground order-2 md:order-1">
            © {new Date().getFullYear()} Brick<span style={{ color: "#10b77f" }}>Data</span> – Immobilien-Daten & Preisverläufe
          </p>
          <nav className="flex flex-wrap items-center justify-center gap-6 md:gap-8 order-1 md:order-2" aria-label="Rechtliche Links">
            <Link
              to="/impressum"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Impressum
            </Link>
            <Link
              to="/datenschutz"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Datenschutz
            </Link>
            <Link
              to="/kontakt"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Kontakt
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
