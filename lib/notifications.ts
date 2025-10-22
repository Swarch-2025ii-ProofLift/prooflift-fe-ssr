export type NotificationType = 'COMMENT_CREATED' | 'REACTION_ADDED';

export interface Notification {
  id: string;
  user_id: string;
  actor_id: string;
  post_id: string;
  type: NotificationType;
  comment_id?: string;
  message: string;
  is_read: boolean;
  created_at: string;
  read_at?: string;
}

export interface NotificationsResponse {
  data?: {
    notifications: Notification[];
    limit: number;
    offset: number;
  };
  notifications?: Notification[];
  limit?: number;
  offset?: number;
}

export async function fetchNotificationsClient(
  limit: number = 20,
  offset: number = 0
): Promise<NotificationsResponse> {
  const url = new URL('/api/notifications', window.location.origin);
  url.searchParams.append('limit', limit.toString());
  url.searchParams.append('offset', offset.toString());

  const response = await fetch(url.toString(), {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch notifications: ${response.status} ${errorText}`);
  }

  return response.json();
}


export async function markNotificationAsReadClient(notificationId: string): Promise<void> {
  const response = await fetch(
    `/api/notifications/${notificationId}/read`,
    {
      method: 'PUT',
      credentials: 'include',
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to mark notification as read: ${response.status} ${errorText}`);
  }
}


export async function markAllNotificationsAsReadClient(): Promise<void> {
  const response = await fetch(
    '/api/notifications/read-all',
    {
      method: 'PUT',
      credentials: 'include',
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to mark all notifications as read: ${response.status} ${errorText}`);
  }
}
