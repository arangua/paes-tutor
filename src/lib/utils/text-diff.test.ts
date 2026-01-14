import { describe, it, expect } from 'vitest'
import { compareVersions } from './text-diff'

describe('text-diff', () => {
  describe('compareVersions', () => {
    it('debe detectar cambios en el título', () => {
      const oldVersion = {
        title: 'Título original',
        content: 'Contenido igual',
        tags: 'tag1, tag2',
      }
      const newVersion = {
        title: 'Título modificado',
        content: 'Contenido igual',
        tags: 'tag1, tag2',
      }

      const result = compareVersions(oldVersion, newVersion)

      expect(result.title.changed).toBe(true)
      expect(result.title.old).toBe('Título original')
      expect(result.title.new).toBe('Título modificado')
      expect(result.content.changed).toBe(false)
      expect(result.tags.changed).toBe(false)
      expect(result.hasChanges).toBe(true)
    })

    it('debe detectar cambios en el contenido', () => {
      const oldVersion = {
        title: 'Título igual',
        content: 'Contenido original',
        tags: 'tag1',
      }
      const newVersion = {
        title: 'Título igual',
        content: 'Contenido modificado con más texto',
        tags: 'tag1',
      }

      const result = compareVersions(oldVersion, newVersion)

      expect(result.title.changed).toBe(false)
      expect(result.content.changed).toBe(true)
      expect(result.content.old).toBe('Contenido original')
      expect(result.content.new).toBe('Contenido modificado con más texto')
      expect(result.hasChanges).toBe(true)
    })

    it('debe detectar cambios en los tags', () => {
      const oldVersion = {
        title: 'Título igual',
        content: 'Contenido igual',
        tags: 'tag1, tag2',
      }
      const newVersion = {
        title: 'Título igual',
        content: 'Contenido igual',
        tags: 'tag1, tag2, tag3',
      }

      const result = compareVersions(oldVersion, newVersion)

      expect(result.title.changed).toBe(false)
      expect(result.content.changed).toBe(false)
      expect(result.tags.changed).toBe(true)
      expect(result.tags.old).toBe('tag1, tag2')
      expect(result.tags.new).toBe('tag1, tag2, tag3')
      expect(result.hasChanges).toBe(true)
    })

    it('debe detectar cuando no hay cambios', () => {
      const version = {
        title: 'Título igual',
        content: 'Contenido igual',
        tags: 'tag1, tag2',
      }

      const result = compareVersions(version, version)

      expect(result.title.changed).toBe(false)
      expect(result.content.changed).toBe(false)
      expect(result.tags.changed).toBe(false)
      expect(result.hasChanges).toBe(false)
    })

    it('debe manejar tags nulos o vacíos', () => {
      const oldVersion = {
        title: 'Título',
        content: 'Contenido',
        tags: null,
      }
      const newVersion = {
        title: 'Título',
        content: 'Contenido',
        tags: 'tag1',
      }

      const result = compareVersions(oldVersion, newVersion)

      expect(result.tags.changed).toBe(true)
      expect(result.tags.old).toBe(null)
      expect(result.tags.new).toBe('tag1')
    })

    it('debe detectar múltiples cambios simultáneos', () => {
      const oldVersion = {
        title: 'Título original',
        content: 'Contenido original',
        tags: 'tag1',
      }
      const newVersion = {
        title: 'Título nuevo',
        content: 'Contenido nuevo',
        tags: 'tag1, tag2',
      }

      const result = compareVersions(oldVersion, newVersion)

      expect(result.title.changed).toBe(true)
      expect(result.content.changed).toBe(true)
      expect(result.tags.changed).toBe(true)
      expect(result.hasChanges).toBe(true)
    })
  })

})

