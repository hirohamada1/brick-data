import { useState } from "react";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { OnboardingForm, type LeadData } from "@/components/landing/OnboardingForm";
import { CheckCircle2 } from "lucide-react";

const API_LEAD_URL = "/api/lead";

async function submitLead(data: LeadData): Promise<void> {
  let res: Response;
  try {
    res = await fetch(API_LEAD_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch (e) {
    throw new Error(
      "Lead-API nicht erreichbar. Im Ordner apps/frontend bitte 'npm run dev' ausführen."
    );
  }
  if (!res.ok) {
    const text = await res.text();
    let err: Error;
    try {
      const json = JSON.parse(text) as { error?: string };
      err = new Error(json.error ?? `API error: ${res.status}`);
    } catch {
      err = new Error(
        res.status === 502 || res.status === 503
          ? "Lead-API nicht erreichbar. Im Ordner apps/frontend bitte 'npm run dev' ausführen."
          : res.status === 500
            ? "Ein Fehler ist aufgetreten. Bitte später erneut versuchen."
            : `Fehler: ${res.status}`
      );
    }
    (err as Error & { status?: number }).status = res.status;
    throw err;
  }
}

export function Start() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (data: LeadData) => {
    await submitLead(data);
    setSubmitted(true);
  };

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

      <main className="flex-1 container mx-auto px-4 md:px-8 py-12 md:py-20 max-w-2xl">
        {submitted ? (
          <div className="text-center py-12 md:py-16">
            <CheckCircle2
              className="mx-auto h-16 w-16 text-primary mb-6"
              aria-hidden
            />
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Danke!
            </h1>
            <p className="text-muted-foreground text-sm md:text-base max-w-sm mx-auto mb-10">
              Wir melden uns in Kürze.
            </p>
            <Link
              href="/"
              className="text-sm text-primary hover:underline font-medium"
            >
              ← Zurück zur Startseite
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-2">
              Kostenlos starten
            </h1>
            <p className="text-muted-foreground text-sm md:text-base text-center mb-10">
              Sie erhalten frühzeitig Zugang zu BrickData.
            </p>
            <OnboardingForm onSubmit={handleSubmit} />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
