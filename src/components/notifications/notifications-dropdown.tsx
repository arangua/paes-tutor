'use client'

import { useState, useEffect, useCallback } from 'react'
import { safeToISOString } from '@/app/api/notes/versions/validation-utils'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import {
  Bell,
  BellRing,
  Check,
  CheckCheck,
  Loader2,
  Lightbulb,
  Clock,
  Award,
  Target,
  Share2,
  Calendar,
  Settings,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  read: boolean
  readAt: string | null
  relatedId: string | null
  relatedType: string | null
  actionUrl: string | null
  priority: string
  createdAt: string
  expiresAt: string | null
}

interface NotificationsResponse {
  notifications: Notification[]
  unreadCount: number
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'recommendation':
      return <Lightbulb className="h-4 w-4 text-yellow-600" />
    case 'reminder':
      return <Clock className="h-4 w-4 text-blue-600" />
    case 'achievement':
      return <Award className="h-4 w-4 text-purple-600" />
    case 'challenge':
      return <Target className="h-4 w-4 text-red-600" />
    case 'shared':
      return <Share2 className="h-4 w-4 text-green-600" />
    case 'schedule':
      return <Calendar className="h-4 w-4 text-indigo-600" />
    case 'system':
      return <Settings className="h-4 w-4 text-gray-600" />
    default:
      return <Bell className="h-4 w-4" />
  }
}

// Constantes para configuración
const NOTIFICATION_POLL_INTERVAL_MS = 30 * 1000 // 30 segundos
const NOTIFICATIONS_LIMIT = 20
const MAX_UNREAD_DISPLAY = 9 // Para mostrar "9+" cuando hay más de 9

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'urgent':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    case 'high':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
    case 'normal':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }
}

export function NotificationsDropdown() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isMarkingRead, setIsMarkingRead] = useState(false)

  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await fetch(`/api/notifications?unreadOnly=false&limit=${NOTIFICATIONS_LIMIT}`)
      if (!res.ok) {
        throw new Error('Error al cargar notificaciones')
      }
      const data: NotificationsResponse = await res.json()
      setNotifications(data.notifications)
      setUnreadCount(data.unreadCount)
    } catch {
      toast.error('Error al cargar notificaciones')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchNotifications()

    // Polling cada 30 segundos para nuevas notificaciones
    const interval = setInterval(fetchNotifications, NOTIFICATION_POLL_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [fetchNotifications])

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const res = await fetch(`/api/notifications/${notificationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true }),
      })

      if (!res.ok) {
        throw new Error('Error al marcar como leída')
      }

      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, read: true, readAt: safeToISOString(new Date()) } : n
        )
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch {
      toast.error('Error al marcar notificación como leída')
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      setIsMarkingRead(true)
      const res = await fetch('/api/notifications/read-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!res.ok) {
        throw new Error('Error al marcar todas como leídas')
      }

      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true, readAt: safeToISOString(new Date()) }))
      )
      setUnreadCount(0)
      toast.success('Todas las notificaciones marcadas como leídas')
    } catch {
      toast.error('Error al marcar todas como leídas')
    } finally {
      setIsMarkingRead(false)
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      handleMarkAsRead(notification.id)
    }

    if (notification.actionUrl) {
      router.push(notification.actionUrl)
      setIsOpen(false)
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Ahora'
    if (diffMins < 60) return `Hace ${diffMins} min`
    if (diffHours < 24) return `Hace ${diffHours} h`
    if (diffDays < 7) return `Hace ${diffDays} días`
    return date.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              {unreadCount > 0 ? <BellRing className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {unreadCount > MAX_UNREAD_DISPLAY ? `${MAX_UNREAD_DISPLAY}+` : unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[380px] p-0" sideOffset={5}>
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">Notificaciones</h3>
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {unreadCount} sin leer
                  </Badge>
                )}
              </div>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  disabled={isMarkingRead}
                  className="h-8 text-xs"
                >
                  {isMarkingRead ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <>
                      <CheckCheck className="h-3 w-3 mr-1" />
                      Marcar todas
                    </>
                  )}
                </Button>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <Bell className="h-12 w-12 text-muted-foreground opacity-50 mb-4" />
                  <p className="text-sm font-medium text-muted-foreground">No hay notificaciones</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Te notificaremos cuando haya actualizaciones importantes
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.map(notification => (
                    <div
                      key={notification.id}
                      className={cn(
                        'p-4 hover:bg-accent transition-colors cursor-pointer',
                        !notification.read && 'bg-blue-50/50 dark:bg-blue-950/10'
                      )}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div className="flex-1">
                              <p
                                className={cn(
                                  'text-sm font-medium',
                                  !notification.read && 'font-semibold'
                                )}
                              >
                                {notification.title}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              {notification.priority !== 'normal' && (
                                <Badge
                                  variant="outline"
                                  className={cn('text-xs', getPriorityColor(notification.priority))}
                                >
                                  {notification.priority}
                                </Badge>
                              )}
                              {!notification.read && (
                                <div className="h-2 w-2 rounded-full bg-blue-600" />
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {formatTime(notification.createdAt)}
                            </span>
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 text-xs"
                                onClick={e => {
                                  e.stopPropagation()
                                  handleMarkAsRead(notification.id)
                                }}
                              >
                                <Check className="h-3 w-3 mr-1" />
                                Marcar como leída
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <div className="p-2">
                  <Button variant="ghost" size="sm" className="w-full" asChild>
                    <Link href="/notifications">Ver todas las notificaciones</Link>
                  </Button>
                </div>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>{unreadCount > 0 ? `Notificaciones (${unreadCount} sin leer)` : 'Notificaciones'}</p>
      </TooltipContent>
    </Tooltip>
  )
}
