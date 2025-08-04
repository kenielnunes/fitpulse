"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useGymStore, type Class } from "@/lib/store"
import { useToast } from "@/components/ds/toast"
import { Button } from "@/components/ds/button"
import { Input } from "@/components/ds/input"
import { Label } from "@/components/ds/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ClassParticipantsSection } from "@/components/class/class-participants-section"

const classSchema = z.object({
  description: z.string().min(2, "Descrição deve ter pelo menos 2 caracteres"),
  type: z.string().min(1, "Tipo da aula é obrigatório"),
  dateTime: z.string().min(1, "Data e hora são obrigatórias"),
  maxCapacity: z.number().min(1, "Capacidade deve ser pelo menos 1"),
  status: z.enum(["aberta", "concluida"]),
  allowLateBooking: z.boolean(),
})

type ClassFormData = z.infer<typeof classSchema>

interface ClassFormProps {
  classData?: Class | null
  onSuccess?: () => void
  onCancel?: () => void
}

const classTypes = [
  "Cross Training",
  "Funcional",
  "Pilates",
  "Yoga",
  "Musculação",
  "Cardio",
  "Spinning",
  "Natação",
  "Dança",
  "Boxe",
]

export function ClassForm({ classData, onSuccess, onCancel }: ClassFormProps) {
  const { addClass, updateClass } = useGymStore()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ClassFormData>({
    resolver: zodResolver(classSchema),
    defaultValues: classData
      ? {
        description: classData.description,
        type: classData.type,
        dateTime: classData.dateTime,
        maxCapacity: classData.maxCapacity,
        status: classData.status,
        allowLateBooking: classData.allowLateBooking,
      }
      : {
        description: "",
        type: "",
        dateTime: "",
        maxCapacity: 10,
        status: "aberta",
        allowLateBooking: false,
      },
  })

  // Estado para gerenciar participantes em novas aulas
  const [participants, setParticipants] = useState<string[]>([])

  const status = watch("status")
  const allowLateBooking = watch("allowLateBooking")
  const type = watch("type")

  const onSubmit = async (data: ClassFormData) => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      if (classData) {
        updateClass(classData.id, data)
        toast({
          title: "Aula atualizada",
          description: "As informações da aula foram atualizadas com sucesso.",
          variant: "success",
        })
      } else {
        const newClass = {
          ...data,
          participants: participants,
        }

        addClass(newClass)

        toast({
          title: "Aula cadastrada",
          description: `A aula foi cadastrada com sucesso${participants.length > 0 ? ` e ${participants.length} participante(s) adicionado(s)` : ""}.`,
          variant: "success",
        })
      }

      onSuccess?.()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar a aula. Tente novamente.",
        variant: "error",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="description">Descrição *</Label>
          <Input
            id="description"
            {...register("description")}
            placeholder="Ex: Aula de Cross Training Iniciante"
            error={!!errors.description}
          />
          {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Tipo da Aula *</Label>
          <Select value={type} onValueChange={(value) => setValue("type", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              {classTypes.map((classType) => (
                <SelectItem key={classType} value={classType}>
                  {classType}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.type && <p className="text-sm text-red-600">{errors.type.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateTime">Data e Hora *</Label>
          <Input id="dateTime" type="datetime-local" {...register("dateTime")} error={!!errors.dateTime} />
          {errors.dateTime && <p className="text-sm text-red-600">{errors.dateTime.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxCapacity">Capacidade Máxima *</Label>
          <Input
            id="maxCapacity"
            type="number"
            min="1"
            {...register("maxCapacity", { valueAsNumber: true })}
            error={!!errors.maxCapacity}
          />
          {errors.maxCapacity && <p className="text-sm text-red-600">{errors.maxCapacity.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status *</Label>
          <Select value={status} onValueChange={(value) => setValue("status", value as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="aberta">Aberta</SelectItem>
              <SelectItem value="concluida">Concluída</SelectItem>
            </SelectContent>
          </Select>
          {errors.status && <p className="text-sm text-red-600">{errors.status.message}</p>}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="allowLateBooking"
          checked={allowLateBooking}
          onCheckedChange={(checked) => setValue("allowLateBooking", !!checked)}
        />
        <Label htmlFor="allowLateBooking" className="text-sm font-normal cursor-pointer">
          Permitir agendamento após o início da aula
        </Label>
      </div>

      <ClassParticipantsSection
        classId={classData?.id}
        maxCapacity={watch("maxCapacity")}
        onParticipantsChange={setParticipants}
      />

      <div className="flex gap-4 pt-6">
        <Button type="submit" disabled={isSubmitting} className="flex-1" isLoading={isSubmitting}>
          {classData ? "Atualizar" : "Cadastrar"}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  )
}
