"use client"

import { useState, useMemo } from "react"
import { Users, Clock, UserPlus, UserMinus, CheckCircle, AlertCircle } from "lucide-react"
import { useGymStore } from "@/lib/store"
import { useToast } from "@/components/shared/ui/Toast"
import { Modal, ModalContent, ModalHeader, ModalTitle } from "@/components/shared/ui/Modal"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shared/ui/Card"
import { Badge } from "@/components/shared/ui/Badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shared/forms/Select"
import { Button } from "@/components/shared/ui/Button"

interface ClassDetailsModalProps {
  classId: string | null
  isOpen: boolean
  onClose: () => void
}

export function ClassDetailsModal({ classId, isOpen, onClose }: ClassDetailsModalProps) {
  const {
    students,
    classes,
    addParticipant,
    removeParticipant,
    finishClass,
    canAddParticipant,
  } = useGymStore()
  const { toast } = useToast()
  const [selectedStudentId, setSelectedStudentId] = useState("")

  const classData = useMemo(() => {
    return classes.find((cls) => cls.id === classId) ?? null
  }, [classes, classId])

  const participants = useMemo(() => {
    if (!classData) return []
    return classData.participants.map((id) => students.find((s) => s.id === id)).filter(Boolean)
  }, [classData?.participants, students])

  const availableStudents = useMemo(() => {
    if (!classData) return []
    return students.filter((student) => !classData.participants.includes(student.id))
  }, [students, classData?.participants])

  if (!classData) return null

  const handleAddParticipant = () => {
    if (!selectedStudentId) return

    const result = addParticipant(classData.id, selectedStudentId)
    if (result) {
      const student = students.find((s) => s.id === selectedStudentId)
      toast({
        title: "Participante adicionado",
        description: `${student?.name} foi adicionado à aula com sucesso.`,
        variant: "success",
      })
      setSelectedStudentId("")
    } else {
      const { reason } = canAddParticipant(classData.id, selectedStudentId)
      toast({
        title: "Não foi possível adicionar",
        description: reason,
        variant: "error",
      })
    }
  }

  const handleRemoveParticipant = (studentId: string) => {
    if (confirm("Tem certeza que deseja remover este participante?")) {
      removeParticipant(classData.id, studentId)
      const student = students.find((s) => s.id === studentId)
      toast({
        title: "Participante removido",
        description: `${student?.name} foi removido da aula.`,
        variant: "success",
      })
    }
  }

  const handleFinishClass = () => {
    if (confirm("Tem certeza que deseja finalizar esta aula?")) {
      finishClass(classData.id)
      toast({
        title: "Aula finalizada",
        description: "A aula foi marcada como concluída.",
        variant: "success",
      })
    }
  }

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime)
    return {
      date: date.toLocaleDateString("pt-BR"),
      time: date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    }
  }

  const { date, time } = formatDateTime(classData.dateTime)
  const isClassFull = participants.length >= classData.maxCapacity
  const canFinish = classData.status === "aberta"

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-4xl">
      <ModalHeader>
        <ModalTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Detalhes da Aula
        </ModalTitle>
      </ModalHeader>

      <ModalContent className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <CardTitle>{classData.description}</CardTitle>
              <Badge variant={classData.status === "aberta" ? "default" : "secondary"}>
                {classData.status === "aberta" ? "Aberta" : "Concluída"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <p>
                  <strong>Tipo:</strong> {classData.type}
                </p>
                <p>
                  <strong>Data:</strong> {date}
                </p>
                <p>
                  <strong>Horário:</strong> {time}
                </p>
              </div>
              <div className="space-y-2">
                <p>
                  <strong>Capacidade:</strong> {classData.maxCapacity} pessoas
                </p>
                <p>
                  <strong>Participantes:</strong> {participants.length}
                </p>
                <p>
                  <strong>Agendamento tardio:</strong> {classData.allowLateBooking ? "Permitido" : "Não permitido"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {classData.status === "aberta" && !isClassFull && availableStudents.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Adicionar Participante
              </CardTitle>
            </CardHeader>
            <CardContent>
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
                  Adicionar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Participantes ({participants.length}/{classData.maxCapacity})
              </CardTitle>
              {canFinish && (
                <Button variant="success" onClick={handleFinishClass} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Finalizar Aula
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {participants.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-600">Nenhum participante inscrito ainda.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {participants.map((participant) =>
                  participant ? (
                    <div key={participant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{participant.name}</p>
                        <p className="text-sm text-gray-600">Plano: {participant.planType}</p>
                      </div>
                      {classData.status === "aberta" && (
                        <Button variant="error" size="sm" onClick={() => handleRemoveParticipant(participant.id)}>
                          <UserMinus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ) : null
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Warnings */}
        {isClassFull && classData.status === "aberta" && (
          <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <p className="text-sm text-yellow-800">Esta aula atingiu a capacidade máxima de participantes.</p>
          </div>
        )}

        {classData.status === "concluida" && (
          <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <p className="text-sm text-green-800">Esta aula foi finalizada e não aceita mais participantes.</p>
          </div>
        )}
      </ModalContent>
    </Modal>
  )
}
