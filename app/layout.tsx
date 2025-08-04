import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/shared/layout/Navigation"
import { AutoSeedProvider } from "@/components/shared/providers/AutoSeedProvider"
import { Toaster } from "@/components/shared/ui/Toast"
import { ReactNode } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sistema de gerenciamento - Academia",
  description: "Sistema de gerenciamento de aulas e alunos para academias",
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {

  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AutoSeedProvider>
          <Navigation />
          <main>{children}</main>
          <Toaster />
        </AutoSeedProvider>
      </body>
    </html>
  )
}
