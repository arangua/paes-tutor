/**
 * Constantes para el sistema de desafíos
 * Centraliza valores mágicos para mejorar mantenibilidad
 */
// @ts-nocheck


// Timeouts de transacciones (en milisegundos)
export const TRANSACTION_TIMEOUT_SHORT = 5000; // 5 segundos
export const TRANSACTION_TIMEOUT_LONG = 10000; // 10 segundos

// Configuración de timeout de desafíos
export const CHALLENGE_TIMEOUT_DAYS = 7; // Desafíos pendientes expiran después de 7 días
export const CHALLENGE_EXPIRING_WARNING_DAYS = 2; // Avisar 2 días antes de expirar
export const CHALLENGE_EXPIRING_SOON_DAYS = 5; // Considerar "próximo a expirar" a los 5 días

// Porcentajes
export const PERCENTAGE_MULTIPLIER = 100;

// Estados de desafío
export const CHALLENGE_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  COMPLETED: 'completed',
  DECLINED: 'declined',
  CANCELLED: 'cancelled'
} as const;
export type ChallengeStatus = (typeof CHALLENGE_STATUS)[keyof typeof CHALLENGE_STATUS];