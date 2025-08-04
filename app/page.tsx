"use client"

import { Calendar, Users, Dumbbell, TrendingUp, Clock } from "lucide-react"
import Link from "next/link"
import { useMemo } from "react"
import { Button } from "@/components/shared/ui/Button"
import { Badge } from "@/components/shared/ui/Badge"
import { useGymStore } from "@/lib/store"
import { DashboardSectionCard } from "@/components/features/dashboard/components/DashboardSectionCard"
import { MetricCard } from "@/components/features/dashboard/components/MetricCard"


export default function HomePage() {
  const { students, classes } = useGymStore()

  const stats = useMemo(() => {
    const totalStudents = students.length
    const totalClasses = classes.length
    const activeClasses = classes.filter(c => c.status === "aberta").length
    const totalEnrollments = classes.reduce((acc, cls) => acc + cls.participants.length, 0)
    return { totalStudents, totalClasses, activeClasses, totalEnrollments }
  }, [students, classes]);

  const todayClasses = useMemo(() => {
    const today = new Date('2025-08-04').toDateString()
    return classes.filter(cls => new Date(cls.dateTime).toDateString() === today).sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()).slice(0, 3)
  }, [classes]);

  const recentStudents = useMemo(() => {
    return students.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5)
  }, [students]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500">Visão geral da sua academia.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <MetricCard
            title="Total de Alunos"
            value={stats.totalStudents}
            subtitle="Alunos cadastrados"
            icon={Users}
            iconBgColor="bg-blue-100"
            iconColor="text-blue-600"
          />
          <MetricCard
            title="Aulas Cadastradas"
            value={stats.totalClasses}
            subtitle="Total de aulas"
            icon={Dumbbell}
            iconBgColor="bg-green-100"
            iconColor="text-green-600"
          />
          <MetricCard
            title="Aulas Ativas"
            value={stats.activeClasses}
            subtitle="Disponíveis para agendamento"
            icon={TrendingUp}
            iconBgColor="bg-yellow-100"
            iconColor="text-yellow-600"
          />
          <MetricCard
            title="Agendamentos"
            value={stats.totalEnrollments}
            subtitle="Total de inscrições"
            icon={Calendar}
            iconBgColor="bg-white/20"
            iconColor="text-white"
            className="bg-blue-600 text-white"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <DashboardSectionCard
              title="Aulas de Hoje"
              icon={Clock}
              buttonText="Ver todas"
              buttonHref="/schedule"
            >
              {todayClasses.length === 0 ? (
                <div className="text-center py-12 flex flex-col items-center justify-center flex-1">
                  <div className="h-16 w-16 flex items-center justify-center rounded-full bg-slate-100 mb-4">
                    <Calendar className="h-8 w-8 text-slate-400" />
                  </div>
                  <p className="text-gray-500 font-medium">Nenhuma aula para hoje.</p>
                  <p className="text-sm text-gray-400">Que tal criar uma nova aula?</p>
                  <Link href="/classes" className="mt-4">
                    <Button>Criar nova aula</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {todayClasses.map((cls) => (
                    <div key={cls.id} className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors">
                      <div>
                        <h4 className="font-medium text-gray-900">{cls.description}</h4>
                        <p className="text-sm text-gray-600">{cls.type}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(cls.dateTime).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
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
            </DashboardSectionCard>
          </div>

          <div>
            <DashboardSectionCard
              title="Alunos Recentes"
              icon={Users}
              buttonText="Ver todos"
              buttonHref="/students"
            >
              {recentStudents.length > 0 ? (
                <div className="space-y-4">
                  {recentStudents.map((student) => (
                    <div key={student.id} className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 mr-3">
                        {student.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 text-sm">{student.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{student.planType}</p>
                      </div>
                      <Badge variant="outline">{student.city || "N/A"}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-center text-gray-500 m-auto">Nenhum aluno cadastrado ainda.</p>
              )}
            </DashboardSectionCard>
          </div>
        </div>
      </div>
    </div>
  )
}