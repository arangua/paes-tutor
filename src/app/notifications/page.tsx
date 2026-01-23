'use client'

import { useState, useEffect, useCallback } from 'react'
import { safeToISOString } from '@/app/api/notes/versions/validation-utils'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Bell,
  CheckCheck,
  Trash2,
  Loader2,
  Lightbulb,
  Clock,
  Award,
  Target,
  Share2,
  Calendar,
  Settings,
  ArrowLeft,
} from 'lucide-react'
import { toast } from 'sonner'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { cn } from '@/lib/utils'

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
      return <Lightbulb className="h-5 w-5 text-yellow-600" />
    case 'reminder':
      return <Clock className="h-5 w-5 text-blue-600" />
    case 'achievement':
      return <Award className="h-5 w-5 text-purple-600" />
    case 'challenge':
      return <Target className="h-5 w-5 text-red-600" />
    case 'shared':
      return <Share2 className="h-5 w-5 text-green-600" />
    case 'schedule':
      return <Calendar className="h-5 w-5 text-indigo-600" />
    case 'system':
      return <Settings className="h-5 w-5 text-gray-600" />
    default:
      return <Bell className="h-5 w-5" />
  }
}

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

export default function NotificationsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [isMarkingRead, setIsMarkingRead] = useState(false)

  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/notifications?unreadOnly=false&limit=100')
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

    // Polling cada 30 segundos
    const interval = setInterval(fetchNotifications, 30000)
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

  const handleDelete = async (notificationId: string) => {
    try {
      const res = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error('Error al eliminar notificación')
      }

      setNotifications(prev => prev.filter(n => n.id !== notificationId))
      toast.success('Notificación eliminada')
    } catch {
      toast.error('Error al eliminar notificación')
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      handleMarkAsRead(notification.id)
    }

    if (notification.actionUrl) {
      router.push(notification.actionUrl)
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
    if (diffMins < 60) return `Hace ${diffMins} minutos`
    if (diffHours < 24) return `Hace ${diffHours} horas`
    if (diffDays < 7) return `Hace ${diffDays} días`
    return date.toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  const filteredNotifications =
    activeTab === 'unread'
      ? notifications.filter(n => !n.read)
      : activeTab === 'read'
        ? notifications.filter(n => n.read)
        : notifications

  return (
    <div className="container mx-auto py-6 px-4 max-w-5xl">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs
          items={[
            { label: 'Inicio', href: '/' },
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Notificaciones' },
          ]}
        />
      </div>

      {/* Header */}
      <div className="mb-6 flex items-start justify-between flex-wrap gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <Bell className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Notificaciones</h1>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-sm">
                {unreadCount} sin leer
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">
            Mantente al día con tus actividades, logros y recomendaciones
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={handleMarkAllAsRead} disabled={isMarkingRead}>
            {isMarkingRead ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <CheckCheck className="h-4 w-4 mr-2" />
                Marcar todas como leídas
              </>
            )}
          </Button>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">Todas ({notifications.length})</TabsTrigger>
          <TabsTrigger value="unread">Sin leer ({unreadCount})</TabsTrigger>
          <TabsTrigger value="read">
            Leídas ({notifications.filter(n => n.read).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {isLoading ? (
            <Card>
              <CardContent className="py-12">
                <div className="flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ) : filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">
                  {activeTab === 'unread'
                    ? 'No hay notificaciones sin leer'
                    : activeTab === 'read'
                      ? 'No hay notificaciones leídas'
                      : 'No hay notificaciones'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map(notification => (
                <Card
                  key={notification.id}
                  className={cn(
                    'hover:border-primary transition-all cursor-pointer',
                    !notification.read && 'border-blue-200 bg-blue-50/50 dark:bg-blue-950/10'
                  )}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1">
                            <h3
                              className={cn(
                                'text-base font-medium mb-1',
                                !notification.read && 'font-semibold'
                              )}
                            >
                              {notification.title}
                            </h3>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
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
                        <p className="text-sm text-muted-foreground mb-3">{notification.message}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {formatTime(notification.createdAt)}
                          </span>
                          <div className="flex items-center gap-2">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs"
                                onClick={e => {
                                  e.stopPropagation()
                                  handleMarkAsRead(notification.id)
                                }}
                              >
                                <CheckCheck className="h-3 w-3 mr-1" />
                                Marcar como leída
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs text-destructive hover:text-destructive"
                              onClick={e => {
                                e.stopPropagation()
                                handleDelete(notification.id)
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
