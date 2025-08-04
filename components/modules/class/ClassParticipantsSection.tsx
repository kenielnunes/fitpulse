"use client"

import { useState, useMemo } from "react"
import { Users, UserPlus, UserMinus, AlertCircle } from "lucide-react"
import { useGymStore } from "@/lib/store"
import { useToast } from "@/components/ds/toast"
import { Button } from "@/components/ds/button"
import { Badge } from "@/components/ds/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ds/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ClassParticipantsSectionProps {
  classId?: string
  maxCapacity: number
  onParticipantsChange?: (participantIds: string[]) => void
}

export function ClassParticipantsSection({
  classId,
  maxCapacity,
  onParticipantsChange
}: ClassParticipantsSectionProps) {
  const { students, classes, addParticipant, removeParticipant, canAddParticipant } = useGymStore()
  const { toast } = useToast()
  const [selectedStudentId, setSelectedStudentId] = useState("")

  // Se é uma aula existente, buscar dados dela
  const existingClass = useMemo(() => {
    if (!classId) return null
    return classes.find((cls) => cls.id === classId)
  }, [classId, classes])

  // Participantes atuais (para aulas existentes) ou selecionados (para novas aulas)
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
    existingClass?.participants || []
  )

  // Lista de participantes com dados completos
  const participants = useMemo(() => {
    const participantIds = existingClass ? existingClass.participants : selectedParticipants
    return participantIds
      .map((id) => students.find((s) => s.id === id))
      .filter(Boolean)
  }, [existingClass, selectedParticipants, students])

  // Alunos disponíveis para adicionar
  const availableStudents = useMemo(() => {
    const participantIds = existingClass ? existingClass.participants : selectedParticipants
    return students.filter((student) => !participantIds.includes(student.id))
  }, [students, existingClass, selectedParticipants])

  const isClassFull = participants.length >= maxCapacity

  const handleAddParticipant = () => {
    if (!selectedStudentId) return

    if (existingClass) {
      // Para aulas existentes, usar o store
      const result = addParticipant(existingClass.id, selectedStudentId)
      if (result) {
        const student = students.find((s) => s.id === selectedStudentId)
        toast({
          title: "Participante adicionado",
          description: `${student?.name} foi adicionado à aula.`,
          variant: "success",
        })
        setSelectedStudentId("")
      } else {
        const { reason } = canAddParticipant(existingClass.id, selectedStudentId)
        toast({
          title: "Não foi possível adicionar",
          description: reason,
          variant: "error",
        })
      }
    } else {
      // Para novas aulas, gerenciar localmente
      if (selectedParticipants.includes(selectedStudentId)) {
        toast({
          title: "Aluno já adicionado",
          description: "Este aluno já está na lista de participantes.",
          variant: "error",
        })
        return
      }

      setSelectedParticipants([...selectedParticipants, selectedStudentId])
      onParticipantsChange?.([...selectedParticipants, selectedStudentId])

      const student = students.find((s) => s.id === selectedStudentId)
      toast({
        title: "Participante adicionado",
        description: `${student?.name} foi adicionado à lista.`,
        variant: "success",
      })
      setSelectedStudentId("")
    }
  }

  const handleRemoveParticipant = (studentId: string) => {
    if (existingClass) {
      // Para aulas existentes, usar o store
      if (confirm("Tem certeza que deseja remover este participante?")) {
        removeParticipant(existingClass.id, studentId)
        const student = students.find((s) => s.id === studentId)
        toast({
          title: "Participante removido",
          description: `${student?.name} foi removido da aula.`,
          variant: "success",
        })
      }
    } else {
      // Para novas aulas, gerenciar localmente
      const newParticipants = selectedParticipants.filter((id) => id !== studentId)
      setSelectedParticipants(newParticipants)
      onParticipantsChange?.(newParticipants)

      const student = students.find((s) => s.id === studentId)
      toast({
        title: "Participante removido",
        description: `${student?.name} foi removido da lista.`,
        variant: "success",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Participantes ({participants.length}/{maxCapacity})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Adicionar participante */}
        {!isClassFull && availableStudents.length > 0 && (
          <div className="flex gap-3">
            <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Selecione um aluno" />
              </SelectTrigger>
              <SelectContent>
                {availableStudents.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleAddParticipant} disabled={!selectedStudentId}>
              <UserPlus className="h-4 w-4 mr-1" />
              Adicionar
            </Button>
          </div>
        )}

        {/* Lista de participantes */}
        {participants.length === 0 ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-gray-600 text-sm">
              {existingClass ? "Nenhum participante inscrito ainda." : "Nenhum participante adicionado ainda."}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {participants.map((participant) =>
              participant ? (
                <div key={participant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium text-gray-900">{participant.name}</p>
                      <p className="text-sm text-gray-600">Plano: {participant.planType}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {participant.cpf ? "CPF: " + participant.cpf : "Sem CPF"}
                    </Badge>
                  </div>
                  <Button
                    variant="error"
                    size="sm"
                    onClick={() => handleRemoveParticipant(participant.id)}
                  >
                    <UserMinus className="h-4 w-4" />
                  </Button>
                </div>
              ) : null
            )}
          </div>
        )}

        {/* Aviso de aula lotada */}
        {isClassFull && (
          <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <p className="text-sm text-yellow-800">
              Esta aula atingiu a capacidade máxima de participantes.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 