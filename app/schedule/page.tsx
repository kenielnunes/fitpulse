// AgendaPage.tsx (Refatorada)
"use client"

import { useState, useMemo } from "react"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, PlusCircle } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useGymStore } from "@/lib/store"

import { Card, CardContent } from "@/components/shared/ui/Card"
import { Button } from "@/components/shared/ui/Button"
import { ClassDetailsModal } from "@/components/features/class/components/ClassDetailsModal"
import { ClassItem } from "@/components/features/class/components/ClassItem"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/shared/ui/Popover"
import { Calendar } from "@/components/shared/ui/Calendar"
import Link from "next/link"

export default function AgendaPage() {
  const { getClassesByDate } = useGymStore()

  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null)

  const classesForDate = useMemo(() => {
    const dateString = format(selectedDate, "yyyy-MM-dd")
    return getClassesByDate(dateString).sort(
      (a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime(),
    )
  }, [selectedDate, getClassesByDate])

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(selectedDate)
    newDate.setDate(selectedDate.getDate() + (direction === "next" ? 1 : -1))
    setSelectedDate(newDate)
  }

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            Agenda de Aulas
          </h1>
          <Link href={'/classes'}>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Criar Nova Aula
            </Button>
          </Link>
        </div>

        <Card className="mb-8 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={() => navigateDate("prev")}>
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-64 justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <span>{capitalize(format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR }))}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    autoFocus
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>

              <Button variant="outline" onClick={() => navigateDate("next")}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="relative pl-6 border-l-2 border-slate-200/80">
          {classesForDate.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-white border rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm">
                <CalendarIcon className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-700">Nenhuma aula para este dia</h3>
              <p className="text-slate-500 mt-1">Você pode criar uma nova aula ou selecionar outra data.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {classesForDate.map((cls) => (
                <div key={cls.id} className="relative">
                  <div className="absolute -left-[33px] top-1 h-4 w-4 rounded-full bg-blue-600 border-4 border-slate-50"></div>
                  <ClassItem classData={cls} onSelect={setSelectedClassId} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ClassDetailsModal
        classId={selectedClassId}
        isOpen={!!selectedClassId}
        onClose={() => setSelectedClassId(null)}
      />
    </div>
  )
}