import type { Metadata } from "next"; // Damit definieren wir Titel, Description, Icons etc.
import { Geist, Geist_Mono } from "next/font/google"; // Fonts
import { Analytics } from "@vercel/analytics/next"; //Vercel Analytics. Das rackt Pageviews etc.
import { ClerkProvider } from "@clerk/nextjs"; // Macht Session verfügbar, User verfügbar

import { Providers } from "./providers";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

// Metadata. Hier definieren wir Titel, Description, Icons etc.
export const metadata: Metadata = {
  title: "Immobilien Tool - Watchlist & Analyse",
  description:
    "Analysieren Sie Immobilienangebote mit automatischen Berechnungen für Rendite, Kaufnebenkosten und mehr.",
  generator: "v0.app",
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
};

// RootLayout. Hier definieren wir das Grundgerüst der Seite. Hier werden die Fonts, ClerkProvider, Analytics und Providers geladen.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="de" className="dark" suppressHydrationWarning>
        <body className={`${geist.variable} ${geistMono.variable} font-sans antialiased`}>
          <Providers>{children}</Providers>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}