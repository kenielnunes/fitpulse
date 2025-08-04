"use client"

import { useState, useMemo } from "react"
import { Plus, Search } from "lucide-react"
import { useGymStore } from "@/lib/store"
import type { Student } from "@/lib/store"
import { Button } from "@/components/shared/ui/Button"
import { Input } from "@/components/shared/forms/Input"
import { StudentCard } from "@/components/shared/cards/StudentCard"
import { Modal, ModalContent, ModalHeader, ModalTitle } from "@/components/shared/ui/Modal"
import { StudentForm } from "@/components/modules/student/StudentForm"
import { EmptyStateCard } from "@/components/shared/cards/EmptyStateCard"

export default function StudentsPage() {
  const { students, deleteStudent } = useGymStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const filteredStudents = useMemo(() => {
    return students.filter(
      (student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.cpf?.includes(searchTerm) ||
        student.city?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [students, searchTerm])

  const handleEdit = (student: Student) => {
    setEditingStudent(student)
    setIsFormOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este aluno?")) {
      deleteStudent(id)
    }
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingStudent(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Alunos</h1>
            <p className="text-gray-600">
              {students.length} aluno{students.length !== 1 ? "s" : ""} cadastrado{students.length !== 1 ? "s" : ""}
            </p>
          </div>

          <Button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Novo Aluno
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar por nome, CPF ou cidade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredStudents.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>

        {filteredStudents.length === 0 && (
          <EmptyStateCard
            description={
              searchTerm
                ? "Nenhum aluno encontrado com os critérios de busca."
                : "Nenhum aluno cadastrado ainda."
            }
          />
        )}

        <Modal isOpen={isFormOpen} onClose={handleFormClose}>
          <ModalHeader>
            <ModalTitle>{editingStudent ? "Editar Aluno" : "Cadastrar Novo Aluno"}</ModalTitle>
          </ModalHeader>
          <ModalContent>
            <StudentForm student={editingStudent} onSuccess={handleFormClose} onCancel={handleFormClose} />
          </ModalContent>
        </Modal>
      </div>
    </div>
  )
}
