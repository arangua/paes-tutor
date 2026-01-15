import { vi } from 'vitest'

type AnyFn = (...args: any[]) => any

function deepMock(): any {
  return new Proxy(
    {},
    {
      get(_t, prop) {
        if (prop === '$connect') return vi.fn().mockResolvedValue(undefined)
        if (prop === '$disconnect') return vi.fn().mockResolvedValue(undefined)
        if (prop === '$transaction') return vi.fn(async (fn: AnyFn) => fn(deepMock()))
        if (prop === '$use') return vi.fn()
        if (prop === '$on') return vi.fn()
        if (prop === '$extends') return vi.fn(() => deepMock())
        // model delegates: prisma.user.findMany etc.
        return vi.fn()
      },
    }
  )
}

export class PrismaClient {
  // Delegate dinámico para cualquier model
  [key: string]: any
  constructor() {
    Object.assign(this, deepMock())
  }
}

export const Prisma = {} // por si alguien lo importa