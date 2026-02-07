import type { NotificationDisplay } from 'oa-shared';
import { createContext } from 'react';

type INotificationsContext = {
  notifications: NotificationDisplay[] | null;
  isUpdatingNotifications: boolean;
  updateNotifications?: () => void;
};

export const NotificationsContext = createContext<INotificationsContext>({
  notifications: null,
  isUpdatingNotifications: false,
});
