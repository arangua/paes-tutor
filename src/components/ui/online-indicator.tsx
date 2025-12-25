'use client'

import { Badge } from '@/components/ui/badge'
import { Wifi, WifiOff } from 'lucide-react'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export function OnlineIndicator() {
  const isOnline = useOnlineStatus()

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge
          variant={isOnline ? 'default' : 'destructive'}
          className="flex items-center gap-1.5 cursor-help"
        >
          {isOnline ? (
            <>
              <Wifi className="h-3 w-3" />
              En línea
            </>
          ) : (
            <>
              <WifiOff className="h-3 w-3" />
              Sin conexión
            </>
          )}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-sm">
          {isOnline ? (
            <>
              <strong>Conectado</strong>
              <br />
              <span className="text-muted-foreground text-xs">
                Tu conexión está activa. Tus respuestas y notas se guardan automáticamente, como en
                Google Docs.
              </span>
            </>
          ) : (
            <>
              <strong>Sin conexión</strong>
              <br />
              <span className="text-muted-foreground text-xs">
                No hay internet. Puedes seguir estudiando; todo se guardará cuando vuelvas a
                conectarte, como en modo avión.
              </span>
            </>
          )}
        </p>
      </TooltipContent>
    </Tooltip>
  )
}
