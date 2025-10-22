'use client';

import { MessageCircle, Heart } from 'lucide-react';
import { Notification } from '@/lib/notifications';
import { useRelativeTime } from '@/lib/hooks/useRelativeTime';
import { useUserName } from '@/lib/hooks/useUserName';

interface NotificationItemProps {
  notification: Notification;
  onClick: (notification: Notification) => void;
}

export function NotificationItem({ notification, onClick }: NotificationItemProps) {
  const relativeTime = useRelativeTime(notification.created_at);
  const { userName: actorName } = useUserName(notification.actor_id);

  const getNotificationIcon = () => {
    switch (notification.type) {
      case 'COMMENT_CREATED':
        return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case 'REACTION_ADDED':
        return <Heart className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getNotificationMessage = () => {
    switch (notification.type) {
      case 'COMMENT_CREATED':
        return 'comentó tu publicación';
      case 'REACTION_ADDED':
        return 'reaccionó a tu publicación';
      default:
        return notification.message;
    }
  };

  return (
    <button
      onClick={() => onClick(notification)}
      className={`w-full text-left px-4 py-3 hover:bg-accent transition-colors border-b border-border last:border-b-0 ${
        !notification.is_read ? 'bg-green-50 dark:bg-green-950/20' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-1 flex-shrink-0">
          {getNotificationIcon()}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm">
            <span className="font-semibold">{actorName || 'Someone'}</span>
            {' '}
            <span className="text-muted-foreground">{getNotificationMessage()}</span>
          </p>

          <p className="text-xs text-muted-foreground mt-1">
            {relativeTime}
          </p>
        </div>

        {!notification.is_read && (
          <div className="flex-shrink-0 mt-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
          </div>
        )}
      </div>
    </button>
  );
}
