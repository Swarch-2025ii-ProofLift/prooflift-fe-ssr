'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  Notification,
  fetchNotificationsClient,
  markNotificationAsReadClient,
  markAllNotificationsAsReadClient,
} from '@/lib/notifications';

interface NotificationContextValue {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const limit = 20;
      const response = await fetchNotificationsClient(limit, 0);

      const notificationsData = response.data?.notifications || response.notifications || [];
      setNotifications(notificationsData);
      setOffset(limit);
      setHasMore(notificationsData.length === limit);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch notifications';
      setError(errorMessage);
      setNotifications([]);
      console.error('Error fetching notifications:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;

    try {
      setIsLoadingMore(true);
      setError(null);
      const limit = 20;
      const response = await fetchNotificationsClient(limit, offset);

      const notificationsData = response.data?.notifications || response.notifications || [];

      setNotifications((prev) => [...prev, ...notificationsData]);
      setOffset((prev) => prev + limit);
      setHasMore(notificationsData.length === limit);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load more notifications';
      setError(errorMessage);
      console.error('Error loading more notifications:', err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [offset, isLoadingMore, hasMore]);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await markNotificationAsReadClient(notificationId);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, is_read: true, read_at: new Date().toISOString() }
            : notification
        )
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
      await refresh();
    }
  }, [refresh]);

  const markAllAsRead = useCallback(async () => {
    try {
      await markAllNotificationsAsReadClient();

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          is_read: true,
          read_at: new Date().toISOString(),
        }))
      );
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      await refresh();
    }
  }, [refresh]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const interval = setInterval(() => {
      refresh();
    }, 30000);

    return () => clearInterval(interval);
  }, [refresh]);

  const unreadCount = (notifications || []).filter((n) => !n.is_read).length;

  const value: NotificationContextValue = {
    notifications,
    unreadCount,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    refresh,
    loadMore,
    markAsRead,
    markAllAsRead,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
