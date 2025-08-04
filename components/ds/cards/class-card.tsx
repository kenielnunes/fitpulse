"use client"

import { Edit, Trash2, Clock, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ds/card"
import { Button } from "@/components/ds/button"
import { Badge } from "@/components/ds/badge"
import type { Class } from "@/lib/store"

interface ClassCardProps {
  classData: Class
  onEdit: (classData: Class) => void
  onDelete: (id: string) => void
}

export function ClassCard({ classData, onEdit, onDelete }: ClassCardProps) {
  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime)
    return {
      date: date.toLocaleDateString("pt-BR"),
      time: date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    }
  }

  const { date, time } = formatDateTime(classData.dateTime)

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base mb-1">{classData.description}</CardTitle>
            <p className="text-sm text-gray-600">{classData.type}</p>
          </div>
          <Badge variant={classData.status === "aberta" ? "default" : "secondary"}>
            {classData.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3 text-sm mb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <span className="text-gray-900">
              {date} às {time}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-400" />
            <span className="text-gray-900">
              {classData.participants.length}/{classData.maxCapacity} participantes
            </span>
          </div>
          <div className="text-xs text-gray-600">
            Agendamento pós-início: {classData.allowLateBooking ? "Permitido" : "Não permitido"}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(classData)}
            className="flex-1"
          >
            <Edit className="h-4 w-4 mr-1" />
            Editar
          </Button>

          <Button
            variant="error"
            size="sm"
            onClick={() => onDelete(classData.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 