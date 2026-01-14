import { vi } from "vitest";

// ✅ referencia única: esto es lo que se setea desde los tests
export const mockGetAuthenticatedUserWithStudent = vi.fn();

// ✅ IMPORTANTÍSIMO: el specifier DEBE ser idéntico al que usa el route
vi.mock("@/lib/get-session", () => ({
  getAuthenticatedUserWithStudent: mockGetAuthenticatedUserWithStudent,
}));

export function setupAuthenticated(userWithStudent: unknown) {
  mockGetAuthenticatedUserWithStudent.mockResolvedValue(userWithStudent);
}

export function setupUnauthenticated() {
  mockGetAuthenticatedUserWithStudent.mockResolvedValue(null);
}
