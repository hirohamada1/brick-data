"use client"

import type { ReactNode } from "react"
import { AppProvider } from "@/context/AppContext"
import { ThemeProvider } from "@/context/ThemeContext"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AppProvider>{children}</AppProvider>
    </ThemeProvider>
  )
}
