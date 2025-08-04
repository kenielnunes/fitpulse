"use client"

import { useState, useMemo } from "react"
import { Plus, Search } from "lucide-react"
import { useGymStore } from "@/lib/store"
import type { Class } from "@/lib/store"
import { Button } from "@/components/shared/ui/Button"
import { Input } from "@/components/shared/forms/Input"
import { ClassCard } from "@/components/shared/cards/ClassCard"
import { Modal, ModalContent, ModalHeader, ModalTitle } from "@/components/shared/ui/Modal"
import { EmptyStateCard } from "@/components/shared/cards/EmptyStateCard"
import { ClassForm } from "@/components/modules/class/ClassForm"

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

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar por descrição ou tipo de aula..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredClasses.map((cls) => (
            <ClassCard
              key={cls.id}
              classData={cls}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>

        {filteredClasses.length === 0 && (
          <EmptyStateCard
            title="Nenhuma aula encontrada"
            description={
              searchTerm
                ? "Nenhuma aula encontrada com os critérios de busca."
                : "Nenhuma aula cadastrada ainda."
            }
          />
        )}

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
