'use client';

import { useState } from 'react';
import { Bell, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NotificationItem } from './NotificationItem';
import { Notification } from '@/lib/notifications';
import { useNotifications } from '@/lib/contexts/NotificationContext';
import { usePostDetail } from '@/lib/hooks/usePostDetail';

export function NotificationDropdown() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, isLoading, isLoadingMore, hasMore, loadMore } = useNotifications();
  const { openPostDetail } = usePostDetail();
  const [isOpen, setIsOpen] = useState(false);

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.is_read) {
      await markAsRead(notification.id);
    }

    setIsOpen(false);

    openPostDetail(notification.post_id);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button className="relative p-3 rounded-lg hover:bg-accent transition-colors">
          <Bell className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        sideOffset={8}
        alignOffset={16}
        className="w-80 p-0 max-h-[500px] overflow-hidden"
      >
        <div className="px-4 py-3 border-b border-border bg-muted/50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-sm">Notificaciones</h3>
              {unreadCount > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  {unreadCount} {unreadCount === 1 ? 'notificación sin leer' : 'notificaciones sin leer'}
                </p>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-primary hover:underline"
              >
                Marcar como leídas
              </button>
            )}
          </div>
        </div>

        <div className="overflow-y-auto max-h-[400px]">
          {isLoading ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              Cargando notificaciones...
            </div>
          ) : notifications.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Aún no hay notificaciones</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onClick={handleNotificationClick}
              />
            ))
          )}
        </div>

        {notifications.length > 0 && hasMore && (
          <div className="px-4 py-2 border-t border-border bg-muted/50 text-center">
            <button
              onClick={loadMore}
              disabled={isLoadingMore}
              className="text-xs text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Cargando...
                </>
              ) : (
                'Cargar más notificaciones'
              )}
            </button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
