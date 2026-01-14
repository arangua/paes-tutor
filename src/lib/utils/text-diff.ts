/**
 * Utilidades para comparar y mostrar diferencias entre textos
 */

import { safeRound } from './validation-utils'

export interface DiffResult {
  type: 'equal' | 'added' | 'removed'
  text: string
}

export interface VersionDiff {
  title: {
    old: string
    new: string
    changed: boolean
  }
  content: {
    old: string
    new: string
    changed: boolean
    diff: DiffResult[]
    stats: {
      totalLines: number
      addedLines: number
      removedLines: number
      unchangedLines: number
      changePercentage: number
    }
  }
  tags: {
    old: string | null
    new: string | null
    changed: boolean
  }
  hasChanges: boolean
  summary: {
    totalChanges: number
    fieldsChanged: string[]
  }
}

/**
 * Compara dos versiones de una nota y retorna las diferencias
 * 
 * Analiza los cambios entre dos versiones de una nota, comparando título, contenido y tags.
 * Genera un diff línea por línea del contenido para visualización.
 * 
 * @param oldVersion - Versión anterior de la nota
 *   - title: Título de la versión anterior
 *   - content: Contenido de la versión anterior
 *   - tags: Tags de la versión anterior (puede ser null)
 * 
 * @param newVersion - Versión nueva de la nota
 *   - title: Título de la versión nueva
 *   - content: Contenido de la versión nueva
 *   - tags: Tags de la versión nueva (puede ser null)
 * 
 * @returns VersionDiff con:
 *   - title: Comparación del título (old, new, changed)
 *   - content: Comparación del contenido (old, new, changed, diff[])
 *   - tags: Comparación de tags (old, new, changed)
 *   - hasChanges: true si hay algún cambio
 * 
 * @example
 * const diff = compareVersions(
 *   { title: "Nota 1", content: "Contenido original", tags: "tag1" },
 *   { title: "Nota 2", content: "Contenido modificado", tags: "tag1,tag2" }
 * )
 * console.log(diff.hasChanges) // true
 * console.log(diff.content.diff) // Array con diferencias línea por línea
 */
export function compareVersions(
  oldVersion: { title: string; content: string; tags: string | null },
  newVersion: { title: string; content: string; tags: string | null }
): VersionDiff {
  const titleChanged = oldVersion.title.trim() !== newVersion.title.trim()
  const contentChanged = oldVersion.content.trim() !== newVersion.content.trim()
  const tagsChanged =
    (oldVersion.tags || '').trim() !== (newVersion.tags || '').trim()

  // Generar diff mejorado del contenido (línea por línea)
  const contentDiff = generateSimpleDiff(
    oldVersion.content,
    newVersion.content
  )

  const contentStats = calculateDiffStats(contentDiff)
  
  const fieldsChanged: string[] = []
  if (titleChanged) fieldsChanged.push('title')
  if (contentChanged) fieldsChanged.push('content')
  if (tagsChanged) fieldsChanged.push('tags')

  return {
    title: {
      old: oldVersion.title,
      new: newVersion.title,
      changed: titleChanged,
    },
    content: {
      old: oldVersion.content,
      new: newVersion.content,
      changed: contentChanged,
      diff: contentDiff,
      stats: contentStats,
    },
    tags: {
      old: oldVersion.tags,
      new: newVersion.tags,
      changed: tagsChanged,
    },
    hasChanges: titleChanged || contentChanged || tagsChanged,
    summary: {
      totalChanges: fieldsChanged.length,
      fieldsChanged,
    },
  }
}

/**
 * Genera un diff mejorado línea por línea usando algoritmo tipo Myers
 * 
 * Compara dos textos línea por línea y genera un array de DiffResult
 * indicando qué líneas son iguales, fueron agregadas o removidas.
 * Usa un algoritmo más inteligente que detecta mejor los cambios.
 * 
 * @param oldText - Texto anterior
 * @param newText - Texto nuevo
 * 
 * @returns Array de DiffResult con el tipo de cambio por línea:
 *   - 'equal': Línea sin cambios
 *   - 'removed': Línea eliminada
 *   - 'added': Línea agregada
 */
function generateSimpleDiff(oldText: string, newText: string): DiffResult[] {
  const oldLines = oldText.split('\n')
  const newLines = newText.split('\n')
  const result: DiffResult[] = []

  // Algoritmo simple de LCS (Longest Common Subsequence) mejorado
  const lcs = computeLCS(oldLines, newLines)
  
  let oldIdx = 0
  let newIdx = 0
  let lcsIdx = 0

  while (oldIdx < oldLines.length || newIdx < newLines.length) {
    // Si hay más líneas en old que no están en LCS
    if (oldIdx < oldLines.length && 
        (lcsIdx >= lcs.length || (oldLines[oldIdx] !== undefined && oldLines[oldIdx] !== lcs[lcsIdx]))) {
      const line = oldLines[oldIdx]
      if (line !== undefined) {
        result.push({ type: 'removed', text: line })
      }
      oldIdx++
    }
    // Si hay más líneas en new que no están en LCS
    else if (newIdx < newLines.length && 
             (lcsIdx >= lcs.length || (newLines[newIdx] !== undefined && newLines[newIdx] !== lcs[lcsIdx]))) {
      const line = newLines[newIdx]
      if (line !== undefined) {
        result.push({ type: 'added', text: line })
      }
      newIdx++
    }
    // Línea común (igual en ambas)
    else {
      const oldLine = oldLines[oldIdx]
      if (oldLine !== undefined) {
        result.push({ type: 'equal', text: oldLine })
      }
      oldIdx++
      newIdx++
      lcsIdx++
    }
  }

  return result
}

/**
 * Calcula la secuencia común más larga (LCS) entre dos arrays
 */
function computeLCS(arr1: string[], arr2: string[]): string[] {
  const m = arr1.length
  const n = arr2.length
  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0))

  // Construir tabla DP
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (arr1[i - 1] === arr2[j - 1]) {
        const prev = dp[i - 1]?.[j - 1] ?? 0
        dp[i][j] = prev + 1
      } else {
        const up = dp[i - 1]?.[j] ?? 0
        const left = dp[i]?.[j - 1] ?? 0
        dp[i][j] = Math.max(up, left)
      }
    }
  }

  // Reconstruir LCS
  const lcs: string[] = []
  let i = m
  let j = n

  while (i > 0 && j > 0) {
    const arr1Val = arr1[i - 1]
    const arr2Val = arr2[j - 1]
    if (arr1Val !== undefined && arr2Val !== undefined && arr1Val === arr2Val) {
      lcs.unshift(arr1Val)
      i--
      j--
    } else {
      const up = dp[i - 1]?.[j] ?? 0
      const left = dp[i]?.[j - 1] ?? 0
      if (up > left) {
        i--
      } else {
        j--
      }
    }
  }

  return lcs
}

/**
 * Calcula estadísticas de cambios en un diff
 */
export function calculateDiffStats(diff: DiffResult[]): {
  totalLines: number
  addedLines: number
  removedLines: number
  unchangedLines: number
  changePercentage: number
} {
  const stats = {
    totalLines: diff.length,
    addedLines: diff.filter(d => d.type === 'added').length,
    removedLines: diff.filter(d => d.type === 'removed').length,
    unchangedLines: diff.filter(d => d.type === 'equal').length,
    changePercentage: 0,
  }
  
  if (stats.totalLines > 0) {
    stats.changePercentage = safeRound(
      ((stats.addedLines + stats.removedLines) / stats.totalLines) * 100,
      0
    )
  }
  
  return stats
}

