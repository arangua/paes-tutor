'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Componente de Skip Links para accesibilidad WCAG 2.1 AAA
 * 
 * Permite a los usuarios de lectores de pantalla y navegación por teclado
 * saltar directamente a las secciones principales de la página sin tener
 * que navegar por el contenido completo.
 * 
 * Cumple con:
 * - WCAG 2.1 Nivel AAA: 2.4.1 (Bypass Blocks)
 * - Mejora significativamente la experiencia para usuarios con discapacidades
 */
export function SkipLinks() {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(false)

  // Mostrar skip links cuando el usuario presiona Tab
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && !e.shiftKey) {
        setIsVisible(true)
      }
    }

    const handleClick = () => {
      // Ocultar después de un breve delay para permitir que el focus se mueva
      setTimeout(() => setIsVisible(false), 100)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('click', handleClick)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('click', handleClick)
    }
  }, [])

  // Ocultar cuando cambia la ruta usando un callback
  useEffect(() => {
    // Usar un pequeño delay para evitar renders en cascada
    const timeoutId = setTimeout(() => {
      setIsVisible(false)
    }, 0)
    return () => clearTimeout(timeoutId)
  }, [pathname])

  if (!isVisible) return null

  const skipLinks = [
    { id: 'main-content', label: 'Saltar al contenido principal' },
    { id: 'navigation', label: 'Saltar a la navegación' },
  ]

  // Agregar skip link específico para búsqueda si está disponible
  if (pathname !== '/auth/signin' && pathname !== '/auth/signup') {
    skipLinks.push({ id: 'search', label: 'Saltar a la búsqueda' })
  }

  return (
    <div className="skip-links" role="navigation" aria-label="Enlaces de navegación rápida">
      {skipLinks.map(link => (
        <a
          key={link.id}
          href={`#${link.id}`}
          className="skip-link"
          onClick={e => {
            e.preventDefault()
            const target = document.getElementById(link.id)
            if (target) {
              target.focus()
              target.scrollIntoView({ behavior: 'smooth', block: 'start' })
              setIsVisible(false)
            }
          }}
        >
          {link.label}
        </a>
      ))}
      <style dangerouslySetInnerHTML={{
        __html: `
        .skip-links {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding: 1rem;
        }

        .skip-link {
          position: absolute;
          top: -100px;
          left: 0;
          background: var(--primary, #3b82f6);
          color: white;
          padding: 0.75rem 1.5rem;
          text-decoration: none;
          border-radius: 0.375rem;
          font-weight: 600;
          font-size: 0.875rem;
          z-index: 10000;
          transition: top 0.2s ease-in-out;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .skip-link:focus {
          top: 0;
          outline: 2px solid white;
          outline-offset: 2px;
        }

        .skip-link:hover {
          background: var(--primary-hover, #2563eb);
        }
      `}} />
    </div>
  )
}

