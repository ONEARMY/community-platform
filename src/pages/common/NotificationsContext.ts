import { createContext } from 'react'

import type { Notification } from 'oa-shared'

type INotificationsContext = {
  notifications: Notification[] | null
  isUpdatingNotifications: boolean
  updateNotifications?: () => void
}

export const NotificationsContext = createContext<INotificationsContext>({
  notifications: null,
  isUpdatingNotifications: false,
})
