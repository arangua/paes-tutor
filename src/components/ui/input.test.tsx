import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Input } from './input'

describe('Input', () => {
  describe('id attribute', () => {
    it('should auto-generate id when not provided', () => {
      const { container } = render(<Input />)
      const input = container.querySelector('input')
      
      expect(input).toBeInTheDocument()
      expect(input).toHaveAttribute('id')
      expect(input?.getAttribute('id')).toMatch(/^input-/)
    })

    it('should use provided id when given', () => {
      const { container } = render(<Input id="custom-id" />)
      const input = container.querySelector('input')
      
      expect(input).toHaveAttribute('id', 'custom-id')
    })
  })

  describe('name attribute', () => {
    it('should NOT auto-generate name when not provided', () => {
      const { container } = render(<Input />)
      const input = container.querySelector('input')
      
      expect(input).toBeInTheDocument()
      expect(input).not.toHaveAttribute('name')
    })

    it('should use provided name when given', () => {
      const { container } = render(<Input name="email" />)
      const input = container.querySelector('input')
      
      expect(input).toHaveAttribute('name', 'email')
    })

    it('should allow name to be undefined (for non-form inputs)', () => {
      const { container } = render(<Input id="search-input" />)
      const input = container.querySelector('input')
      
      expect(input).toHaveAttribute('id', 'search-input')
      expect(input).not.toHaveAttribute('name')
    })
  })

  describe('id and name together', () => {
    it('should handle id without name (non-form input)', () => {
      const { container } = render(<Input id="search" />)
      const input = container.querySelector('input')
      
      expect(input).toHaveAttribute('id', 'search')
      expect(input).not.toHaveAttribute('name')
    })

    it('should handle both id and name (form input)', () => {
      const { container } = render(<Input id="email-input" name="email" />)
      const input = container.querySelector('input')
      
      expect(input).toHaveAttribute('id', 'email-input')
      expect(input).toHaveAttribute('name', 'email')
    })

    it('should auto-generate id but not name (form input with explicit name)', () => {
      const { container } = render(<Input name="username" />)
      const input = container.querySelector('input')
      
      expect(input).toHaveAttribute('name', 'username')
      expect(input).toHaveAttribute('id')
      expect(input?.getAttribute('id')).toMatch(/^input-/)
    })
  })
})
