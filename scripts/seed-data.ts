import { useGymStore } from "@/lib/store"

// Dados de exemplo
const sampleStudents = [
  {
    name: "João Silva",
    birthDate: "1990-05-15",
    cpf: "123.456.789-00",
    city: "São Paulo",
    neighborhood: "Vila Madalena",
    address: "Rua das Flores, 123",
    planType: "mensal" as const,
  },
  {
    name: "Maria Santos",
    birthDate: "1985-08-22",
    cpf: "987.654.321-00",
    city: "São Paulo",
    neighborhood: "Pinheiros",
    address: "Av. Paulista, 456",
    planType: "anual" as const,
  },
  {
    name: "Pedro Oliveira",
    birthDate: "1992-12-10",
    city: "São Paulo",
    neighborhood: "Itaim Bibi",
    planType: "trimestral" as const,
  },
]

const sampleClasses = [
  {
    description: "Cross Training Iniciante",
    type: "Cross Training",
    dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Amanhã
    maxCapacity: 15,
    status: "aberta" as const,
    allowLateBooking: true,
  },
  {
    description: "Pilates Avançado",
    type: "Pilates",
    dateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // Amanhã de amanhã
    maxCapacity: 10,
    status: "aberta" as const,
    allowLateBooking: false,
  },
  {
    description: "Funcional Matinal",
    type: "Funcional",
    dateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // daqui 3 dias
    maxCapacity: 20,
    status: "aberta" as const,
    allowLateBooking: true,
  },
]

export function seedData() {
  const store = useGymStore.getState()

  sampleStudents.forEach((student) => {
    store.addStudent(student)
  })

  sampleClasses.forEach((classData) => {
    store.addClass(classData)
  })

  console.log("Dados de exemplo add com sucesso!")
}
