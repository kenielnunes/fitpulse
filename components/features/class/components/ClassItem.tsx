import { Card, CardContent } from "@/components/shared/ui/Card"
import { Badge } from "@/components/shared/ui/Badge"
import { Button } from "@/components/shared/ui/Button"
import { Users, Eye } from "lucide-react"

type ClassData = {
  id: string
  dateTime: string
  description: string
  type: string
  status: string
  participants: any[]
  maxCapacity: number
}

interface ClassItemProps {
  classData: ClassData
  onSelect: (id: string) => void
}

const formatTime = (dateTime: string) => {
  return new Date(dateTime).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

const getStatusInfo = (cls: ClassData): { variant?: "default" | "secondary" | "success" | "warning" | "error" | "outline"; text: string } => {
  if (cls.status === "concluida") return { variant: "secondary", text: "Concluída" }
  if (cls.participants.length >= cls.maxCapacity) return { variant: "error", text: "Lotada" }
  return { variant: "default", text: "Disponível" }
}

export function ClassItem({ classData, onSelect }: ClassItemProps) {
  const status = getStatusInfo(classData);

  return (
    <div className="relative flex items-start gap-6">
      <div className="flex flex-col items-center">
        <p className="font-bold text-sm text-blue-600 whitespace-nowrap">{formatTime(classData.dateTime)}</p>
        <div className="h-full w-px bg-slate-200 mt-2"></div>
      </div>

      <Card className="flex-1 hover:shadow-md transition-shadow duration-300">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-bold text-lg text-slate-800">{classData.description}</h3>
                <Badge variant={status.variant}>{status.text}</Badge>
              </div>
              <p className="text-sm text-slate-500 mb-3">{classData.type}</p>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Users className="h-4 w-4" />
                <span>Vagas: {classData.participants.length} / {classData.maxCapacity}</span>
              </div>
            </div>

            <div className="flex items-center">
              <Button size="sm" onClick={() => onSelect(classData.id)}>
                <Eye className="h-4 w-4 mr-2" />
                Ver Detalhes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}