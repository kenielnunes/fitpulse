"use client"

import { Edit, Trash2 } from "lucide-react"
import type { Student } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shared/ui/Card"
import { Badge } from "@/components/shared/ui/Badge"
import { Button } from "@/components/shared/ui/Button"

interface StudentCardProps {
  student: Student
  onEdit: (student: Student) => void
  onDelete: (id: string) => void
}

export function StudentCard({ student, onEdit, onDelete }: StudentCardProps) {
  const getPlanBadgeVariant = (planType: string) => {
    switch (planType) {
      case "mensal":
        return "default"
      case "trimestral":
        return "secondary"
      case "anual":
        return "success"
      default:
        return "default"
    }
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base mb-1">{student.name}</CardTitle>
            <p className="text-sm text-gray-600">
              {new Date(student.birthDate).toLocaleDateString("pt-BR")}
            </p>
          </div>
          <Badge variant={getPlanBadgeVariant(student.planType)}>
            {student.planType}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0 flex flex-col flex-1">
        <div className="space-y-2 text-sm mb-4">
          {student.cpf && (
            <div className="flex justify-between">
              <span className="text-gray-600">CPF:</span>
              <span className="text-gray-900">{student.cpf}</span>
            </div>
          )}
          {student.city && (
            <div className="flex justify-between">
              <span className="text-gray-600">Cidade:</span>
              <span className="text-gray-900">{student.city}</span>
            </div>
          )}
          {student.neighborhood && (
            <div className="flex justify-between">
              <span className="text-gray-600">Bairro:</span>
              <span className="text-gray-900">{student.neighborhood}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(student)}
            className="flex-1"
          >
            <Edit className="h-4 w-4 mr-1" />
            Editar
          </Button>

          <Button
            variant="error"
            size="sm"
            onClick={() => onDelete(student.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 