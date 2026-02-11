import { useEffect, useState } from "react";
import { SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { Moon, Sun, TrendingUp, Bell, Home, BarChart3, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RotatingHeroTitle } from "@/components/landing/RotatingHeroTitle";
import { UnitPingFeature } from "@/components/landing/UnitPingFeature";
import { PriceChart } from "@/components/dashboard/PriceChart";
import { ListingsChart } from "@/components/dashboard/ListingsChart";
import { Footer } from "@/components/layout/Footer";

const features = [
  {
    icon: TrendingUp,
    title: "Preisverläufe",
    description: "BrickData zeigt Preisbewegungen, Relistings und Preissenkungen in Echtzeit.",
  },
  {
    icon: Bell,
    title: "Alerts & Preislimits",
    description: "Lege individuelle Preislimits fest und bleibe bei neuen Inseraten oder Preisänderungen informiert.",
  },
  {
    icon: Home,
    title: "Angebote managen",
    description: "Verwalte deine Watchlists, filtere nach Region und Status – alles an einem Ort.",
  },
  {
    icon: BarChart3,
    title: "Marktanalysen & Trends",
    description: "Erkenne Preisentwicklungen, Angebotsdynamiken und Marktbewegungen auf einen Blick.",
  },
];

export function Landing() {
  const { theme, toggleTheme } = useTheme();
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });

  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash;
      if (hash === "#contact") {
        const el = document.getElementById("contact");
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);
    return () => window.removeEventListener("hashchange", scrollToHash);
  }, []);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Danke für deine Nachricht! (Demo – keine echte Verarbeitung)");
    setContactForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Topbar */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
          <span className="text-xl font-bold">Brick<span style={{ color: '#10b77f' }}>Data</span></span>
          <nav className="flex items-center gap-4">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Kontakt
            </a>
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Theme wechseln">
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </nav>
        </div>
      </header>

      <main className="pt-16">
        {/* Hero */}
        <section className="container mx-auto px-4 md:px-8 py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <RotatingHeroTitle />
            <p className="text-sm md:text-base text-muted-foreground">
              Analysiere Preisverläufe, erkenne Chancen frühzeitig und reagiere schneller als der Markt.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <SignedOut>
                <SignUpButton mode="modal">
                  <Button size="lg" className="rounded-2xl">
                    Jetzt starten
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <Button size="lg" className="rounded-2xl" asChild>
                  <Link href="/dashboard">
                    Zum Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </SignedIn>
              <Button size="lg" variant="outline" className="rounded-2xl" asChild>
                <a href="#contact">Kontakt aufnehmen</a>
              </Button>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="border-t border-border bg-muted/30 py-12 md:py-16">
          <div className="container mx-auto px-4 md:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Features</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="rounded-2xl border border-border bg-background p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                    <f.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                  <p className="text-muted-foreground text-sm">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Unit Ping Feature */}
        <UnitPingFeature />

        {/* Charts */}
        <section id="charts" className="py-12 md:py-16">
          <div className="container mx-auto px-4 md:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              Marktanalysen & Trends
            </h2>
            <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              <PriceChart />
              <ListingsChart />
            </div>
            <p className="text-center text-sm text-muted-foreground mt-8">
              Demo-Charts mit Mock-Daten – zeigt beispielhaft Preisbewegungen und neue Inserate.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="border-t border-border bg-muted/30 py-12 md:py-16">
          <div className="container mx-auto px-4 md:px-8 max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Kontakt</h2>
            <p className="text-muted-foreground text-center mb-12">
              Du hast Fragen oder möchtest mehr erfahren? Schreibe uns.
            </p>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
                <input
                  id="name"
                  type="text"
                  value={contactForm.name}
                  onChange={(e) => setContactForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Dein Name"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">E-Mail</label>
                <input
                  id="email"
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="deine@email.de"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">Nachricht</label>
                <textarea
                  id="message"
                  value={contactForm.message}
                  onChange={(e) => setContactForm((f) => ({ ...f, message: e.target.value }))}
                  rows={4}
                  className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  placeholder="Deine Nachricht..."
                  required
                />
              </div>
              <Button type="submit" size="lg" className="w-full rounded-2xl">
                <Mail className="mr-2 h-4 w-4" />
                Nachricht senden
              </Button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
