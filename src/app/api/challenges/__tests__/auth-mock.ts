// ✅ Mock global está en src/test/setup.ts
// Usamos el global directamente para máxima estabilidad

export function setupAuthenticated(userWithStudent: unknown) {
  // Usar el global directamente - es la fuente de verdad
  globalThis.__mockGetAuthenticatedUserWithStudent__?.mockResolvedValue(userWithStudent as any);
}

export function setupUnauthenticated() {
  // Usar el global directamente - es la fuente de verdad
  globalThis.__mockGetAuthenticatedUserWithStudent__?.mockResolvedValue(null);
}
