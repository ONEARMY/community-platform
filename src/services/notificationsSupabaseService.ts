import type { NotificationDisplay } from 'oa-shared';

const getNotifications = async () => {
  try {
    const response = await fetch('/api/notifications');
    const result = (await response.json()) as {
      notifications: NotificationDisplay[];
    };

    return result.notifications;
  } catch (error) {
    console.error(error);
  }
  return [];
};

export const notificationSupabaseService = {
  getNotifications,
};
