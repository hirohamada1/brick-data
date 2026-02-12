"use client";

import Link from "next/link";
import { SignIn } from "@clerk/nextjs"; // Clerk SignIn Komponente

// Page.tsx. Hier definieren wir die Startseite. Hier werden die Fonts, ClerkProvider, Analytics und Providers geladen.
export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      {/* simple top bar */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 md:px-8 py-4">
          <Link href="/" className="text-xl font-bold hover:opacity-80 transition-opacity">
            Brick<span className="text-primary">Data</span>
          </Link>
        </div>
      </header>


      {/* Hier wird die SignIn Komponente von Clerk gerendert. */}
      <main className="container mx-auto px-4 md:px-8 py-12">
        <div className="mx-auto max-w-md">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <h1 className="text-2xl font-semibold">Anmelden</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Bitte logge dich ein, um dein Dashboard zu öffnen.
            </p>

            {/* Hier wird die SignIn Komponente von Clerk gestelllt und interpretiert. Die Email, Passwort und OAuth werden angenome. Request an Clerk wird gesendet. */}
            <div className="mt-6">
              <SignIn
                path="/start"
                routing="path"
                signUpUrl="/start/sign-up"
                fallbackRedirectUrl="/dashboard"
                forceRedirectUrl="/dashboard"
                appearance={{
                  variables: {
                    colorPrimary: "hsl(var(--primary))",
                    colorBackground: "transparent",
                    colorText: "hsl(var(--foreground))",
                    colorInputBackground: "hsl(var(--background))",
                    colorInputText: "hsl(var(--foreground))",
                    borderRadius: "16px",
                  },
                  elements: {
                    card: "shadow-none bg-transparent p-0 border-0",
                    headerTitle: "hidden",
                    headerSubtitle: "hidden",
                    formButtonPrimary:
                      "bg-primary text-primary-foreground hover:opacity-90 rounded-2xl h-11",
                    formFieldInput:
                      "h-11 rounded-2xl border-border bg-background text-foreground",
                    formFieldLabel: "text-foreground",
                    footerActionLink: "text-primary hover:underline",
                    dividerLine: "bg-border",
                    dividerText: "text-muted-foreground",
                  },
                }}
              />
            </div>
          </div>

          {/* Impressum und Datenschutz Link */}
          <p className="mt-4 text-xs text-muted-foreground text-center">
            Mit der Anmeldung akzeptierst du unsere{" "}
            <Link className="underline hover:text-foreground" href="/datenschutz">
              Datenschutzerklärung
            </Link>
            .
          </p>
        </div>
      </main>
    </div>
  );
}