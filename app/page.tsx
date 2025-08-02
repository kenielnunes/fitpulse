"use client"

import { Calendar, Users, Dumbbell, TrendingUp, Clock } from "lucide-react"
import Link from "next/link"
import { useGymStore } from "@/lib/store"
import { useMemo } from "react"
import { Button } from "@/components/ds/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ds/card"
import { Badge } from "@/components/ds/badge"

export default function HomePage() {
  const { students, classes } = useGymStore()

  const stats = useMemo(() => {
    const totalStudents = students.length
    const totalClasses = classes.length
    const activeClasses = classes.filter((c) => c.status === "aberta").length
    const totalEnrollments = classes.reduce((acc, cls) => acc + cls.participants.length, 0)

    return {
      totalStudents,
      totalClasses,
      activeClasses,
      totalEnrollments,
    }
  }, [students, classes])

  const todayClasses = useMemo(() => {
    const today = new Date().toDateString()
    return classes
      .filter((cls) => new Date(cls.dateTime).toDateString() === today)
      .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
      .slice(0, 3)
  }, [classes])

  const recentStudents = useMemo(() => {
    return students.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5)
  }, [students])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Visão geral</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total de Alunos</CardTitle>
              <Users className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.totalStudents}</div>
              <p className="text-xs text-gray-600 mt-1">Alunos cadastrados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Aulas Cadastradas</CardTitle>
              <Dumbbell className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.totalClasses}</div>
              <p className="text-xs text-gray-600 mt-1">Total de aulas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Aulas Ativas</CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.activeClasses}</div>
              <p className="text-xs text-gray-600 mt-1">Disponíveis para agendamento</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Agendamentos</CardTitle>
              <Calendar className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.totalEnrollments}</div>
              <p className="text-xs text-gray-600 mt-1">Total de inscrições</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Aulas de Hoje
                </CardTitle>
                <Link href="/agenda">
                  <Button variant="outline" size="sm">
                    Ver todas
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {todayClasses.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhuma aula agendada para hoje</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {todayClasses.map((cls) => (
                      <div key={cls.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">{cls.description}</h4>
                          <p className="text-sm text-gray-600">{cls.type}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(cls.dateTime).toLocaleTimeString("pt-BR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant={cls.status === "aberta" ? "default" : "secondary"}>
                            {cls.participants.length}/{cls.maxCapacity}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">
                            {cls.status === "aberta" ? "Disponível" : "Concluída"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Alunos Recentes
                </CardTitle>
                <Link href="/students">
                  <Button variant="outline" size="sm">
                    Ver todos
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {recentStudents.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhum aluno cadastrado</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentStudents.map((student) => (
                      <div key={student.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{student.name}</p>
                          <p className="text-xs text-gray-500">{student.planType}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {student.city || "N/A"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
