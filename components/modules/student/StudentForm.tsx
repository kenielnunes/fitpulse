"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useGymStore, type Student } from "@/lib/store"
import { useToast } from "@/components/ds/toast"
import { Button } from "@/components/ds/button"
import { Input } from "@/components/ds/input"
import { Label } from "@/components/ds/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { validateCPF, cleanCPF, formatCPF, validateAndFormatCPF } from "@/lib/utils/cpf-validation"

const studentSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .refine((val) => /^[^\d]+$/.test(val), {
      message: "O nome não pode conter números",
    }),
  birthDate: z
    .string()
    .min(1, "Data de nascimento é obrigatória")
    .refine((value) => {
      if (!value) return false
      const today = new Date()
      const date = new Date(value)

      return date <= today
    }, { message: "Data de nascimento não pode ser no futuro" }),
  cpf: z.string()
    .optional()
    .refine((val) => {
      if (!val) return true // CPF é opcional
      const cleaned = cleanCPF(val)
      if (cleaned.length > 0 && cleaned.length < 11) return false
      if (cleaned.length === 11 && !validateCPF(cleaned)) return false
      return true
    }, { message: "CPF inválido" }),
  city: z.string().optional(),
  neighborhood: z.string().optional(),
  address: z.string().optional(),
  planType: z.enum(["mensal", "trimestral", "anual"]).refine(
    (val) => !!val,
    { message: "Tipo de plano é obrigatório" }
  ),
})

type StudentFormData = z.infer<typeof studentSchema>

interface StudentFormProps {
  student?: Student | null
  onSuccess?: () => void
  onCancel?: () => void
}

export function StudentForm({ student, onSuccess, onCancel }: StudentFormProps) {
  const { addStudent, updateStudent } = useGymStore()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: student
      ? {
        name: student.name,
        birthDate: student.birthDate,
        cpf: student.cpf || "",
        city: student.city || "",
        neighborhood: student.neighborhood || "",
        address: student.address || "",
        planType: student.planType,
      }
      : {
        name: "",
        birthDate: "",
        cpf: "",
        city: "",
        neighborhood: "",
        address: "",
        planType: "mensal",
      },
  })

  // Função para formatar CPF em tempo real
  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const cleaned = cleanCPF(value)

    if (cleaned.length <= 11) {
      let formatted = cleaned
      if (cleaned.length >= 3) formatted = cleaned.replace(/(\d{3})/, "$1.")
      if (cleaned.length >= 6) formatted = cleaned.replace(/(\d{3})(\d{3})/, "$1.$2.")
      if (cleaned.length >= 9) formatted = cleaned.replace(/(\d{3})(\d{3})(\d{3})/, "$1.$2.$3-")

      setValue("cpf", formatted)
    }
  }

  // Função para validar CPF em tempo real
  const handleCPFBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value && cleanCPF(value).length === 11) {
      const { isValid, formatted } = validateAndFormatCPF(value)
      if (isValid) {
        setValue("cpf", formatted)
      }
    }
  }

  const planType = watch("planType")

  const onSubmit = async (data: StudentFormData) => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      if (student) {
        updateStudent(student.id, data)
        toast({
          title: "Aluno atualizado",
          description: "As informações do aluno foram atualizadas com sucesso.",
          variant: "success",
        })
      } else {
        addStudent(data)
        toast({
          title: "Aluno cadastrado",
          description: "O aluno foi cadastrado com sucesso.",
          variant: "success",
        })
      }

      onSuccess?.()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o aluno. Tente novamente.",
        variant: "error",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Nome *</Label>
          <Input id="name" {...register("name")} placeholder="Nome completo" error={!!errors.name} />
          {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="birthDate">Data de Nascimento *</Label>
          <Input id="birthDate" type="date" {...register("birthDate")} error={!!errors.birthDate} />
          {errors.birthDate && <p className="text-sm text-red-600">{errors.birthDate.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cpf">CPF</Label>
          <Input
            id="cpf"
            {...register("cpf")}
            placeholder="000.000.000-00"
            onChange={handleCPFChange}
            onBlur={handleCPFBlur}
            maxLength={14}
            error={!!errors.cpf}
          />
          {errors.cpf && <p className="text-sm text-red-600">{errors.cpf.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="planType">Tipo de Plano *</Label>
          <Select value={planType} onValueChange={(value) => setValue("planType", value as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o plano" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mensal">Mensal</SelectItem>
              <SelectItem value="trimestral">Trimestral</SelectItem>
              <SelectItem value="anual">Anual</SelectItem>
            </SelectContent>
          </Select>
          {errors.planType && <p className="text-sm text-red-600">{errors.planType.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">Cidade</Label>
          <Input id="city" {...register("city")} placeholder="Cidade" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="neighborhood">Bairro</Label>
          <Input id="neighborhood" {...register("neighborhood")} placeholder="Bairro" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Endereço</Label>
        <Input id="address" {...register("address")} placeholder="Endereço completo" />
      </div>

      <div className="flex gap-4 pt-6">
        <Button type="submit" disabled={isSubmitting} className="flex-1" isLoading={isSubmitting}>
          {student ? "Atualizar" : "Cadastrar"}
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
