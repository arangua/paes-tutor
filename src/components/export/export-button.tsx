'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Download, FileText, FileSpreadsheet, File, Loader2 } from 'lucide-react'
import { captureError } from '@/lib/monitoring'

interface ExportButtonProps {
  onExportPDF?: () => Promise<void>
  onExportExcel?: () => Promise<void>
  onExportWord?: () => Promise<void>
  disabled?: boolean
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export function ExportButton({
  onExportPDF,
  onExportExcel,
  onExportWord,
  disabled = false,
  variant = 'outline',
  size = 'default',
}: ExportButtonProps) {
  const [exporting, setExporting] = useState<string | null>(null)

  const handleExport = async (format: 'pdf' | 'excel' | 'word', handler?: () => Promise<void>) => {
    if (!handler) return

    try {
      setExporting(format)
      await handler()
      // El toast de éxito se maneja en las funciones de exportación individuales
    } catch (error) {
      // Log error usando servicio de monitoreo
      captureError(error instanceof Error ? error : new Error(String(error)), {
        type: 'export_error',
        format,
        path: typeof window !== 'undefined' ? window.location.pathname : undefined,
      })
      // El toast de error se maneja en las funciones de exportación individuales
    } finally {
      setExporting(null)
    }
  }

  const hasAnyExport = onExportPDF || onExportExcel || onExportWord

  if (!hasAnyExport) {
    return null
  }

  // Si solo hay una opción, mostrar botón directo
  if (hasAnyExport && !onExportExcel && !onExportWord) {
    return (
      <Button
        variant={variant}
        size={size}
        onClick={() => handleExport('pdf', onExportPDF)}
        disabled={disabled || exporting !== null}
        aria-label="Exportar a PDF"
      >
        {exporting === 'pdf' ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Download className="h-4 w-4 mr-2" />
        )}
        Exportar PDF
      </Button>
    )
  }

  // Múltiples opciones: dropdown
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          disabled={disabled || exporting !== null}
          aria-label="Exportar datos"
          aria-haspopup="true"
        >
          {exporting ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          {exporting ? `Exportando ${exporting.toUpperCase()}...` : 'Exportar'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {onExportPDF && (
          <DropdownMenuItem
            onClick={() => handleExport('pdf', onExportPDF)}
            disabled={exporting !== null}
          >
            <FileText className="h-4 w-4 mr-2" />
            Exportar a PDF
          </DropdownMenuItem>
        )}
        {onExportExcel && (
          <DropdownMenuItem
            onClick={() => handleExport('excel', onExportExcel)}
            disabled={exporting !== null}
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Exportar a Excel
          </DropdownMenuItem>
        )}
        {onExportWord && (
          <DropdownMenuItem
            onClick={() => handleExport('word', onExportWord)}
            disabled={exporting !== null}
          >
            <File className="h-4 w-4 mr-2" />
            Exportar a Word
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
