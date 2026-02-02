import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/layout/Footer";

export function Kontakt() {
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

      <main className="flex-1 container mx-auto px-4 md:px-8 py-12 md:py-16 max-w-2xl flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
          Kontakt
        </h1>
        <p className="text-muted-foreground text-sm md:text-base mb-8 max-w-md">
          Du hast Fragen oder möchtest mehr erfahren? Nutze unser Kontaktformular auf der Startseite.
        </p>
        <Button size="lg" className="rounded-2xl" asChild>
          <Link to="/#contact">
            <Mail className="mr-2 h-4 w-4" />
            Zum Kontaktformular
          </Link>
        </Button>
        <Link
          to="/"
          className="mt-8 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Zurück zur Startseite
        </Link>
      </main>

      <Footer />
    </div>
  );
}
