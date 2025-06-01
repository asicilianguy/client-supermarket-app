import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ReduxProvider } from "@/components/providers/redux-provider"
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: "SpesaViva - La spesa che prende vita",
  description: "La spesa intelligente che si adatta a te",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="it">
      <body>
        <ReduxProvider>
          {children}
          <Toaster />
        </ReduxProvider>
      </body>
    </html>
  )
}
