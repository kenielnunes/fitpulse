/**
 * Utilitários para validação de CPF brasileiro
 */

/**
 * Remove caracteres não numéricos do CPF
 */
export function cleanCPF(cpf: string): string {
  return cpf.replace(/\D/g, "")
}

/**
 * Formata CPF no padrão brasileiro (000.000.000-00)
 */
export function formatCPF(cpf: string): string {
  const cleaned = cleanCPF(cpf)
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
}

/**
 * Valida se o CPF é válido usando o algoritmo oficial brasileiro
 */
export function validateCPF(cpf: string): boolean {
  const cleaned = cleanCPF(cpf)

  // Verifica se tem 11 dígitos
  if (cleaned.length !== 11) return false

  // Verifica se todos os dígitos são iguais (CPF inválido)
  if (/^(\d)\1{10}$/.test(cleaned)) return false

  // Validação do primeiro dígito verificador
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned.charAt(i)) * (10 - i)
  }
  let remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleaned.charAt(9))) return false

  // Validação do segundo dígito verificador
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned.charAt(i)) * (11 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleaned.charAt(10))) return false

  return true
}

/**
 * Valida e formata CPF
 */
export function validateAndFormatCPF(cpf: string): { isValid: boolean; formatted: string } {
  const cleaned = cleanCPF(cpf)
  const isValid = validateCPF(cleaned)
  const formatted = isValid ? formatCPF(cleaned) : cpf

  return { isValid, formatted }
}

/**
 * Hook para validação de CPF em tempo real
 */
export function useCPFValidation() {
  const validate = (cpf: string) => {
    if (!cpf) return { isValid: true, message: "" }

    const cleaned = cleanCPF(cpf)

    if (cleaned.length > 0 && cleaned.length < 11) {
      return { isValid: false, message: "CPF incompleto" }
    }

    if (cleaned.length === 11 && !validateCPF(cleaned)) {
      return { isValid: false, message: "CPF inválido" }
    }

    return { isValid: true, message: "" }
  }

  return { validate }
} 