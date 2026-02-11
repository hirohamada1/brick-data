import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs"
import { Analytics } from "@vercel/analytics/next"
import { Providers } from "./providers"
import { UserSync } from "@/components/auth/UserSync"
import "./globals.css"

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })

export const metadata: Metadata = {
  title: 'Immobilien Tool - Watchlist & Analyse',
  description: 'Analysieren Sie Immobilienangebote mit automatischen Berechnungen für Rendite, Kaufnebenkosten und mehr.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="de" className="dark" suppressHydrationWarning>
        <body className={`${geist.variable} ${geistMono.variable} font-sans antialiased`}>
          <header className="flex items-center justify-end gap-4 border-b border-border px-6 py-3">
            <SignedOut>
              <SignInButton />
              <SignUpButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </header>
          <Providers>
            <UserSync />
            {children}
          </Providers>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  )
}
