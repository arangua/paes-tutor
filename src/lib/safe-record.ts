// src/lib/safe-record.ts

export function hasOwn(record: object, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(record, key)
}

export function getRecordValue<
  T extends Record<string, unknown>,
  K extends string,
>(record: T, key: K): T[K] | undefined {
  // eslint-disable-next-line security/detect-object-injection -- key validated via hasOwn()
  return hasOwn(record, key) ? (record[key] as T[K]) : undefined
}

export function setRecordValue<
  T extends Record<string, unknown>,
  K extends string,
>(record: T, key: K, value: T[K]): void {
  Object.defineProperty(record, key, {
    value,
    writable: true,
    enumerable: true,
    configurable: true,
  })
}


