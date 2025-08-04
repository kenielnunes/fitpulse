"use client"

import { useEffect, useState } from "react"
import { useGymStore } from "@/lib/store"
import { seedData } from "@/scripts/seed-data"
import { markSeedAsExecuted, shouldAutoSeed } from "@/lib/seed-utils"

export function AutoSeedProvider({ children }: { children: React.ReactNode }) {
  const [isSeeded, setIsSeeded] = useState(false)
  const students = useGymStore((state) => state.students)
  const classes = useGymStore((state) => state.classes)

  useEffect(() => {
    const initializeData = async () => {
      try {
        // Verificar se deve executar o seed automaticamente
        if (shouldAutoSeed()) {
          // Verificar se já existem dados
          const hasData = students.length > 0 || classes.length > 0

          if (!hasData) {
            const success = seedData()
            if (success) {
              markSeedAsExecuted()
            }
          } else {
            // Se já tem dados, apenas marcar como executado
            markSeedAsExecuted()
          }
        }
      } catch (error) {
        console.error("Erro ao executar seed automático:", error)
      } finally {
        setIsSeeded(true)
      }
    }

    initializeData()
  }, [students.length, classes.length])

  if (!isSeeded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Inicializando dados de teste...</p>
          <p className="text-gray-500 text-sm mt-2">Isso acontece apenas na primeira execução</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
} 