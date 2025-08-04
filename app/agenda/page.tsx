"use client"

import { useState, useMemo } from "react"
import { Calendar, ChevronLeft, ChevronRight, Users, Clock, Eye } from "lucide-react"
import { useGymStore } from "@/lib/store"
import { Card, CardContent, CardHeader } from "@/components/shared/ui/Card"
import { Button } from "@/components/shared/ui/Button"
import { Badge } from "@/components/shared/ui/Badge"
import { ClassDetailsModal } from "@/components/modules/class/ClassDetailsModal"

export default function AgendaPage() {
  const { getClassesByDate } = useGymStore()
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null)

  const classesForDate = useMemo(() => {
    return getClassesByDate(selectedDate).sort(
      (a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime(),
    )
  }, [selectedDate, getClassesByDate])

  const navigateDate = (direction: "prev" | "next") => {
    const currentDate = new Date(selectedDate)
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() + (direction === "next" ? 1 : -1))
    setSelectedDate(newDate.toISOString().split("T")[0])
  }

  const formatTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getStatusColor = (cls: any) => {
    if (cls.status === "concluida") return "secondary"
    if (cls.participants.length >= cls.maxCapacity) return "error"
    return "default"
  }

  const getStatusText = (cls: any) => {
    if (cls.status === "concluida") return "Concluída"
    if (cls.participants.length >= cls.maxCapacity) return "Lotada"
    return "Disponível"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            Agenda de Aulas
          </h1>
        </div>

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Button variant="outline" size="sm" onClick={() => navigateDate("prev")}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Anterior
              </Button>

              <div className="text-center">
                <h2 className="text-lg font-semibold text-gray-900 capitalize mb-1">{formatDate(selectedDate)}</h2>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="text-sm bg-transparent border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
                />
              </div>

              <Button variant="outline" size="sm" onClick={() => navigateDate("next")}>
                Próximo
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {classesForDate.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-600">Nenhuma aula agendada para este dia.</p>
              </CardContent>
            </Card>
          ) : (
            classesForDate.map((cls) => (
              <Card key={cls.id}>
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        {formatTime(cls.dateTime)}
                      </div>
                      <Badge variant={getStatusColor(cls)}>{getStatusText(cls)}</Badge>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedClassId(cls.id)}
                      className="flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      Detalhes
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{cls.description}</h3>
                      <p className="text-gray-600">{cls.type}</p>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>
                          {cls.participants.length}/{cls.maxCapacity}
                        </span>
                      </div>
                      <div className="text-xs">
                        {cls.allowLateBooking ? "Permite agendamento tardio" : "Não permite agendamento tardio"}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <ClassDetailsModal
          classId={selectedClassId}
          isOpen={!!selectedClassId}
          onClose={() => setSelectedClassId(null)}
        />
      </div>
    </div>
  )
}
