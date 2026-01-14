import * as React from 'react'

import { cn } from '@/lib/utils'

function Textarea({
  className,
  id,
  name,
  ...props
}: React.ComponentProps<'textarea'>) {
  // Enterprise: Garantizar id para accesibilidad (auto-generar si no se proporciona)
  const autoId = React.useId()
  const finalId = id || `textarea-${autoId}`

  return (
    <textarea
      data-slot="textarea"
      id={finalId}
      name={name}
      className={cn(
        'border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
