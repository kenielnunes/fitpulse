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
  {
    name: "Ana Costa",
    birthDate: "1988-03-25",
    cpf: "456.789.123-00",
    city: "São Paulo",
    neighborhood: "Jardins",
    address: "Rua Augusta, 789",
    planType: "mensal" as const,
  },
  {
    name: "Carlos Ferreira",
    birthDate: "1995-07-12",
    cpf: "789.123.456-00",
    city: "São Paulo",
    neighborhood: "Vila Olímpia",
    address: "Av. Faria Lima, 1000",
    planType: "anual" as const,
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
  {
    description: "Yoga Relaxamento",
    type: "Yoga",
    dateTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), // daqui 4 dias
    maxCapacity: 12,
    status: "aberta" as const,
    allowLateBooking: true,
  },
  {
    description: "Spinning Intensivo",
    type: "Spinning",
    dateTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // daqui 5 dias
    maxCapacity: 18,
    status: "aberta" as const,
    allowLateBooking: false,
  },
]

export function seedData() {
  const store = useGymStore.getState()

  // Verificar se já existem dados
  if (store.students.length > 0 || store.classes.length > 0) {
    console.log("⚠️  Dados já existem no sistema!")
    console.log(`   - ${store.students.length} alunos cadastrados`)
    console.log(`   - ${store.classes.length} aulas cadastradas`)
    return false
  }

  console.log("🌱 Iniciando seed de dados de teste...")

  // Adicionar alunos
  sampleStudents.forEach((student) => {
    store.addStudent(student)
  })

  // Adicionar aulas
  sampleClasses.forEach((classData) => {
    store.addClass(classData)
  })

  console.log("✅ Dados de exemplo adicionados com sucesso!")
  console.log(`   - ${sampleStudents.length} alunos criados`)
  console.log(`   - ${sampleClasses.length} aulas criadas`)

  return true
}

seedData()
