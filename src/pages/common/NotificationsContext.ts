import { createContext } from 'react';

import type { NotificationDisplay } from 'oa-shared';

type INotificationsContext = {
  notifications: NotificationDisplay[] | null;
  isUpdatingNotifications: boolean;
  updateNotifications?: () => void;
};

export const NotificationsContext = createContext<INotificationsContext>({
  notifications: null,
  isUpdatingNotifications: false,
});
