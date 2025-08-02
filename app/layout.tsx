import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { Toaster } from "@/components/ds/toast"
import { AutoSeedProvider } from "@/components/AutoSeedProvider"
import { SeedDebugPanel } from "@/components/SeedDebugPanel"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sistema de gerenciamento - Academia",
  description: "Sistema de gerenciamento de aulas e alunos para academias",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AutoSeedProvider>
          <Navigation />
          <main>{children}</main>
          <Toaster />
          <SeedDebugPanel />
        </AutoSeedProvider>
      </body>
    </html>
  )
}
