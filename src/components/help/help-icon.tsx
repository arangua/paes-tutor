'use client'

import { HelpCircle } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

interface HelpIconProps {
  content: string | React.ReactNode
  className?: string
  side?: 'top' | 'right' | 'bottom' | 'left'
}

export function HelpIcon({ content, className, side = 'top' }: Readonly<HelpIconProps>) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <HelpCircle
          className={`h-4 w-4 text-muted-foreground hover:text-foreground cursor-help ${className || ''}`}
        />
      </TooltipTrigger>
      <TooltipContent side={side} className="max-w-xs">
        {typeof content === 'string' ? (
          <p className="text-sm">{content}</p>
        ) : (
          <div className="text-sm">{content}</div>
        )}
      </TooltipContent>
    </Tooltip>
  )
}
