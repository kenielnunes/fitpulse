"use client"

import { useState, useMemo } from "react"
import { Plus, Search, Edit, Trash2 } from "lucide-react"
import { useGymStore } from "@/lib/store"
import { StudentForm } from "@/components/student/student-form"
import type { Student } from "@/lib/store"
import { Button } from "@/components/ds/button"
import { Input } from "@/components/ds/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ds/card"
import { Badge } from "@/components/ds/badge"
import { Modal, ModalContent, ModalHeader, ModalTitle } from "@/components/ds/modal"

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

  const getPlanBadgeVariant = (planType: string) => {
    switch (planType) {
      case "mensal":
        return "default"
      case "trimestral":
        return "secondary"
      case "anual":
        return "success"
      default:
        return "outline"
    }
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

        {/* Students Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredStudents.map((student) => (
            <Card key={student.id} className="h-full flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base mb-1">{student.name}</CardTitle>
                    <p className="text-sm text-gray-600">{new Date(student.birthDate).toLocaleDateString("pt-BR")}</p>
                  </div>
                  <Badge variant={getPlanBadgeVariant(student.planType)}>{student.planType}</Badge>
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
                  <Button variant="outline" size="sm" onClick={() => handleEdit(student)} className="flex-1">
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>

                  <Button variant="error" size="sm" onClick={() => handleDelete(student.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-600">
              {searchTerm ? "Nenhum aluno encontrado com os critérios de busca." : "Nenhum aluno cadastrado ainda."}
            </p>
          </div>
        )}

        {/* Modal */}
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
