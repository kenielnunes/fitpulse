import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Student {
  id: string
  name: string
  birthDate: string
  cpf?: string
  city?: string
  neighborhood?: string
  address?: string
  planType: "mensal" | "trimestral" | "anual"
  createdAt: string
}

export interface Class {
  id: string
  description: string
  type: string
  dateTime: string
  maxCapacity: number
  status: "aberta" | "concluida"
  allowLateBooking: boolean
  participants: string[] // student IDs
  createdAt: string
}

interface GymStore {
  students: Student[]
  classes: Class[]

  addStudent: (student: Omit<Student, "id" | "createdAt">) => void
  updateStudent: (id: string, student: Partial<Student>) => void
  deleteStudent: (id: string) => void
  getStudent: (id: string) => Student | undefined

  addClass: (classData: Omit<Class, "id" | "createdAt"> & { participants?: string[] }) => void
  updateClass: (id: string, classData: Partial<Class>) => void
  deleteClass: (id: string) => void
  getClass: (id: string) => Class | undefined

  addParticipant: (classId: string, studentId: string) => boolean
  removeParticipant: (classId: string, studentId: string) => void
  finishClass: (classId: string) => void

  // Utils
  getClassesByDate: (date: string) => Class[]
  canAddParticipant: (classId: string, studentId: string) => { canAdd: boolean; reason?: string }
}

export const useGymStore = create<GymStore>()(
  persist(
    (set, get) => ({
      students: [],
      classes: [],

      // Student actions
      addStudent: (studentData) => {
        const student: Student = {
          ...studentData,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        }
        set((state) => ({ students: [...state.students, student] }))
      },

      updateStudent: (id, studentData) => {
        set((state) => ({
          students: state.students.map((student) => (student.id === id ? { ...student, ...studentData } : student)),
        }))
      },

      deleteStudent: (id) => {
        set((state) => ({
          students: state.students.filter((student) => student.id !== id),
          classes: state.classes.map((cls) => ({
            ...cls,
            participants: cls.participants.filter((participantId) => participantId !== id),
          })),
        }))
      },

      getStudent: (id) => {
        return get().students.find((student) => student.id === id)
      },

      // Class actions
      addClass: (classData) => {
        const newClass: Class = {
          ...classData,
          id: crypto.randomUUID(),
          participants: classData.participants || [],
          createdAt: new Date().toISOString(),
        }
        set((state) => ({ classes: [...state.classes, newClass] }))
      },

      updateClass: (id, classData) => {
        set((state) => ({
          classes: state.classes.map((cls) => (cls.id === id ? { ...cls, ...classData } : cls)),
        }))
      },

      deleteClass: (id) => {
        set((state) => ({
          classes: state.classes.filter((cls) => cls.id !== id),
        }))
      },

      getClass: (id) => {
        return get().classes.find((cls) => cls.id === id)
      },

      // Booking actions
      addParticipant: (classId, studentId) => {
        const { canAdd } = get().canAddParticipant(classId, studentId)
        if (!canAdd) return false

        set((state) => ({
          classes: state.classes.map((cls) =>
            cls.id === classId ? { ...cls, participants: [...cls.participants, studentId] } : cls,
          ),
        }))
        return true
      },

      removeParticipant: (classId, studentId) => {
        set((state) => ({
          classes: state.classes.map((cls) =>
            cls.id === classId
              ? {
                ...cls,
                participants: cls.participants.filter((id) => id !== studentId),
              }
              : cls,
          ),
        }))
      },

      finishClass: (classId) => {
        set((state) => ({
          classes: state.classes.map((cls) => (cls.id === classId ? { ...cls, status: "concluida" as const } : cls)),
        }))
      },

      // Utils
      getClassesByDate: (date) => {
        return get().classes.filter((cls) => {
          const classDate = new Date(cls.dateTime);

          const targetDate = new Date(date + 'T00:00:00');

          return classDate.toDateString() === targetDate.toDateString();
        });
      },

      canAddParticipant: (classId, studentId) => {
        const cls = get().getClass(classId)
        if (!cls) return { canAdd: false, reason: "Aula não encontrada" }

        if (cls.status === "concluida") {
          return { canAdd: false, reason: "Aula já foi finalizada" }
        }

        if (cls.participants.includes(studentId)) {
          return { canAdd: false, reason: "Aluno já está inscrito nesta aula" }
        }

        if (cls.participants.length >= cls.maxCapacity) {
          return { canAdd: false, reason: "Aula lotada" }
        }

        const now = new Date()
        const classDateTime = new Date(cls.dateTime)

        if (now > classDateTime && !cls.allowLateBooking) {
          return { canAdd: false, reason: "Agendamento após o início não permitido" }
        }

        return { canAdd: true }
      },
    }),
    {
      name: "gym-store",
    },
  ),
)
