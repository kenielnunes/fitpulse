"use client"

import { useState, useMemo } from "react"
import { Plus, Search, Edit, Trash2, Users, Clock } from "lucide-react"
import { useGymStore } from "@/lib/store"
import { ClassForm } from "@/components/class/class-form"
import type { Class } from "@/lib/store"
import { Button } from "@/components/ds/button"
import { Input } from "@/components/ds/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ds/card"
import { Badge } from "@/components/ds/badge"
import { Modal, ModalContent, ModalHeader, ModalTitle } from "@/components/ds/modal"

export default function ClassesPage() {
  const { classes, deleteClass } = useGymStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [editingClass, setEditingClass] = useState<Class | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const filteredClasses = useMemo(() => {
    return classes.filter(
      (cls) =>
        cls.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.type.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [classes, searchTerm])

  const handleEdit = (cls: Class) => {
    setEditingClass(cls)
    setIsFormOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta aula?")) {
      deleteClass(id)
    }
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingClass(null)
  }

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime)
    return {
      date: date.toLocaleDateString("pt-BR"),
      time: date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Aulas</h1>
            <p className="text-gray-600">
              {classes.length} aula{classes.length !== 1 ? "s" : ""} cadastrada{classes.length !== 1 ? "s" : ""}
            </p>
          </div>

          <Button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nova Aula
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar por descrição ou tipo de aula..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Classes Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredClasses.map((cls) => {
            const { date, time } = formatDateTime(cls.dateTime)
            return (
              <Card key={cls.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base mb-1">{cls.description}</CardTitle>
                      <p className="text-sm text-gray-600">{cls.type}</p>
                    </div>
                    <Badge variant={cls.status === "aberta" ? "default" : "secondary"}>{cls.status}</Badge>
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
                        {cls.participants.length}/{cls.maxCapacity} participantes
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">
                      Agendamento pós-início: {cls.allowLateBooking ? "Permitido" : "Não permitido"}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(cls)} className="flex-1">
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>

                    <Button variant="error" size="sm" onClick={() => handleDelete(cls.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredClasses.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-600">
              {searchTerm ? "Nenhuma aula encontrada com os critérios de busca." : "Nenhuma aula cadastrada ainda."}
            </p>
          </div>
        )}

        {/* Modal */}
        <Modal isOpen={isFormOpen} onClose={handleFormClose}>
          <ModalHeader>
            <ModalTitle>{editingClass ? "Editar Aula" : "Cadastrar Nova Aula"}</ModalTitle>
          </ModalHeader>
          <ModalContent>
            <ClassForm classData={editingClass} onSuccess={handleFormClose} onCancel={handleFormClose} />
          </ModalContent>
        </Modal>
      </div>
    </div>
  )
}
