/**
 * Utilitários para gerenciar o seed automático de dados
 */

export const SEED_FLAG_KEY = "fitpulse-seed-executed"

/**
 * Verifica se o seed já foi executado
 */
export function hasSeedBeenExecuted(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem(SEED_FLAG_KEY) === "true"
}

/**
 * Marca o seed como executado
 */
export function markSeedAsExecuted(): void {
  if (typeof window === "undefined") return
  localStorage.setItem(SEED_FLAG_KEY, "true")
}

/**
 * Remove a marcação de seed executado (para resetar)
 */
export function resetSeedFlag(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(SEED_FLAG_KEY)
}

/**
 * Limpa todos os dados e reseta o seed
 */
export function resetAllData(): void {
  if (typeof window === "undefined") return

  // Limpar localStorage do Zustand
  localStorage.removeItem("fitpulse-storage")

  // Resetar flag do seed
  resetSeedFlag()
}

/**
 * Verifica se deve executar o seed automaticamente
 */
export function shouldAutoSeed(): boolean {
  return !hasSeedBeenExecuted()
} 